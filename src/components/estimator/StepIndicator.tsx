"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Frameworks" },
  { number: 2, label: "Org Details" },
  { number: 3, label: "Complexity" },
  { number: 4, label: "Engagement" },
  { number: 5, label: "Posture & Review" },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const StepIndicator = ({ currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1E293B]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00E5A0] to-[#3B82F6]"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {STEPS.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable = step.number < currentStep && onStepClick;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              <motion.button
                onClick={() => isClickable && onStepClick?.(step.number)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-jetbrains font-bold text-sm transition-all duration-300",
                  isCompleted &&
                    "bg-[#00E5A0] text-[#0A0E17] shadow-[0_0_15px_rgba(0,229,160,0.5)]",
                  isCurrent &&
                    "bg-[#0A0E17] border-2 border-[#00E5A0] text-[#00E5A0] shadow-[0_0_20px_rgba(0,229,160,0.4)]",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-[#111827] border border-[#1E293B] text-[#94A3B8]",
                  isClickable && "cursor-pointer hover:scale-110"
                )}
                whileHover={isClickable ? { scale: 1.1 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  step.number
                )}
              </motion.button>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block text-center max-w-[80px]",
                  isCurrent ? "text-[#00E5A0]" : isCompleted ? "text-[#94A3B8]" : "text-[#475569]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
