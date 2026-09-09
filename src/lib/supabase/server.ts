import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { hasSupabase } from "@/lib/env";

/**
 * Request-scoped Supabase client for server components, server actions
 * and route handlers.
 *
 * A fresh client is created per request (never module-cached) so
 * sessions cannot leak between users. Returns `null` when Supabase is
 * unconfigured — every caller is expected to handle that and degrade to
 * seed data or demo mode.
 *
 * In Next 16 `cookies()` is async, hence the awaited factory.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!hasSupabase) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server components may not mutate cookies. Refreshes are
            // written by the route handlers and server actions that can.
          }
        },
      },
    },
  );
}

/**
 * The signed-in user, or `null`. Never throws: an unreachable Supabase
 * project should render a signed-out page, not a 500.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user ?? null;
  } catch {
    return null;
  }
}

export interface SessionProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string;
  marketingOptIn: boolean;
}

/** The user's profiles row, or `null` when signed out / unconfigured. */
export async function getCurrentProfile(): Promise<SessionProfile | null> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, marketing_opt_in")
      .eq("id", user.id)
      .maybeSingle();

    const row = data as {
      id: string;
      email: string | null;
      full_name: string | null;
      role: string | null;
      marketing_opt_in: boolean | null;
    } | null;

    return {
      id: user.id,
      email: row?.email ?? user.email ?? null,
      fullName:
        row?.full_name ??
        (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null),
      role: row?.role ?? "customer",
      marketingOptIn: row?.marketing_opt_in ?? false,
    };
  } catch {
    return null;
  }
}
