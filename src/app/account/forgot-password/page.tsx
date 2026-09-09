import type { Metadata } from "next";
import Link from "next/link";
import { DemoNotice } from "@/components/account/account-shell";
import { AuthCard, AuthScreen } from "@/components/account/auth-card";
import { ForgotPasswordForm } from "@/components/account/password-forms";
import { hasSupabase } from "@/lib/env";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your FULL. account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthScreen>
      <AuthCard
        kicker="Password"
        title="Forgot your password?"
        intro="Give us the email on the account and we'll send a link to set a new one. The link works once and expires after an hour."
        footer={
          <div className="space-y-4">
            <p className="text-sm text-fg-muted">
              Remembered it?{" "}
              <Link href="/account/sign-in" className="link-underline font-semibold text-ink">
                Back to sign in
              </Link>
              .
            </p>
            {!hasSupabase ? (
              <DemoNotice title="Accounts are in demo mode">
                Supabase isn&apos;t configured on this deployment, so no email is sent.
              </DemoNotice>
            ) : null}
          </div>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </AuthScreen>
  );
}
