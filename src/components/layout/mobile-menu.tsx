"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { brand, primaryNav } from "@/lib/brand";
import { getProducts } from "@/lib/products";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/wordmark";
import { PouchMini } from "@/components/brand/pouch";
import { MacroModeToggle } from "@/components/features/macro-mode-toggle";

const secondary = [
  { label: "Compare a meal", href: "/nutrition#compare" },
  { label: "What should I eat?", href: "/shop#finder" },
  { label: "Student survey", href: "/survey" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const products = getProducts().slice(0, 3);

  return (
    <Sheet open={open} onClose={onClose} side="full" title="Menu" className="bg-ink text-on-ink">
      <div className="flex h-full flex-col overflow-y-auto overscroll-contain">
        <div className="flex h-(--header-height) shrink-0 items-center justify-between px-5">
          <Link href="/" onClick={onClose} aria-label={`${brand.nameBare} — home`}>
            <Wordmark className="text-[1.5rem] text-on-ink" />
          </Link>
        </div>

        <nav aria-label="Mobile" className="px-5 pt-4">
          <ul>
            {primaryNav.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-white/10"
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="font-display text-[2.1rem] leading-none font-extrabold tracking-[-0.04em] uppercase">
                    {item.label}
                  </span>
                  <span className="kicker shrink-0 pb-1 text-right text-[0.6rem] text-on-ink-muted">
                    0{index + 1}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="px-5 pt-6">
          <Button href="/survey" onClick={onClose} variant="accent" size="lg" block>
            Take a survey
          </Button>
        </div>

        <div className="mt-8 px-5">
          <p className="kicker text-on-ink-muted">Popular right now</p>
          <div className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="w-36 shrink-0 snap-start"
              >
                <PouchMini
                  line={product.line}
                  flavor={product.flavor}
                  protein={product.nutrition.protein}
                  accent={product.accent}
                />
                <p className="mt-2 text-sm font-semibold tracking-tight">{product.flavor}</p>
                <p className="text-xs text-on-ink-muted">{product.line}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 px-5">
          <MacroModeToggle inverse />
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-1 px-5 pb-10">
          {secondary.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-1 py-2 text-sm text-on-ink-muted transition-colors hover:text-on-ink"
              >
                {item.label}
                <ArrowUpRight className="size-3.5 opacity-50" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}
