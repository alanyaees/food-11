import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIdentifier, rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Newsletter sign-up.
 *
 * Always answers with JSON and never 500s when Supabase is missing —
 * the honest fallback is to accept the address, say so plainly, and
 * store nothing.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.email("Enter a valid email address.").max(200),
  source: z.string().max(60).optional(),
});

const CONFIRMATION = "You're on the list.";

export async function POST(request: Request) {
  const limit = rateLimit({
    key: `newsletter:${clientIdentifier(request)}`,
    limit: 5,
    windowMs: 60_000,
  });
  if (!limit.success) {
    return NextResponse.json(
      { ok: false, message: "That's a lot of sign-ups. Try again in a minute." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Enter a valid email address." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return NextResponse.json({
      ok: true,
      stored: false,
      message: "Thanks — but our mailing list isn't connected on this deployment yet.",
    });
  }

  try {
    const { error } = await admin
      .from("newsletter_subscribers")
      .upsert(
        { email, source: parsed.data.source ?? "site" },
        { onConflict: "email", ignoreDuplicates: true },
      );

    if (error) {
      return NextResponse.json({
        ok: true,
        stored: false,
        message: CONFIRMATION,
      });
    }

    return NextResponse.json({ ok: true, stored: true, message: CONFIRMATION });
  } catch {
    return NextResponse.json({ ok: true, stored: false, message: CONFIRMATION });
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, message: "Use POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
