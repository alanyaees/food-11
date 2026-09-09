"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { accents } from "@/lib/accents";
import { disclaimers } from "@/lib/brand";
import { getProducts, referenceMeals } from "@/lib/products";
import { cn, proteinDensity } from "@/lib/utils";
import { ConceptBadge, DisclaimerNote } from "@/components/ui/concept-badge";
import { Button } from "@/components/ui/button";

type MetricKey = "protein" | "density" | "calories" | "fibre" | "prep";

const metrics: {
  key: MetricKey;
  label: string;
  unit: string;
  decimals?: number;
  higherIsBetter: boolean;
  hint: string;
}[] = [
  { key: "protein", label: "Protein", unit: "g", higherIsBetter: true, hint: "Per serving" },
  {
    key: "density",
    label: "Protein / 100 kcal",
    unit: "g",
    decimals: 1,
    higherIsBetter: true,
    hint: "The number we design around",
  },
  { key: "calories", label: "Calories", unit: "kcal", higherIsBetter: false, hint: "Per serving" },
  { key: "fibre", label: "Fibre", unit: "g", higherIsBetter: true, hint: "Per serving" },
  { key: "prep", label: "Prep time", unit: "min", higherIsBetter: false, hint: "Hands-on + wait" },
];

export function MacroCompare({
  dense = false,
  inverse = false,
  className,
  defaultReference = "instant-mac",
  defaultProduct,
  showCta = true,
}: {
  dense?: boolean;
  inverse?: boolean;
  className?: string;
  defaultReference?: string;
  defaultProduct?: string;
  showCta?: boolean;
}) {
  const products = getProducts();
  const [referenceId, setReferenceId] = useState(defaultReference);
  const [productSlug, setProductSlug] = useState(defaultProduct ?? products[0].slug);
  const reduced = useReducedMotion();

  const reference = referenceMeals.find((m) => m.id === referenceId) ?? referenceMeals[0];
  const product = products.find((p) => p.slug === productSlug) ?? products[0];
  const accent = accents[product.accent];

  const values = {
    left: {
      protein: reference.protein,
      density: proteinDensity(reference.protein, reference.calories),
      calories: reference.calories,
      fibre: reference.fibre,
      prep: reference.prepMinutes,
    } satisfies Record<MetricKey, number>,
    right: {
      protein: product.nutrition.protein,
      density: proteinDensity(product.nutrition.protein, product.nutrition.calories),
      calories: product.nutrition.calories,
      fibre: product.nutrition.fibre,
      prep: product.prepMinutes,
    } satisfies Record<MetricKey, number>,
  };

  const selectClass = cn(
    "h-11 w-full appearance-none rounded-full border px-4 pr-9 text-sm font-semibold tracking-tight outline-none transition-colors",
    inverse
      ? "border-white/20 bg-white/[0.06] text-on-ink focus:border-white/60"
      : "border-line-strong bg-bone-100 text-ink focus:border-ink",
  );

  const chevron = (
    <svg
      aria-hidden
      viewBox="0 0 12 8"
      className={cn(
        "pointer-events-none absolute top-1/2 right-4 h-2 w-3 -translate-y-1/2",
        inverse ? "text-on-ink-muted" : "text-fg-muted",
      )}
    >
      <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid gap-3", dense ? "sm:grid-cols-2" : "sm:grid-cols-[1fr_auto_1fr]")}>
        <div className="relative">
          <label htmlFor="compare-reference" className="sr-only">
            Compare against
          </label>
          <select
            id="compare-reference"
            value={referenceId}
            onChange={(event) => setReferenceId(event.target.value)}
            className={selectClass}
          >
            {referenceMeals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.label}
              </option>
            ))}
          </select>
          {chevron}
        </div>
        {dense ? null : (
          <div
            className={cn(
              "hidden items-center justify-center sm:flex",
              inverse ? "text-on-ink-muted" : "text-fg-subtle",
            )}
          >
            <span className="kicker">vs</span>
          </div>
        )}
        <div className="relative">
          <label htmlFor="compare-product" className="sr-only">
            FULL. meal
          </label>
          <select
            id="compare-product"
            value={productSlug}
            onChange={(event) => setProductSlug(event.target.value)}
            className={selectClass}
          >
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                FULL. {p.line} — {p.flavor}
              </option>
            ))}
          </select>
          {chevron}
        </div>
      </div>

      <p className={cn("mt-3 text-xs", inverse ? "text-on-ink-muted" : "text-fg-muted")}>
        {reference.note}
      </p>

      <ul className={cn("mt-6 divide-y", inverse ? "divide-white/12" : "divide-line")}>
        {metrics.map((metric, index) => {
          const left = values.left[metric.key];
          const right = values.right[metric.key];
          const max = Math.max(left, right) || 1;
          const winner = metric.higherIsBetter
            ? right >= left
              ? "right"
              : "left"
            : right <= left
              ? "right"
              : "left";

          return (
            <li key={metric.key} className="py-4">
              <div className="flex items-baseline justify-between gap-4">
                <p
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    inverse ? "text-on-ink" : "text-ink",
                  )}
                >
                  {metric.label}
                </p>
                <p
                  className={cn(
                    "hidden text-[0.7rem] sm:block",
                    inverse ? "text-on-ink-muted" : "text-fg-subtle",
                  )}
                >
                  {metric.hint}
                </p>
              </div>

              <div className="mt-3 grid gap-2.5">
                {(
                  [
                    { side: "left" as const, value: left, label: reference.label },
                    { side: "right" as const, value: right, label: `FULL. ${product.flavor}` },
                  ] satisfies { side: "left" | "right"; value: number; label: string }[]
                ).map((row) => (
                  <div key={row.side} className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "w-28 shrink-0 truncate text-[0.7rem] sm:w-36",
                          inverse ? "text-on-ink-muted" : "text-fg-muted",
                        )}
                      >
                        {row.label}
                      </span>
                      <div
                        className={cn(
                          "h-2.5 min-w-0 flex-1 overflow-hidden rounded-full",
                          inverse ? "bg-white/10" : "bg-bone-300",
                        )}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              row.side === "right"
                                ? accent.base
                                : inverse
                                  ? "rgba(255,255,255,0.28)"
                                  : "#c9c0ab",
                          }}
                          initial={reduced ? undefined : { width: 0 }}
                          whileInView={{ width: `${Math.max(3, (row.value / max) * 100)}%` }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{
                            duration: 0.9,
                            delay: reduced ? 0 : index * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </div>
                    </div>
                    <p
                      className={cn(
                        "num w-20 text-right text-sm font-bold tabular-nums sm:w-24",
                        row.side === winner
                          ? inverse
                            ? "text-on-ink"
                            : "text-ink"
                          : inverse
                            ? "text-on-ink-muted"
                            : "text-fg-subtle",
                      )}
                    >
                      {row.value.toFixed(metric.decimals ?? 0)}
                      <span className="ml-0.5 text-[0.7rem] font-medium">{metric.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ConceptBadge tone={inverse ? "inverse" : "neutral"} />
        {showCta ? (
          <Button
            href={`/products/${product.slug}`}
            variant={inverse ? "inverse" : "primary"}
            size="sm"
          >
            See {product.flavor}
            <ArrowRight className="size-3.5" aria-hidden />
          </Button>
        ) : null}
      </div>
      <DisclaimerNote inverse={inverse} className="mt-3">
        {disclaimers.comparisonNote}
      </DisclaimerNote>
    </div>
  );
}
