"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full bg-[#0A0E17] border border-[#1E293B] text-[#F1F5F9] rounded-lg px-4 py-2.5 pr-10",
              "appearance-none focus:outline-none focus:border-[#00E5A0] focus:ring-1 focus:ring-[#00E5A0]",
              "transition-colors duration-200",
              error && "border-[#EF4444]",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-sm text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
