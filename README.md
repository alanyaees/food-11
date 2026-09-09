# FULL.

Comfort food. Re-engineered.

A production-grade Next.js storefront for a next-generation high-protein, shelf-stable meal company. Tear a pouch, add hot water, eat in minutes — mac & cheese, pasta, risotto and chili engineered around protein and fibre instead of shelf life alone.

The running site never depends on OpenAI, Supabase or Stripe being configured. Seed data, CSS/SVG packaging artwork and a labelled demo checkout keep every public route working.

---

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS 4** with a tokenised design system
- **Motion** for restrained animation (`prefers-reduced-motion` respected)
- **Supabase** for Postgres, Auth and Storage (optional)
- **Stripe Checkout** for one-time and subscription payments (optional)
- **OpenAI Images (`gpt-image-2`)** for brand photography (admin / CLI only)

Brand identity lives in one file: [`src/lib/brand.ts`](src/lib/brand.ts). Rename the company there and the lockup, metadata, packaging artwork, emails and legal copy follow.

---

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run assets:generate` | Generate missing brand photography via OpenAI |

---

## Environment

Copy [`.env.example`](.env.example) to `.env.local`. Never commit real secrets.

```
OPENAI_API_KEY=
OPENAI_IMAGE_MODEL=gpt-image-2

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ASSET_BUCKET=brand-assets

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_SITE_URL=http://localhost:3000

