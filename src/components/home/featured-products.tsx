import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getProducts } from "@/lib/products";

export function FeaturedProducts() {
  const products = getProducts();

  return (
    <section
      className="bg-bone-100 py-20 sm:py-28"
      aria-labelledby="featured-heading"
      id="featured"
    >
      <div className="container-full">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="kicker text-fg-subtle">03 — The range</p>
            </Reveal>
            <h2
              id="featured-heading"
              className="mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
            >
              Six meals.
              <br />
              No filler ones.
            </h2>
          </div>
          <Reveal delay={0.1}>
            <Button href="/shop" variant="outline" className="group">
              Shop all meals
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Button>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.06} amount={0.15}>
              <ProductCard product={product} priority={index < 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
