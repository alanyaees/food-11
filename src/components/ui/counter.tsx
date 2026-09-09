"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Counts up to `value` when scrolled into view. Renders the final value
 * server-side and for reduced-motion users, so the number is never
 * missing and the layout never shifts.
 */
export function Counter({
  value,
  decimals = 0,
  duration = 1.25,
  suffix,
  prefix,
  className,
  once = true,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    if (once && started) {
      setDisplay(value);
      return;
    }
    setStarted(true);

    let frame = 0;
    const start = performance.now();
    const from = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={cn("num tabular-nums", className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
