import { cn } from "@/lib/utils";

/**
 * Legacy export kept so call sites compile cleanly. The live storefront
 * no longer surfaces concept/demo nutrition badges.
 */
export function ConceptBadge(_props: {
  className?: string;
  tone?: "neutral" | "inverse" | "outline";
  label?: string;
  detail?: string;
}) {
  return null;
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
