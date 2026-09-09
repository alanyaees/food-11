"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, Sparkles } from "lucide-react";
import { BrandImage } from "@/components/brand/brand-image";
import { Button } from "@/components/ui/button";
import { accentVars } from "@/lib/accents";
import { getProducts } from "@/lib/products";
import { cn, proteinDensity } from "@/lib/utils";
import type { Product } from "@/lib/types";

type Hunger = "light" | "normal" | "starving";
type Craving = "cheesy" | "spicy" | "creamy" | "savoury";
type Priority = "normal" | "high" | "everything";

const questions = [
  {
    id: "hunger" as const,
    label: "How hungry are you?",
    options: [
      { id: "light", label: "Light" },
      { id: "normal", label: "Normal" },
      { id: "starving", label: "Starving" },
    ],
  },
  {
    id: "craving" as const,
    label: "What are you feeling?",
    options: [
      { id: "cheesy", label: "Cheesy" },
      { id: "spicy", label: "Spicy" },
      { id: "creamy", label: "Creamy" },
      { id: "savoury", label: "Savoury" },
    ],
  },
  {
    id: "priority" as const,
    label: "Protein priority?",
    options: [
      { id: "normal", label: "Normal" },
      { id: "high", label: "High" },
      { id: "everything", label: "Give me everything" },
    ],
  },
];

const cravingProfile: Record<Craving, string[]> = {
  cheesy: ["mac-and-cheese-classic-cheddar", "mac-and-cheese-spicy-jalapeno", "roasted-garlic-risotto"],
  spicy: ["mac-and-cheese-spicy-jalapeno", "smoky-chili-bean-and-beef"],
  creamy: ["truffle-mushroom-pasta", "roasted-garlic-risotto", "creamy-tomato-pasta"],
  savoury: ["smoky-chili-bean-and-beef", "truffle-mushroom-pasta", "creamy-tomato-pasta"],
};

/** Pure, deterministic recommendation — no AI call, no network, no guessing. */
function recommend(answers: {
  hunger: Hunger | null;
  craving: Craving | null;
  priority: Priority | null;
}): { product: Product; reason: string } {
  const products = getProducts();
  const scored = products.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    if (answers.craving) {
      const rank = cravingProfile[answers.craving].indexOf(product.slug);
      if (rank === 0) {
        score += 5;
        reasons.push(`it is the most ${answers.craving} thing we make`);
      } else if (rank > 0) {
        score += 4 - rank;
        reasons.push(`it lands squarely in ${answers.craving} territory`);
      }
    }

    if (answers.hunger === "light" && product.nutrition.calories <= 490) {
      score += 3;
      reasons.push(`${product.nutrition.calories} kcal keeps it light`);
    }
    if (answers.hunger === "normal" && product.nutrition.calories <= 520) score += 2;
    if (answers.hunger === "starving") {
      score += product.nutrition.calories >= 510 ? 3 : 0;
      if (product.nutrition.fibre >= 9) {
        score += 1;
        reasons.push(`${product.nutrition.fibre} g fibre for staying full`);
      }
    }

    if (answers.priority === "high" && product.nutrition.protein >= 40) {
      score += 3;
      reasons.push(`${product.nutrition.protein} g protein`);
    }
    if (answers.priority === "everything") {
      score += product.nutrition.protein / 10;
      reasons.push(
        `${proteinDensity(product.nutrition.protein, product.nutrition.calories)} g protein per 100 kcal`,
      );
    }
    if (answers.priority === "normal") score += 1;

    return { product, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score || a.product.rank - b.product.rank);
  const winner = scored[0];
  const reason = winner.reasons.slice(0, 2).join(", and ");
  return {
    product: winner.product,
    reason: reason ? `Because ${reason}.` : "Because it is the one everyone starts with.",
  };
}

export function MealFinder({ className }: { className?: string }) {
  const [answers, setAnswers] = useState<{
    hunger: Hunger | null;
    craving: Craving | null;
    priority: Priority | null;
  }>({ hunger: null, craving: null, priority: null });

  const complete = Boolean(answers.hunger && answers.craving && answers.priority);
  const result = complete ? recommend(answers) : null;

  return (
    <section
      id="finder"
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-bone-100",
        className,
      )}
      aria-labelledby="finder-heading"
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-ember" aria-hidden />
            <p className="kicker text-fg-subtle">What should I eat?</p>
          </div>
          <h2
            id="finder-heading"
            className="font-display mt-3 text-[length:var(--text-display-xs)] leading-none tracking-[-0.035em] uppercase"
          >
            Three taps. One decision made for you.
          </h2>

          <div className="mt-7 space-y-6">
            {questions.map((question) => (
              <fieldset key={question.id}>
                <legend className="text-sm font-semibold tracking-tight">{question.label}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.options.map((option) => {
                    const active = answers[question.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: active ? null : option.id,
                          }))
                        }
                        className={cn(
                          "press rounded-full border px-4 py-2.5 text-sm font-semibold tracking-tight transition-colors",
                          active
                            ? "border-ink bg-ink text-on-ink"
                            : "border-line-strong text-fg-muted hover:border-ink hover:text-ink",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {complete ? (
            <button
              type="button"
              onClick={() => setAnswers({ hunger: null, craving: null, priority: null })}
              className="press mt-6 inline-flex items-center gap-2 text-xs font-semibold text-fg-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Start again
            </button>
          ) : null}
        </div>

        {/* Result */}
        <div className="border-t border-line bg-bone-200/50 p-6 sm:p-8 lg:border-t-0 lg:border-l">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.product.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={accentVars(result.product.accent)}
              >
                <p className="kicker text-fg-subtle">Eat this</p>
                <BrandImage
                  assetKey={result.product.images.closeup}
                  accent={result.product.accent}
                  alt={`${result.product.line} — ${result.product.flavor}`}
                  sizes="(min-width: 1024px) 20vw, 90vw"
                  className="mt-4 aspect-4/3 w-full rounded-lg"
                />
                <h3 className="font-display mt-4 text-xl leading-tight tracking-tight">
                  {result.product.line} — {result.product.flavor}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{result.reason}</p>
                <p className="num mt-3 text-xs text-fg-muted">
                  {result.product.nutrition.protein} g protein ·{" "}
                  {result.product.nutrition.calories} kcal · {result.product.prepMinutes} min
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button href={`/products/${result.product.slug}`} size="sm">
                    View meal
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col justify-center"
              >
                <p className="kicker text-fg-subtle">Your answer appears here</p>
                <p className="font-display mt-3 text-xl leading-tight tracking-tight text-fg-subtle">
                  Answer all three and we will pick from the actual range — no algorithm theatre.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
