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
export type EvidenceCompletionBucket = "below60" | "60to84" | "above85";

// Evidence types
export type EvidenceItemStatus =
  | "Complete"
  | "Missing"
  | "Expired"
  | "Under Review"
  | "Requested";

export type EvidenceSourceType =
  | "Supplier Upload"
  | "Third-party Audit"
  | "Internal Review"
  | "Declaration";

export interface EvidenceItem {
  id: string;
  supplierId: string;
  evidenceName: string;
  category: string;
  status: EvidenceItemStatus;
  owner: string;
  lastUpdated: string;
  dueDate: string;
  sourceType: EvidenceSourceType;
  blocksApproval: boolean;
  notes: string;
}

// Compliance mapping types
export type ComplianceApplicability =
  | "Applicable"
  | "Possibly Applicable"
  | "Not Applicable";

export type ComplianceReadiness =
  | "Ready"
  | "Evidence Gap"
  | "Review Required"
  | "Blocked";

export interface ComplianceMapping {
  id: string;
  supplierId: string;
  framework: string;
  applicability: ComplianceApplicability;
  readiness: ComplianceReadiness;
  requiredEvidence: string[];
  reason: string;
  lastAssessed: string;
}

// Activity timeline types
export type TimelineEventType =
  | "evidence_requested"
  | "evidence_submitted"
  | "risk_recalculated"
  | "remediation_overdue"
  | "finding_flagged"
  | "approval_blocked"
  | "ai_draft_generated"
  | "review_completed"
  | "supplier_onboarded"
  | "policy_triggered";

export type TimelineEventSource =
  | "System"
  | "ESG Analyst"
  | "Procurement Manager"
  | "Supplier User"
  | "AI Draft";

export interface TimelineEvent {
  id: string;
  supplierId: string;
  date: string;
  actor: string;
  eventType: TimelineEventType;
  description: string;
  source: TimelineEventSource;
  systemGenerated: boolean;
}

// Supplier interface
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

export interface SupplierFilters {
  search?: string;
  riskLevel?: RiskLevel | "high-or-critical" | "all";
  category?: string;
  remediationStatus?: RemediationStatus | "all";
  evidenceBucket?: EvidenceCompletionBucket | "all";
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
