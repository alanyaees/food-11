import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseAdmin } from "@/lib/env";

/**
 * Service-role Supabase client. Bypasses RLS — never expose it to a
 * request the user controls without checking authorisation first.
 *
 * Used by exactly three code paths:
 *   • the Stripe webhook, writing orders and subscriptions
 *   • the image studio, uploading assets and recording generated_assets
 *   • the newsletter/contact endpoints, writing rows nobody may read
 *
 * Returns `null` when SUPABASE_SERVICE_ROLE_KEY is absent so callers can
 * acknowledge-and-skip rather than crash.
 */

let cached: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!hasSupabaseAdmin) return null;
  if (cached) return cached;

  cached = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { "X-Client-Info": "full-admin" } },
    },
  );
  return cached;
}
