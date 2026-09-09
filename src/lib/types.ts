export type FlavorAccent =
  | "cheddar"
  | "jalapeno"
  | "tomato"
  | "truffle"
  | "garlic"
  | "chili";

export type MealCategory = "mac-and-cheese" | "pasta" | "risotto" | "chili";

export type DietaryTag =
  | "vegetarian"
  | "contains-meat"
  | "spicy"
  | "high-fibre"
  | "dairy-free";

/** Provenance of a nutrition figure. Keeps concept data clearly separated. */
export type DataStatus = "concept" | "verified";

export interface Micronutrient {
  label: string;
  amount: string;
  /** % of EU Nutrient Reference Value, when applicable. */
  nrv?: number;
}

export interface Nutrition {
  protein: number;
  calories: number;
  carbs: number;
  sugars: number;
  fat: number;
  saturates: number;
  fibre: number;
  saltG: number;
  servingWeightG: number;
  micronutrients: Micronutrient[];
  status: DataStatus;
}

export interface IngredientGroup {
  /** Plain-English name a human would actually recognise. */
  name: string;
  /** Why it's in there, in one sentence. No jargon. */
  why: string;
  /** Rough share of the recipe, for the transparency panel. */
  share?: number;
}

export interface PrepStep {
  title: string;
  detail: string;
}

export interface ProductImages {
  /** Keys into the generated-asset manifest (see lib/assets.ts). */
  hero?: string;
  pouch?: string;
  closeup?: string;
  lifestyle?: string;
  ingredients?: string;
}

export interface Product {
  id: string;
  slug: string;
  /** Product line, typeset in caps: "MAC + CHEESE". */
  line: string;
  /** Flavour name: "Classic Cheddar". */
  flavor: string;
  /** Full display name used in metadata and cart. */
  name: string;
  category: MealCategory;
  accent: FlavorAccent;
  tagline: string;
  description: string;
  story: string[];
  loveIt: string[];
  priceCents: number;
  compareAtCents?: number;
  prepMinutes: number;
  waterMl: number;
  nutrition: Nutrition;
  ingredients: IngredientGroup[];
  allergens: string[];
  dietary: DietaryTag[];
  /** 0 = none, 3 = properly hot. */
  heat: 0 | 1 | 2 | 3;
  prepSteps: PrepStep[];
  images: ProductImages;
  featured: boolean;
  active: boolean;
  /** Sort weight for the "Featured" ordering, lower first. */
  rank: number;
  createdAt: string;
  stripePriceId?: string;
}

/** A representative convenience meal used by the comparison tool. */
export interface ReferenceMeal {
  id: string;
  label: string;
  note: string;
  calories: number;
  protein: number;
  fibre: number;
  prepMinutes: number;
}

export interface CartItemMeta {
  /** Meals inside a build-a-box line, for display. */
  boxContents?: { slug: string; name: string; quantity: number }[];
  boxSize?: number;
}

export interface CartItem {
  /** Stable key: slug + purchase mode (+ box hash). */
  key: string;
  slug: string;
  name: string;
  line: string;
  flavor: string;
  accent: FlavorAccent;
  unitPriceCents: number;
  quantity: number;
  mode: "one-time" | "subscription";
  protein: number;
  calories: number;
  kind: "meal" | "box";
  meta?: CartItemMeta;
}
