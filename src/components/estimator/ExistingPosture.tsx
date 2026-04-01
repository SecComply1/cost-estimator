"use client";

import { motion } from "framer-motion";
import { Shield, Award, CalendarCheck, TrendingUp } from "lucide-react";
import { EstimatorInput, FrameworkId } from "@/types";
import Checkbox from "@/components/ui/Checkbox";
import RadioGroup from "@/components/ui/RadioGroup";
import Badge from "@/components/ui/Badge";
import { computePostureScore } from "@/lib/pricing-engine";
import frameworksData from "@/config/frameworks.json";

interface ExistingPostureProps {
  formData: Partial<EstimatorInput>;
  onChange: (data: Partial<EstimatorInput>) => void;
  onToggleCertification: (fw: FrameworkId) => void;
}

const ExistingPosture = ({ formData, onChange, onToggleCertification }: ExistingPostureProps) => {
  const safeFormData: EstimatorInput = {
    selectedFrameworks: formData.selectedFrameworks ?? [],
    industry: formData.industry ?? "saas_technology",
    teamSize: formData.teamSize ?? "51-200",
    country: formData.country ?? "IN",
    annualRevenue: formData.annualRevenue ?? "10m_50m",
    engagementComplexity: formData.engagementComplexity ?? "medium",
    existingPosture: formData.existingPosture ?? "none",
    existingCertifications: formData.existingCertifications ?? [],
    hasSecurityTeam: formData.hasSecurityTeam ?? false,
    lastAuditDate: formData.lastAuditDate ?? "never",
    engagementPeriod: formData.engagementPeriod ?? "1_year",
    auditFirmTier: formData.auditFirmTier ?? "standard",
  };

  const { score, level, deliveryDiscount: discountRate } = computePostureScore(safeFormData);

  const gaugeColor =
    level === "none" ? "#EF4444" :
    level === "basic" ? "#F59E0B" :
    level === "moderate" ? "#3B82F6" :
    "#00E5A0";

  const levelLabels = {
    none: "No Security Posture",
    basic: "Basic Security Posture",
    moderate: "Moderate Security Posture",
    advanced: "Advanced Security Posture",
  };

  const auditDateOptions = [
    { value: "never", label: "Never audited", description: "No prior security assessments" },
    { value: "over_2_years", label: "Over 2 years ago", description: "Audit documentation likely outdated" },
    { value: "1_2_years", label: "1–2 years ago", description: "Partial controls still applicable" },
    { value: "within_1_year", label: "Within the last year", description: "Recent audit, many controls current" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-jetbrains text-2xl font-bold text-[#F1F5F9] mb-2">
          Existing Security Posture
        </h2>
        <p className="text-[#94A3B8] text-sm">
          The prospect&apos;s current security maturity level determines how much work is already done,
          reducing implementation costs.
        </p>
      </div>

      {/* Live Readiness Gauge */}
      <motion.div
        layout
        className="p-5 bg-[#111827] border rounded-xl"
        style={{ borderColor: gaugeColor + "40" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: gaugeColor }} />
            <span className="font-jetbrains font-semibold text-[#F1F5F9]">
              Security Readiness Score
            </span>
          </div>
          <div className="text-right">
            <span
              className="font-jetbrains text-2xl font-bold"
              style={{ color: gaugeColor }}
            >
              {score}
            </span>
            <span className="text-[#94A3B8] text-sm ml-1">/ 100</span>
          </div>
        </div>

        <div className="w-full h-3 bg-[#1E293B] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: gaugeColor }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span style={{ color: gaugeColor }} className="font-semibold">
            {levelLabels[level]}
          </span>
          {discountRate > 0 ? (
            <Badge variant="success" size="sm">
              {Math.round(discountRate * 100)}% cost reduction
            </Badge>
          ) : (
            <span className="text-[#94A3B8]">No discount</span>
          )}
        </div>
      </motion.div>

      {/* Security Team */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#F1F5F9] mb-3">
          <Shield className="w-4 h-4 text-[#00E5A0]" />
          Security Team
        </h3>
        <div className="space-y-2">
          <Checkbox
            id="security-team"
            checked={formData.hasSecurityTeam ?? false}
            onChange={(e) => onChange({ hasSecurityTeam: e.target.checked })}
            label="The prospect has a dedicated security team"
            description="In-house security professionals handling policies, incidents, and audits (+30 points)"
            className="p-3 bg-[#0A0E17] border border-[#1E293B] rounded-lg"
          />
        </div>
      </div>

      {/* Existing Certifications */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#F1F5F9] mb-3">
          <Award className="w-4 h-4 text-[#F59E0B]" />
          Existing Certifications
          <span className="text-xs text-[#94A3B8] font-normal">
            (up to +35 points)
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {frameworksData.frameworks.map((fw) => (
            <Checkbox
              key={fw.id}
              id={`cert-${fw.id}`}
              checked={(formData.existingCertifications ?? []).includes(fw.id as FrameworkId)}
              onChange={() => onToggleCertification(fw.id as FrameworkId)}
              label={fw.name}
              className="p-2.5 bg-[#0A0E17] border border-[#1E293B] rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Last Audit */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#F1F5F9] mb-3">
          <CalendarCheck className="w-4 h-4 text-[#3B82F6]" />
          Last Security Audit or Assessment
        </h3>
        <RadioGroup
          name="lastAuditDate"
          options={auditDateOptions}
          value={formData.lastAuditDate ?? "never"}
          onChange={(v) => onChange({ lastAuditDate: v as EstimatorInput["lastAuditDate"] })}
        />
      </div>
    </div>
  );
};

export default ExistingPosture;
