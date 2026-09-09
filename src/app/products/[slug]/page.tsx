import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Flame, Timer } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { MacroGrid } from "@/components/product/macro-grid";
import { ProductCard } from "@/components/product/product-card";
import { NutritionLabel } from "@/components/features/nutrition-label";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ConceptBadge, DisclaimerNote } from "@/components/ui/concept-badge";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { accents } from "@/lib/accents";
import { brand, disclaimers } from "@/lib/brand";
import { getAsset } from "@/lib/assets";
import { categoryLabels, dietaryLabels, getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/products";
import { breadcrumbSchema, productSchema } from "@/lib/seo";
import { absoluteUrl, formatPrice, proteinDensity } from "@/lib/utils";

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Meal not found" };

  const asset = getAsset(product.images.closeup);
  const title = `${product.line} — ${product.flavor}`;
  const description = `${product.nutrition.protein} g protein, ${product.nutrition.calories} kcal, ready in ${product.prepMinutes} minutes. ${product.description}`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${title} · ${brand.name}`,
      description,
      url: absoluteUrl(`/products/${product.slug}`),
      type: "website",
      images: asset ? [{ url: asset.path, width: asset.width, height: asset.height }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${brand.name}`,
      description,
      images: asset ? [asset.path] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug, 3);
  const density = proteinDensity(product.nutrition.protein, product.nutrition.calories);
  const tone = accents[product.accent];

  const sections = [
    {
      question: "Why you'll love it",
      answer: (
        <ul className="space-y-2.5">
          {product.loveIt.map((point) => (
            <li key={point} className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: tone.base }}
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      question: "Ingredients, in plain English",
      answer: (
        <div>
          <ul className="space-y-3">
            {product.ingredients.map((ingredient) => (
              <li key={ingredient.name}>
                <p className="font-semibold text-ink">{ingredient.name}</p>
                <p className="mt-0.5">{ingredient.why}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-bone-200/70 p-3 text-xs">
            <span className="font-semibold text-ink">Allergens:</span>{" "}
            {product.allergens.join(", ")}. {disclaimers.shelfLife}
          </p>
        </div>
      ),
    },
    {
      question: "Preparation, step by step",
      answer: (
        <ol className="space-y-3">
          {product.prepSteps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="num font-display shrink-0 text-sm font-extrabold text-fg-subtle">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="font-semibold text-ink">{step.title}.</span> {step.detail}
              </span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      question: "Shipping & storage",
      answer: (
        <div className="space-y-2">
          <p>
            Free shipping over {formatPrice(brand.shipping.freeThresholdCents)}, otherwise{" "}
            {formatPrice(brand.shipping.flatRateCents)} flat. Launch regions:{" "}
            {brand.shipping.regions}
          </p>
          <p>
            Store the pouch somewhere dry and out of direct sunlight — a cupboard, a desk drawer, a
            locker. No refrigeration before opening. Printed best-before dates and validated
            shelf-life figures follow stability testing.
          </p>
          <p>
            Pre-launch orders are held and confirmed by email before dispatch; you can cancel any
            unshipped order from your account.
          </p>
        </div>
      ),
    },
    {
      question: "Questions people ask about this one",
      answer: (
        <div className="space-y-3">
          <p>
            <span className="font-semibold text-ink">Is it a meal replacement?</span> No. It is a
            meal. It is designed to be eaten as one of your normal meals, not as a substitute for
            eating properly.
          </p>
          <p>
            <span className="font-semibold text-ink">Can I add things to it?</span> Please do.
            Testers add hot sauce, extra pepper, a handful of spinach, leftover chicken. It behaves
            like food, because it is.
          </p>
          <p>
            <span className="font-semibold text-ink">Why is the protein figure “concept”?</span>{" "}
            Because the recipe is still being finalised. Every number here is a formulation target
            and will be replaced with laboratory-analysed label values before anything is sold.{" "}
            <Link href="/nutrition#data" className="link-underline font-semibold text-ink">
              How we handle nutrition data
            </Link>
            .
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: `${product.line} — ${product.flavor}`, path: `/products/${product.slug}` },
          ]),
        ]}
      />

      <div className="container-full pt-6 pb-16 sm:pb-24">
        <nav aria-label="Breadcrumb" className="kicker flex items-center gap-1.5 text-fg-subtle">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <ChevronRight className="size-3" aria-hidden />
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <ChevronRight className="size-3" aria-hidden />
          <span className="text-ink">{product.flavor}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery product={product} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{categoryLabels[product.category]}</Badge>
              {product.dietary.map((tag) => (
                <Badge key={tag} tone="outline">
                  {dietaryLabels[tag]}
                </Badge>
              ))}
              {product.heat > 0 ? (
                <Badge tone="ink">
                  <Flame className="size-3" aria-hidden />
                  Heat {product.heat}/3
                </Badge>
              ) : null}
            </div>

            <h1 className="mt-5 text-[clamp(2.2rem,5.4vw,3.4rem)] leading-[0.9] tracking-[-0.04em] uppercase">
              {product.line}
              <span className="block" style={{ color: tone.ink }}>
                {product.flavor}
              </span>
            </h1>

            <p className="mt-4 text-[1.0625rem] leading-relaxed text-fg-muted">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <p className="num font-display text-3xl font-extrabold tracking-tight">
                {formatPrice(product.priceCents)}
              </p>
              <p className="num text-sm text-fg-muted">
                {density} g protein per 100 kcal
                <span aria-hidden className="mx-2 text-line-strong">
                  ·
                </span>
                <Timer className="mr-1 inline size-3.5" aria-hidden />
                {product.prepMinutes} min
              </p>
            </div>

            <div className="mt-7">
              <PurchasePanel product={product} />
            </div>

            <div className="mt-8">
              <MacroGrid product={product} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ConceptBadge />
              <DisclaimerNote className="flex-1">{disclaimers.conceptLong}</DisclaimerNote>
            </div>

            <div className="mt-8 border-t border-line">
              <Accordion items={sections} defaultOpen={0} />
            </div>
          </div>
        </div>
      </div>

      {/* The story + the full label */}
      <section className="bg-bone-100 py-16 sm:py-24" aria-labelledby="story-heading">
        <div className="container-full grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <p className="kicker text-fg-subtle">How this one was built</p>
            <h2
              id="story-heading"
              className="mt-5 text-[length:var(--text-display-xs)] leading-none tracking-[-0.035em] uppercase"
            >
              {product.tagline}
            </h2>
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-fg-muted">
              {product.story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <NutritionLabel product={product} />
        </div>
      </section>

      {/* Related */}
      <section className="container-full py-16 sm:py-24" aria-labelledby="related-heading">
        <h2
          id="related-heading"
          className="text-[length:var(--text-display-xs)] leading-none tracking-[-0.035em] uppercase"
        >
          Eat this next
        </h2>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.06}>
              <ProductCard product={item} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
