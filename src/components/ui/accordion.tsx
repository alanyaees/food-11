"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id?: string;
  question: string;
  answer: React.ReactNode;
}

export function Accordion({
  items,
  className,
  defaultOpen,
  inverse = false,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: number;
  inverse?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);
  const uid = useId();

  return (
    <div className={cn("divide-y", inverse ? "divide-white/12" : "divide-line", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${uid}-panel-${index}`;
        const buttonId = `${uid}-button-${index}`;
        return (
          <div key={item.id ?? index} id={item.id} className="scroll-mt-28">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className={cn(
                  "group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors sm:py-6",
                  inverse ? "hover:text-white" : "hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "font-display text-lg leading-tight font-semibold tracking-tight sm:text-xl",
                    inverse ? "text-on-ink" : "text-ink",
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    inverse
                      ? "border-white/25 text-on-ink group-hover:border-white/60"
                      : "border-line-strong text-fg-muted group-hover:border-ink group-hover:text-ink",
                    isOpen && "rotate-45",
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      "max-w-3xl pb-6 text-[0.95rem] leading-relaxed",
                      inverse ? "text-on-ink-muted" : "text-fg-muted",
                    )}
                  >
                    {item.answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
