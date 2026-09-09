import "server-only";

import { hasOpenAI, openAiImageModel } from "@/lib/env";

/**
 * OpenAI Images wrapper — server only.
 *
 * The API key is read here and nowhere else. It is never logged, never
 * placed in an error message and never returned to a caller: every
 * failure is converted into an `ImageGenerationError` with a message
 * that has been scrubbed of anything key-shaped.
 *
 * The running site never calls this at render time; only the CLI
 * generator and the protected admin studio do.
 */

const ENDPOINT = "https://api.openai.com/v1/images/generations";

/** Image generation is slow — allow three minutes before giving up. */
const TIMEOUT_MS = 180_000;

export type ImageErrorCode =
  | "not_configured"
  | "invalid_request"
  | "unauthorized"
  | "rate_limited"
  | "timeout"
  | "upstream_error"
  | "empty_response";

export class ImageGenerationError extends Error {
  readonly code: ImageErrorCode;
  readonly status: number;

  constructor(code: ImageErrorCode, message: string, status = 500) {
    super(sanitise(message));
    this.name = "ImageGenerationError";
    this.code = code;
    this.status = status;
  }
}

/** Belt and braces: strip anything that looks like a credential. */
function sanitise(message: string): string {
  return message
    .replace(/sk-[A-Za-z0-9_-]{8,}/g, "[redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .slice(0, 400);
}

export type ImageQuality = "low" | "medium" | "high";

export interface GenerateImageInput {
  prompt: string;
  /** OpenAI size string, e.g. "1536x1024". */
  size: string;
  quality: ImageQuality;
}

export interface GenerateImageResult {
  buffer: Buffer;
  model: string;
  size: string;
  quality: ImageQuality;
  /** Milliseconds spent waiting on OpenAI. */
  durationMs: number;
  createdAt: string;
}

export async function generateImage({
  prompt,
  size,
  quality,
}: GenerateImageInput): Promise<GenerateImageResult> {
  if (!hasOpenAI) {
    throw new ImageGenerationError(
      "not_configured",
      "OpenAI is not configured on this deployment. Add OPENAI_API_KEY to the server environment.",
      503,
    );
  }
  if (!prompt.trim()) {
    throw new ImageGenerationError("invalid_request", "The prompt is empty.", 400);
  }

  const started = Date.now();
  let response: Response;

  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: openAiImageModel, prompt, size, quality, n: 1 }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    const timedOut = error instanceof Error && /timeout|abort/i.test(error.name + error.message);
    throw new ImageGenerationError(
      timedOut ? "timeout" : "upstream_error",
      timedOut
        ? "OpenAI did not respond within three minutes. Try a smaller size or lower quality."
        : "Could not reach the OpenAI API.",
      timedOut ? 504 : 502,
    );
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      payload && typeof payload === "object" && "error" in payload
        ? ((payload as { error?: { message?: string } }).error?.message ?? "")
        : "";

    if (response.status === 401 || response.status === 403) {
      throw new ImageGenerationError(
        "unauthorized",
        "OpenAI rejected the configured credentials.",
        502,
      );
    }
    if (response.status === 429) {
      throw new ImageGenerationError(
        "rate_limited",
        "OpenAI is rate limiting this account right now. Wait a moment and try again.",
        429,
      );
    }
    if (response.status === 400) {
      throw new ImageGenerationError(
        "invalid_request",
        detail || "OpenAI rejected the request. The prompt may have tripped a content filter.",
        400,
      );
    }
    throw new ImageGenerationError(
      "upstream_error",
      detail || `OpenAI returned HTTP ${response.status}.`,
      502,
    );
  }

  const b64 =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data?: { b64_json?: string; url?: string }[] }).data?.[0]?.b64_json
      : undefined;

  if (!b64) {
    throw new ImageGenerationError("empty_response", "OpenAI returned no image data.", 502);
  }

  return {
    buffer: Buffer.from(b64, "base64"),
    model: openAiImageModel,
    size,
    quality,
    durationMs: Date.now() - started,
    createdAt: new Date().toISOString(),
  };
}
