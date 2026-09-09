"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Droplets } from "lucide-react";
import { accentVars } from "@/lib/accents";
import type { FlavorAccent } from "@/lib/types";
import { cn } from "@/lib/utils";

type StageId = "cooked" | "dried" | "pouch";

/**
 * Shows what "we remove the water" means in grams.
 *
 * Deliberately arithmetic rather than scientific: the dry weight and the
 * water volume both come from the product data, so the bar is just the
 * same meal drawn three times at the same scale. No shelf-life or
 * stability claim is made or implied here.
 */
export function WaterCycle({
  dryWeightG,
  waterMl,
  accent = "cheddar",
  className,
}: {
  dryWeightG: number;
  waterMl: number;
  accent?: FlavorAccent;
  className?: string;
}) {
  const reducedRaw = useReducedMotion();
  const reduced = reducedRaw === true;
  const [stage, setStage] = useState<StageId>("cooked");

  const cookedTotal = dryWeightG + waterMl;

  const stages: {
    id: StageId;
    label: string;
    water: number;
    caption: string;
  }[] = [
    {
      id: "cooked",
      label: "Cooked",
      water: waterMl,
      caption: `A cooked bowl of this meal is roughly ${cookedTotal} g, and about ${Math.round((waterMl / cookedTotal) * 100)}% of that is water. Water is the heaviest thing in it and the least interesting.`,
    },
    {
      id: "dried",
      label: "Dried",
      water: 0,
      caption: `Take the water out and ${dryWeightG} g is left — the food. That is what goes in the pouch, which is why a meal can live flat in a drawer instead of upright in a fridge.`,
    },
    {
      id: "pouch",
      label: "In the pouch",
      water: waterMl,
      caption: `Add ${waterMl} ml of just-boiled water and you are back to ${cookedTotal} g of dinner. You supplied the heaviest ingredient yourself, from a tap.`,
    },
  ];

  const current = stages.find((entry) => entry.id === stage) ?? stages[0];
  const total = dryWeightG + current.water;
  const barWidth = (total / cookedTotal) * 100;
  const foodShare = (dryWeightG / total) * 100;

  return (
    <div
      className={cn("rounded-2xl border border-line bg-bone-100 p-6 sm:p-8", className)}
      style={accentVars(accent)}
    >
      <div
        role="group"
        aria-label="Stage of the meal"
        className="flex flex-wrap gap-1.5 rounded-full border border-line bg-bone p-1.5"
      >
        {stages.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setStage(entry.id)}
            aria-pressed={stage === entry.id}
            className={cn(
              "press h-10 flex-1 rounded-full px-4 text-[0.8125rem] font-semibold tracking-tight whitespace-nowrap",
              stage === entry.id
                ? "bg-ink text-on-ink"
                : "text-fg-muted hover:bg-ink/[0.05] hover:text-ink",
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="kicker text-fg-subtle">Weight in your hand</p>
          <p className="num font-display mt-1.5 text-[length:var(--text-display-xs)] leading-none font-extrabold tracking-tight tabular-nums">
            {total}
            <span className="text-[0.4em]"> g</span>
          </p>
        </div>
        <motion.div
          className="flex items-center gap-1.5 text-fg-subtle"
          animate={{ opacity: current.water === 0 ? 0.3 : 1 }}
          transition={reduced ? { duration: 0 } : { duration: 0.4 }}
        >
          <Droplets className="size-4" aria-hidden />
          <span className="num text-sm font-semibold tabular-nums">
            {current.water} ml
          </span>
        </motion.div>
      </div>

      {/* Same scale for all three states, so the shrink is the point */}
      <div className="mt-4 h-14 w-full rounded-md border border-dashed border-line-strong/70 p-1.5">
        <motion.div
          className="flex h-full overflow-hidden rounded-sm"
          animate={{ width: `${barWidth}%` }}
          transition={reduced ? { duration: 0 } : { duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="h-full shrink-0"
            style={{ backgroundColor: "var(--accent)" }}
            animate={{ width: `${foodShare}%` }}
            transition={reduced ? { duration: 0 } : { duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="h-full flex-1 bg-[linear-gradient(180deg,rgba(120,172,215,0.55),rgba(84,140,190,0.8))]" />
        </motion.div>
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <dt className="text-[0.8125rem] text-fg-muted">Food</dt>
          <dd className="num text-[0.8125rem] font-bold tabular-nums">{dryWeightG} g</dd>
        </div>
        <div className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full bg-[rgba(84,140,190,0.8)]" />
          <dt className="text-[0.8125rem] text-fg-muted">Water</dt>
          <dd className="num text-[0.8125rem] font-bold tabular-nums">{current.water} g</dd>
        </div>
      </dl>

      <p aria-live="polite" className="mt-6 min-h-[4.5rem] text-[0.9375rem] leading-relaxed text-fg-muted">
        {current.caption}
      </p>
    </div>
  );
}
