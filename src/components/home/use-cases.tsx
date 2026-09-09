"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandImage } from "@/components/brand/brand-image";
import { Reveal } from "@/components/ui/reveal";
import type { FlavorAccent } from "@/lib/types";

const cases: {
  headline: string;
  body: string;
  assetKey: string;
  accent: FlavorAccent;
  alt: string;
}[] = [
  {
    headline: "For the 8:40 lecture.",
    body: "Breakfast you can actually assemble at 8:12.",
    assetKey: "lifestyle-student",
    accent: "cheddar",
    alt: "A student pouring hot water into a meal pouch in a modern flat",
  },
  {
    headline: "For the 6pm workout.",
    body: "Something to eat after training that isn't another shake.",
    assetKey: "lifestyle-fitness",
    accent: "chili",
    alt: "A young adult eating a high-protein meal at home after training",
  },
  {
    headline: "For the 11pm deadline.",
    body: "Hot food without leaving the desk or ordering in.",
    assetKey: "lifestyle-desk",
    accent: "truffle",
    alt: "A steaming meal pouch beside a laptop late at night",
  },
  {
    headline: "For the train.",
    body: "Flat, light, and it survives being sat on.",
    assetKey: "lifestyle-travel",
    accent: "tomato",
    alt: "Meal pouches packed flat inside a backpack on a train",
  },
  {
    headline: "For the airport.",
    body: "Hot water is free at every gate on earth.",
    assetKey: "process-pour",
    accent: "garlic",
    alt: "Hot water being poured into an open meal pouch",
  },
  {
    headline: "For the “I forgot to buy groceries.”",
    body: "The shelf that means you never eat cereal for dinner again.",
    assetKey: "banner-pantry",
    accent: "jalapeno",
    alt: "A kitchen shelf stacked with flat meal pouches",
  },
  {
    headline: "For every day you don't feel like cooking.",
    body: "Which, honestly, is most of them.",
    assetKey: "closeup-mac-cheddar",
    accent: "cheddar",
    alt: "Close-up of creamy cheddar macaroni and cheese",
  },
];

export function UseCases() {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.min(rail.clientWidth * 0.8, 520);
    rail.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <section className="overflow-hidden py-20 sm:py-28" aria-labelledby="use-cases-heading">
      <div className="container-full">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="kicker text-fg-subtle">06 — When</p>
            </Reveal>
            <h2
              id="use-cases-heading"
              className="mt-5 max-w-xl text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
            >
              Built for the gaps in your day.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="press grid size-11 place-items-center rounded-full border border-line-strong text-fg-muted hover:border-ink hover:text-ink"
              aria-label="Scroll use cases backwards"
            >
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="press grid size-11 place-items-center rounded-full border border-line-strong text-fg-muted hover:border-ink hover:text-ink"
              aria-label="Scroll use cases forwards"
            >
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-5 px-5 pb-2 sm:gap-6 md:px-8 xl:px-12"
        tabIndex={0}
        aria-label="Use cases, horizontally scrollable"
      >
        {cases.map((item, index) => (
          <article
            key={item.headline}
            className="group relative w-[78vw] max-w-[26rem] shrink-0 snap-start sm:w-[42vw] lg:w-[30vw]"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <BrandImage
                assetKey={item.assetKey}
                accent={item.accent}
                alt={item.alt}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 42vw, 78vw"
                className="aspect-3/4 w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,12,0)_38%,rgba(14,14,12,0.85)_100%)]"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="kicker text-white/55">0{index + 1}</p>
                <h3 className="font-display mt-2 text-[clamp(1.4rem,3.4vw,1.9rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-white uppercase">
                  {item.headline}
                </h3>
                <p className="mt-2 max-w-[24ch] text-sm text-white/75">{item.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
