import { Reveal, RevealLines } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Editorial page opener. Asymmetric by default: the headline sits in a
 * wide left column and supporting material hangs off the baseline grid
 * to the right, so no story page looks like a centred landing page.
 */
export function PageHero({
  kicker,
  titleLines,
  titleId = "page-title",
  lead,
  aside,
  stats,
  className,
  accentLast = true,
  size = "lg",
}: {
  kicker: string;
  titleLines: readonly (string | React.ReactNode)[];
  titleId?: string;
  lead?: string;
  aside?: React.ReactNode;
  stats?: readonly { label: string; value: string }[];
  className?: string;
  /** Typesets the final line in the brand accent. */
  accentLast?: boolean;
  /** Long headlines need a smaller step so they still hold two or three lines. */
  size?: "sm" | "md" | "lg";
}) {
  const lines = titleLines.map((line, index) =>
    accentLast && index === titleLines.length - 1 && typeof line === "string" ? (
      <span key={index} className="text-ember">
        {line}
      </span>
    ) : (
      line
    ),
  );

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-line pt-12 pb-14 sm:pt-16 sm:pb-20",
        className,
      )}
      aria-labelledby={titleId}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[30%] -right-[12%] size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,74,28,0.12),transparent_65%)] blur-2xl"
      />
      <div className="container-full relative">
        <Reveal>
          <p className="kicker text-fg-subtle">{kicker}</p>
        </Reveal>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
          <h1
            id={titleId}
            className={cn(
              "leading-[0.88] tracking-[-0.045em] uppercase",
              size === "lg" && "text-[length:var(--text-display-lg)] leading-[0.86]",
              size === "md" && "text-[length:var(--text-display-md)]",
              size === "sm" && "text-[length:var(--text-display-sm)] leading-[0.94]",
              "min-w-0",
            )}
          >
            <RevealLines lines={lines} />
          </h1>

          <div className="min-w-0 lg:pb-3">
            {lead ? (
              <Reveal delay={0.15}>
                <p className="max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted sm:text-lg">
                  {lead}
                </p>
              </Reveal>
            ) : null}
            {aside ? <Reveal delay={0.2}>{aside}</Reveal> : null}
            {stats ? (
              <Reveal delay={0.25}>
                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-6">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="kicker text-fg-subtle">{stat.label}</dt>
                      <dd className="num font-display mt-1.5 text-2xl font-extrabold tracking-tight">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
