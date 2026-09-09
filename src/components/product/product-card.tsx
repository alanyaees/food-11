import Link from "next/link";
import { Flame, Timer } from "lucide-react";
import { BrandImage } from "@/components/brand/brand-image";
import { Pouch } from "@/components/brand/pouch";
import { accentVars } from "@/lib/accents";
import type { Product } from "@/lib/types";
import { cn, proteinDensity } from "@/lib/utils";

/**
 * Showcase card: photography by default, packaging on hover — so the
 * food leads and the pack does the brand work.
 */
export function ProductCard({
  product,
  className,
  priority = false,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 90vw",
}: {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const density = proteinDensity(product.nutrition.protein, product.nutrition.calories);

  return (
    <article
      className={cn("group relative flex flex-col", className)}
      style={accentVars(product.accent)}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-xl bg-bone-200 focus-visible:outline-offset-4"
        aria-label={`${product.line} — ${product.flavor}`}
      >
        <div className="relative aspect-4/5">
          <BrandImage
            assetKey={product.images.closeup}
            accent={product.accent}
            sizes={sizes}
            priority={priority}
            className="absolute inset-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:opacity-0"
          />
          <div
            aria-hidden
            className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_100%_at_50%_0%,var(--accent-soft)_0%,#efeade_65%,#e4ddcd_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          >
            <div className="w-[58%] translate-y-2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
              <Pouch
                line={product.line}
                flavor={product.flavor}
                protein={product.nutrition.protein}
                prepMinutes={product.prepMinutes}
                accent={product.accent}
              />
            </div>
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span
              className="num inline-flex items-baseline gap-0.5 rounded-full px-2.5 py-1.5 text-[0.7rem] leading-none font-bold text-ink shadow-sm"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {product.nutrition.protein}g protein
            </span>
            {product.heat > 0 ? (
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-ink/85 px-2 py-1 text-[0.65rem] font-semibold text-on-ink">
                <Flame className="size-3" aria-hidden />
                {product.heat > 1 ? "Spicy" : "Mild heat"}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <div className="min-w-0">
          <p className="kicker text-fg-subtle">{product.line}</p>
          <h3 className="mt-1.5 text-[1.0625rem] leading-tight font-semibold tracking-[-0.02em]">
            <Link href={`/products/${product.slug}`} className="link-underline">
              {product.flavor}
            </Link>
          </h3>
        </div>

        <p className="mt-2 line-clamp-2 text-[0.82rem] leading-relaxed text-fg-muted">
          {product.tagline}
        </p>

        <dl className="num mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] text-fg-muted">
          <div className="flex items-center gap-1">
            <dt className="sr-only">Calories</dt>
            <dd>{product.nutrition.calories} kcal</dd>
          </div>
          <span aria-hidden className="text-line-strong">
            ·
          </span>
          <div className="flex items-center gap-1">
            <dt className="sr-only">Protein per 100 kcal</dt>
            <dd>{density} g / 100 kcal</dd>
          </div>
          <span aria-hidden className="text-line-strong">
            ·
          </span>
          <div className="flex items-center gap-1">
            <Timer className="size-3" aria-hidden />
            <dt className="sr-only">Preparation time</dt>
            <dd>{product.prepMinutes} min</dd>
          </div>
        </dl>

        <div className="mt-4">
          <Link
            href={`/products/${product.slug}`}
            className="press inline-flex h-10 w-full items-center justify-center rounded-full border border-ink/20 px-4 text-xs font-bold tracking-tight uppercase hover:border-ink"
          >
            View meal
          </Link>
        </div>
      </div>
    </article>
  );
}
