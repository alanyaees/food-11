"use client";

import { useEffect } from "react";
import { useCart } from "@/components/providers/cart-provider";

/** Empties the bag once an order has been placed. */
export function ClearCartOnMount() {
  const { clearCart, hydrated, items } = useCart();

  useEffect(() => {
    if (hydrated && items.length > 0) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return null;
}
