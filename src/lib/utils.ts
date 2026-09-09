import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { brand } from "./brand";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat(brand.currency.locale, {
  style: "currency",
  currency: brand.currency.code,
});

export function formatPrice(cents: number) {
  return priceFormatter.format(cents / 100);
}

/** Grams of protein per 100 kcal — the number the whole brand hangs on. */
export function proteinDensity(protein: number, calories: number) {
  if (!calories) return 0;
  return Math.round((protein / calories) * 100 * 10) / 10;
}

export function macroSplit(nutrition: {
  protein: number;
  carbs: number;
  fat: number;
}) {
  const kcalProtein = nutrition.protein * 4;
  const kcalCarbs = nutrition.carbs * 4;
  const kcalFat = nutrition.fat * 9;
  const total = kcalProtein + kcalCarbs + kcalFat || 1;
  return {
    protein: Math.round((kcalProtein / total) * 100),
    carbs: Math.round((kcalCarbs / total) * 100),
    fat: Math.round((kcalFat / total) * 100),
  };
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
