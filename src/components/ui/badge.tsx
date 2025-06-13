import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "!text-xs inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const badgeColors = {
  default: "",
  low: "bg-[#1A3A00] text-[#4CAF50] border-[#1A3A00]",
  medium: "bg-[#453A00] text-[#FFD700] border-[#453A00]",
  high: "bg-[#4A2500] text-[#FF9800] border-[#4A2500]",
  critical: "bg-[#4A0000] text-[#FF5252] border-[#4A0000]",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  color?: keyof typeof badgeColors;
}

function Badge({ className, variant, color, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        className,
        badgeColors[color ?? "default"]
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
