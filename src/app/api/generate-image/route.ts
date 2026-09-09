import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/admin";
import { appendDevAssetLog, readDevAssetLog, storeGeneratedAsset } from "@/lib/asset-store";
import { hasOpenAI, hasSupabaseAdmin, isProduction } from "@/lib/env";
import { assetKeyFor, buildStudioPrompt, sizeForAspect } from "@/lib/image-brief";
import { ImageGenerationError, generateImage } from "@/lib/openai";
import { getProductBySlug } from "@/lib/products";
import { clientIdentifier, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Admin-only image generation.
 *
 * The OPENAI_API_KEY is used inside `@/lib/openai` and never appears in
 * a response, a log line or an error message. Generation is slow and
 * costs money, so the route is both admin-gated and rate limited.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** OpenAI image calls routinely take 60–120s. */
export const maxDuration = 300;

const bodySchema = z.object({
  productSlug: z.string().max(160).nullish(),
  type: z.enum([
    "hero",
    "package",
    "closeup",
    "lifestyle",
    "ingredient",
    "process",
    "social",
    "banner",
  ]),
  aspect: z.enum(["1:1", "3:2", "2:3", "16:9"]),
  quality: z.enum(["low", "medium", "high"]),
  instructions: z.string().max(1200).optional(),
});

export async function POST(request: Request) {
  const access = await isAdminRequest();
  if (!access.allowed) {
    return NextResponse.json({ ok: false, error: access.reason ?? "Not authorised." }, { status: 403 });
  }

  const limit = rateLimit({
    key: `generate-image:${access.userId ?? clientIdentifier(request)}`,
    limit: 4,
    windowMs: 60_000,
  });
  if (!limit.success) {
    return NextResponse.json(
      {
        ok: false,
        error: `Rate limited — image generation is capped at 4 per minute. Try again in ${limit.retryAfterSeconds}s.`,
      },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  if (!hasOpenAI) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "OPENAI_API_KEY is not set on the server. Add it to .env.local and restart the dev server.",
      },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { productSlug, type, aspect, quality, instructions } = parsed.data;
  const product = productSlug ? getProductBySlug(productSlug) : null;
  const prompt = buildStudioPrompt({ product, type, aspect, instructions });

  let result;
  try {
    result = await generateImage({ prompt, size: sizeForAspect(aspect), quality });
  } catch (error) {
    if (error instanceof ImageGenerationError) {
      return NextResponse.json({ ok: false, error: error.message, code: error.code }, {
        status: error.status,
      });
    }
    return NextResponse.json(
      { ok: false, error: "Image generation failed for an unexpected reason." },
      { status: 500 },
    );
  }

  const key = assetKeyFor(type, productSlug ?? null);
  const stored = await storeGeneratedAsset({
    key,
    buffer: result.buffer,
    maxWidth: aspect === "1:1" ? 1280 : 1800,
  });

  if (!stored.ok) {
    return NextResponse.json({ ok: false, error: stored.error }, { status: 500 });
  }

  const record = {
    key,
    url: stored.url,
    storagePath: stored.storagePath,
    width: stored.width,
    height: stored.height,
    prompt,
    model: result.model,
    purpose: type,
    productSlug: product?.slug ?? null,
    createdAt: result.createdAt,
  };

  const admin = getSupabaseAdminClient();
  if (admin) {
    try {
      await admin.from("generated_assets").insert({
        product_id: product?.id ?? null,
        prompt,
        model: result.model,
        purpose: type,
        image_url: stored.url,
        storage_path: stored.storagePath,
        width: stored.width,
        height: stored.height,
        created_by: access.userId,
      });
    } catch {
      // The image exists; an audit-row failure must not lose it.
    }
  }

  if (!isProduction) await appendDevAssetLog(record);

  return NextResponse.json(
    {
      ok: true,
      ...record,
      backend: stored.backend,
      durationMs: result.durationMs,
      devUnlocked: access.devUnlocked,
    },
    { headers: rateLimitHeaders(limit) },
  );
}

/** Recent generations, newest first. */
export async function GET() {
  const access = await isAdminRequest();
  if (!access.allowed) {
    return NextResponse.json({ ok: false, error: access.reason ?? "Not authorised." }, { status: 403 });
  }

  const admin = getSupabaseAdminClient();
  if (admin && hasSupabaseAdmin) {
    try {
      const { data, error } = await admin
        .from("generated_assets")
        .select("id, prompt, model, purpose, image_url, storage_path, width, height, created_at")
        .order("created_at", { ascending: false })
        .limit(24);

      if (!error && data) {
        const rows = data as {
          id: string;
          prompt: string;
          model: string;
          purpose: string;
          image_url: string;
          storage_path: string | null;
          width: number | null;
          height: number | null;
          created_at: string;
        }[];

        return NextResponse.json({
          ok: true,
          source: "supabase",
          history: rows.map((row) => ({
            key: row.id,
            url: row.image_url,
            storagePath: row.storage_path,
            width: row.width ?? 0,
            height: row.height ?? 0,
            prompt: row.prompt,
            model: row.model,
            purpose: row.purpose,
            productSlug: null,
            createdAt: row.created_at,
          })),
        });
      }
    } catch {
      // Fall through to the local log.
    }
  }

  const history = await readDevAssetLog();
  return NextResponse.json({ ok: true, source: "local", history: history.slice(0, 24) });
}
