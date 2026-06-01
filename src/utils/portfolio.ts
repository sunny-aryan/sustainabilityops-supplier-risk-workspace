import type {
  Supplier,
  RiskLevel,
  DashboardStats,
  RiskDistributionItem,
} from "@/types";

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 90) return "critical";
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function getSuppliersNeedingAction(suppliers: Supplier[]): Supplier[] {
  const priorityOrder: Record<RiskLevel, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  const remPriority = (s: Supplier) =>
    s.remediationStatus === "overdue" ? 0 : s.remediationStatus === "escalated" ? 1 : 2;

  return suppliers
    .filter(
      (s) =>
        s.riskLevel === "critical" ||
        s.riskLevel === "high" ||
        s.remediationStatus === "overdue" ||
        s.remediationStatus === "escalated" ||
        (s.evidenceCompleteness < 60 && s.criticality === "High")
    )
    .sort((a, b) => {
      const levelDiff = priorityOrder[a.riskLevel] - priorityOrder[b.riskLevel];
      if (levelDiff !== 0) return levelDiff;
      const remDiff = remPriority(a) - remPriority(b);
      if (remDiff !== 0) return remDiff;
      return a.evidenceCompleteness - b.evidenceCompleteness;
    });
}

export function calculateAverageEvidenceCompleteness(suppliers: Supplier[]): number {
  if (suppliers.length === 0) return 0;
  return Math.round(
    suppliers.reduce((acc, s) => acc + s.evidenceCompleteness, 0) / suppliers.length
  );
}

export function getRiskDistribution(suppliers: Supplier[]): RiskDistributionItem[] {
  const levels: RiskLevel[] = ["critical", "high", "medium", "low"];
  const labels: Record<RiskLevel, string> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return levels.map((level) => {
    const count = suppliers.filter((s) => s.riskLevel === level).length;
    return {
      level,
      label: labels[level],
      count,
      percentage: Math.round((count / suppliers.length) * 100),
    };
  });
}

export function calculatePortfolioStats(suppliers: Supplier[]): DashboardStats {
  return {
    totalSuppliers: suppliers.length,
    highCriticalRisk: suppliers.filter(
      (s) => s.riskLevel === "critical" || s.riskLevel === "high"
    ).length,
    avgEvidenceCompleteness: calculateAverageEvidenceCompleteness(suppliers),
    overdueRemediationPlans: suppliers.filter(
      (s) => s.remediationStatus === "overdue" || s.remediationStatus === "escalated"
    ).length,
    reviewRequired: suppliers.filter(
      (s) =>
        (s.evidenceCompleteness < 60 && s.criticality === "High") ||
        s.remediationStatus === "overdue"
    ).length,
  };
}
