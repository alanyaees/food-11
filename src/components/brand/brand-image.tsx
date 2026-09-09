import Image from "next/image";
import { getAsset } from "@/lib/assets";
import { accentVars } from "@/lib/accents";
import type { FlavorAccent } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Renders generated photography when it exists in the asset manifest,
 * and a designed CSS fallback when it does not. No layout ever depends
 * on an image being present.
 */
export function BrandImage({
  assetKey,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
  accent = "cheddar",
  fallbackLabel,
  quality = 82,
}: {
  assetKey?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  accent?: FlavorAccent;
  fallbackLabel?: string;
  quality?: number;
}) {
  const asset = getAsset(assetKey);

  if (!asset) {
    return (
      <div className={cn("relative overflow-hidden bg-bone-200", className)}>
        <BowlFallback accent={accent} label={fallbackLabel} />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-bone-200", className)}>
      <Image
        src={asset.path}
        alt={alt ?? asset.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={quality}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}

/**
 * CSS-drawn bowl of food: warm gradient, sauce rings, steam. Used when
 * generated photography is unavailable so nothing looks unfinished.
 */
export function BowlFallback({
  accent = "cheddar",
  label,
  className,
}: {
  accent?: FlavorAccent;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 grid place-items-center bg-[radial-gradient(120%_100%_at_50%_0%,#f6f1e6_0%,#e6ddc9_55%,#d6cbb2_100%)]",
        className,
      )}
      style={accentVars(accent)}
      aria-hidden
    >
      <div className="relative aspect-square w-[62%] max-w-[22rem]">
        <div className="absolute inset-0 rounded-full bg-[linear-gradient(165deg,#2b2b2e,#111113)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]" />
        <div
          className="absolute inset-[9%] rounded-full opacity-95"
          style={{
            background:
              "radial-gradient(70% 70% at 35% 28%, color-mix(in oklab, var(--accent) 82%, white) 0%, var(--accent) 45%, color-mix(in oklab, var(--accent) 72%, black) 100%)",
          }}
        />
        <div className="absolute inset-[9%] rounded-full bg-[repeating-radial-gradient(circle_at_38%_32%,rgba(255,255,255,0.16)_0_6px,rgba(0,0,0,0.05)_6px_13px)] opacity-45 mix-blend-soft-light" />
        <div className="absolute inset-[9%] rounded-full bg-[radial-gradient(60%_45%_at_30%_22%,rgba(255,255,255,0.5),transparent_60%)]" />
        <div className="absolute inset-x-[26%] -top-[16%] h-[30%] animate-steam rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7),transparent_70%)] blur-md" />
      </div>
      {label ? (
        <span className="kicker absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/85 px-3 py-1.5 text-on-ink">
          {label}
        </span>
      ) : null}
    </div>
  );
}
