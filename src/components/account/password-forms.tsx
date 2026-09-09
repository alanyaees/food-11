"use client";

import { requestPasswordResetAction, updatePasswordAction } from "@/app/account/actions";
import { AuthForm } from "./auth-form";
import { TextField } from "./field";

/** Step one: ask for the reset email. */
export function ForgotPasswordForm() {
  return (
    <AuthForm
      action={requestPasswordResetAction}
      submitLabel="Send reset link"
      pendingLabel="Sending…"
    >
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@email.com"
        hint="We'll say the same thing whether or not the address has an account — that's deliberate."
      />
    </AuthForm>
  );
}

/** Step two: choose the new password, after following the emailed link. */
export function ResetPasswordForm() {
  return (
    <AuthForm action={updatePasswordAction} submitLabel="Save new password" pendingLabel="Saving…">
      <TextField
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="At least 8 characters"
      />
      <TextField
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="Type it again"
      />
    </AuthForm>
  );
}
