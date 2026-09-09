import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand, disclaimers, footerNav } from "@/lib/brand";
import { Wordmark } from "@/components/brand/wordmark";
import { NewsletterForm } from "./newsletter-form";
import { MacroModeToggle } from "@/components/features/macro-mode-toggle";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative mt-24 overflow-hidden bg-ink text-on-ink sm:mt-32">
      <div className="container-full relative z-2 pt-16 pb-10 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Wordmark className="text-[clamp(3.5rem,13vw,8rem)] text-on-ink" />
            <p className="font-display mt-3 max-w-md text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.02] tracking-[-0.03em] uppercase">
              {brand.footerStatement}
            </p>
            <div className="mt-10 max-w-md">
              <p className="text-sm text-on-ink-muted">{brand.newsletter.heading}</p>
              <NewsletterForm />
            </div>
            <div className="mt-10">
              <MacroModeToggle inverse />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="kicker text-on-ink-muted">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={`${group.title}-${item.href}`}>
                      <Link
                        href={item.href}
                        className="link-underline text-sm text-on-ink/85 transition-colors hover:text-on-ink"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="sm:col-span-2 lg:col-span-4">
              <h2 className="kicker text-on-ink-muted">Social</h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {brand.social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline inline-flex items-center gap-1 text-sm text-on-ink/85 hover:text-on-ink"
                    >
                      {item.label}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-4 border-t border-white/12 pt-8">
          <p className="max-w-4xl text-[0.72rem] leading-relaxed text-on-ink-muted">
            {disclaimers.conceptLong} {disclaimers.noMedicalClaims} {disclaimers.shelfLife}
          </p>
          <div className="flex flex-col gap-3 text-[0.72rem] text-on-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {brand.legalName}. {brand.contact.city}.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <Link href="/privacy" className="hover:text-on-ink">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-on-ink">
                Terms
              </Link>
              <Link href="/privacy#cookies" className="hover:text-on-ink">
                Cookies
              </Link>
              <a href={`mailto:${brand.contact.email}`} className="hover:text-on-ink">
                {brand.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Oversized brand watermark */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -bottom-[3vw] left-0 w-full text-center text-[26vw] leading-[0.7] font-extrabold tracking-[-0.06em] text-white/[0.035] uppercase select-none"
      >
        {brand.name}
      </span>
    </footer>
  );
}
