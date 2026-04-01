"use client";

import { motion } from "framer-motion";
import { Calendar, Shield, Award, BadgeDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { EngagementPeriod, AuditFirmTier } from "@/types";

interface EngagementOptionsProps {
  engagementPeriod: EngagementPeriod | null;
  auditFirmTier: AuditFirmTier | null;
  onPeriodChange: (period: EngagementPeriod) => void;
  onAuditFirmChange: (tier: AuditFirmTier) => void;
}

const PERIOD_OPTIONS: {
  id: EngagementPeriod;
  label: string;
  badge: string;
  description: string;
  detail1: string;
  detail2: string;
}[] = [
  {
    id: "1_year",
    label: "1-Year Engagement",
    badge: "Standard",
    description: "Single-year project from kick-off through certification. Best for organisations targeting a specific certification within a defined window.",
    detail1: "One-time project cost",
    detail2: "Certification + audit in a single year",
  },
  {
    id: "3_year",
    label: "3-Year Engagement",
    badge: "Total contract value",
    description: "Multi-year commitment covering initial certification, surveillance audits, and ongoing programme management. Pricing reflects the full 3-year contract value.",
    detail1: "Covers certification + 2 years of maintenance",
    detail2: "Includes surveillance audits & continuous improvement",
  },
];

const AUDIT_FIRM_OPTIONS: {
  id: AuditFirmTier;
  label: string;
  badge: string;
  badgeColor: string;
  description: string;
  examples: string;
  multiplierLabel: string;
  icon: React.ElementType;
}[] = [
  {
    id: "standard",
    label: "Standard / Regional",
    badge: "Baseline",
    badgeColor: "text-[#94A3B8] border-[#334155]",
    description: "Independent assessors and regional CPA firms. Cost-effective for startups and SMBs seeking their first certification.",
    examples: "Local CPA firms, independent ISMS auditors, accredited CBs",
    multiplierLabel: "1.0× audit cost",
    icon: Shield,
  },
  {
    id: "boutique",
    label: "Boutique Cybersecurity Firm",
    badge: "1.8× audit cost",
    badgeColor: "text-[#3B82F6] border-[#3B82F6]/40",
    description: "Specialised cybersecurity and compliance firms with deep domain expertise. Preferred by tech companies and regulated industries.",
    examples: "Coalfire, Schellman, Tevora, A-LIGN",
    multiplierLabel: "1.8× audit cost",
    icon: BadgeDollarSign,
  },
  {
    id: "big_four",
    label: "Big Four Firm",
    badge: "3.5× audit cost",
    badgeColor: "text-[#F59E0B] border-[#F59E0B]/40",
    description: "Deloitte, PwC, EY, or KPMG. Enterprise-grade credibility; required by some large enterprise clients and public companies.",
    examples: "Deloitte, PwC, EY, KPMG",
    multiplierLabel: "3.5× audit cost",
    icon: Award,
  },
];

export default function EngagementOptions({
  engagementPeriod,
  auditFirmTier,
  onPeriodChange,
  onAuditFirmChange,
}: EngagementOptionsProps) {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="font-jetbrains text-2xl font-bold text-[#F1F5F9] mb-2">
          Engagement Options
        </h2>
        <p className="text-[#94A3B8] text-sm">
          Select your engagement length and preferred audit partner. These choices directly affect the external audit cost in your estimate.
        </p>
      </div>

      {/* Engagement Period */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#00E5A0]" />
          <h3 className="font-jetbrains font-semibold text-[#F1F5F9] text-sm uppercase tracking-wider">
            Engagement Period
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PERIOD_OPTIONS.map((opt) => {
            const isSelected = engagementPeriod === opt.id;
            return (
              <motion.button
                key={opt.id}
                onClick={() => onPeriodChange(opt.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "relative text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border-[#00E5A0]/60 bg-[#00E5A0]/5 shadow-[0_0_20px_rgba(0,229,160,0.1)]"
                    : "border-[#1E293B] bg-[#111827] hover:border-[#334155]"
                )}
              >
                {/* Selection indicator */}
                <div className={cn(
                  "absolute top-4 right-4 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  isSelected ? "border-[#00E5A0] bg-[#00E5A0]" : "border-[#334155]"
                )}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0A0E17]" />}
                </div>

                <div className="pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-jetbrains font-bold text-[#F1F5F9] text-sm">{opt.label}</span>
                  </div>
                  <span className={cn(
                    "inline-block text-xs font-semibold px-2 py-0.5 rounded-full border mb-3",
                    isSelected
                      ? "text-[#00E5A0] border-[#00E5A0]/40 bg-[#00E5A0]/10"
                      : "text-[#94A3B8] border-[#334155] bg-[#1E293B]"
                  )}>
                    {opt.badge}
                  </span>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">{opt.description}</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]/60" />
                      {opt.detail1}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]/60" />
                      {opt.detail2}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Audit Firm Tier */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-[#00E5A0]" />
          <h3 className="font-jetbrains font-semibold text-[#F1F5F9] text-sm uppercase tracking-wider">
            Preferred Audit Partner
          </h3>
        </div>
        <p className="text-xs text-[#64748B] mb-4">
          The audit firm tier is applied only to the External Audit / Certification cost bucket. Delivery and platform costs are unaffected.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {AUDIT_FIRM_OPTIONS.map((opt) => {
            const isSelected = auditFirmTier === opt.id;
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.id}
                onClick={() => onAuditFirmChange(opt.id)}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                className={cn(
                  "relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border-[#00E5A0]/60 bg-[#00E5A0]/5 shadow-[0_0_20px_rgba(0,229,160,0.08)]"
                    : "border-[#1E293B] bg-[#111827] hover:border-[#334155]"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-[#00E5A0]/15" : "bg-[#1E293B]"
                  )}>
                    <Icon className={cn("w-4 h-4", isSelected ? "text-[#00E5A0]" : "text-[#64748B]")} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-jetbrains font-bold text-[#F1F5F9] text-sm">{opt.label}</span>
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full border",
                        isSelected ? "text-[#00E5A0] border-[#00E5A0]/40 bg-[#00E5A0]/10" : opt.badgeColor
                      )}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-1.5">{opt.description}</p>
                    <p className="text-xs text-[#475569]">e.g. {opt.examples}</p>
                  </div>

                  {/* Radio */}
                  <div className={cn(
                    "flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5",
                    isSelected ? "border-[#00E5A0] bg-[#00E5A0]" : "border-[#334155]"
                  )}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0A0E17]" />}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
