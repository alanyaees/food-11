import Link from "next/link";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * The lockup. Reads the name from `brand` so a rename propagates
 * everywhere, and typesets the final stop as a separate accent element.
 */
export function Wordmark({
  className,
  dotClassName,
  as = "span",
}: {
  className?: string;
  dotClassName?: string;
  as?: "span" | "div";
}) {
  const Tag = as;
  const hasStop = brand.name.endsWith(".");
  const stem = hasStop ? brand.name.slice(0, -1) : brand.name;

  return (
    <Tag
      className={cn(
        "font-display text-[1.375rem] leading-none font-extrabold tracking-[-0.06em] uppercase",
        className,
      )}
    >
      {stem}
      {hasStop ? (
        <span className={cn("text-ember", dotClassName)} aria-hidden>
          .
        </span>
      ) : null}
      <span className="sr-only">{hasStop ? "." : ""}</span>
    </Tag>
  );
}

export function WordmarkLink({
  className,
  dotClassName,
  onClick,
}: {
  className?: string;
  dotClassName?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${brand.nameBare} — home`}
      className="press -m-2 inline-flex rounded-md p-2"
    >
      <Wordmark className={className} dotClassName={dotClassName} />
    </Link>
  );
}
