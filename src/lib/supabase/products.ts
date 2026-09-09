import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getProductBySlug as getSeedProductBySlug, getProducts as getSeedProducts } from "@/lib/products";
import type {
  DataStatus,
  FlavorAccent,
  IngredientGroup,
  MealCategory,
  Micronutrient,
  PrepStep,
  Product,
  ProductImages,
} from "@/lib/types";

/**
 * Catalogue access.
 *
 * Reads products from Supabase when it is configured and silently falls
 * back to the bundled seed catalogue in `@/lib/products` otherwise —
 * including when the network call fails or returns nothing. These
 * functions never throw, because a database hiccup must not take the
 * shop down.
 *
 * Deliberately uses a plain anon client rather than the cookie-bound
 * server client: the catalogue is public, so this stays callable from
 * statically rendered pages without opting them into dynamic rendering.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

let cachedClient: SupabaseClient | null = null;

function getCatalogueClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (cachedClient) return cachedClient;
  cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return cachedClient;
}

/* ─── Row shapes ──────────────────────────────────────────────── */

interface NutritionRow {
  serving_weight_g: number | null;
  calories: number | string | null;
  protein_g: number | string | null;
  carbs_g: number | string | null;
  sugars_g: number | string | null;
  fat_g: number | string | null;
  saturates_g: number | string | null;
  fibre_g: number | string | null;
  salt_g: number | string | null;
  micronutrients: unknown;
  status: string | null;
}

interface IngredientRow {
  name: string | null;
  why: string | null;
  share: number | string | null;
  position: number | null;
}

interface ProductImageRow {
  role: string | null;
  asset_key: string | null;
  position: number | null;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  line: string;
  flavor: string;
  category: string;
  tagline: string | null;
  description: string | null;
  story: string[] | null;
  love_it: string[] | null;
  price_cents: number;
  compare_at_cents: number | null;
  currency: string | null;
  protein: number | string | null;
  calories: number | string | null;
  carbs: number | string | null;
  fat: number | string | null;
  fibre: number | string | null;
  prep_minutes: number | null;
  water_ml: number | null;
  serving_weight_g: number | null;
  heat: number | null;
  allergens: string[] | null;
  dietary: string[] | null;
  accent: string;
  active: boolean | null;
  featured: boolean | null;
  rank: number | null;
  stripe_price_id: string | null;
  data_status: string | null;
  created_at: string;
  nutrition_facts: NutritionRow | NutritionRow[] | null;
  ingredients: IngredientRow[] | null;
  product_images: ProductImageRow[] | null;
}

const SELECT = `
  id, slug, name, line, flavor, category, tagline, description, story, love_it,
  price_cents, compare_at_cents, currency, protein, calories, carbs, fat, fibre,
  prep_minutes, water_ml, serving_weight_g, heat, allergens, dietary, accent,
  active, featured, rank, stripe_price_id, data_status, created_at,
  nutrition_facts ( serving_weight_g, calories, protein_g, carbs_g, sugars_g, fat_g,
                    saturates_g, fibre_g, salt_g, micronutrients, status ),
  ingredients ( name, why, share, position ),
  product_images ( role, asset_key, position )
`;

/* ─── Coercion helpers ────────────────────────────────────────── */

// Postgres numerics arrive as strings over PostgREST.
const num = (value: number | string | null | undefined, fallback = 0): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const categories: MealCategory[] = ["mac-and-cheese", "pasta", "risotto", "chili"];
const accentNames: FlavorAccent[] = [
  "cheddar",
  "jalapeno",
  "tomato",
  "truffle",
  "garlic",
  "chili",
];

const toCategory = (value: string): MealCategory =>
  categories.includes(value as MealCategory) ? (value as MealCategory) : "pasta";

const toAccent = (value: string): FlavorAccent =>
  accentNames.includes(value as FlavorAccent) ? (value as FlavorAccent) : "cheddar";

const toHeat = (value: number | null): Product["heat"] => {
  const clamped = Math.min(3, Math.max(0, Math.round(value ?? 0)));
  return clamped as Product["heat"];
};

const toDietary = (values: string[] | null): Product["dietary"] =>
  (values ?? []).filter((entry): entry is Product["dietary"][number] =>
    ["vegetarian", "contains-meat", "spicy", "high-fibre", "dairy-free"].includes(entry),
  );

function toMicronutrients(value: unknown): Micronutrient[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const record = entry as Record<string, unknown>;
    if (typeof record.label !== "string" || typeof record.amount !== "string") return [];
    return [
      {
        label: record.label,
        amount: record.amount,
        nrv: typeof record.nrv === "number" ? record.nrv : undefined,
      },
    ];
  });
}

function toIngredients(rows: IngredientRow[] | null): IngredientGroup[] {
  return (rows ?? [])
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .flatMap((row) =>
      row.name
        ? [
            {
              name: row.name,
              why: row.why ?? "",
              share: row.share == null ? undefined : num(row.share),
            },
          ]
        : [],
    );
}

function toImages(rows: ProductImageRow[] | null, fallback: ProductImages): ProductImages {
  const images: ProductImages = { ...fallback };
  const slots: (keyof ProductImages)[] = ["hero", "pouch", "closeup", "lifestyle", "ingredients"];

  for (const row of rows ?? []) {
    const role = row.role as keyof ProductImages | undefined;
    if (!role || !slots.includes(role) || !row.asset_key) continue;
    images[role] = row.asset_key;
  }
  return images;
}

