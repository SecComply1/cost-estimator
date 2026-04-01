import { FrameworkId } from "@/types";
import overlapMatrix from "@/config/overlap-matrix.json";

type OverlapEntry = {
  framework1: string;
  framework2: string;
  discount: number;
};

export function getOverlapDiscount(frameworkA: FrameworkId, frameworkB: FrameworkId): number {
  const entry = (overlapMatrix.overlaps as OverlapEntry[]).find(
    (o) =>
      (o.framework1 === frameworkA && o.framework2 === frameworkB) ||
      (o.framework1 === frameworkB && o.framework2 === frameworkA)
  );
  return entry ? entry.discount : 0;
}

export function computeOverlapDiscounts(
  sortedFrameworks: FrameworkId[],
  baseCostFn: (fw: FrameworkId) => number
): Record<FrameworkId, number> {
  const result: Partial<Record<FrameworkId, number>> = {};
  const pricedFrameworks: FrameworkId[] = [];

  for (const fw of sortedFrameworks) {
    if (pricedFrameworks.length === 0) {
      result[fw] = 0;
    } else {
      const maxDiscount = pricedFrameworks.reduce((max, pricedFw) => {
        const discount = getOverlapDiscount(fw, pricedFw);
        return Math.max(max, discount);
      }, 0);
      result[fw] = maxDiscount;
    }
    pricedFrameworks.push(fw);
  }

  return result as Record<FrameworkId, number>;
}

export function sortFrameworksByBaseCost(
  frameworks: FrameworkId[],
  baseCostFn: (fw: FrameworkId) => number
): FrameworkId[] {
  return [...frameworks].sort((a, b) => baseCostFn(b) - baseCostFn(a));
}
