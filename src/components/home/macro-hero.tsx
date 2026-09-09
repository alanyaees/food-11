import { BrandImage } from "@/components/brand/brand-image";
import { Button } from "@/components/ui/button";
import { ConceptBadge } from "@/components/ui/concept-badge";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";
import { getProductBySlug } from "@/lib/products";
import { macroSplit, proteinDensity } from "@/lib/utils";

export function MacroHero() {
  const product = getProductBySlug("mac-and-cheese-classic-cheddar")!;
  const { protein, calories, carbs, fat, fibre } = product.nutrition;
  const split = macroSplit(product.nutrition);

  return (
    <section
      className="grain relative overflow-hidden bg-ink text-on-ink"
      aria-labelledby="macro-hero-heading"
    >
      {/* Full-bleed food */}
      <BrandImage
        assetKey="macro-hero-bowl"
        accent="cheddar"
        sizes="100vw"
        className="absolute inset-0 h-full w-full"
        imageClassName="object-cover object-center opacity-55 sm:opacity-60"
        alt="Extreme close-up of a fork lifting cheesy macaroni with a cheese pull"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(14,14,12,0.96)_0%,rgba(14,14,12,0.82)_38%,rgba(14,14,12,0.35)_72%,rgba(14,14,12,0.6)_100%)]"
      />

      <div className="container-full relative z-2 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          <Reveal>
            <p className="kicker text-on-ink-muted">04 — The point</p>
          </Reveal>

          <h2 id="macro-hero-heading" className="mt-6">
            <Reveal>
              <span className="font-display block text-[length:var(--text-display-xl)] leading-[0.78] font-extrabold tracking-[-0.055em] text-cheddar uppercase">
                <Counter value={protein} suffix="g" className="font-display" />
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <span className="font-display block text-[length:var(--text-display-lg)] leading-[0.8] font-extrabold tracking-[-0.05em] uppercase">
                Protein.
              </span>
            </Reveal>
            <Reveal delay={0.16}>
              <span className="font-display mt-4 block text-[length:var(--text-display-xs)] leading-none font-extrabold tracking-[-0.03em] text-on-ink-muted uppercase">
                In mac &amp; cheese.
              </span>
            </Reveal>
          </h2>

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-on-ink/80">
              Not in a shake. Not in a bar that tastes like a filing cabinet. In a bowl of properly
              creamy cheddar macaroni that took three minutes and one kettle.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 sm:grid-cols-4">
              {[
                { label: "Calories", value: calories, suffix: " kcal" },
                { label: "Protein / 100 kcal", value: proteinDensity(protein, calories), suffix: " g", decimals: 1 },
                { label: "Fibre", value: fibre, suffix: " g" },
                { label: "Ready in", value: product.prepMinutes, suffix: " min" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="kicker text-on-ink-muted">{stat.label}</dt>
                  <dd className="font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                    <Counter
                      value={stat.value}
                      decimals={stat.decimals ?? 0}
                      suffix={stat.suffix}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* macro split bar */}
          <Reveal delay={0.28}>
            <div className="mt-10 max-w-xl">
              <div className="flex h-3 overflow-hidden rounded-full bg-white/12">
                <span
                  className="h-full bg-cheddar"
                  style={{ width: `${split.protein}%` }}
                  aria-hidden
                />
                <span
                  className="h-full bg-white/45"
                  style={{ width: `${split.carbs}%` }}
                  aria-hidden
                />
                <span
                  className="h-full bg-white/20"
                  style={{ width: `${split.fat}%` }}
                  aria-hidden
                />
              </div>
              <p className="num mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-on-ink-muted">
                <span>
                  <span className="text-cheddar">■</span> Protein {split.protein}% · {protein} g
                </span>
                <span>■ Carbs {split.carbs}% · {carbs} g</span>
                <span>■ Fat {split.fat}% · {fat} g</span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href={`/products/${product.slug}`} variant="inverse" size="lg">
                Shop {product.flavor}
              </Button>
              <Button href="/nutrition" variant="outlineInverse" size="lg">
                See the full label
              </Button>
              <ConceptBadge tone="inverse" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
