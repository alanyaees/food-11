import type { Metadata } from "next";
import Link from "next/link";
import { Check, Lock, Minus, ShieldAlert } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin";
import { integrationStatus } from "@/lib/env";
import { cn } from "@/lib/utils";

/**
 * Chrome for the internal tools.
 *
 * Access is checked here so every route under /admin inherits it, and
 * the whole subtree is marked noindex. In development the check passes
 * with a `devUnlocked` flag, which is surfaced as a loud banner rather
 * than hidden.
 */

export const metadata: Metadata = {
  title: "Internal tools",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

function StatusRow({
  label,
  configured,
  hint,
}: {
  label: string;
  configured: boolean;
  hint: string;
}) {
  return (
    <li className="flex items-start gap-2.5 py-2">
      <span
        className={cn(
          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
          configured ? "border-transparent bg-ink text-on-ink" : "border-line-strong text-fg-subtle",
        )}
        aria-hidden
      >
        {configured ? <Check className="size-2.5" /> : <Minus className="size-2.5" />}
      </span>
      <div className="min-w-0">
        <p className="text-[0.8125rem] leading-tight font-semibold text-ink">
          {label}
          <span className="sr-only">{configured ? " — configured" : " — not configured"}</span>
        </p>
        <p className="mt-0.5 text-[0.75rem] leading-relaxed text-fg-muted">{hint}</p>
      </div>
    </li>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = await requireAdmin();
  const statuses = integrationStatus();

  if (!access.allowed) {
    return (
      <div className="container-full flex min-h-[70vh] items-center justify-center py-20">
        <div className="max-w-md rounded-2xl border border-line bg-bone-100 p-8 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-full border border-line-strong text-fg-muted">
            <Lock className="size-4" aria-hidden />
          </span>
          <h1 className="font-display mt-5 text-2xl tracking-[-0.035em] text-ink">
            Internal tools
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{access.reason}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button href="/" variant="outline" size="sm">
              Back to the site
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-bone">
      <div className="border-b border-line bg-bone-100">
        <div className="container-full flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="press -m-1 rounded-md p-1">
              <Wordmark className="text-lg" />
            </Link>
            <span className="kicker rounded-full border border-line-strong px-2.5 py-1 text-fg-muted">
              Internal · not public
            </span>
          </div>
          <nav aria-label="Internal tools" className="flex items-center gap-4 text-sm">
            <Link href="/admin/image-studio" className="link-underline font-medium text-ink">
              Image studio
            </Link>
            <Link href="/" className="link-underline text-fg-muted">
              Storefront
            </Link>
          </nav>
        </div>
      </div>

      {access.devUnlocked ? (
        <div className="border-b border-ember/30 bg-ember-100">
          <div className="container-full flex items-start gap-3 py-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-ember-600" aria-hidden />
            <p className="text-[0.8125rem] leading-relaxed text-ember-600">
              <strong className="font-semibold">Development access.</strong> You are seeing this
              because the app is running in development. In production these pages require a signed-in
              account whose email is listed in <span className="num">ADMIN_EMAILS</span>.
            </p>
          </div>
        </div>
      ) : null}

      <div className="container-full grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14 lg:py-14">
        <div className="min-w-0">{children}</div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-bone-100 p-5">
            <h2 className="kicker text-fg-subtle">Integrations</h2>
            <ul className="mt-3 divide-y divide-line">
              {statuses.map((status) => (
                <StatusRow
                  key={status.id}
                  label={status.label}
                  configured={status.configured}
                  hint={status.hint}
                />
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-4 text-[0.72rem] leading-relaxed text-fg-subtle">
              Every integration is optional. The storefront runs on the bundled seed catalogue when
              they are all switched off.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
