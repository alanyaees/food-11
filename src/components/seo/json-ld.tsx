/** Embeds structured data as a single JSON-LD document.

 * Arrays are wrapped in `@graph` so parsers that expect `@context` on
 * the root object (Chrome's built-in consumer, some extensions) don't
 * throw when they read `parsed["@context"].toLowerCase()`.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const document = Array.isArray(data) ? asGraph(data) : data;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(document) }}
    />
  );
}

function asGraph(entries: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": entries.map((entry) => {
      if (entry && typeof entry === "object" && "@context" in entry) {
        const { ["@context"]: _context, ...rest } = entry as Record<string, unknown>;
        return rest;
      }
      return entry;
    }),
  };
}
