import { z } from "zod";

const FrameworkIdSchema = z.enum(["iso27001", "soc2_type2"]);

const IndustryIdSchema = z.enum([
  "banking_financial", "healthcare", "saas_technology", "ecommerce_retail",
  "manufacturing", "government_psu", "education", "telecom",
  "energy_utilities", "logistics", "media_entertainment", "other",
]);

const TeamSizeBracketSchema = z.enum(["1-10", "11-50", "51-200", "201-500"]);

const RevenueRangeSchema = z.enum([
  "under_1m", "1m_10m", "10m_50m", "50m_200m", "200m_1b", "over_1b",
]);

export const EstimatorInputSchema = z.object({
  selectedFrameworks: z.array(FrameworkIdSchema).min(1, "Select at least one framework"),
  industry: IndustryIdSchema,
  teamSize: TeamSizeBracketSchema,
  country: z.string().min(2),
  annualRevenue: RevenueRangeSchema,
  engagementComplexity: z.enum(["low", "medium", "high", "very_high"]),
  existingPosture: z.enum(["none", "basic", "moderate", "advanced"]),
  existingCertifications: z.array(FrameworkIdSchema),
  hasSecurityTeam: z.boolean(),
  lastAuditDate: z.enum(["never", "over_2_years", "1_2_years", "within_1_year"]),
  engagementPeriod: z.enum(["1_year", "3_year"]),
  auditFirmTier: z.enum(["standard", "boutique", "big_four"]),
});

export type ValidatedEstimatorInput = z.infer<typeof EstimatorInputSchema>;
