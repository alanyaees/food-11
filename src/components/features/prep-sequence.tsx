"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { accents } from "@/lib/accents";
import { brand } from "@/lib/brand";
import type { FlavorAccent } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface PrepStage {
  id: string;
  index: string;
  title: string;
  body: string;
}

export const prepStages: PrepStage[] = [
  { id: "tear", index: "01", title: "Tear", body: "Open your pouch. It's also your bowl." },
  { id: "pour", index: "02", title: "Pour", body: "Add hot water to the fill line." },
  { id: "destroy", index: "03", title: "Destroy", body: "Wait three minutes. Then eat all of it." },
];

/**
 * The interactive preparation sequence: a CSS/SVG pouch that tears,
 * fills, steams and finishes. Auto-advances, pauses on interaction,
 * and drops straight to the finished state for reduced-motion users.
 */
export function PrepSequence({
  accent = "cheddar",
  prepMinutes = 3,
  className,
}: {
  accent?: FlavorAccent;
  prepMinutes?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const tone = accents[accent];

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setTimeout(() => setStage((current) => (current + 1) % 3), 3600);
    return () => window.clearTimeout(timer);
  }, [stage, playing, reduced]);

  const waterHeight = stage === 0 ? 0 : stage === 1 ? 46 : 62;
  const secondsLeft = stage < 2 ? prepMinutes * 60 : 0;

  return (
    <div className={cn("grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]", className)}>
      {/* Stage */}
      <div className="relative">
        <div className="relative mx-auto aspect-4/5 w-full max-w-sm">
          <div
            aria-hidden
            className="absolute inset-x-6 bottom-4 h-10 rounded-[50%] bg-ink/15 blur-2xl"
          />

          {/* Pouch */}
          <div className="absolute inset-x-[16%] top-[8%] bottom-[6%] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(158deg,#26262a,#101012_60%,#191919)] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            {/* water / food fill */}
            <motion.div
              className="absolute inset-x-0 bottom-0"
              initial={false}
              animate={{ height: `${waterHeight}%` }}
              transition={{ duration: reduced ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background:
                  stage === 1
                    ? "linear-gradient(180deg, rgba(226,240,248,0.55), rgba(180,205,220,0.28))"
                    : `linear-gradient(180deg, ${tone.base}, color-mix(in oklab, ${tone.base} 70%, black))`,
              }}
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-white/40" />
              {stage === 2 ? (
                <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22)_0_5px,rgba(0,0,0,0.06)_5px_11px)] opacity-60 mix-blend-soft-light" />
              ) : null}
            </motion.div>

            {/* Pack artwork, so the stage still reads as our packaging */}
            <div className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-7">
              <p className="font-display text-2xl leading-none font-extrabold tracking-[-0.06em] text-white uppercase">
                {brand.name.replace(".", "")}
                <span style={{ color: tone.base }}>.</span>
              </p>
              <p className="kicker mt-2 text-[0.55rem] text-white/50">
                {accents[accent].label} · single serve
              </p>
            </div>

            {/* fill line */}
            <div
              aria-hidden
              className="absolute inset-x-[14%] bottom-[62%] flex items-center gap-2 border-t border-dashed border-white/35 pt-1"
            >
              <span className="kicker text-[0.55rem] text-white/45">fill line</span>
            </div>

            {/* pouring water */}
            <AnimatePresence>
              {stage === 1 && !reduced ? (
                <motion.div
                  key="stream"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-0 left-1/2 h-[54%] w-2.5 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-white/70 to-white/25 blur-[1px]"
                />
              ) : null}
            </AnimatePresence>

            {/* steam */}
            <AnimatePresence>
              {stage === 2 ? (
                <motion.div
                  key="steam"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-x-[22%] top-[6%] h-[34%]"
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="absolute bottom-0 h-full w-1/3 animate-steam rounded-full bg-white/45 blur-lg"
                      style={{ left: `${i * 33}%`, animationDelay: `${i * 0.9}s` }}
                    />
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* torn top seal */}
          <motion.div
            aria-hidden
            initial={false}
            animate={
              stage === 0
                ? { y: 0, rotate: 0, opacity: 1 }
                : { y: -26, rotate: -13, opacity: 0, x: 34 }
            }
            transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-[12%] top-[4%] h-[7%] rounded-t-[1.6rem] bg-[linear-gradient(180deg,#33333a,#1c1c1f)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
          >
            <div className="h-full w-full rounded-t-[1.6rem] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.14)_0_3px,transparent_3px_7px)] opacity-70" />
          </motion.div>

          {/* timer readout */}
          <div className="absolute right-0 bottom-[2%] rounded-lg border border-line bg-bone-100/90 px-3 py-2 backdrop-blur-sm">
            <p className="kicker text-[0.55rem] text-fg-subtle">
              {stage === 2 ? "Done" : "Timer"}
            </p>
            <p className="num text-lg font-bold tracking-tight">
              {stage === 2
                ? "EAT"
                : `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
                    secondsLeft % 60,
                  ).padStart(2, "0")}`}
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div>
        <ol className="divide-y divide-line border-y border-line">
          {prepStages.map((item, index) => {
            const active = stage === index;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setStage(index);
                    setPlaying(false);
                  }}
                  aria-current={active}
                  className="group flex w-full items-start gap-5 py-6 text-left sm:gap-7"
                >
                  <span
                    className={cn(
                      "num font-display shrink-0 text-2xl leading-none font-extrabold transition-colors sm:text-3xl",
                      active ? "text-ink" : "text-fg-subtle/50 group-hover:text-fg-muted",
                    )}
                  >
                    {item.index}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "font-display block text-[length:var(--text-display-xs)] leading-none font-extrabold tracking-[-0.04em] uppercase transition-colors",
                        active ? "text-ink" : "text-fg-subtle/60 group-hover:text-fg-muted",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "mt-2 block max-w-sm text-sm leading-relaxed transition-colors",
                        active ? "text-fg-muted" : "text-fg-subtle",
                      )}
                    >
                      {item.body}
                    </span>
                    <span
                      aria-hidden
                      className="mt-4 block h-[2px] w-full overflow-hidden rounded-full bg-line"
                    >
                      <motion.span
                        className="block h-full rounded-full"
                        style={{ backgroundColor: tone.base }}
                        initial={false}
                        animate={{ width: active ? "100%" : "0%" }}
                        transition={{
                          duration: active && playing && !reduced ? 3.6 : 0.3,
                          ease: "linear",
                        }}
                      />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="press inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-xs font-semibold hover:border-ink"
            aria-label={playing ? "Pause preparation animation" : "Play preparation animation"}
          >
            {playing ? (
              <Pause className="size-3.5" aria-hidden />
            ) : (
              <Play className="size-3.5" aria-hidden />
            )}
            {playing ? "Pause" : "Play"}
          </button>
          <p className="text-xs text-fg-subtle">
            Exact water volume and timing are printed on each pouch. Concept values while we finish
            formulations.
          </p>
        </div>
      </div>
    </div>
  );
}
