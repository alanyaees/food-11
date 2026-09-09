import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { PageHero } from "@/components/content/page-hero";
import { SurveyExperience } from "@/components/survey/survey-experience";
import { brand } from "@/lib/brand";
import { hasSupabase } from "@/lib/env";
import {
  emptySurveyStats,
  parseSurveyStats,
  surveyCopy,
  type SurveyHabitSnippet,
  type SurveyResultsPayload,
} from "@/lib/survey";
import { absoluteUrl } from "@/lib/utils";

const title = "Student survey";
const description =
  "Help shape FULL. Tell us how you eat and see live student answers.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/survey" },
  openGraph: {
    type: "website",
    title: `${title} · ${brand.name}`,
    description,
    url: absoluteUrl("/survey"),
    siteName: brand.name,
  },
};

export const dynamic = "force-dynamic";

async function loadInitialResults(): Promise<SurveyResultsPayload> {
  if (!hasSupabase) {
    return { stats: emptySurveyStats(), recentHabits: [], configured: false };
  }

  try {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      },
    );

    const [{ data: statsRaw }, { data: habitsRaw }] = await Promise.all([
      client.rpc("survey_stats"),
      client
        .from("survey_responses")
        .select("id, cook_habits, created_at")
        .neq("cook_habits", "")
        .order("created_at", { ascending: false })
        .limit(40),
    ]);

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
  } catch {
    return { stats: emptySurveyStats(), recentHabits: [], configured: true };
  }
}

export default async function SurveyPage() {
  const initialResults = await loadInitialResults();

  return (
    <>
      <PageHero
        kicker={surveyCopy.kicker}
        titleLines={surveyCopy.titleLines}
        lead={surveyCopy.lead}
        size="md"
        stats={[
          { label: "Responses so far", value: String(initialResults.stats.total) },
        ]}
      />

      {/*
        Do not wrap the form in Reveal/whileInView. On mobile the form+results
        block is taller than the viewport, so amount-based reveals can stay at
        opacity:0 forever and look like a blank page.
      */}
      <SurveyExperience initialResults={initialResults} />
    </>
  );
}
