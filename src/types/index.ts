export type FrameworkId = "iso27001" | "soc2_type2";

export type EngagementPeriod = "1_year" | "3_year";

export type AuditFirmTier = "standard" | "boutique" | "big_four";

export type IndustryId =
  | "banking_financial" | "healthcare" | "saas_technology" | "ecommerce_retail"
  | "manufacturing" | "government_psu" | "education" | "telecom"
  | "energy_utilities" | "logistics" | "media_entertainment" | "other";

export type TeamSizeBracket = "1-10" | "11-50" | "51-200" | "201-500";

export type ComplexityLevel = "low" | "medium" | "high" | "very_high";

export type ExistingPostureLevel = "none" | "basic" | "moderate" | "advanced";

export type RevenueRange = "under_1m" | "1m_10m" | "10m_50m" | "50m_200m" | "200m_1b" | "over_1b";

export type PricingBand = "1_50" | "51_200" | "201_500" | "501_1000" | "1000plus";

export interface EstimatorInput {
  selectedFrameworks: FrameworkId[];
  industry: IndustryId;
  teamSize: TeamSizeBracket;
  country: string;
  annualRevenue: RevenueRange;
  engagementComplexity: ComplexityLevel;
  existingPosture: ExistingPostureLevel;
  existingCertifications: FrameworkId[];
  hasSecurityTeam: boolean;
  lastAuditDate: "never" | "over_2_years" | "1_2_years" | "within_1_year";
  engagementPeriod: EngagementPeriod;
  auditFirmTier: AuditFirmTier;
}

export interface EstimateMetadata {
  prospectName: string;
  preparedBy: string;
}

export interface CostLineItem {
  label: string;
  costLow: number;
  costHigh: number;
  hoursEstimate: number;
  description: string;
}

export interface FrameworkCostBreakdown {
  frameworkId: FrameworkId;
  frameworkName: string;
  toolCost: CostLineItem;
  deliveryCost: CostLineItem;
  externalAudit: CostLineItem;
  subtotalLow: number;
  subtotalHigh: number;
  overlapDiscount: number;
}

export interface EstimatorOutput {
  totalCostLow: number;
  totalCostHigh: number;
  totalCostMid: number;
  currency: "INR" | "USD";
  frameworkBreakdown: FrameworkCostBreakdown[];
  overlapSavings: number;
  timelineWeeks: { low: number; high: number };
  comparison: {
    diyEstimate: number;
    bigFourEstimate: number;
    boutiqueFirmEstimate: number;
    seccomplyEstimate: number;
  };
  monthlyOngoing: { low: number; high: number };
  complexityScore: number;
  readinessScore: number;
}
