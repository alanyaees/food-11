"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

interface Part {
  id: string;
  label: string;
  note: string;
  /** Marked when the specification is not finalised. */
  pending?: boolean;
}

const parts: Part[] = [
  {
    id: "notch",
    label: "Tear notch",
    note: "A score line at the top corner so the pouch opens straight, by hand, without scissors or a knife.",
  },
  {
    id: "zip",
    label: "Zip seal",
    note: "Closes again after you pour, so the pouch can stand and hold its heat through the standing time.",
  },
  {
    id: "print",
    label: "Outer print layer",
    note: "Where the label lives. Nutrition, allergens, ingredients and instructions are printed on the pouch itself — no sleeve to lose.",
  },
  {
    id: "barrier",
    label: "Barrier layer",
    note: "The layer doing the real work: keeping light, oxygen and moisture out so the food inside stays dry.",
    pending: true,
  },
  {
    id: "liner",
    label: "Food-contact liner",
    note: "The inner surface, which has to be rated for just-boiled water and for direct contact with food.",
    pending: true,
  },
  {
    id: "fill",
    label: "Fill line",
    note: "Printed inside the pouch. The only measurement you have to get right, and it is at eye level while you pour.",
  },
  {
    id: "gusset",
    label: "Standing gusset",
    note: "A folded base that opens into a flat footprint, so the pouch stands on a counter instead of needing a bowl.",
  },
];

/* Pouch profile, drawn once and reused as both outline and clip path. */
const OUTLINE = "M150 30 H250 V248 L266 276 H134 L150 248 Z";

/**
 * Cross-section of the packaging with labelled callouts.
 *
 * The drawing is decorative — every part is described in the list
 * beside it, which is also the control surface: hovering or focusing an
 * entry highlights the matching part of the diagram and dims the rest.
 */
