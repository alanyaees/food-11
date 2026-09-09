import type { MealCategory } from "@/lib/types";

/** The product fields the studio ships to the browser. */
export interface StudioProduct {
  slug: string;
  name: string;
  line: string;
  flavor: string;
  category: MealCategory;
  description: string;
}

/** One row of generation history, from Supabase or the local dev log. */
export interface GeneratedRecord {
  key: string;
  url: string;
  storagePath: string | null;
  width: number;
  height: number;
  prompt: string;
  model: string;
  purpose: string;
  productSlug: string | null;
  createdAt: string;
}

export type StorageBackend = "supabase" | "local" | "none";
