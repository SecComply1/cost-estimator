import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EstimatorInput, FrameworkId, IndustryId, TeamSizeBracket, RevenueRange, EngagementPeriod, AuditFirmTier } from "@/types";

interface EstimatorStore {
  currentStep: number;
  formData: Partial<EstimatorInput>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<EstimatorInput>) => void;
  resetForm: () => void;
  toggleFramework: (fw: FrameworkId) => void;
  toggleExistingCertification: (fw: FrameworkId) => void;
}

const defaultFormData: Partial<EstimatorInput> = {
  selectedFrameworks: [],
  industry: "saas_technology",
  teamSize: "51-200",
  country: "IN",
  annualRevenue: "10m_50m",
  engagementComplexity: undefined,
  existingPosture: "none",
  existingCertifications: [],
  hasSecurityTeam: false,
  lastAuditDate: "never",
  engagementPeriod: "1_year" as EngagementPeriod,
  auditFirmTier: "standard" as AuditFirmTier,
};

export const useEstimatorStore = create<EstimatorStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: { ...defaultFormData },

      setStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),

      prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetForm: () =>
        set({ currentStep: 1, formData: { ...defaultFormData } }),

      toggleFramework: (fw) =>
        set((state) => {
          const current = state.formData.selectedFrameworks ?? [];
          const updated = current.includes(fw)
            ? current.filter((f) => f !== fw)
            : [...current, fw];
          return {
            formData: { ...state.formData, selectedFrameworks: updated },
          };
        }),

      toggleExistingCertification: (fw) =>
        set((state) => {
          const current = state.formData.existingCertifications ?? [];
          const updated = current.includes(fw)
            ? current.filter((f) => f !== fw)
            : [...current, fw];
          return {
            formData: { ...state.formData, existingCertifications: updated },
          };
        }),
    }),
    {
      name: "seccomply-estimator-v5",
      // Version bump clears stale localStorage state from previous sessions
    }
  )
);
