import { categoryLabels, dietaryLabels, getProducts } from "./products";
import type { DietaryTag, MealCategory, Product } from "./types";
import { proteinDensity } from "./utils";

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "protein-desc", label: "Highest protein" },
  { id: "calories-asc", label: "Lowest calories" },
  { id: "density-desc", label: "Best protein density" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

export interface ShopFilters {
  categories: MealCategory[];
  dietary: DietaryTag[];
  minProtein: number | null;
  maxCalories: number | null;
  maxPrep: number | null;
  query: string;
  sort: SortId;
}

export const proteinSteps = [36, 40, 42, 45] as const;
export const calorieSteps = [480, 500, 520, 530] as const;
export const prepSteps = [3, 5, 7] as const;

export const emptyFilters: ShopFilters = {
  categories: [],
  dietary: [],
  minProtein: null,
  maxCalories: null,
  maxPrep: null,
  query: "",
  sort: "featured",
};

/** URL → filters. Keeps the shop shareable, linkable and back-button safe. */
export function parseFilters(params: Record<string, string | string[] | undefined>): ShopFilters {
  const read = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const list = (key: string) =>
    (read(key) ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

  const number = (key: string) => {
    const value = Number(read(key));
    return Number.isFinite(value) && value > 0 ? value : null;
  };

  const sortParam = read("sort");
  const sort = sortOptions.some((option) => option.id === sortParam)
    ? (sortParam as SortId)
    : "featured";

  return {
    categories: list("category").filter((entry): entry is MealCategory =>
      Object.keys(categoryLabels).includes(entry),
    ),
    dietary: list("dietary").filter((entry): entry is DietaryTag =>
      Object.keys(dietaryLabels).includes(entry),
    ),
    minProtein: number("minProtein"),
    maxCalories: number("maxCalories"),
    maxPrep: number("maxPrep"),
    query: read("q") ?? "",
    sort,
  };
}

/** filters → query string, omitting defaults so URLs stay clean. */
export function serialiseFilters(filters: ShopFilters) {
  const params = new URLSearchParams();
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.dietary.length) params.set("dietary", filters.dietary.join(","));
  if (filters.minProtein) params.set("minProtein", String(filters.minProtein));
  if (filters.maxCalories) params.set("maxCalories", String(filters.maxCalories));
  if (filters.maxPrep) params.set("maxPrep", String(filters.maxPrep));
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  return params.toString();
}

export function activeFilterCount(filters: ShopFilters) {
  return (
    filters.categories.length +
    filters.dietary.length +
    (filters.minProtein ? 1 : 0) +
    (filters.maxCalories ? 1 : 0) +
    (filters.maxPrep ? 1 : 0) +
    (filters.query.trim() ? 1 : 0)
  );
}

export function applyFilters(products: Product[], filters: ShopFilters) {
  const query = filters.query.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (filters.categories.length && !filters.categories.includes(product.category)) return false;
    if (filters.dietary.length && !filters.dietary.every((tag) => product.dietary.includes(tag)))
      return false;
    if (filters.minProtein && product.nutrition.protein < filters.minProtein) return false;
    if (filters.maxCalories && product.nutrition.calories > filters.maxCalories) return false;
    if (filters.maxPrep && product.prepMinutes > filters.maxPrep) return false;
    if (
      query &&
      ![product.name, product.flavor, product.line, product.tagline, product.description]
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
      return false;
    return true;
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case "protein-desc":
      sorted.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
      break;
    case "calories-asc":
      sorted.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
      break;
    case "density-desc":
      sorted.sort(
        (a, b) =>
          proteinDensity(b.nutrition.protein, b.nutrition.calories) -
          proteinDensity(a.nutrition.protein, a.nutrition.calories),
      );
      break;
    case "price-asc":
      sorted.sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.priceCents - a.priceCents);
      break;
    case "newest":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    default:
      sorted.sort((a, b) => a.rank - b.rank);
  }
  return sorted;
}

/** Facet counts so filters can show how many meals each option yields. */
export function facetCounts() {
  const products = getProducts();
  const categories = Object.keys(categoryLabels).map((id) => ({
    id: id as MealCategory,
    label: categoryLabels[id as MealCategory],
    count: products.filter((product) => product.category === id).length,
  }));
  const dietary = (Object.keys(dietaryLabels) as DietaryTag[])
    .map((id) => ({
      id,
      label: dietaryLabels[id],
      count: products.filter((product) => product.dietary.includes(id)).length,
    }))
    .filter((entry) => entry.count > 0);
  return { categories, dietary };
}
