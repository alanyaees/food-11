-- ═══════════════════════════════════════════════════════════════════
-- FULL. — initial schema
--
-- Design notes
--   * Every table has RLS enabled. Nothing is readable by default.
--   * Catalogue tables (products, images, nutrition, ingredients) are
--     world-readable so the storefront can render without a session.
--   * Customer tables (profiles, orders, subscriptions, carts) are
--     strictly owner-scoped via auth.uid().
--   * Writes that must not be forgeable (orders from Stripe webhooks,
--     generated_assets from the admin image studio) have no INSERT
--     policy at all: only the service-role key, which bypasses RLS,
--     can write them.
--   * Product ids are text (`p_mac_cheddar`) so the seed catalogue in
--     src/lib/products.ts and the database stay 1:1 during development.
-- ═══════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─── Enums ─────────────────────────────────────────────────────────

do $$ begin
  create type public.meal_category as enum ('mac-and-cheese', 'pasta', 'risotto', 'chili');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.flavor_accent as enum ('cheddar', 'jalapeno', 'tomato', 'truffle', 'garlic', 'chili');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.data_status as enum ('concept', 'verified');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscription_status as enum ('active', 'paused', 'past_due', 'cancelled', 'incomplete');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.purchase_mode as enum ('one-time', 'subscription');
exception when duplicate_object then null; end $$;

-- ─── Shared helpers ────────────────────────────────────────────────

-- Keeps `updated_at` honest without trusting the client.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ═══════════════════════════════════════════════════════════════════
-- profiles
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,
  full_name     text,
  phone         text,
  role          text not null default 'customer' check (role in ('customer', 'admin')),
  marketing_opt_in boolean not null default false,
  shipping_address jsonb,
  billing_address  jsonb,
  stripe_customer_id text unique,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: owner reads own row" on public.profiles;
create policy "profiles: owner reads own row"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles: owner inserts own row" on public.profiles;
create policy "profiles: owner inserts own row"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

