import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DemoNotice } from "@/components/account/account-shell";
import { AuthCard, AuthScreen } from "@/components/account/auth-card";
import { SignUpForm } from "@/components/account/sign-up-form";
import { hasSupabase } from "@/lib/env";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a FULL. account to track orders and manage your subscription.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <AuthScreen>
      <AuthCard
        kicker="New here"
        title="Create your account."
        intro="Faster checkout, order history, and a subscription you can pause whenever you like."
        footer={
          <div className="space-y-4">
            <p className="text-sm text-fg-muted">
              Already have one?{" "}
              <Link href="/account/sign-in" className="link-underline font-semibold text-ink">
                Sign in
              </Link>
              .
            </p>
            {!hasSupabase ? (
              <DemoNotice title="Accounts are in demo mode">
                Supabase isn&apos;t configured on this deployment, so no account is created and no
                confirmation email is sent.
              </DemoNotice>
            ) : null}
          </div>
        }
      >
        <SignUpForm />
      </AuthCard>
    </AuthScreen>
  );
}
