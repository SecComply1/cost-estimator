import { FrameworkId, TeamSizeBracket, IndustryId, PricingBand, AuditFirmTier } from "@/types";

// Maps 4 supported team size brackets → template pricing bands
// 500+ employee clients are not currently supported (template data incomplete for those bands)
export const TEAM_SIZE_TO_BAND: Record<TeamSizeBracket, PricingBand> = {
  "1-10":    "1_50",
  "11-50":   "1_50",
  "51-200":  "51_200",
  "201-500": "201_500",
};

// Base costs (INR) per framework per pricing band, split by engagement period.
// Source: SecComply Pricing Template v3 — Framework Pricing sheet
// tool_1y / delivery_1y = 1-year engagement cost
// tool_3y / delivery_3y = TOTAL 3-year contract value (not per-year; directly from template)
// audit = external audit cost (same regardless of period; annual audit scope drives this)
// Blanks in template (1000plus for 3-year) are estimated at ~2.5× the 1-year value.
export const BASE_COSTS: Record<FrameworkId, Record<PricingBand, {
  tool_1y: number;
  tool_3y: number;
  delivery_1y: number;
  delivery_3y: number;
  audit: number;
}>> = {
  iso27001: {
    "1_50":      { tool_1y: 100000, tool_3y: 250000, delivery_1y: 150000, delivery_3y: 400000,  audit: 50000  },
    "51_200":    { tool_1y: 150000, tool_3y: 400000, delivery_1y: 200000, delivery_3y: 500000,  audit: 50000  },
    "201_500":   { tool_1y: 200000, tool_3y: 500000, delivery_1y: 250000, delivery_3y: 650000,  audit: 50000  },
    "501_1000":  { tool_1y: 450000, tool_3y: 1200000,delivery_1y: 350000, delivery_3y: 950000,  audit: 50000  },
    "1000plus":  { tool_1y: 800000, tool_3y: 2000000,delivery_1y: 600000, delivery_3y: 1500000, audit: 50000  }, // 3y estimated ~2.5x
  },
  soc2_type2: {
    "1_50":      { tool_1y: 100000, tool_3y: 250000, delivery_1y: 150000, delivery_3y: 450000,  audit: 150000 },
    "51_200":    { tool_1y: 150000, tool_3y: 400000, delivery_1y: 200000, delivery_3y: 350000,  audit: 150000 },
    "201_500":   { tool_1y: 200000, tool_3y: 500000, delivery_1y: 250000, delivery_3y: 600000,  audit: 200000 },
    "501_1000":  { tool_1y: 350000, tool_3y: 875000, delivery_1y: 350000, delivery_3y: 875000,  audit: 250000 }, // 3y estimated ~2.5x
    "1000plus":  { tool_1y: 600000, tool_3y: 1500000,delivery_1y: 600000, delivery_3y: 1500000, audit: 300000 }, // 3y estimated ~2.5x
  },
};

// Monthly ongoing costs (INR) after certification, per framework per band
// Source: SecComply Pricing Template v3 (where available; others estimated at ~7% of annual total)
export const MONTHLY_ONGOING: Record<FrameworkId, Record<PricingBand, number>> = {
  iso27001:  { "1_50": 15000, "51_200": 25000, "201_500": 40000, "501_1000": 60000, "1000plus": 85000 },
  soc2_type2:{ "1_50": 20000, "51_200": 30000, "201_500": 45000, "501_1000": 65000, "1000plus": 90000 },
};

// ─── INDUSTRY MULTIPLIERS ────────────────────────────────────────────────────
// Tool multiplier is 1.0 across all industries (platform license is fixed)
// Source: SecComply Pricing Template v3 – Multipliers sheet
export const INDUSTRY_DELIVERY_MULTIPLIERS: Record<IndustryId, number> = {
  banking_financial: 1.35,
  healthcare:        1.25,
  saas_technology:   1.00,
  ecommerce_retail:  1.10,
  manufacturing:     1.15,
  government_psu:    1.30,
  education:         0.85,
  telecom:           1.25,
  energy_utilities:  1.30,
  logistics:         1.05,
  media_entertainment: 0.90,
  other:             1.00,
};

export const INDUSTRY_AUDIT_MULTIPLIERS: Record<IndustryId, number> = {
  banking_financial: 1.40,
  healthcare:        1.30,
  saas_technology:   1.00,
  ecommerce_retail:  1.15,
  manufacturing:     1.10,
  government_psu:    1.25,
  education:         0.85,
  telecom:           1.20,
  energy_utilities:  1.25,
  logistics:         1.05,
  media_entertainment: 0.90,
  other:             1.00,
};