drop policy if exists "profiles: owner updates own row" on public.profiles;
create policy "profiles: owner updates own row"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Admin check used by policies below. SECURITY DEFINER so the policy can
-- read profiles.role without recursing through profiles' own RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Every auth.users insert gets a profiles row. Runs as definer because
-- the inserting role during signup is not the new user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, marketing_opt_in)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    coalesce((new.raw_user_meta_data ->> 'marketing_opt_in')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════
-- products
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.products (
  id                text primary key,
  slug              text not null unique,
  name              text not null,
  line              text not null,
  flavor            text not null,
  category          public.meal_category not null,
  tagline           text,
  description       text not null default '',
  story             text[] not null default '{}',
  love_it           text[] not null default '{}',
  price_cents       integer not null check (price_cents >= 0),
  compare_at_cents  integer check (compare_at_cents is null or compare_at_cents >= 0),
  currency          text not null default 'EUR' check (char_length(currency) = 3),
  protein           numeric(6, 1) not null default 0,
  calories          numeric(7, 1) not null default 0,
  carbs             numeric(6, 1) not null default 0,
  fat               numeric(6, 1) not null default 0,
  fibre             numeric(6, 1) not null default 0,
  prep_minutes      integer not null default 0 check (prep_minutes >= 0),
  water_ml          integer not null default 0 check (water_ml >= 0),
  serving_weight_g  integer not null default 0 check (serving_weight_g >= 0),
  heat              smallint not null default 0 check (heat between 0 and 3),
  allergens         text[] not null default '{}',
  dietary           text[] not null default '{}',
  accent            public.flavor_accent not null,
  active            boolean not null default true,
  featured          boolean not null default false,
  rank              integer not null default 100,
  stripe_price_id   text,
  stripe_subscription_price_id text,
  data_status       public.data_status not null default 'concept',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_active_rank_idx on public.products (active, rank);
create index if not exists products_category_idx on public.products (category);

alter table public.products enable row level security;

drop policy if exists "products: public read active" on public.products;
create policy "products: public read active"
  on public.products for select
  to anon, authenticated
  using (active = true);

drop policy if exists "products: admins read all" on public.products;
create policy "products: admins read all"
  on public.products for select
  to authenticated
  using (public.is_admin());

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- product_images
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products (id) on delete cascade,
  -- Slot the image fills on the product page: hero | pouch | closeup | lifestyle | ingredients.
  role        text not null default 'hero',
  -- Key into src/assets/manifest.json when the asset is bundled locally.
  asset_key   text,
  url         text,
  storage_path text,
  alt         text not null default '',
  width       integer,
  height      integer,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  unique (product_id, role, position)
);

create index if not exists product_images_product_idx on public.product_images (product_id, position);

alter table public.product_images enable row level security;

drop policy if exists "product_images: public read" on public.product_images;
create policy "product_images: public read"
  on public.product_images for select
  to anon, authenticated
  using (true);

-- ═══════════════════════════════════════════════════════════════════
-- product_variants
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.product_variants (
  id              uuid primary key default gen_random_uuid(),
  product_id      text not null references public.products (id) on delete cascade,
  sku             text not null unique,
  label           text not null,
  pack_size       integer not null default 1 check (pack_size > 0),
  price_cents     integer not null check (price_cents >= 0),
  compare_at_cents integer,
  mode            public.purchase_mode not null default 'one-time',
  stripe_price_id text,
  inventory_count integer,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists product_variants_product_idx on public.product_variants (product_id);

alter table public.product_variants enable row level security;

drop policy if exists "product_variants: public read active" on public.product_variants;
create policy "product_variants: public read active"
  on public.product_variants for select
  to anon, authenticated
  using (active = true);

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- nutrition_facts
--
-- One row per product. Split from `products` so the concept figures can
-- be replaced wholesale by lab-analysed values without touching
-- commerce columns.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.nutrition_facts (
  product_id        text primary key references public.products (id) on delete cascade,
  serving_weight_g  integer not null default 0,
  calories          numeric(7, 1) not null default 0,
  protein_g         numeric(6, 1) not null default 0,
  carbs_g           numeric(6, 1) not null default 0,
  sugars_g          numeric(6, 1) not null default 0,
  fat_g             numeric(6, 1) not null default 0,
  saturates_g       numeric(6, 1) not null default 0,
  fibre_g           numeric(6, 1) not null default 0,
  salt_g            numeric(6, 2) not null default 0,
  micronutrients    jsonb not null default '[]'::jsonb,
  status            public.data_status not null default 'concept',
  analysed_at       timestamptz,
  lab_reference     text,
  updated_at        timestamptz not null default now()
);

alter table public.nutrition_facts enable row level security;

drop policy if exists "nutrition_facts: public read" on public.nutrition_facts;
create policy "nutrition_facts: public read"
  on public.nutrition_facts for select
  to anon, authenticated
  using (true);

drop trigger if exists nutrition_facts_set_updated_at on public.nutrition_facts;
create trigger nutrition_facts_set_updated_at
  before update on public.nutrition_facts
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- ingredients
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.ingredients (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products (id) on delete cascade,
  name        text not null,
  why         text not null default '',
  share       numeric(5, 2),
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  unique (product_id, position)
);

create index if not exists ingredients_product_idx on public.ingredients (product_id, position);

alter table public.ingredients enable row level security;

drop policy if exists "ingredients: public read" on public.ingredients;
create policy "ingredients: public read"
  on public.ingredients for select
  to anon, authenticated
  using (true);

-- ═══════════════════════════════════════════════════════════════════
-- orders
--
-- Written by the Stripe webhook through the service-role key. There is
-- deliberately no INSERT or UPDATE policy: a signed-in user can read
-- their own orders and nothing else.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users (id) on delete set null,
  email             text,
  status            public.order_status not null default 'pending',
  currency          text not null default 'EUR',
  subtotal_cents    integer not null default 0,
  discount_cents    integer not null default 0,
  shipping_cents    integer not null default 0,
  total_cents       integer not null default 0,
  promo_code        text,
  meal_count        integer not null default 0,
  protein_total     integer not null default 0,
  shipping_address  jsonb,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "orders: owner reads own" on public.orders;
create policy "orders: owner reads own"
  on public.orders for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "orders: admins read all" on public.orders;
create policy "orders: admins read all"
  on public.orders for select
  to authenticated
  using (public.is_admin());

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- order_items
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders (id) on delete cascade,
  product_id        text references public.products (id) on delete set null,
  slug              text,
  name              text not null,
  line              text,
  flavor            text,
  kind              text not null default 'meal' check (kind in ('meal', 'box')),
  mode              public.purchase_mode not null default 'one-time',
  unit_price_cents  integer not null default 0,
  quantity          integer not null default 1 check (quantity > 0),
  protein           integer not null default 0,
  calories          integer not null default 0,
  -- Box contents / box size for build-a-box lines.
  meta              jsonb,
  created_at        timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

drop policy if exists "order_items: owner reads own" on public.order_items;
create policy "order_items: owner reads own"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = (select auth.uid())
    )
  );

