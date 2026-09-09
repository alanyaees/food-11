import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DemoNotice } from "@/components/account/account-shell";
import { authErrorFor } from "@/components/account/auth-errors";
import { AuthCard, AuthScreen } from "@/components/account/auth-card";
import { SignInForm } from "@/components/account/sign-in-form";
import { hasSupabase } from "@/lib/env";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your FULL. account.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  const { error } = await searchParams;
  const linkError = authErrorFor(error);

  return (
    <AuthScreen>
      <AuthCard
        kicker="Welcome back"
        title="Sign in."
        intro="Your orders, your subscription and your saved box — right where you left them."
        footer={
          <div className="space-y-4">
            <p className="text-sm text-fg-muted">
              No account yet?{" "}
              <Link href="/account/sign-up" className="link-underline font-semibold text-ink">
                Create one
              </Link>
              .
            </p>
            {!hasSupabase ? (
              <DemoNotice title="Accounts are in demo mode">
                Supabase isn&apos;t configured on this deployment, so sign-in returns a demo message
                rather than creating a session. Everything else on the site works.
              </DemoNotice>
            ) : null}
          </div>
        }
      >
        {linkError ? (
          <DemoNotice title={linkError.title} tone="warning" className="mb-6">
            {linkError.body}
          </DemoNotice>
        ) : null}
        <SignInForm />
      </AuthCard>
    </AuthScreen>
  );
}
