"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { faqCategories, faqItems, type FaqItem } from "@/lib/faq";
import { SideNav } from "./side-nav";

function AnswerBody({ item }: { item: FaqItem }) {
  return (
    <div className="space-y-3.5">
      <div>{item.answer}</div>
      {item.more?.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {item.links?.length ? (
        <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
          {item.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="link-underline inline-flex min-h-6 items-center gap-1.5 text-[0.8125rem] font-semibold text-ink"
              >
                {link.label}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {item.note ? (
        <p className="flex gap-2.5 border-t border-line pt-3.5 text-[0.72rem] leading-relaxed text-fg-subtle">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>{item.note}</span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * The FAQ, grouped by category with a sticky index.
 *
 * The accordion is uncontrolled by design, so a deep link like
 * /faq#returns is honoured by remounting just that category's accordion
 * with the linked question already open — which means the footer's
 * shipping and returns links land on an answer, not on a closed row.
 */
export function FaqSections() {
  const [openId, setOpenId] = useState<string | null>(null);

  const syncFromHash = useCallback(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const match = faqItems.find((item) => item.id === hash);
    setOpenId(match ? match.id : null);
  }, []);

  useEffect(() => {
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [syncFromHash]);

  const navItems = faqCategories.map((category) => ({
    id: category.id,
    label: category.label,
    hint: category.blurb,
  }));

  return (
    <div className="container-full">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
        <SideNav
          items={navItems}
          label="FAQ categories"
          title="Categories"
          footer={
            <div>
              <p className="text-[0.8125rem] leading-relaxed text-fg-muted">
                Not answered here? We would rather hear the question than have you guess.
              </p>
              <Link
                href="/contact"
                className="link-underline mt-3 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-ink"
              >
                Ask us directly
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          }
        />

        <div className="min-w-0 pt-12 pb-8 lg:pt-16">
          {faqCategories.map((category, categoryIndex) => {
            const items = faqItems.filter((item) => item.category === category.id);
            const openIndex = items.findIndex((item) => item.id === openId);
            const accordionItems: AccordionItem[] = items.map((item) => ({
              id: item.id,
              question: item.question,
              answer: <AnswerBody item={item} />,
            }));

            return (
              <section
                key={category.id}
                id={category.id}
                aria-labelledby={`${category.id}-heading`}
                className="scroll-mt-[calc(var(--header-height)+3rem)] pb-14 sm:pb-20"
              >
                <div className="flex items-baseline gap-4 border-b border-ink pb-4">
                  <span className="num font-display text-sm font-extrabold text-fg-subtle">
                    {String(categoryIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2
                      id={`${category.id}-heading`}
                      className="text-[length:var(--text-display-xs)] leading-none tracking-[-0.04em] uppercase"
                    >
                      {category.label}
                    </h2>
                    <p className="mt-2 text-[0.8125rem] text-fg-subtle">{category.blurb}</p>
                  </div>
                </div>

                <Accordion
                  key={`${category.id}-${openIndex}`}
                  items={accordionItems}
                  defaultOpen={openIndex >= 0 ? openIndex : undefined}
                />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
