"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const STORAGE_KEY = "full.cookie-consent.v1";

type Consent = "necessary" | "all";

function readConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "necessary" || value === "all") return value;
  } catch {
    /* storage unavailable */
  }
  return null;
}

function writeConsent(value: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

/**
 * EU-ready cookie bar. Strictly necessary storage (cart, session, this
 * choice) is already in use. Analytics and advertising cookies are not
 * set unless the visitor opts in — and currently none are loaded even
 * after "Accept", so the toggle is ready for real measurement later.
 */
export function CookieBanner() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readConsent() === null);
  }, []);

  function choose(value: Consent) {
    writeConsent(value);
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="region"
          aria-labelledby="cookie-heading"
          aria-describedby="cookie-copy"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[90] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="glass mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-3 rounded-2xl p-4 shadow-[0_24px_60px_-28px_rgba(14,14,12,0.45)] sm:flex-row sm:items-center sm:gap-5 sm:p-4">
            <div className="min-w-0 flex-1">
              <p id="cookie-heading" className="kicker text-fg-subtle">
                Cookies
              </p>
              <p id="cookie-copy" className="mt-2 text-sm leading-relaxed text-fg-muted">
                We keep a few strictly necessary cookies so your cart, sign-in and this choice
                survive a refresh. Analytics wait for a yes — and we have not switched any on yet.
                Read the{" "}
                <Link href="/privacy#cookies" className="link-underline font-medium text-ink">
                  privacy policy
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => choose("necessary")}
                className="press h-11 rounded-full border border-ink/20 px-4 text-sm font-semibold tracking-tight hover:border-ink"
              >
                Necessary only
              </button>
              <button
                type="button"
                onClick={() => choose("all")}
                className="press h-11 rounded-full bg-ink px-4 text-sm font-semibold tracking-tight text-on-ink hover:bg-ink-700"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
