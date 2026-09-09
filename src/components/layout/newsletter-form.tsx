"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { brand } from "@/lib/brand";

type State = "idle" | "loading" | "done" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message ?? "Something went wrong.");
      setState("done");
      setMessage(data.message ?? "You're on the list.");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] p-1.5 focus-within:border-white/50">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder={brand.newsletter.placeholder}
          className="h-9 min-w-0 flex-1 bg-transparent px-3 text-sm text-on-ink outline-none placeholder:text-on-ink-muted"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="press inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-bone px-4 text-xs font-bold tracking-tight text-ink uppercase disabled:opacity-60"
        >
          {state === "loading" ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : state === "done" ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <ArrowRight className="size-3.5" aria-hidden />
          )}
          {state === "done" ? "Joined" : brand.newsletter.cta}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-2 min-h-4 text-xs ${state === "error" ? "text-ember" : "text-on-ink-muted"}`}
      >
        {message}
      </p>
    </form>
  );
}
