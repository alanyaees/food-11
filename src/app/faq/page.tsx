import type { Metadata } from "next";
import { CtaBand } from "@/components/content/cta-band";
import { FaqSections } from "@/components/content/faq-sections";
import { PageHero } from "@/components/content/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ConceptBadge } from "@/components/ui/concept-badge";
import { brand, disclaimers } from "@/lib/brand";
import { faqItems, faqStructuredData } from "@/lib/faq";
import { faqSchema } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

const title = "FAQ";
const description =
  "Straight answers about FULL. — what it is, how much protein is in a meal, how to prepare it, allergens, subscriptions, shipping and returns. Including the questions we cannot answer yet.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "article",
    title: `${title} · ${brand.name}`,
    description,
    url: absoluteUrl("/faq"),
    siteName: brand.name,
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqStructuredData())} />

      <PageHero
        kicker="Frequently asked"
        titleLines={["Questions,", "answered", "properly."]}
        titleId="faq-title"
        lead="Everything below is written the way we would say it out loud. Where an answer depends on food testing, regulatory review or a carrier contract we have not signed, we say that instead of inventing a number."
        size="md"
        stats={[
          { label: "Questions", value: String(faqItems.length) },
          { label: "Categories", value: "5" },
        ]}
        aside={
          <div className="mt-7">
            <ConceptBadge />
          </div>
        }
      />

      <FaqSections />

      <CtaBand
        kicker="Nothing here covering it?"
        titleLines={["Ask us", "directly."]}
        lead="Product, nutrition, wholesale or press — it reaches the people building the thing, not a queue."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "See the meals", href: "/shop" }}
        note={`${disclaimers.conceptLong} ${disclaimers.shelfLife} ${disclaimers.noMedicalClaims}`}
      />
    </>
  );
}
