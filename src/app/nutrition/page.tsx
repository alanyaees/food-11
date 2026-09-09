import type { Metadata } from "next";
import Link from "next/link";
import {
  Boxes,
  Eye,
  HeartHandshake,
  Scale,
  Sprout,
  Timer,
} from "lucide-react";
import { BrandImage } from "@/components/brand/brand-image";
import { MacroCompare } from "@/components/features/macro-compare";
import { NutritionLabel } from "@/components/features/nutrition-label";
import { PantryCalculator } from "@/components/features/pantry-calculator";
import { MacroModeToggle } from "@/components/features/macro-mode-toggle";
import { Button } from "@/components/ui/button";
import { ConceptBadge, DisclaimerNote } from "@/components/ui/concept-badge";
import { Counter } from "@/components/ui/counter";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { brand, disclaimers } from "@/lib/brand";
import { getProductBySlug, getProducts } from "@/lib/products";
import { breadcrumbSchema } from "@/lib/seo";
import { absoluteUrl, proteinDensity } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nutrition",
  description:
    "How FULL. builds a meal around protein instead of adding it afterwards — the philosophy, the numbers, and how we handle concept versus verified nutrition data.",
  alternates: { canonical: "/nutrition" },
  openGraph: {
    title: `Nutrition · ${brand.name}`,
    description:
      "We don't count protein as a bonus. We build the meal around it. See the numbers and how we label them.",
    url: absoluteUrl("/nutrition"),
  },
};

const principles = [
  {
    icon: Scale,
    title: "High protein",
    body: "Every meal targets 36–45 g of protein per pouch, from dairy protein, pulses, pea protein and, in the chili, real slow-cooked beef.",
  },
  {
    icon: Sprout,
    title: "Macro conscious",
    body: "We design to protein per 100 kcal, not to a headline number. Calories have to earn their place in the bowl.",
  },
  {
    icon: HeartHandshake,
    title: "Fibre on purpose",
    body: "6–12 g per meal from chickpea flour, beans, chicory root and vegetables — the part instant food usually forgets.",
  },
  {
    icon: Timer,
    title: "Convenience kept",
    body: "None of it matters if it takes 30 minutes. A kettle and three minutes is the whole method.",
  },
  {
    icon: Boxes,
    title: "Shelf stability",
    body: "Removing water is what lets a real meal live in a cupboard. Storage and shelf-life figures are being validated before launch.",
  },
  {
    icon: Eye,
    title: "Ingredient transparency",
    body: "Every ingredient is listed with the reason it is there. Nothing hides behind a flavour blend.",
  },
];

const philosophy = [
  {
    title: "Start with the meal people actually want",
    body: "Not a shake, not a bar, not a diet plate. Mac & cheese, pasta, risotto, chili — food that has to earn its place on taste alone.",
  },
  {
    title: "Set the nutritional target before the recipe",
    body: "Protein per serving, protein per 100 kcal, fibre and a calorie ceiling are fixed at the start. They are constraints, not aspirations.",
  },
  {
    title: "Engineer the composition to hit it",
    body: "Protein goes into the pasta dough and the sauce base, not on top. Thickening comes partly from chickpea flour so it brings fibre with it.",
  },
  {
    title: "Preserve the convenience",
    body: "If it needs a pan, a hob or a chopping board, it has failed. Everything is designed around hot water and one pouch.",
  },
  {
    title: "Obsess over taste, then re-check the numbers",
    body: "Every tasting round is followed by a recalculation. If a change improves flavour but wrecks the macros, it does not ship.",
  },
];

