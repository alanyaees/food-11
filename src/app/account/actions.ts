"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasSupabase, siteUrl } from "@/lib/env";
import { errorState, successState, type FormState } from "@/lib/form-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Account server actions.
 *
 * Rules of the house:
 *   • Every input is validated with zod before it reaches Supabase.
 *   • Supabase errors are translated into plain English. A raw provider
 *     message never reaches the user, and never leaks whether an email
 *     is registered.
 *   • With Supabase unconfigured every action returns a clear demo-mode
 *     message instead of failing.
 */

const DEMO_MESSAGE =
  "Accounts are in demo mode. Supabase isn't configured on this deployment, so nothing is saved — the shop, cart and checkout still work end to end.";

const emailSchema = z.email("Enter a valid email address.").trim().toLowerCase();

const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "That's longer than 72 characters.");

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Tell us what to call you.").max(80),
  email: emailSchema,
  password: passwordSchema,
  marketingOptIn: z.boolean(),
});

const emailOnlySchema = z.object({ email: emailSchema });

const resetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Both passwords need to match.",
    path: ["confirmPassword"],
  });

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Tell us what to call you.").max(80),
  phone: z
    .string()
    .trim()
    .max(32, "That phone number is too long.")
    .optional()
    .or(z.literal("")),
  marketingOptIn: z.boolean(),
});

/* ─── Helpers ─────────────────────────────────────────────────── */

function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !result[key]) result[key] = issue.message;
  }
  return result;
}

/** Translates provider errors without echoing them. */
function friendlyAuthError(raw: string): string {
  const message = raw.toLowerCase();
  if (message.includes("invalid login credentials")) {
    return "That email and password don't match an account.";
  }
  if (message.includes("email not confirmed")) {
    return "Confirm your email address first — check your inbox for the link.";
  }
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "There's already an account with that email. Try signing in instead.";
  }
  if (message.includes("weak password") || message.includes("password should be")) {
    return "That password is too easy to guess. Try a longer one.";
  }
  if (message.includes("rate limit") || message.includes("too many")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  if (message.includes("same as the old password")) {
    return "Choose a password you haven't used here before.";
  }
  return "Something went wrong on our side. Try again in a moment.";
}

const checkbox = (value: FormDataEntryValue | null) => value === "on" || value === "true";

/* ─── Sign in ─────────────────────────────────────────────────── */

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return errorState("Check the highlighted fields.", fieldErrorsOf(parsed.error));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return errorState(DEMO_MESSAGE);

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return errorState(friendlyAuthError(error.message));

  revalidatePath("/account", "layout");
  redirect("/account");
}

/* ─── Sign up ─────────────────────────────────────────────────── */

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    marketingOptIn: checkbox(formData.get("marketingOptIn")),
  });
  if (!parsed.success) {
    return errorState("Check the highlighted fields.", fieldErrorsOf(parsed.error));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return errorState(DEMO_MESSAGE);

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/account`,
      data: {
        full_name: parsed.data.fullName,
        marketing_opt_in: parsed.data.marketingOptIn,
      },
    },
  });
  if (error) return errorState(friendlyAuthError(error.message));

  // Session present means email confirmation is switched off on the project.
  if (data.session) {
    revalidatePath("/account", "layout");
    redirect("/account");
  }

  return successState(
    `Almost there — we've sent a confirmation link to ${parsed.data.email}. Open it to finish setting up your account.`,
  );
}

/* ─── Magic link (password-free fallback) ─────────────────────── */

export async function sendMagicLinkAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = emailOnlySchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return errorState("Check the highlighted fields.", fieldErrorsOf(parsed.error));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return errorState(DEMO_MESSAGE);

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/account` },
  });
  if (error) return errorState(friendlyAuthError(error.message));

  return successState(
    `Sent. If ${parsed.data.email} has an account, there's a one-tap sign-in link in the inbox.`,
  );
}

/* ─── Password reset ──────────────────────────────────────────── */

export async function requestPasswordResetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = emailOnlySchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return errorState("Check the highlighted fields.", fieldErrorsOf(parsed.error));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return errorState(DEMO_MESSAGE);

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/account/reset-password`,
  });
  // Deliberately identical copy on success and failure: this endpoint
  // must not reveal whether an email is registered.
  if (error && /rate limit|too many/i.test(error.message)) {
    return errorState("Too many attempts. Wait a minute and try again.");
  }

  return successState(
    `If ${parsed.data.email} has an account, a reset link is on its way. The link is good for one hour.`,
  );
}

export async function updatePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = resetSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return errorState("Check the highlighted fields.", fieldErrorsOf(parsed.error));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return errorState(DEMO_MESSAGE);

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return errorState(
      "This reset link has expired or has already been used. Request a new one and try again.",
    );
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return errorState(friendlyAuthError(error.message));

  revalidatePath("/account", "layout");
  redirect("/account");
}

/* ─── Profile ─────────────────────────────────────────────────── */

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone") ?? "",
    marketingOptIn: checkbox(formData.get("marketingOptIn")),
  });
  if (!parsed.success) {
    return errorState("Check the highlighted fields.", fieldErrorsOf(parsed.error));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return errorState(DEMO_MESSAGE);

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return errorState("Your session has expired. Sign in again to save changes.");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone?.trim() || null,
      marketing_opt_in: parsed.data.marketingOptIn,
    })
    .eq("id", userData.user.id);

  if (error) return errorState("We couldn't save those changes. Try again in a moment.");

  await supabase.auth.updateUser({
    data: { full_name: parsed.data.fullName, marketing_opt_in: parsed.data.marketingOptIn },
  });

  revalidatePath("/account", "layout");
  return successState("Saved.");
}

/* ─── Sign out ────────────────────────────────────────────────── */

export async function signOutAction(): Promise<void> {
  if (hasSupabase) {
    const supabase = await createSupabaseServerClient();
    await supabase?.auth.signOut();
  }
  revalidatePath("/account", "layout");
  redirect("/");
}
