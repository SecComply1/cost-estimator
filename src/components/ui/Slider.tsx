"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  displayValue?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, displayValue, min = 0, max = 100, value, ...props }, ref) => {
    const pct = ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
      <div className="w-full">
        {label && (
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[#94A3B8]">{label}</label>
            {displayValue && (
              <span className="font-jetbrains text-sm text-[#00E5A0] font-semibold">
                {displayValue}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            value={value}
            className={cn(
              "w-full h-2 rounded-full appearance-none cursor-pointer",
              "bg-[#1E293B]",
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
              "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00E5A0]",
              "[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,229,160,0.5)]",
              "[&::-webkit-slider-thumb]:cursor-pointer",
              className
            )}
            style={{
              background: `linear-gradient(to right, #00E5A0 ${pct}%, #1E293B ${pct}%)`,
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";
export default Slider;
