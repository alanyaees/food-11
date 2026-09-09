import "server-only";

import { adminEmails, isProduction } from "@/lib/env";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Access control for /admin/*.
 *
 * Production: an authenticated Supabase user whose email appears in
 * ADMIN_EMAILS. An empty allow-list therefore locks admin for everyone,
 * which is the safe default.
 *
 * Development: open, but flagged with `devUnlocked` so the UI can say so
 * loudly. Nothing here is a substitute for the fact that /admin must not
 * be reachable on a public deployment without the allow-list set.
 */

export interface AdminAccess {
  allowed: boolean;
  /** True when access was granted only because this is a dev machine. */
  devUnlocked: boolean;
  email: string | null;
  userId: string | null;
  /** Why access was refused, safe to show a human. */
  reason: string | null;
}

const DENIED_SIGNED_OUT =
  "Sign in with an account on the admin allow-list to open the image studio.";
const DENIED_NOT_LISTED = "This account is not on the admin allow-list (ADMIN_EMAILS).";
const DENIED_NO_LIST =
  "ADMIN_EMAILS is empty, so no account can access admin tools on this deployment.";

export async function requireAdmin(): Promise<AdminAccess> {
  const user = await getCurrentUser();
  const email = user?.email?.toLowerCase() ?? null;
  const listed = email !== null && adminEmails.includes(email);

  if (listed) {
    return { allowed: true, devUnlocked: false, email, userId: user?.id ?? null, reason: null };
  }

  if (!isProduction) {
    return {
      allowed: true,
      devUnlocked: true,
      email,
      userId: user?.id ?? null,
      reason: null,
    };
  }

  return {
    allowed: false,
    devUnlocked: false,
    email,
    userId: user?.id ?? null,
    reason: adminEmails.length === 0 ? DENIED_NO_LIST : user ? DENIED_NOT_LISTED : DENIED_SIGNED_OUT,
  };
}

/** Same check, for route handlers. Kept separate so intent reads clearly. */
export async function isAdminRequest(): Promise<AdminAccess> {
  return requireAdmin();
}