drop policy if exists "order_items: admins read all" on public.order_items;
create policy "order_items: admins read all"
  on public.order_items for select
  to authenticated
  using (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════
-- subscriptions
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid references auth.users (id) on delete set null,
  email                  text,
  status                 public.subscription_status not null default 'incomplete',
  interval_id            text not null default 'monthly',
  items                  jsonb not null default '[]'::jsonb,
  currency               text not null default 'EUR',
  amount_cents           integer not null default 0,
  stripe_subscription_id text unique,
  stripe_customer_id     text,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists subscriptions_user_idx on public.subscriptions (user_id, created_at desc);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions: owner reads own" on public.subscriptions;
create policy "subscriptions: owner reads own"
  on public.subscriptions for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "subscriptions: owner updates own" on public.subscriptions;
create policy "subscriptions: owner updates own"
  on public.subscriptions for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- reviews
--
-- `approved` defaults to false: nothing appears on the storefront until
-- a human has read it. Public read is gated on approved = true.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  product_id   text not null references public.products (id) on delete cascade,
  user_id      uuid references auth.users (id) on delete set null,
  author_name  text not null default 'Anonymous',
  rating       smallint not null check (rating between 1 and 5),
  title        text,
  body         text not null default '',
  verified_purchase boolean not null default false,
  approved     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists reviews_product_approved_idx on public.reviews (product_id, approved);

alter table public.reviews enable row level security;

drop policy if exists "reviews: public read approved" on public.reviews;
create policy "reviews: public read approved"
  on public.reviews for select
  to anon, authenticated
  using (approved = true);

drop policy if exists "reviews: author reads own" on public.reviews;
create policy "reviews: author reads own"
  on public.reviews for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "reviews: author writes own" on public.reviews;
create policy "reviews: author writes own"
  on public.reviews for insert
  to authenticated
  with check (user_id = (select auth.uid()) and approved = false);

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- generated_assets
--
-- Audit trail for /admin/image-studio. Writes are service-role only:
-- there is no INSERT/UPDATE/DELETE policy for anon or authenticated.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.generated_assets (
  id           uuid primary key default gen_random_uuid(),
  product_id   text references public.products (id) on delete set null,
  prompt       text not null,
  model        text not null,
  purpose      text not null default 'hero',
  image_url    text not null,
  storage_path text,
  width        integer,
  height       integer,
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists generated_assets_created_idx on public.generated_assets (created_at desc);

alter table public.generated_assets enable row level security;

-- Read-only for admins; every write path goes through the service role.
drop policy if exists "generated_assets: admins read" on public.generated_assets;
create policy "generated_assets: admins read"
  on public.generated_assets for select
  to authenticated
  using (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════
-- newsletter_subscribers
--
-- Anyone may sign up; nobody but the service role may read the list.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  source        text not null default 'site',
  confirmed     boolean not null default false,
  unsubscribed_at timestamptz,
  created_at    timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter: anyone may subscribe" on public.newsletter_subscribers;
create policy "newsletter: anyone may subscribe"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

drop policy if exists "newsletter: admins read" on public.newsletter_subscribers;
create policy "newsletter: admins read"
  on public.newsletter_subscribers for select
  to authenticated
  using (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════
-- contact_messages
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  topic       text not null default 'general',
  message     text not null,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "contact: anyone may write" on public.contact_messages;
create policy "contact: anyone may write"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "contact: admins read" on public.contact_messages;
create policy "contact: admins read"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════
-- carts
--
-- Server-side mirror of the browser cart so it survives a device
-- change. One row per user; the client remains the source of truth
-- until it syncs.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.carts (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  items       jsonb not null default '[]'::jsonb,
  promo_code  text,
  updated_at  timestamptz not null default now()
);

alter table public.carts enable row level security;

drop policy if exists "carts: owner reads own" on public.carts;
create policy "carts: owner reads own"
  on public.carts for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "carts: owner inserts own" on public.carts;
create policy "carts: owner inserts own"
  on public.carts for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "carts: owner updates own" on public.carts;
create policy "carts: owner updates own"
  on public.carts for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "carts: owner deletes own" on public.carts;
create policy "carts: owner deletes own"
  on public.carts for delete
  to authenticated
  using (user_id = (select auth.uid()));

drop trigger if exists carts_set_updated_at on public.carts;
create trigger carts_set_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- Storage: public `brand-assets` bucket
--
-- Generated brand imagery is world-readable (it is used in <img> tags)
-- but only the service role may upload, which is what the image studio
-- API route uses.
-- ═══════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  true,
  20971520, -- 20 MB
  array['image/webp', 'image/png', 'image/jpeg', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "brand-assets: public read" on storage.objects;
create policy "brand-assets: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'brand-assets');

-- There is deliberately no insert/update/delete policy for anon or
-- authenticated on this bucket: uploads happen exclusively with the
-- service-role key, which bypasses RLS.

-- ─── Grants ────────────────────────────────────────────────────────
-- RLS still governs row visibility; these just make the tables
-- addressable by the PostgREST roles.

grant usage on schema public to anon, authenticated;
grant select on public.products, public.product_images, public.product_variants,
  public.nutrition_facts, public.ingredients, public.reviews to anon, authenticated;
grant insert on public.newsletter_subscribers, public.contact_messages to anon, authenticated;
grant select, insert, update, delete on public.carts to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select on public.orders, public.order_items, public.subscriptions to authenticated;
grant update on public.subscriptions to authenticated;
grant insert on public.reviews to authenticated;
grant select on public.generated_assets to authenticated;
