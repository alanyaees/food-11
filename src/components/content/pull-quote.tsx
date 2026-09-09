import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Oversized editorial pull quote. Uses a real <blockquote> so it is a
 * quotation to a screen reader as well as to the eye, and hangs the
 * opening mark in the margin the way print does.
 */
export function PullQuote({
  children,
  attribution,
  tone = "light",
  className,
  size = "md",
}: {
  children: React.ReactNode;
  attribution?: string;
  tone?: "light" | "dark";
  className?: string;
  size?: "md" | "lg";
}) {
  const dark = tone === "dark";

  return (
    <Reveal>
      <figure className={cn("relative", className)}>
        <span
          aria-hidden
          className={cn(
            "font-display pointer-events-none absolute -top-[0.35em] -left-[0.06em] text-[6em] leading-none font-extrabold select-none",
            dark ? "text-white/10" : "text-ink/[0.07]",
          )}
          style={{ fontSize: size === "lg" ? "5rem" : "4rem" }}
        >
          &ldquo;
        </span>
        <blockquote
          className={cn(
            "font-display relative tracking-[-0.035em] uppercase",
            size === "lg"
              ? "text-[length:var(--text-display-sm)] leading-[0.98]"
              : "text-[length:var(--text-display-xs)] leading-[1.02]",
          )}
        >
          {children}
        </blockquote>
        {attribution ? (
          <figcaption
            className={cn("kicker mt-6", dark ? "text-on-ink-muted" : "text-fg-subtle")}
          >
            {attribution}
          </figcaption>
        ) : null}
      </figure>
    </Reveal>
  );
}
