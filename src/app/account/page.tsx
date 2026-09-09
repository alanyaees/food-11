import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AccountCard, AccountShell, DemoNotice } from "@/components/account/account-shell";
import { AuthCard, AuthScreen } from "@/components/account/auth-card";
import { AuthTabs } from "@/components/account/auth-tabs";
import { ProfileForm } from "@/components/account/profile-form";
import { SignOutButton } from "@/components/account/sign-out-button";
import { Button } from "@/components/ui/button";
import { hasSupabase } from "@/lib/env";
import { createSupabaseServerClient, getCurrentProfile } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your account",
  description: "Orders, subscriptions and delivery details for your FULL. account.",
  robots: { index: false, follow: false },
};

/** Signed-in state depends on cookies, so this page is always dynamic. */
export const dynamic = "force-dynamic";

interface DashboardData {
  orderCount: number;
  lastOrderTotalCents: number | null;
  lastOrderDate: string | null;
  subscriptionCount: number;
  hasAddress: boolean;
  phone: string;
}

async function loadDashboard(userId: string): Promise<DashboardData> {
  const empty: DashboardData = {
    orderCount: 0,
    lastOrderTotalCents: null,
    lastOrderDate: null,
    subscriptionCount: 0,
    hasAddress: false,
    phone: "",
  };

  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return empty;

    const [orders, subscriptions, profile] = await Promise.all([
      supabase
        .from("orders")
        .select("total_cents, created_at", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("subscriptions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("status", ["active", "paused", "past_due"]),
      supabase.from("profiles").select("phone, shipping_address").eq("id", userId).maybeSingle(),
    ]);

    const latest = (orders.data as { total_cents: number; created_at: string }[] | null)?.[0];
    const profileRow = profile.data as {
      phone: string | null;
      shipping_address: unknown;
    } | null;

    return {
      orderCount: orders.count ?? 0,
      lastOrderTotalCents: latest?.total_cents ?? null,
      lastOrderDate: latest?.created_at ?? null,
      subscriptionCount: subscriptions.count ?? 0,
      hasAddress: Boolean(profileRow?.shipping_address),
      phone: profileRow?.phone ?? "",
    };
  } catch {
    return empty;
  }
}

function firstName(fullName: string | null, email: string | null) {
  const name = fullName?.trim();
  if (name) return name.split(/\s+/)[0];
  const local = email?.split("@")[0];
  if (!local) return "there";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const profile = await getCurrentProfile();

  /* ── Signed out, or Supabase not configured ────────────────── */
  if (!profile) {
    return (
      <AuthScreen>
        <AuthCard
          kicker="Your account"
          title="Sign in, or start one."
          intro={
            <>
              One account keeps your orders, your subscription and your box in one place. It takes
              about twenty seconds to make.
            </>
          }
          footer={
            !hasSupabase ? (
              <DemoNotice title="Accounts are in demo mode">
                Supabase isn&apos;t configured on this deployment, so nothing is stored and no email
                is sent. The shop, cart and checkout still work end to end. Add{" "}
                <code className="num text-[0.75rem] text-ink">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="num text-[0.75rem] text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                to switch real accounts on.
              </DemoNotice>
            ) : (
              <p className="text-xs leading-relaxed text-fg-subtle">
                Trouble getting in? Reach us at{" "}
                <Link href="/contact" className="link-underline text-fg-muted">
                  our contact page
                </Link>{" "}
                and we&apos;ll sort it.
              </p>
            )
          }
        >
          <AuthTabs defaultTab={tab === "sign-up" ? "sign-up" : "sign-in"} />
        </AuthCard>
      </AuthScreen>
    );
  }

  /* ── Signed in ─────────────────────────────────────────────── */
  const data = await loadDashboard(profile.id);
  const dateFormatter = new Intl.DateTimeFormat("en-IE", { dateStyle: "medium" });

  return (
    <AccountShell
      activeHref="/account"
      title={`Hello, ${firstName(profile.fullName, profile.email)}`}
      description={
        <>
          Everything about your {profile.email ? <strong>{profile.email}</strong> : "FULL."} account
          lives here.
        </>
      }
      action={<SignOutButton />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <AccountCard
          title="Orders"
          href="/account/orders"
          meta={data.orderCount > 0 ? `${data.orderCount}` : undefined}
          description={
            data.orderCount === 0
              ? "No orders yet. Your first one will appear here the moment it's paid."
              : `Last order ${
                  data.lastOrderDate ? dateFormatter.format(new Date(data.lastOrderDate)) : ""
                }${
                  data.lastOrderTotalCents != null
                    ? ` · ${formatPrice(data.lastOrderTotalCents)}`
                    : ""
                }`
          }
        >
          <span className="inline-flex items-center gap-1 text-sm font-semibold tracking-tight text-ink">
            View order history
            <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        </AccountCard>

        <AccountCard
          title="Subscriptions"
          meta={data.subscriptionCount > 0 ? `${data.subscriptionCount}` : undefined}
          description={
            data.subscriptionCount === 0
              ? "No subscription running. Subscribing saves 15% on every box and you can pause any time."
              : "Active. Manage the interval, pause or skip a delivery."
          }
        >
          <Button href="/build-a-box?plan=subscribe" variant="outline" size="sm">
            {data.subscriptionCount === 0 ? "Build a subscription" : "Change your box"}
          </Button>
        </AccountCard>

        <AccountCard
          title="Addresses"
          description={
            data.hasAddress
              ? "Your delivery address is saved and used at checkout."
              : "No address saved yet. We'll store the one you use at your first checkout."
          }
        >
          <p className="text-xs leading-relaxed text-fg-subtle">
            Addresses are captured by Stripe Checkout so card and delivery details never touch our
            servers.
          </p>
        </AccountCard>

        <AccountCard title="Profile" description="Your name, contact number and email preferences.">
          <ProfileForm
            fullName={profile.fullName ?? ""}
            phone={data.phone}
            marketingOptIn={profile.marketingOptIn}
            email={profile.email ?? ""}
          />
        </AccountCard>
      </div>
    </AccountShell>
  );
}
