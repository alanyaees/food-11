"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Repeat, X } from "lucide-react";
import { PouchMini } from "@/components/brand/pouch";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { boxCompareAtCents, tenPackDeal } from "@/lib/products";
import type { CartItem } from "@/lib/types";

export function CartLine({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 overflow-hidden py-4"
    >
      <div className="w-16 shrink-0 sm:w-18">
        {item.kind === "box" ? (
          <div className="grid aspect-3/4 place-items-center rounded-md bg-ink text-center">
            <div>
              <p className="num font-display text-2xl leading-none font-extrabold text-on-ink">
                {item.meta?.boxSize}
              </p>
              <p className="kicker mt-1 text-[0.55rem] text-on-ink-muted">meals</p>
            </div>
          </div>
        ) : (
          <PouchMini
            line={item.line}
            flavor={item.flavor}
            protein={item.protein}
            accent={item.accent}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.kind === "box" ? (
              <p className="text-sm font-semibold tracking-tight">{item.name}</p>
            ) : (
              <Link
                href={`/products/${item.slug}`}
                onClick={onNavigate}
                className="link-underline text-sm font-semibold tracking-tight"
              >
                {item.flavor}
              </Link>
            )}
            <p className="kicker mt-1 text-fg-subtle">{item.line}</p>
            {item.mode === "subscription" ? (
              <p className="mt-1.5 inline-flex items-center gap-1 text-[0.7rem] font-medium text-ember">
                <Repeat className="size-3" aria-hidden /> Subscription · 15% off
              </p>
            ) : null}
            {item.meta?.boxContents?.length ? (
              <ul className="mt-1.5 space-y-0.5 text-[0.7rem] text-fg-muted">
                {item.meta.boxContents.map((entry) => (
                  <li key={entry.slug} className="num">
                    {entry.quantity}× {entry.name}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            aria-label={`Remove ${item.name} from cart`}
            className="press -m-1.5 rounded-md p-1.5 text-fg-subtle hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(next) => updateQuantity(item.key, next)}
            min={1}
            max={30}
            size="sm"
            allowRemove
            label={item.name}
          />
          <p className="num text-sm font-semibold">
            {formatPrice(item.unitPriceCents * item.quantity)}
            {item.slug === tenPackDeal.slug || boxCompareAtCents(item.meta?.boxSize ?? 0) ? (
              <span className="mt-0.5 block text-[0.65rem] font-medium text-fg-subtle line-through">
                {formatPrice((boxCompareAtCents(item.meta?.boxSize ?? 0) ?? tenPackDeal.compareAtCents) * item.quantity)}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </motion.li>
  );
}
