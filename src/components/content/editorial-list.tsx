import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Numbered editorial list with oversized numerals in the margin.
 * Used for the principles and the "what we refuse to do" list.
 */
export function NumberedList({
  items,
  tone = "light",
  columns = 1,
  className,
}: {
  items: readonly { title: string; body: string }[];
  tone?: "light" | "dark";
  columns?: 1 | 2;
  className?: string;
}) {
  const dark = tone === "dark";
  const rule = dark ? "border-white/12" : "border-line";

  return (
    <ol className={cn("grid", columns === 2 && "sm:grid-cols-2 sm:gap-x-12", className)}>
      {items.map((item, index) => (
        <Reveal
          as="li"
          key={item.title}
          delay={0.05 * index}
          className={cn("flex gap-5 border-t py-6 sm:gap-8 sm:py-7", rule)}
        >
          <span
            className={cn(
              "num font-display shrink-0 text-xl leading-none font-extrabold tracking-tight sm:text-2xl",
              dark ? "text-white/25" : "text-fg-subtle/60",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3
              className={cn(
                "font-display text-[1.0625rem] font-extrabold tracking-[-0.03em] uppercase sm:text-xl",
                dark ? "text-on-ink" : "text-ink",
              )}
            >
              {item.title}
            </h3>
            <p
              className={cn(
                "mt-2 max-w-prose text-[0.9375rem] leading-relaxed",
                dark ? "text-on-ink-muted" : "text-fg-muted",
              )}
            >
              {item.body}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/**
 * Status report rows: a label, a plain-language state, and the honest
 * detail. Every state chip is deliberately unglamorous.
 */
export function StatusList({
  items,
  className,
}: {
  items: readonly { label: string; state: string; body: string }[];
  className?: string;
}) {
  return (
    <dl className={cn("border-t border-line", className)}>
      {items.map((item, index) => (
        <Reveal key={item.label} delay={0.04 * index}>
          <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-8 sm:py-7">
            <div>
              <dt className="font-display text-[1.0625rem] font-extrabold tracking-[-0.03em] text-ink uppercase">
                {item.label}
              </dt>
              <span className="kicker mt-2 inline-flex items-center gap-1.5 rounded-full border border-line-strong/70 bg-bone-100 px-2.5 py-1.5 text-fg-muted">
                <span aria-hidden className="size-1.5 rounded-full bg-ember" />
                {item.state}
              </span>
            </div>
            <dd className="max-w-prose text-[0.9375rem] leading-relaxed text-fg-muted">
              {item.body}
            </dd>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}
