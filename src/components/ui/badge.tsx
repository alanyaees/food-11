import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "kicker inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 leading-none",
  {
    variants: {
      tone: {
        neutral: "border-line-strong/70 bg-bone-100/70 text-fg-muted",
        ink: "border-transparent bg-ink text-on-ink",
        inverse: "border-white/20 bg-white/10 text-on-ink",
        accent:
          "border-[color-mix(in_oklab,var(--accent,#ff4a1c)_40%,transparent)] bg-[var(--accent-soft,#fff5ef)] text-[var(--accent-ink,#0e0e0c)]",
        ember: "border-ember/30 bg-ember-100 text-ember-600",
        outline: "border-ink/20 bg-transparent text-ink",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
