"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import type { Pillar } from "@/lib/content";
import { useScrollSpy } from "./use-scroll-spy";

/**
 * Sticky-scroll narrative.
 *
 * A fixed left column holds the argument and an index that tracks where
 * you are; the right column scrolls through one panel per pillar with an
 * oversized numeral behind it. The reveal is opacity and offset only —
 * nothing here changes layout, so text never reflows under the reader,
 * and with reduced motion it degrades to a plain numbered article.
 */
export function StickyStory({
  pillars,
  kicker,
  heading,
  lead,
  className,
}: {
  pillars: readonly Pillar[];
  kicker: string;
  heading: string;
  lead: string;
  className?: string;
}) {
  const reducedRaw = useReducedMotion();
  const reduced = reducedRaw === true;
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end end"],
  });

  const ids = pillars.map((pillar) => `pillar-${pillar.n}`);
  const active = useScrollSpy(ids, 300);
  const activeIndex = Math.max(
    0,
    ids.findIndex((id) => id === active),
  );

  return (
    <section
      className={cn("grain relative overflow-hidden bg-ink py-16 text-on-ink sm:py-24", className)}
      aria-labelledby="pillars-heading"
    >
      <div className="container-full relative z-2">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
          {/* Sticky argument column */}
          <div className="lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:h-fit lg:self-start">
            <p className="kicker text-on-ink-muted">{kicker}</p>
            <h2
              id="pillars-heading"
              className="mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase"
            >
              {heading}
            </h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-on-ink-muted">
              {lead}
            </p>

            {/* Index + progress rail */}
            <div className="mt-10 hidden gap-5 lg:flex">
              <div className="relative w-[2px] shrink-0 overflow-hidden rounded-full bg-white/12">
                <motion.div
                  className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-ember"
                  style={reduced ? { scaleY: 1 } : { scaleY: scrollYProgress }}
                />
              </div>
              <ol className="space-y-1">
                {pillars.map((pillar, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li key={pillar.n}>
                      <a
                        href={`#pillar-${pillar.n}`}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "flex min-h-9 items-center gap-3 text-sm font-semibold tracking-tight transition-colors",
                          isActive ? "text-on-ink" : "text-on-ink-muted hover:text-on-ink",
                        )}
                      >
                        <span className="num text-[0.7rem] opacity-60">{pillar.n}</span>
                        <span className="uppercase">{pillar.key}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Scrolling panels */}
          <div ref={trackRef} className="space-y-16 sm:space-y-20 lg:space-y-0">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.n}
                id={`pillar-${pillar.n}`}
                className="relative scroll-mt-[calc(var(--header-height)+2rem)] lg:flex lg:min-h-[86vh] lg:flex-col lg:justify-center"
              >
                <motion.div
                  className="relative"
                  initial={reduced ? undefined : { opacity: 0, y: 26 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Oversized numeral, sitting behind the opening line */}
                  <span
                    aria-hidden
                    className="font-display pointer-events-none absolute -top-14 -left-3 text-[length:var(--text-display-xl)] leading-[0.7] font-extrabold tracking-[-0.06em] text-white/[0.05] select-none sm:-top-20 lg:-left-10"
                  >
                    {pillar.n}
                  </span>

                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="num text-[0.7rem] font-bold tracking-[0.18em] text-ember">
                        {pillar.n}
                      </span>
                      <span className="font-display text-lg font-extrabold tracking-[-0.04em] uppercase">
                        {pillar.key}
                      </span>
                      <span className="kicker rounded-full border border-white/20 bg-white/[0.06] px-2.5 py-1.5 text-[0.6rem] text-on-ink-muted">
                        Category verdict: {pillar.legacyVerdict}
                      </span>
                    </div>

                    <h3 className="mt-5 max-w-xl text-[length:var(--text-display-xs)] leading-[1.02] tracking-[-0.035em] uppercase">
                      {pillar.title}
                    </h3>

                    <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-on-ink-muted sm:text-base">
                      {pillar.legacy}
                    </p>

                    <div className="mt-6 max-w-xl border-l-2 border-ember pl-5">
                      <p className="kicker text-ember">Our brief</p>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-on-ink sm:text-base">
                        {pillar.ours}
                      </p>
                    </div>

                    {index < pillars.length - 1 ? (
                      <div aria-hidden className="mt-12 h-px w-full bg-white/10 lg:hidden" />
                    ) : null}
                  </div>
                </motion.div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
