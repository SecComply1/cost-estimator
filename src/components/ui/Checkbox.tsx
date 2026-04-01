"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, onChange, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "flex items-start gap-3 cursor-pointer group",
          className
        )}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
              checked
                ? "bg-[#00E5A0] border-[#00E5A0]"
                : "bg-transparent border-[#1E293B] group-hover:border-[#00E5A0]"
            )}
          >
            {checked && <Check className="w-3 h-3 text-[#0A0E17]" strokeWidth={3} />}
          </div>
        </div>
        {(label || description) && (
          <div>
            {label && (
              <span className="block text-sm font-medium text-[#F1F5F9] group-hover:text-[#00E5A0] transition-colors">
                {label}
              </span>
            )}
            {description && (
              <span className="block text-xs text-[#94A3B8] mt-0.5">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
