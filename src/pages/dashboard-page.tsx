import {
  Building2,
  AlertTriangle,
  FileCheck2,
  Clock,
  CheckCircle2,
  FilePlus2,
  TrendingUp,
  UserPlus,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatCard } from "@/components/shared/stat-card";
import { SectionHeader } from "@/components/shared/section-header";
import { RiskBadge } from "@/components/shared/risk-badge";
import { RemediationBadge } from "@/components/shared/remediation-badge";
import { suppliers, recentActivity } from "@/data/suppliers";
import {
  calculatePortfolioStats,
  getRiskDistribution,
  getSuppliersNeedingAction,
} from "@/utils/portfolio";
import type { ActivityItem, RiskLevel, Role } from "@/types";
import { cn } from "@/lib/utils";

const activityIcons: Record<ActivityItem["type"], React.ElementType> = {
  evidence: FilePlus2,
  overdue: AlertTriangle,
  risk: TrendingUp,
  onboarded: UserPlus,
  approved: CheckCircle2,
  escalated: ShieldAlert,
};

const activityIconColors: Record<ActivityItem["type"], string> = {
  evidence: "text-primary",
  overdue: "text-destructive",
  risk: "text-warning",
  onboarded: "text-success",
  approved: "text-success",
  escalated: "text-destructive",
};

const riskBarColors: Record<RiskLevel, string> = {
  critical: "[&>[data-slot=progress-indicator]]:bg-destructive",
  high: "[&>[data-slot=progress-indicator]]:bg-destructive/70",
  medium: "[&>[data-slot=progress-indicator]]:bg-warning",
  low: "[&>[data-slot=progress-indicator]]:bg-success",
};

const roleConfig: Record<
  Role,
  {
    pageDescription: string;
    actionDescription: string;
    alertMessage: string | null;
  }
> = {
  procurement: {
    pageDescription:
      "Supplier risk exposure across your portfolio. Prioritise sourcing decisions and follow up on overdue remediation.",
    actionDescription:
      "Highest-priority suppliers requiring sourcing review or remediation follow-up",
    alertMessage: null,
  },
  "esg-analyst": {
    pageDescription:
      "Evidence gaps, policy readiness, and audit-trail status across the supplier portfolio.",
    actionDescription:
      "Suppliers with evidence gaps, compliance policy flags, or escalated findings",
    alertMessage:
      "ESG Analyst view: Action Queue and Methodology & Trust Center are your primary workspaces for evidence review and policy governance.",
  },
  supplier: {
    pageDescription:
      "Internal risk overview. As a Supplier User, your primary workspace is the Supplier Portal.",
    actionDescription: "Suppliers currently flagged for attention",
    alertMessage:
      "Demo role view: Supplier users would not normally access this internal dashboard. Your primary workspace is the Supplier Portal.",
  },
};

interface DashboardPageProps {
  role: Role;
}

