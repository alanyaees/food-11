"use client";

import { cn } from "@/lib/utils";
import { useScrollSpy } from "./use-scroll-spy";
import type { AnchorItem } from "./anchor-nav";

/**
 * The other on-page navigation shape: a sticky rail on large screens,
 * a sticky horizontal strip on small ones. Used for the FAQ categories
 * and the legal table of contents, both of which are long, dense and
 * read better beside a persistent index than under a top bar.
 */
export function SideNav({
  items,
  label,
  title,
  footer,
  className,
}: {
  items: readonly (AnchorItem & { hint?: string })[];
  label: string;
  title?: string;
  footer?: React.ReactNode;
  className?: string;
}) {
  const active = useScrollSpy(items.map((item) => item.id));

  return (
    <>
      {/* Small screens: sticky strip */}
      <nav
        aria-label={label}
        /* min-w-0 matters: as a grid item this strip's flex list would
           otherwise set the column's minimum width and push the prose
           beside it wider than the viewport. */
        className="sticky top-(--header-height) z-30 bleed-x min-w-0 border-b border-line bg-bone/90 backdrop-blur-xl lg:hidden"
      >
        <ul className="no-scrollbar -mx-1 flex items-center gap-1.5 overflow-x-auto py-2.5">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex h-11 items-center rounded-full border px-4 text-[0.8125rem] font-semibold tracking-tight transition-colors",
                    isActive
                      ? "border-ink bg-ink text-on-ink"
                      : "border-line-strong/70 text-fg-muted hover:border-ink hover:text-ink",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Large screens: rail */}
      <nav
        aria-label={label}
        className={cn(
          "sticky top-[calc(var(--header-height)+2.5rem)] hidden min-w-0 self-start lg:block",
          className,
        )}
      >
        {title ? <p className="kicker text-fg-subtle">{title}</p> : null}
        <ul className="mt-5 space-y-0.5 border-l border-line">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group relative -ml-px flex min-h-10 flex-col justify-center border-l-2 py-2 pl-4 transition-colors",
                    isActive
                      ? "border-ember text-ink"
                      : "border-transparent text-fg-muted hover:border-line-strong hover:text-ink",
                  )}
                >
                  <span className="text-[0.875rem] font-semibold tracking-tight">{item.label}</span>
                  {item.hint ? (
                    <span className="mt-0.5 text-[0.7rem] text-fg-subtle">{item.hint}</span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
        {footer ? <div className="mt-8 border-t border-line pt-6">{footer}</div> : null}
      </nav>
    </>
  );
}
