"use client";

import Link from "next/link";
import { signUpAction } from "@/app/account/actions";
import { AuthForm } from "./auth-form";
import { CheckboxField, TextField } from "./field";

export function SignUpForm() {
  return (
    <AuthForm
      action={signUpAction}
      submitLabel="Create account"
      pendingLabel="Creating your account…"
      footer={
        <p className="text-xs leading-relaxed text-fg-subtle">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="link-underline text-fg-muted">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="link-underline text-fg-muted">
            privacy policy
          </Link>
          .
        </p>
      }
    >
      <TextField
        name="fullName"
        label="Name"
        type="text"
        autoComplete="name"
        required
        placeholder="Alex Moreau"
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@email.com"
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="At least 8 characters"
        hint="Eight characters minimum. Longer is better than complicated."
      />
      <CheckboxField
        name="marketingOptIn"
        label="Send me the occasional email"
        description="New flavours and restocks. Roughly monthly, and one click to stop."
      />
    </AuthForm>
  );
}
