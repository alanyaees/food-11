import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { assetBucket, hasSupabaseAdmin, isProduction } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Persistence for generated brand imagery.
 *
 * Two backends, picked automatically:
 *   1. Supabase Storage, when a service-role key is present. This is the
 *      only supported path in production — a deployed instance has no
 *      writable, persistent filesystem.
 *   2. The local `public/images/generated` folder in development, with
 *      an append-only JSON log in `.dev-assets/` (git-ignored) so the
 *      studio can show history without a database.
 *
 * In production without Supabase we return an error object rather than
 * writing to disk, because the write would silently vanish on redeploy.
 */

const DEV_DIR = path.join(process.cwd(), "public", "images", "generated");
const DEV_LOG = path.join(process.cwd(), ".dev-assets", "generated-assets.json");

export interface StoredAsset {
  url: string;
  storagePath: string | null;
  width: number;
  height: number;
}

export type StoreAssetResult =
  | ({ ok: true; backend: "supabase" | "local" } & StoredAsset)
  | { ok: false; error: string };

export interface DevAssetLogEntry {
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

export interface StoreAssetInput {
  /** Slug-safe file stem, e.g. `hero-mac-cheddar-1757325600000`. */
  key: string;
  buffer: Buffer;
  /** Longest edge after resizing. */
  maxWidth?: number;
}

/** Converts to WebP and reports the final dimensions. */
async function toWebp(buffer: Buffer, maxWidth: number) {
  const webp = await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();
  const meta = await sharp(webp).metadata();
  return { webp, width: meta.width ?? 0, height: meta.height ?? 0 };
}

export async function storeGeneratedAsset({
  key,
  buffer,
  maxWidth = 1800,
}: StoreAssetInput): Promise<StoreAssetResult> {
  let webp: Buffer;
  let width: number;
  let height: number;

  try {
    ({ webp, width, height } = await toWebp(buffer, maxWidth));
  } catch {
    return { ok: false, error: "The generated image could not be converted to WebP." };
  }

  const admin = getSupabaseAdminClient();

  if (admin && hasSupabaseAdmin) {
    const storagePath = `generated/${key}.webp`;
    try {
      const { error } = await admin.storage.from(assetBucket).upload(storagePath, webp, {
        contentType: "image/webp",
        upsert: true,
        cacheControl: "31536000",
      });
      if (error) {
        return { ok: false, error: `Supabase Storage rejected the upload: ${error.message}` };
      }
      const { data } = admin.storage.from(assetBucket).getPublicUrl(storagePath);
      return {
        ok: true,
        backend: "supabase",
        url: data.publicUrl,
        storagePath,
        width,
        height,
      };
    } catch {
      return { ok: false, error: "Could not reach Supabase Storage." };
    }
  }

  if (isProduction) {
    return {
      ok: false,
      error:
        "No storage backend is configured. Set SUPABASE_SERVICE_ROLE_KEY (and a public bucket) before generating images in production — the filesystem is not persistent here.",
    };
  }

  try {
    await mkdir(DEV_DIR, { recursive: true });
    await writeFile(path.join(DEV_DIR, `${key}.webp`), webp);
    return {
      ok: true,
      backend: "local",
      url: `/images/generated/${key}.webp`,
      storagePath: null,
      width,
      height,
    };
  } catch {
    return { ok: false, error: "Could not write the image to public/images/generated." };
  }
}

/* ─── Development history log ─────────────────────────────────── */

export async function readDevAssetLog(): Promise<DevAssetLogEntry[]> {
  try {
    const raw = await readFile(DEV_LOG, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DevAssetLogEntry[]) : [];
  } catch {
    return [];
  }
}

/** Appends one entry, newest first, capped so the file stays small. */
export async function appendDevAssetLog(entry: DevAssetLogEntry): Promise<void> {
  try {
    const existing = await readDevAssetLog();
    const next = [entry, ...existing].slice(0, 100);
    await mkdir(path.dirname(DEV_LOG), { recursive: true });
    await writeFile(DEV_LOG, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  } catch {
    // History is a convenience, never a reason to fail a generation.
  }
}
