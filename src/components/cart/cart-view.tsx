"use client";

import { AnimatePresence } from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CartLine } from "./cart-line";
import { FreeShippingMeter } from "./free-shipping-meter";
import { PromoField } from "./promo-field";
import { formatPrice } from "@/lib/utils";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";

export function CartView() {
  const { items, totals, hydrated, clearCart } = useCart();

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="aspect-3/4 w-20" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-32 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <div className="rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center sm:py-20">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-bone-200">
            <ShoppingBag className="size-6 text-fg-subtle" aria-hidden />
          </span>
          <p className="font-display mt-6 text-[length:var(--text-display-xs)] leading-none tracking-tight uppercase">
            Your macros are looking a little empty.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg-muted">
            Nothing in the bag yet. Six meals, 36–45 g protein each, three minutes from
            cupboard to dinner.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/shop" size="lg">
              Shop meals
            </Button>
            <Button href="/build-a-box" size="lg" variant="outline">
              Build a box
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-xl tracking-tight uppercase">Start with these</h2>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {getProducts()
              .slice(0, 3)
              .map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
      <div>
        <div className="flex items-center justify-between border-b border-line pb-4">
          <p className="num text-sm text-fg-muted">
            <span className="font-bold text-ink">{totals.itemCount}</span> item
            {totals.itemCount === 1 ? "" : "s"} ·{" "}
            <span className="font-bold text-ink">{totals.mealCount}</span> meal
            {totals.mealCount === 1 ? "" : "s"} · ≈{" "}
            <span className="font-bold text-ink">{totals.proteinTotal} g</span> protein
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="press text-xs font-semibold text-fg-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
          >
            Empty cart
          </button>
        </div>

        <ul className="divide-y divide-line">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartLine key={item.key} item={item} />
            ))}
          </AnimatePresence>
        </ul>

        <div className="mt-8 rounded-xl border border-line bg-bone-100 p-5">
          <p className="text-sm font-semibold tracking-tight">Add a spare for the drawer?</p>
          <p className="mt-1 text-xs text-fg-muted">
            Boxes of 8, 12 or 20 work out cheaper per meal — and you choose every flavour.
          </p>
          <Button href="/build-a-box" variant="outline" size="sm" className="mt-4">
            Build a box
          </Button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-bone-100 p-5 sm:p-6">
          <h2 className="font-display text-xl tracking-tight uppercase">Summary</h2>

          <div className="mt-5 space-y-4">
            <FreeShippingMeter
              progress={totals.freeShippingProgress}
              remainingCents={totals.freeShippingRemainingCents}
            />
            <PromoField />
          </div>

          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-muted">Subtotal</dt>
              <dd className="num font-semibold">{formatPrice(totals.subtotalCents)}</dd>
            </div>
            {totals.discountCents > 0 ? (
              <div className="flex justify-between text-ember">
                <dt>Discount</dt>
                <dd className="num font-semibold">−{formatPrice(totals.discountCents)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-fg-muted">Shipping</dt>
              <dd className="num font-semibold">
                {totals.shippingCents === 0 ? "Free" : formatPrice(totals.shippingCents)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="num font-display text-2xl font-extrabold">
                {formatPrice(totals.totalCents)}
              </dd>
            </div>
          </dl>

          <Button href="/checkout" size="lg" block className="mt-5 group">
            Checkout
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Button>

          <p className="mt-3 text-[0.7rem] leading-relaxed text-fg-subtle">
            VAT and any duties are calculated at checkout. Payments are processed by Stripe — we
            never see or store your card details. See our{" "}
            <Link href="/terms" className="link-underline">
              terms
            </Link>
            .
          </p>
        </div>
      </aside>
    </div>
  );
}
