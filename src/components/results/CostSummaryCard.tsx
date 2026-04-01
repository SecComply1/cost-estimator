"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { EstimatorOutput } from "@/types";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Badge from "@/components/ui/Badge";
import { formatINR, formatUSD, inrToUsd } from "@/lib/utils";

interface CostSummaryCardProps {
  output: EstimatorOutput;
  prospectName?: string;
}

const CostSummaryCard = ({ output, prospectName }: CostSummaryCardProps) => {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const fmt = (v: number) =>
    currency === "INR"
      ? formatINR(v)
      : formatUSD(inrToUsd(v));

  const convert = (v: number) => (currency === "INR" ? v : inrToUsd(v));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#0D1B2A] border border-[#00E5A0]/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,229,160,0.15)]"
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(#00E5A0 1px, transparent 1px), linear-gradient(90deg, #00E5A0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        {/* Prospect name if provided */}
        {prospectName && (
          <div className="mb-4">
            <span className="text-xs text-[#475569] uppercase tracking-wider font-jetbrains">Estimate for</span>
            <p className="font-jetbrains text-lg font-bold text-[#00E5A0] mt-0.5">{prospectName}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[#94A3B8] text-sm mb-1">Estimated Engagement Value</p>
            <h2 className="font-jetbrains text-3xl font-bold text-[#F1F5F9]">
              Total Cost Range
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                currency === "INR"
                  ? "bg-[#00E5A0] text-[#0A0E17]"
                  : "bg-[#1E293B] text-[#94A3B8] hover:text-[#F1F5F9]"
              }`}
            >
              INR
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                currency === "USD"
                  ? "bg-[#00E5A0] text-[#0A0E17]"
                  : "bg-[#1E293B] text-[#94A3B8] hover:text-[#F1F5F9]"
              }`}
            >
              USD
            </button>
          </div>
        </div>

        {/* Main cost display */}
        <div className="text-center mb-8">
          <div className="font-jetbrains text-5xl font-bold text-[#00E5A0] mb-2">
            <AnimatedNumber
              value={convert(output.totalCostMid)}
              formatter={fmt}
              duration={1800}
            />
          </div>
          <p className="text-[#94A3B8] text-sm">
            Estimated mid-range engagement value
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-[#94A3B8]">
            <span>Range:</span>
            <AnimatedNumber
              value={convert(output.totalCostLow)}
              formatter={fmt}
              duration={1600}
              className="text-[#F1F5F9] font-jetbrains font-medium"
            />
            <span>—</span>
            <AnimatedNumber
              value={convert(output.totalCostHigh)}
              formatter={fmt}
              duration={2000}
              className="text-[#F1F5F9] font-jetbrains font-medium"
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className={`grid gap-4 ${output.overlapSavings > 0 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"}`}>
          <div className="bg-[#0A0E17]/60 rounded-xl p-4 text-center">
            <p className="text-xs text-[#94A3B8] mb-1">Timeline</p>
            <p className="font-jetbrains text-lg font-bold text-[#3B82F6]">
              {output.timelineWeeks.low}–{output.timelineWeeks.high}
            </p>
            <p className="text-xs text-[#94A3B8]">weeks</p>
          </div>

          {output.overlapSavings > 0 && (
            <div className="bg-[#00E5A0]/5 rounded-xl p-4 text-center border border-[#00E5A0]/20">
              <p className="text-xs text-[#94A3B8] mb-1">Multi-FW Savings</p>
              <p className="font-jetbrains text-lg font-bold text-[#00E5A0]">
                <AnimatedNumber
                  value={convert(output.overlapSavings)}
                  formatter={fmt}
                  duration={1500}
                />
              </p>
              <div className="flex justify-center mt-1">
                <Badge variant="success" size="sm">
                  <TrendingDown className="w-3 h-3" />
                  Saved
                </Badge>
              </div>
            </div>
          )}

          <div className="bg-[#0A0E17]/60 rounded-xl p-4 text-center">
            <p className="text-xs text-[#94A3B8] mb-1">Complexity</p>
            <p className="font-jetbrains text-lg font-bold text-[#F59E0B]">
              {output.complexityScore}
            </p>
            <p className="text-xs text-[#94A3B8]">/ 100</p>
          </div>

          <div className="bg-[#0A0E17]/60 rounded-xl p-4 text-center">
            <p className="text-xs text-[#94A3B8] mb-1">Monthly Ongoing</p>
            <p className="font-jetbrains text-lg font-bold text-[#94A3B8]">
              <AnimatedNumber
                value={convert(output.monthlyOngoing.low)}
                formatter={fmt}
                duration={1500}
              />
            </p>
            <p className="text-xs text-[#94A3B8]">starting from</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CostSummaryCard;
