"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { accentVars } from "@/lib/accents";
import { disclaimers } from "@/lib/brand";
import type { Product } from "@/lib/types";
import { cn, macroSplit, proteinDensity } from "@/lib/utils";
import { DisclaimerNote } from "@/components/ui/concept-badge";
import { useMacroMode } from "@/components/providers/macro-mode-provider";
import { MacroModeToggle } from "@/components/features/macro-mode-toggle";

type Tab = "macros" | "ingredients" | "micros";

const tabs: { id: Tab; label: string }[] = [
  { id: "macros", label: "Macros" },
  { id: "ingredients", label: "Ingredients" },
  { id: "micros", label: "Micronutrients" },
];

/**
 * The oversized, interactive "turn the packet around" panel. Shared by
 * the homepage transparency section, the product page and the nutrition
 * page. Reveals extra detail in Macro Nerd mode.
 */
export function NutritionLabel({
  product,
  className,
  showModeToggle = true,
  defaultTab = "macros",
}: {
  product: Product;
  className?: string;
  showModeToggle?: boolean;
  defaultTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const { isNerd } = useMacroMode();
  const n = product.nutrition;
  const split = macroSplit(n);
  const density = proteinDensity(n.protein, n.calories);

  const macroRows = [
    { label: "Energy", value: `${n.calories} kcal`, strong: true },
    { label: "Protein", value: `${n.protein} g`, strong: true, accent: true },
    { label: "Carbohydrate", value: `${n.carbs} g` },
    { label: "— of which sugars", value: `${n.sugars} g`, indent: true },
    { label: "Fat", value: `${n.fat} g` },
    { label: "— of which saturates", value: `${n.saturates} g`, indent: true },
    { label: "Fibre", value: `${n.fibre} g`, strong: true },
    { label: "Salt", value: `${n.saltG} g` },
  ];

  const nerdRows = [
    { label: "Protein per 100 kcal", value: `${density} g` },
    { label: "Energy from protein", value: `${split.protein}%` },
    { label: "Energy from carbohydrate", value: `${split.carbs}%` },
    { label: "Energy from fat", value: `${split.fat}%` },
    { label: "Serving weight (dry)", value: `${n.servingWeightG} g` },
    { label: "Water to add", value: `${product.waterMl} ml` },
    {
      label: "Energy density (prepared)",
      value: `${Math.round((n.calories / (n.servingWeightG + product.waterMl)) * 100)} kcal / 100 g`,
    },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-ink bg-bone-100 shadow-[10px_10px_0_0_rgba(14,14,12,0.08)]",
        className,
      )}
      style={accentVars(product.accent)}
    >
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink px-5 py-5 sm:px-7">
        <div>
          <p className="kicker text-fg-subtle">Nutrition — per pouch</p>
          <h3 className="font-display mt-1.5 text-2xl leading-none tracking-tight uppercase sm:text-3xl">
            {product.line} — {product.flavor}
          </h3>
        </div>
        <div className="text-right">
          <p className="kicker text-fg-subtle">Serving</p>
          <p className="num mt-1 text-sm font-bold">{n.servingWeightG} g dry</p>
        </div>
      </header>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-line px-3 py-2 sm:px-5">
        <div role="tablist" aria-label="Nutrition detail" className="flex gap-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={tab === item.id}
              aria-controls={`nutrition-panel-${item.id}`}
              id={`nutrition-tab-${item.id}`}
              onClick={() => setTab(item.id)}
              className={cn(
                "press relative rounded-full px-4 py-2 text-xs font-bold tracking-tight whitespace-nowrap uppercase transition-colors",
                tab === item.id ? "text-on-ink" : "text-fg-muted hover:text-ink",
              )}
            >
              {tab === item.id ? (
                <motion.span
                  layoutId={`nutrition-tab-${product.slug}`}
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </div>
        {showModeToggle ? (
          <div className="ml-auto hidden sm:block">
            <MacroModeToggle compact />
          </div>
        ) : null}
      </div>

      <div className="px-5 py-6 sm:px-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            id={`nutrition-panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`nutrition-tab-${tab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === "macros" ? (
              <div>
                <div className="mb-6 flex h-4 overflow-hidden rounded-full bg-bone-300">
                  <span
                    className="h-full"
                    style={{ width: `${split.protein}%`, backgroundColor: "var(--accent)" }}
                    aria-hidden
                  />
                  <span
                    className="h-full bg-ink/35"
                    style={{ width: `${split.carbs}%` }}
                    aria-hidden
                  />
                  <span
                    className="h-full bg-ink/15"
                    style={{ width: `${split.fat}%` }}
                    aria-hidden
                  />
                </div>
                <dl>
                  {macroRows.map((row) => (
                    <div
                      key={row.label}
                      className={cn(
                        "flex items-baseline justify-between gap-4 border-b border-line py-2.5",
                        row.strong && "border-ink/25",
                      )}
                    >
                      <dt
                        className={cn(
                          "text-sm",
                          row.indent && "pl-4 text-fg-muted",
                          row.strong && "font-bold tracking-tight",
                        )}
                      >
                        {row.label}
                      </dt>
                      <dd
                        className={cn(
                          "num text-sm tabular-nums",
                          row.strong && "font-bold",
                          row.accent && "font-display text-xl font-extrabold",
                        )}
                        style={row.accent ? { color: "var(--accent-ink)" } : undefined}
                      >
                        {row.value}
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
                      <div className="mt-6 rounded-lg border border-line bg-bone-200/60 p-4">
                        <p className="kicker text-fg-subtle">Macro nerd mode</p>
                        <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                          {nerdRows.map((row) => (
                            <div
                              key={row.label}
                              className="flex items-baseline justify-between gap-3 border-b border-line/70 py-1.5"
                            >
                              <dt className="text-xs text-fg-muted">{row.label}</dt>
                              <dd className="num text-xs font-bold">{row.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}

            {tab === "ingredients" ? (
              <div>
                <ul className="space-y-4">
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient.name} className="border-b border-line pb-4 last:border-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="text-sm font-bold tracking-tight">{ingredient.name}</h4>
                        {isNerd && ingredient.share ? (
                          <span className="num text-xs text-fg-subtle">≈{ingredient.share}%</span>
                        ) : null}
                      </div>
                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-fg-muted">
                        {ingredient.why}
                      </p>
                      {isNerd && ingredient.share ? (
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bone-300">
                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${ingredient.share}%`,
                              backgroundColor: "var(--accent)",
                            }}
                          />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-lg bg-bone-200/70 p-4">
                  <p className="kicker text-fg-subtle">Allergens</p>
                  <p className="mt-2 text-sm font-medium">{product.allergens.join(" · ")}</p>
                  <p className="mt-2 text-xs text-fg-subtle">
                    Full legal ingredient declarations and allergen handling statements will appear
                    on pack once formulations are finalised and analysed.
                  </p>
                </div>
              </div>
            ) : null}

            {tab === "micros" ? (
              <div>
                <ul className="space-y-3">
                  {n.micronutrients.map((micro) => (
                    <li key={micro.label}>
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="text-sm font-semibold tracking-tight">{micro.label}</p>
                        <p className="num text-sm">
                          {micro.amount}
                          {micro.nrv ? (
                            <span className="ml-2 text-xs text-fg-muted">{micro.nrv}% NRV</span>
                          ) : null}
                        </p>
                      </div>
                      {micro.nrv ? (
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bone-300">
                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${Math.min(100, micro.nrv)}%`,
                              backgroundColor: "var(--accent)",
                            }}
                          />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-fg-subtle">
                  NRV = EU Nutrient Reference Value. Figures match the published nutrition panel for this meal.
                </p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="border-t border-line bg-bone-200/50 px-5 py-4 sm:px-7">
        <DisclaimerNote>{disclaimers.conceptLong}</DisclaimerNote>
      </footer>
    </div>
  );
}
