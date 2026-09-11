import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Pouch, pouchPropsFromProduct } from "@/components/brand/pouch";
import { AnchorNav } from "@/components/content/anchor-nav";
import { ContentSection } from "@/components/content/content-section";
import { CtaBand } from "@/components/content/cta-band";
import { DensityPanel } from "@/components/content/density-panel";
import { EditorialFigure } from "@/components/content/editorial-figure";
import { PouchDiagram } from "@/components/content/pouch-diagram";
import { PrepSequence } from "@/components/content/prep-sequence";
import { WaterCycle } from "@/components/content/water-cycle";
import { PageHero } from "@/components/content/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { brand, disclaimers } from "@/lib/brand";
import { howItWorks } from "@/lib/content";
import { getProductBySlug } from "@/lib/products";
import { absoluteUrl } from "@/lib/utils";

const title = "How it works";
const description =
  "Pouch to plate: how a FULL. meal is built, why the water comes out, what the packaging is doing, and exactly how you prepare it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    type: "article",
    title: `${title} · ${brand.name}`,
    description,
    url: absoluteUrl("/how-it-works"),
    siteName: brand.name,
  },
};

const reference = getProductBySlug("mac-and-cheese-classic-cheddar")!;
const { sections } = howItWorks;

const navItems = [
  { id: sections.food.id, label: sections.food.nav },
  { id: sections.preservation.id, label: sections.preservation.nav },
  { id: sections.packaging.id, label: sections.packaging.nav },
  { id: sections.preparation.id, label: sections.preparation.nav },
  { id: sections.macros.id, label: sections.macros.nav },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        kicker={howItWorks.hero.kicker}
        titleLines={howItWorks.hero.titleLines}
        titleId="how-it-works-title"
        lead={howItWorks.hero.lead}
        stats={howItWorks.hero.stats}
      />

      <AnchorNav items={navItems} label="Sections of this page" />

      {/* 01 — The food */}
      <ContentSection
        copy={sections.food}
        tone="dark"
        mediaSide="right"
        media={
          <EditorialFigure
            assetKey="macro-hero-bowl"
            alt="Extreme close-up of a fork lifting cheesy macaroni from a bowl, with a cheese pull caught mid-air"
            caption="Pictured: Pasta Bowl, Creamy Cheese. Prepared exactly as the instructions describe."
            aspect="aspect-4/3"
            tone="dark"
            priority
          />
        }
      >
        <Reveal>
          <div className="grid gap-6 border-t border-white/12 pt-8 sm:grid-cols-3">
            {[
              {
                label: "Recipe first",
                body: "The bowl is designed before the format. If the format ruins the bowl, the format changes.",
              },
              {
                label: "Protein in the dough",
                body: "Pea and milk protein are built into the pasta and the sauce base, not stirred in at the end.",
              },
              {
                label: "Fibre on purpose",
                body: "Chickpea flour and chicory root fibre thicken sauces, so thickening does a second job.",
              },
            ].map((item) => (
              <div key={item.label}>
                <h3 className="kicker text-ember">{item.label}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-on-ink-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </ContentSection>

      {/* 02 — Preservation */}
      <ContentSection
        copy={sections.preservation}
        mediaSide="left"
        media={
          <WaterCycle
            dryWeightG={reference.nutrition.servingWeightG}
            waterMl={reference.waterMl}
            accent={reference.accent}
          />
        }
      />

      {/* 03 — The packaging */}
      <ContentSection
        copy={sections.packaging}
        mediaSide="right"
        media={
          <div className="relative mx-auto flex max-w-sm justify-center rounded-2xl border border-line bg-[radial-gradient(120%_100%_at_50%_0%,#fbf8f1,#e9e2d2)] px-6 py-10 sm:px-8 sm:py-12">
            <Pouch
              {...pouchPropsFromProduct(reference, {
                tilt: -3,
                sizes: "(min-width: 1024px) 18rem, 70vw",
              })}
              className="max-w-[18rem]"
            />
          </div>
        }
      >
        <PouchDiagram />
      </ContentSection>

      {/* 04 — Preparation */}
      <ContentSection copy={sections.preparation}>
        <PrepSequence
          steps={howItWorks.prepSteps}
          waterMl={reference.waterMl}
          prepMinutes={reference.prepMinutes}
          protein={reference.nutrition.protein}
          calories={reference.nutrition.calories}
          accent={reference.accent}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 sm:gap-8">
          <EditorialFigure
            assetKey="process-pour"
            fallbackKey="lifestyle-student"
            alt="Just-boiled water being poured from a kettle into a standing meal pouch on a kitchen counter"
            caption="Pour to the fill line. It is the only measurement in the whole process."
            accent="cheddar"
            aspect="aspect-4/3"
            sizes="(min-width: 640px) 45vw, 92vw"
          />
          <EditorialFigure
            assetKey="process-steam"
            fallbackKey="closeup-mac-cheddar"
            alt="Steam rising from a freshly prepared bowl of high-protein macaroni and cheese"
            caption="Then leave it alone. The standing time is doing the cooking you did not have to do."
            accent="tomato"
            aspect="aspect-4/3"
            sizes="(min-width: 640px) 45vw, 92vw"
          />
        </div>
      </ContentSection>

      {/* 05 — The macros */}
      <ContentSection
        copy={sections.macros}
        tone="dark"
        mediaSide="right"
        media={<DensityPanel />}
      >
        <Reveal>
          <div className="flex flex-col gap-6 border-t border-white/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[0.9375rem] leading-relaxed text-on-ink-muted">
              Full macro breakdowns, micronutrients and the reasoning behind every ingredient live
              on the nutrition page.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/nutrition"
                className="link-underline inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-on-ink"
              >
                See the nutrition detail
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </ContentSection>

      <CtaBand
        kicker="Pouch to plate"
        titleLines={["Three minutes", "from now."]}
        lead="Pick a flavour, or build a box and keep a week of backup in a drawer."
        note={`${disclaimers.conceptLong} ${disclaimers.shelfLife}`}
      />
    </>
  );
}
