import "server-only";

/**
 * Which integrations are wired up — server side only.
 *
 * This module never exports a secret, only booleans derived from one.
 * `import "server-only"` makes an accidental client import a build
 * error rather than a leak. Client components that need to know
 * whether Supabase exists import `@/lib/env.public` instead, which is
 * limited to NEXT_PUBLIC_* values.
 *
 * Side-effect free: reading `process.env` is all that happens here, so
 * importing this module can never break a render.
 */

const present = (value: string | undefined | null): boolean =>
  typeof value === "string" && value.trim().length > 0;

/** Anon-key Supabase access: reads, auth, owner-scoped writes. */
export const hasSupabase =
  present(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  present(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Service-role access: webhook writes, storage uploads, asset audit rows. */
export const hasSupabaseAdmin = hasSupabase && present(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const hasStripe = present(process.env.STRIPE_SECRET_KEY);

/** Signature verification for /api/stripe/webhook. */
export const hasStripeWebhookSecret = present(process.env.STRIPE_WEBHOOK_SECRET);

export const hasOpenAI = present(process.env.OPENAI_API_KEY);

export const isProduction = process.env.NODE_ENV === "production";

export const isDevelopment = process.env.NODE_ENV === "development";

/** Emails allowed into /admin/*. Lower-cased and de-duplicated. */
export const adminEmails: string[] = Array.from(
  new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  ),
);

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

/** Public Supabase Storage bucket used for generated brand imagery. */
export const assetBucket = process.env.SUPABASE_ASSET_BUCKET?.trim() || "brand-assets";

export const openAiImageModel = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";

export interface IntegrationStatus {
  id: "supabase" | "supabase-admin" | "stripe" | "stripe-webhook" | "openai" | "admin-emails";
  label: string;
  configured: boolean;
  /** What happens while it is missing, and how to switch it on. */
  hint: string;
}

export function integrationStatus(): IntegrationStatus[] {
  return [
    {
      id: "supabase",
      label: "Supabase (database + auth)",
      configured: hasSupabase,
      hint: hasSupabase
        ? "Catalogue, accounts and carts read from Postgres."
        : "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Until then the site serves the bundled seed catalogue and accounts run in demo mode.",
    },
    {
      id: "supabase-admin",
      label: "Supabase service role",
      configured: hasSupabaseAdmin,
      hint: hasSupabaseAdmin
        ? "Webhook writes and asset uploads are enabled."
        : "Set SUPABASE_SERVICE_ROLE_KEY to persist orders from Stripe and store generated images.",
    },
    {
      id: "stripe",
      label: "Stripe payments",
      configured: hasStripe,
      hint: hasStripe
        ? "Checkout creates real Stripe Checkout Sessions."
        : "Set STRIPE_SECRET_KEY. Until then checkout completes as a clearly-labelled demo.",
    },
    {
      id: "stripe-webhook",
      label: "Stripe webhook secret",
      configured: hasStripeWebhookSecret,
      hint: hasStripeWebhookSecret
        ? "Incoming webhook signatures are verified."
        : "Set STRIPE_WEBHOOK_SECRET, otherwise webhook events are acknowledged but ignored.",
    },
    {
      id: "openai",
      label: "OpenAI images",
      configured: hasOpenAI,
      hint: hasOpenAI
        ? "The image studio can generate new brand photography."
        : "Set OPENAI_API_KEY to generate imagery. The site itself never calls OpenAI at request time.",
    },
    {
      id: "admin-emails",
      label: "Admin allow-list",
      configured: adminEmails.length > 0,
      hint:
        adminEmails.length > 0
          ? `${adminEmails.length} email${adminEmails.length === 1 ? "" : "s"} may access /admin.`
          : "Set ADMIN_EMAILS before deploying. In production an empty list locks /admin for everyone.",
    },
  ];
}
