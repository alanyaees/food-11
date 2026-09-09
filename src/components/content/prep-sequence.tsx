"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { accentVars } from "@/lib/accents";
import type { FlavorAccent } from "@/lib/types";
import { clamp, cn } from "@/lib/utils";

export interface PrepStepCopy {
  id: string;
  label: string;
  title: string;
  detail: string;
  seconds: number;
}

/** How long each step is shown when the sequence plays itself. */
const STEP_MS = [2400, 3000, 5800, 2600, 3600];

/* Fill heights as a percentage of the pouch cavity, per step. */
const WATER_LEVEL = [0, 58, 58, 52, 52];

function clock(totalSeconds: number) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * The preparation sequence, as an actual sequence.
 *
 * A CSS pouch drawn in technical-illustration style fills with water,
 * steams and settles while a timer counts the standing period down at
 * demo speed. Everything is state-driven, so the step list beside it is
 * the control surface as well as the accessible transcript — with
 * reduced motion the autoplay never starts and each state is applied
 * instantly instead.
 */
export function PrepSequence({
  steps,
  waterMl,
  prepMinutes,
  protein,
  calories,
  accent = "cheddar",
  className,
}: {
  steps: readonly PrepStepCopy[];
  waterMl: number;
  prepMinutes: number;
  protein: number;
  calories: number;
  accent?: FlavorAccent;
  className?: string;
}) {
  const reducedRaw = useReducedMotion();
  const reduced = reducedRaw === true;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [poured, setPoured] = useState(0);
  const waitSeconds = prepMinutes * 60;
  const [remaining, setRemaining] = useState(waitSeconds);

  const isPouring = index === 1;
  const isWaiting = index === 2;
  const isStirring = index === 3;
  const isDone = index === 4;
  const running = playing && !reduced;

  /* Autoplay. Restarts the current step's timer after a pause, which is
     what a reader expects from a demo loop. */
  useEffect(() => {
    if (!running) return;
    const timeout = window.setTimeout(
      () => setIndex((current) => (current + 1) % steps.length),
      STEP_MS[index] ?? 3000,
    );
    return () => window.clearTimeout(timeout);
  }, [index, running, steps.length]);

  /* Water volume readout while pouring. */
  useEffect(() => {
    if (index < 1) {
      setPoured(0);
      return;
    }
    if (index > 1 || !running) {
      setPoured(waterMl);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = (STEP_MS[1] ?? 3000) * 0.8;
    const tick = (now: number) => {
      const progress = clamp((now - start) / duration, 0, 1);
      setPoured(Math.round(waterMl * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, running, waterMl]);

  /* Standing-time countdown, compressed to demo speed. */
  useEffect(() => {
    if (index < 2) {
      setRemaining(waitSeconds);
      return;
    }
    if (index > 2) {
      setRemaining(0);
      return;
    }
    if (!running) {
      setRemaining(waitSeconds);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = STEP_MS[2] ?? 5800;
    const tick = (now: number) => {
      const progress = clamp((now - start) / duration, 0, 1);
      setRemaining(waitSeconds * (1 - progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, running, waitSeconds]);

  const speedLabel = useMemo(() => {
    const factor = Math.round(waitSeconds / ((STEP_MS[2] ?? 5800) / 1000));
    return `${factor}×`;
  }, [waitSeconds]);

  const go = (next: number) => {
    setPlaying(false);
    setIndex((next + steps.length) % steps.length);
  };

  const transition: Transition = reduced
    ? { duration: 0 }
    : { duration: 0.75, ease: [0.16, 1, 0.3, 1] };

  return (
    <div
      className={cn(
        "grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16",
        className,
      )}
      style={accentVars(accent)}
    >
      {/* ── Stage ─────────────────────────────────────────── */}
      <div className="min-w-0 rounded-2xl border border-line bg-bone-100 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker text-fg-subtle">Standing time</p>
            <p className="num font-display mt-1 text-4xl leading-none font-extrabold tracking-tight tabular-nums sm:text-5xl">
              {clock(remaining)}
            </p>
          </div>
          <div className="text-right">
            <p className="kicker text-fg-subtle">Water</p>
            <p className="num font-display mt-1 text-2xl leading-none font-extrabold tracking-tight tabular-nums">
              {poured}
              <span className="text-sm font-bold"> ml</span>
            </p>
          </div>
        </div>
        <p className="mt-2 text-[0.7rem] text-fg-subtle">
          {reduced
            ? `Real standing time is ${prepMinutes} minutes.`
            : `Shown at ${speedLabel} speed — the real wait is ${prepMinutes} minutes.`}
        </p>

        {/* Pouch illustration */}
        <div aria-hidden className="@container relative mx-auto mt-6 w-full max-w-[14rem] pt-16">
          {/* steam */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16">
            {[0, 1, 2].map((wisp) => (
              <motion.span
                key={wisp}
                className="absolute bottom-0 block size-8 rounded-full bg-ink/12 blur-md"
                style={{ left: `${28 + wisp * 20}%` }}
                animate={
                  reduced
                    ? { opacity: isWaiting || isDone ? 0.5 : 0 }
                    : isWaiting || isDone
                      ? { opacity: [0, 0.55, 0], y: [6, -46], scale: [0.7, 1.35] }
                      : { opacity: 0, y: 6, scale: 0.7 }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        duration: 3.6,
                        repeat: isWaiting || isDone ? Infinity : 0,
                        delay: wisp * 0.7,
                        ease: "easeOut",
                      }
                }
              />
            ))}
          </div>

          {/* pouring stream */}
          <motion.span
            className="absolute top-1 left-1/2 block h-16 w-[5px] origin-top -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(120,170,215,0),rgba(96,150,200,0.85))]"
            animate={{ scaleY: isPouring ? 1 : 0, opacity: isPouring ? 1 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
          />

          {/* tear-away strip */}
          <motion.span
            className="absolute top-[3.25rem] left-[6%] block h-[1.15rem] w-[88%] rounded-t-[0.4rem] border border-ink/25 border-b-0 bg-[repeating-linear-gradient(90deg,var(--color-bone-300)_0_3px,var(--color-bone-100)_3px_7px)]"
            animate={
              index === 0 && !reduced
                ? { y: [0, -3, -30], rotate: [0, -2, -13], opacity: [1, 1, 0] }
                : index === 0
                  ? { y: 0, rotate: 0, opacity: 1 }
                  : { y: -30, rotate: -13, opacity: 0 }
            }
            transition={reduced ? { duration: 0 } : { duration: 1.5, times: [0, 0.25, 1] }}
          />

          <div className="relative aspect-[3/4]">
            {/* body */}
            <div className="absolute inset-0 overflow-hidden rounded-[1.4rem] border border-ink/25 bg-bone">
              {/* technical grid */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg,rgba(14,14,12,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(14,14,12,0.06) 1px,transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />

              {/* water */}
              <motion.div
                className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(120,172,215,0.5),rgba(84,140,190,0.72))]"
                animate={{
                  height: `${WATER_LEVEL[index] ?? 0}%`,
                  opacity: index >= 3 ? 0 : 1,
                }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: isPouring ? 1.9 : 0.7, ease: [0.16, 1, 0.3, 1] }
                }
              >
                <span className="absolute inset-x-0 top-0 h-[2px] bg-white/70" />
              </motion.div>

              {/* the meal itself */}
              <motion.div
                className="absolute inset-x-0 bottom-0"
                animate={{
                  height: `${WATER_LEVEL[index] ?? 0}%`,
                  opacity: index >= 3 ? 1 : 0,
                }}
                transition={reduced ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in oklab, var(--accent) 78%, white) 0%, var(--accent) 100%)",
                }}
              >
                <span className="absolute inset-x-0 top-0 h-[2px] bg-white/60" />
                <motion.span
                  className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.28)_0_5px,rgba(0,0,0,0.06)_5px_11px)] opacity-60 mix-blend-soft-light"
                  animate={reduced ? undefined : { rotate: isStirring ? [0, 8, -6, 0] : 0 }}
                  transition={{ duration: 2.2, repeat: isStirring ? Infinity : 0 }}
                />
              </motion.div>

              {/* fill line */}
              <div className="absolute inset-x-0 top-[42%] flex items-center gap-2 px-3">
                <span className="h-0 flex-1 border-t border-dashed border-ink/35" />
                <span className="kicker text-[0.5rem] text-fg-subtle">Fill</span>
              </div>

              {/* gusset + side seams */}
              <span className="absolute inset-x-0 bottom-[9%] h-0 border-t border-dashed border-ink/20" />
              <span className="absolute inset-y-0 left-[7%] w-0 border-l border-dashed border-ink/15" />
              <span className="absolute inset-y-0 right-[7%] w-0 border-r border-dashed border-ink/15" />

              {/* zip */}
              <div className="absolute inset-x-[6%] top-[7%] h-[3px] rounded-full bg-[repeating-linear-gradient(90deg,rgba(14,14,12,0.4)_0_3px,transparent_3px_6px)]" />
            </div>

            {/* stirring utensil */}
            <motion.span
              className="absolute top-[6%] left-1/2 block h-[62%] w-[7px] origin-top -translate-x-1/2 rounded-full bg-ink/70"
              animate={
                reduced
                  ? { opacity: isStirring ? 1 : 0, rotate: 0 }
                  : isStirring
                    ? { opacity: 1, rotate: [0, 13, -13, 0] }
                    : { opacity: 0, rotate: 0 }
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 1.8, repeat: isStirring ? Infinity : 0, ease: "easeInOut" }
              }
            />

            {/* finished chip */}
            <motion.div
              className="glass absolute -right-3 bottom-[16%] rounded-lg px-3 py-2 shadow-[0_12px_30px_-16px_rgba(0,0,0,0.35)]"
              animate={{ opacity: isDone ? 1 : 0, y: isDone ? 0 : 8 }}
              transition={transition}
            >
              <p className="kicker text-[0.55rem] text-fg-subtle">Per pouch</p>
              <p className="num text-sm font-bold tracking-tight">
                {protein}g · {calories} kcal
              </p>
            </motion.div>
          </div>
        </div>

        {/* Progress + controls */}
        <div className="mt-6 flex items-center gap-1.5" aria-hidden>
          {steps.map((step, stepIndex) => (
            <span
              key={step.id}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-500",
                stepIndex <= index ? "bg-ink" : "bg-bone-300",
              )}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="kicker text-fg-subtle">
            Step {index + 1} / {steps.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="press grid size-11 place-items-center rounded-full border border-line-strong/70 text-ink hover:border-ink"
              aria-label="Previous step"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            {reduced ? null : (
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                className="press grid size-11 place-items-center rounded-full bg-ink text-on-ink hover:bg-ink-700"
                aria-label={playing ? "Pause the sequence" : "Play the sequence"}
              >
                {playing ? (
                  <Pause className="size-4" aria-hidden />
                ) : (
                  <Play className="size-4" aria-hidden />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="press grid size-11 place-items-center rounded-full border border-line-strong/70 text-ink hover:border-ink"
              aria-label="Next step"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* ── Steps: control surface and transcript in one ───── */}
      <ol className="min-w-0 divide-y divide-line border-t border-line">
        {steps.map((step, stepIndex) => {
          const isActive = stepIndex === index;
          return (
            <li key={step.id} aria-current={isActive ? "step" : undefined}>
              <button
                type="button"
                onClick={() => go(stepIndex)}
                className="group flex w-full items-start gap-5 py-5 text-left sm:gap-7 sm:py-6"
              >
                <span
                  className={cn(
                    "num font-display shrink-0 text-2xl leading-none font-extrabold tracking-tight transition-colors sm:text-3xl",
                    isActive ? "text-ember" : "text-fg-subtle/60 group-hover:text-fg-muted",
                  )}
                >
                  0{stepIndex + 1}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={cn(
                        "font-display text-lg font-extrabold tracking-[-0.03em] uppercase transition-colors sm:text-xl",
                        isActive ? "text-ink" : "text-fg-muted group-hover:text-ink",
                      )}
                    >
                      {step.label}
                    </span>
                    {step.seconds > 0 ? (
                      <span className="num text-[0.7rem] text-fg-subtle">
                        {step.seconds >= 60 ? `${Math.round(step.seconds / 60)} min` : `${step.seconds} sec`}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1.5 block text-[0.9375rem] font-semibold tracking-tight text-ink/85">
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 block max-w-prose text-[0.875rem] leading-relaxed transition-colors",
                      isActive ? "text-fg-muted" : "text-fg-subtle",
                    )}
                  >
                    {step.detail}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
