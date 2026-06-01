export type Page =
  | "welcome"
  | "dashboard"
  | "suppliers"
  | "action-queue"
  | "supplier-portal"
  | "methodology";

export type Role = "procurement" | "esg-analyst" | "supplier";

export type RiskLevel = "critical" | "high" | "medium" | "low";
export type EvidenceStatus = "complete" | "partial" | "missing";
export type RemediationStatus =
  | "on-track"
  | "in-progress"
  | "overdue"
  | "not-started"
  | "escalated"
  | "complete";
export type Criticality = "High" | "Medium" | "Low";

// Rich supplier type used in suppliers.ts
export interface Supplier {
  id: string;
  name: string;
  country: string;
  region: string;
  category: string;
  annualSpendEur: number;
  criticality: Criticality;
  riskScore: number;
  riskLevel: RiskLevel;
  evidenceCompleteness: number;
  openFindings: number;
  remediationStatus: RemediationStatus;
  regulatoryExposure: string[];
  lastUpdated: string;
  riskDrivers: string[];
  requiredActions: string[];
  owner: string;
  nextReviewDate: string;
}

export interface DashboardStats {
  totalSuppliers: number;
  highCriticalRisk: number;
  avgEvidenceCompleteness: number;
  overdueRemediationPlans: number;
  reviewRequired: number;
}

export interface ActivityItem {
  id: number;
  action: string;
  supplier: string;
  timestamp: string;
  type: "evidence" | "overdue" | "risk" | "onboarded" | "approved" | "escalated";
}

export interface RiskDistributionItem {
  level: RiskLevel;
  label: string;
  count: number;
  percentage: number;
}
