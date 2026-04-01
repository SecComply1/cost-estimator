"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { FrameworkCostBreakdown } from "@/types";
import Badge from "@/components/ui/Badge";
import Tooltip from "@/components/ui/Tooltip";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CostBreakdownProps {
  breakdown: FrameworkCostBreakdown[];
}

const LINE_ITEM_KEYS: (keyof Omit<FrameworkCostBreakdown, "frameworkId" | "frameworkName" | "subtotalLow" | "subtotalHigh" | "overlapDiscount">)[] = [
  "toolCost",
  "deliveryCost",
  "externalAudit",
];

const CostBreakdown = ({ breakdown }: CostBreakdownProps) => {
  const [expanded, setExpanded] = useState<string | null>(breakdown[0]?.frameworkId ?? null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-jetbrains text-xl font-bold text-[#F1F5F9]">
          Framework Cost Breakdown
        </h3>
        <Tooltip content="Hover on each line item for details">
          <Info className="w-4 h-4 text-[#94A3B8] cursor-help" />
        </Tooltip>
      </div>

      {breakdown.map((fw, index) => (
        <motion.div
          key={fw.frameworkId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#111827] border border-[#1E293B] rounded-xl overflow-hidden"
        >
          <button
            onClick={() =>
              setExpanded(expanded === fw.frameworkId ? null : fw.frameworkId)
            }
            className="w-full flex items-center justify-between p-5 hover:bg-[#1E293B]/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-jetbrains font-bold text-[#F1F5F9]">
                {fw.frameworkName}
              </span>
              {fw.overlapDiscount > 0 && (
                <Badge variant="success" size="sm">
                  {Math.round(fw.overlapDiscount * 100)}% overlap discount
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-jetbrains font-bold text-[#00E5A0] text-lg">
                  {formatINR(Math.round((fw.subtotalLow + fw.subtotalHigh) / 2))}
                </p>
                <p className="text-xs text-[#94A3B8]">
                  {formatINR(fw.subtotalLow)} – {formatINR(fw.subtotalHigh)}
                </p>
              </div>
              <motion.div
                animate={{ rotate: expanded === fw.frameworkId ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-[#94A3B8]" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {expanded === fw.frameworkId && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-[#1E293B] p-5">
                  <div className="divide-y divide-[#1E293B]">
                    {LINE_ITEM_KEYS.map((key) => {
                      const item = fw[key];
                      if (!item || typeof item !== "object" || !("costLow" in item)) return null;
                      const mid = Math.round((item.costLow + item.costHigh) / 2);
                      if (mid === 0) return null;

                      const maxCost = Math.max(
                        ...LINE_ITEM_KEYS.map((k) => {
                          const li = fw[k];
                          if (!li || typeof li !== "object" || !("costLow" in li)) return 0;
                          return Math.round((li.costLow + li.costHigh) / 2);
                        })
                      );
                      const pct = maxCost > 0 ? (mid / maxCost) * 100 : 0;

                      return (
                        <Tooltip key={key} content={item.description} position="top" className="flex w-full">
                          <div className="py-3 w-full">
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <span className="text-sm text-[#94A3B8] shrink-0 min-w-[140px]">
                                {item.label}
                              </span>
                              <div className="flex items-center gap-3 ml-auto">
                                <span className="font-jetbrains text-sm font-medium text-[#F1F5F9]">
                                  {formatINR(mid)}
                                </span>
                                <span className="text-xs text-[#475569] w-10 text-right shrink-0">
                                  ~{item.hoursEstimate}h
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-[#1E293B] rounded-full">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-[#00E5A0] to-[#3B82F6]"
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                              />
                            </div>
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1E293B] flex justify-between items-center">
                    <span className="text-sm text-[#94A3B8]">Framework Total</span>
                    <span className="font-jetbrains font-bold text-[#00E5A0]">
                      {formatINR(Math.round((fw.subtotalLow + fw.subtotalHigh) / 2))}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default CostBreakdown;
