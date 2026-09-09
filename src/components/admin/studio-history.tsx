"use client";

import { imageTypeLabels, type ImageType } from "@/lib/image-prompts";
import type { GeneratedRecord } from "./types";

/**
 * Recent generations. Uses a plain <img>: sources are runtime values
 * that can point at either the local dev folder or a Supabase bucket,
 * so the Image component's static host configuration does not apply.
 */
export function StudioHistory({
  history,
  loading,
  onReuse,
}: {
  history: GeneratedRecord[];
  loading: boolean;
  onReuse: (record: GeneratedRecord) => void;
}) {
  return (
    <section aria-labelledby="studio-history-heading">
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 id="studio-history-heading" className="kicker text-fg-muted">
          Recent generations
        </h2>
        <span className="num text-[0.7rem] text-fg-subtle">
          {loading ? "Loading…" : `${history.length}`}
        </span>
      </div>

      {!loading && history.length === 0 ? (
        <p className="mt-5 text-sm leading-relaxed text-fg-muted">
          Nothing generated yet on this instance. Anything you make will be listed here with the
          prompt that produced it.
        </p>
      ) : null}

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {history.map((record) => (
          <li key={`${record.key}-${record.createdAt}`}>
            <button
              type="button"
              onClick={() => onReuse(record)}
              title={record.prompt}
              className="press group block w-full overflow-hidden rounded-lg border border-line bg-bone-100 text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={record.url}
                alt=""
                width={record.width || undefined}
                height={record.height || undefined}
                loading="lazy"
                className="aspect-square w-full bg-bone-200 object-cover transition-opacity group-hover:opacity-90"
              />
              <span className="block px-2.5 py-2">
                <span className="kicker block truncate text-fg-subtle">
                  {imageTypeLabels[record.purpose as ImageType] ?? record.purpose}
                </span>
                <span className="num mt-1 block truncate text-[0.7rem] text-fg-muted">
                  {record.productSlug ?? "brand"}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