/**
 * Prep steps are presentation copy, not commerce data, so they are not
 * stored in Postgres. Reuse the seed wording for a known slug and
 * synthesise an equivalent set for anything added straight to the DB.
 */
function toPrepSteps(slug: string, waterMl: number, minutes: number): PrepStep[] {
  const seeded = getSeedProductBySlug(slug);
  if (seeded) return seeded.prepSteps;

  return [
    { title: "Tear", detail: "Open the pouch along the laser score. Keep the pouch — it's your bowl." },
    { title: "Pour", detail: `Add ${waterMl} ml of just-boiled water up to the fill line inside the pouch.` },
    { title: "Stir", detail: "Stir for 20 seconds so nothing hides in the corners." },
    { title: "Close", detail: "Press the zip shut and let it sit upright." },
    { title: "Wait", detail: `${minutes} minutes.` },
    { title: "Stir again", detail: "One last stir pulls the sauce together and evens the texture." },
    { title: "Eat", detail: "Straight from the pouch, or plated if you're being fancy." },
  ];
}

function firstNutrition(value: ProductRow["nutrition_facts"]): NutritionRow | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

/** Maps a database row onto the `Product` shape the UI already uses. */
export function mapProductRow(row: ProductRow): Product {
  const seeded = getSeedProductBySlug(row.slug);
  const facts = firstNutrition(row.nutrition_facts);
  const waterMl = row.water_ml ?? seeded?.waterMl ?? 280;
  const prepMinutes = row.prep_minutes ?? seeded?.prepMinutes ?? 3;
  const status: DataStatus = row.data_status === "concept" ? "concept" : "verified";
  const ingredients = toIngredients(row.ingredients);

  return {
    id: row.id,
    slug: row.slug,
    line: row.line,
    flavor: row.flavor,
    name: row.name,
    category: toCategory(row.category),
    accent: toAccent(row.accent),
    tagline: row.tagline ?? seeded?.tagline ?? "",
    description: row.description ?? seeded?.description ?? "",
    story: row.story?.length ? row.story : (seeded?.story ?? []),
    loveIt: row.love_it?.length ? row.love_it : (seeded?.loveIt ?? []),
    priceCents: row.price_cents,
    compareAtCents: row.compare_at_cents ?? undefined,
    prepMinutes,
    waterMl,
    nutrition: {
      protein: num(facts?.protein_g ?? row.protein),
      calories: num(facts?.calories ?? row.calories),
      carbs: num(facts?.carbs_g ?? row.carbs),
      sugars: num(facts?.sugars_g, seeded?.nutrition.sugars ?? 0),
      fat: num(facts?.fat_g ?? row.fat),
      saturates: num(facts?.saturates_g, seeded?.nutrition.saturates ?? 0),
      fibre: num(facts?.fibre_g ?? row.fibre),
      saltG: num(facts?.salt_g, seeded?.nutrition.saltG ?? 0),
      servingWeightG: facts?.serving_weight_g ?? row.serving_weight_g ?? 0,
      micronutrients: facts
        ? toMicronutrients(facts.micronutrients)
        : (seeded?.nutrition.micronutrients ?? []),
      status: facts?.status === "verified" ? "verified" : status,
    },
    ingredients: ingredients.length ? ingredients : (seeded?.ingredients ?? []),
    allergens: row.allergens ?? seeded?.allergens ?? [],
    dietary: toDietary(row.dietary),
    heat: toHeat(row.heat ?? seeded?.heat ?? 0),
    prepSteps: toPrepSteps(row.slug, waterMl, prepMinutes),
    images: toImages(row.product_images, seeded?.images ?? {}),
    featured: row.featured ?? false,
    active: row.active ?? true,
    rank: row.rank ?? 100,
    createdAt: row.created_at,
    stripePriceId: row.stripe_price_id ?? undefined,
  };
}

/* ─── Public API ──────────────────────────────────────────────── */

/**
 * The full active catalogue, ordered by rank. Falls back to seed data
 * whenever Supabase is unconfigured, unreachable or empty.
 */
export async function fetchProducts(): Promise<Product[]> {
  const client = getCatalogueClient();
  if (!client) return getSeedProducts();

  try {
    const { data, error } = await client
      .from("products")
      .select(SELECT)
      .eq("active", true)
      .order("rank", { ascending: true });

    if (error || !data || data.length === 0) return getSeedProducts();
    return (data as unknown as ProductRow[]).map(mapProductRow);
  } catch {
    return getSeedProducts();
  }
}

/** A single product by slug, or `null` when it does not exist anywhere. */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const client = getCatalogueClient();
  if (!client) return getSeedProductBySlug(slug);

  try {
    const { data, error } = await client
      .from("products")
      .select(SELECT)
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return getSeedProductBySlug(slug);
    return mapProductRow(data as unknown as ProductRow);
  } catch {
    return getSeedProductBySlug(slug);
  }
}

/** Slug → product lookup used by server-side pricing. */
export async function fetchProductMap(): Promise<Map<string, Product>> {
  const list = await fetchProducts();
  return new Map(list.map((product) => [product.slug, product]));
}
