import Link from "next/link";
import { ConceptBadge } from "@/components/ui/concept-badge";
import { Wordmark } from "@/components/brand/wordmark";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * The framed panel every authentication screen sits inside.
 * Server-safe: no state, no handlers.
 */
export function AuthCard({
  kicker,
  title,
  intro,
  children,
  footer,
  className,
}: {
  kicker?: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grain rounded-2xl border border-line bg-bone-100 p-6 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] sm:p-8",
        className,
      )}
    >
      <div className="relative z-2">
        {kicker ? <p className="kicker text-fg-subtle">{kicker}</p> : null}
        <h1 className="font-display mt-2 text-[1.75rem] leading-[0.95] tracking-[-0.04em] text-ink sm:text-[2.125rem]">
          {title}
        </h1>
        {intro ? (
          <div className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">{intro}</div>
        ) : null}
        <div className="mt-7">{children}</div>
        {footer ? <div className="mt-6 border-t border-line pt-5">{footer}</div> : null}
      </div>
    </div>
  );
}

/** Two-column page frame: form on the left, editorial panel on the right. */
export function AuthScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-full py-12 sm:py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-14">
        <div className="min-w-0">{children}</div>
        <AuthAside />
      </div>
    </div>
  );
}

/**
 * Editorial column that sits beside the form on wide screens. Keeps the
 * auth pages feeling like part of the site rather than a bolted-on
 * dashboard.
 */
export function AuthAside() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:justify-between lg:rounded-2xl lg:border lg:border-line-ink lg:bg-ink lg:p-10 lg:text-on-ink">
      <Wordmark className="text-[1.75rem] text-on-ink" />

      <div className="mt-16">
        <p className="kicker text-on-ink-muted">Your account</p>
        <h2 className="font-display mt-4 text-[2.5rem] leading-[0.92] tracking-[-0.045em] text-on-ink">
          Reorder in
          <br />
          two taps.
        </h2>
        <ul className="mt-8 space-y-4 text-sm leading-relaxed text-on-ink-muted">
          <li className="flex gap-3">
            <span className="num mt-0.5 text-xs text-on-ink-muted">01</span>
            <span>Every order and its contents, kept in one place.</span>
          </li>
          <li className="flex gap-3">
            <span className="num mt-0.5 text-xs text-on-ink-muted">02</span>
            <span>Pause, skip or change a subscription without emailing anyone.</span>
          </li>
          <li className="flex gap-3">
            <span className="num mt-0.5 text-xs text-on-ink-muted">03</span>
            <span>Your box, your addresses and your preferences saved for next time.</span>
          </li>
        </ul>
      </div>

      <div className="mt-16 space-y-3">
        <ConceptBadge tone="inverse" />
        <p className="text-[0.72rem] leading-relaxed text-on-ink-muted">
          {brand.name} is a concept brand in development. Questions go to{" "}
          <Link href="/contact" className="link-underline text-on-ink">
            our contact page
          </Link>
          .
        </p>
      </div>
    </aside>
  );
}
