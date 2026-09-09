"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Repeat, ShoppingBag, Sparkles, Wand2 } from "lucide-react";
import { PouchMini } from "@/components/brand/pouch";
import { BrandImage } from "@/components/brand/brand-image";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { ConceptBadge } from "@/components/ui/concept-badge";
import { useCart } from "@/components/providers/cart-provider";
import { accents, accentVars } from "@/lib/accents";
import { SUBSCRIPTION_DISCOUNT } from "@/lib/cart";
import {
  boxCompareAtCents,
  boxFixedPriceCents,
  boxSizes,
  getBoxSize,
  getProducts,
  subscriptionIntervals,
  tenPackContents,
  tenPackDeal,
} from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";

type Plan = "one-time" | "subscription";

export function BoxBuilder() {
  const searchParams = useSearchParams();
  const products = getProducts();
  const { addItem, openCart } = useCart();

  const initialSize = (() => {
    const raw = Number(searchParams.get("size"));
    return boxSizes.some((box) => box.size === raw) ? raw : 12;
  })();

  const [size, setSize] = useState<number>(initialSize);
  const [plan, setPlan] = useState<Plan>(
    initialSize === tenPackDeal.size
      ? "one-time"
      : searchParams.get("plan") === "subscribe"
        ? "subscription"
        : "one-time",
  );
  const [interval, setInterval] = useState<string>(subscriptionIntervals[0].id);
  const [picks, setPicks] = useState<Record<string, number>>(() => {
    if (initialSize !== tenPackDeal.size) return {};
    const mix: Record<string, number> = {};
    for (const entry of tenPackContents(products)) {
      mix[entry.slug] = entry.quantity;
    }
    return mix;
  });
  const [added, setAdded] = useState(false);

  const chosen = Object.values(picks).reduce((sum, value) => sum + value, 0);
  const remaining = size - chosen;
  const box = getBoxSize(size);
  const fixedPrice = boxFixedPriceCents(box);
  const comboBox = fixedPrice != null;

  const totals = useMemo(() => {
    const listPrice = products.reduce(
      (sum, product) => sum + (picks[product.slug] ?? 0) * product.priceCents,
      0,
    );
    const protein = products.reduce(
      (sum, product) => sum + (picks[product.slug] ?? 0) * product.nutrition.protein,
      0,
    );
    const calories = products.reduce(
      (sum, product) => sum + (picks[product.slug] ?? 0) * product.nutrition.calories,
      0,
    );
    const compareAt = boxCompareAtCents(box) ?? listPrice;
    const afterBox = fixedPrice ?? Math.round(listPrice * (1 - box.discount));
    const final =
      fixedPrice != null
        ? fixedPrice
        : plan === "subscription"
          ? Math.round(afterBox * (1 - SUBSCRIPTION_DISCOUNT))
          : afterBox;
    const was = comboBox ? compareAt : listPrice;
    return {
      listPrice: was,
      final,
      savings: Math.max(0, was - final),
      protein,
      calories,
      perMeal: chosen ? Math.round(final / chosen) : 0,
    };
  }, [products, picks, box, fixedPrice, comboBox, plan, chosen]);

  const setPick = (slug: string, next: number) => {
    setAdded(false);
    setPicks((current) => {
      const clamped = Math.max(0, next);
      const others = Object.entries(current).reduce(
        (sum, [key, value]) => (key === slug ? sum : sum + value),
        0,
      );
      if (others + clamped > size) return { ...current, [slug]: Math.max(0, size - others) };
      return { ...current, [slug]: clamped };
    });
  };

  const fillEvenly = () => {
    setAdded(false);
    const base = Math.floor(size / products.length);
    const next: Record<string, number> = {};
    products.forEach((product) => {
      next[product.slug] = base;
    });
    let left = size - base * products.length;
    for (const product of products) {
      if (left <= 0) break;
      next[product.slug] += 1;
      left -= 1;
    }
    setPicks(next);
  };

  const complete = remaining === 0 && chosen > 0;

  const addBoxToCart = () => {
    if (!complete) return;
    const contents = products
      .filter((product) => (picks[product.slug] ?? 0) > 0)
      .map((product) => ({
        slug: product.slug,
        name: `${product.line} — ${product.flavor}`,
        quantity: picks[product.slug],
      }));

    addItem({
      slug: comboBox ? tenPackDeal.slug : `box-${size}`,
      name: comboBox ? tenPackDeal.name : `${size}-meal box`,
      line: comboBox ? tenPackDeal.line : "BUILD A BOX",
      flavor: comboBox ? tenPackDeal.flavor : `${size} meals`,
      accent: "cheddar",
      unitPriceCents: totals.final,
      mode: comboBox ? "one-time" : plan,
      protein: totals.protein,
      calories: totals.calories,
      kind: "box",
      meta: { boxContents: contents, boxSize: size },
    });
    setAdded(true);
    openCart();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
      <div className="space-y-12">
        {/* Step 1 — size */}
        <section aria-labelledby="step-size">
          <div className="flex items-baseline gap-3">
            <span className="num font-display text-sm font-extrabold text-fg-subtle">01</span>
            <h2 id="step-size" className="font-display text-xl tracking-tight uppercase">
              Choose your box
            </h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {boxSizes.map((option) => {
              const active = option.size === size;
              const deal = boxFixedPriceCents(option) != null;
              return (
                <button
                  key={option.size}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSize(option.size);
                    setAdded(false);
                    if (boxFixedPriceCents(option) != null) {
                      setPlan("one-time");
                      const mix: Record<string, number> = {};
                      for (const entry of tenPackContents(products)) {
                        mix[entry.slug] = entry.quantity;
                      }
                      setPicks(mix);
                    } else {
                      setPicks({});
                    }
                  }}
                  className={cn(
                    "press rounded-xl border-2 p-5 text-left transition-colors",
                    active
                      ? deal
                        ? "border-ember bg-ember-100"
                        : "border-ink bg-bone-100"
                      : deal
                        ? "border-ember/40 hover:border-ember"
                        : "border-line hover:border-line-strong",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="kicker text-fg-subtle">{option.label}</span>
                    {option.discount > 0 ? (
                      <span
                        className={cn(
                          "num rounded-full px-2 py-1 text-[0.6rem] font-bold text-on-ink",
                          deal ? "bg-ember" : "bg-ink",
                        )}
                      >
                        −{Math.round(option.discount * 100)}%
                      </span>
                    ) : null}
                  </div>
                  <p className="num font-display mt-3 text-4xl leading-none font-extrabold tracking-tight">
                    {option.size}
                  </p>
                  <p className="kicker mt-1.5 text-fg-subtle">meals</p>
                  <p className="mt-3 text-xs text-fg-muted">{option.note}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2 — meals */}
        <section aria-labelledby="step-meals">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="num font-display text-sm font-extrabold text-fg-subtle">02</span>
              <h2 id="step-meals" className="font-display text-xl tracking-tight uppercase">
                Pick your meals
              </h2>
            </div>
            <button
              type="button"
              onClick={fillEvenly}
              className="press inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-xs font-semibold hover:border-ink"
            >
              <Wand2 className="size-3.5" aria-hidden />
              Fill with one of each
            </button>
          </div>

          <ul className="mt-5 divide-y divide-line border-y border-line">
            {products.map((product) => {
              const quantity = picks[product.slug] ?? 0;
              return (
                <li
                  key={product.slug}
                  className="flex items-center gap-4 py-4"
                  style={accentVars(product.accent)}
                >
                  <div className="w-14 shrink-0 sm:w-16">
                    <PouchMini
                      line={product.line}
                      flavor={product.flavor}
                      protein={product.nutrition.protein}
                      accent={product.accent}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="kicker text-fg-subtle">{product.line}</p>
                    <p className="mt-1 text-sm font-semibold tracking-tight">{product.flavor}</p>
                    <p className="num mt-1 text-xs text-fg-muted">
                      {product.nutrition.protein} g protein · {product.nutrition.calories} kcal ·{" "}
                      {formatPrice(product.priceCents)}
                    </p>
                  </div>
                  <QuantityStepper
                    value={quantity}
                    onChange={(next) => setPick(product.slug, next)}
                    min={0}
                    max={size}
                    size="sm"
                    label={product.flavor}
                  />
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-bone-300">
              <motion.div
                className={cn("h-full rounded-full", complete ? "bg-ink" : "bg-ember")}
                animate={{ width: `${Math.min(100, (chosen / size) * 100)}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p aria-live="polite" className="num text-sm font-bold">
              {chosen} / {size} meals
            </p>
          </div>
        </section>

        {/* Step 3 — plan */}
        <section aria-labelledby="step-plan">
          <div className="flex items-baseline gap-3">
            <span className="num font-display text-sm font-extrabold text-fg-subtle">03</span>
            <h2 id="step-plan" className="font-display text-xl tracking-tight uppercase">
              {comboBox ? "The combo, locked in" : "One-time or standing order"}
            </h2>
          </div>
          {comboBox ? (
            <div className="mt-5 rounded-xl border-2 border-ember/40 bg-ember-100 p-5">
              <p className="text-sm font-bold tracking-tight">
                {tenPackDeal.size} packs for {formatPrice(tenPackDeal.priceCents)}
              </p>
              <p className="mt-1.5 text-xs text-fg-muted">
                {tenPackDeal.discountPercent}% off a {formatPrice(tenPackDeal.compareAtCents)}{" "}
                compare-at. One-time box — mix the flavours however you like.
              </p>
            </div>
          ) : (
          <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  id: "one-time" as Plan,
                  title: "One-time box",
                  note: `${Math.round(box.discount * 100)}% box discount applied.`,
                },
                {
                  id: "subscription" as Plan,
                  title: "Subscribe & save 15%",
                  note: "Box discount plus 15%. Skip, pause or cancel anytime.",
                },
              ] satisfies { id: Plan; title: string; note: string }[]
            ).map((option) => {
              const active = plan === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setPlan(option.id);
                    setAdded(false);
                  }}
                  className={cn(
                    "press rounded-xl border-2 p-5 text-left transition-colors",
                    active ? "border-ink bg-bone-100" : "border-line hover:border-line-strong",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "grid size-5 place-items-center rounded-full border-2",
                        active ? "border-ink bg-ink text-on-ink" : "border-line-strong",
                      )}
                      aria-hidden
                    >
                      {active ? <Check className="size-3" strokeWidth={4} /> : null}
                    </span>
                    <span className="text-sm font-bold tracking-tight">{option.title}</span>
                  </span>
                  <span className="mt-2 block text-xs text-fg-muted">{option.note}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {plan === "subscription" ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4">
                  <p className="kicker mb-2 text-fg-subtle">Delivery frequency</p>
                  <div className="flex flex-wrap gap-2">
                    {subscriptionIntervals.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={interval === option.id}
                        onClick={() => setInterval(option.id)}
                        className={cn(
                          "press rounded-full border px-3.5 py-2 text-xs font-semibold",
                          interval === option.id
                            ? "border-ink bg-ink text-on-ink"
                            : "border-line-strong text-fg-muted hover:border-ink",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          </>
          )}
        </section>
      </div>

      {/* Sticky summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-line bg-bone-100">
          <div className="relative">
            <BrandImage
              assetKey="banner-pantry"
              accent="cheddar"
              alt="A shelf stacked with flat meal pouches"
              sizes="(min-width: 1024px) 23rem, 92vw"
              className="aspect-16/9 w-full"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,12,0)_35%,rgba(14,14,12,0.8)_100%)]"
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="kicker text-white/70">Your box</p>
              <p className="num font-display text-3xl leading-none font-extrabold text-white">
                {chosen}
                <span className="text-lg">/{size}</span>
              </p>
            </div>
          </div>

          <div className="p-5">
            {chosen === 0 ? (
              <p className="text-sm text-fg-muted">
                Nothing picked yet. Add meals above, or hit “fill with one of each” and adjust.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {products
                  .filter((product) => (picks[product.slug] ?? 0) > 0)
                  .map((product) => (
                    <li
                      key={product.slug}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: accents[product.accent].base }}
                        />
                        <span className="truncate">{product.flavor}</span>
                      </span>
                      <span className="num shrink-0 font-semibold">
                        ×{picks[product.slug]}
                      </span>
                    </li>
                  ))}
              </ul>
            )}

            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-fg-muted">{comboBox ? "Was" : "Meals at list price"}</dt>
                <dd className={cn("num", comboBox && totals.listPrice > totals.final && "text-fg-muted line-through")}>
                  {formatPrice(totals.listPrice)}
                </dd>
              </div>
              <div className="flex justify-between text-ember">
                <dt>
                  {comboBox
                    ? `${tenPackDeal.discountPercent}% combo deal`
                    : `Box saving${plan === "subscription" ? " + subscription" : ""}`}
                </dt>
                <dd className="num font-semibold">−{formatPrice(totals.savings)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">Per meal</dt>
                <dd className="num font-semibold">
                  {totals.perMeal ? formatPrice(totals.perMeal) : "—"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-semibold">
                  {plan === "subscription" ? "Per delivery" : "Total"}
                </dt>
                <dd className="num font-display text-2xl font-extrabold">
                  {formatPrice(totals.final)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 rounded-lg bg-bone-200/70 p-3">
              <p className="num text-sm font-bold">
                ≈ {totals.protein} g protein
              </p>
              <p className="mt-0.5 text-[0.7rem] text-fg-muted">
                across {chosen || 0} meal{chosen === 1 ? "" : "s"} — concept values, roughly{" "}
                {chosen ? Math.round(totals.protein / chosen) : 0} g per bowl.
              </p>
            </div>

            <Button
              size="lg"
              block
              className="mt-5"
              disabled={!complete}
              onClick={addBoxToCart}
            >
                  {added ? (
                <>
                  <Check className="size-4" strokeWidth={3} aria-hidden /> Box added
                </>
              ) : comboBox ? (
                <>
                  <ShoppingBag className="size-4" aria-hidden /> Add the 10-Pack
                </>
              ) : plan === "subscription" ? (
                <>
                  <Repeat className="size-4" aria-hidden /> Start subscription
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" aria-hidden /> Add box to cart
                </>
              )}
            </Button>

            <p aria-live="polite" className="mt-3 min-h-4 text-xs text-fg-muted">
              {complete
                ? "Box is full — ready when you are."
                : remaining > 0
                  ? `Add ${remaining} more meal${remaining === 1 ? "" : "s"} to complete your box.`
                  : ""}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <Sparkles className="size-3.5 shrink-0 text-fg-subtle" aria-hidden />
              <ConceptBadge />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
