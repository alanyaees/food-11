import { aspectToSize, buildPrompt, type AspectRatio, type ImageType } from "./image-prompts";
import type { MealCategory, Product } from "./types";

/**
 * Turns a product into prompt material.
 *
 * Shared by the admin studio (which shows a live preview of the
 * assembled prompt) and the API route (which actually sends it), so the
 * developer always sees exactly what will be generated. Pure and
 * secret-free, hence safe to import from a client component.
 */

const categoryPhrase: Record<MealCategory, string> = {
  "mac-and-cheese": "creamy high-protein macaroni and cheese with a glossy sauce clinging to short ridged pasta",
  pasta: "high-protein short pasta coated in a glossy sauce",
  risotto: "creamy high-protein arborio risotto",
  chili: "thick high-protein chili with visible beans and shredded meat",
};

function firstSentence(text: string): string {
  const trimmed = text.trim();
  const stop = trimmed.indexOf(". ");
  return stop === -1 ? trimmed : trimmed.slice(0, stop + 1);
}

/**
 * The slice of a product the prompt builder needs. Keeps the payload
 * the admin studio ships to the browser small, and lets a full
 * `Product` be passed straight in.
 */
export type PromptProduct = Pick<Product, "slug" | "name" | "category" | "flavor" | "description">;

/** A photographic description of the dish, never brand copy. */
export function foodDescriptionFor(product: PromptProduct | null | undefined): string | undefined {
  if (!product) return undefined;
  return `${categoryPhrase[product.category]}, ${product.flavor.toLowerCase()} — ${firstSentence(
    product.description,
  )}`;
}

export interface StudioPromptInput {
  product: PromptProduct | null | undefined;
  type: ImageType;
  aspect: AspectRatio;
  /** Free-text direction from the developer. */
  instructions?: string;
}

/**
 * Scene-led image types take the extra instructions as staging
 * direction; everything else takes them as style notes.
 */
export function buildStudioPrompt({
  product,
  type,
  aspect,
  instructions,
}: StudioPromptInput): string {
  const extra = instructions?.trim() || undefined;
  const sceneLed = type === "lifestyle" || type === "process";

  return buildPrompt({
    type,
    aspect,
    food: foodDescriptionFor(product),
    scene: sceneLed ? extra : undefined,
    style: sceneLed ? undefined : extra,
  });
}

export function sizeForAspect(aspect: AspectRatio): string {
  return aspectToSize[aspect];
}

/** Slug-safe, collision-proof file stem for a generated asset. */
export function assetKeyFor(type: ImageType, productSlug: string | null | undefined): string {
  const base = [type, productSlug ?? "brand"]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${Date.now().toString(36)}`;
}
