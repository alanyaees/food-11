import { accentVars } from "@/lib/accents";
import { brand } from "@/lib/brand";
import type { FlavorAccent } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface PouchProps {
  line: string;
  flavor: string;
  protein: number;
  prepMinutes: number;
  accent: FlavorAccent;
  className?: string;
  /** Slight rotation, in degrees, for editorial arrangements. */
  tilt?: number;
  showBack?: boolean;
}

/**
 * The packaging system, drawn entirely in CSS.
 *
 * Every piece of typography on the pack is real text in the brand
 * fonts, so it is crisp at any size, localisable, accessible and never
 * garbled — and the site looks finished even with zero photography.
 * Scales with container queries: give it any width and it holds.
 */
export function Pouch({
  line,
  flavor,
  protein,
  prepMinutes,
  accent,
  className,
  tilt = 0,
  showBack = false,
}: PouchProps) {
  const lineParts = line.split(" + ");
  const hasStop = brand.name.endsWith(".");
  const stem = hasStop ? brand.name.slice(0, -1) : brand.name;
  const packWords = brand.packLine.split(" ");
  const packLead = packWords[0] ?? "no";
  const packPunch = packWords.slice(1).join(" ") || "B*llsh!t";
  const starAt = packPunch.indexOf("*");

  return (
    <div
      className={cn("@container relative w-full max-w-[22rem] select-none", className)}
      style={{ ...accentVars(accent), transform: tilt ? `rotate(${tilt}deg)` : undefined }}
      role="img"
      aria-label={`${brand.nameBare} ${line} ${flavor} pouch: ${protein} grams of protein, ready in ${prepMinutes} minutes. ${brand.packLine}`}
    >
      <div className="relative aspect-[3/4.05] w-full">
        {/* Contact shadow */}
        <div
          aria-hidden
          className="absolute -bottom-[3cqw] left-[6%] h-[8cqw] w-[88%] rounded-[50%] bg-ink/25 blur-[3cqw]"
        />

        {/* Pouch body */}
        <div className="grain absolute inset-0 overflow-hidden rounded-[4cqw] bg-[linear-gradient(158deg,#26262a_0%,#141416_38%,#0b0b0c_72%,#17171a_100%)] shadow-[0_2cqw_6cqw_-2cqw_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.09)]">
          {/* Vertical satin sheens */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-[7%] w-[16%] bg-[linear-gradient(90deg,rgba(255,255,255,0.11),rgba(255,255,255,0))]"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-[5%] w-[10%] bg-[linear-gradient(270deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]"
          />
          {/* Accent glow behind the numbers */}
          <div
            aria-hidden
            className="absolute -right-[18%] bottom-[8%] size-[62%] rounded-full opacity-45 blur-[8cqw]"
            style={{ backgroundColor: "var(--accent)" }}
          />

          {/* Top seal + zip */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-[9%]">
            <div className="h-full w-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.14)_0_0.7cqw,rgba(255,255,255,0)_0.7cqw_1.6cqw)] opacity-70" />
            <div className="absolute inset-x-[6%] bottom-0 h-[1.5px] rounded-full bg-white/25" />
            <div className="absolute top-[26%] left-1/2 h-[1.6cqw] w-[7cqw] -translate-x-1/2 rounded-full bg-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]" />
          </div>

          {/* Front panel */}
          <div className="relative flex h-full flex-col justify-between px-[8cqw] pt-[14cqw] pb-[8cqw] text-[var(--color-on-ink)]">
            <header className="flex items-start justify-between gap-[3cqw]">
              <span className="font-display text-[11cqw] leading-none font-extrabold tracking-[-0.06em] text-white uppercase">
                {stem}
                {hasStop ? <span style={{ color: "var(--accent)" }}>.</span> : null}
              </span>
              <span
                className="mt-[1cqw] font-mono text-[2.6cqw] leading-[1.5] tracking-[0.16em] text-white/45 uppercase"
                style={{ writingMode: "vertical-rl" }}
              >
                Single serve
              </span>
            </header>

            <div className="-mt-[2cqw]">
              <h3 className="font-display text-[13cqw] leading-[0.88] font-extrabold tracking-[-0.055em] text-white uppercase">
                {lineParts[0]}
                {lineParts[1] ? (
                  <>
                    <span className="block" style={{ color: "var(--accent)" }}>
                      +
                    </span>
                    <span className="block">{lineParts[1]}</span>
                  </>
                ) : null}
              </h3>
              <p className="mt-[3cqw] max-w-[70%] font-mono text-[3.1cqw] leading-[1.4] tracking-[0.2em] text-white/70 uppercase">
                {flavor}
              </p>
            </div>

            <footer>
              <div
                aria-hidden
                className="mb-[4cqw] h-[0.35cqw] w-[38%] rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <div className="flex items-end justify-between gap-[3cqw]">
                <div>
                  <p
                    className="font-display text-[15cqw] leading-[0.82] font-extrabold tracking-[-0.05em]"
                    style={{ color: "var(--accent)" }}
                  >
                    {protein}
                    <span className="text-[8cqw]">g</span>
                  </p>
                  <p className="mt-[1.5cqw] font-mono text-[2.9cqw] tracking-[0.28em] text-white/75 uppercase">
                    Protein
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[2.4cqw] tracking-[0.24em] text-white/45 uppercase">
                    Ready in
                  </p>
                  <p className="font-display text-[7cqw] leading-none font-extrabold tracking-[-0.03em] text-white">
                    {prepMinutes}
                    <span className="text-[3.4cqw] tracking-[0.1em]"> MIN</span>
                  </p>
                </div>
              </div>
              {showBack ? (
                <p className="mt-[4cqw] font-mono text-[2.2cqw] tracking-[0.18em] text-white/35 uppercase">
                  {brand.domain}
                </p>
              ) : null}
            </footer>
          </div>

          {/* Bottom gusset */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[7%] bg-[linear-gradient(0deg,rgba(0,0,0,0.55),rgba(0,0,0,0))]"
          />
        </div>

        {/* Screen-printed slogan, slapped on like a sticker */}
        <p
          aria-hidden
          className="absolute bottom-[12%] left-[36%] z-2 origin-center -rotate-[11deg] rounded-[1.8cqw] bg-bone px-[4.6cqw] py-[2.8cqw] shadow-[0_1.2cqw_0_rgba(0,0,0,0.42)]"
        >
          <span className="font-display block leading-none whitespace-nowrap">
            <span className="mr-[1.6cqw] text-[5.4cqw] font-semibold tracking-[-0.04em] text-ink/65 italic lowercase">
              {packLead}
            </span>
            <span className="text-[9.6cqw] font-black tracking-[-0.08em] text-ink">
              {starAt === -1 ? (
                packPunch
              ) : (
                <>
                  {packPunch.slice(0, starAt)}
                  <span className="inline-block -rotate-8 text-ember">*</span>
                  {packPunch.slice(starAt + 1)}
                </>
              )}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}

/** Compact pack chip used in cart lines, box builder rows and lists. */
export function PouchMini({
  line,
  flavor,
  protein,
  accent,
  className,
}: {
  line: string;
  flavor: string;
  protein: number;
  accent: FlavorAccent;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "@container relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-md bg-[linear-gradient(155deg,#232327,#0c0c0d)] p-[8cqw] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
        className,
      )}
      style={accentVars(accent)}
      role="img"
      aria-label={`${line} ${flavor}`}
    >
      <div
        aria-hidden
        className="absolute -right-[20%] -bottom-[20%] size-[70%] rounded-full opacity-40 blur-[6cqw]"
        style={{ backgroundColor: "var(--accent)" }}
      />
      <span className="font-display relative text-[15cqw] leading-none font-extrabold tracking-[-0.06em] text-white uppercase">
        {brand.name.replace(".", "")}
        <span style={{ color: "var(--accent)" }}>.</span>
      </span>
      <span
        className="font-display relative text-[20cqw] leading-none font-extrabold"
        style={{ color: "var(--accent)" }}
      >
        {protein}
        <span className="text-[10cqw]">g</span>
      </span>
    </div>
  );
}
