import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Closing call to action. Full-bleed ink, oversized type, two routes:
 * one meal or a whole box. Sits directly above the footer, so it shares
 * the footer's tone rather than fighting it.
 */
export function CtaBand({
  kicker,
  titleLines,
  lead,
  primary = { label: "Explore meals", href: "/shop" },
  secondary = { label: "Take a survey", href: "/survey" },
  note,
  className,
}: {
  kicker?: string;
  titleLines: readonly string[];
  lead?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  note?: string;
  className?: string;
}) {
  return (
    <section
      className={cn("grain relative overflow-hidden bg-ink py-20 text-on-ink sm:py-28", className)}
      aria-labelledby="cta-band-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[35%] left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,74,28,0.22),transparent_62%)] blur-3xl"
      />
      <div className="container-full relative z-2">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end">
          <div>
            {kicker ? (
              <Reveal>
                <p className="kicker text-on-ink-muted">{kicker}</p>
              </Reveal>
            ) : null}
            <h2
              id="cta-band-heading"
              className="mt-5 text-[length:var(--text-display-md)] leading-[0.88] tracking-[-0.045em] uppercase"
            >
              <RevealLines
                lines={titleLines.map((line, index) =>
                  index === titleLines.length - 1 ? (
                    <span key={line} className="text-ember">
                      {line}
                    </span>
                  ) : (
                    line
                  ),
                )}
              />
            </h2>
          </div>

          <div className="lg:pb-2">
            {lead ? (
              <Reveal delay={0.1}>
                <p className="max-w-lg text-[1.0625rem] leading-relaxed text-on-ink-muted">
                  {lead}
                </p>
              </Reveal>
            ) : null}
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href={primary.href} variant="inverse" size="lg" className="group">
                  {primary.label}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Button>
                <Button href={secondary.href} variant="outlineInverse" size="lg">
                  {secondary.label}
                </Button>
              </div>
            </Reveal>
            {note ? (
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-lg text-[0.72rem] leading-relaxed text-on-ink-muted">
                  {note}
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
