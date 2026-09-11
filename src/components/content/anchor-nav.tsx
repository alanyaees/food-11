"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "./use-scroll-spy";

export interface AnchorItem {
  id: string;
  label: string;
}

/**
 * Sticky on-page navigation that tracks the section being read.
 *
 * Horizontally scrollable on small screens (the active chip scrolls
 * itself into view), and the active indicator is a shared layout
 * animation so it slides between items instead of blinking.
 */
export function AnchorNav({
  items,
  className,
  label = "On this page",
}: {
  items: readonly AnchorItem[];
  className?: string;
  label?: string;
}) {
  const ids = items.map((item) => item.id);
  const active = useScrollSpy(ids);
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const current = list.querySelector<HTMLElement>(`[data-anchor="${active}"]`);
    if (!current) return;
    // Only nudge the horizontal scroller, never the page.
    const listBox = list.getBoundingClientRect();
    const itemBox = current.getBoundingClientRect();
    const delta = itemBox.left + itemBox.width / 2 - (listBox.left + listBox.width / 2);
    if (Math.abs(delta) > 8) {
      list.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
    }
  }, [active, reduced]);

  return (
    <nav
      aria-label={label}
      className={cn(
        "sticky top-(--header-height) z-30 border-b border-line bg-bone/85 backdrop-blur-xl backdrop-saturate-150",
        className,
      )}
    >
      <div className="container-full">
        <ul
          ref={listRef}
          className="no-scrollbar -mx-1 flex items-center gap-1.5 overflow-x-auto py-2.5"
        >
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  data-anchor={item.id}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative inline-flex h-11 items-center rounded-full px-4 text-[0.8125rem] font-semibold tracking-tight transition-colors",
                    isActive ? "text-on-ink" : "text-fg-muted hover:text-ink",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="anchor-nav-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34, mass: 0.7 }
                      }
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
