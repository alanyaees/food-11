"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { PouchMini } from "@/components/brand/pouch";
import { formatPrice } from "@/lib/utils";

type Status = "idle" | "loading" | "error";

export function CheckoutView({ stripeConfigured }: { stripeConfigured: boolean }) {
  const { items, totals, promoCode, hydrated } = useCart();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const empty = hydrated && items.length === 0;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading" || empty) return;
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          promoCode,
          email,
          mode: totals.hasSubscription ? "subscription" : "payment",
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        demo?: boolean;
        redirectUrl?: string;
        message?: string;
      };
      if (!response.ok || !data.redirectUrl) {
        throw new Error(data.message ?? "We couldn't start checkout. Please try again.");
      }
      window.location.assign(data.redirectUrl);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (empty) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
        <p className="font-display text-[length:var(--text-display-xs)] leading-none tracking-tight uppercase">
          Nothing to check out.
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-fg-muted">
          Your bag is empty, which makes this page fairly relaxing but not very useful.
        </p>
        <Button href="/shop" size="lg" className="mt-7">
          Shop meals
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
      <form onSubmit={submit} className="space-y-8">
        <section aria-labelledby="checkout-contact">
          <div className="flex items-baseline gap-3">
            <span className="num font-display text-sm font-extrabold text-fg-subtle">01</span>
            <h2 id="checkout-contact" className="font-display text-xl tracking-tight uppercase">
              Where should the receipt go?
            </h2>
          </div>
          <div className="mt-5">
            <label htmlFor="checkout-email" className="text-sm font-semibold tracking-tight">
              Email address
            </label>
            <input
              id="checkout-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              className="mt-2 h-12 w-full rounded-lg border border-line-strong bg-bone-100 px-4 text-sm outline-none focus:border-ink"
            />
            <p className="mt-2 text-xs text-fg-muted">
              Used for your order confirmation and delivery updates. Marketing emails are opt-in
              only — see our{" "}
              <Link href="/privacy" className="link-underline">
                privacy notice
              </Link>
              .
            </p>
          </div>
        </section>

        <section aria-labelledby="checkout-payment">
          <div className="flex items-baseline gap-3">
            <span className="num font-display text-sm font-extrabold text-fg-subtle">02</span>
            <h2 id="checkout-payment" className="font-display text-xl tracking-tight uppercase">
              Payment &amp; delivery details
            </h2>
          </div>

          <div className="mt-5 rounded-xl border border-line bg-bone-100 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ink" aria-hidden />
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  Card details and address are collected on Stripe Checkout.
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  We never see, handle or store card numbers. You will enter your address and payment
                  method on the next screen, then come straight back here.
                </p>
              </div>
            </div>

            {!stripeConfigured ? (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-ember/30 bg-ember-100 p-3.5">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-ember-600" aria-hidden />
                <div className="text-xs leading-relaxed text-ember-600">
                  <p className="font-bold">Demo checkout</p>
                  <p className="mt-0.5 text-ink/70">
                    No Stripe keys are configured in this environment, so we will complete the order
                    as a demonstration instead of taking a payment. Nothing is charged and no card
                    details are requested.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {totals.hasSubscription ? (
            <div className="mt-4 rounded-xl border border-line bg-bone-100 p-5">
              <p className="text-sm font-semibold tracking-tight">This order includes a subscription</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                Recurring items are billed on the schedule you chose. You can skip, pause or cancel
                from your account before each charge, and we email you before every delivery.
              </p>
            </div>
          ) : null}
        </section>

        <div>
          <Button type="submit" size="xl" block disabled={status === "loading"} className="group">
            {status === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Starting checkout…
              </>
            ) : (
              <>
                <Lock className="size-4" aria-hidden />
                {stripeConfigured ? "Continue to secure payment" : "Complete demo order"}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </>
            )}
          </Button>
          <p
            aria-live="polite"
            className={`mt-3 min-h-5 text-sm ${status === "error" ? "text-ember" : "text-fg-muted"}`}
          >
            {message}
          </p>
        </div>
      </form>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-bone-100 p-5 sm:p-6">
          <h2 className="font-display text-lg tracking-tight uppercase">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-3">
                <span className="w-10 shrink-0">
                  {item.kind === "box" ? (
                    <span className="grid aspect-3/4 place-items-center rounded bg-ink">
                      <span className="num font-display text-sm font-extrabold text-on-ink">
                        {item.meta?.boxSize}
                      </span>
                    </span>
                  ) : (
                    <PouchMini
                      line={item.line}
                      flavor={item.flavor}
                      protein={item.protein}
                      accent={item.accent}
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {item.kind === "box" ? item.name : item.flavor}
                  </span>
                  <span className="num block text-xs text-fg-muted">
                    ×{item.quantity}
                    {item.mode === "subscription" ? " · subscription" : ""}
                  </span>
                </span>
                <span className="num shrink-0 text-sm font-semibold">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-muted">Subtotal</dt>
              <dd className="num font-semibold">{formatPrice(totals.subtotalCents)}</dd>
            </div>
            {totals.discountCents > 0 ? (
              <div className="flex justify-between text-ember">
                <dt>Discount {promoCode ? `(${promoCode})` : ""}</dt>
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

          <p className="mt-4 text-[0.7rem] leading-relaxed text-fg-subtle">
            Prices include VAT where applicable. Totals are recalculated on the server before
            payment, so nothing here can be tampered with in the browser.
          </p>

          <Button href="/cart" variant="ghost" size="sm" block className="mt-3">
            Back to cart
          </Button>
        </div>
      </aside>
    </div>
  );
}
