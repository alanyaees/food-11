import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentSection } from "@/components/content/content-section";
import { CtaBand } from "@/components/content/cta-band";
import { EditorialFigure } from "@/components/content/editorial-figure";
import { NumberedList, StatusList } from "@/components/content/editorial-list";
import { PageHero } from "@/components/content/page-hero";
import { PullQuote } from "@/components/content/pull-quote";
import { DisclaimerNote } from "@/components/ui/concept-badge";
import { Reveal } from "@/components/ui/reveal";
import { brand, disclaimers } from "@/lib/brand";
import { about } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

const title = "About";
const description =
  "We started with one question: why is convenient food usually the food you have to compromise on? What we're building, what we refuse to do, and where FULL. stands today.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "article",
    title: `${title} · ${brand.name}`,
    description,
    url: absoluteUrl("/about"),
    siteName: brand.name,
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker={about.hero.kicker}
        titleLines={about.hero.questionLines}
        titleId="about-title"
        lead={about.hero.lead}
        size="sm"
        aside={
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="#status"
              className="link-underline inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-ink"
            >
              Skip to where we are
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        }
      />

      {/* Full-bleed establishing shot */}
      <section aria-label="The moment this is designed for" className="border-b border-line">
        <div className="container-full py-12 sm:py-16">
          <Reveal>
            <EditorialFigure
              assetKey="lifestyle-desk"
              alt="A meal pouch with steam rising beside a laptop on a late-night desk"
              caption="21:40 on a weeknight. This is the moment the category has never taken seriously."
              aspect="aspect-16/9"
              sizes="(min-width: 1024px) 90vw, 92vw"
              priority
            />
          </Reveal>
        </div>
      </section>

      <ContentSection
        copy={about.building}
        mediaSide="right"
        className="border-t-0"
        media={
          <EditorialFigure
            assetKey="lifestyle-student"
            alt="A student in a modern flat pouring hot water into a matte black meal pouch on the kitchen counter"
            caption="No pan, no measuring, no washing up. That constraint shapes every recipe decision."
          />
        }
      />

      <ContentSection
        copy={about.cooking}
        mediaSide="left"
        media={
          <EditorialFigure
            assetKey="lifestyle-travel"
            alt="Two flat matte black meal pouches packed inside a backpack on a train seat"
            caption="Where the realistic alternative is a bar, a station sandwich, or nothing."
          />
        }
      >
        <div className="border-t border-line pt-12">
          <PullQuote size="lg" attribution="The brief, in one sentence">
            {about.cooking.quote}
          </PullQuote>
        </div>
      </ContentSection>

      <ContentSection copy={about.refuse} tone="dark">
        <NumberedList items={about.refuse.items} tone="dark" />
      </ContentSection>

      <ContentSection copy={about.status}>
        <StatusList items={about.status.items} />
        <Reveal>
          <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-line bg-bone-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-xl">
              <p className="font-display text-lg font-extrabold tracking-[-0.03em] uppercase">
                No press logos. No customer counts. No badges.
              </p>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-fg-muted">
                We do not borrow press logos, invent customer counts or dress the site up with
                credibility we have not earned. The meals and the numbers should do the talking.
              </p>
            </div>
            <Link
              href="/contact"
              className="press inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-ink/25 px-6 text-sm font-semibold text-ink hover:border-ink"
            >
              Ask us anything
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <DisclaimerNote className="mt-6">
          {disclaimers.conceptLong} {disclaimers.shelfLife}
        </DisclaimerNote>
      </ContentSection>

      <ContentSection copy={about.principles}>
        <NumberedList items={about.principles.items} columns={2} />
      </ContentSection>

      <CtaBand
        kicker="If that sounds like your kind of company"
        titleLines={["Come and", "eat with us."]}
        lead="The range is small on purpose. Start with the flavour you would actually crave at the end of a long day."
        note={disclaimers.noMedicalClaims}
      />
    </>
  );
}
