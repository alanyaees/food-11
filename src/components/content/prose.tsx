import type { ProseBlock } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Renders the structured prose used by the policy pages.
 *
   * Measure is capped at roughly 58 characters and the line height is
 * loose, because these are the two pages on the site people actually
 * have to read carefully. Tables become keyboard-scrollable regions on
 * narrow screens rather than forcing the page to scroll sideways.
 */
export function ProseBlocks({
  blocks,
  className,
}: {
  blocks: readonly ProseBlock[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      {blocks.map((block, index) => {
        if (block.kind === "p") {
          return (
            <p key={index} className="max-w-[58ch] text-[0.9375rem] leading-[1.75] text-fg-muted">
              {block.text}
            </p>
          );
        }

        if (block.kind === "sub") {
          return (
            <h3
              key={index}
              className="font-display pt-3 text-base font-extrabold tracking-[-0.02em] text-ink uppercase"
            >
              {block.text}
            </h3>
          );
        }

        if (block.kind === "list") {
          return (
            <ul key={index} className="max-w-[58ch] space-y-3">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3.5">
                  <span aria-hidden className="mt-3 h-px w-3.5 shrink-0 bg-line-strong" />
                  <span className="text-[0.9375rem] leading-[1.7] text-fg-muted">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div
            key={index}
            role="region"
            aria-label={block.caption ?? "Table"}
            tabIndex={0}
            className="overflow-x-auto rounded-xl border border-line focus-visible:outline-2"
          >
            <table className="w-full min-w-[34rem] border-collapse text-left">
              {block.caption ? <caption className="sr-only">{block.caption}</caption> : null}
              <thead>
                <tr className="border-b border-line bg-bone-200/50">
                  {block.head.map((heading) => (
                    <th key={heading} scope="col" className="kicker px-4 py-3.5 text-fg-subtle">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-line last:border-b-0">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={cn(
                          "px-4 py-4 align-top text-[0.85rem] leading-[1.6]",
                          cellIndex === 0 ? "font-semibold text-ink" : "text-fg-muted",
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
