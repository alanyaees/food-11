import { NextResponse } from "next/server";
import { z } from "zod";
import { brand } from "@/lib/brand";
import { clientIdentifier, rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Contact form receiver. Same contract as the newsletter route: JSON
 * only, honest about whether the message was actually stored.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(80),
  email: z.email("Enter a valid email address.").max(200),
  topic: z.string().trim().min(1).max(60).default("general"),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail would help.")
    .max(4000, "That's longer than we can accept — trim it a little."),
});

export async function POST(request: Request) {
  const limit = rateLimit({
    key: `contact:${clientIdentifier(request)}`,
    limit: 5,
    windowMs: 60_000,
  });
  if (!limit.success) {
    return NextResponse.json(
      { ok: false, message: "Too many messages at once. Try again in a minute." },
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
      { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdminClient();

  if (!admin) {
    return NextResponse.json({
      ok: true,
      stored: false,
      message: `Our message inbox isn't connected on this deployment, so nothing was sent. Email us directly at ${brand.contact.email}.`,
    });
  }

  try {
    const { error } = await admin.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      topic: parsed.data.topic,
      message: parsed.data.message,
    });

    if (error) {
      return NextResponse.json({
        ok: true,
        stored: false,
        message: `We couldn't file that just now — email us at ${brand.contact.email} and we'll pick it up.`,
      });
    }

    return NextResponse.json({
      ok: true,
      stored: true,
      message: "Got it. We answer everything within two working days.",
    });
  } catch {
    return NextResponse.json({
      ok: true,
      stored: false,
      message: `We couldn't file that just now — email us at ${brand.contact.email} and we'll pick it up.`,
    });
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, message: "Use POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
