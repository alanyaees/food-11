"use client";

import { motion } from "motion/react";
import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function FreeShippingMeter({
  progress,
  remainingCents,
  className,
}: {
  progress: number;
  remainingCents: number;
  className?: string;
}) {
  const complete = remainingCents === 0;

  return (
    <div className={cn("rounded-lg border border-line bg-bone-100 p-3.5", className)}>
      <div className="flex items-center gap-2 text-xs font-medium">
        <Truck className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
        {complete ? (
          <span>Free shipping unlocked.</span>
        ) : (
          <span>
            <span className="num font-semibold">{formatPrice(remainingCents)}</span> away from free
            shipping.
          </span>
        )}
      </div>
      <div
        className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-bone-300"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Progress towards free shipping"
      >
        <motion.div
          className={cn("h-full rounded-full", complete ? "bg-ink" : "bg-ember")}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(4, progress * 100)}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
