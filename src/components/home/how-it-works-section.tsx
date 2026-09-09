import { ArrowRight } from "lucide-react";
import { PrepSequence } from "@/components/features/prep-sequence";
import { Button } from "@/components/ui/button";
import { Reveal, RevealLines } from "@/components/ui/reveal";

export function HowItWorksSection() {
  return (
    <section className="container-full py-20 sm:py-28" aria-labelledby="how-heading">
      <div className="flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Reveal>
            <p className="kicker text-fg-subtle">02 — Preparation</p>
          </Reveal>
          <h2
            id="how-heading"
            className="mt-5 text-[length:var(--text-display-md)] leading-[0.9] tracking-[-0.04em] uppercase"
          >
            <RevealLines lines={["Dinner in", "three moves."]} />
          </h2>
        </div>
        <Reveal delay={0.1} className="sm:pb-2">
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-fg-muted">
            No pan. No hob. No chopping board, no colander, no washing up. A kettle is the entire
            equipment list.
          </p>
          <Button href="/how-it-works" variant="ghost" size="sm" className="mt-4 -ml-3 group">
            The full walkthrough
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Button>
        </Reveal>
      </div>

      <div className="pt-12">
        <PrepSequence />
      </div>
    </section>
  );
}
