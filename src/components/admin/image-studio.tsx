"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Download, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  aspectToSize,
  imageTypeLabels,
  type AspectRatio,
  type ImageType,
} from "@/lib/image-prompts";
import { buildStudioPrompt } from "@/lib/image-brief";
import { cn } from "@/lib/utils";
import { ManifestSnippet } from "./manifest-snippet";
import { SetupPanel } from "./setup-panel";
import { StudioHistory } from "./studio-history";
import { SelectField, TextAreaField } from "./studio-fields";
import type { GeneratedRecord, StorageBackend, StudioProduct } from "./types";

/**
 * The image studio.
 *
 * Everything expensive happens on the server: this component only
 * assembles a brief, shows the exact prompt that will be sent, and
 * renders what comes back. It never sees an API key.
 */

const imageTypes = Object.entries(imageTypeLabels).map(([value, label]) => ({
  value: value as ImageType,
  label,
}));

const aspects: { value: AspectRatio; label: string }[] = [
  { value: "3:2", label: "3:2 — landscape (heroes, banners)" },
  { value: "1:1", label: "1:1 — square (cards, close-ups)" },
  { value: "2:3", label: "2:3 — portrait (packaging, editorial)" },
  { value: "16:9", label: "16:9 — wide (page banners)" },
];

const qualities: { value: "low" | "medium" | "high"; label: string }[] = [
  { value: "high", label: "High — slowest, best detail" },
  { value: "medium", label: "Medium — a good compromise" },
  { value: "low", label: "Low — quick drafts" },
];

type Status = "idle" | "generating" | "done" | "error";

