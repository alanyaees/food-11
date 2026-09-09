"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { accents } from "@/lib/accents";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Card-level add to cart: one tap, visible feedback, no page change. */
export function QuickAdd({
  product,
  className,
  label = "Quick add",
}: {
  product: Pick<Product, "slug" | "name" | "line" | "flavor" | "accent" | "priceCents" | "nutrition">;
  className?: string;
  label?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      aria-label={`Add ${product.line} ${product.flavor} to cart`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addItem({
          slug: product.slug,
          name: product.name,
          line: product.line,
          flavor: product.flavor,
          accent: product.accent,
          unitPriceCents: product.priceCents,
          mode: "one-time",
          protein: product.nutrition.protein,
          calories: product.nutrition.calories,
          kind: "meal",
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className={cn(
        "press inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-xs font-bold tracking-tight uppercase",
        added ? "bg-ink text-on-ink" : "bg-ink text-on-ink hover:bg-ink-700",
        className,
      )}
      style={added ? { backgroundColor: accents[product.accent].base, color: "#0e0e0c" } : undefined}
    >
      {added ? (
        <>
          <Check className="size-3.5" strokeWidth={3} aria-hidden /> Added
        </>
      ) : (
        <>
          <Plus className="size-3.5" strokeWidth={3} aria-hidden /> {label}
        </>
      )}
    </button>
  );
}
