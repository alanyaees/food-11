import type { Metadata } from "next";
import Link from "next/link";
import { DemoNotice } from "@/components/account/account-shell";
import { AuthCard, AuthScreen } from "@/components/account/auth-card";
import { ResetPasswordForm } from "@/components/account/password-forms";
import { hasSupabase } from "@/lib/env";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

/** Reached from the emailed link, after /auth/callback exchanges the code. */
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  return (
    <AuthScreen>
      <AuthCard
        kicker="Password"
        title="Choose a new password."
        intro={
          user
            ? `Setting a new password for ${user.email}. You'll stay signed in on this device.`
            : "Open the link from your email on this device to set a new password."
        }
        footer={
          <div className="space-y-4">
            <p className="text-sm text-fg-muted">
              Link expired?{" "}
              <Link
                href="/account/forgot-password"
                className="link-underline font-semibold text-ink"
              >
                Request a new one
              </Link>
              .
            </p>
            {!hasSupabase ? (
              <DemoNotice title="Accounts are in demo mode">
                Supabase isn&apos;t configured on this deployment, so passwords cannot be changed
                here.
              </DemoNotice>
            ) : null}
          </div>
        }
      >
        <ResetPasswordForm />
      </AuthCard>
    </AuthScreen>
  );
}
