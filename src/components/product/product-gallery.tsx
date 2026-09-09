"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrandImage } from "@/components/brand/brand-image";
import { Pouch } from "@/components/brand/pouch";
import { accentVars } from "@/lib/accents";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type Slide =
  | { id: string; kind: "image"; assetKey?: string; label: string; alt: string }
  | { id: string; kind: "pouch"; label: string };

export function ProductGallery({ product }: { product: Product }) {
  const slides: Slide[] = [
    {
      id: "food",
      kind: "image",
      assetKey: product.images.closeup,
      label: "The food",
      alt: `${product.line} — ${product.flavor}, prepared and photographed close up`,
    },
    { id: "pack", kind: "pouch", label: "The pack" },
    {
      id: "lifestyle",
      kind: "image",
      assetKey: product.images.lifestyle,
      label: "In real life",
      alt: `Someone preparing ${product.line} — ${product.flavor}`,
    },
    {
      id: "ingredients",
      kind: "image",
      assetKey: product.images.ingredients,
      label: "Ingredients",
      alt: `Ingredients that go into ${product.line} — ${product.flavor}`,
    },
  ];

  const [active, setActive] = useState(0);
  const current = slides[active];

  return (
    <div style={accentVars(product.accent)}>
      <div className="relative overflow-hidden rounded-2xl bg-bone-200">
        <div className="relative aspect-4/5 sm:aspect-square">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {current.kind === "image" ? (
                <BrandImage
                  assetKey={current.assetKey}
                  accent={product.accent}
                  alt={current.alt}
                  priority={active === 0}
                  sizes="(min-width: 1024px) 52vw, 92vw"
                  className="h-full w-full"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-[radial-gradient(120%_100%_at_50%_0%,var(--accent-soft)_0%,#efeade_60%,#e0d7c3_100%)] p-10">
                  <div className="w-[62%] max-w-[18rem]">
                    <Pouch
                      line={product.line}
                      flavor={product.flavor}
                      protein={product.nutrition.protein}
                      prepMinutes={product.prepMinutes}
                      accent={product.accent}
                      showBack
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <span
            className="num absolute top-4 left-4 rounded-full px-3 py-1.5 text-xs font-bold text-ink shadow-sm"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {product.nutrition.protein} g protein
          </span>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Product images"
        className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            role="tab"
            type="button"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={cn(
              "press relative w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:w-24",
              active === index ? "border-ink" : "border-transparent hover:border-line-strong",
            )}
          >
            <span className="relative block aspect-square">
              {slide.kind === "image" ? (
                <BrandImage
                  assetKey={slide.assetKey}
                  accent={product.accent}
                  alt=""
                  sizes="96px"
                  className="h-full w-full"
                />
              ) : (
                <span className="grid h-full w-full place-items-center bg-ink p-2">
                  <span className="w-full">
                    <Pouch
                      line={product.line}
                      flavor={product.flavor}
                      protein={product.nutrition.protein}
                      prepMinutes={product.prepMinutes}
                      accent={product.accent}
                    />
                  </span>
                </span>
              )}
            </span>
            <span className="sr-only">{slide.label}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="kicker mt-2 text-fg-subtle">
        {current.label}
      </p>
    </div>
  );
}
