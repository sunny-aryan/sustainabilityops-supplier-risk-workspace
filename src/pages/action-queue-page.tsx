import { AlertTriangle, FileX, SearchCheck, ArrowRight, AlertOctagon, MessageSquare, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/section-header";
import { RiskBadge } from "@/components/shared/risk-badge";
import { RemediationBadge } from "@/components/shared/remediation-badge";
import { RoleContextBanner } from "@/components/shared/role-context-banner";
import { suppliers } from "@/data/suppliers";
import { useRemediationStore } from "@/utils/remediation";
import type { DemoMode } from "@/utils/demoState";
import type { Page, Role, Supplier, RemediationPlan } from "@/types";
import { cn } from "@/lib/utils";

interface ActionQueuePageProps {
  role: Role;
  demoMode: DemoMode;
  onOpenSupplier: (id: string) => void;
  onNavigate?: (page: Page) => void;
  remediationStore: ReturnType<typeof useRemediationStore>;
}

const roleDescriptions: Record<Role, string> = {
  procurement:
    "Suppliers requiring sourcing review, overdue remediation follow-up, or escalation decisions.",
  "esg-analyst":
    "Evidence gaps, policy flags, compliance items, and supplier responses requiring your review or decision.",
  supplier:
    "Demo view: Action Queue is an internal workspace. Supplier users manage evidence and milestones via the Supplier Portal.",
};

interface ActionGroup {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  headerBorderColor: string;
  items: Array<{ supplier: Supplier; reason: string; plan?: RemediationPlan }>;
}

function ActionCard({
  supplier,
  reason,
  plan,
  onView,
}: {
  supplier: Supplier;
  reason: string;
  plan?: RemediationPlan;
  onView: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3 hover:bg-muted/30 transition-colors">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-sm text-foreground">{supplier.name}</span>
          <RiskBadge level={supplier.riskLevel} score={supplier.riskScore} />
          <RemediationBadge status={supplier.remediationStatus} />
          {plan && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] h-4 px-1.5",
                plan.status === "Escalated"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : plan.status === "Supplier Responded"
                  ? "bg-success/10 text-success border-success/20"
                  : plan.status === "Overdue"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {plan.status}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{supplier.country} · {supplier.category}</span>
          <span>Owner: {supplier.owner}</span>
          {supplier.nextReviewDate && <span>Review: {supplier.nextReviewDate}</span>}
          {plan && (
            <span>Plan due: {plan.dueDate}</span>
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

export function ActionQueuePage({ role, demoMode, onOpenSupplier, onNavigate, remediationStore }: ActionQueuePageProps) {
  const { plans } = remediationStore;
  const effectiveSuppliers = demoMode === "empty-portfolio" ? [] : suppliers;
  const effectivePlans = demoMode === "empty-portfolio" ? [] : plans;

  // ── Build workflow-aware groups ────────────────────────────────────────────

  // Overdue & Escalated plans
  const overdueItems = effectivePlans
    .filter((p) => p.status === "Overdue" || p.status === "Escalated")
    .map((p) => {
      const s = effectiveSuppliers.find((s) => s.id === p.supplierId)!;
      return {
        supplier: s,
        reason:
          p.status === "Overdue"
            ? `Remediation plan overdue — past due date ${p.dueDate}. Automatic escalation applied.`
            : `Escalated — senior ESG review required. Plan: "${p.title}"`,
        plan: p,
      };
    })
    .filter((x) => x.supplier);

  // Supplier responded — needs internal review
  const respondedItems = effectivePlans
    .filter((p) => p.status === "Supplier Responded")
    .map((p) => {
      const s = effectiveSuppliers.find((s) => s.id === p.supplierId)!;
      const submittedMilestones = p.milestones.filter((m) => m.status === "Submitted").length;
      return {
        supplier: s,
        reason: `Supplier responded to remediation plan. ${submittedMilestones} milestone${submittedMilestones !== 1 ? "s" : ""} submitted and awaiting review.`,
        plan: p,
      };
    })
    .filter((x) => x.supplier);

  // Blocking evidence missing (no remediation plan item already covers this)
  const blockingEvidenceItems = effectiveSuppliers
    .filter(
      (s) =>
        (s.evidenceCompleteness < 60 || s.riskLevel === "critical" || s.riskLevel === "high") &&
        !overdueItems.some((x) => x.supplier.id === s.id) &&
        !respondedItems.some((x) => x.supplier.id === s.id)
    )
    .sort((a, b) => a.evidenceCompleteness - b.evidenceCompleteness)
    .slice(0, 5)
    .map((s) => ({
      supplier: s,
      reason: `Evidence completeness at ${s.evidenceCompleteness}% — approval-blocking items may be outstanding.`,
      plan: effectivePlans.find((p) => p.supplierId === s.id),
    }));

  // Review required: high-criticality + evidence gaps (not already in above groups)
  const reviewItems = effectiveSuppliers
    .filter(
      (s) =>
        s.criticality === "High" &&
        s.evidenceCompleteness < 75 &&
        s.evidenceCompleteness >= 60 &&
        !overdueItems.some((x) => x.supplier.id === s.id) &&
        !respondedItems.some((x) => x.supplier.id === s.id) &&
        !blockingEvidenceItems.some((x) => x.supplier.id === s.id)
    )
    .map((s) => ({
      supplier: s,
      reason: `High-criticality supplier with ${s.evidenceCompleteness}% evidence completeness. Manual compliance review recommended.`,
      plan: effectivePlans.find((p) => p.supplierId === s.id),
    }));

  const actionGroups: ActionGroup[] = [
    {
      id: "overdue-escalated",
      title: "Overdue & Escalated",
      description:
        role === "esg-analyst"
          ? "Overdue remediation: plans past due date and not complete. Escalated plans require senior ESG review before they can progress. Rule: past due date → overdue flag; escalated flag → analyst review required."
          : "Remediation plans past their due date or escalated for senior ESG review. Rule: overdue plans are automatically flagged and appear here until resolved.",
      icon: AlertOctagon,
      iconColor: "text-destructive",
      headerBorderColor: "border-destructive/20",
      items: overdueItems,
    },
    {
      id: "supplier-responded",
      title: "Supplier Response Received",
      description:
        "Supplier has submitted evidence or milestone responses. Rule: supplier submission moves status to Under Review — not automatically Complete. Internal review is required before evidence counts toward completeness.",
      icon: MessageSquare,
      iconColor: "text-success",
      headerBorderColor: "border-success/20",
      items: respondedItems,
    },
    {
      id: "blocking-evidence",
      title: "Blocking Evidence Missing",
      description:
        role === "esg-analyst"
          ? "Blocking evidence missing: mandatory evidence is Missing or Expired. Rule: missing or expired approval-blocking evidence triggers a procurement hold regardless of risk score. Review and request missing documentation."
          : "Mandatory evidence is Missing or Expired. Rule: approval-blocking evidence gaps prevent procurement decisions from proceeding until resolved.",
      icon: FileX,
      iconColor: "text-warning",
      headerBorderColor: "border-warning/20",
      items: blockingEvidenceItems,
    },
    {
      id: "review-required",
      title: "Review Required",
      description:
        "Deterministic policy rule triggered: High-criticality supplier with evidence completeness 60–74%. Rule: evidence < 75% AND criticality = High → manual compliance review required. No blocking hold is active, but analyst review is needed.",
      icon: SearchCheck,
      iconColor: "text-primary",
      headerBorderColor: "border-primary/20",
      items: reviewItems,
    },
  ];

  // Legacy: high-risk suppliers not in any group above
  const highRiskSuppliers = effectiveSuppliers
    .filter(
      (s) =>
        (s.riskLevel === "critical" || s.riskLevel === "high") &&
        !overdueItems.some((x) => x.supplier.id === s.id) &&
        !respondedItems.some((x) => x.supplier.id === s.id) &&
        !blockingEvidenceItems.some((x) => x.supplier.id === s.id) &&
        !reviewItems.some((x) => x.supplier.id === s.id)
    )
    .sort((a, b) => b.riskScore - a.riskScore);

  if (highRiskSuppliers.length > 0) {
    actionGroups.unshift({
      id: "critical-high-risk",
      title: "Critical & High Risk Suppliers",
      description:
        role === "esg-analyst"
          ? "Risk score ≥ 75 (deterministic threshold). These suppliers require evidence review and compliance assessment. Rule: score ≥ 90 = Critical, score ≥ 75 = High."
          : "Risk score ≥ 75 (deterministic threshold). Rule: score ≥ 90 = Critical risk, score ≥ 75 = High risk. These suppliers require sourcing review or escalation decision.",
      icon: AlertTriangle,
      iconColor: "text-destructive",
      headerBorderColor: "border-destructive/20",
      items: highRiskSuppliers.map((s) => ({
        supplier: s,
        reason:
          s.riskDrivers.length > 0
            ? s.riskDrivers[0]
            : `Risk score ${s.riskScore} — above action threshold`,
        plan: effectivePlans.find((p) => p.supplierId === s.id),
      })),
    });
  }

  const totalItems = actionGroups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="space-y-6">
      <RoleContextBanner role={role} />
      <SectionHeader title="Action Queue" description={roleDescriptions[role]} />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
            {totalItems} items requiring attention
          </Badge>
          {respondedItems.length > 0 && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
              {respondedItems.length} supplier response{respondedItems.length > 1 ? "s" : ""} to review
            </Badge>
          )}
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate("methodology")}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="size-3" />
            View policy rules
          </button>
        )}
      </div>

      <div className="space-y-4">
        {totalItems === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <SearchCheck className="size-10 text-success/40" />
              <div>
                <p className="text-sm font-medium text-foreground">No items require attention</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {demoMode === "empty-portfolio"
                    ? "Empty portfolio demo mode is active. Add suppliers to begin monitoring."
                    : "All suppliers are within acceptable thresholds. Check back after the next scheduled review."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          actionGroups.map((group) => {
          if (group.items.length === 0) return null;
          const Icon = group.icon;
          return (
            <Card key={group.id} className={cn("border", group.headerBorderColor)}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Icon className={cn("size-4", group.iconColor)} />
                  {group.title}
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] h-4 px-1.5 bg-muted text-muted-foreground"
                  >
                    {group.items.length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {group.items.map(({ supplier, reason, plan }) => (
                  <ActionCard
                    key={supplier.id}
                    supplier={supplier}
                    reason={reason}
                    plan={plan}
                    onView={() => onOpenSupplier(supplier.id)}
                  />
                ))}
              </CardContent>
            </Card>
          );
        })
        )}
      </div>
    </div>
  );
}
