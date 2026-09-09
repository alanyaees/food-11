"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { BrandImage } from "@/components/brand/brand-image";
import { Pouch } from "@/components/brand/pouch";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { useCart } from "@/components/providers/cart-provider";
import { brand } from "@/lib/brand";
import {
  getProducts,
  tenPackContents,
  tenPackDeal,
  tenPackMacros,
} from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";

export function ComboDeal({ compact = false }: { compact?: boolean }) {
  const products = getProducts();
  const contents = tenPackContents(products);
  const macros = tenPackMacros(products);
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const addCombo = () => {
    addItem({
      slug: tenPackDeal.slug,
      name: tenPackDeal.name,
      line: tenPackDeal.line,
      flavor: tenPackDeal.flavor,
      accent: "cheddar",
      unitPriceCents: tenPackDeal.priceCents,
      mode: "one-time",
      protein: macros.protein,
      calories: macros.calories,
      kind: "box",
      meta: { boxContents: contents, boxSize: tenPackDeal.size },
    });
    setAdded(true);
    openCart();
  };

  return (
    <section
      id="ten-pack"
      aria-labelledby="ten-pack-heading"
      className={cn(
        "relative overflow-hidden bg-ink text-on-ink",
        compact ? "py-12 sm:py-16" : "py-16 sm:py-20",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 right-[-10%] size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,74,28,0.34),transparent_62%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-40%] left-[-18%] size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(242,166,59,0.18),transparent_64%)] blur-2xl"
      />

      <div className="container-full relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <div>
          <Reveal>
            <p className="kicker text-ember">The deal · {tenPackDeal.discountPercent}% off</p>
          </Reveal>
          <h2
            id="ten-pack-heading"
            className="mt-4 text-[length:var(--text-display-sm)] leading-[0.88] tracking-[-0.045em] uppercase"
          >
            {tenPackDeal.size} packs.
            <br />
            <span className="text-ember">{formatPrice(tenPackDeal.priceCents)}.</span>
          </h2>
          <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-on-ink-muted">
            {tenPackDeal.note} {tenPackDeal.tagline}
          </p>

          <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-2">
            <p className="num font-display text-[clamp(3.4rem,8vw,5.5rem)] leading-none font-extrabold tracking-[-0.06em]">
              {formatPrice(tenPackDeal.priceCents)}
            </p>
            <div className="pb-2">
              <p className="kicker text-ember">{tenPackDeal.discountPercent}% off</p>
              <p className="num mt-1 text-lg text-on-ink-muted line-through">
                {formatPrice(tenPackDeal.compareAtCents)}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm text-on-ink-muted">
            {formatPrice(Math.round(tenPackDeal.priceCents / tenPackDeal.size))} a pouch · {macros.protein} g
            protein across the box · concept values
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="xl"
              variant="accent"
              className="group w-full sm:w-auto"
              onClick={addCombo}
            >
              {added ? (
                <>
                  <Check className="size-4" strokeWidth={3} aria-hidden /> 10-Pack added
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" aria-hidden /> Add the 10-Pack
                </>
              )}
            </Button>
            <Button href="/build-a-box?size=10" variant="outlineInverse" size="xl" className="w-full sm:w-auto">
              Mix your own
            </Button>
          </div>

          <ul className="mt-6 grid gap-1.5 text-[0.78rem] text-on-ink-muted sm:grid-cols-2">
            {contents.map((entry) => {
              const product = products.find((item) => item.slug === entry.slug);
              return (
                <li key={entry.slug} className="num">
                  {entry.quantity}× {product?.flavor ?? entry.name}
                </li>
              );
            })}
          </ul>
        </div>

        <ComboPhotos compact={compact} />
      </div>
    </section>
  );
}

function ComboPhotos({ compact }: { compact: boolean }) {
  const products = getProducts();
  const shots = products.slice(0, 4);
  const pack = products[0];

  return (
    <Reveal delay={0.08} className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="relative mx-auto aspect-[5/4] w-full sm:aspect-square">
        {shots[1] ? (
          <div className="absolute top-[2%] left-[0%] w-[46%] -rotate-8 overflow-hidden rounded-2xl shadow-[0_24px_50px_-24px_rgba(0,0,0,0.75)]">
            <BrandImage
              assetKey={shots[1].images.closeup}
              accent={shots[1].accent}
              alt={shots[1].flavor}
              sizes="(min-width: 1024px) 18vw, 45vw"
              className="aspect-square"
            />
          </div>
        ) : null}

        {shots[2] ? (
          <div className="absolute top-[4%] right-[2%] w-[42%] rotate-7 overflow-hidden rounded-2xl shadow-[0_24px_50px_-24px_rgba(0,0,0,0.75)]">
            <BrandImage
              assetKey={shots[2].images.closeup}
              accent={shots[2].accent}
              alt={shots[2].flavor}
              sizes="(min-width: 1024px) 16vw, 40vw"
              className="aspect-square"
            />
          </div>
        ) : null}

        {shots[0] ? (
          <div className="absolute top-[22%] left-[18%] z-2 w-[62%] -rotate-2 overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]">
            <BrandImage
              assetKey={shots[0].images.closeup}
              accent={shots[0].accent}
              alt={shots[0].flavor}
              priority={!compact}
              sizes="(min-width: 1024px) 26vw, 70vw"
              className="aspect-square"
            />
          </div>
        ) : null}

        {shots[3] ? (
          <div className="absolute right-[0%] bottom-[8%] z-3 w-[40%] rotate-6 overflow-hidden rounded-2xl shadow-[0_24px_50px_-24px_rgba(0,0,0,0.75)]">
            <BrandImage
              assetKey={shots[3].images.closeup}
              accent={shots[3].accent}
              alt={shots[3].flavor}
              sizes="(min-width: 1024px) 16vw, 40vw"
              className="aspect-square"
            />
          </div>
        ) : null}

        {pack ? (
          <div className="absolute bottom-[0%] left-[0%] z-4 w-[38%] max-w-[10.5rem] -rotate-12 sm:w-[34%] lg:max-w-[12rem]">
            <Pouch
              line={pack.line}
              flavor={pack.flavor}
              protein={pack.nutrition.protein}
              prepMinutes={pack.prepMinutes}
              accent={pack.accent}
            />
          </div>
        ) : null}

        <div className="absolute right-[6%] bottom-[2%] z-5 -rotate-8 rounded-md bg-bone px-3 py-2 text-ink shadow-[0_8px_0_rgba(0,0,0,0.35)]">
          <p className="font-display leading-none">
            <span className="mr-1 text-sm font-semibold italic">{brand.packLine.split(" ")[0]}</span>
            <span className="text-xl font-black tracking-[-0.06em]">
              {brand.packLine.slice(brand.packLine.indexOf(" ") + 1)}
            </span>
          </p>
        </div>
      </div>
    </Reveal>
  );
}
