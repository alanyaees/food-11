"use client";

import { AnimatePresence } from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CartLine } from "./cart-line";
import { FreeShippingMeter } from "./free-shipping-meter";
import { PromoField } from "./promo-field";

export function CartDrawer() {
  const { items, totals, isOpen, closeCart } = useCart();

  return (
    <Sheet open={isOpen} onClose={closeCart} side="right" title="Cart">
      <div className="flex h-full flex-col">
        <header className="shrink-0 border-b border-line px-5 pt-6 pb-4">
          <p className="kicker text-fg-subtle">Your bag</p>
          <h2 className="font-display mt-1.5 text-2xl tracking-tight">
            {totals.itemCount === 0
              ? "Empty"
              : `${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"}`}
          </h2>
          {totals.proteinTotal > 0 ? (
            <p className="num mt-1 text-xs text-fg-muted">
              ≈ {totals.proteinTotal} g protein in this bag
            </p>
          ) : null}
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-bone-200">
              <ShoppingBag className="size-6 text-fg-subtle" aria-hidden />
            </span>
            <div>
              <p className="font-display text-xl tracking-tight">
                Your macros are looking a little empty.
              </p>
              <p className="mt-2 text-sm text-fg-muted">
                Six meals, 36–45 g protein each. Start with the cheddar.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button href="/shop" onClick={closeCart}>
                Shop meals
              </Button>
              <Button href="/build-a-box" variant="ghost" onClick={closeCart}>
                Build a box
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">
              <ul className="divide-y divide-line">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartLine key={item.key} item={item} onNavigate={closeCart} />
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            <footer className="shrink-0 space-y-4 border-t border-line bg-bone-100/60 px-5 py-5">
              <FreeShippingMeter
                progress={totals.freeShippingProgress}
                remainingCents={totals.freeShippingRemainingCents}
              />
              <PromoField />
              <dl className="space-y-1.5 text-sm">
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
                <div className="flex justify-between border-t border-line pt-2.5 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="num font-display text-lg font-extrabold">
                    {formatPrice(totals.totalCents)}
                  </dd>
                </div>
              </dl>
              <div className="grid gap-2">
                <Button href="/checkout" onClick={closeCart} size="lg" block>
                  Checkout
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
                <Button href="/cart" variant="ghost" onClick={closeCart} size="sm" block>
                  View full cart
                </Button>
              </div>
              <p className="text-[0.7rem] text-fg-subtle">
                Taxes calculated at checkout. Subscriptions can be skipped, paused or cancelled at
                any time.
              </p>
            </footer>
          </>
        )}
      </div>
    </Sheet>
  );
}
