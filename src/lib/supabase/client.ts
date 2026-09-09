"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { hasSupabasePublic } from "@/lib/env.public";

/**
 * Browser Supabase client.
 *
 * Returns `null` when Supabase is not configured so callers can fall
 * back to demo behaviour instead of crashing. Only NEXT_PUBLIC_* values
 * are read — there is no secret in this file or anything it imports.
 */

let cached: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!hasSupabasePublic) return null;
  if (cached) return cached;

  cached = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return cached;
}

/** Convenience re-export so components can branch on configuration. */
export const supabaseConfigured = hasSupabasePublic;
