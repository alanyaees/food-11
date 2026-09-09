import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Megaphone, Package } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/content/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { brand } from "@/lib/brand";
import { contact } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

const title = "Contact";
const description =
  "Questions about the meals, the nutrition, wholesale or press? Email reaches the people building FULL. — no ticket queue, and an honest answer about how long a reply takes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: `${title} · ${brand.name}`,
    description,
    url: absoluteUrl("/contact"),
    siteName: brand.name,
  },
};

const directLines = [
  {
    icon: Mail,
    label: "General",
    value: brand.contact.email,
    note: "Anything at all. Read every weekday.",
  },
  {
    icon: Package,
    label: "Orders and support",
    value: brand.contact.support,
    note: "For when there is something to support.",
  },
  {
    icon: Megaphone,
    label: "Press and partnerships",
    value: brand.contact.press,
    note: "Happy to talk, including about the unfinished parts.",
  },
];

const quickLinks = [
  { label: "How much protein is in a meal?", href: "/faq#how-much-protein" },
  { label: "What allergens are present?", href: "/faq#allergens" },
  { label: "Where do you ship?", href: "/faq#shipping" },
  { label: "What is your returns policy?", href: "/faq#returns" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker={contact.hero.kicker}
        titleLines={contact.hero.titleLines}
        titleId="contact-title"
        lead={contact.hero.lead}
        size="md"
      />

      <section className="py-14 sm:py-20" aria-label="Get in touch">
        <div className="container-full">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-16">
            <Reveal className="min-w-0">
              <ContactForm />
            </Reveal>

            <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:h-fit lg:self-start">
              <Reveal delay={0.1}>
                <div className="flex items-start gap-4 rounded-2xl border border-line bg-bone-100 p-6">
                  <Clock className="mt-0.5 size-5 shrink-0 text-ember" aria-hidden />
                  <div>
                    <h2 className="font-display text-base font-extrabold tracking-[-0.02em] uppercase">
                      {contact.expectation.title}
                    </h2>
                    {contact.expectation.body.map((paragraph, index) => (
                      <p
                        key={index}
                        className="mt-2.5 text-[0.875rem] leading-relaxed text-fg-muted"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <h2 className="kicker mt-10 text-fg-subtle">Direct lines</h2>
                <ul className="mt-4 divide-y divide-line border-t border-line">
                  {directLines.map((line) => (
                    <li key={line.value} className="py-4">
                      <a
                        href={`mailto:${line.value}`}
                        className="group flex min-h-11 items-start gap-4"
                      >
                        <line.icon
                          className="mt-0.5 size-4 shrink-0 text-fg-subtle transition-colors group-hover:text-ink"
                          aria-hidden
                        />
                        <span className="min-w-0">
                          <span className="kicker block text-fg-subtle">{line.label}</span>
                          <span className="link-underline mt-1.5 block truncate text-[0.9375rem] font-semibold tracking-tight text-ink">
                            {line.value}
                          </span>
                          <span className="mt-1 block text-[0.78rem] text-fg-subtle">
                            {line.note}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                  <li className="py-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-fg-subtle" aria-hidden />
                      <div>
                        <span className="kicker block text-fg-subtle">Where we are</span>
                        <p className="mt-1.5 text-[0.9375rem] font-semibold tracking-tight text-ink">
                          {brand.contact.city}
                        </p>
                        <p className="mt-1 text-[0.78rem] text-fg-subtle">
                          {brand.legalName}. No walk-in address to publish yet — we will add one
                          when there is something worth visiting.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-10 rounded-2xl border border-line bg-bone-200/50 p-6">
                  <h2 className="font-display text-base font-extrabold tracking-[-0.02em] uppercase">
                    Probably already answered
                  </h2>
                  <ul className="mt-4 space-y-1">
                    {quickLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group flex min-h-10 items-center justify-between gap-3 text-[0.875rem] font-medium text-fg-muted transition-colors hover:text-ink"
                        >
                          <span>{link.label}</span>
                          <ArrowRight
                            className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/faq"
                    className="link-underline mt-5 inline-flex min-h-10 items-center gap-2 text-[0.8125rem] font-semibold text-ink"
                  >
                    Read the whole FAQ
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
