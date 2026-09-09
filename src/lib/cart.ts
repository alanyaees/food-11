import { brand } from "./brand";
import type { CartItem } from "./types";

export interface Promo {
  code: string;
  label: string;
  kind: "percent" | "fixed" | "shipping";
  value: number;
  minSubtotalCents: number;
}

/** Real, working promo codes. No fake urgency, no fake discounts. */
export const promos: Promo[] = [
  {
    code: "FIRSTFULL",
    label: "10% off your first order",
    kind: "percent",
    value: 10,
    minSubtotalCents: 0,
  },
  {
    code: "PANTRY15",
    label: "15% off orders over €60",
    kind: "percent",
    value: 15,
    minSubtotalCents: 6000,
  },
  {
    code: "SHIPFULL",
    label: "Free shipping, any order size",
    kind: "shipping",
    value: 0,
    minSubtotalCents: 0,
  },
];

export function findPromo(code: string | null | undefined) {
  if (!code) return null;
  const normalised = code.trim().toUpperCase();
  return promos.find((p) => p.code === normalised) ?? null;
}

/** Subscriptions carry a standing 15% saving across the site. */
export const SUBSCRIPTION_DISCOUNT = 0.15;

export interface CartTotals {
  itemCount: number;
  mealCount: number;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  proteinTotal: number;
  calorieTotal: number;
  freeShippingRemainingCents: number;
  freeShippingProgress: number;
  hasSubscription: boolean;
  promoError: string | null;
}

export function computeTotals(items: CartItem[], promoCode?: string | null): CartTotals {
  const subtotalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const mealCount = items.reduce(
    (sum, item) => sum + (item.kind === "box" ? (item.meta?.boxSize ?? 0) : 1) * item.quantity,
    0,
  );
  const proteinTotal = items.reduce((sum, item) => sum + item.protein * item.quantity, 0);
  const calorieTotal = items.reduce((sum, item) => sum + item.calories * item.quantity, 0);

  const promo = findPromo(promoCode);
  let discountCents = 0;
  let promoError: string | null = null;
  let freeShipping = subtotalCents >= brand.shipping.freeThresholdCents;

  if (promo) {
    if (subtotalCents < promo.minSubtotalCents) {
      promoError = `${promo.code} applies to orders over ${(promo.minSubtotalCents / 100).toFixed(0)} €`;
    } else if (promo.kind === "percent") {
      discountCents = Math.round(subtotalCents * (promo.value / 100));
    } else if (promo.kind === "fixed") {
      discountCents = Math.min(promo.value, subtotalCents);
    } else {
      freeShipping = true;
    }
  } else if (promoCode?.trim()) {
    promoError = "That code isn't valid.";
  }

  const shippingCents =
    items.length === 0 ? 0 : freeShipping ? 0 : brand.shipping.flatRateCents;

  const remaining = Math.max(0, brand.shipping.freeThresholdCents - subtotalCents);

  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    mealCount,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents: Math.max(0, subtotalCents - discountCents) + shippingCents,
    proteinTotal,
    calorieTotal,
    freeShippingRemainingCents: freeShipping ? 0 : remaining,
    freeShippingProgress: freeShipping
      ? 1
      : Math.min(1, subtotalCents / brand.shipping.freeThresholdCents),
    hasSubscription: items.some((item) => item.mode === "subscription"),
    promoError,
  };
}

/** Deterministic key so identical configurations merge in the cart. */
export function cartItemKey(input: {
  slug: string;
  mode: CartItem["mode"];
  kind: CartItem["kind"];
  meta?: CartItem["meta"];
}) {
  const boxHash = input.meta?.boxContents
    ? input.meta.boxContents
        .map((entry) => `${entry.slug}x${entry.quantity}`)
        .sort()
        .join("|")
    : "";
  return [input.kind, input.slug, input.mode, boxHash].filter(Boolean).join("::");
}
