import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40",
  {
    variants: {
      variant: {
        default: "bg-forest text-cream shadow-card hover:bg-forest-light",
        whatsapp: "bg-[#25D366] text-white shadow-card hover:brightness-105",
        accent: "bg-turmeric text-ink shadow-card hover:brightness-105",
        maroon: "bg-maroon text-cream shadow-card hover:bg-maroon-dark",
        outline: "border border-cream/30 bg-cream/10 text-cream backdrop-blur-sm hover:bg-cream/20",
        ghost: "text-forest hover:bg-forest/10",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-4 py-2 text-xs",
        lg: "px-7 py-3.5 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
