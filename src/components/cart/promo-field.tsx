"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { findPromo } from "@/lib/cart";

export function PromoField() {
  const { promoCode, applyPromo, totals } = useCart();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(Boolean(promoCode));
  const promo = findPromo(promoCode);
  const active = promo && !totals.promoError;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="press inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
      >
        <Tag className="size-3.5" aria-hidden />
        Add a promo code
      </button>
    );
  }

  return (
    <div>
      {active ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-ink/15 bg-bone-100 px-3 py-2.5">
          <div className="min-w-0">
            <p className="num text-xs font-bold tracking-wide uppercase">{promo.code}</p>
            <p className="truncate text-[0.7rem] text-fg-muted">{promo.label}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              applyPromo(null);
              setValue("");
            }}
            aria-label="Remove promo code"
            className="press -m-1 rounded-md p-1 text-fg-subtle hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            applyPromo(value.trim() ? value.trim().toUpperCase() : null);
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="promo-code" className="sr-only">
            Promo code
          </label>
          <input
            id="promo-code"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Promo code"
            autoCapitalize="characters"
            className="num h-10 min-w-0 flex-1 rounded-full border border-line-strong bg-bone-100 px-4 text-xs tracking-wider uppercase outline-none focus:border-ink"
          />
          <button
            type="submit"
            className="press h-10 shrink-0 rounded-full bg-ink px-4 text-xs font-bold tracking-tight text-on-ink uppercase"
          >
            Apply
          </button>
        </form>
      )}
      <p aria-live="polite" className="mt-1.5 min-h-4 text-[0.7rem] text-ember">
        {totals.promoError ?? ""}
      </p>
      {!active ? (
        <p className="text-[0.7rem] text-fg-subtle">
          Try <span className="num font-semibold">FIRSTFULL</span> for 10% off your first order.
        </p>
      ) : null}
    </div>
  );
}
