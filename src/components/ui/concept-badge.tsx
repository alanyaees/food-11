import { Info } from "lucide-react";
import { disclaimers } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

/**
 * The site's honesty device: any figure that comes from an unfinished
 * formulation is labelled. One component, one wording, everywhere.
 */
export function ConceptBadge({
  className,
  tone = "neutral",
  label = disclaimers.conceptShort,
  detail = disclaimers.conceptLong,
}: {
  className?: string;
  tone?: "neutral" | "inverse" | "outline";
  label?: string;
  detail?: string;
}) {
  return (
    <Badge tone={tone} className={cn("gap-1.5", className)} title={detail}>
      <Info className="size-3" aria-hidden />
      <span>{label}</span>
      <span className="sr-only">— {detail}</span>
    </Badge>
  );
}

export function DisclaimerNote({
  children,
  className,
  inverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  inverse?: boolean;
}) {
  return (
    <p
      className={cn(
        "max-w-2xl text-[0.72rem] leading-relaxed",
        inverse ? "text-on-ink-muted" : "text-fg-subtle",
        className,
      )}
    >
      {children}
    </p>
  );
}
