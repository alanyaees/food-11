import { ArrowRight } from "lucide-react";
import { Pouch } from "@/components/brand/pouch";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { brand } from "@/lib/brand";
import { getProducts } from "@/lib/products";

export function FinalCta() {
  const packs = getProducts().slice(0, 5);

  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(120%_100%_at_50%_10%,#fbf8f1_0%,#efeade_45%,#e0d7c3_100%)] pt-20 sm:pt-28"
      aria-labelledby="final-cta-heading"
    >
      <div className="container-full relative z-2">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="kicker text-fg-subtle">10 — Your move</p>
          </Reveal>
          <h2
            id="final-cta-heading"
            className="mt-6 text-[length:var(--text-display-lg)] leading-[0.84] tracking-[-0.05em] uppercase"
          >
            <RevealLines
              lines={[
                "Your pantry",
                "deserves",
                <span key="macros" className="text-ember">
                  better macros.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">
              Browse the range, dig into the macros, and tell us what you&apos;d actually eat.
              We&apos;re building FULL. in public.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/shop" size="xl" className="group w-full sm:w-auto">
                Explore the meals
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Button>
              <Button href="/survey" size="xl" variant="outline" className="w-full sm:w-auto">
                Take a survey
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Packaging line-up */}
        <div className="relative mt-16 flex items-end justify-center gap-2 sm:mt-20 sm:gap-5">
          {packs.map((product, index) => {
            const offset = index - Math.floor(packs.length / 2);
            return (
              <Reveal
                key={product.slug}
                delay={0.06 * index}
                className="w-[19%] max-w-[11rem] sm:w-[17%]"
              >
                <div
                  style={{
                    transform: `translateY(${Math.abs(offset) * 12}px) rotate(${offset * 3.5}deg)`,
                  }}
                  className="transition-transform duration-500 hover:!translate-y-0"
                >
                  <Pouch
                    line={product.line}
                    flavor={product.flavor}
                    protein={product.nutrition.protein}
                    prepMinutes={product.prepMinutes}
                    accent={product.accent}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="relative z-2 mt-14 border-y border-ink/10 bg-bone-100/60 py-4 sm:mt-16">
        <Marquee
          className="kicker edge-fade-x text-fg-muted"
          items={[...brand.phrases]}
          separator="/"
          speed="55s"
        />
      </div>
    </section>
  );
}
