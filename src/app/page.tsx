import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ProblemSection } from "@/components/home/problem-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { MacroHero } from "@/components/home/macro-hero";
import { WhyDehydrated } from "@/components/home/why-dehydrated";
import { UseCases } from "@/components/home/use-cases";
import { TransparencySection } from "@/components/home/transparency-section";
import { ReviewsSection } from "@/components/home/reviews-section";
import { FinalCta } from "@/components/home/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { brand } from "@/lib/brand";
import { getProducts } from "@/lib/products";
import { productSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.shortPitch,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.shortPitch,
    url: "/",
  },
};

export default function HomePage() {
  const products = getProducts();

  return (
    <>
      <JsonLd data={products.map(productSchema)} />
      <Hero />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturedProducts />
      <MacroHero />
      <WhyDehydrated />
      <UseCases />
      <TransparencySection />
      <ReviewsSection />
      <FinalCta />
    </>
  );
}
