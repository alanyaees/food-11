import type { Metadata } from "next";
import { Package } from "lucide-react";
import { AccountShell, DemoNotice } from "@/components/account/account-shell";
import { AuthCard, AuthScreen } from "@/components/account/auth-card";
import { AuthTabs } from "@/components/account/auth-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hasSupabase } from "@/lib/env";
import { createSupabaseServerClient, getCurrentProfile } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order history",
  description: "Every FULL. order you've placed.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface OrderItemRow {
  id: string;
  name: string;
  quantity: number;
  unit_price_cents: number;
  kind: string;
}

interface OrderRow {
  id: string;
  status: string;
  total_cents: number;
  meal_count: number;
  created_at: string;
  order_items: OrderItemRow[] | null;
}

const statusTone: Record<string, "neutral" | "ink" | "ember"> = {
  pending: "neutral",
  paid: "ink",
  fulfilled: "ink",
  cancelled: "neutral",
  refunded: "ember",
};

const statusLabel: Record<string, string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  fulfilled: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

async function loadOrders(userId: string): Promise<OrderRow[]> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, status, total_cents, meal_count, created_at, order_items ( id, name, quantity, unit_price_cents, kind )",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) return [];
    return data as unknown as OrderRow[];
  } catch {
    return [];
  }
}

function EmptyState({ configured }: { configured: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-bone-100 px-6 py-16 text-center sm:py-20">
      <span className="mx-auto grid size-12 place-items-center rounded-full border border-line-strong text-fg-subtle">
        <Package className="size-5" aria-hidden />
      </span>
      <p className="font-display mt-6 text-2xl leading-tight tracking-[-0.035em] text-ink">
        No orders yet.
      </p>
      <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
        {configured
          ? "Once you've ordered, every box you've had — and everything in it — shows up here."
          : "This deployment has no database connected, so there is no order history to show. Orders appear here as soon as Supabase and Stripe are configured."}
      </p>
      <div className="mt-7">
        <Button href="/shop" size="lg">
          Browse the meals
        </Button>
      </div>
    </div>
  );
}

function OrderRowCard({ order }: { order: OrderRow }) {
  const dateFormatter = new Intl.DateTimeFormat("en-IE", { dateStyle: "medium" });
  const items = order.order_items ?? [];

  return (
    <li className="rounded-xl border border-line bg-bone-100 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="kicker text-fg-subtle">
            {dateFormatter.format(new Date(order.created_at))}
          </p>
          <p className="num mt-1.5 text-sm text-ink">#{order.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={statusTone[order.status] ?? "neutral"}>
            {statusLabel[order.status] ?? order.status}
          </Badge>
          <span className="num text-sm font-semibold text-ink">
            {formatPrice(order.total_cents)}
          </span>
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-4 text-sm">
              <span className="min-w-0 truncate text-fg-muted">
                <span className="num text-fg-subtle">{item.quantity}×</span> {item.name}
              </span>
              <span className="num shrink-0 text-fg-subtle">
                {formatPrice(item.unit_price_cents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default async function OrdersPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <AuthScreen>
        <AuthCard
          kicker="Order history"
          title="Sign in to see your orders."
          intro="Order history is tied to your account, so we need to know who you are first."
          footer={
            !hasSupabase ? (
              <DemoNotice title="Accounts are in demo mode">
                Supabase isn&apos;t configured here, so there is nothing to sign in to and no order
                history to show.
              </DemoNotice>
            ) : null
          }
        >
          <AuthTabs />
        </AuthCard>
      </AuthScreen>
    );
  }

  const orders = await loadOrders(profile.id);

  return (
    <AccountShell
      activeHref="/account/orders"
      kicker="Your account"
      title="Orders"
      description="Every box you've had from us, newest first."
    >
      {orders.length === 0 ? (
        <EmptyState configured={hasSupabase} />
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <OrderRowCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
