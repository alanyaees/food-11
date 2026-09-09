import manifestJson from "@/assets/manifest.json";

export interface AssetEntry {
  path: string;
  width: number;
  height: number;
  alt: string;
  model?: string;
  purpose?: string;
  createdAt?: string;
}

type Manifest = {
  version: number;
  note?: string;
  assets: Record<string, AssetEntry>;
};

const manifest = manifestJson as Manifest;

/**
 * Resolves a brand image by key.
 *
 * Images are generated once (see `npm run assets:generate` or
 * /admin/image-studio), written to /public/images/brand and recorded in
 * src/assets/manifest.json. Nothing is ever generated during a page
 * render. When a key is missing, callers fall back to the CSS/SVG
 * packaging and plate artwork so the site is never broken or empty.
 */
export function getAsset(key?: string | null): AssetEntry | null {
  if (!key) return null;
  return manifest.assets[key] ?? null;
}

export function hasAsset(key?: string | null): boolean {
  return Boolean(getAsset(key));
}

export function listAssets(): (AssetEntry & { key: string })[] {
  return Object.entries(manifest.assets).map(([key, entry]) => ({ key, ...entry }));
}

/** Keys the site expects; used by the generator and the admin studio. */
export const assetKeys = {
  heroPrimary: "hero-mac-cheddar",
  heroPouchTrio: "pouch-trio",
  packageMacCheddar: "pouch-mac-cheddar",
  lifestyleStudent: "lifestyle-student",
  lifestyleFitness: "lifestyle-fitness",
  lifestyleDesk: "lifestyle-desk",
  lifestyleTravel: "lifestyle-travel",
  ingredientsFlatlay: "ingredients-mac-cheddar",
  macroBowl: "macro-hero-bowl",
  dehydrationSteps: "dehydration-flow",
} as const;
