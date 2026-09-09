import { DisclaimerNote } from "@/components/ui/concept-badge";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { SectionCopy } from "@/lib/content";

/**
 * Numbered editorial section shell used by the story pages.
 *
 * One component, several rhythms: an optional media column that can sit
 * on either side, a light or full-bleed dark tone, and a slot for the
 * interactive pieces underneath. Keeps the pages short and the spacing
 * consistent without every section looking identical.
 */
export function ContentSection({
  copy,
  media,
  mediaSide = "right",
  tone = "light",
  children,
  className,
  headingWidth = "wide",
}: {
  copy: SectionCopy;
  media?: React.ReactNode;
  mediaSide?: "left" | "right";
  tone?: "light" | "dark";
  children?: React.ReactNode;
  className?: string;
  headingWidth?: "wide" | "narrow";
}) {
  const dark = tone === "dark";
  const headingId = `${copy.id}-heading`;

  return (
    <section
      id={copy.id}
      aria-labelledby={headingId}
      className={cn(
        "scroll-mt-[calc(var(--header-height)+3rem)] py-16 sm:py-24",
        dark ? "grain relative overflow-hidden bg-ink text-on-ink" : "border-t border-line",
        className,
      )}
    >
      <div className="container-full relative z-2">
        <div
          className={cn(
            "grid gap-10 lg:gap-16",
            media &&
              (mediaSide === "right"
                ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center"
                : "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-center"),
          )}
        >
          <div className={cn("min-w-0", media && mediaSide === "left" && "lg:order-2")}>
            <Reveal>
              <p className={cn("kicker", dark ? "text-on-ink-muted" : "text-fg-subtle")}>
                {copy.kicker}
              </p>
            </Reveal>
            <h2
              id={headingId}
              className={cn(
                "mt-5 text-[length:var(--text-display-sm)] leading-[0.92] tracking-[-0.04em] uppercase",
                headingWidth === "narrow" ? "max-w-xl" : "max-w-2xl",
              )}
            >
              <RevealLines lines={[copy.title]} />
            </h2>
            <Reveal delay={0.1}>
              <p
                className={cn(
                  "mt-6 max-w-2xl text-[1.0625rem] leading-relaxed sm:text-lg",
                  dark ? "text-on-ink-muted" : "text-fg-muted",
                )}
              >
                {copy.lead}
              </p>
            </Reveal>
            {copy.body?.length ? (
              <div className="mt-6 max-w-2xl space-y-4">
                {copy.body.map((paragraph, index) => (
                  <Reveal key={index} delay={0.05 * (index + 1)}>
                    <p
                      className={cn(
                        "text-[0.9375rem] leading-relaxed sm:text-base",
                        dark ? "text-on-ink-muted" : "text-fg-muted",
                      )}
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>

          {media ? (
            <Reveal
              direction={mediaSide === "right" ? "left" : "right"}
              delay={0.1}
              className={cn("min-w-0", mediaSide === "left" && "lg:order-1")}
            >
              {media}
            </Reveal>
          ) : null}
        </div>

        {children ? <div className="mt-12 sm:mt-16">{children}</div> : null}

        {copy.note ? (
          <Reveal delay={0.1}>
            <DisclaimerNote
              inverse={dark}
              className={cn("mt-10 border-t pt-5", dark ? "border-white/12" : "border-line")}
            >
              {copy.note}
            </DisclaimerNote>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
