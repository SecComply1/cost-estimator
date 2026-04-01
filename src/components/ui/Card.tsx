"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glowColor?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow, glowColor = "rgba(0,229,160,0.1)", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#111827] border border-[#1E293B] rounded-xl p-6",
          glow && "shadow-lg",
          className
        )}
        style={glow ? { boxShadow: `0 0 30px ${glowColor}` } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("font-jetbrains text-lg font-semibold text-[#F1F5F9]", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

export default Card;
