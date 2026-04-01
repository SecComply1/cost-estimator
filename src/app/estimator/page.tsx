"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, ArrowRight, CheckCircle2, Building2, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

import StepIndicator from "@/components/estimator/StepIndicator";
import FrameworkSelector from "@/components/estimator/FrameworkSelector";
import ProspectDetails from "@/components/estimator/ProspectDetails";
import EngagementComplexity from "@/components/estimator/EngagementComplexity";
import EngagementOptions from "@/components/estimator/EngagementOptions";
import ExistingPosture from "@/components/estimator/ExistingPosture";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useEstimatorStore } from "@/store/estimator";
import { encodeEstimatorInput } from "@/lib/utils";
import { EstimatorInput, ComplexityLevel, EngagementPeriod, AuditFirmTier } from "@/types";
import frameworksData from "@/config/frameworks.json";
import industriesData from "@/config/industries.json";
import countriesData from "@/config/countries.json";

export default function EstimatorPage() {
  const router = useRouter();
  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    setStep,
    updateFormData,
    toggleFramework,
    toggleExistingCertification,
  } = useEstimatorStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (formData.selectedFrameworks ?? []).length > 0;
      case 2:
        return !!formData.industry && !!formData.teamSize && !!formData.country;
      case 3:
        return !!formData.engagementComplexity;
      case 4:
        return !!formData.engagementPeriod && !!formData.auditFirmTier;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const input: EstimatorInput = {
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

      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate estimate");
      }

      const result = await response.json();
      const encoded = encodeEstimatorInput(input);

      // Store result in sessionStorage for the results page
      sessionStorage.setItem("estimator-result", JSON.stringify(result));
      sessionStorage.setItem("estimator-input", encoded);

      router.push(`/results?data=${encoded}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  const [slideDir, setSlideDir] = useState(1);

  const handleNext = () => {
    if (currentStep === 5) {
      handleSubmit();
    } else {
      setSlideDir(1);
      nextStep();
    }
  };

  const handlePrev = () => {
    setSlideDir(-1);
    prevStep();
  };

  const handleStepClick = (step: number) => {
    setSlideDir(step > currentStep ? 1 : -1);
    setStep(step);
  };

  // Helpers for review summary in Step 4
  const getFrameworkName = (id: string) =>
    frameworksData.frameworks.find((f) => f.id === id)?.name ?? id;
  const getIndustryLabel = (id: string) =>
    industriesData.industries.find((i) => i.id === id)?.label ?? id;
  const getCountryName = (code: string) =>
    countriesData.countries.find((c) => c.code === code)?.name ?? code;

  const teamSizeLabels: Record<string, string> = {
    "1-10":    "1–10 employees",
    "11-50":   "11–50 employees",
    "51-200":  "51–200 employees",
    "201-500": "201–500 employees",
  };

  const complexityLabels: Record<string, string> = {
    low: "Simple (0.75× delivery)",
    medium: "Moderate (1.00× baseline)",
    high: "Complex (1.30× delivery)",
    very_high: "Highly Complex (1.60× delivery)",
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00E5A0]" />
            <span className="font-jetbrains font-bold text-[#F1F5F9]">
              Sec<span className="text-[#00E5A0]">Comply</span>
            </span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mb-10">
          <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden">
          <AnimatePresence custom={slideDir} mode="wait">
            <motion.div
              key={currentStep}
              custom={slideDir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {currentStep === 1 && (
                <FrameworkSelector
                  selectedFrameworks={formData.selectedFrameworks ?? []}
                  onToggle={toggleFramework}
                />
              )}
              {currentStep === 2 && (
                <ProspectDetails
                  formData={formData}
                  onChange={updateFormData}
                />
              )}
              {currentStep === 3 && (
                <EngagementComplexity
                  value={formData.engagementComplexity ?? null}
                  onChange={(v: ComplexityLevel) => updateFormData({ engagementComplexity: v })}
                />
              )}
              {currentStep === 4 && (
                <EngagementOptions
                  engagementPeriod={formData.engagementPeriod ?? null}
                  auditFirmTier={formData.auditFirmTier ?? null}
                  onPeriodChange={(v: EngagementPeriod) => updateFormData({ engagementPeriod: v })}
                  onAuditFirmChange={(v: AuditFirmTier) => updateFormData({ auditFirmTier: v })}
                />
              )}
              {currentStep === 5 && (
                <div className="space-y-10">
                  {/* Posture section */}
                  <ExistingPosture
                    formData={formData}
                    onChange={updateFormData}
                    onToggleCertification={toggleExistingCertification}
                  />

                  {/* Review summary */}
                  <div>
                    <h3 className="font-jetbrains text-xl font-bold text-[#F1F5F9] mb-4">
                      Review Selections
                    </h3>
                    <div className="space-y-3">
                      {/* Frameworks */}
                      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#00E5A0]" />
                            <span className="font-jetbrains font-semibold text-[#F1F5F9] text-sm">
                              Selected Frameworks
                            </span>
                          </div>
                          <button
                            onClick={() => handleStepClick(1)}
                            className="text-xs text-[#3B82F6] hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(formData.selectedFrameworks ?? []).map((fw) => (
                            <Badge key={fw} variant="success" size="sm">
                              {getFrameworkName(fw)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Prospect details */}
                      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#3B82F6]" />
                            <span className="font-jetbrains font-semibold text-[#F1F5F9] text-sm">
                              Prospect Details
                            </span>
                          </div>
                          <button
                            onClick={() => handleStepClick(2)}
                            className="text-xs text-[#3B82F6] hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-xs text-[#94A3B8] block">Industry</span>
                            <span className="text-[#F1F5F9]">{getIndustryLabel(formData.industry ?? "")}</span>
                          </div>
                          <div>
                            <span className="text-xs text-[#94A3B8] block">Team Size</span>
                            <span className="text-[#F1F5F9]">{teamSizeLabels[formData.teamSize ?? "51-200"]}</span>
                          </div>
                          <div>
                            <span className="text-xs text-[#94A3B8] block">Country</span>
                            <span className="text-[#F1F5F9]">{getCountryName(formData.country ?? "IN")}</span>
                          </div>
                        </div>
                      </div>

                      {/* Complexity */}
                      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#F59E0B]" />
                            <span className="font-jetbrains font-semibold text-[#F1F5F9] text-sm">
                              Engagement Complexity
                            </span>
                          </div>
                          <button
                            onClick={() => handleStepClick(3)}
                            className="text-xs text-[#3B82F6] hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        <span className="text-sm text-[#F1F5F9]">
                          {complexityLabels[formData.engagementComplexity ?? "medium"] ?? "Not set"}
                        </span>
                      </div>

                      {/* Engagement options */}
                      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#00E5A0]" />
                            <span className="font-jetbrains font-semibold text-[#F1F5F9] text-sm">
                              Engagement Options
                            </span>
                          </div>
                          <button
                            onClick={() => handleStepClick(4)}
                            className="text-xs text-[#3B82F6] hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-xs text-[#94A3B8] block">Period</span>
                            <span className="text-[#F1F5F9]">
                              {formData.engagementPeriod === "3_year" ? "3-Year (total contract)" : "1-Year (standard)"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-[#94A3B8] block">Audit Partner</span>
                            <span className="text-[#F1F5F9]">
                              {{ standard: "Standard / Regional", boutique: "Boutique Firm", big_four: "Big Four" }[formData.auditFirmTier ?? "standard"]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#00E5A0]/5 border border-[#00E5A0]/20 rounded-xl">
                    <p className="text-sm text-[#94A3B8]">
                      <span className="text-[#00E5A0] font-semibold">Ready to generate the estimate.</span>{" "}
                      Click &ldquo;Generate Estimate&rdquo; to produce a full cost breakdown with framework analysis,
                      overlap savings, and timeline projections.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-sm text-[#EF4444]">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <span className="text-sm text-[#94A3B8] font-jetbrains">
            Step {currentStep} of 5
          </span>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canProceed()}
            loading={loading}
            className="gap-2"
          >
            {currentStep === 5 ? (
              <>
                Generate Estimate
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
