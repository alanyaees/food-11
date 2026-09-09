"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced to the console for developers; users only see the message below.
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="container-full flex min-h-[70vh] items-center py-16">
      <div className="max-w-xl">
        <p className="kicker text-fg-subtle">Something went wrong</p>
        <h1 className="mt-5 text-[length:var(--text-display-sm)] leading-[0.9] tracking-[-0.04em] uppercase">
          That was not supposed to happen.
        </h1>
        <p className="mt-6 text-[1.0625rem] leading-relaxed text-fg-muted">
          We hit an unexpected error rendering this page. Your cart is stored locally, so nothing has
          been lost. Try again, and if it keeps happening let us know.
        </p>
        {error.digest ? (
          <p className="num mt-3 text-xs text-fg-subtle">Reference {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} size="lg">
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </Button>
          <Button href="/" size="lg" variant="outline">
            Back home
          </Button>
          <Button href="/contact" size="lg" variant="ghost">
            Tell us what broke
          </Button>
        </div>
      </div>
    </div>
  );
}
