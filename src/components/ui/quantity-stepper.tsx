"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 24,
  label,
  size = "md",
  allowRemove = false,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label: string;
  size?: "sm" | "md";
  allowRemove?: boolean;
  className?: string;
}) {
  const atMin = value <= min;
  const decrementIsRemove = allowRemove && value <= min;
  const dims = size === "sm" ? "h-9" : "h-11";
  const button =
    size === "sm"
      ? "size-9 disabled:opacity-30"
      : "size-11 disabled:opacity-30";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line-strong/70 bg-bone-100",
        dims,
        className,
      )}
    >
      <button
        type="button"
        className={cn("press grid place-items-center rounded-full text-fg-muted hover:text-ink", button)}
        onClick={() => onChange(decrementIsRemove ? 0 : Math.max(min, value - 1))}
        disabled={atMin && !allowRemove}
        aria-label={decrementIsRemove ? `Remove ${label}` : `Decrease ${label} quantity`}
      >
        {decrementIsRemove ? (
          <Trash2 className="size-4" aria-hidden />
        ) : (
          <Minus className="size-4" aria-hidden />
        )}
      </button>
      <span
        aria-live="polite"
        className="num relative grid min-w-8 place-items-center overflow-hidden text-sm font-semibold"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="sr-only">{label} quantity</span>
      </span>
      <button
        type="button"
        className={cn("press grid place-items-center rounded-full text-fg-muted hover:text-ink", button)}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label} quantity`}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
