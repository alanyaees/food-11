"use client";

import { motion } from "motion/react";
import { useMacroMode } from "@/components/providers/macro-mode-provider";
import { cn } from "@/lib/utils";

const options = [
  { id: "normal", label: "Normal" },
  { id: "nerd", label: "Macro nerd" },
] as const;

/**
 * Site-wide detail switch. Normal shows the two numbers that matter;
 * Macro Nerd unlocks density, splits, serving weight and micros.
 * The preference is stored locally and respected on every page.
 */
export function MacroModeToggle({
  inverse = false,
  className,
  compact = false,
}: {
  inverse?: boolean;
  className?: string;
  compact?: boolean;
}) {
  const { mode, setMode } = useMacroMode();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {!compact ? (
        <span className={cn("kicker", inverse ? "text-on-ink-muted" : "text-fg-subtle")}>
          Detail
        </span>
      ) : null}
      <div
        role="radiogroup"
        aria-label="Nutrition detail level"
        className={cn(
          "relative inline-flex rounded-full p-1",
          inverse ? "bg-white/10" : "bg-ink/[0.06]",
        )}
      >
        {options.map((option) => {
          const active = mode === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMode(option.id)}
              className={cn(
                "press relative rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-tight transition-colors",
                active
                  ? inverse
                    ? "text-ink"
                    : "text-on-ink"
                  : inverse
                    ? "text-on-ink-muted hover:text-on-ink"
                    : "text-fg-muted hover:text-ink",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`macro-mode-${inverse ? "inverse" : "light"}`}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    inverse ? "bg-bone" : "bg-ink",
                  )}
                />
              ) : null}
              <span className="relative">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