export function DashboardPage({ role }: DashboardPageProps) {
  const stats = calculatePortfolioStats(suppliers);
  const riskDist = getRiskDistribution(suppliers);
  const actionSuppliers = getSuppliersNeedingAction(suppliers);
  const config = roleConfig[role];

  const belowThreshold = suppliers.filter((s) => s.evidenceCompleteness < 60).length;
  const aboveTarget = suppliers.filter((s) => s.evidenceCompleteness >= 85).length;

  return (
    <div className="space-y-6">
      {config.alertMessage && (
        <Alert className="border-warning/30 bg-warning/5">
          <AlertTriangle className="size-4 text-warning" />
          <AlertDescription className="text-sm text-muted-foreground">
            {config.alertMessage}
          </AlertDescription>
        </Alert>
      )}

      <SectionHeader title="Dashboard" description={config.pageDescription} />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Suppliers Monitored"
          value={stats.totalSuppliers}
          description="Across all categories"
          icon={<Building2 className="size-4" />}
        />
        <StatCard
          label="High / Critical Risk"
          value={stats.highCriticalRisk}
          trend={`${riskDist.find((r) => r.level === "critical")?.count ?? 0} critical risk`}
          trendUp={false}
          icon={<AlertTriangle className="size-4" />}
          accentClassName="bg-destructive/10 text-destructive"
        />
        <StatCard
          label="Avg. Evidence Completion"
          value={`${stats.avgEvidenceCompleteness}%`}
          trend={`${belowThreshold} suppliers below 60%`}
          trendUp={false}
          icon={<FileCheck2 className="size-4" />}
          accentClassName="bg-warning/10 text-warning"
        />
        <StatCard
          label="Overdue / Escalated"
          value={stats.overdueRemediationPlans}
          description="Remediation plans requiring action"
          icon={<Clock className="size-4" />}
          accentClassName="bg-destructive/10 text-destructive"
        />
        <StatCard
          label="Review Required"
          value={stats.reviewRequired}
          description="Based on evidence & criticality rules"
          icon={<Users className="size-4" />}
          accentClassName="bg-warning/10 text-warning"
        />
      </div>

      {/* Middle row: risk distribution + evidence overview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Risk Distribution</CardTitle>
            <CardDescription className="text-xs">
              Deterministic scoring across 5 ESG dimensions. Score ≥ 90 = Critical, ≥ 75 = High, ≥ 45 = Medium.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskDist.map((item) => (
              <div key={item.level} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{item.label}</span>
                    {item.level === "critical" && (
                      <Badge
                        variant="outline"
                        className="h-4 px-1 text-[10px] bg-destructive/10 text-destructive border-destructive/20"
                      >
                        Escalation trigger
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground">
                    {item.count} suppliers ({item.percentage}%)
                  </span>
                </div>
                <Progress
                  value={item.percentage}
                  className={cn("h-2", riskBarColors[item.level])}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Evidence Completeness</CardTitle>
            <CardDescription className="text-xs">
              Evidence completeness determines whether suppliers can proceed through approval and procurement gating.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Portfolio Average</span>
                <span className="font-semibold text-foreground">{stats.avgEvidenceCompleteness}%</span>
              </div>
              <Progress
                value={stats.avgEvidenceCompleteness}
                className={cn(
                  "h-3",
                  stats.avgEvidenceCompleteness >= 75
                    ? "[&>[data-slot=progress-indicator]]:bg-success"
                    : stats.avgEvidenceCompleteness >= 55
                    ? "[&>[data-slot=progress-indicator]]:bg-warning"
                    : "[&>[data-slot=progress-indicator]]:bg-destructive"
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border bg-destructive/5 px-3 py-2.5 text-center">
                <p className="text-2xl font-bold text-destructive">{belowThreshold}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Below 60%</p>
                <p className="text-[10px] text-muted-foreground">requires attention</p>
              </div>
              <div className="rounded-md border bg-success/5 px-3 py-2.5 text-center">
                <p className="text-2xl font-bold text-success">{aboveTarget}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Above 85%</p>
                <p className="text-[10px] text-muted-foreground">meeting target</p>
              </div>
            </div>
            <div className="rounded-md bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
              Missing critical evidence blocks supplier approval regardless of risk score. Suppliers below 60% with High criticality are automatically flagged for review.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers needing action */}
      <Card>
        <CardHeader className="pb-3">
          <SectionHeader
            title="Suppliers Needing Action"
            description={config.actionDescription}
          />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Supplier</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Country</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Risk</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Evidence</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Remediation</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Required Action</th>
                </tr>
              </thead>
              <tbody>
                {actionSuppliers.map((supplier, i) => (
                  <tr
                    key={supplier.id}
                    className={cn(
                      "border-b last:border-0",
                      i % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground leading-tight">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">{supplier.owner}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {supplier.country}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {supplier.category}
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge level={supplier.riskLevel} score={supplier.riskScore} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <Progress
                          value={supplier.evidenceCompleteness}
                          className={cn(
                            "h-1.5 w-12",
                            supplier.evidenceCompleteness >= 75
                              ? "[&>[data-slot=progress-indicator]]:bg-success"
                              : supplier.evidenceCompleteness >= 50
                              ? "[&>[data-slot=progress-indicator]]:bg-warning"
                              : "[&>[data-slot=progress-indicator]]:bg-destructive"
                          )}
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {supplier.evidenceCompleteness}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RemediationBadge status={supplier.remediationStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
                        {supplier.requiredActions[0] ?? "No pending actions"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card>
        <CardHeader className="pb-3">
          <SectionHeader title="Recent Activity" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentActivity.map((item, index) => {
              const Icon = activityIcons[item.type];
              return (
                <div key={item.id}>
                  <div className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/50 transition-colors">
                    <div
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full bg-muted",
                        activityIconColors[item.type]
                      )}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{item.supplier}</span>
                        {" — "}
                        <span className="text-muted-foreground">{item.action}</span>
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.timestamp}
                    </span>
                  </div>
                  {index < recentActivity.length - 1 && (
                    <div className="ml-[44px] h-px bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