export default function NutritionPage() {
  const products = getProducts();
  const hero = getProductBySlug("mac-and-cheese-classic-cheddar")!;
  const bestDensity = Math.max(
    ...products.map((p) => proteinDensity(p.nutrition.protein, p.nutrition.calories)),
  );
  const proteinRange = [
    Math.min(...products.map((p) => p.nutrition.protein)),
    Math.max(...products.map((p) => p.nutrition.protein)),
  ];
  const fibreRange = [
    Math.min(...products.map((p) => p.nutrition.fibre)),
    Math.max(...products.map((p) => p.nutrition.fibre)),
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Nutrition", path: "/nutrition" },
        ])}
      />

      {/* Hero */}
      <section className="container-full pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <div>
            <Reveal>
              <p className="kicker text-fg-subtle">Nutrition</p>
            </Reveal>
            <h1 className="mt-5 text-[length:var(--text-display-md)] leading-[0.88] tracking-[-0.045em] uppercase">
              <RevealLines
                lines={[
                  "We don't count",
                  "protein as a bonus.",
                  <span key="build" className="text-ember">
                    We build the meal around it.
                  </span>,
                ]}
              />
            </h1>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">
                Most convenience food is designed for cost and shelf life, then checked for
                nutrition at the end. We do it the other way round: the nutritional target is the
                brief, and the recipe has to satisfy it without tasting like a compromise.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-6">
                <div>
                  <dt className="kicker text-fg-subtle">Protein / pouch</dt>
                  <dd className="num font-display mt-2 text-2xl font-extrabold tracking-tight">
                    {proteinRange[0]}–{proteinRange[1]} g
                  </dd>
                </div>
                <div>
                  <dt className="kicker text-fg-subtle">Best density</dt>
                  <dd className="num font-display mt-2 text-2xl font-extrabold tracking-tight">
                    <Counter value={bestDensity} decimals={1} suffix=" g" />
                  </dd>
                </div>
                <div>
                  <dt className="kicker text-fg-subtle">Fibre</dt>
                  <dd className="num font-display mt-2 text-2xl font-extrabold tracking-tight">
                    {fibreRange[0]}–{fibreRange[1]} g
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ConceptBadge />
                <MacroModeToggle />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <BrandImage
              assetKey="ingredients-mac-cheddar"
              accent="cheddar"
              alt="Overhead flat-lay of pasta, cheese, pulses, powders and seasonings arranged in neat rows"
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="aspect-4/3 w-full rounded-2xl"
            />
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="grain bg-ink py-20 text-on-ink sm:py-28" aria-labelledby="philosophy">
        <div className="container-full">
          <div className="max-w-2xl">
            <p className="kicker text-on-ink-muted">The method</p>
            <h2
              id="philosophy"
              className="mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
            >
              Five steps, in this order.
            </h2>
          </div>

          <ol className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {philosophy.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 0.05}>
                <p className="num font-display text-4xl leading-none font-extrabold text-white/20">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-lg leading-tight font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-ink-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Principles */}
      <section className="container-full py-20 sm:py-28" aria-labelledby="principles">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker text-fg-subtle">What we optimise for</p>
            <h2
              id="principles"
              className="mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
            >
              Six things, every meal.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-fg-muted">
            None of these are health claims. They are design constraints we hold ourselves to while
            developing the range.
          </p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04}>
              <div className="border-t border-line pt-5">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-on-ink">
                  <item.icon className="size-4.5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg leading-tight font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <DisclaimerNote className="mt-10">{disclaimers.noMedicalClaims}</DisclaimerNote>
      </section>

      {/* Comparison */}
      <section
        id="compare"
        className="scroll-mt-24 bg-bone-100 py-20 sm:py-28"
        aria-labelledby="compare-heading"
      >
        <div className="container-full grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="kicker text-fg-subtle">Compare your meal</p>
            <h2
              id="compare-heading"
              className="mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
            >
              Put us next to whatever you were going to eat.
            </h2>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
              Pick a typical convenience meal on the left and any of ours on the right. The bars
              move, the numbers are real arithmetic, and the sources are labelled.
            </p>
            <Button href="/shop" variant="outline" className="mt-7">
              See the range
            </Button>
          </div>
          <div className="rounded-2xl border border-line bg-bone p-6 sm:p-8">
            <MacroCompare />
          </div>
        </div>
      </section>

      {/* Label */}
      <section className="container-full py-20 sm:py-28" aria-labelledby="label-heading">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <p className="kicker text-fg-subtle">The full panel</p>
            <h2
              id="label-heading"
              className="mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
            >
              Nothing hidden behind a flavour blend.
            </h2>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
              This is the same panel you will find on every product page. Switch to Macro Nerd mode
              to see density, energy split, serving weight and ingredient shares.
            </p>
            <div className="mt-6">
              <MacroModeToggle />
            </div>
          </div>
          <NutritionLabel product={hero} />
        </div>
      </section>

      {/* Pantry calculator */}
      <section className="container-full pb-20 sm:pb-28">
        <PantryCalculator />
      </section>

      {/* Data policy */}
      <section
        id="data"
        className="scroll-mt-24 border-t border-line bg-bone-100 py-20 sm:py-24"
        aria-labelledby="data-heading"
      >
        <div className="container-full max-w-3xl">
          <p className="kicker text-fg-subtle">Nutrition data policy</p>
          <h2
            id="data-heading"
            className="mt-5 text-[length:var(--text-display-xs)] leading-none tracking-[-0.035em] uppercase"
          >
            Concept data versus verified data
          </h2>
          <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-fg-muted">
            <p>
              Everything currently shown on this site is <strong className="text-ink">concept
              data</strong>: formulation targets from recipe development, calculated from ingredient
              specifications rather than measured in a laboratory. Wherever they appear, they carry
              a “{disclaimers.conceptShort}” label.
            </p>
            <p>
              Before anything is sold, each recipe goes through laboratory analysis and the site
              switches to <strong className="text-ink">verified data</strong> — the values that
              appear on the legal label. When that happens, the badge changes and the analysis date
              is published alongside the panel.
            </p>
            <p>
              We will not quietly upgrade a number. If a formulation change moves protein or
              calories, the figure and its status change together.
            </p>
            <p className="text-sm">
              Questions about a specific figure? Ask us directly at{" "}
              <Link href="/contact" className="link-underline font-semibold text-ink">
                our contact page
              </Link>{" "}
              and we will tell you exactly where it came from.
            </p>
          </div>
          <DisclaimerNote className="mt-8">
            {disclaimers.noMedicalClaims} {disclaimers.comparisonNote}
          </DisclaimerNote>
        </div>
      </section>
    </>
  );
}
