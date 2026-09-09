"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

type Tab = "sign-in" | "sign-up";

const tabs: { id: Tab; label: string }[] = [
  { id: "sign-in", label: "Sign in" },
  { id: "sign-up", label: "Create account" },
];

/**
 * Sign in / create account, side by side.
 *
 * Implements the ARIA tabs pattern: roving tabindex, left/right arrow
 * navigation, and panels wired with aria-labelledby.
 */
export function AuthTabs({ defaultTab = "sign-in" }: { defaultTab?: Tab }) {
  const [active, setActive] = useState<Tab>(defaultTab);
  const uid = useId();
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = tabs.findIndex((tab) => tab.id === active);
    const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setActive(next.id);
    buttonRefs.current[next.id]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Account access"
        className="flex gap-1 rounded-full border border-line bg-bone-200/70 p-1"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                buttonRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`${uid}-${tab.id}-tab`}
              aria-selected={selected}
              aria-controls={`${uid}-${tab.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={onKeyDown}
              className={cn(
                "press flex-1 rounded-full px-4 py-2.5 text-sm font-semibold tracking-tight",
                selected ? "bg-ink text-on-ink" : "text-fg-muted hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-sign-in-panel`}
        aria-labelledby={`${uid}-sign-in-tab`}
        hidden={active !== "sign-in"}
        className="mt-7"
      >
        {active === "sign-in" ? <SignInForm /> : null}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-sign-up-panel`}
        aria-labelledby={`${uid}-sign-up-tab`}
        hidden={active !== "sign-up"}
        className="mt-7"
      >
        {active === "sign-up" ? <SignUpForm /> : null}
      </div>
    </div>
  );
}
