"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import { EstimatorOutput } from "@/types";
import frameworksData from "@/config/frameworks.json";

interface TimelineEstimateProps {
  output: EstimatorOutput;
}

const PHASES = [
  { label: "Gap Assessment", pct: 10 },
  { label: "Policy Development", pct: 20 },
  { label: "Implementation", pct: 35 },
  { label: "Audit Preparation", pct: 20 },
  { label: "Certification", pct: 15 },
];

const TimelineEstimate = ({ output }: TimelineEstimateProps) => {
  const totalWeeks = output.timelineWeeks.high;

  return (
    <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-[#3B82F6]" />
        <h3 className="font-jetbrains text-xl font-bold text-[#F1F5F9]">
          Implementation Timeline
        </h3>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-[#94A3B8]">Estimated duration</p>
          <p className="font-jetbrains text-3xl font-bold text-[#3B82F6]">
            {output.timelineWeeks.low}–{output.timelineWeeks.high} weeks
          </p>
          <p className="text-sm text-[#94A3B8]">
            ({Math.round(output.timelineWeeks.low / 4)}–{Math.round(output.timelineWeeks.high / 4)} months)
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#94A3B8]">Frameworks</p>
          <p className="font-jetbrains text-2xl font-bold text-[#F1F5F9]">
            {output.frameworkBreakdown.length}
          </p>
        </div>
      </div>

      {/* Timeline phases */}
      <div className="space-y-4 mb-6">
        <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide">
          Implementation Phases
        </p>
        <div className="flex gap-0 w-full h-8 rounded-lg overflow-hidden">
          {PHASES.map((phase, i) => {
            const colors = ["#00E5A0", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];
            return (
              <motion.div
                key={phase.label}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{
                  width: `${phase.pct}%`,
                  backgroundColor: colors[i],
                }}
                className="flex items-center justify-center overflow-hidden"
                title={`${phase.label}: ${Math.round((phase.pct / 100) * totalWeeks)} weeks`}
              >
                <span className="text-[10px] text-white font-bold truncate px-1">
                  {phase.pct}%
                </span>
              </motion.div>
            );
          })}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PHASES.map((phase, i) => {
            const colors = ["#00E5A0", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];
            const weeks = Math.round((phase.pct / 100) * totalWeeks);
            return (
              <div key={phase.label} className="text-center">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: colors[i] }}
                />
                <p className="text-[10px] text-[#94A3B8]">{phase.label}</p>
                <p className="font-jetbrains text-xs font-bold text-[#F1F5F9]">
                  ~{weeks}w
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-framework timelines */}
      <div className="space-y-3 pt-4 border-t border-[#1E293B]">
        <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide">
          Per-Framework Estimate
        </p>
        {output.frameworkBreakdown.map((fw, i) => (
          <div key={fw.frameworkId} className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#00E5A0] flex-shrink-0" />
            <span className="text-sm text-[#94A3B8] w-28 flex-shrink-0">{fw.frameworkName}</span>
            <div className="flex-1 h-2 bg-[#1E293B] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#00E5A0]"
                initial={{ width: 0 }}
                animate={{ width: `${(i + 1) / output.frameworkBreakdown.length * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineEstimate;
