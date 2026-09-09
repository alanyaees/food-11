import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { boxFixedPriceCents, boxSizes } from "@/lib/products";
import { SUBSCRIPTION_DISCOUNT, computeTotals } from "@/lib/cart";
import { brand } from "@/lib/brand";
import { hasStripe, siteUrl } from "@/lib/env";
import { clientIdentifier, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { getStripe, stripeCurrency } from "@/lib/stripe";
import { fetchProductMap } from "@/lib/supabase/products";
import { getCurrentUser } from "@/lib/supabase/server";
import type { CartItem, FlavorAccent } from "@/lib/types";

/**
 * Creates a Stripe Checkout Session.
 *
 * Prices are recomputed from the server-side catalogue for every line —
 * `unitPriceCents` from the client is parsed for shape and then thrown
 * away. A tampered cart cannot change what the customer is charged.
 *
 * With Stripe unconfigured the endpoint still returns 200 with
 * `demo: true` so the storefront can complete a polished, clearly
 * labelled demo checkout.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const accents: [FlavorAccent, ...FlavorAccent[]] = [
  "cheddar",
  "jalapeno",
  "tomato",
  "truffle",
  "garlic",
  "chili",
];

const cartItemSchema = z.object({
  key: z.string().min(1).max(240),
  slug: z.string().min(1).max(160),
  name: z.string().min(1).max(200),
  line: z.string().max(80).default(""),
  flavor: z.string().max(80).default(""),
  accent: z.enum(accents).default("cheddar"),
  unitPriceCents: z.number().int().min(0).max(1_000_000),
  quantity: z.number().int().min(1).max(99),
  mode: z.enum(["one-time", "subscription"]),
  protein: z.number().min(0).max(10_000).default(0),
  calories: z.number().min(0).max(100_000).default(0),
  kind: z.enum(["meal", "box"]),
  meta: z
    .object({
      boxContents: z
        .array(
          z.object({
            slug: z.string().min(1).max(160),
            name: z.string().min(1).max(200),
            quantity: z.number().int().min(1).max(60),
          }),
        )
        .max(30)
        .optional(),
      boxSize: z.number().int().min(1).max(60).optional(),
    })
    .optional(),
});

const bodySchema = z.object({
  items: z.array(cartItemSchema).min(1, "Your cart is empty.").max(50),
  promoCode: z.string().max(40).nullish(),
  mode: z.enum(["payment", "subscription"]),
  // An untouched optional field arrives as "", which is not an error.
  email: z
    .union([z.email().max(200), z.literal("")])
    .nullish()
    .transform((value) => value || undefined),
});

function json(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

/**
 * Failures carry the same sentence under both `error` and `message`:
 * the storefront reads `message`, and other callers expect `error`.
 */
function failure(text: string, status: number) {
  return json({ ok: false, error: text, message: text }, { status });
}

/** Box discount for a given size, from the shared pricing table. */
function boxDiscountFor(size: number | undefined): number {
  if (!size) return 0;
  const match = boxSizes.find((entry) => entry.size === size);
  return match?.discount ?? 0;
}

export async function POST(request: Request) {
  const limit = rateLimit({
    key: `checkout:${clientIdentifier(request)}`,
    limit: 12,
    windowMs: 60_000,
  });
  if (!limit.success) {
    const text = "Too many checkout attempts. Wait a moment and try again.";
    return json(
      { ok: false, error: text, message: text },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return failure("Expected a JSON body.", 400);
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "That cart doesn't look right.",
      400,
    );
  }

  const { items, promoCode, mode, email } = parsed.data;

  /* ── Reprice everything from the catalogue ─────────────────── */

  const catalogue = await fetchProductMap();
  const trusted: CartItem[] = [];
  const rejected: string[] = [];

  for (const item of items) {
    if (item.kind === "box") {
      const contents = item.meta?.boxContents ?? [];
      if (contents.length === 0) {
        rejected.push(item.name);
        continue;
      }

      let gross = 0;
      let protein = 0;
      let calories = 0;
      let mealCount = 0;
      let unknownContent = false;

      for (const entry of contents) {
        const product = catalogue.get(entry.slug);
        if (!product) {
          unknownContent = true;
          break;
        }
        gross += product.priceCents * entry.quantity;
        protein += product.nutrition.protein * entry.quantity;
        calories += product.nutrition.calories * entry.quantity;
        mealCount += entry.quantity;
      }
      if (unknownContent) {
        rejected.push(item.name);
        continue;
      }

      const boxSize = item.meta?.boxSize ?? mealCount;
      const fixedPrice = boxFixedPriceCents(boxSize);
      if (fixedPrice != null && mealCount !== boxSize) {
        rejected.push(item.name);
        continue;
      }
      const afterBox = fixedPrice ?? gross * (1 - boxDiscountFor(boxSize));
      const unitPriceCents = Math.round(
        fixedPrice != null
          ? fixedPrice
          : item.mode === "subscription"
            ? afterBox * (1 - SUBSCRIPTION_DISCOUNT)
            : afterBox,
      );

      trusted.push({
        key: item.key,
        slug: item.slug,
        name: item.name,
        line: item.line,
        flavor: item.flavor,
        accent: item.accent,
        unitPriceCents,
        quantity: item.quantity,
        mode: item.mode,
        protein,
        calories,
        kind: "box",
        meta: { boxContents: contents, boxSize },
      });
      continue;
    }

    const product = catalogue.get(item.slug);
    if (!product) {
      rejected.push(item.name);
      continue;
    }

    const unitPriceCents = Math.round(
      item.mode === "subscription"
        ? product.priceCents * (1 - SUBSCRIPTION_DISCOUNT)
        : product.priceCents,
    );

    trusted.push({
      key: item.key,
      slug: product.slug,
      name: product.name,
      line: product.line,
      flavor: product.flavor,
      accent: product.accent,
      unitPriceCents,
      quantity: item.quantity,
      mode: item.mode,
      protein: product.nutrition.protein,
      calories: product.nutrition.calories,
      kind: "meal",
      meta: undefined,
    });
  }

  if (trusted.length === 0) {
    return failure(
      "We couldn't match anything in your cart to the current menu. Try adding it again.",
      409,
    );
  }

  const totals = computeTotals(trusted, promoCode ?? null);
  const currency = stripeCurrency(brand.currency.code);

  /* ── Demo mode ─────────────────────────────────────────────── */

  const stripe = getStripe();
  if (!stripe || !hasStripe) {
    return json(
      {
        ok: true,
        demo: true,
        redirectUrl: "/checkout/success?demo=1",
        url: "/checkout/success?demo=1",
        totals,
        rejected,
        message:
          "Stripe isn't configured on this deployment, so no payment was taken. The order flow is a demonstration.",
      },
      { headers: rateLimitHeaders(limit) },
    );
  }

  /* ── Real Stripe Checkout Session ──────────────────────────── */

  const user = await getCurrentUser();
  const recurring: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring | undefined =
    mode === "subscription" ? { interval: "month" } : undefined;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = trusted.map((item) => {
    const product = catalogue.get(item.slug);

    // Pre-created Prices are only safe for one-off single meals: a box
    // is priced dynamically, and a subscription needs a recurring Price.
    if (
      mode === "payment" &&
      item.kind === "meal" &&
      item.mode === "one-time" &&
      product?.stripePriceId
    ) {
      return { price: product.stripePriceId, quantity: item.quantity };
    }

    return {
      quantity: item.quantity,
      price_data: {
        currency,
        unit_amount: item.unitPriceCents,
        ...(recurring ? { recurring } : {}),
        product_data: {
          name: item.name,
          description:
            item.kind === "box"
              ? `${item.meta?.boxSize ?? ""} meals, chosen by you`.trim()
              : `${item.line} · ${item.flavor}`,
          metadata: { slug: item.slug, kind: item.kind },
        },
      },
    };
  });

  // Exact discounts, applied once, rather than smearing rounding across
  // every line item.
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
  if (totals.discountCents > 0) {
    try {
      const coupon = await stripe.coupons.create({
        amount_off: totals.discountCents,
        currency,
        duration: "once",
        name: promoCode?.trim().toUpperCase() || "Discount",
        max_redemptions: 1,
      });
      discounts = [{ coupon: coupon.id }];
    } catch {
      discounts = undefined; // Never block a sale over a promo code.
    }
  }

  const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        display_name: totals.shippingCents === 0 ? "Free shipping" : "Standard shipping",
        fixed_amount: { amount: totals.shippingCents, currency },
      },
    },
  ];

  // Checkout metadata is not copied onto the Subscription, so the
  // webhook gets its own copy for customer.subscription.* events.
  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData | undefined =
    mode === "subscription"
      ? { metadata: { user_id: user?.id ?? "", meal_count: String(totals.mealCount) } }
      : undefined;

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      discounts,
      subscription_data: subscriptionData,
      shipping_options: shippingOptions,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      customer_email: email ?? user?.email ?? undefined,
      client_reference_id: user?.id ?? undefined,
      allow_promotion_codes: false,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["NL", "BE", "DE", "FR", "IE"] },
      metadata: {
        user_id: user?.id ?? "",
        promo_code: promoCode?.trim().toUpperCase() ?? "",
        meal_count: String(totals.mealCount),
        protein_total: String(totals.proteinTotal),
        subtotal_cents: String(totals.subtotalCents),
        discount_cents: String(totals.discountCents),
        shipping_cents: String(totals.shippingCents),
        total_cents: String(totals.totalCents),
        // Compact manifest so the webhook can rebuild order_items.
        items: trusted
          .map((item) => `${item.slug}x${item.quantity}`)
          .join(",")
          .slice(0, 480),
      },
    });

    if (!session.url) {
      return failure("Stripe did not return a checkout URL. Try again.", 502);
    }

    return json(
      {
        ok: true,
        demo: false,
        sessionId: session.id,
        redirectUrl: session.url,
        url: session.url,
        totals,
        rejected,
      },
      { headers: rateLimitHeaders(limit) },
    );
  } catch {
    return failure(
      "We couldn't start checkout with our payment provider. Try again in a moment.",
      502,
    );
  }
}

export function GET() {
  return json(
    { ok: false, error: "Use POST.", message: "Use POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
