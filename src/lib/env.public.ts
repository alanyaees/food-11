/**
 * Client-safe half of `@/lib/env`.
 *
 * Only NEXT_PUBLIC_* variables are read here, so this module is safe to
 * import from a "use client" component. Anything derived from a secret
 * lives in `@/lib/env`, which is marked server-only.
 */

const present = (value: string | undefined): boolean =>
  typeof value === "string" && value.trim().length > 0;

/** True when the browser has enough config to talk to Supabase. */
export const hasSupabasePublic =
  present(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  present(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** True when Stripe.js can be initialised in the browser. */
export const hasStripePublic = present(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const publicSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
