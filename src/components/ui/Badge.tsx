"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
}

const Badge = ({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) => {
  const variants = {
    default: "bg-[#1E293B] text-[#94A3B8] border border-[#334155]",
    success: "bg-[#00E5A0]/10 text-[#00E5A0] border border-[#00E5A0]/30",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30",
    error: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30",
    info: "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30",
    outline: "bg-transparent text-[#F1F5F9] border border-[#1E293B]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
