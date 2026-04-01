import {
  EstimatorInput,
  EstimatorOutput,
  FrameworkId,
  FrameworkCostBreakdown,
  CostLineItem,
  ComplexityLevel,
  ExistingPostureLevel,
} from "@/types";
import {
  BASE_COSTS,
  TEAM_SIZE_TO_BAND,
  MONTHLY_ONGOING,
  INDUSTRY_DELIVERY_MULTIPLIERS,
  INDUSTRY_AUDIT_MULTIPLIERS,
  COMPLEXITY_DELIVERY_MULTIPLIERS,
  COMPLEXITY_AUDIT_MULTIPLIERS,
  POSTURE_DELIVERY_DISCOUNTS,
  POSTURE_AUDIT_DISCOUNTS,
  BUNDLE_DISCOUNTS,
  AUDIT_FIRM_TIER_MULTIPLIERS,
  getTimelineWeeks,
  MULTI_FRAMEWORK_BUFFER_WEEKS,
  LINE_ITEM_DESCRIPTIONS,
  HOURS_ESTIMATES,
  BIG_FOUR_MULTIPLIER,
  BOUTIQUE_FIRM_MULTIPLIER,
} from "@/lib/constants";
import countriesData from "@/config/countries.json";
import frameworksData from "@/config/frameworks.json";

function getCountryMultipliers(countryCode: string): { tool: number; delivery: number; audit: number } {
  const country = countriesData.countries.find((c) => c.code === countryCode);
  if (!country) return { tool: 1.0, delivery: 1.0, audit: 1.0 };
  return {
    tool:     country.toolMultiplier,
    delivery: country.deliveryMultiplier,
    audit:    country.auditMultiplier,
  };
}

function getFrameworkName(id: FrameworkId): string {
  const fw = frameworksData.frameworks.find((f) => f.id === id);
  return fw?.name ?? id;
}

const COMPLEXITY_SCORES: Record<ComplexityLevel, number> = {
  low: 20,
  medium: 45,
  high: 65,
  very_high: 88,
};

export function computePostureScore(input: EstimatorInput): {
  score: number;
  level: ExistingPostureLevel;
  deliveryDiscount: number;
  auditDiscount: number;
} {
  let score = 0;
  if (input.hasSecurityTeam) score += 30;
  if (input.existingCertifications.length >= 1) score += 20;
  if (input.existingCertifications.length >= 3) score += 15;
  if (input.lastAuditDate === "within_1_year") score += 35;
  else if (input.lastAuditDate === "1_2_years") score += 20;
  else if (input.lastAuditDate === "over_2_years") score += 10;

  let level: ExistingPostureLevel;
  if (score <= 15) level = "none";
  else if (score <= 35) level = "basic";
  else if (score <= 60) level = "moderate";
  else level = "advanced";

  return {
    score,
    level,
    deliveryDiscount: POSTURE_DELIVERY_DISCOUNTS[level],
    auditDiscount: POSTURE_AUDIT_DISCOUNTS[level],
  };
}

function makeCostLineItem(
  key: "toolCost" | "deliveryCost" | "externalAudit",
  mid: number,
  label: string
): CostLineItem {
  const low  = Math.round(mid * 0.85);
  const high = Math.round(mid * 1.15);
  return {
    label,
    costLow:  low,
    costHigh: high,
    hoursEstimate: HOURS_ESTIMATES[key],
    description: LINE_ITEM_DESCRIPTIONS[key],
  };
}

