"use client";

import { motion } from "framer-motion";
import { ComplexityLevel } from "@/types";
import { cn } from "@/lib/utils";

interface EngagementComplexityProps {
  value: ComplexityLevel | null;
  onChange: (v: ComplexityLevel) => void;
}

const COMPLEXITY_OPTIONS: {
  id: ComplexityLevel;
  title: string;
  description: string;
  multiplier: string;
  badgeColor: string;
  badgeText: string;
  badgeBg: string;
}[] = [
  {
    id: "low",
    title: "Simple",
    description:
      "Small digital footprint, single location, straightforward IT setup, minimal sensitive data. Typical: early-stage startups, small businesses.",
    multiplier: "0.75x delivery",
    badgeColor: "#00E5A0",
    badgeText: "Low",
    badgeBg: "rgba(0,229,160,0.1)",
  },
  {
    id: "medium",
    title: "Moderate",
    description:
      "Some cloud infrastructure, a few business-critical apps, standard data handling. Typical: growing SaaS companies, mid-size firms with basic IT.",
    multiplier: "1.00x baseline",
    badgeColor: "#3B82F6",
    badgeText: "Medium",
    badgeBg: "rgba(59,130,246,0.1)",
  },
  {
    id: "high",
    title: "Complex",
    description:
      "Multi-cloud or hybrid setup, multiple business units/locations, handles sensitive/regulated data, has integrations with third-party systems. Typical: enterprises, financial services, healthcare.",
    multiplier: "1.30x delivery",
    badgeColor: "#F59E0B",
    badgeText: "High",
    badgeBg: "rgba(245,158,11,0.1)",
  },
  {
    id: "very_high",
    title: "Highly Complex",
    description:
      "Large-scale distributed infrastructure, multiple geographies, heavily regulated data (PCI, PHI, financial), complex vendor ecosystem, OT/ICS environments. Typical: large banks, critical infra, multinational corps.",
    multiplier: "1.60x delivery",
    badgeColor: "#EF4444",
    badgeText: "Very High",
    badgeBg: "rgba(239,68,68,0.1)",
  },
];

const EngagementComplexity = ({ value, onChange }: EngagementComplexityProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-jetbrains text-2xl font-bold text-[#F1F5F9] mb-2">
          Engagement Complexity
        </h2>
        <p className="text-[#94A3B8] text-sm">
          Select the complexity level that best describes the prospect&apos;s environment. This
          determines the effort multiplier applied to the base estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {COMPLEXITY_OPTIONS.map((option, idx) => {
          const isSelected = value === option.id;
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              onClick={() => onChange(option.id)}
              className={cn(
                "w-full text-left p-5 rounded-xl border-2 transition-all duration-200",
                isSelected
                  ? "border-[#00E5A0] shadow-[0_0_20px_rgba(0,229,160,0.3)] bg-[#111827]"
                  : "border-[#1E293B] bg-[#111827] hover:border-[#334155]"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Radio dot */}
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                        isSelected
                          ? "border-[#00E5A0]"
                          : "border-[#334155]"
                      )}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-[#00E5A0]" />
                      )}
                    </div>

                    {/* Level badge */}
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full font-jetbrains"
                      style={{
                        color: option.badgeColor,
                        backgroundColor: option.badgeBg,
                        border: `1px solid ${option.badgeColor}40`,
                      }}
                    >
                      {option.badgeText}
                    </span>

                    {/* Title */}
                    <span className="font-jetbrains font-bold text-[#F1F5F9] text-base">
                      {option.title}
                    </span>
                  </div>

                  <p className="text-sm text-[#94A3B8] ml-7 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* Multiplier hint */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#475569] mb-0.5">Cost multiplier</p>
                  <p
                    className="font-jetbrains font-bold text-lg"
                    style={{ color: option.badgeColor }}
                  >
                    {option.multiplier}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {!value && (
        <p className="text-xs text-[#F59E0B]">
          Please select a complexity level to continue.
        </p>
      )}
    </div>
  );
};

export default EngagementComplexity;
