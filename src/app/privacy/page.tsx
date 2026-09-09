import type { Metadata } from "next";
import { LegalLayout } from "@/components/content/legal-layout";
import { brand } from "@/lib/brand";
import { privacySections } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

const title = "Privacy policy";
const description =
  "What personal data FULL. collects and why, who processes it, how long we keep it, and how to exercise your GDPR rights as an EU customer.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "article",
    title: `${title} · ${brand.name}`,
    description,
    url: absoluteUrl("/privacy"),
    siteName: brand.name,
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      kicker="Legal"
      title="Privacy policy"
      lead="What we collect, why we collect it, who else touches it, how long we keep it, and how to make us delete it."
      summary="The short version: we collect what is needed to run an account, take a payment and ship a box. We do not sell personal data, we do not build advertising profiles, and analytics only run if you agree to them."
      sections={privacySections}
    />
  );
}
