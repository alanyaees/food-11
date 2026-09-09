import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabase } from "@/lib/env";
import { clientIdentifier, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import {
  emptySurveyStats,
  parseSurveyStats,
  type SurveyHabitSnippet,
  type SurveyResultsPayload,
  yesNoToBool,
} from "@/lib/survey";

/**
 * Survey endpoint.
 *
 * POST stores a response (anon RLS insert). GET returns aggregate stats
 * plus recent anonymous cooking notes for the public results panel.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const yesNo = z.enum(["yes", "no"]);

const submitSchema = z
  .object({
    wouldTryProduct: yesNo,
    cooksAtHome: yesNo,
    cookHabits: z.string().trim().max(500, "Keep that under 500 characters."),
    eatsOutLazy: yesNo,
    junkFoodWhenOut: yesNo,
    packsLunchToUni: yesNo,
  })
  .superRefine((value, ctx) => {
    if (value.cooksAtHome === "yes" && value.cookHabits.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["cookHabits"],
        message: "Tell us roughly how often you cook, and which meals.",
      });
    }
  });

function getAnonClient(): SupabaseClient | null {
  if (!hasSupabase) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { "X-Client-Info": "full-survey" } },
    },
  );
}

async function loadResults(client: SupabaseClient | null): Promise<SurveyResultsPayload> {
  if (!client) {
    return { stats: emptySurveyStats(), recentHabits: [], configured: false };
  }

  const [{ data: statsRaw, error: statsError }, { data: habitsRaw, error: habitsError }] =
    await Promise.all([
      client.rpc("survey_stats"),
      client
        .from("survey_responses")
        .select("id, cook_habits, created_at")
        .neq("cook_habits", "")
        .order("created_at", { ascending: false })
        .limit(40),
    ]);

  if (statsError || habitsError) {
    return { stats: emptySurveyStats(), recentHabits: [], configured: true };
  }

  const recentHabits: SurveyHabitSnippet[] = (habitsRaw ?? [])
    .map((row) => {
      const text = typeof row.cook_habits === "string" ? row.cook_habits.trim() : "";
      if (!text) return null;
      return {
        id: String(row.id),
        text,
        createdAt: String(row.created_at ?? ""),
      };
    })
    .filter((row): row is SurveyHabitSnippet => Boolean(row));

  return {
    stats: parseSurveyStats(statsRaw),
    recentHabits,
    configured: true,
  };
}

export async function GET() {
  const client = getAnonClient();
  try {
    const payload = await loadResults(client);
    return NextResponse.json({ ok: true, ...payload });
  } catch {
    return NextResponse.json(
      {
        ok: true,
        stats: emptySurveyStats(),
        recentHabits: [],
        configured: Boolean(client),
      } satisfies { ok: true } & SurveyResultsPayload,
    );
  }
}

export async function POST(request: Request) {
  const limit = rateLimit({
    key: `survey:${clientIdentifier(request)}`,
    limit: 8,
    windowMs: 60_000,
  });
  if (!limit.success) {
    return NextResponse.json(
      { ok: false, message: "Too many survey submissions. Try again in a minute." },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Check the form and try again.",
        field: parsed.error.issues[0]?.path[0],
      },
      { status: 400 },
    );
  }

  const client = getAnonClient();
  if (!client) {
    return NextResponse.json({
      ok: true,
      stored: false,
      message: "Thanks — your answers were noted, but survey storage isn't connected on this deployment yet.",
    });
  }

  const cookHabits = parsed.data.cookHabits.trim();

  try {
    const { error } = await client.from("survey_responses").insert({
      would_try_product: yesNoToBool(parsed.data.wouldTryProduct),
      cooks_at_home: yesNoToBool(parsed.data.cooksAtHome),
      cook_habits: cookHabits,
      eats_out_lazy: yesNoToBool(parsed.data.eatsOutLazy),
      junk_food_when_out: yesNoToBool(parsed.data.junkFoodWhenOut),
      packs_lunch_to_uni: yesNoToBool(parsed.data.packsLunchToUni),
    });

    if (error) {
      return NextResponse.json({
        ok: true,
        stored: false,
        message: "We couldn't save that response just now. Please try again in a moment.",
      });
    }

    const results = await loadResults(client);

    return NextResponse.json({
      ok: true,
      stored: true,
      message: "You're in. Thanks for helping shape FULL.",
      results,
    });
  } catch {
    return NextResponse.json({
      ok: true,
      stored: false,
      message: "Something glitched on save. Please try again in a moment.",
    });
  }
}
