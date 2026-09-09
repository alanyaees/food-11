import { cn } from "@/lib/utils";

/**
 * CSS-only infinite marquee (no JS, no layout thrash). Duplicated
 * content is aria-hidden so screen readers read the strip once.
 */
export function Marquee({
  items,
  className,
  separator = "✳",
  speed = "42s",
}: {
  items: string[];
  className?: string;
  separator?: string;
  speed?: string;
}) {
  const strip = (
    <ul className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-center">
          <span className="whitespace-nowrap">{item}</span>
          <span aria-hidden className="mx-6 opacity-40 sm:mx-9">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <div
        className="flex min-w-max animate-marquee items-center will-change-transform group-hover:[animation-play-state:paused]"
        style={{ animationDuration: speed }}
      >
        {strip}
        <div aria-hidden>{strip}</div>
      </div>
    </div>
  );
}
