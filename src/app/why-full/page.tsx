import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/content/cta-band";
import { PageHero } from "@/components/content/page-hero";
import { StickyStory } from "@/components/content/sticky-story";
import { TradeOffTable } from "@/components/content/trade-off-table";
import { Marquee } from "@/components/ui/marquee";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { brand, disclaimers } from "@/lib/brand";
import { whyFull } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

const title = "Why FULL.";
const description =
  "Convenience food solved speed in 1958 and stopped there. Six things a meal can be good at — time, nutrition, protein, storage, portability, taste — and why we refuse to trade any of them.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/why-full" },
  openGraph: {
    type: "article",
    title: `${title} · ${brand.name}`,
    description,
    url: absoluteUrl("/why-full"),
    siteName: brand.name,
  },
};

export default function WhyFullPage() {
  return (
    <>
      <PageHero
        kicker={whyFull.hero.kicker}
        titleLines={whyFull.hero.titleLines}
        titleId="why-full-title"
        lead={whyFull.hero.lead}
        size="md"
        stats={[
          { label: "Solved by the category", value: "1 / 6" },
          { label: "What we design for", value: "6 / 6" },
        ]}
      />

      {/* Six words, on repeat. */}
      <div className="grain relative overflow-hidden bg-ink py-5 text-on-ink sm:py-7">
        <Marquee
          items={whyFull.pillars.map((pillar) => pillar.key.toUpperCase())}
          separator="/"
          speed="34s"
          className="font-display text-[clamp(1.75rem,5vw,3.25rem)] leading-none font-extrabold tracking-[-0.04em] uppercase"
        />
      </div>

      <StickyStory
        pillars={whyFull.pillars}
        kicker="The six-part brief"
        heading="One out of six is not a category. It's a habit."
        lead={whyFull.hero.subLead}
      />

      {/* The honest comparison */}
      <section
        className="border-t border-line py-16 sm:py-24"
        aria-labelledby="trade-off-heading"
        id="the-trade"
      >
        <div className="container-full">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <div>
              <Reveal>
                <p className="kicker text-fg-subtle">{whyFull.tradeOff.kicker}</p>
              </Reveal>
              <h2
                id="trade-off-heading"
                className="mt-5 max-w-xl text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
              >
                <RevealLines lines={[whyFull.tradeOff.title]} />
              </h2>
            </div>
            <Reveal delay={0.1}>
              <p className="max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">
                {whyFull.tradeOff.lead}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                <Link
                  href="/nutrition#compare"
                  className="link-underline inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-ink"
                >
                  Compare it against your own lunch
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href="/how-it-works"
                  className="link-underline inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-fg-muted"
                >
                  How the format works
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="mt-12">
            <TradeOffTable />
          </div>
        </div>
      </section>

      <CtaBand
        kicker="The whole point"
        titleLines={whyFull.close.titleLines}
        lead={whyFull.close.lead}
        note={`${disclaimers.conceptLong} ${disclaimers.noMedicalClaims}`}
      />
    </>
  );
}