export function PouchDiagram({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const uid = useId();
  const clipId = `${uid}-pouch-clip`;
  const hatchId = `${uid}-hatch`;

  const on = (id: string) => active === null || active === id;
  const hot = (id: string) => active === id;
  const dim = (id: string) => (on(id) ? 1 : 0.28);
  const stroke = (id: string) => (hot(id) ? "var(--color-ember)" : "var(--color-ink)");
  const width = (id: string, base: number) => (hot(id) ? base + 1 : base);

  const bubble = (id: string, index: number, cx: number, cy: number) => (
    <g opacity={dim(id)} style={{ transition: "opacity 0.25s ease" }}>
      <circle
        cx={cx}
        cy={cy}
        r={11}
        fill={hot(id) ? "var(--color-ember)" : "var(--color-bone-100)"}
        stroke={hot(id) ? "var(--color-ember)" : "var(--color-line-strong)"}
        strokeWidth={1}
        style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
      />
      <text
        x={cx}
        y={cy + 3.6}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={hot(id) ? "#fff" : "var(--color-fg-muted)"}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {index + 1}
      </text>
    </g>
  );

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12", className)}>
      <div className="flex min-w-0 items-center justify-center rounded-2xl border border-line bg-bone-100 p-4 sm:p-6">
        <svg
          viewBox="0 0 420 320"
          className="h-auto w-full max-w-md"
          role="img"
          aria-label="Cross-section diagram of the pouch, showing the tear notch, zip seal, three laminate layers, fill line and standing gusset."
        >
          <defs>
            <clipPath id={clipId}>
              <path d={OUTLINE} />
            </clipPath>
            <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M0 6 L6 0" stroke="var(--color-line-strong)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* dry contents inside the pouch */}
          <g clipPath={`url(#${clipId})`}>
            <rect x="120" y="30" width="180" height="260" fill="var(--color-bone)" />
            <rect x="120" y="188" width="180" height="110" fill="var(--color-cheddar)" opacity="0.5" />
            <rect
              x="120"
              y="188"
              width="180"
              height="110"
              fill={`url(#${hatchId})`}
              opacity="0.35"
            />
          </g>

          {/* body outline */}
          <path
            d={OUTLINE}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* top seal band */}
          <rect
            x="150"
            y="30"
            width="100"
            height="15"
            fill="var(--color-bone-200)"
            stroke="var(--color-ink)"
            strokeWidth="1"
          />

          {/* 1 — tear notch */}
          <g opacity={dim("notch")} style={{ transition: "opacity 0.25s ease" }}>
            <path
              d="M150 48 L142 52 L150 56"
              fill="none"
              stroke={stroke("notch")}
              strokeWidth={width("notch", 1.6)}
              strokeLinejoin="round"
            />
            <path d="M68 52 H140" stroke="var(--color-line-strong)" strokeWidth="1" />
          </g>
          {bubble("notch", 0, 68, 52)}

          {/* 2 — zip seal */}
          <g opacity={dim("zip")} style={{ transition: "opacity 0.25s ease" }}>
            <path
              d="M152 54 H248"
              stroke={stroke("zip")}
              strokeWidth={width("zip", 1.4)}
              strokeDasharray="4 3"
            />
            <path d="M251 54 H289" stroke="var(--color-line-strong)" strokeWidth="1" />
          </g>
          {bubble("zip", 1, 300, 54)}

          {/* magnification cone from the pouch wall to the laminate detail */}
          <path
            d="M250 128 L306 104 M250 168 L306 192"
            stroke="var(--color-line-strong)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* laminate detail — 3, 4, 5 */}
          {[
            { id: "print", y: 104, fill: "var(--color-ink-700)" },
            { id: "barrier", y: 133, fill: "var(--color-bone-300)" },
            { id: "liner", y: 162, fill: "var(--color-bone-100)" },
          ].map((layer, layerIndex) => (
            <g key={layer.id}>
              <g opacity={dim(layer.id)} style={{ transition: "opacity 0.25s ease" }}>
                <rect
                  x="306"
                  y={layer.y}
                  width="58"
                  height="29"
                  fill={layer.fill}
                  stroke={stroke(layer.id)}
                  strokeWidth={width(layer.id, 1.2)}
                />
                <path
                  d={`M364 ${layer.y + 14.5} H374`}
                  stroke="var(--color-line-strong)"
                  strokeWidth="1"
                />
              </g>
              {bubble(layer.id, layerIndex + 2, 386, layer.y + 14.5)}
            </g>
          ))}

          {/* 6 — fill line */}
          <g opacity={dim("fill")} style={{ transition: "opacity 0.25s ease" }}>
            <path
              d="M152 150 H248"
              stroke={stroke("fill")}
              strokeWidth={width("fill", 1.4)}
              strokeDasharray="7 4"
            />
            <path d="M68 150 H139" stroke="var(--color-line-strong)" strokeWidth="1" />
          </g>
          {bubble("fill", 5, 68, 150)}

          {/* 7 — standing gusset */}
          <g opacity={dim("gusset")} style={{ transition: "opacity 0.25s ease" }}>
            <path
              d="M150 248 H250"
              stroke={stroke("gusset")}
              strokeWidth={width("gusset", 1.4)}
              strokeDasharray="5 4"
            />
            <path
              d="M150 248 L266 276 M134 276 L150 248"
              stroke={stroke("gusset")}
              strokeWidth={width("gusset", 1.4)}
              opacity={hot("gusset") ? 1 : 0}
              style={{ transition: "opacity 0.25s ease" }}
            />
            <path d="M68 262 H137" stroke="var(--color-line-strong)" strokeWidth="1" />
          </g>
          {bubble("gusset", 6, 68, 262)}

          <text
            x="200"
            y="306"
            textAnchor="middle"
            fontSize="9"
            letterSpacing="2"
            fill="var(--color-fg-subtle)"
            style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
          >
            CROSS-SECTION · NOT TO SCALE
          </text>
        </svg>
      </div>

      <ol className="min-w-0 divide-y divide-line border-t border-line">
        {parts.map((part, index) => (
          <li key={part.id}>
            <button
              type="button"
              onMouseEnter={() => setActive(part.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(part.id)}
              onBlur={() => setActive(null)}
              onClick={() => setActive((current) => (current === part.id ? null : part.id))}
              aria-pressed={active === part.id}
              className="group flex min-h-11 w-full items-start gap-4 py-4 text-left"
            >
              <span
                className={cn(
                  "num mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-[0.65rem] font-bold transition-colors",
                  active === part.id
                    ? "border-ember bg-ember text-white"
                    : "border-line-strong text-fg-muted group-hover:border-ink group-hover:text-ink",
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.9375rem] font-semibold tracking-tight text-ink">
                    {part.label}
                  </span>
                  {part.pending ? (
                    <span className="kicker rounded-full border border-line-strong/70 px-2 py-1 text-[0.55rem] text-fg-subtle">
                      Spec pending
                    </span>
                  ) : null}
                </span>
                <span className="mt-1.5 block max-w-prose text-[0.875rem] leading-relaxed text-fg-muted">
                  {part.note}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
