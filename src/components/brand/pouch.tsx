import Image from "next/image";
import { getAsset } from "@/lib/assets";
import { brand } from "@/lib/brand";
import { accentVars } from "@/lib/accents";
import type { FlavorAccent, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface PouchProps {
  line: string;
  flavor: string;
  protein: number;
  carbs?: number;
  fat?: number;
  calories?: number;
  prepMinutes: number;
  accent: FlavorAccent;
  className?: string;
  /** Slight rotation, in degrees, for editorial arrangements. */
  tilt?: number;
  /** @deprecated Kept so existing call sites type-check; the current pack has no back panel. */
  showBack?: boolean;
  /** Manifest key for a photographed pack. Falls back to CSS artwork when missing. */
  photoKey?: string;
  sizes?: string;
  priority?: boolean;
}

export function pouchPropsFromProduct(product: Product, extra?: Partial<PouchProps>): PouchProps {
  return {
    line: product.line,
    flavor: product.flavor,
    protein: product.nutrition.protein,
    carbs: product.nutrition.carbs,
    fat: product.nutrition.fat,
    calories: product.nutrition.calories,
    prepMinutes: product.prepMinutes,
    accent: product.accent,
    photoKey: product.images.pouch,
    ...extra,
  };
}

/**
 * The packaging system.
 *
 * Prefers a photographed pouch when the asset exists, otherwise draws
 * the current pack layout in CSS so lettering stays crisp and every
 * flavour still has a finished pack on the page.
 */
export function Pouch({
  line,
  flavor,
  protein,
  carbs,
  fat,
  calories,
  prepMinutes,
  accent,
  className,
  tilt = 0,
  photoKey,
  sizes = "(min-width: 1024px) 18rem, 40vw",
  priority = false,
}: PouchProps) {
  const photo = getAsset(photoKey);
  const label = `${brand.nameBare} ${line} ${flavor} pouch: ${protein} grams of protein, ready in ${prepMinutes} minutes. ${brand.packLine}`;

  if (photo) {
    return (
      <div
        className={cn("relative w-full select-none", className)}
        style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
          <Image
            src={photo.path}
            alt={photo.alt || label}
            fill
            sizes={sizes}
            priority={priority}
            quality={90}
            className="object-contain object-bottom drop-shadow-[0_18px_28px_rgba(0,0,0,0.38)]"
          />
        </div>
      </div>
    );
  }

  return <PouchArtwork {...{ line, flavor, protein, carbs, fat, calories, prepMinutes, accent, className, tilt, label }} />;
}

function packTitleLines(line: string): string[] {
  if (line.includes(" + ")) {
    const [left, right] = line.split(" + ");
    return right ? [left, "+", right] : [line];
  }
  const words = line.trim().split(/\s+/);
  return words.length > 1 ? words : [line];
}

function packLineParts(copy: string) {
  const trimmed = copy.replace(/\.$/, "");
  const words = trimmed.split(" ");
  const punch = words.pop() ?? "";
  return { lead: words.join(" "), punch, period: copy.endsWith(".") };
}

function PouchArtwork({
  line,
  flavor,
  protein,
  carbs,
  fat,
  calories,
  prepMinutes,
  accent,
  className,
  tilt,
  label,
}: Omit<PouchProps, "photoKey" | "sizes" | "priority" | "showBack"> & { label: string }) {
  const hasStop = brand.name.endsWith(".");
  const stem = hasStop ? brand.name.slice(0, -1) : brand.name;
  const title = packTitleLines(line);
  const tag = packLineParts(brand.packLine);
  const macros = [
    { value: protein, unit: "g", label: "Protein" },
    carbs != null ? { value: carbs, unit: "g", label: "Carbs" } : null,
    fat != null ? { value: fat, unit: "g", label: "Fat" } : null,
    calories != null ? { value: calories, unit: "kcal", label: "Calories" } : null,
  ].filter((row): row is { value: number; unit: string; label: string } => row !== null);

  return (
    <div
      className={cn("@container relative w-full max-w-[22rem] select-none", className)}
      style={{ ...accentVars(accent), transform: tilt ? `rotate(${tilt}deg)` : undefined }}
      role="img"
      aria-label={label}
    >
      <div className="relative aspect-[3/4.05] w-full">
        <div
          aria-hidden
          className="absolute -bottom-[3cqw] left-[8%] h-[7cqw] w-[84%] rounded-[50%] bg-ink/30 blur-[3cqw]"
        />

        <div className="grain absolute inset-0 overflow-hidden rounded-[3.2cqw] bg-[linear-gradient(168deg,#1a1a1d_0%,#0c0c0e_42%,#080809_78%,#121214_100%)] shadow-[0_2cqw_6cqw_-2cqw_rgba(0,0,0,0.62),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          <div
            aria-hidden
            className="absolute inset-y-0 left-[5%] w-[14%] bg-[linear-gradient(90deg,rgba(255,255,255,0.09),rgba(255,255,255,0))]"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-[4%] w-[9%] bg-[linear-gradient(270deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]"
          />

          <div aria-hidden className="absolute inset-x-0 top-0 h-[7%]">
            <div className="h-full w-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0_0.6cqw,rgba(255,255,255,0)_0.6cqw_1.5cqw)] opacity-60" />
            <div className="absolute inset-x-[7%] bottom-0 h-px rounded-full bg-white/20" />
          </div>

          <div className="relative flex h-full flex-col px-[7.5cqw] pt-[12cqw] pb-[6cqw] text-white">
            <header>
              <p className="font-display text-[11cqw] leading-none font-extrabold tracking-[-0.07em] uppercase">
                {stem}
                {hasStop ? <span style={{ color: brand.packAccent }}>.</span> : null}
              </p>
              <p className="mt-[1.6cqw] font-sans text-[2.15cqw] leading-none font-semibold tracking-[0.18em] uppercase">
                <span className="text-white/80">{tag.lead} </span>
                <span style={{ color: brand.packAccent }}>{tag.punch}</span>
                {tag.period ? <span style={{ color: brand.packAccent }}>.</span> : null}
              </p>
            </header>

            <div className="mt-[7cqw] flex min-h-0 flex-1 items-start justify-between gap-[3cqw]">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[13.5cqw] leading-[0.82] font-extrabold tracking-[-0.055em] text-white uppercase">
                  {title.map((part) => (
                    <span key={part} className="block">
                      {part}
                    </span>
                  ))}
                </h3>
                <p
                  className="mt-[3cqw] font-sans text-[3.4cqw] leading-none font-extrabold tracking-[0.16em] uppercase"
                  style={{ color: brand.packAccent }}
                >
                  {flavor}
                </p>
                <p className="mt-[3.5cqw] max-w-[22ch] font-sans text-[2.5cqw] leading-[1.35] font-semibold tracking-[0.14em] text-white/88 uppercase">
                  {brand.packSubline.split(". ").map((chunk, index, all) => (
                    <span key={chunk} className="block">
                      {chunk}
                      {index < all.length - 1 ? "." : ""}
                    </span>
                  ))}
                </p>
              </div>

              <div className="flex w-[28%] shrink-0 flex-col items-end pt-[1cqw] text-right">
                {macros.map((row) => (
                  <div key={row.label} className="mb-[3.2cqw] w-full">
                    <p className="font-display text-[6.2cqw] leading-none font-extrabold tracking-[-0.04em]">
                      {row.value}
                      <span className="ml-[0.35em] text-[2.4cqw] font-semibold tracking-[0.04em]">
                        {row.unit}
                      </span>
                    </p>
                    <p className="mt-[0.8cqw] font-sans text-[1.85cqw] font-semibold tracking-[0.2em] text-white/70 uppercase">
                      {row.label}
                    </p>
                    {row.label !== "Calories" ? (
                      <span
                        aria-hidden
                        className="mt-[1.4cqw] block h-[0.28cqw] w-full"
                        style={{ backgroundColor: brand.packAccent }}
                      />
                    ) : null}
                  </div>
                ))}

                <div
                  className="mt-[1cqw] grid size-[16cqw] place-items-center rounded-full border-[0.55cqw] text-center"
                  style={{ borderColor: brand.packAccent }}
                >
                  <p className="font-sans text-[1.7cqw] leading-[1.15] font-semibold tracking-[0.12em] uppercase">
                    Ready in
                    <span className="font-display mt-[0.2cqw] block text-[3.4cqw] font-extrabold tracking-[-0.04em]">
                      {prepMinutes} min
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <footer className="mt-auto hidden grid-cols-4 gap-[1.5cqw] border-t border-white/15 pt-[3.5cqw] @[9rem]:grid">
              {brand.packFeatures.map((feature) => (
                <div key={feature.id} className="flex flex-col items-center gap-[1.2cqw] text-center">
                  <PackIcon id={feature.id} className="size-[4.2cqw] text-white" />
                  <span className="font-sans text-[1.55cqw] leading-[1.2] font-semibold tracking-[0.08em] text-white/80 uppercase">
                    {feature.label}
                  </span>
                </div>
              ))}
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackIcon({ id, className }: { id: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  if (id === "ingredients") {
    return (
      <svg {...common}>
        <path d="M5 20c2-8 4.2-14 7-16 2.8 2 5 8 7 16" />
        <path d="M8 14c1.4-1.1 2.6-1.1 4 0 1.4-1.1 2.6-1.1 4 0" />
      </svg>
    );
  }
  if (id === "taste") {
    return (
      <svg {...common}>
        <path d="M4 19h16L12 4 4 19Z" />
        <path d="M8.2 14.2h.1" />
        <path d="M12.5 11.4h.1" />
        <path d="M11 16.6h.1" />
      </svg>
    );
  }
  if (id === "prep") {
    return (
      <svg {...common}>
        <path d="M13 3 5.5 13.5h6L11 21 18.5 10.5h-6L13 3Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 10h16l-1.2 8.2A2 2 0 0 1 16.82 20H7.18a2 2 0 0 1-1.98-1.8L4 10Z" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      <path d="M12 13.5v3" />
    </svg>
  );
}

/** Compact pack chip used in cart lines, box builder rows and lists. */
export function PouchMini({
  line,
  flavor,
  protein,
  accent,
  className,
  photoKey,
}: {
  line: string;
  flavor: string;
  protein: number;
  accent: FlavorAccent;
  className?: string;
  photoKey?: string;
}) {
  const photo = getAsset(photoKey);
  if (photo) {
    return (
      <div
        className={cn("relative aspect-[3/4] w-full overflow-hidden rounded-md bg-ink", className)}
        role="img"
        aria-label={`${line} ${flavor}`}
      >
        <Image
          src={photo.path}
          alt=""
          fill
          sizes="96px"
          quality={82}
          className="object-cover object-[center_42%]"
        />
      </div>
    );
  }

  const hasStop = brand.name.endsWith(".");
  const stem = hasStop ? brand.name.slice(0, -1) : brand.name;

  return (
    <div
      className={cn(
        "@container relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-md bg-[linear-gradient(168deg,#1a1a1d,#0a0a0b)] p-[8cqw] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
        className,
      )}
      style={accentVars(accent)}
      role="img"
      aria-label={`${line} ${flavor}`}
    >
      <span className="font-display relative text-[15cqw] leading-none font-extrabold tracking-[-0.07em] text-white uppercase">
        {stem}
        {hasStop ? <span style={{ color: brand.packAccent }}>.</span> : null}
      </span>
      <span
        className="font-display relative text-[20cqw] leading-none font-extrabold"
        style={{ color: brand.packAccent }}
      >
        {protein}
        <span className="text-[10cqw]">g</span>
      </span>
    </div>
  );
}
