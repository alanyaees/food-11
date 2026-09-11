"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { BrandImage } from "@/components/brand/brand-image";
import { Pouch, pouchPropsFromProduct } from "@/components/brand/pouch";
import { Button } from "@/components/ui/button";
import { RevealLines } from "@/components/ui/reveal";
import { brand } from "@/lib/brand";
import { getProductBySlug } from "@/lib/products";
import { proteinDensity } from "@/lib/utils";

const hero = getProductBySlug("mac-and-cheese-classic-cheddar")!;

const macroChips = [
  { label: "Protein", value: `${hero.nutrition.protein}g`, top: "8%", left: "-5%" },
  { label: "Energy", value: `~${hero.nutrition.calories} kcal`, top: "-6%", left: "58%" },
  { label: "Fibre", value: `${hero.nutrition.fibre}g`, top: "42%", left: "-8%" },
  { label: "Ready in", value: `${hero.prepMinutes} min`, top: "76%", left: "-2%" },
];

export function Hero() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 60, damping: 18, mass: 0.6 });
  const springY = useSpring(pointerY, { stiffness: 60, damping: 18, mass: 0.6 });

  const pouchX = useTransform(springX, [-1, 1], [-14, 14]);
  const pouchY = useTransform(springY, [-1, 1], [-10, 10]);
  const pouchRotate = useTransform(springX, [-1, 1], [-4.5, 4.5]);
  const photoX = useTransform(springX, [-1, 1], [8, -8]);
  const photoY = useTransform(springY, [-1, 1], [6, -6]);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  }

  return (
    <section
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative overflow-hidden bg-[radial-gradient(130%_100%_at_78%_0%,#fbf8f1_0%,#f4f1ea_42%,#eae3d4_100%)] pt-8 pb-20 sm:pt-14 lg:pt-16 lg:pb-24"
      aria-labelledby="hero-heading"
    >
      {/* soft accent bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-18%] right-[-10%] size-[46rem] rounded-full bg-[radial-gradient(circle,rgba(242,166,59,0.28),transparent_62%)] blur-2xl"
      />

      <div className="container-full relative grid items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-10">
        <div className="relative z-2 mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
          <h1
            id="hero-heading"
            className="text-[clamp(2.4rem,8vw,5.25rem)] leading-[0.87] tracking-[-0.045em] uppercase"
          >
            <RevealLines
              lines={[
                "Comfort food.",
                <span key="numbers" className="inline-flex items-baseline justify-center lg:justify-start">
                  Better
                  <span className="ml-[0.16em] text-ember">numbers.</span>
                </span>,
              ]}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted sm:text-lg lg:mx-0"
          >
            {brand.shortPitch}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
          >
            <Button href="/shop" size="lg" className="group w-full sm:w-auto">
              Explore meals
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Button>
            <Button href="/how-it-works" size="lg" variant="outline" className="w-full sm:w-auto">
              How it works
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-2.5 border-t border-line pt-6 sm:mt-12 sm:gap-4 lg:mx-0"
          >
            {[
              { label: "Protein", value: `36–45 g` },
              {
                label: "Per 100 kcal",
                value: `up to ${proteinDensity(hero.nutrition.protein, hero.nutrition.calories)} g`,
              },
              { label: "Ready in", value: "3 min" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="kicker text-[0.6rem] text-fg-muted sm:text-[0.6875rem]">{stat.label}</dt>
                <dd className="num font-display mt-1.5 text-[1.05rem] font-extrabold tracking-tight text-ink sm:text-2xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Product stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-1"
        >
          <div className="relative mx-auto max-w-xl lg:max-w-none">
            <motion.div style={{ x: photoX, y: photoY }} className="relative">
              <BrandImage
                assetKey="hero-mac-cheddar"
                accent="cheddar"
                priority
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="aspect-4/3 w-full rounded-2xl shadow-[0_50px_100px_-50px_rgba(20,15,5,0.55)] sm:aspect-3/2"
                imageClassName="object-cover object-[22%_center]"
                alt="A bowl of creamy high-protein macaroni and cheese with steam rising in a studio still life"
              />
              {/* steam */}
              <div
                aria-hidden
                className="pointer-events-none absolute top-[6%] left-[42%] h-[26%] w-[16%] animate-steam rounded-full bg-white/45 blur-xl"
              />
            </motion.div>

            {/* Packaging, floating over the photograph */}
            <motion.div
              style={{ x: pouchX, y: pouchY, rotate: pouchRotate }}
              className="absolute right-1 -bottom-8 w-[34%] max-w-[10.5rem] sm:-right-4 sm:-bottom-10 sm:w-[32%] lg:-right-6 lg:-bottom-14 lg:w-[38%] lg:max-w-[15.5rem]"
            >
              <Pouch
                {...pouchPropsFromProduct(hero, {
                  priority: true,
                  sizes: "(min-width: 1024px) 16vw, 34vw",
                })}
              />
            </motion.div>

            {/* Floating macro data — fine pointer only; chips clutter small touch UIs */}
            <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
              {macroChips.map((chip, index) => (
                <motion.div
                  key={chip.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.12 }}
                  style={{ top: chip.top, left: chip.left }}
                  className="absolute"
                >
                  <motion.div
                    animate={reduced ? undefined : { y: [0, -7, 0] }}
                    transition={{
                      duration: 5 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.4,
                    }}
                    className="glass rounded-lg px-3 py-2 shadow-[0_12px_30px_-16px_rgba(0,0,0,0.35)]"
                  >
                    <p className="kicker text-[0.6rem] text-fg-subtle">{chip.label}</p>
                    <p className="num text-sm font-bold tracking-tight">{chip.value}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="mt-12 text-center text-[0.7rem] text-fg-subtle sm:mt-12 lg:text-right">
            Pictured: {hero.line} — {hero.flavor}.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
