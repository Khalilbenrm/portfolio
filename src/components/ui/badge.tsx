import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--accent-soft)] text-[var(--accent)]",
        outline: "border-[var(--border)] text-[var(--muted-foreground)]",
        solid: "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]",
        success: "border-transparent bg-emerald-500/10 text-emerald-500",
        warning: "border-transparent bg-amber-500/10 text-amber-500",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
