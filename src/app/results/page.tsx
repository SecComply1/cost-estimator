"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { EstimatorOutput, EstimatorInput, EstimateMetadata } from "@/types";
import CostSummaryCard from "@/components/results/CostSummaryCard";
import CostBreakdown from "@/components/results/CostBreakdown";
import ComparisonChart from "@/components/results/ComparisonChart";
import TimelineEstimate from "@/components/results/TimelineEstimate";
import FrameworkOverlapCard from "@/components/results/FrameworkOverlapCard";
import CTASection from "@/components/results/CTASection";
import MarginAdjuster from "@/components/results/MarginAdjuster";
import SaveLoadPanel from "@/components/results/SaveLoadPanel";
import { useEstimatorStore } from "@/store/estimator";
import { calculateEstimate } from "@/lib/pricing-engine";
import { decodeEstimatorInput } from "@/lib/utils";
import { EstimatorInputSchema } from "@/lib/validators";
import frameworksData from "@/config/frameworks.json";
import industriesData from "@/config/industries.json";
import { formatINR } from "@/lib/utils";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetForm, formData } = useEstimatorStore();
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const [output, setOutput] = useState<EstimatorOutput | null>(null);
  const [input, setInput] = useState<Partial<EstimatorInput>>({});
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prospect metadata
  const [prospectName, setProspectName] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

  // Margin state
  const [marginAdjustment, setMarginAdjustment] = useState({
    margin: 20,
    discount: 0,
    finalQuoteMid: 0,
    finalQuoteLow: 0,
    finalQuoteHigh: 0,
  });

  useEffect(() => {
    const loadResults = () => {
      // Try sessionStorage first
      const storedResult = sessionStorage.getItem("estimator-result");
      const storedInput = sessionStorage.getItem("estimator-input");

      if (storedResult) {
        try {
          const parsed = JSON.parse(storedResult);
          setOutput(parsed);

          // Also try to restore input
          if (storedInput) {
            const decodedInput = decodeEstimatorInput(storedInput) as Partial<EstimatorInput>;
            setInput(decodedInput);
          } else {
            setInput(formData);
          }
          setLoading(false);
          return;
        } catch {
          // Fall through to URL param
        }
      }

      // Try URL param
      const dataParam = searchParams.get("data");
      if (dataParam) {
        const decoded = decodeEstimatorInput(dataParam);
        const parsedSchema = EstimatorInputSchema.safeParse(decoded);
        if (parsedSchema.success) {
          const result = calculateEstimate(parsedSchema.data);
          setOutput(result);
          setInput(parsedSchema.data);
          setLoading(false);
          return;
        }
      }

      setError("No estimate data found. Please complete the estimator.");
      setLoading(false);
    };

    loadResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleReset = () => {
    resetForm();
    sessionStorage.removeItem("estimator-result");
    sessionStorage.removeItem("estimator-input");
    router.push("/estimator");
  };

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

  const handleDownloadPDF = async () => {
    if (!output) return;
    setPdfLoading(true);
    try {
      // Build a structured PDF (client-facing — no margin %, no posture score)
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 48;
      let y = margin;

      // Header bar
      pdf.setFillColor(10, 14, 23);
      pdf.rect(0, 0, pageWidth, 80, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(0, 229, 160);
      pdf.text("SecComply", margin, 45);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184);
      pdf.text("Compliance Engagement Estimate", margin, 63);

      y = 110;

      // Prospect + date
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(241, 245, 249);
      pdf.text(prospectName || "Prospective Client", margin, y);
      y += 20;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184);
      const dateStr = new Date().toLocaleDateString("en-IN", {
        day: "2-digit", month: "long", year: "numeric",
      });
      pdf.text(`Date: ${dateStr}`, margin, y);
      y += 28;

      // Scope
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(0, 229, 160);
      pdf.text("Scope", margin, y);
      y += 16;

      const fwNames = (input?.selectedFrameworks ?? []).map(getFrameworkName).join(", ");
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(241, 245, 249);
      const fwLines = pdf.splitTextToSize(`Frameworks: ${fwNames}`, pageWidth - margin * 2);
      pdf.text(fwLines, margin, y);
      y += fwLines.length * 14 + 6;

      if (input?.industry) {
        pdf.text(`Industry: ${getIndustryLabel(input.industry)}`, margin, y);
        y += 14;
      }
      if (input?.teamSize) {
        pdf.text(`Team Size: ${teamSizeLabels[input.teamSize] ?? input.teamSize}`, margin, y);
        y += 14;
      }
      if (input?.engagementComplexity) {
        pdf.text(
          `Engagement Complexity: ${complexityLabels[input.engagementComplexity] ?? input.engagementComplexity}`,
          margin,
          y
        );
        y += 14;
      }
      y += 14;

      // Investment — use final quote values (margin-adjusted)
      const quoteLow = marginAdjustment.finalQuoteLow || output.totalCostLow;
      const quoteHigh = marginAdjustment.finalQuoteHigh || output.totalCostHigh;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(0, 229, 160);
      pdf.text("Estimated Investment", margin, y);
      y += 16;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(241, 245, 249);
      pdf.text(
        `${formatINR(quoteLow)} – ${formatINR(quoteHigh)}`,
        margin,
        y
      );
      y += 20;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184);
      pdf.text(
        `Timeline: ${output.timelineWeeks.low}–${output.timelineWeeks.high} weeks`,
        margin,
        y
      );
      y += 14;
      pdf.text(
        `Monthly Ongoing: ${formatINR(output.monthlyOngoing.low)} – ${formatINR(output.monthlyOngoing.high)}/month`,
        margin,
        y
      );
      y += 28;

      // Framework breakdown (margin-adjusted numbers)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(0, 229, 160);
      pdf.text("Framework Breakdown", margin, y);
      y += 16;

      const marginFactor = (1 + marginAdjustment.margin / 100) * (1 - marginAdjustment.discount / 100);

      for (const fw of output.frameworkBreakdown) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(241, 245, 249);
        pdf.text(fw.frameworkName, margin, y);

        const adjLow = Math.round(fw.subtotalLow * marginFactor);
        const adjHigh = Math.round(fw.subtotalHigh * marginFactor);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(148, 163, 184);
        pdf.text(`${formatINR(adjLow)} – ${formatINR(adjHigh)}`, pageWidth - margin, y, { align: "right" });
        y += 14;

        if (y > pdf.internal.pageSize.getHeight() - 80) {
          pdf.addPage();
          y = margin;
        }
      }

      y += 14;

      // Footer
      const footerY = pdf.internal.pageSize.getHeight() - 48;
      pdf.setDrawColor(30, 41, 59);
      pdf.line(margin, footerY - 8, pageWidth - margin, footerY - 8);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);
      pdf.text(
        `Prepared by ${preparedBy || "SecComply"}`,
        margin,
        footerY
      );
      pdf.text(
        "This estimate is valid for 30 days. Actual costs may vary based on detailed scoping.",
        margin,
        footerY + 12
      );
      pdf.text(
        "Contact your SecComply representative for a formal proposal.",
        margin,
        footerY + 24
      );

      pdf.save(`seccomply-estimate-${(prospectName || "client").toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#00E5A0] animate-spin mx-auto mb-4" />
          <p className="text-[#94A3B8]">Calculating estimate...</p>
        </div>
      </div>
    );
  }

  if (error || !output) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-[#EF4444] text-lg mb-4">{error ?? "Something went wrong"}</p>
          <Link href="/estimator">
            <button className="text-[#00E5A0] hover:underline">
              Go back to estimator
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const metadata: EstimateMetadata = { prospectName, preparedBy };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/estimator"
            className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Estimator</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00E5A0]" />
            <span className="font-jetbrains font-bold text-[#F1F5F9]">
              Sec<span className="text-[#00E5A0]">Comply</span>
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#F1F5F9] border border-[#1E293B] hover:border-[#334155] rounded-lg px-3 py-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Assessment
          </button>
        </div>

        {/* Prospect metadata inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 mb-6"
        >
          <h3 className="font-jetbrains font-bold text-[#F1F5F9] mb-4 text-sm uppercase tracking-wider">
            Estimate Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Prospect Name
              </label>
              <input
                type="text"
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:border-[#00E5A0]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Prepared By
              </label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:border-[#00E5A0]/50 transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Results content */}
        <div ref={pdfContentRef} className="space-y-6">
          {/* Hero cost card */}
          <CostSummaryCard output={output} prospectName={prospectName || undefined} />

          {/* Framework breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CostBreakdown breakdown={output.frameworkBreakdown} />
          </motion.div>

          {/* Overlap savings */}
          {output.frameworkBreakdown.length >= 2 && (
            <FrameworkOverlapCard output={output} />
          )}

          {/* Margin adjuster */}
          <MarginAdjuster
            baseCostLow={output.totalCostLow}
            baseCostMid={output.totalCostMid}
            baseCostHigh={output.totalCostHigh}
            onAdjustmentChange={setMarginAdjustment}
          />

          {/* Charts and timeline in grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ComparisonChart comparison={output.comparison} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <TimelineEstimate output={output} />
            </motion.div>
          </div>

          {/* Monthly ongoing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#111827] border border-[#1E293B] rounded-xl p-6"
          >
            <h3 className="font-jetbrains text-lg font-bold text-[#F1F5F9] mb-4">
              Monthly Ongoing Maintenance
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#94A3B8] mb-1">
                  After initial compliance, the client can maintain their certifications with
                </p>
                <p className="font-jetbrains text-2xl font-bold text-[#3B82F6]">
                  ₹{output.monthlyOngoing.low.toLocaleString("en-IN")} –{" "}
                  ₹{output.monthlyOngoing.high.toLocaleString("en-IN")}
                  <span className="text-sm text-[#94A3B8] font-normal ml-1">/month</span>
                </p>
              </div>
              <div className="text-right text-sm text-[#94A3B8]">
                <p>1.5–2.5% of</p>
                <p>total investment</p>
              </div>
            </div>
          </motion.div>

          {/* Save/Load panel */}
          <SaveLoadPanel
            input={input as EstimatorInput}
            output={output}
            metadata={metadata}
            marginAdjustment={{ margin: marginAdjustment.margin, discount: marginAdjustment.discount }}
          />

          {/* CTA */}
          <CTASection
            output={output}
            input={input}
            onReset={handleReset}
            onDownloadPDF={handleDownloadPDF}
            pdfLoading={pdfLoading}
            prospectName={prospectName}
            preparedBy={preparedBy}
            finalQuoteLow={marginAdjustment.finalQuoteLow}
            finalQuoteMid={marginAdjustment.finalQuoteMid}
            finalQuoteHigh={marginAdjustment.finalQuoteHigh}
          />
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#00E5A0] animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
