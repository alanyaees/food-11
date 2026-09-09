"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMacroMode } from "@/components/providers/macro-mode-provider";
import { MacroModeToggle } from "@/components/features/macro-mode-toggle";
import { accentVars } from "@/lib/accents";
import type { Product } from "@/lib/types";
import { cn, macroSplit, proteinDensity } from "@/lib/utils";

/** Product-page macro panel. Normal mode = the six numbers people ask for. */
export function MacroGrid({ product, className }: { product: Product; className?: string }) {
  const { isNerd } = useMacroMode();
  const n = product.nutrition;
  const split = macroSplit(n);

  const primary = [
    { label: "Protein", value: `${n.protein}`, unit: "g", accent: true },
    { label: "Calories", value: `${n.calories}`, unit: "kcal" },
    { label: "Carbs", value: `${n.carbs}`, unit: "g" },
    { label: "Fat", value: `${n.fat}`, unit: "g" },
    { label: "Fibre", value: `${n.fibre}`, unit: "g" },
    { label: "Prep", value: `${product.prepMinutes}`, unit: "min" },
  ];

  const nerd = [
    { label: "Protein / 100 kcal", value: `${proteinDensity(n.protein, n.calories)} g` },
    { label: "Energy from protein", value: `${split.protein}%` },
    { label: "Serving weight (dry)", value: `${n.servingWeightG} g` },
    { label: "Water to add", value: `${product.waterMl} ml` },
    { label: "Saturates", value: `${n.saturates} g` },
    { label: "Salt", value: `${n.saltG} g` },
  ];

  return (
    <div className={cn("", className)} style={accentVars(product.accent)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="kicker text-fg-subtle">Per pouch · concept values</p>
        <MacroModeToggle compact />
      </div>
      <dl className="grid grid-cols-3 overflow-hidden rounded-xl border border-line bg-bone-100">
        {primary.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "border-line p-4",
              index % 3 !== 2 && "border-r",
              index < 3 && "border-b",
            )}
          >
            <dt className="kicker text-fg-subtle">{stat.label}</dt>
            <dd
              className="num font-display mt-1.5 text-2xl leading-none font-extrabold tracking-tight"
              style={stat.accent ? { color: "var(--accent-ink)" } : undefined}
            >
              {stat.value}
              <span className="ml-0.5 text-xs font-bold tracking-normal">{stat.unit}</span>
            </dd>
          </div>
        ))}
      </dl>

      <AnimatePresence initial={false}>
        {isNerd ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <dl className="mt-3 grid gap-x-6 gap-y-1 rounded-xl border border-line bg-bone-200/50 p-4 sm:grid-cols-2">
              {nerd.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-3 border-b border-line/70 py-1.5 last:border-0"
                >
                  <dt className="text-xs text-fg-muted">{row.label}</dt>
                  <dd className="num text-xs font-bold">{row.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
