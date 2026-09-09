import Link from "next/link";
import { AlertTriangle, Mail } from "lucide-react";
import { brand } from "@/lib/brand";
import { legalMeta, type ProseSection } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";
import { ProseBlocks } from "./prose";
import { SideNav } from "./side-nav";

/**
 * Shared reading layout for /privacy and /terms.
 *
 * Sticky table of contents, one numbered section per anchor, and the
 * pre-launch review notice at the very top rather than buried at the
 * bottom — if a document has a caveat that large, it belongs before the
 * document, not after it.
 */
export function LegalLayout({
  kicker,
  title,
  lead,
  sections,
  summary,
}: {
  kicker: string;
  title: string;
  lead: string;
  sections: readonly ProseSection[];
  /** Two or three sentences of plain-language summary above the notice. */
  summary?: string;
}) {
  const navItems = sections.map((section) => ({ id: section.id, label: section.title }));

  return (
    <div className="pb-4">
      <section className="border-b border-line pt-12 pb-12 sm:pt-16" aria-labelledby="legal-title">
        <div className="container-full">
          <Reveal>
            <p className="kicker text-fg-subtle">{kicker}</p>
          </Reveal>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <Reveal>
              <h1
                id="legal-title"
                className="text-[length:var(--text-display-md)] leading-[0.88] tracking-[-0.045em] uppercase"
              >
                {title}
              </h1>
              <p className="num mt-6 text-[0.7rem] tracking-[0.16em] text-fg-subtle uppercase">
                Last updated {legalMeta.lastUpdated}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">{lead}</p>
              {summary ? (
                <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-fg-muted">
                  {summary}
                </p>
              ) : null}
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 flex max-w-3xl gap-4 rounded-xl border border-ember/35 bg-ember-100/60 p-5">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-ember-600" aria-hidden />
              <div>
                <p className="text-[0.8125rem] font-bold tracking-tight text-ink uppercase">
                  Read this first
                </p>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-ink/75">
                  {legalMeta.reviewNotice}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-full">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
          <SideNav
            items={navItems}
            label="Sections of this document"
            title="On this page"
            footer={
              <div>
                <p className="text-[0.8125rem] leading-relaxed text-fg-muted">
                  Something here unclear or wrong? Tell us and we will fix the wording.
                </p>
                <Link
                  href="/contact"
                  className="link-underline mt-3 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-ink"
                >
                  <Mail className="size-3.5" aria-hidden />
                  Contact us
                </Link>
              </div>
            }
          />

          <div className="min-w-0 pt-12 pb-6 lg:pt-16">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-[calc(var(--header-height)+3rem)] border-t border-line pt-8 pb-10 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline gap-4">
                  <span className="num text-[0.7rem] font-bold text-fg-subtle">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2
                    id={`${section.id}-heading`}
                    className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink uppercase sm:text-2xl"
                  >
                    {section.title}
                  </h2>
                </div>
                <div className="mt-5 sm:ml-9">
                  <ProseBlocks blocks={section.blocks} />
                </div>
              </section>
            ))}

            <div className="mt-4 rounded-xl border border-line bg-bone-100 p-6">
              <p className="kicker text-fg-subtle">Questions about this document</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">
                Write to{" "}
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="link-underline font-semibold text-ink"
                >
                  {brand.contact.email}
                </a>
                . For data requests specifically, put &ldquo;GDPR request&rdquo; in the subject line
                so it reaches the right person quickly.
              </p>
              <p className="mt-4 text-[0.8125rem] text-fg-subtle">
                {brand.legalName} · {brand.contact.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
