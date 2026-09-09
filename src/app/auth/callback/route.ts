import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Auth redirect target for email confirmations, magic links and
 * password resets.
 *
 * Supabase sends either a PKCE `code` or a `token_hash` + `type` pair
 * depending on the project's email template, so both are handled. The
 * session cookies are written here, in a route handler, because that is
 * the only place Next allows cookie mutation.
 */

export const dynamic = "force-dynamic";

/** Only ever redirect within this site — never to an attacker's URL. */
function safeNext(value: string | null): string {
  if (!value) return "/account";
  if (!value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
}

function failure(origin: string, reason: string) {
  const url = new URL("/account/sign-in", origin);
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { origin, searchParams } = url;
  const next = safeNext(searchParams.get("next"));

  // Supabase reports its own failures on the query string.
  if (searchParams.get("error")) {
    return failure(origin, "link-invalid");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return failure(origin, "not-configured");

  const code = searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return failure(origin, "link-expired");
    return NextResponse.redirect(new URL(next, origin));
  }

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "email" | "recovery" | "invite" | "magiclink" | "signup" | "email_change",
      token_hash: tokenHash,
    });
    if (error) return failure(origin, "link-expired");
    return NextResponse.redirect(new URL(next, origin));
  }

  return failure(origin, "link-invalid");
}
