import type { Metadata } from "next";
import { Suspense } from "react";
import { BoxBuilder } from "@/components/box/box-builder";
import { PantryCalculator } from "@/components/features/pantry-calculator";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { brand } from "@/lib/brand";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Build your box",
  description:
    "Choose 8, 10, 12 or 20 meals, pick every flavour yourself, and grab the 10-Pack combo at €49.99.",
  alternates: { canonical: "/build-a-box" },
  openGraph: {
    title: `Build your box · ${brand.name}`,
    description: "Pick your meals. Choose one-time or subscribe & save 15%.",
    url: absoluteUrl("/build-a-box"),
  },
};

export default function BuildABoxPage() {
  return (
    <div className="container-full py-12 sm:py-16">
      <header className="mb-12 max-w-2xl">
        <Reveal>
          <p className="kicker text-fg-subtle">Build a box</p>
        </Reveal>
        <h1 className="mt-5 text-[length:var(--text-display-sm)] leading-[0.9] tracking-[-0.04em] uppercase">
          <RevealLines lines={["Your box.", "Your flavours."]} />
        </h1>
        <Reveal delay={0.1}>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-fg-muted">
            Three decisions: how many meals, which ones, and whether it should turn up again next
            month. The 10-Pack is the combo — ten pouches for €49.99.
          </p>
        </Reveal>
      </header>

      <Suspense
        fallback={
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
            <Skeleton className="h-[36rem] rounded-2xl" />
            <Skeleton className="h-[28rem] rounded-2xl" />
          </div>
        }
      >
        <BoxBuilder />
      </Suspense>

      <div className="mt-20">
        <PantryCalculator />
      </div>
    </div>
  );
}
