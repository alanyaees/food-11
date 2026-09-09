import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { accents } from "@/lib/accents";
import { getProducts } from "@/lib/products";
import { proteinDensity } from "@/lib/utils";
import { ConceptBadge } from "@/components/ui/concept-badge";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Every meal in the range, ranked by the number the brand is built on:
 * grams of protein per 100 kcal. Bar widths are relative to the best
 * performer in the range rather than to an arbitrary maximum, so the
 * comparison is between our own meals and nothing is flattered.
 */
export function DensityPanel({ className }: { className?: string }) {
  const products = getProducts()
    .map((product) => ({
      product,
      density: proteinDensity(product.nutrition.protein, product.nutrition.calories),
    }))
    .sort((a, b) => b.density - a.density);

  const best = products[0]?.density || 1;

  return (
    <div className={cn("rounded-2xl border border-line bg-bone-100 p-6 sm:p-8", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] uppercase">
          Protein per 100 kcal
        </h3>
        <ConceptBadge />
      </div>

      <ul className="mt-7 space-y-5">
        {products.map(({ product, density }, index) => (
          <Reveal as="li" key={product.slug} delay={0.04 * index}>
            <Link
              href={`/products/${product.slug}`}
              className="group block rounded-md focus-visible:outline-offset-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="min-w-0 truncate text-[0.875rem] font-semibold tracking-tight text-ink">
                  {product.line} <span className="text-fg-muted">· {product.flavor}</span>
                </p>
                <p className="num shrink-0 text-[0.875rem] font-bold tabular-nums">
                  {density.toFixed(1)}
                  <span className="ml-0.5 text-[0.7rem] font-medium text-fg-subtle">g</span>
                </p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bone-300">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{
                    width: `${Math.max(8, (density / best) * 100)}%`,
                    backgroundColor: accents[product.accent].base,
                  }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <p className="num text-[0.7rem] text-fg-subtle">
                  {product.nutrition.protein} g protein · {product.nutrition.calories} kcal ·{" "}
                  {product.nutrition.fibre} g fibre
                </p>
                <ArrowUpRight
                  className="size-3.5 shrink-0 text-fg-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
