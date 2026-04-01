"use client";

import { EstimatorInput, IndustryId, TeamSizeBracket, RevenueRange } from "@/types";
import Select from "@/components/ui/Select";
import industriesData from "@/config/industries.json";
import countriesData from "@/config/countries.json";

interface ProspectDetailsProps {
  formData: Partial<EstimatorInput>;
  onChange: (data: Partial<EstimatorInput>) => void;
}

const ProspectDetails = ({ formData, onChange }: ProspectDetailsProps) => {
  const industryOptions = industriesData.industries.map((i) => ({
    value: i.id,
    label: i.label,
  }));

  const teamSizeOptions: { value: TeamSizeBracket; label: string }[] = [
    { value: "1-10",    label: "1–10 employees" },
    { value: "11-50",   label: "11–50 employees" },
    { value: "51-200",  label: "51–200 employees" },
    { value: "201-500", label: "201–500 employees" },
  ];

  const revenueOptions: { value: RevenueRange; label: string }[] = [
    { value: "under_1m", label: "Under ₹1 Crore / $1M" },
    { value: "1m_10m", label: "₹1Cr – ₹10Cr / $1M–$10M" },
    { value: "10m_50m", label: "₹10Cr – ₹50Cr / $10M–$50M" },
    { value: "50m_200m", label: "₹50Cr – ₹200Cr / $50M–$200M" },
    { value: "200m_1b", label: "₹200Cr – ₹1000Cr / $200M–$1B" },
    { value: "over_1b", label: "Over ₹1000Cr / $1B+" },
  ];

  const countryOptions = countriesData.countries.map((c) => ({
    value: c.code,
    label: `${c.name} (${c.region})`,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-jetbrains text-2xl font-bold text-[#F1F5F9] mb-2">
          Prospect Details
        </h2>
        <p className="text-[#94A3B8] text-sm">
          Enter details about the prospect&apos;s organization. These determine industry-specific
          requirements and pricing adjustments for the estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Industry"
          options={industryOptions}
          value={formData.industry ?? "saas_technology"}
          onChange={(e) => onChange({ industry: e.target.value as IndustryId })}
        />

        <Select
          label="Team Size"
          options={teamSizeOptions}
          value={formData.teamSize ?? "51-200"}
          onChange={(e) => onChange({ teamSize: e.target.value as TeamSizeBracket })}
        />

        <Select
          label="Primary Country of Operations"
          options={countryOptions}
          value={formData.country ?? "IN"}
          onChange={(e) => onChange({ country: e.target.value })}
        />

        <Select
          label="Annual Revenue"
          options={revenueOptions}
          value={formData.annualRevenue ?? "10m_50m"}
          onChange={(e) => onChange({ annualRevenue: e.target.value as RevenueRange })}
        />
      </div>

      <div className="p-4 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl">
        <h4 className="text-sm font-semibold text-[#3B82F6] mb-2">How these affect the estimate</h4>
        <ul className="text-xs text-[#94A3B8] space-y-1">
          <li>• Industry multipliers range from 0.85x (Education) to 1.35x (Banking)</li>
          <li>• Country adjusts all costs: India (1.0×), Middle East (1.6×), EU (1.8×), UK/JP (2.0×), USA (2.2×)</li>
          <li>• Revenue affects tooling and audit certification costs only</li>
          <li>• Team size significantly impacts implementation complexity</li>
        </ul>
      </div>
    </div>
  );
};

export default ProspectDetails;
