"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratedRecord } from "./types";

/**
 * Turns a fresh generation into the exact JSON block to paste into
 * src/assets/manifest.json, which is what the site actually reads.
 * Nothing is written to that file automatically — wiring an asset in is
 * a deliberate, reviewable commit.
 */
export function ManifestSnippet({ record }: { record: GeneratedRecord }) {
  const [manifestKey, setManifestKey] = useState(
    `${record.purpose}-${record.productSlug ?? "brand"}`,
  );
  const [alt, setAlt] = useState("");
  const [copied, setCopied] = useState(false);

  const snippet = `"${manifestKey}": ${JSON.stringify(
    {
      path: record.url,
      width: record.width,
      height: record.height,
      alt: alt.trim() || "TODO: describe this image for screen readers",
      model: record.model,
      purpose: record.purpose,
      createdAt: record.createdAt,
    },
    null,
    2,
  )}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-xl border border-line bg-bone-100 p-5">
      <h3 className="font-display text-lg tracking-[-0.03em] text-ink">Wire it into the site</h3>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-fg-muted">
        Paste this into{" "}
        <span className="num text-ink">src/assets/manifest.json</span> under{" "}
        <span className="num text-ink">assets</span>. Components resolve images by key, so nothing
        else needs to change.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="kicker block text-fg-muted">Manifest key</span>
          <input
            value={manifestKey}
            onChange={(event) => setManifestKey(event.target.value)}
            className="num h-11 w-full rounded-lg border border-line-strong bg-bone px-3 text-sm text-ink outline-none hover:border-ink/40"
          />
        </label>
        <label className="space-y-1.5">
          <span className="kicker block text-fg-muted">Alt text</span>
          <input
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Describe what is actually in the frame"
            className="h-11 w-full rounded-lg border border-line-strong bg-bone px-3 text-sm text-ink outline-none placeholder:text-fg-subtle hover:border-ink/40"
          />
        </label>
      </div>

      <div className="relative mt-4">
        <pre className="num max-h-64 overflow-auto rounded-lg border border-line-ink bg-ink p-4 pr-14 text-[0.72rem] leading-relaxed text-on-ink">
          {snippet}
        </pre>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "press absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[0.7rem] font-semibold text-on-ink",
            copied ? "bg-white/20" : "hover:bg-white/10",
          )}
        >
          {copied ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied ? "Manifest snippet copied to the clipboard." : ""}
      </p>
    </section>
  );
}
