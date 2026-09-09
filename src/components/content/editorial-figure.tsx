import { BrandImage } from "@/components/brand/brand-image";
import { hasAsset } from "@/lib/assets";
import type { FlavorAccent } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Captioned photograph.
 *
 * Takes the asset key it wants plus a key it will settle for: the story
 * pages reference process photography that is queued for generation, so
 * until those frames exist we show a real frame from the manifest rather
 * than a placeholder, and the layout never changes when they land.
 */
export function EditorialFigure({
  assetKey,
  fallbackKey,
  alt,
  caption,
  accent = "cheddar",
  aspect = "aspect-4/3",
  sizes = "(min-width: 1024px) 46vw, 92vw",
  tone = "light",
  className,
  priority = false,
}: {
  assetKey: string;
  fallbackKey?: string;
  alt: string;
  caption?: string;
  accent?: FlavorAccent;
  aspect?: string;
  sizes?: string;
  tone?: "light" | "dark";
  className?: string;
  priority?: boolean;
}) {
  const resolved = hasAsset(assetKey) ? assetKey : (fallbackKey ?? assetKey);

  return (
    <figure className={cn("min-w-0", className)}>
      <BrandImage
        assetKey={resolved}
        alt={alt}
        accent={accent}
        sizes={sizes}
        priority={priority}
        className={cn(
          "w-full rounded-2xl shadow-[0_40px_80px_-50px_rgba(20,15,5,0.5)]",
          aspect,
        )}
      />
      {caption ? (
        <figcaption
          className={cn(
            "mt-3 text-[0.72rem] leading-relaxed",
            tone === "dark" ? "text-on-ink-muted" : "text-fg-subtle",
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
