/**
 * Tiny in-memory token bucket.
 *
 * ⚠ Per-instance only. State lives in the process, so on a serverless
 * or multi-region deployment each instance keeps its own counters and
 * the effective limit is `limit × instances`. That is intentional: this
 * exists to blunt accidental loops and casual abuse of the OpenAI and
 * Stripe endpoints, not to be a security control. Move to Upstash /
 * Redis before relying on it for anything that costs real money at
 * scale.
 */

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

/** Drop buckets that have been idle for a while so the map cannot grow forever. */
const IDLE_EVICTION_MS = 10 * 60 * 1000;
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < IDLE_EVICTION_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (now - bucket.updatedAt > IDLE_EVICTION_MS) buckets.delete(key);
  }
}

export interface RateLimitOptions {
  /** Namespace, so two endpoints sharing an IP do not share a budget. */
  key: string;
  /** Requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Seconds until at least one token is available again. */
  retryAfterSeconds: number;
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const refillPerMs = limit / windowMs;
  const existing = buckets.get(key);
  const tokens = existing
    ? Math.min(limit, existing.tokens + (now - existing.updatedAt) * refillPerMs)
    : limit;

  if (tokens < 1) {
    buckets.set(key, { tokens, updatedAt: now });
    return {
      success: false,
      limit,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((1 - tokens) / refillPerMs / 1000)),
    };
  }

  buckets.set(key, { tokens: tokens - 1, updatedAt: now });
  return {
    success: true,
    limit,
    remaining: Math.floor(tokens - 1),
    retryAfterSeconds: 0,
  };
}

/**
 * Best-effort client identity from proxy headers. Spoofable, which is
 * fine for the purpose above — never use it for authorisation.
 */
export function clientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "anonymous";
}

/** Standard headers so clients can back off politely. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
  };
  if (!result.success) headers["Retry-After"] = String(result.retryAfterSeconds);
  return headers;
}
