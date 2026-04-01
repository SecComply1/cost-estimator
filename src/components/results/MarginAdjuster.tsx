"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sliders } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface MarginAdjusterProps {
  baseCostLow: number;
  baseCostMid: number;
  baseCostHigh: number;
  onAdjustmentChange: (adjustment: {
    margin: number;
    discount: number;
    finalQuoteMid: number;
    finalQuoteLow: number;
    finalQuoteHigh: number;
  }) => void;
}

const MarginAdjuster = ({
  baseCostLow,
  baseCostMid,
  baseCostHigh,
  onAdjustmentChange,
}: MarginAdjusterProps) => {
  const [margin, setMargin] = useState(20);
  const [discount, setDiscount] = useState(0);

  const afterMarginMid = Math.round(baseCostMid * (1 + margin / 100));
  const marginAmountMid = afterMarginMid - baseCostMid;
  const discountAmountMid = Math.round(afterMarginMid * (discount / 100));
  const finalQuoteMid = Math.round(afterMarginMid * (1 - discount / 100));

  const finalQuoteLow = Math.round(baseCostLow * (1 + margin / 100) * (1 - discount / 100));
  const finalQuoteHigh = Math.round(baseCostHigh * (1 + margin / 100) * (1 - discount / 100));

  useEffect(() => {
    onAdjustmentChange({ margin, discount, finalQuoteMid, finalQuoteLow, finalQuoteHigh });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [margin, discount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-[#111827] border border-[#1E293B] rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="w-5 h-5 text-[#00E5A0]" />
        <h3 className="font-jetbrains text-lg font-bold text-[#F1F5F9]">
          Margin &amp; Discount Adjustment
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Margin slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-[#F1F5F9]">
              SecComply Margin %
            </label>
            <span className="font-jetbrains font-bold text-[#00E5A0] text-lg">{margin}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            step={1}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full h-2 bg-[#1E293B] rounded-full appearance-none cursor-pointer accent-[#00E5A0]"
          />
          <div className="flex justify-between text-xs text-[#475569] mt-1">
            <span>0%</span>
            <span>20%</span>
            <span>40%</span>
          </div>
        </div>

        {/* Discount slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-[#F1F5F9]">
              Client Discount %
            </label>
            <span className="font-jetbrains font-bold text-[#F59E0B] text-lg">{discount}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full h-2 bg-[#1E293B] rounded-full appearance-none cursor-pointer accent-[#F59E0B]"
          />
          <div className="flex justify-between text-xs text-[#475569] mt-1">
            <span>0%</span>
            <span>15%</span>
            <span>30%</span>
          </div>
        </div>
      </div>

      {/* Waterfall */}
      <div className="bg-[#0A0E17] rounded-xl p-5 space-y-2 font-jetbrains text-sm mb-4">
        <div className="flex justify-between items-center text-[#94A3B8]">
          <span>Base Estimate</span>
          <span className="text-[#F1F5F9]">{formatINR(baseCostMid)}</span>
        </div>
        <div className="flex justify-between items-center text-[#94A3B8]">
          <span>+ Margin ({margin}%)</span>
          <span className="text-[#00E5A0]">+ {formatINR(marginAmountMid)}</span>
        </div>
        <div className="flex justify-between items-center text-[#94A3B8] border-t border-[#1E293B] pt-2">
          <span>After Margin</span>
          <span className="text-[#F1F5F9]">{formatINR(afterMarginMid)}</span>
        </div>
        <div className="flex justify-between items-center text-[#94A3B8]">
          <span>- Discount ({discount}%)</span>
          <span className="text-[#EF4444]">- {formatINR(discountAmountMid)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-[#334155] pt-3 mt-2">
          <span className="font-bold text-[#F1F5F9] text-base">Final Quote</span>
          <span
            className="font-bold text-xl text-[#00E5A0] shadow-[0_0_10px_rgba(0,229,160,0.4)]"
          >
            {formatINR(finalQuoteMid)}
          </span>
        </div>
      </div>

      {/* Range */}
      <div className="p-4 bg-[#00E5A0]/5 border border-[#00E5A0]/20 rounded-xl">
        <p className="text-xs text-[#94A3B8] mb-1 font-semibold uppercase tracking-wider">
          Final Quote Range
        </p>
        <p className="font-jetbrains font-bold text-[#F1F5F9] text-base">
          {formatINR(finalQuoteLow)}{" "}
          <span className="text-[#475569]">—</span>{" "}
          {formatINR(finalQuoteHigh)}
        </p>
        <p className="text-xs text-[#475569] mt-1">
          After {margin}% margin and {discount}% client discount applied
        </p>
      </div>
    </motion.div>
  );
};

export default MarginAdjuster;
