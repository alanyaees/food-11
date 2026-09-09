"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll reveal used across every section. Honours
 * prefers-reduced-motion by rendering the final state immediately, and
 * never animates height/layout so nothing shifts as you read.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  as = "div",
  amount = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  once?: boolean;
  as?: "div" | "section" | "li" | "span" | "header" | "article";
  amount?: number;
}) {
  const reduced = useReducedMotion();
  const offset = offsets[direction];
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.5em", rotate: 1.5 },
  visible: { opacity: 1, y: 0, rotate: 0 },
};

/** Line-by-line editorial text reveal for display headlines. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  once = true,
}: {
  lines: (string | React.ReactNode)[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <span className={className}>
        {lines.map((line, index) => (
          <span key={index} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.4 }}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
    >
      {lines.map((line, index) => (
        <span key={index} className={cn("block overflow-hidden pb-[0.06em]", lineClassName)}>
          <motion.span
            className="block"
            variants={wordVariants}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
