import { ArrowRight } from "lucide-react";
import { MacroCompare } from "@/components/features/macro-compare";
import { Button } from "@/components/ui/button";
import { Reveal, RevealLines } from "@/components/ui/reveal";

const compromises = [
  {
    title: "Protein as an afterthought",
    body: "Most instant meals land under 12 g. Enough to be food, not enough to be a meal you can build a day around.",
  },
  {
    title: "Calories doing nothing",
    body: "Convenience food is rarely low in energy. It is just rarely spending that energy on anything useful.",
  },
  {
    title: "Fibre missing entirely",
    body: "The reason a 520 kcal instant bowl leaves you opening the cupboard again 40 minutes later.",
  },
];

export function ProblemSection() {
  return (
    <section
      className="grain relative overflow-hidden bg-ink py-20 text-on-ink sm:py-28"
      aria-labelledby="problem-heading"
    >
      <div className="container-full relative z-2">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="kicker text-on-ink-muted">01 — The problem</p>
            </Reveal>
            <h2
              id="problem-heading"
              className="mt-6 text-[length:var(--text-display-md)] leading-[0.9] tracking-[-0.04em] uppercase"
            >
              <RevealLines
                lines={[
                  "Ready-to-eat",
                  "shouldn't mean",
                  <span key="compromise" className="text-ember">
                    ready-to-compromise.
                  </span>,
                ]}
              />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-on-ink-muted">
                Instant food has been optimised for shelf life and price for forty years. Nutrition
                was never the brief. So you get the convenience, and you quietly pay for it in
                protein, fibre and satisfaction.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-6 border-t border-white/12 pt-8">
              {compromises.map((item, index) => (
                <Reveal as="li" key={item.title} delay={0.05 * index} className="flex gap-5">
                  <span className="num font-display shrink-0 text-lg font-extrabold text-white/25">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-on-ink-muted">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.15}>
              <Button href="/nutrition" variant="outlineInverse" size="lg" className="mt-10 group">
                How we build a meal instead
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-6 backdrop-blur-sm sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl tracking-tight uppercase">Run the numbers</h3>
                <p className="kicker text-on-ink-muted">Interactive</p>
              </div>
              <p className="mt-2 text-sm text-on-ink-muted">
                Pick anything you would normally eat when you have no time. Then pick one of ours.
              </p>
              <div className="mt-6">
                <MacroCompare inverse dense showCta={false} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
