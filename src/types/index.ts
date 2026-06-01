export type Page =
  | "welcome"
  | "dashboard"
  | "suppliers"
  | "action-queue"
  | "supplier-portal"
  | "methodology";

export type Role = "procurement" | "esg-analyst" | "supplier";

export type RiskLevel = "high" | "medium" | "low";
export type EvidenceStatus = "complete" | "partial" | "missing";
export type RemediationStatus = "on-track" | "overdue" | "not-started" | "complete";

export interface Supplier {
  id: string;
  name: string;
  category: string;
  country: string;
  riskLevel: RiskLevel;
  riskScore: number;
  evidenceStatus: EvidenceStatus;
  evidenceCompletion: number;
  remediationStatus: RemediationStatus;
  lastAssessed: string;
}

export interface DashboardStats {
  totalSuppliers: number;
  highRiskSuppliers: number;
  evidenceCompletionRate: number;
  overdueRemediationPlans: number;
}

export interface ActivityItem {
  id: number;
  action: string;
  supplier: string;
  timestamp: string;
  type: "evidence" | "overdue" | "risk" | "onboarded" | "approved";
}
