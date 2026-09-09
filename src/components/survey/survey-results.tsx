"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  emptySurveyStats,
  majorityLabel,
  surveyCopy,
  type SurveyHabitSnippet,
  type SurveyResultsPayload,
  type SurveyStats,
  type VoteSplit,
  votePercent,
  yesNoQuestions,
} from "@/lib/survey";

type Props = {
  initial?: SurveyResultsPayload | null;
  refreshToken?: number;
};

type ResultBlock =
  | { kind: "vote"; index: number; question: (typeof yesNoQuestions)[number] }
  | { kind: "habits"; index: number };

/** Mirror the form order: Q3 is the free-text cooking habits question. */
function buildResultBlocks(): ResultBlock[] {
  const blocks: ResultBlock[] = [];
  let index = 1;
  for (const question of yesNoQuestions) {
    blocks.push({ kind: "vote", index, question });
    index += 1;
    if (question.id === "cooksAtHome") {
      blocks.push({ kind: "habits", index });
      index += 1;
    }
  }
  return blocks;
}

const RESULT_BLOCKS = buildResultBlocks();

export function SurveyResults({ initial, refreshToken = 0 }: Props) {
  const reduced = useReducedMotion();
  const [stats, setStats] = useState<SurveyStats>(initial?.stats ?? emptySurveyStats());
  const [habits, setHabits] = useState<SurveyHabitSnippet[]>(initial?.recentHabits ?? []);
  const [configured, setConfigured] = useState(initial?.configured ?? false);
  const [loading, setLoading] = useState(!initial);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(initial ? new Date() : null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await fetch("/api/survey", { cache: "no-store" });
        const data = (await response.json()) as Partial<SurveyResultsPayload> & { ok?: boolean };
        if (cancelled) return;
        if (data.stats) setStats(data.stats);
        if (Array.isArray(data.recentHabits)) setHabits(data.recentHabits);
        setConfigured(Boolean(data.configured));
        setUpdatedAt(new Date());
      } catch {
        if (!cancelled && !initial) {
          setStats(emptySurveyStats());
          setHabits([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [refreshToken, initial]);

  return (
    <section
      aria-labelledby="survey-results-heading"
      className="rounded-2xl border border-line bg-ink text-on-ink"
    >
      <div className="grain relative overflow-hidden rounded-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-[radial-gradient(circle,rgba(255,74,28,0.28),transparent_65%)] blur-2xl"
        />

        <div className="relative border-b border-white/10 px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="kicker flex items-center gap-2 text-on-ink-muted">
                <span
                  className="relative inline-flex size-2 shrink-0"
                  aria-hidden
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-ember/70" />
                  <span className="relative size-2 rounded-full bg-ember" />
                </span>
                {surveyCopy.resultsKicker}
              </p>
              <h2
                id="survey-results-heading"
                className="font-display mt-2 text-2xl font-extrabold tracking-[-0.035em] uppercase sm:text-3xl"
              >
                {surveyCopy.resultsTitle}
              </h2>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-baseline gap-2.5">
                <p className="kicker text-on-ink-muted">Responses</p>
                <p className="num font-display text-4xl font-extrabold tracking-tight text-ember">
                  {stats.total}
                </p>
              </div>
              {updatedAt ? (
                <p className="flex items-center gap-1.5 text-[0.68rem] text-on-ink-muted">
                  <RefreshCw
                    className={cn("size-3", loading && !reduced && "animate-spin")}
                    aria-hidden
                  />
                  Updated {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              ) : null}
            </div>
          </div>
          {!configured ? (
            <p className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[0.8rem] text-on-ink-muted">
              Live totals appear once Supabase is connected.
            </p>
          ) : null}
        </div>

        <div className="relative space-y-5 px-5 py-6 sm:space-y-6 sm:px-8 sm:py-8">
          {RESULT_BLOCKS.map((block) =>
            block.kind === "vote" ? (
              <VoteBar
                key={block.question.statsKey}
                index={block.index}
                label={shortLabel(block.question.label)}
                split={stats[block.question.statsKey]}
                reduced={Boolean(reduced)}
              />
            ) : (
              <CookingHabitsPulse
                key="habits"
                index={block.index}
                habits={habits}
                cooksAtHome={stats.cooks_at_home}
                reduced={Boolean(reduced)}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function VoteBar({
  index,
  label,
  split,
  reduced,
}: {
  index: number;
  label: string;
  split: VoteSplit;
  reduced: boolean;
}) {
  const yesPct = votePercent(split, "yes");
  const noPct = votePercent(split, "no");
  const winner = majorityLabel(split);
  const total = split.yes + split.no;
  const yesWins = winner === "Yes";
  const noWins = winner === "No";
  const isTie = winner === "Tie";
  const winningPct = yesWins ? yesPct : noWins ? noPct : Math.max(yesPct, noPct);

  return (
    <article className="rounded-xl border border-white/12 bg-white/[0.04] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="kicker text-on-ink-muted">{String(index).padStart(2, "0")}</p>
          <h3 className="mt-1.5 text-[1rem] leading-snug font-semibold tracking-tight text-on-ink sm:text-[1.05rem]">
            {label}
          </h3>
        </div>
        {total > 0 ? (
          <div
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.14em] uppercase",
              isTie
                ? "border border-white/20 bg-white/10 text-on-ink"
                : "bg-ember text-white",
            )}
          >
            {isTie ? "Tied" : `${winner} leads`}
          </div>
        ) : null}
      </div>

      {total === 0 ? (
        <p className="mt-5 text-sm text-on-ink-muted">No votes yet.</p>
      ) : (
        <>
          <div className="mt-5 flex items-end gap-3 sm:gap-4">
            <p
              className="num font-display text-[clamp(2.75rem,8vw,3.75rem)] leading-none font-extrabold tracking-[-0.06em] text-ember"
              aria-label={`Leading side ${winningPct} percent`}
            >
              {winningPct}
              <span className="text-[0.45em] tracking-normal">%</span>
            </p>
            <div className="pb-1.5">
              <p className="kicker text-on-ink-muted">Leading share</p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-on-ink">
                {isTie ? "Even split" : `${winner} · ${yesWins ? split.yes : split.no} of ${total}`}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
            <VoteSide
              side="Yes"
              count={split.yes}
              percent={yesPct}
              wins={yesWins}
              reduced={reduced}
            />
            <VoteSide
              side="No"
              count={split.no}
              percent={noPct}
              wins={noWins}
              reduced={reduced}
            />
          </div>

          <div
            className="mt-4 flex h-4 overflow-hidden rounded-full bg-white/10"
            role="img"
            aria-label={`Yes ${yesPct} percent, No ${noPct} percent`}
          >
            <motion.span
              className="h-full bg-ember"
              initial={reduced ? false : { flexGrow: 0 }}
              animate={{ flexGrow: Math.max(split.yes, 0.0001) }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{ flexBasis: 0 }}
            />
            <motion.span
              className="h-full bg-bone"
              initial={reduced ? false : { flexGrow: 0 }}
              animate={{ flexGrow: Math.max(split.no, 0.0001) }}
              transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ flexBasis: 0 }}
            />
          </div>
        </>
      )}
    </article>
  );
}

function VoteSide({
  side,
  count,
  percent,
  wins,
  reduced,
}: {
  side: "Yes" | "No";
  count: number;
  percent: number;
  wins: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-lg border px-3.5 py-3.5 sm:px-4 sm:py-4",
        wins
          ? "border-ember/55 bg-ember/20 shadow-[inset_0_0_0_1px_rgba(255,74,28,0.25)]"
          : "border-white/10 bg-ink/40",
      )}
    >
      <p
        className={cn(
          "kicker",
          wins ? "text-ember" : "text-on-ink-muted",
        )}
      >
        {side}
        {wins ? " · lead" : ""}
      </p>
      <p
        className={cn(
          "num font-display mt-2 text-[2rem] leading-none font-extrabold tracking-[-0.05em] sm:text-[2.35rem]",
          wins ? "text-on-ink" : "text-on-ink/55",
        )}
      >
        {percent}
        <span className="text-[0.5em]">%</span>
      </p>
      <p
        className={cn(
          "mt-2 text-[0.8rem] font-semibold tracking-tight",
          wins ? "text-on-ink" : "text-on-ink-muted",
        )}
      >
        <span className="num">{count}</span> vote{count === 1 ? "" : "s"}
      </p>
    </motion.div>
  );
}

const MEAL_THEMES = [
  { id: "breakfast", label: "Breakfast", pattern: /\bbreakfast\b/i },
  { id: "lunch", label: "Lunch", pattern: /\blunch\b/i },
  { id: "dinner", label: "Dinner", pattern: /\bdinner\b|\bsupper\b/i },
  { id: "weekdays", label: "Weekdays", pattern: /\bweekday|\bweek\s*day|\bmost\s+days\b/i },
  { id: "weekends", label: "Weekends", pattern: /\bweekend/i },
  { id: "every-meal", label: "Every meal", pattern: /\bevery\s+meal\b|\ball\s+(three\s+)?meals?\b/i },
  { id: "sometimes", label: "Sometimes", pattern: /\bsometimes\b|\boccasion/i },
  { id: "pasta", label: "Pasta", pattern: /\bpasta\b/i },
  { id: "eggs", label: "Eggs", pattern: /\beggs?\b/i },
] as const;

function CookingHabitsPulse({
  index,
  habits,
  cooksAtHome,
  reduced,
}: {
  index: number;
  habits: SurveyHabitSnippet[];
  cooksAtHome: VoteSplit;
  reduced: boolean;
}) {
  const themes = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    for (const theme of MEAL_THEMES) {
      counts.set(theme.id, { label: theme.label, count: 0 });
    }
    for (const habit of habits) {
      for (const theme of MEAL_THEMES) {
        if (theme.pattern.test(habit.text)) {
          const entry = counts.get(theme.id)!;
          entry.count += 1;
        }
      }
    }
    return Array.from(counts.values())
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [habits]);

  const uniqueAnswers = useMemo(() => {
    const seen = new Set<string>();
    const out: SurveyHabitSnippet[] = [];
    for (const habit of habits) {
      const key = habit.text.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(habit);
    }
    return out;
  }, [habits]);

  const [spotlight, setSpotlight] = useState(0);

  useEffect(() => {
    if (reduced || uniqueAnswers.length < 2) return;
    const timer = window.setInterval(() => {
      setSpotlight((current) => (current + 1) % uniqueAnswers.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [uniqueAnswers.length, reduced]);

  const active = uniqueAnswers[Math.min(spotlight, Math.max(uniqueAnswers.length - 1, 0))];
  const cooksYes = cooksAtHome.yes;
  const noteCount = uniqueAnswers.length;
  const topTheme = themes[0]?.label;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="kicker text-on-ink-muted">{String(index).padStart(2, "0")}</p>
          <p className="mt-1.5 text-[0.92rem] leading-snug font-medium tracking-tight text-on-ink">
            How often they cook &amp; which meals
          </p>
        </div>
        <div className="text-right">
          <p className="kicker text-on-ink-muted">Notes in</p>
          <p className="num mt-1 text-sm font-bold tracking-tight text-ember">
            {noteCount > 0 ? `${noteCount} voice${noteCount === 1 ? "" : "s"}` : "—"}
          </p>
        </div>
      </div>

      {noteCount === 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-on-ink-muted">
          No cooking notes yet
          {cooksYes > 0 ? ` — ${cooksYes} people said they cook at home.` : "."}
        </p>
      ) : (
        <>
          <div className="mt-4 min-h-[4.5rem]">
            <p className="kicker text-on-ink-muted">In their words</p>
            <motion.p
              key={active?.id ?? "empty"}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-display mt-2 text-[1.15rem] leading-snug font-extrabold tracking-[-0.03em] text-on-ink sm:text-[1.25rem]"
            >
              &ldquo;{active?.text}&rdquo;
            </motion.p>
          </div>

          {themes.length > 0 ? (
            <div className="mt-5">
              <p className="kicker text-on-ink-muted">
                Meal patterns{topTheme ? ` · ${topTheme} leads` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {themes.map((theme, themeIndex) => {
                  const weight = theme.count / Math.max(themes[0]?.count ?? 1, 1);
                  return (
                    <motion.span
                      key={theme.label}
                      initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: themeIndex * 0.04,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                        weight >= 0.75
                          ? "border-ember/50 bg-ember/15 text-on-ink"
                          : "border-white/12 bg-white/[0.04] text-on-ink/85",
                      )}
                      style={{
                        fontSize: `${0.72 + weight * 0.22}rem`,
                      }}
                    >
                      <span className="font-semibold tracking-tight">{theme.label}</span>
                      <span className="num text-[0.7em] text-ember">{theme.count}</span>
                    </motion.span>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            <p className="kicker text-on-ink-muted">All answers</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {uniqueAnswers.map((habit, habitIndex) => {
                const featured = habit.id === active?.id;
                return (
                  <motion.button
                    key={habit.id}
                    type="button"
                    onClick={() => setSpotlight(habitIndex)}
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: habitIndex * 0.03,
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      "max-w-full rounded-full border px-3 py-1.5 text-left text-[0.72rem] leading-snug transition-colors",
                      featured
                        ? "border-ember/60 bg-ember/20 text-on-ink"
                        : "border-white/10 bg-transparent text-on-ink-muted hover:border-white/25 hover:text-on-ink",
                    )}
                  >
                    <span className="line-clamp-2">{habit.text}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Keep result labels readable without repeating the full Google Form wording. */
function shortLabel(label: string): string {
  if (label.startsWith("Would you try")) return "Would try a ~€6 high-protein quick lunch";
  if (label.startsWith("Do you cook")) return "Cooks food for themselves at home";
  if (label.startsWith("Do you eat out often")) return "Eats out often because cooking feels like work";
  if (label.startsWith("Do you often end up")) return "Often ends up with junk food when eating out";
  if (label.startsWith("Do you pack")) return "Packs lunch to uni";
  return label;
}
