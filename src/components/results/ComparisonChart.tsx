"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { EstimatorOutput } from "@/types";
import { formatCompactNumber } from "@/lib/utils";

interface ComparisonChartProps {
  comparison: EstimatorOutput["comparison"];
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-3 shadow-xl">
        <p className="text-sm font-semibold text-[#F1F5F9] mb-1">{label}</p>
        <p className="font-jetbrains text-[#00E5A0] font-bold">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

const ComparisonChart = ({ comparison }: ComparisonChartProps) => {
  const data = [
    {
      name: "DIY / In-House",
      value: comparison.diyEstimate,
      color: "#EF4444",
    },
    {
      name: "Big Four",
      value: comparison.bigFourEstimate,
      color: "#F59E0B",
    },
    {
      name: "Boutique Firm",
      value: comparison.boutiqueFirmEstimate,
      color: "#3B82F6",
    },
    {
      name: "SecComply",
      value: comparison.seccomplyEstimate,
      color: "#00E5A0",
    },
  ];

  const savings = comparison.boutiqueFirmEstimate - comparison.seccomplyEstimate;
  const savingsPct = Math.round((savings / comparison.boutiqueFirmEstimate) * 100);

  return (
    <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6">
      <div className="mb-6">
        <h3 className="font-jetbrains text-xl font-bold text-[#F1F5F9] mb-1">
          Competitive Positioning
        </h3>
        <p className="text-sm text-[#94A3B8]">
          See how SecComply compares to other compliance approaches
        </p>
      </div>

      <div className="h-64 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickFormatter={(v) => `₹${formatCompactNumber(v)}`}
              axisLine={{ stroke: "#1E293B" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              width={110}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  fillOpacity={entry.name === "SecComply" ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1E293B]">
        <div>
          <p className="text-xs text-[#94A3B8] mb-1">vs Boutique Firms</p>
          <p className="font-jetbrains font-bold text-[#00E5A0] text-lg">
            {savingsPct}% lower
          </p>
        </div>
        <div>
          <p className="text-xs text-[#94A3B8] mb-1">vs Big Four</p>
          <p className="font-jetbrains font-bold text-[#00E5A0] text-lg">
            {Math.round(((comparison.bigFourEstimate - comparison.seccomplyEstimate) / comparison.bigFourEstimate) * 100)}% lower
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#475569] italic">
        Use these figures as talking points — not for client-facing materials
      </p>
    </div>
  );
};

export default ComparisonChart;
