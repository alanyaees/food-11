import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBrowser } from "@/components/shop/shop-browser";
import { ComboDeal } from "@/components/shop/combo-deal";
import { MealFinder } from "@/components/features/meal-finder";
import { ConceptBadge } from "@/components/ui/concept-badge";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { brand } from "@/lib/brand";
import { getProducts } from "@/lib/products";
import { breadcrumbSchema } from "@/lib/seo";
import { absoluteUrl, proteinDensity } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop all meals",
  description:
    "Six shelf-stable, high-protein meals: mac & cheese, pasta, risotto and chili. Filter by protein, calories, prep time and dietary preference.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: `Shop all meals · ${brand.name}`,
    description: brand.shortPitch,
    url: absoluteUrl("/shop"),
  },
};

export default function ShopPage() {
  const products = getProducts();
  const maxProtein = Math.max(...products.map((p) => p.nutrition.protein));
  const bestDensity = Math.max(
    ...products.map((p) => proteinDensity(p.nutrition.protein, p.nutrition.calories)),
  );
  const fastest = Math.min(...products.map((p) => p.prepMinutes));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "FULL. meals",
            numberOfItems: products.length,
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(`/products/${product.slug}`),
              name: product.name,
            })),
          },
        ]}
      />

      <header className="container-full pt-12 pb-10 sm:pt-16 sm:pb-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Reveal>
              <p className="kicker text-fg-subtle">The range</p>
            </Reveal>
            <h1 className="mt-5 text-[length:var(--text-display-md)] leading-[0.88] tracking-[-0.045em] uppercase">
              <RevealLines lines={["Every meal.", "Every number."]} />
            </h1>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">
                Filter by the thing you actually care about. Protein, calories, heat, prep time — all
                of it live, all of it honest.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <dl className="grid grid-cols-3 gap-6 border-t border-line pt-6 lg:border-0 lg:pt-0">
              {[
                { label: "Meals", value: products.length },
                { label: "Peak protein", value: `${maxProtein} g` },
                { label: "Best density", value: `${bestDensity} g` },
                { label: "Fastest", value: `${fastest} min` },
              ]
                .slice(0, 3)
                .map((stat) => (
                  <div key={stat.label}>
                    <dt className="kicker text-fg-subtle">{stat.label}</dt>
                    <dd className="num font-display mt-1.5 text-xl font-extrabold tracking-tight">
                      {stat.value}
                    </dd>
                  </div>
                ))}
            </dl>
            <div className="mt-5">
              <ConceptBadge />
            </div>
          </Reveal>
        </div>
      </header>

      <ComboDeal compact />

      <Suspense
        fallback={
          <div className="container-full grid gap-x-6 gap-y-12 pb-20 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        }
      >
        <ShopBrowser />
      </Suspense>

      <div className="container-full pb-20 sm:pb-28">
        <MealFinder />
      </div>
    </>
  );
}
