import Link from "next/link";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Page chrome shared by every signed-in account screen: a heading
 * block, the section nav, and a content slot.
 */

const accountNav = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
];

export function AccountShell({
  kicker = "Your account",
  title,
  description,
  action,
  activeHref,
  children,
}: {
  kicker?: string;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  activeHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-full py-12 sm:py-16 lg:py-20">
      <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="kicker text-fg-subtle">{kicker}</p>
          <h1 className="font-display mt-3 text-[2.25rem] leading-[0.92] tracking-[-0.045em] text-ink sm:text-[3rem]">
            {title}
          </h1>
          {description ? (
            <div className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-fg-muted">
              {description}
            </div>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>

      <nav aria-label="Account sections" className="mt-6 flex flex-wrap gap-2">
        {accountNav.map((item) => {
          const active = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "press rounded-full border px-4 py-2 text-sm font-semibold tracking-tight",
                active
                  ? "border-ink bg-ink text-on-ink"
                  : "border-line-strong text-fg-muted hover:border-ink hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10">{children}</div>
    </div>
  );
}

/** Honest banner shown whenever an integration is missing, or a link failed. */
export function DemoNotice({
  title,
  children,
  className,
  tone = "neutral",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "warning";
}) {
  const warning = tone === "warning";

  return (
    <div
      role={warning ? "alert" : undefined}
      className={cn(
        "flex gap-3 rounded-xl border p-4 sm:p-5",
        warning ? "border-ember/40 bg-ember-100" : "border-line-strong bg-bone-200/60",
        className,
      )}
    >
      {warning ? (
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-ember-600" aria-hidden />
      ) : (
        <Info className="mt-0.5 size-4 shrink-0 text-fg-muted" aria-hidden />
      )}
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm font-semibold tracking-tight",
            warning ? "text-ember-600" : "text-ink",
          )}
        >
          {title}
        </p>
        <div
          className={cn(
            "mt-1 text-[0.8125rem] leading-relaxed",
            warning ? "text-ember-600" : "text-fg-muted",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** Dashboard tile linking to a sub-section. */
export function AccountCard({
  title,
  description,
  href,
  meta,
  children,
}: {
  title: string;
  description: string;
  href?: string;
  meta?: string;
  children?: React.ReactNode;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-xl leading-tight tracking-[-0.03em] text-ink">{title}</h2>
        {meta ? <span className="num shrink-0 text-xs text-fg-subtle">{meta}</span> : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </>
  );

  const className =
    "block rounded-xl border border-line bg-bone-100 p-5 transition-colors sm:p-6";

  if (href) {
    return (
      <Link href={href} className={cn(className, "press hover:border-ink/40")}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}
