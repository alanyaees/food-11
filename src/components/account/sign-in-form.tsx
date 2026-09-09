"use client";

import Link from "next/link";
import { useState } from "react";
import { sendMagicLinkAction, signInAction } from "@/app/account/actions";
import { AuthForm } from "./auth-form";
import { TextField } from "./field";

/**
 * Password sign-in with a magic-link fallback for anyone who never set
 * a password (or forgot they did).
 */
export function SignInForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [mode, setMode] = useState<"password" | "link">("password");

  if (mode === "link") {
    return (
      <AuthForm
        key="magic-link"
        action={sendMagicLinkAction}
        submitLabel="Email me a sign-in link"
        pendingLabel="Sending…"
        footer={
          <button
            type="button"
            onClick={() => setMode("password")}
            className="link-underline text-sm font-medium text-ink"
          >
            Use a password instead
          </button>
        }
      >
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          defaultValue={defaultEmail}
          placeholder="you@email.com"
          hint="We'll send a one-tap link. No password needed."
        />
      </AuthForm>
    );
  }

  return (
    <AuthForm
      key="password"
      action={signInAction}
      submitLabel="Sign in"
      pendingLabel="Signing in…"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <button
            type="button"
            onClick={() => setMode("link")}
            className="link-underline font-medium text-ink"
          >
            Email me a link instead
          </button>
          <Link href="/account/forgot-password" className="link-underline text-fg-muted">
            Forgot password?
          </Link>
        </div>
      }
    >
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        defaultValue={defaultEmail}
        placeholder="you@email.com"
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />
    </AuthForm>
  );
}
