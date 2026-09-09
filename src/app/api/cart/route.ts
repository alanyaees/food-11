import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server-side cart mirror.
 *
 * The browser stays the source of truth; this only makes a signed-in
 * cart survive a device change. With Supabase unconfigured — or nobody
 * signed in — it politely reports `persisted: false` instead of
 * failing, so the client can carry on with local storage.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Items are stored as opaque JSON: the cart shape belongs to the
 * storefront, and re-validating every field here would mean two places
 * to update. Size and count are bounded so the column cannot be abused.
 */
const bodySchema = z.object({
  items: z.array(z.record(z.string(), z.unknown())).max(60),
  promoCode: z.string().max(40).nullish(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "That cart doesn't look right." }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ ok: true, persisted: false, reason: "not-configured" });
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json({ ok: true, persisted: false, reason: "signed-out" });
    }

    const { error } = await supabase.from("carts").upsert(
      {
        user_id: userData.user.id,
        items: parsed.data.items,
        promo_code: parsed.data.promoCode ?? null,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      return NextResponse.json({ ok: true, persisted: false, reason: "write-failed" });
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch {
    return NextResponse.json({ ok: true, persisted: false, reason: "unavailable" });
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ ok: true, cart: null, reason: "not-configured" });
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json({ ok: true, cart: null, reason: "signed-out" });
    }

    const { data, error } = await supabase
      .from("carts")
      .select("items, promo_code, updated_at")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (error || !data) return NextResponse.json({ ok: true, cart: null });

    const row = data as { items: unknown; promo_code: string | null; updated_at: string };
    return NextResponse.json({
      ok: true,
      cart: {
        items: Array.isArray(row.items) ? row.items : [],
        promoCode: row.promo_code,
        updatedAt: row.updated_at,
      },
    });
  } catch {
    return NextResponse.json({ ok: true, cart: null, reason: "unavailable" });
  }
}