// ─── COUNTRY MULTIPLIERS ─────────────────────────────────────────────────────
// Per-country tool/delivery/audit multipliers are stored directly in
// src/config/countries.json and looked up by country code in the pricing engine.
// Source: SecComply Pricing Template v3 – Multipliers sheet (10 geo groups)

// ─── COMPLEXITY MULTIPLIERS ──────────────────────────────────────────────────
// Tool multiplier is 1.0 for all complexity levels (same platform regardless)
// Source: SecComply Pricing Template v3 – Multipliers sheet
export const COMPLEXITY_DELIVERY_MULTIPLIERS: Record<string, number> = {
  low:       0.75,  // Simple
  medium:    1.00,  // Moderate
  high:      1.30,  // Complex
  very_high: 1.60,  // Highly Complex
};

export const COMPLEXITY_AUDIT_MULTIPLIERS: Record<string, number> = {
  low:       0.85,
  medium:    1.00,
  high:      1.25,
  very_high: 1.55,
};

// ─── EXISTING POSTURE DISCOUNTS ───────────────────────────────────────────────
// Applies ONLY to delivery and audit — not to tool cost
// Source: SecComply Pricing Template v3 – Multipliers sheet
export const POSTURE_DELIVERY_DISCOUNTS: Record<string, number> = {
  none:     0.00,
  basic:    0.15,
  moderate: 0.25,
  advanced: 0.40,
};

export const POSTURE_AUDIT_DISCOUNTS: Record<string, number> = {
  none:     0.00,
  basic:    0.05,
  moderate: 0.10,
  advanced: 0.20,
};

// ─── BUNDLE DISCOUNTS (OPTION B — POSITION-BASED) ────────────────────────────
// Source: SecComply Pricing Template v3 – Bundle Pricing sheet (Option B selected)
export const BUNDLE_DISCOUNTS: { second: { tool: number; delivery: number; audit: number }; third: { tool: number; delivery: number; audit: number } } = {
  second: { tool: 0.25, delivery: 0.30, audit: 0.10 },
  third:  { tool: 0.35, delivery: 0.40, audit: 0.15 },
};

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
// Weeks to certification by framework and complexity
// Source: SecComply Pricing Template v3 – Timeline sheet
// Format: [simple, moderate, complex, highly_complex] → maps to [low, medium, high, very_high]
const FW_TIMELINE: Record<FrameworkId, [number, number, number, number]> = {
  iso27001:   [8,  14, 20, 28],
  soc2_type2: [12, 20, 28, 36],
};

export function getTimelineWeeks(fw: FrameworkId, complexity: string): number {
  const idx = { low: 0, medium: 1, high: 2, very_high: 3 }[complexity] ?? 1;
  return FW_TIMELINE[fw][idx];
}

// Buffer weeks added per additional framework in a multi-framework engagement
export const MULTI_FRAMEWORK_BUFFER_WEEKS = 3;

// ─── DESCRIPTIONS ─────────────────────────────────────────────────────────────
export const LINE_ITEM_DESCRIPTIONS = {
  toolCost:     "SecComply platform license — GRC tooling, automation, and evidence collection",
  deliveryCost: "Consulting and implementation — gap assessment, policy development, controls implementation, training, and audit preparation",
  externalAudit:"External auditor / certification body fees and coordination",
};

export const HOURS_ESTIMATES = {
  toolCost:     16,
  deliveryCost: 80,
  externalAudit: 8,
};

// ─── ENGAGEMENT PERIOD ───────────────────────────────────────────────────────
// 1-year vs 3-year pricing is handled via separate columns in BASE_COSTS above.
// The pricing engine selects tool_1y/delivery_1y or tool_3y/delivery_3y based
// on input.engagementPeriod. No additional discount multiplier needed here.

// ─── AUDIT FIRM TIER MULTIPLIERS ─────────────────────────────────────────────
// Applied to the external audit / certification cost bucket.
export const AUDIT_FIRM_TIER_MULTIPLIERS: Record<AuditFirmTier, number> = {
  standard: 1.0,   // Regional / local CPA / independent assessor
  boutique: 1.8,   // Boutique cybersecurity / compliance firm
  big_four: 3.5,   // Big Four accounting firm (Deloitte, PwC, EY, KPMG)
};

export const AUDIT_FIRM_TIER_LABELS: Record<AuditFirmTier, string> = {
  standard: "Standard / Regional",
  boutique: "Boutique Cybersecurity Firm",
  big_four: "Big Four Firm",
};

// ─── COMPETITIVE BENCHMARKS ───────────────────────────────────────────────────
// Source: SecComply Pricing Template v3 – Competitive Benchmarks sheet
export const BIG_FOUR_MULTIPLIER      = 3.5;
export const BOUTIQUE_FIRM_MULTIPLIER = 1.8;
