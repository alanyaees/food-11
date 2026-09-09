import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { hasStripeWebhookSecret } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe webhook receiver.
 *
 * Contract with Stripe: acknowledge fast and never crash. Every failure
 * that is ours (missing service-role key, a database hiccup) returns 200
 * with a note, because retrying will not fix it and a retry storm helps
 * nobody. Only a bad signature returns 400.
 *
 * Needs the Node runtime and the raw, unparsed body for signature
 * verification.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ok = (note: string) => NextResponse.json({ received: true, note });

/** Stripe moved period fields between the Subscription and its items. */
function periodEndOf(subscription: Stripe.Subscription): string | null {
  const direct = (subscription as unknown as { current_period_end?: number }).current_period_end;
  const viaItem = (
    subscription.items?.data?.[0] as unknown as { current_period_end?: number } | undefined
  )?.current_period_end;
  const seconds = direct ?? viaItem;
  return typeof seconds === "number" ? new Date(seconds * 1000).toISOString() : null;
}

function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

const subscriptionStatusMap: Record<string, string> = {
  active: "active",
  trialing: "active",
  paused: "paused",
  past_due: "past_due",
  unpaid: "past_due",
  canceled: "cancelled",
  incomplete: "incomplete",
  incomplete_expired: "cancelled",
};

/* ─── Handlers ────────────────────────────────────────────────── */

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  const admin = getSupabaseAdminClient();
  if (!admin) return;

  const metadata = session.metadata ?? {};
  const userId = metadata.user_id || session.client_reference_id || null;

  const orderRow = {
    user_id: userId && userId.length > 0 ? userId : null,
    email: session.customer_details?.email ?? session.customer_email ?? null,
    status: session.payment_status === "paid" ? "paid" : "pending",
    currency: (session.currency ?? "eur").toUpperCase(),
    subtotal_cents: Number(metadata.subtotal_cents ?? session.amount_subtotal ?? 0),
    discount_cents: Number(metadata.discount_cents ?? 0),
    shipping_cents: Number(metadata.shipping_cents ?? 0),
    total_cents: Number(session.amount_total ?? metadata.total_cents ?? 0),
    promo_code: metadata.promo_code || null,
    meal_count: Number(metadata.meal_count ?? 0),
    protein_total: Number(metadata.protein_total ?? 0),
    shipping_address: session.customer_details?.address ?? null,
    stripe_session_id: session.id,
    stripe_payment_intent_id: idOf(session.payment_intent),
    stripe_customer_id: idOf(session.customer),
  };

  const { data, error } = await admin
    .from("orders")
    .upsert(orderRow, { onConflict: "stripe_session_id" })
    .select("id")
    .single();

  if (error || !data) return;
  const orderId = (data as { id: string }).id;

  // Rebuild the basket from what Stripe actually charged.
  let lineItems: Stripe.ApiList<Stripe.LineItem> | null = null;
  try {
    lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ["data.price.product"],
    });
  } catch {
    lineItems = null;
  }

  if (!lineItems) return;

  const rows = lineItems.data.map((item) => {
    const product = item.price?.product;
    const productMeta =
      product && typeof product === "object" && "metadata" in product
        ? ((product.metadata ?? {}) as Record<string, string>)
        : {};
    const quantity = item.quantity ?? 1;

    return {
      order_id: orderId,
      slug: productMeta.slug ?? null,
      name: item.description ?? "Item",
      kind: productMeta.kind === "box" ? "box" : "meal",
      mode: item.price?.recurring ? "subscription" : "one-time",
      unit_price_cents: Math.round((item.amount_total ?? 0) / Math.max(1, quantity)),
      quantity,
    };
  });

  if (rows.length === 0) return;

  await admin.from("order_items").delete().eq("order_id", orderId);
  await admin.from("order_items").insert(rows);
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const admin = getSupabaseAdminClient();
  if (!admin) return;

  const metadataUserId = subscription.metadata?.user_id;
  const customerId = idOf(subscription.customer);

  // Fall back to the profile that owns this Stripe customer.
  let userId: string | null = metadataUserId && metadataUserId.length > 0 ? metadataUserId : null;
  if (!userId && customerId) {
    const { data } = await admin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    userId = (data as { id: string } | null)?.id ?? null;
  }

  const amount = subscription.items?.data?.[0]?.price?.unit_amount ?? 0;
  const quantity = subscription.items?.data?.[0]?.quantity ?? 1;

  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      status: subscriptionStatusMap[subscription.status] ?? "incomplete",
      currency: (subscription.items?.data?.[0]?.price?.currency ?? "eur").toUpperCase(),
      amount_cents: amount * quantity,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      current_period_end: periodEndOf(subscription),
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      items: subscription.items?.data?.map((item) => ({
        price_id: item.price?.id ?? null,
        quantity: item.quantity ?? 1,
      })) ?? [],
    },
    { onConflict: "stripe_subscription_id" },
  );
}

/* ─── Route ───────────────────────────────────────────────────── */

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !hasStripeWebhookSecret) {
    return ok("Stripe is not configured on this deployment; the event was ignored.");
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Signature verification failed." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutCompleted(stripe, event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        await handleSubscriptionChange(event.data.object);
        break;

      default:
        return ok(`Unhandled event type: ${event.type}`);
    }
  } catch {
    // The signature was valid, so the event is genuine. Swallowing our
    // own failure keeps Stripe from retrying something that will keep
    // failing; the dashboard remains the source of truth.
    return ok("Event received but could not be persisted.");
  }

  return ok("Handled.");
}

export function GET() {
  return NextResponse.json(
    { error: "Use POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
