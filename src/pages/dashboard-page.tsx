import {
  Building2,
  AlertTriangle,
  FileCheck2,
  Clock,
  CheckCircle2,
  FilePlus2,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatCard } from "@/components/shared/stat-card";
import { SectionHeader } from "@/components/shared/section-header";
import { RiskBadge } from "@/components/shared/risk-badge";
import {
  dashboardStats,
  mockSuppliers,
  recentActivity,
  riskDistribution,
} from "@/data/mock-data";
import type { ActivityItem, Role } from "@/types";
import { cn } from "@/lib/utils";

const activityIcons: Record<ActivityItem["type"], React.ElementType> = {
  evidence: FilePlus2,
  overdue: AlertTriangle,
  risk: TrendingUp,
  onboarded: UserPlus,
  approved: CheckCircle2,
};

const activityIconColors: Record<ActivityItem["type"], string> = {
  evidence: "text-primary",
  overdue: "text-destructive",
  risk: "text-warning",
  onboarded: "text-success",
  approved: "text-success",
};

const roleConfig: Record<
  Role,
  {
    pageDescription: string;
    needsActionDescription: string;
    alertMessage: string | null;
  }
> = {
  procurement: {
    pageDescription:
      "Monitor supplier risk exposure, track sourcing decisions, and follow up on overdue remediation across your supply chain.",
    needsActionDescription:
      "Suppliers requiring sourcing review or remediation follow-up",
    alertMessage: null,
  },
  "esg-analyst": {
    pageDescription:
      "Review evidence quality, apply policy rules, and maintain audit-ready compliance records across the supplier portfolio.",
    needsActionDescription:
      "Suppliers with evidence gaps or compliance policy flags",
    alertMessage:
      "ESG Analyst view: Action Queue and Methodology & Trust Center are your primary workspaces for evidence review and policy governance.",
  },
  supplier: {
    pageDescription:
      "Internal risk overview. As a Supplier User, your primary workspace is the Supplier Portal.",
    needsActionDescription: "Suppliers currently flagged for attention",
    alertMessage:
      "Demo role view: Supplier users would not normally access this internal dashboard. Your primary workspace is the Supplier Portal.",
  },
};

interface DashboardPageProps {
  role: Role;
}

export function DashboardPage({ role }: DashboardPageProps) {
  const needsAction = mockSuppliers.filter(
    (s) => s.riskLevel === "high" || s.remediationStatus === "overdue"
  );
  const config = roleConfig[role];

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

      <SectionHeader
        title="Dashboard"
        description={config.pageDescription}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Suppliers"
          value={dashboardStats.totalSuppliers}
          description="Across all categories"
          icon={<Building2 className="size-4" />}
        />
        <StatCard
          label="High-Risk Suppliers"
          value={dashboardStats.highRiskSuppliers}
          trend="↑ 3 since last quarter"
          trendUp={false}
          icon={<AlertTriangle className="size-4" />}
          accentClassName="bg-destructive/10 text-destructive"
        />
        <StatCard
          label="Evidence Completion"
          value={`${dashboardStats.evidenceCompletionRate}%`}
          trend="↑ 8% from last month"
          trendUp={true}
          icon={<FileCheck2 className="size-4" />}
          accentClassName="bg-success/10 text-success"
        />
        <StatCard
          label="Overdue Remediation"
          value={dashboardStats.overdueRemediationPlans}
          description="Plans requiring attention"
          icon={<Clock className="size-4" />}
          accentClassName="bg-warning/10 text-warning"
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Suppliers needing action */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <SectionHeader
              title="Suppliers Needing Action"
              description={config.needsActionDescription}
            />
          </CardHeader>
          <CardContent className="space-y-3">
            {needsAction.map((supplier) => (
              <div
                key={supplier.id}
                className="flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {supplier.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {supplier.category} · {supplier.country}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <RiskBadge
                    level={supplier.riskLevel}
                    score={supplier.riskScore}
                  />
                  {supplier.remediationStatus === "overdue" && (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 text-xs"
                    >
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Risk distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskDistribution.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground">
                    {item.count} suppliers ({item.percentage}%)
                  </span>
                </div>
                <Progress
                  value={item.percentage}
                  className={cn(
                    "h-2",
                    item.label === "High Risk" &&
                      "[&>[data-slot=progress-indicator]]:bg-destructive",
                    item.label === "Medium Risk" &&
                      "[&>[data-slot=progress-indicator]]:bg-warning",
                    item.label === "Low Risk" &&
                      "[&>[data-slot=progress-indicator]]:bg-success"
                  )}
                />
              </div>
            ))}

            <div className="mt-2 rounded-md bg-muted px-3 py-2.5 text-xs text-muted-foreground">
              Based on deterministic risk scoring across 47 monitored suppliers
            </div>
          </CardContent>
        </Card>
      </div>

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
                        <span className="text-muted-foreground">
                          {item.action}
                        </span>
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