export function calculateEstimate(input: EstimatorInput): EstimatorOutput {
  const { tool: toolCountryMult, delivery: deliveryCountryMult, audit: auditCountryMult } =
    getCountryMultipliers(input.country);
  const band = TEAM_SIZE_TO_BAND[input.teamSize];
  const complexity = input.engagementComplexity as ComplexityLevel;

  const deliveryIndustryMult = INDUSTRY_DELIVERY_MULTIPLIERS[input.industry];
  const auditIndustryMult    = INDUSTRY_AUDIT_MULTIPLIERS[input.industry];

  const deliveryComplexityMult = COMPLEXITY_DELIVERY_MULTIPLIERS[complexity];
  const auditComplexityMult    = COMPLEXITY_AUDIT_MULTIPLIERS[complexity];

  const { level: postureLevel, score: readinessScore, deliveryDiscount, auditDiscount } =
    computePostureScore(input);

  const isThreeYear = (input.engagementPeriod ?? "1_year") === "3_year";

  const auditFirmTier = input.auditFirmTier ?? "standard";
  const auditFirmMult = AUDIT_FIRM_TIER_MULTIPLIERS[auditFirmTier];

  const complexityScore = COMPLEXITY_SCORES[complexity];

  // Sort frameworks by total base cost (most expensive = full price, others get bundle discounts)
  const sortedFrameworks = [...input.selectedFrameworks].sort((a, b) => {
    const costA = BASE_COSTS[a][band];
    const costB = BASE_COSTS[b][band];
    const totalA = costA.tool + costA.delivery + costA.audit;
    const totalB = costB.tool + costB.delivery + costB.audit;
    return totalB - totalA;
  });

  const frameworkBreakdown: FrameworkCostBreakdown[] = [];
  let totalCostLow = 0;
  let totalCostHigh = 0;
  let totalOverlapSavings = 0;
  let maxTimelineWeeks = 0;

  for (let i = 0; i < sortedFrameworks.length; i++) {
    const fw = sortedFrameworks[i];
    const base = BASE_COSTS[fw][band];

    // Bundle discount: 0 for 1st, BUNDLE_DISCOUNTS.second for 2nd, BUNDLE_DISCOUNTS.third for 3rd+
    const bundleDisc = i === 0 ? { tool: 0, delivery: 0, audit: 0 }
                     : i === 1 ? BUNDLE_DISCOUNTS.second
                               : BUNDLE_DISCOUNTS.third;

    const overlapDiscount = bundleDisc.delivery; // For UI display (delivery is the main overlap component)

    // Select base costs for the chosen engagement period
    const toolBase     = isThreeYear ? base.tool_3y     : base.tool_1y;
    const deliveryBase = isThreeYear ? base.delivery_3y : base.delivery_1y;

    // Apply all multipliers and discounts to get final mid cost per bucket
    const toolMid     = Math.round(toolBase     * toolCountryMult     * (1 - bundleDisc.tool));
    const deliveryMid = Math.round(deliveryBase * deliveryCountryMult * deliveryIndustryMult * deliveryComplexityMult * (1 - deliveryDiscount) * (1 - bundleDisc.delivery));
    const auditMid    = Math.round(base.audit   * auditCountryMult    * auditIndustryMult    * auditComplexityMult    * (1 - auditDiscount)    * (1 - bundleDisc.audit)    * auditFirmMult);

    // Compute overlap savings (how much the bundle discount saves on delivery)
    if (i > 0) {
      const fullDelivery = Math.round(deliveryBase * deliveryCountryMult * deliveryIndustryMult * deliveryComplexityMult * (1 - deliveryDiscount));
      const savings = fullDelivery - Math.round(fullDelivery * (1 - bundleDisc.delivery));
      totalOverlapSavings += savings;
    }

    const toolCost     = makeCostLineItem("toolCost",     toolMid,     "Platform & Tooling");
    const deliveryCost = makeCostLineItem("deliveryCost", deliveryMid, "Delivery & Implementation");
    const externalAudit= makeCostLineItem("externalAudit",auditMid,   "External Audit / Certification");

    const subtotalLow  = toolCost.costLow  + deliveryCost.costLow  + externalAudit.costLow;
    const subtotalHigh = toolCost.costHigh + deliveryCost.costHigh + externalAudit.costHigh;

    totalCostLow  += subtotalLow;
    totalCostHigh += subtotalHigh;

    // Timeline
    const fwTimeline = getTimelineWeeks(fw, complexity);
    maxTimelineWeeks = Math.max(maxTimelineWeeks, fwTimeline);

    frameworkBreakdown.push({
      frameworkId: fw,
      frameworkName: getFrameworkName(fw),
      toolCost,
      deliveryCost,
      externalAudit,
      subtotalLow,
      subtotalHigh,
      overlapDiscount,
    });
  }

  const totalCostMid = Math.round((totalCostLow + totalCostHigh) / 2);

  // Timeline: max of any single framework + buffer per additional framework
  const additionalFrameworks = Math.max(0, input.selectedFrameworks.length - 1);
  const timelineLow  = Math.round(maxTimelineWeeks * 0.9) + additionalFrameworks * MULTI_FRAMEWORK_BUFFER_WEEKS;
  const timelineHigh = Math.round(maxTimelineWeeks * 1.1) + additionalFrameworks * MULTI_FRAMEWORK_BUFFER_WEEKS;

  // Monthly ongoing: use max framework's monthly cost (primary framework drives ongoing)
  const primaryFw = sortedFrameworks[0];
  const monthlyBase = primaryFw ? MONTHLY_ONGOING[primaryFw][band] : 0;
  const monthlyMult = deliveryCountryMult * deliveryIndustryMult;
  const monthlyOngoing = {
    low:  Math.round(monthlyBase * monthlyMult * 0.85),
    high: Math.round(monthlyBase * monthlyMult * 1.15),
  };

  // Competitive comparison
  const comparison = {
    diyEstimate:           Math.round(totalCostMid * 1.2),
    bigFourEstimate:       Math.round(totalCostMid * BIG_FOUR_MULTIPLIER),
    boutiqueFirmEstimate:  Math.round(totalCostMid * BOUTIQUE_FIRM_MULTIPLIER),
    seccomplyEstimate:     totalCostMid,
  };

  return {
    totalCostLow,
    totalCostHigh,
    totalCostMid,
    currency: "INR",
    frameworkBreakdown,
    overlapSavings: totalOverlapSavings,
    timelineWeeks: { low: timelineLow, high: timelineHigh },
    comparison,
    monthlyOngoing,
    complexityScore,
    readinessScore,
  };
}
