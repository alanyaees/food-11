import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Sign-out endpoint.
 *
 * POST is the real one (a GET link could be triggered by a prefetch or
 * an <img> tag); GET is kept as a no-JS escape hatch and simply sends
 * the visitor home after clearing the session.
 */

export const dynamic = "force-dynamic";

async function signOut(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase?.auth.signOut();
  } catch {
    // A failed sign-out must still land the visitor somewhere sensible.
  }
  return NextResponse.redirect(new URL("/", new URL(request.url).origin), { status: 303 });
}

export async function POST(request: Request) {
  return signOut(request);
}

export async function GET(request: Request) {
  return signOut(request);
}
