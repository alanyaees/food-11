"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Repeat, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { SUBSCRIPTION_DISCOUNT } from "@/lib/cart";
import { brand } from "@/lib/brand";
import { accentVars } from "@/lib/accents";
import { subscriptionIntervals } from "@/lib/products";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export function PurchasePanel({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [mode, setMode] = useState<"one-time" | "subscription">("one-time");
  const [interval, setInterval] = useState<string>(subscriptionIntervals[0].id);
  const [quantity, setQuantity] = useState(1);

  const unitPrice =
    mode === "subscription"
      ? Math.round(product.priceCents * (1 - SUBSCRIPTION_DISCOUNT))
      : product.priceCents;
  const total = unitPrice * quantity;

  const options = [
    {
      id: "one-time" as const,
      title: "One-time purchase",
      price: formatPrice(product.priceCents),
      note: "Buy a few. See what you think.",
    },
    {
      id: "subscription" as const,
      title: "Subscribe & save 15%",
      price: formatPrice(Math.round(product.priceCents * (1 - SUBSCRIPTION_DISCOUNT))),
      note: "Skip, pause or cancel anytime.",
    },
  ];

  return (
    <div style={accentVars(product.accent)}>
      <div className="space-y-2.5">
        {options.map((option) => {
          const active = mode === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "press relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors",
                active
                  ? "border-ink bg-bone-100"
                  : "border-line bg-transparent hover:border-line-strong",
              )}
            >
              <input
                type="radio"
                name="purchase-mode"
                value={option.id}
                checked={active}
                onChange={() => setMode(option.id)}
                className="sr-only"
              />
              <span
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                  active ? "border-ink bg-ink text-on-ink" : "border-line-strong",
                )}
                aria-hidden
              >
                {active ? <Check className="size-3" strokeWidth={4} /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-sm font-bold tracking-tight">{option.title}</span>
                  <span className="num text-sm font-bold">{option.price}</span>
                </span>
                <span className="mt-1 block text-xs text-fg-muted">{option.note}</span>

                {option.id === "subscription" && active ? (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 block overflow-hidden"
                  >
                    <span className="kicker mb-2 block text-fg-subtle">Delivery frequency</span>
                    <span className="flex flex-wrap gap-2">
                      {subscriptionIntervals.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            setInterval(option.id);
                          }}
                          aria-pressed={interval === option.id}
                          className={cn(
                            "press rounded-full border px-3 py-1.5 text-xs font-semibold",
                            interval === option.id
                              ? "border-ink bg-ink text-on-ink"
                              : "border-line-strong text-fg-muted hover:border-ink",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </span>
                  </motion.span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={24}
          label={`${product.flavor} pouches`}
        />
        <Button
          size="lg"
          className="flex-1"
          onClick={() => {
            addItem(
              {
                slug: product.slug,
                name: product.name,
                line: product.line,
                flavor: product.flavor,
                accent: product.accent,
                unitPriceCents: unitPrice,
                mode,
                protein: product.nutrition.protein,
                calories: product.nutrition.calories,
                kind: "meal",
              },
              quantity,
            );
            openCart();
          }}
        >
          <ShoppingBag className="size-4" aria-hidden />
          Add to cart — {formatPrice(total)}
        </Button>
      </div>

      <ul className="mt-5 space-y-2 text-xs text-fg-muted">
        <li className="flex items-center gap-2">
          <Truck className="size-3.5 shrink-0" aria-hidden />
          Free shipping over {formatPrice(brand.shipping.freeThresholdCents)} ·{" "}
          {brand.shipping.regions}
        </li>
        <li className="flex items-center gap-2">
          <Repeat className="size-3.5 shrink-0" aria-hidden />
          Subscriptions are managed from your account — skip, pause or cancel before the next
          charge.
        </li>
      </ul>
    </div>
  );
}
