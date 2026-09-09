"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Box, Clock, Dumbbell, Ruler } from "lucide-react";
import { Counter } from "@/components/ui/counter";
import { DisclaimerNote } from "@/components/ui/concept-badge";
import { averageMealPriceCents, getProducts } from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";

const options = [8, 12, 20, 30] as const;

/**
 * Pantry calculator: pick a stash size, see what it actually means in
 * protein, shelf space and time you don't spend cooking.
 */
export function PantryCalculator({ className }: { className?: string }) {
  const [count, setCount] = useState<number>(12);
  const products = getProducts();

  const avgProtein = Math.round(
    products.reduce((sum, p) => sum + p.nutrition.protein, 0) / products.length,
  );
  const avgWeight = Math.round(
    products.reduce((sum, p) => sum + p.nutrition.servingWeightG, 0) / products.length,
  );
  const avgPrep = products.reduce((sum, p) => sum + p.prepMinutes, 0) / products.length;

  // A comparable home-cooked meal: ~35 min shopping, prep, cooking and washing up.
  const cookedMinutes = 35;
  const timeSaved = Math.round(((cookedMinutes - avgPrep) * count) / 60);
  const shelfWidthCm = Math.round(count * 2.4);
  const totalWeightKg = ((avgWeight * count) / 1000).toFixed(1);

  const stats = [
    {
      icon: Dumbbell,
      label: "Total protein",
      value: avgProtein * count,
      suffix: " g",
      note: `≈ ${avgProtein} g per meal, concept values`,
    },
    {
      icon: Clock,
      label: "Hours not spent cooking",
      value: timeSaved,
      suffix: " h",
      note: `vs ~${cookedMinutes} min for shopping, cooking and washing up`,
    },
    {
      icon: Ruler,
      label: "Shelf space",
      value: shelfWidthCm,
      suffix: " cm",
      note: `${count} flat pouches standing upright, ≈ ${totalWeightKg} kg`,
    },
    {
      icon: Box,
      label: "Cost at list price",
      value: Math.round((averageMealPriceCents() * count) / 100),
      prefix: "€",
      note: "Before box or subscription discounts",
    },
  ];

  return (
    <section
      className={cn("rounded-2xl border border-line bg-bone-100 p-6 sm:p-8", className)}
      aria-labelledby="pantry-heading"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker text-fg-subtle">Pantry calculator</p>
          <h2
            id="pantry-heading"
            className="font-display mt-3 text-[length:var(--text-display-xs)] leading-none tracking-[-0.035em] uppercase"
          >
            What does a stocked cupboard look like?
          </h2>
        </div>
        <div role="group" aria-label="Number of meals" className="flex gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={count === option}
              onClick={() => setCount(option)}
              className={cn(
                "press num h-11 w-14 rounded-full border text-sm font-bold transition-colors",
                count === option
                  ? "border-ink bg-ink text-on-ink"
                  : "border-line-strong text-fg-muted hover:border-ink hover:text-ink",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} layout>
            <dt className="flex items-center gap-2">
              <stat.icon className="size-3.5 text-fg-subtle" aria-hidden />
              <span className="kicker text-fg-subtle">{stat.label}</span>
            </dt>
            <dd>
              <span className="num font-display mt-2 block text-3xl leading-none font-extrabold tracking-tight sm:text-4xl">
                <Counter
                  key={`${stat.label}-${count}`}
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  once={false}
                  duration={0.7}
                />
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-fg-muted">{stat.note}</span>
            </dd>
          </motion.div>
        ))}
      </dl>

      <DisclaimerNote className="mt-6">
        Estimates based on the current concept range: average dry weight {avgWeight} g, average
        preparation {avgPrep.toFixed(1)} minutes and {formatPrice(averageMealPriceCents())} average
        meal price. Time comparison is illustrative, not a measured study.
      </DisclaimerNote>
    </section>
  );
}
