import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "press relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-tight disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary: "bg-ink text-on-ink hover:bg-ink-700",
        accent: "bg-ember text-white hover:bg-ember-600",
        inverse: "bg-bone text-ink hover:bg-white",
        outline: "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink/[0.04]",
        outlineInverse:
          "border border-white/25 bg-transparent text-on-ink hover:border-white/70 hover:bg-white/10",
        ghost: "bg-transparent text-ink hover:bg-ink/[0.06]",
        accentSoft:
          "border border-[color-mix(in_oklab,var(--accent,#ff4a1c)_45%,transparent)] bg-[var(--accent-soft,#fff5ef)] text-[var(--accent-ink,#0e0e0c)] hover:border-[var(--accent,#ff4a1c)]",
      },
      size: {
        sm: "h-9 rounded-full px-4 text-[0.8125rem]",
        md: "h-11 rounded-full px-5 text-sm",
        lg: "h-13 rounded-full px-7 text-[0.9375rem]",
        xl: "h-15 rounded-full px-9 text-base",
        icon: "size-10 rounded-full",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "className" | "children" | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ className, variant, size, block, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, block }), className);

  if (typeof props.href === "string") {
    const { href, ...rest } = props as ButtonAsLink;
    return <Link href={href} className={classes} {...rest} />;
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return <button type={type} className={classes} {...rest} />;
}

export { buttonVariants };
