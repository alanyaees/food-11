/**
 * Student survey — questions and result shapes.
 * Source of truth for the form copy matches the original Food form.
 */

export type YesNo = "yes" | "no";

export type SurveyAnswers = {
  wouldTryProduct: YesNo | "";
  cooksAtHome: YesNo | "";
  cookHabits: string;
  eatsOutLazy: YesNo | "";
  junkFoodWhenOut: YesNo | "";
  packsLunchToUni: YesNo | "";
};

export type VoteSplit = { yes: number; no: number };

export type SurveyStats = {
  total: number;
  would_try_product: VoteSplit;
  cooks_at_home: VoteSplit;
  eats_out_lazy: VoteSplit;
  junk_food_when_out: VoteSplit;
  packs_lunch_to_uni: VoteSplit;
};

export type SurveyHabitSnippet = {
  id: string;
  text: string;
  createdAt: string;
};

export type SurveyResultsPayload = {
  stats: SurveyStats;
  recentHabits: SurveyHabitSnippet[];
  configured: boolean;
};

export const emptySurveyStats = (): SurveyStats => ({
  total: 0,
  would_try_product: { yes: 0, no: 0 },
  cooks_at_home: { yes: 0, no: 0 },
  eats_out_lazy: { yes: 0, no: 0 },
  junk_food_when_out: { yes: 0, no: 0 },
  packs_lunch_to_uni: { yes: 0, no: 0 },
});

export const surveyCopy = {
  kicker: "Student survey",
  titleLines: ["Shape the", "lunch aisle."] as const,
  lead:
    "We're asking fellow students how they eat — and how likely they'd pick a high-protein, healthy quick-prep meal if they saw it in a grocery store. Answers are public so everyone can see what the group thinks.",
  resultsKicker: "Live results",
  resultsTitle: "What everyone is saying",
} as const;

export type YesNoQuestionId =
  | "wouldTryProduct"
  | "cooksAtHome"
  | "eatsOutLazy"
  | "junkFoodWhenOut"
  | "packsLunchToUni";

export const yesNoQuestions: {
  id: YesNoQuestionId;
  statsKey: keyof Omit<SurveyStats, "total">;
  label: string;
}[] = [
  {
    id: "wouldTryProduct",
    statsKey: "would_try_product",
    label:
      "Would you try switching out your lunch for a high protein, healthy quick preparation alternative, if you saw it in a grocery store for ~ €6? (Something similar to cup noodles, but healthy & nutritious)",
  },
  {
    id: "cooksAtHome",
    statsKey: "cooks_at_home",
    label: "Do you cook food for yourself at home?",
  },
  {
    id: "eatsOutLazy",
    statsKey: "eats_out_lazy",
    label: "Do you eat out often because you are lazy to cook?",
  },
  {
    id: "junkFoodWhenOut",
    statsKey: "junk_food_when_out",
    label: "Do you often end up eating junk food if you eat out?",
  },
  {
    id: "packsLunchToUni",
    statsKey: "packs_lunch_to_uni",
    label: "Do you pack your lunch to uni?",
  },
];

export const cookHabitsQuestion = {
  id: "cookHabits" as const,
  label:
    "(If you cook food for yourself at home) How often do you cook, and what meals do you prepare for yourself? (Eg. only breakfast, breakfast & lunch, breakfast lunch & dinner).",
  placeholder: "e.g. Breakfast & dinner most weekdays",
};

export function yesNoToBool(value: YesNo): boolean {
  return value === "yes";
}

export function majorityLabel(split: VoteSplit): "Yes" | "No" | "Tie" | "—" {
  if (split.yes === 0 && split.no === 0) return "—";
  if (split.yes === split.no) return "Tie";
  return split.yes > split.no ? "Yes" : "No";
}

export function votePercent(split: VoteSplit, side: "yes" | "no"): number {
  const total = split.yes + split.no;
  if (total === 0) return 0;
  return Math.round(((side === "yes" ? split.yes : split.no) / total) * 100);
}

export function parseSurveyStats(raw: unknown): SurveyStats {
  const empty = emptySurveyStats();
  if (!raw || typeof raw !== "object") return empty;
  const data = raw as Record<string, unknown>;
  const split = (key: string): VoteSplit => {
    const value = data[key];
    if (!value || typeof value !== "object") return { yes: 0, no: 0 };
    const row = value as Record<string, unknown>;
    return {
      yes: typeof row.yes === "number" ? row.yes : 0,
      no: typeof row.no === "number" ? row.no : 0,
    };
  };
  return {
    total: typeof data.total === "number" ? data.total : 0,
    would_try_product: split("would_try_product"),
    cooks_at_home: split("cooks_at_home"),
    eats_out_lazy: split("eats_out_lazy"),
    junk_food_when_out: split("junk_food_when_out"),
    packs_lunch_to_uni: split("packs_lunch_to_uni"),
  };
}
