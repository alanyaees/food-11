import type { Metadata } from "next";
import { LegalLayout } from "@/components/content/legal-layout";
import { brand } from "@/lib/brand";
import { termsSections } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

const title = "Terms";
const description =
  "Terms for using the FULL. site and, from launch, for buying from us: pre-launch status, ordering, VAT, shipping, EU withdrawal rights, food safety, subscriptions and liability.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "article",
    title: `${title} · ${brand.name}`,
    description,
    url: absoluteUrl("/terms"),
    siteName: brand.name,
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalLayout
      kicker="Legal"
      title="Terms and conditions"
      lead="How this site works, how buying from us will work, and what each of us is responsible for once food is involved."
      summary={`The short version: ${brand.name} is not selling yet, so everything about ordering describes how we intend to operate. Unopened pouches can go back within 14 days; opened ones cannot, on hygiene grounds. Subscriptions can be skipped, paused or cancelled by you, at any time.`}
      sections={termsSections}
    />
  );
}
