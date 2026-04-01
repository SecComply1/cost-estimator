"use client";

import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const RadioGroup = ({
  name,
  options,
  value,
  onChange,
  label,
  className,
  orientation = "vertical",
}: RadioGroupProps) => {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-[#94A3B8] mb-2">
          {label}
        </label>
      )}
      <div
        className={cn(
          "gap-2",
          orientation === "horizontal" ? "flex flex-wrap" : "flex flex-col"
        )}
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
              value === opt.value
                ? "border-[#00E5A0] bg-[#00E5A0]/10"
                : "border-[#1E293B] hover:border-[#00E5A0]/50"
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                value === opt.value
                  ? "border-[#00E5A0]"
                  : "border-[#1E293B]"
              )}
            >
              {value === opt.value && (
                <div className="w-2 h-2 rounded-full bg-[#00E5A0]" />
              )}
            </div>
            <div>
              <span className="block text-sm font-medium text-[#F1F5F9]">
                {opt.label}
              </span>
              {opt.description && (
                <span className="block text-xs text-[#94A3B8] mt-0.5">
                  {opt.description}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
