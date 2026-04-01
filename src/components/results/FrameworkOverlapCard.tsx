"use client";

import { motion } from "framer-motion";
import { Layers, TrendingDown } from "lucide-react";
import { EstimatorOutput } from "@/types";
import Badge from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";

interface FrameworkOverlapCardProps {
  output: EstimatorOutput;
}

const FrameworkOverlapCard = ({ output }: FrameworkOverlapCardProps) => {
  const discountedFrameworks = output.frameworkBreakdown.filter(
    (fw) => fw.overlapDiscount > 0
  );

  if (output.frameworkBreakdown.length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-[#111827] to-[#0D1B2A] border border-[#00E5A0]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(0,229,160,0.1)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-[#00E5A0]" />
        <h3 className="font-jetbrains text-lg font-bold text-[#F1F5F9]">
          Multi-Framework Overlap Savings
        </h3>
      </div>

      <p className="text-sm text-[#94A3B8] mb-5">
        When implementing multiple frameworks, overlapping policy and implementation work
        is shared — reducing your total cost significantly.
      </p>

      {/* Total savings highlight */}
      <div className="flex items-center gap-4 p-4 bg-[#00E5A0]/5 border border-[#00E5A0]/20 rounded-xl mb-5">
        <TrendingDown className="w-8 h-8 text-[#00E5A0]" />
        <div>
          <p className="text-sm text-[#94A3B8]">Total Overlap Savings</p>
          <p className="font-jetbrains text-2xl font-bold text-[#00E5A0]">
            {formatINR(output.overlapSavings)}
          </p>
        </div>
      </div>

      {/* Per-framework discounts */}
      {discountedFrameworks.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide">
            Frameworks with overlap discounts
          </p>
          {discountedFrameworks.map((fw) => (
            <div
              key={fw.frameworkId}
              className="flex items-center justify-between p-3 bg-[#0A0E17] rounded-lg border border-[#1E293B]"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#F1F5F9]">{fw.frameworkName}</span>
                <Badge variant="success" size="sm">
                  {Math.round(fw.overlapDiscount * 100)}% off policies & implementation
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-[#94A3B8]">
            Add more frameworks to unlock overlap discounts
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#1E293B]">
        <p className="text-xs text-[#94A3B8]">
          Bundle discounts apply to Delivery and External Audit costs only (Tool cost: 25% off 2nd framework, 35% off 3rd+).
          The most expensive framework is always priced at full rate; subsequent frameworks receive
          bundle discounts based on the SecComply pricing template.
        </p>
      </div>
    </motion.div>
  );
};

export default FrameworkOverlapCard;
