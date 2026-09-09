import "server-only";

import Stripe from "stripe";
import { hasStripe } from "@/lib/env";

/**
 * Lazily-instantiated Stripe client.
 *
 * Returns `null` when STRIPE_SECRET_KEY is unset so checkout can fall
 * back to a clearly-labelled demo flow instead of erroring. The secret
 * is read here and nowhere else, and is never returned to a caller.
 */

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!hasStripe) return null;
  if (cached) return cached;

  cached = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // Pinning the version keeps webhook payload shapes predictable.
    appInfo: { name: "FULL. storefront", version: "0.1.0" },
    typescript: true,
  });
  return cached;
}

/** Stripe expects lower-case ISO currency codes. */
export function stripeCurrency(code: string): string {
  return code.toLowerCase();
}
