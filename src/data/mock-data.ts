import type {
  ActivityItem,
  DashboardStats,
  Supplier,
} from "@/types";

export const mockSuppliers: Supplier[] = [
  {
    id: "sup-001",
    name: "Apex Industrial Components",
    category: "Raw Materials",
    country: "Brazil",
    riskLevel: "high",
    riskScore: 78,
    evidenceStatus: "missing",
    evidenceCompletion: 23,
    remediationStatus: "overdue",
    lastAssessed: "2026-04-15",
  },
  {
    id: "sup-002",
    name: "Meridian Logistics Group",
    category: "Logistics & Transport",
    country: "Germany",
    riskLevel: "medium",
    riskScore: 45,
    evidenceStatus: "partial",
    evidenceCompletion: 61,
    remediationStatus: "on-track",
    lastAssessed: "2026-05-02",
  },
  {
    id: "sup-003",
    name: "Solaris Packaging Ltd",
    category: "Packaging",
    country: "United Kingdom",
    riskLevel: "low",
    riskScore: 18,
    evidenceStatus: "complete",
    evidenceCompletion: 94,
    remediationStatus: "complete",
    lastAssessed: "2026-05-20",
  },
];

export const dashboardStats: DashboardStats = {
  totalSuppliers: 47,
  highRiskSuppliers: 12,
  evidenceCompletionRate: 64,
  overdueRemediationPlans: 8,
};

export const recentActivity: ActivityItem[] = [
  {
    id: 1,
    action: "Evidence package submitted",
    supplier: "Meridian Logistics Group",
    timestamp: "2h ago",
    type: "evidence",
  },
  {
    id: 2,
    action: "Remediation plan is overdue",
    supplier: "Apex Industrial Components",
    timestamp: "5h ago",
    type: "overdue",
  },
  {
    id: 3,
    action: "Risk score recalculated",
    supplier: "Cerulean Textiles Co.",
    timestamp: "1d ago",
    type: "risk",
  },
  {
    id: 4,
    action: "New supplier onboarded",
    supplier: "Pinecrest Forest Products",
    timestamp: "2d ago",
    type: "onboarded",
  },
  {
    id: 5,
    action: "Annual review approved",
    supplier: "Solaris Packaging Ltd",
    timestamp: "3d ago",
    type: "approved",
  },
];

export const riskDistribution = [
  { label: "High Risk", count: 12, percentage: 26 },
  { label: "Medium Risk", count: 21, percentage: 45 },
  { label: "Low Risk", count: 14, percentage: 30 },
];
