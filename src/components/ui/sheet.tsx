"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible slide-over / full-screen dialog: focus trap, Escape to
 * close, scroll lock, restores focus to the trigger on close.
 */
export function Sheet({
  open,
  onClose,
  side = "right",
  title,
  description,
  children,
  className,
  hideCloseButton = false,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left" | "bottom" | "full";
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
  labelledBy?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const timer = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panelRef.current)?.focus();
    }, 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null,
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  const geometry = {
    right: {
      className: "inset-y-0 right-0 h-full w-full max-w-[27rem] border-l",
      initial: { x: "100%" },
      animate: { x: 0 },
    },
    left: {
      className: "inset-y-0 left-0 h-full w-full max-w-[24rem] border-r",
      initial: { x: "-100%" },
      animate: { x: 0 },
    },
    bottom: {
      className: "inset-x-0 bottom-0 max-h-[88vh] w-full rounded-t-2xl border-t",
      initial: { y: "100%" },
      animate: { y: 0 },
    },
    full: {
      className: "inset-0 h-full w-full",
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
    },
  }[side];

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100]" role="presentation">
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={labelledBy ? undefined : title}
            aria-labelledby={labelledBy}
            aria-describedby={description ? `${title}-description` : undefined}
            tabIndex={-1}
            initial={geometry.initial}
            animate={geometry.animate}
            exit={geometry.initial}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute flex flex-col bg-bone shadow-[0_40px_120px_-40px_rgba(0,0,0,0.55)] outline-none",
              geometry.className,
              className,
            )}
          >
            {description ? (
              <p id={`${title}-description`} className="sr-only">
                {description}
              </p>
            ) : null}
            {hideCloseButton ? null : (
              <button
                type="button"
                onClick={onClose}
                aria-label={`Close ${title.toLowerCase()}`}
                className={cn(
                  "press absolute top-3.5 right-3.5 z-10 grid size-11 place-items-center rounded-full border text-fg-muted hover:text-ink",
                  side === "full"
                    ? "border-white/15 bg-white/10 text-on-ink hover:bg-white/15 hover:text-on-ink"
                    : "border-line-strong/60 bg-bone-100/80",
                )}
              >
                <X className="size-4.5" aria-hidden />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
