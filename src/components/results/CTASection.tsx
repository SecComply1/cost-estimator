"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, RefreshCw, ClipboardCopy, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { EstimatorOutput, EstimatorInput } from "@/types";
import { formatINR } from "@/lib/utils";
import frameworksData from "@/config/frameworks.json";
import industriesData from "@/config/industries.json";

interface CTASectionProps {
  output: EstimatorOutput;
  input?: Partial<EstimatorInput>;
  onReset: () => void;
  onDownloadPDF: () => void;
  pdfLoading?: boolean;
  prospectName?: string;
  preparedBy?: string;
  finalQuoteLow?: number;
  finalQuoteMid?: number;
  finalQuoteHigh?: number;
}

const CTASection = ({
  output,
  input,
  onReset,
  onDownloadPDF,
  pdfLoading,
  prospectName,
  preparedBy,
  finalQuoteLow,
  finalQuoteMid,
  finalQuoteHigh,
}: CTASectionProps) => {
  const [copied, setCopied] = useState(false);

  const getFrameworkName = (id: string) =>
    frameworksData.frameworks.find((f) => f.id === id)?.name ?? id;
  const getIndustryLabel = (id: string) =>
    industriesData.industries.find((i) => i.id === id)?.label ?? id;

  const complexityLabels: Record<string, string> = {
    low: "Simple",
    medium: "Moderate",
    high: "Complex",
    very_high: "Highly Complex",
  };

  const teamSizeLabels: Record<string, string> = {
    "1-10": "1–10 employees",
    "11-50": "11–50 employees",
    "51-200": "51–200 employees",
    "201-500": "201–500 employees",
    "501-1000": "501–1,000 employees",
    "1001-5000": "1,001–5,000 employees",
    "5000+": "5,000+ employees",
  };

  const handleCopyToProposal = async () => {
    const date = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const lowVal = finalQuoteLow ?? output.totalCostLow;
    const highVal = finalQuoteHigh ?? output.totalCostHigh;

    const frameworks = (input?.selectedFrameworks ?? [])
      .map(getFrameworkName)
      .join(", ");

    const industry = getIndustryLabel(input?.industry ?? "");
    const teamSize = teamSizeLabels[input?.teamSize ?? ""] ?? (input?.teamSize ?? "");
    const complexity = complexityLabels[input?.engagementComplexity ?? ""] ?? (input?.engagementComplexity ?? "");

    const text = `SecComply Compliance Engagement Estimate
${prospectName || "Prospective Client"} — ${date}

Frameworks: ${frameworks || "N/A"}
Industry: ${industry || "N/A"}
Team Size: ${teamSize || "N/A"}
Complexity: ${complexity || "N/A"}

Estimated Investment: ${formatINR(lowVal)} – ${formatINR(highVal)}
Timeline: ${output.timelineWeeks.low}–${output.timelineWeeks.high} weeks
Monthly Ongoing: ${formatINR(output.monthlyOngoing.low)} – ${formatINR(output.monthlyOngoing.high)}/month

Prepared by SecComply`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers that block clipboard
      console.error("Clipboard write failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-6"
    >
      {/* Main CTA */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#0D1B2A] to-[#111827] border border-[#00E5A0]/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,229,160,0.1)]">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5A0]/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-jetbrains text-2xl font-bold text-[#F1F5F9] mb-2">
                Proposal Actions
              </h3>
              <p className="text-[#94A3B8] text-sm max-w-lg">
                Copy a formatted summary for your proposal, export a client-facing PDF, or start a new estimate.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={handleCopyToProposal}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardCopy className="w-4 h-4" />
                  Copy to Proposal
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onDownloadPDF}
              loading={pdfLoading}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export Client PDF
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={onReset}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Estimate
            </Button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-[#475569] text-center">
        Internal estimate — verify with delivery team before quoting. Margins and scope adjustments may apply.
      </p>
    </motion.div>
  );
};

export default CTASection;
