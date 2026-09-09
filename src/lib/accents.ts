import type { CSSProperties } from "react";
import type { FlavorAccent } from "./types";

/**
 * Flavour accents. Components set `style={accentVars(accent)}` on a
 * wrapper and children reference `var(--accent)` / `var(--accent-ink)`,
 * which keeps Tailwind's static-class analysis happy while still
 * allowing per-flavour colour.
 */
export const accents: Record<
  FlavorAccent,
  { label: string; base: string; ink: string; soft: string; glow: string }
> = {
  cheddar: {
    label: "Cheddar",
    base: "#f2a63b",
    ink: "#5e3707",
    soft: "#fdf0dc",
    glow: "rgba(242,166,59,0.45)",
  },
  jalapeno: {
    label: "Jalapeño",
    base: "#7ce04f",
    ink: "#20460f",
    soft: "#edfbe4",
    glow: "rgba(124,224,79,0.4)",
  },
  tomato: {
    label: "Tomato",
    base: "#e0432b",
    ink: "#57120a",
    soft: "#fde5e1",
    glow: "rgba(224,67,43,0.38)",
  },
  truffle: {
    label: "Truffle",
    base: "#8f7c5f",
    ink: "#332a1d",
    soft: "#f1ece2",
    glow: "rgba(143,124,95,0.35)",
  },
  garlic: {
    label: "Garlic",
    base: "#d9c48d",
    ink: "#4c3d18",
    soft: "#f8f3e3",
    glow: "rgba(217,196,141,0.4)",
  },
  chili: {
    label: "Chili",
    base: "#b8431f",
    ink: "#441506",
    soft: "#fbe6de",
    glow: "rgba(184,67,31,0.38)",
  },
};

export function accentVars(accent: FlavorAccent): CSSProperties {
  const a = accents[accent];
  return {
    ["--accent" as string]: a.base,
    ["--accent-ink" as string]: a.ink,
    ["--accent-soft" as string]: a.soft,
    ["--accent-glow" as string]: a.glow,
  } as CSSProperties;
}