export function ImageStudio({
  products,
  openAiConfigured,
  storageBackend,
}: {
  products: StudioProduct[];
  openAiConfigured: boolean;
  storageBackend: StorageBackend;
}) {
  const [productSlug, setProductSlug] = useState<string>(products[0]?.slug ?? "");
  const [type, setType] = useState<ImageType>("hero");
  const [aspect, setAspect] = useState<AspectRatio>("3:2");
  const [quality, setQuality] = useState<"low" | "medium" | "high">("high");
  const [instructions, setInstructions] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<GeneratedRecord | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const [history, setHistory] = useState<GeneratedRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const resultRef = useRef<HTMLDivElement | null>(null);

  const product = useMemo(
    () => products.find((entry) => entry.slug === productSlug) ?? null,
    [products, productSlug],
  );

  const prompt = useMemo(
    () => buildStudioPrompt({ product, type, aspect, instructions }),
    [product, type, aspect, instructions],
  );

  const sceneLed = type === "lifestyle" || type === "process";

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch("/api/generate-image", { cache: "no-store" });
      const data = (await response.json()) as { ok?: boolean; history?: GeneratedRecord[] };
      setHistory(data.ok && Array.isArray(data.history) ? data.history : []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  // Elapsed-time counter, so a two-minute wait never looks like a hang.
  useEffect(() => {
    if (status !== "generating") return;
    setElapsed(0);
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  async function generate() {
    if (status === "generating") return;
    setStatus("generating");
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: productSlug || null,
          type,
          aspect,
          quality,
          instructions: instructions.trim() || undefined,
        }),
      });

      const data = (await response.json()) as
        | ({ ok: true } & GeneratedRecord)
        | { ok: false; error?: string };

      if (!response.ok || !data.ok) {
        setError(
          ("error" in data && data.error) || "Generation failed. Check the server logs for detail.",
        );
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("done");
      void loadHistory();
      window.setTimeout(() => resultRef.current?.scrollIntoView({ block: "start" }), 50);
    } catch {
      setError("Could not reach the server. Is the dev server still running?");
      setStatus("error");
    }
  }

  function reuse(record: GeneratedRecord) {
    setResult(record);
    setStatus("done");
    if (record.productSlug) setProductSlug(record.productSlug);
    setType((record.purpose as ImageType) in imageTypeLabels ? (record.purpose as ImageType) : type);
    resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  const disabled = !openAiConfigured || storageBackend === "none" || status === "generating";

  return (
    <div className="space-y-10">
      <header>
        <p className="kicker text-fg-subtle">Internal tool</p>
        <h1 className="font-display mt-3 text-[2.25rem] leading-[0.92] tracking-[-0.045em] text-ink sm:text-[3rem]">
          Image studio
        </h1>
        <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-fg-muted">
          Assemble a brief, review the exact prompt, generate once. Images are generated ahead of
          time and committed — the storefront never calls OpenAI while somebody is waiting for a
          page.
        </p>
      </header>

      <SetupPanel openAiConfigured={openAiConfigured} storageBackend={storageBackend} />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {/* ── Brief ─────────────────────────────────────────── */}
        <section aria-labelledby="brief-heading" className="space-y-5">
          <h2 id="brief-heading" className="kicker border-b border-line pb-3 text-fg-muted">
            The brief
          </h2>

          <SelectField
            label="Product"
            value={productSlug}
            onChange={setProductSlug}
            disabled={status === "generating"}
            options={[
              { value: "", label: "No product — brand-level image" },
              ...products.map((entry) => ({
                value: entry.slug,
                label: `${entry.line} · ${entry.flavor}`,
              })),
            ]}
            hint="Drives the food description inside the prompt."
          />

          <SelectField
            label="Image type"
            value={type}
            onChange={setType}
            disabled={status === "generating"}
            options={imageTypes}
          />

          <SelectField
            label="Aspect ratio"
            value={aspect}
            onChange={setAspect}
            disabled={status === "generating"}
            options={aspects}
            hint={`Sent to OpenAI as ${aspectToSize[aspect]}.`}
          />

          <SelectField
            label="Quality"
            value={quality}
            onChange={setQuality}
            disabled={status === "generating"}
            options={qualities}
          />

          <TextAreaField
            label={sceneLed ? "Scene direction" : "Extra style notes"}
            value={instructions}
            onChange={setInstructions}
            disabled={status === "generating"}
            placeholder={
              sceneLed
                ? "A student in a small modern flat pouring boiling water into a matte black pouch, late-afternoon window light…"
                : "Chiaroscuro lighting, near-black background, lit like a jewellery product shot…"
            }
            hint={
              sceneLed
                ? "Scene-led image types use this to stage the shot."
                : "Used as style direction. Never ask for text or logos — packaging lettering is drawn in CSS."
            }
          />

          <Button
            type="button"
            size="lg"
            block
            onClick={generate}
            disabled={disabled}
            className="uppercase"
          >
            <Sparkles className="size-4" aria-hidden />
            {status === "generating" ? "Generating…" : "Generate with OpenAI"}
          </Button>

          {!openAiConfigured ? (
            <p className="text-xs leading-relaxed text-fg-subtle">
              Generation is disabled because the server has no OpenAI key.
            </p>
          ) : null}
        </section>

        {/* ── Prompt preview ────────────────────────────────── */}
        <section aria-labelledby="prompt-heading" className="space-y-5">
          <h2 id="prompt-heading" className="kicker border-b border-line pb-3 text-fg-muted">
            Assembled prompt
          </h2>

          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral">{imageTypeLabels[type]}</Badge>
            <Badge tone="neutral">{aspectToSize[aspect]}</Badge>
            <Badge tone="neutral">{quality} quality</Badge>
            <Badge tone="neutral">{prompt.length} chars</Badge>
          </div>

          <label htmlFor="prompt-preview" className="sr-only">
            Assembled prompt, read only
          </label>
          <textarea
            id="prompt-preview"
            readOnly
            value={prompt}
            rows={14}
            className="w-full resize-y rounded-xl border border-line-ink bg-ink p-4 font-mono text-[0.72rem] leading-relaxed text-on-ink outline-none"
          />
          <p className="text-xs leading-relaxed text-fg-subtle">
            Read-only. Everything above is assembled from{" "}
            <span className="num text-fg-muted">src/lib/image-prompts.ts</span>, so every image in
            the brand shares the same craft, palette and no-text rules.
          </p>
        </section>
      </div>

      {/* ── Result ──────────────────────────────────────────── */}
      <div ref={resultRef} className="scroll-mt-24 space-y-6">
        <div aria-live="polite" aria-atomic="true">
          {status === "generating" ? (
            <section className="rounded-xl border border-line bg-bone-100 p-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-semibold tracking-tight text-ink">
                  Generating with OpenAI…
                </p>
                <span className="num text-xs text-fg-subtle">{elapsed}s</span>
              </div>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-fg-muted">
                This normally takes 60–120 seconds at high quality. Leave the tab open — the request
                is still running even if nothing appears to change.
              </p>
              <Skeleton
                className={cn(
                  "mt-5 w-full rounded-lg",
                  aspect === "1:1" ? "aspect-square" : "aspect-[3/2]",
                )}
              />
            </section>
          ) : null}

          {status === "error" ? (
            <section className="flex gap-3 rounded-xl border border-ember/40 bg-ember-100 p-5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-ember-600" aria-hidden />
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight text-ember-600">
                  Generation failed
                </p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-ember-600">{error}</p>
              </div>
            </section>
          ) : null}
        </div>

        {status === "done" && result ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
            <figure className="overflow-hidden rounded-xl border border-line bg-bone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt=""
                width={result.width || undefined}
                height={result.height || undefined}
                className="w-full bg-bone-200 object-cover"
              />
              <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
                <span className="num text-[0.72rem] text-fg-muted">
                  {result.width}×{result.height} · {result.model}
                </span>
                <a
                  href={result.url}
                  download
                  className="press inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-[0.72rem] font-semibold text-fg-muted hover:border-ink hover:text-ink"
                >
                  <Download className="size-3" aria-hidden />
                  Download
                </a>
              </figcaption>
            </figure>

            <ManifestSnippet record={result} />
          </div>
        ) : null}
      </div>

      <StudioHistory history={history} loading={historyLoading} onReuse={reuse} />
    </div>
  );
}
