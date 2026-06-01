import { AlertCircle, AlertTriangle, FileX, Clock, SearchCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/section-header";
import { RiskBadge } from "@/components/shared/risk-badge";
import { RemediationBadge } from "@/components/shared/remediation-badge";
import { suppliers } from "@/data/suppliers";
import type { Role, Supplier } from "@/types";
import { cn } from "@/lib/utils";

interface ActionQueuePageProps {
  role: Role;
  onOpenSupplier: (id: string) => void;
}

const roleDescriptions: Record<Role, string> = {
  procurement:
    "Suppliers requiring sourcing review, overdue remediation follow-up, or escalation decisions.",
  "esg-analyst":
    "Evidence gaps, policy flags, and compliance items requiring your review or decision.",
  supplier:
    "Demo view: Action Queue is an internal workspace. Supplier users manage evidence and milestones via the Supplier Portal.",
};

interface ActionGroup {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  headerColor: string;
  suppliers: Supplier[];
  reasonFn: (s: Supplier) => string;
}

function ActionCard({
  supplier,
  reason,
  onView,
}: {
  supplier: Supplier;
  reason: string;
  onView: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3 hover:bg-muted/30 transition-colors">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-sm text-foreground">{supplier.name}</span>
          <RiskBadge level={supplier.riskLevel} score={supplier.riskScore} />
          <RemediationBadge status={supplier.remediationStatus} />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{supplier.country} · {supplier.category}</span>
          <span>Owner: {supplier.owner}</span>
          {supplier.nextReviewDate && (
            <span>Review: {supplier.nextReviewDate}</span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 gap-1.5 text-xs h-8"
        onClick={onView}
      >
        View supplier
        <ArrowRight className="size-3" />
      </Button>
    </div>
  );
}

export function ActionQueuePage({ role, onOpenSupplier }: ActionQueuePageProps) {
  // Critical / High risk
  const highRisk = suppliers
    .filter((s) => s.riskLevel === "critical" || s.riskLevel === "high")
    .sort((a, b) => b.riskScore - a.riskScore);

  // Overdue remediation
  const overdueRemediation = suppliers
    .filter((s) => s.remediationStatus === "overdue" || s.remediationStatus === "escalated")
    .sort((a, b) => b.riskScore - a.riskScore);

  // Low evidence completeness
  const lowEvidence = suppliers
    .filter((s) => s.evidenceCompleteness < 60)
    .sort((a, b) => a.evidenceCompleteness - b.evidenceCompleteness);

  // Review required (high criticality + evidence gaps)
  const reviewRequired = suppliers
    .filter(
      (s) =>
        s.criticality === "High" &&
        s.evidenceCompleteness < 75 &&
        !overdueRemediation.includes(s) &&
        !highRisk.includes(s)
    )
    .sort((a, b) => a.evidenceCompleteness - b.evidenceCompleteness);

  const actionGroups: ActionGroup[] = [
    {
      id: "critical-high-risk",
      title: "Critical & High Risk Suppliers",
      description:
        role === "esg-analyst"
          ? "Suppliers with critical or high risk scores requiring evidence review and compliance assessment."
          : "Suppliers with critical or high risk scores requiring sourcing review or escalation.",
      icon: AlertTriangle,
      iconColor: "text-destructive",
      headerColor: "border-destructive/20",
      suppliers: highRisk,
      reasonFn: (s) =>
        s.riskDrivers.length > 0
          ? s.riskDrivers[0]
          : `Risk score ${s.riskScore} — above action threshold`,
    },
    {
      id: "overdue-remediation",
      title: "Overdue & Escalated Remediation",
      description: "Remediation plans past their due date or escalated for senior review.",
      icon: Clock,
      iconColor: "text-destructive",
      headerColor: "border-destructive/20",
      suppliers: overdueRemediation,
      reasonFn: (s) =>
        s.requiredActions.length > 0
          ? s.requiredActions[0]
          : `Remediation ${s.remediationStatus} — follow-up required`,
    },
    {
      id: "low-evidence",
      title: "Evidence Gaps",
      description:
        role === "esg-analyst"
          ? "Suppliers below 60% evidence completeness. Review and request missing documentation."
          : "Suppliers with incomplete evidence. Sourcing decisions may be blocked until resolved.",
      icon: FileX,
      iconColor: "text-warning",
      headerColor: "border-warning/20",
      suppliers: lowEvidence,
      reasonFn: (s) => `Evidence completeness at ${s.evidenceCompleteness}% — below 60% threshold`,
    },
    {
      id: "review-required",
      title: "Review Required",
      description: "High-criticality suppliers with evidence gaps flagged for manual compliance review.",
      icon: SearchCheck,
      iconColor: "text-primary",
      headerColor: "border-primary/20",
      suppliers: reviewRequired,
      reasonFn: (s) =>
        `High-criticality supplier with ${s.evidenceCompleteness}% evidence completeness`,
    },
  ];

  const totalItems = actionGroups.reduce((acc, g) => acc + g.suppliers.length, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Action Queue"
        description={roleDescriptions[role]}
      />

      {role === "supplier" && (
        <Alert className="border-warning/30 bg-warning/5">
          <AlertCircle className="size-4 text-warning" />
          <AlertDescription className="text-sm text-muted-foreground">
            Demo role view: Supplier users would not normally access this
            internal queue. Your evidence requests and remediation milestones
            are managed in the Supplier Portal.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
          {totalItems} items requiring attention
        </Badge>
      </div>

      <div className="space-y-4">
        {actionGroups.map((group) => {
          if (group.suppliers.length === 0) return null;
          const Icon = group.icon;
          return (
            <Card key={group.id} className={cn("border", group.headerColor)}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Icon className={cn("size-4", group.iconColor)} />
                  {group.title}
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] h-4 px-1.5 bg-muted text-muted-foreground"
                  >
                    {group.suppliers.length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {group.suppliers.map((supplier) => (
                  <ActionCard
                    key={supplier.id}
                    supplier={supplier}
                    reason={group.reasonFn(supplier)}
                    onView={() => onOpenSupplier(supplier.id)}
                  />
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
