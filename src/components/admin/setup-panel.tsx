"use client";

import { KeyRound } from "lucide-react";
import type { StorageBackend } from "./types";

/**
 * Shown when the studio cannot fully do its job. States the missing
 * variable, what breaks without it, and where to put it — no vague
 * "something went wrong".
 */
export function SetupPanel({
  openAiConfigured,
  storageBackend,
}: {
  openAiConfigured: boolean;
  storageBackend: StorageBackend;
}) {
  const notes: { title: string; body: React.ReactNode }[] = [];

  if (!openAiConfigured) {
    notes.push({
      title: "OPENAI_API_KEY is not set",
      body: (
        <>
          Generation is disabled until the server has a key. Add it to{" "}
          <span className="num text-ink">.env.local</span> and restart the dev server. The key is
          read only on the server and is never sent to the browser.
        </>
      ),
    });
  }

  if (storageBackend === "local") {
    notes.push({
      title: "Storing images on disk",
      body: (
        <>
          No Supabase service-role key, so images are written to{" "}
          <span className="num text-ink">public/images/generated</span> and logged in{" "}
          <span className="num text-ink">.dev-assets/</span>. That is fine locally; set{" "}
          <span className="num text-ink">SUPABASE_SERVICE_ROLE_KEY</span> before generating anything
          you need on a deployment.
        </>
      ),
    });
  }

  if (storageBackend === "none") {
    notes.push({
      title: "No storage backend",
      body: (
        <>
          This instance is running in production without{" "}
          <span className="num text-ink">SUPABASE_SERVICE_ROLE_KEY</span>, and the filesystem is not
          persistent. Generation will return an error rather than quietly losing the image.
        </>
      ),
    });
  }

  if (notes.length === 0) return null;

  return (
    <section className="rounded-xl border border-line-strong bg-bone-200/60 p-5">
      <div className="flex items-center gap-2.5">
        <KeyRound className="size-4 text-fg-muted" aria-hidden />
        <h2 className="kicker text-fg-muted">Setup</h2>
      </div>
      <ul className="mt-4 space-y-4">
        {notes.map((note) => (
          <li key={note.title}>
            <p className="text-sm font-semibold tracking-tight text-ink">{note.title}</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-fg-muted">{note.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
