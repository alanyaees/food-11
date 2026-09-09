"use client";

import { useState } from "react";
import { BrandImage } from "@/components/brand/brand-image";
import { NutritionLabel } from "@/components/features/nutrition-label";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { accents } from "@/lib/accents";
import { getProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

export function TransparencySection() {
  const products = getProducts();
  const [slug, setSlug] = useState(products[0].slug);
  const product = products.find((p) => p.slug === slug) ?? products[0];

  return (
    <section
      className="bg-bone-100 py-20 sm:py-28"
      aria-labelledby="transparency-heading"
      id="transparency"
    >
      <div className="container-full">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="kicker text-fg-subtle">07 — Transparency</p>
            </Reveal>
            <h2
              id="transparency-heading"
              className="mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
            >
              <RevealLines lines={["Turn the packet", "around.", "We want you to."]} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
                Every ingredient is here in plain English, with the reason it earned its place.
                Turn the pack around — the label matches what you see here.
              </p>
            </Reveal>

            <div className="mt-8">
              <p className="kicker text-fg-subtle">Choose a meal</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {products.map((option) => {
                  const active = option.slug === slug;
                  return (
                    <button
                      key={option.slug}
                      type="button"
                      onClick={() => setSlug(option.slug)}
                      aria-pressed={active}
                      className={cn(
                        "press inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold tracking-tight transition-colors",
                        active
                          ? "border-ink bg-ink text-on-ink"
                          : "border-line-strong text-fg-muted hover:border-ink hover:text-ink",
                      )}
                    >
                      <span
                        aria-hidden
                        className="size-2 rounded-full"
                        style={{ backgroundColor: accents[option.accent].base }}
                      />
                      {option.flavor}
                    </button>
                  );
                })}
              </div>
            </div>

            <Reveal delay={0.15} className="mt-10 hidden lg:block">
              <BrandImage
                assetKey={product.images.ingredients}
                accent={product.accent}
                alt={`Ingredients for ${product.line} — ${product.flavor}, arranged in an overhead flat-lay`}
                sizes="30vw"
                className="aspect-4/3 w-full rounded-xl"
              />
            </Reveal>
          </div>

          <NutritionLabel product={product} />
        </div>
      </div>
    </section>
  );
}