ADMIN_EMAILS=
```

Every integration is optional. Missing keys degrade gracefully:

| Missing | Public behaviour |
| --- | --- |
| OpenAI | CSS/SVG pouch artwork and generated photography already on disk |
| Supabase | Bundled seed catalogue, demo auth screens |
| Stripe | Polished demo checkout that never touches a card |

`OPENAI_API_KEY` is **server-only**. It is never prefixed `NEXT_PUBLIC_`, never returned from an API, never logged.

---

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Homepage |
| `/shop` | Filterable catalogue |
| `/products/[slug]` | Product page |
| `/build-a-box` | Box builder + subscribe |
| `/how-it-works` | Preparation and preservation |
| `/why-full` | Brand story |
| `/nutrition` | Philosophy, comparison, pantry calculator |
| `/about` | Origin story |
| `/faq` | Accordion FAQ + JSON-LD |
| `/cart` | Dedicated cart |
| `/checkout` | Stripe or labelled demo checkout |
| `/account` | Dashboard, orders, profile |
| `/contact` | Contact form |
| `/privacy` `/terms` | Legal |
| `/admin/image-studio` | Protected image generator |

---

## Catalogue

Concept products live in [`src/lib/products.ts`](src/lib/products.ts). Every nutrition figure is labelled **concept data** until laboratory-analysed values replace it.

| Meal | Protein | Calories | Price |
| --- | --- | --- | --- |
| Mac + Cheese — Classic Cheddar | 42 g | 510 | €5.99 |
| Mac + Cheese — Spicy Jalapeño | 40 g | 500 | €5.99 |
| Pasta — Creamy Tomato | 39 g | 490 | €6.49 |
| Pasta — Truffle Mushroom | 38 g | 520 | €6.99 |
| Risotto — Roasted Garlic | 36 g | 480 | €6.49 |
| Chili — Smoky Bean + Beef | 45 g | 530 | €6.99 |

`getProducts()` is the only UI entry point. Point it at Supabase (see below) without changing a component.

---

## Supabase

Schema and seed: [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and [`supabase/seed.sql`](supabase/seed.sql).

```bash
# With the Supabase CLI
npx supabase init        # if you have not already
npx supabase db reset    # applies migrations + seed
```

Or paste the SQL into the Supabase SQL editor.

Tables (RLS enabled on all of them):

- `profiles` — owner-scoped, created on auth signup
- `products`, `product_images`, `product_variants`, `nutrition_facts`, `ingredients`
- `orders`, `order_items`, `subscriptions` — written by the Stripe webhook via the service role
- `reviews` — only `published = true` is public
- `generated_assets` — admin studio audit log
- `carts` — optional signed-in cart sync

Catalogue tables are world-readable. Customer tables are strictly `auth.uid()`-scoped. Orders and generated assets have **no client INSERT policy** — only the service role can write them.

Auth pages (`/account/sign-in`, `/account/sign-up`, `/account/forgot-password`) already talk to Supabase Auth when the public keys are set. Without them, the same screens explain that accounts are in demo mode.

---

## Stripe

1. Create products and prices in Stripe (test mode is fine).
2. Put Price IDs on the matching rows (`stripe_price_id`, `stripe_subscription_price_id`) or in the seed catalogue.
3. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Point a webhook at `/api/stripe/webhook` for `checkout.session.completed`, `customer.subscription.*`, `invoice.paid`.
5. Set `STRIPE_WEBHOOK_SECRET`.

Checkout **never stores card details**. Amounts are recomputed server-side from the catalogue; a tampered cart cannot change the charge.

Without keys, `/api/checkout` still returns `200` with `demo: true` and the storefront completes a clearly labelled demo order.

Local webhook forwarding:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Image generation

The storefront **never** calls OpenAI during a page render. Photography is generated once, stored, and reused.

### CLI (batch)

```bash
npm run assets:generate
npm run assets:generate -- --only hero-mac-cheddar,lifestyle-student
npm run assets:generate -- --force --quality high
```

Images land in `public/images/brand/` and are recorded in [`src/assets/manifest.json`](src/assets/manifest.json). Missing keys fall back to CSS/SVG packaging (`<Pouch />`) and plate artwork so the site is never empty.

Prompts are assembled in [`src/lib/image-prompts.ts`](src/lib/image-prompts.ts). Packaging typography is never asked of the model — it is drawn in HTML/CSS so lettering stays crisp.

### Admin studio

[`/admin/image-studio`](src/app/admin/image-studio/page.tsx) is a protected developer tool:

1. Pick a product, image type, aspect ratio, quality.
2. The server builds a detailed prompt.
3. `POST /api/generate-image` talks to OpenAI (`gpt-image-2`) **server-side**.
4. The image is stored (Supabase Storage if configured, otherwise `public/images/brand`).
5. Metadata is saved; you can assign the asset to a product.

Access:

- **Development** — unlocked, with a loud banner.
- **Production** — requires a signed-in user whose email is in `ADMIN_EMAILS`. An empty list locks `/admin` for everyone.

The API key is never returned, never logged, and the endpoint is rate-limited.

---

## Cart, boxes, subscriptions

- Cart lives in `localStorage` (`full.cart.v1`) and hydrates on the client. Signed-in sync is ready when Supabase is configured.
- Promo codes `FULL15` (15%) and `PROTEIN10` (10%) are recognised in the UI; Stripe coupons should be created to match before launch.
- Box sizes: 8 / 12 / 20 meals, with volume and subscription (15%) discounts.
- Free shipping meter uses `brand.shipping.freeThresholdCents` (€45).

---

## Delight features

- **Macro Nerd** — site-wide toggle. Normal shows protein + calories; Nerd unlocks density, splits, serving weight and micros. Persisted locally.
- **What should I eat?** — `/shop#finder`, rule-based, no AI call.
- **Pantry calculator** — `/nutrition` and `/build-a-box`. Concept values, labelled.

---

## Legal / claims

Nutrition numbers are **concept targets**, not verified labels. The site does not claim disease treatment, weight loss, muscle growth, or certifications that do not exist. Reviews are labelled as prototype tester feedback or as an empty layout waiting for verified orders.

---

## Deploy

The app is a standard Next.js App Router project. Vercel, Netlify, or any Node 20+ host works.

1. Set the environment variables in the host. `NEXT_PUBLIC_SITE_URL` must be the public origin.
2. If using Supabase Storage for generated assets, create a public bucket named `brand-assets` (or match `SUPABASE_ASSET_BUCKET`).
3. Point Stripe webhooks at `https://<your-domain>/api/stripe/webhook`.
4. Set `ADMIN_EMAILS` before going live.

```bash
npm run build
npm run start
```

---

## Project map

```
src/
  app/                 routes, API, metadata
  components/          UI, home, shop, cart, brand
  lib/                 brand, products, stripe, openai, supabase
  assets/manifest.json generated photography index
public/images/brand/   persisted WebP photography
supabase/              migrations + seed
scripts/               asset generator, screenshots, e2e
```
