import {
  ArrowLeft,
  MapPin,
  Tag,
  Euro,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  FileCheck2,
  ClipboardList,
  FileX,
  Clock,
  BrainCircuit,
  FileSearch,
  Cpu,
  Building2,
  Send,
  AlertOctagon,
  MessageSquare,
  CheckSquare,
  WifiOff,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiskBadge } from "@/components/shared/risk-badge";
import { RemediationBadge } from "@/components/shared/remediation-badge";
import { suppliers } from "@/data/suppliers";
import { getEvidenceForSupplier } from "@/data/evidence";
import { getComplianceMappingsForSupplier } from "@/data/complianceMappings";
import { getTimelineForSupplier } from "@/data/activityTimeline";
import { useState } from "react";
import { canCompleteMilestone, canEscalatePlan, canSendToSupplier, isProcurementBlocked, useRemediationStore } from "@/utils/remediation";
import type { DemoMode } from "@/utils/demoState";
import { toast } from "sonner";
import type {
  Role,
  EvidenceItemStatus,
  ComplianceReadiness,
  ComplianceApplicability,
  TimelineEventSource,
  TimelineEventType,
  MilestoneStatus,
  RemediationPlan,
  Supplier,
} from "@/types";
import { cn } from "@/lib/utils";

// ─── Prop types ────────────────────────────────────────────────────────────────

interface SupplierDetailPageProps {
  supplierId: string;
  role: Role;
  demoMode: DemoMode;
  onBack: () => void;
  onNavigateToMethodology?: () => void;
  remediationStore: ReturnType<typeof useRemediationStore>;
}

// ─── Status badge helpers ───────────────────────────────────────────────────────

const evidenceStatusConfig: Record<
  EvidenceItemStatus,
  { label: string; className: string }
> = {
  Complete: { label: "Complete", className: "bg-success/10 text-success border-success/20" },
  Missing: { label: "Missing", className: "bg-destructive/10 text-destructive border-destructive/20" },
  Expired: { label: "Expired", className: "bg-destructive/10 text-destructive border-destructive/20" },
  "Under Review": { label: "Under Review", className: "bg-primary/10 text-primary border-primary/20" },
  Requested: { label: "Requested", className: "bg-warning/10 text-warning border-warning/20" },
};

const readinessConfig: Record<
  ComplianceReadiness,
  { label: string; className: string }
> = {
  Ready: { label: "Ready", className: "bg-success/10 text-success border-success/20" },
  "Evidence Gap": { label: "Evidence Gap", className: "bg-warning/10 text-warning border-warning/20" },
  "Review Required": { label: "Review Required", className: "bg-primary/10 text-primary border-primary/20" },
  Blocked: { label: "Blocked", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const applicabilityConfig: Record<
  ComplianceApplicability,
  { label: string; className: string }
> = {
  Applicable: { label: "Applicable", className: "bg-foreground/10 text-foreground border-border" },
  "Possibly Applicable": { label: "Possibly Applicable", className: "bg-muted text-muted-foreground border-border" },
  "Not Applicable": { label: "Not Applicable", className: "bg-muted/50 text-muted-foreground/60 border-border/50" },
};

const timelineSourceConfig: Record<
  TimelineEventSource,
  { label: string; className: string }
> = {
  System: { label: "System", className: "bg-muted text-muted-foreground" },
  "ESG Analyst": { label: "ESG Analyst", className: "bg-primary/10 text-primary" },
  "Procurement Manager": { label: "Procurement", className: "bg-warning/10 text-warning" },
  "Supplier User": { label: "Supplier", className: "bg-success/10 text-success" },
  "AI Draft": { label: "AI Draft", className: "bg-muted text-muted-foreground border border-border" },
};

const timelineEventIcons: Record<TimelineEventType, React.ElementType> = {
  evidence_requested: FileSearch,
  evidence_submitted: FileCheck2,
  risk_recalculated: ShieldAlert,
  remediation_overdue: Clock,
  finding_flagged: AlertTriangle,
  approval_blocked: ShieldAlert,
  ai_draft_generated: BrainCircuit,
  review_completed: CheckCircle2,
  supplier_onboarded: Building2,
  policy_triggered: ShieldAlert,
};

const timelineEventIconColors: Record<TimelineEventType, string> = {
  evidence_requested: "text-primary",
  evidence_submitted: "text-success",
  risk_recalculated: "text-warning",
  remediation_overdue: "text-destructive",
  finding_flagged: "text-destructive",
  approval_blocked: "text-destructive",
  ai_draft_generated: "text-muted-foreground",
  review_completed: "text-success",
  supplier_onboarded: "text-primary",
  policy_triggered: "text-destructive",
};

// ─── Milestone status config ─────────────────────────────────────────────────────

const milestoneStatusConfig: Record<MilestoneStatus, { label: string; className: string }> = {
  "Not Started": { label: "Not Started", className: "bg-muted text-muted-foreground border-border" },
  Requested: { label: "Requested", className: "bg-warning/10 text-warning border-warning/20" },
  Submitted: { label: "Submitted", className: "bg-primary/10 text-primary border-primary/20" },
  "Under Review": { label: "Under Review", className: "bg-primary/10 text-primary border-primary/20" },
  Complete: { label: "Complete", className: "bg-success/10 text-success border-success/20" },
  Blocked: { label: "Blocked", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const planStatusConfig: Record<string, { label: string; className: string }> = {
  Draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
  "Sent to Supplier": { label: "Sent to Supplier", className: "bg-primary/10 text-primary border-primary/20" },
  "In Progress": { label: "In Progress", className: "bg-primary/10 text-primary border-primary/20" },
  "Supplier Responded": { label: "Supplier Responded", className: "bg-success/10 text-success border-success/20" },
  "Under Review": { label: "Under Review", className: "bg-primary/10 text-primary border-primary/20" },
  Complete: { label: "Complete", className: "bg-success/10 text-success border-success/20" },
  Escalated: { label: "Escalated", className: "bg-destructive/10 text-destructive border-destructive/20" },
  Overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

// ─── Remediation Workflow Tab component ──────────────────────────────────────────

interface RemediationWorkflowTabProps {
  supplier: Supplier;
  plan: RemediationPlan | null;
  role: Role;
  isApprovalBlocked: boolean;
  blockingMissing: Array<{ evidenceName: string }>;
  remediationStore: ReturnType<typeof useRemediationStore>;
}

function RemediationWorkflowTab({
  supplier,
  plan,
  role,
  isApprovalBlocked: _isApprovalBlocked,
  blockingMissing,
  remediationStore,
}: RemediationWorkflowTabProps) {
  const actorName =
    role === "procurement"
      ? "Procurement Manager"
      : role === "esg-analyst"
      ? "ESG Analyst"
      : supplier.name;

  function handleEscalate() {
    if (!plan) return;
    remediationStore.escalatePlan(plan.id, actorName);
    toast.warning("Remediation plan escalated", {
      description: "Escalation flag applied. Senior ESG review required before this plan can progress.",
    });
  }

  function handleSendToSupplier() {
    if (!plan) return;
    remediationStore.sendToSupplier(plan.id, actorName);
    toast.success("Plan sent to supplier", {
      description: `Remediation request sent to ${plan.supplierContact}.`,
    });
  }

  function handleMarkSupplierResponded() {
    if (!plan) return;
    remediationStore.markSupplierResponded(plan.id);
    toast.success("Supplier response recorded");
  }

  function handleMilestoneAction(milestoneId: string, newStatus: MilestoneStatus) {
    if (!plan) return;
    if (newStatus === "Complete") {
      const check = canCompleteMilestone(plan, milestoneId);
      if (!check.allowed) {
        toast.error("Cannot complete milestone", { description: check.reason });
        return;
      }
    }
    remediationStore.updateMilestoneStatus(
      plan.id,
      milestoneId,
      newStatus,
      actorName,
      role === "esg-analyst" ? "ESG Analyst" : "Procurement Manager"
    );
    toast.success(`Milestone updated to ${newStatus}`);
  }

  if (!plan) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Remediation Workflow</h2>
          <p className="text-xs text-muted-foreground mt-0.5">No active remediation plan for this supplier.</p>
        </div>
        <Card className="border-muted-foreground/20">
          <CardContent className="py-8 text-center">
            <ClipboardList className="size-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No remediation plan assigned</p>
          </CardContent>
        </Card>
        <Alert className="border-muted bg-muted/30 py-2.5">
          <Info className="size-3.5 text-muted-foreground" />
          <AlertDescription className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">AI boundary:</span> AI can summarize and draft. Deterministic rules govern blocked actions, status transitions, and approval eligibility.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const planBlocked = isProcurementBlocked(plan);
  const statusCfg = planStatusConfig[plan.status] ?? { label: plan.status, className: "bg-muted text-muted-foreground" };
  const completedMilestones = plan.milestones.filter((m) => m.status === "Complete").length;
  const totalMilestones = plan.milestones.length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Remediation Workflow</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Track milestones, evidence submissions, and approval gates.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canSendToSupplier(plan) && role !== "supplier" && (
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={handleSendToSupplier}>
              <Send className="size-3" />
              Send to Supplier
            </Button>
          )}
          {canEscalatePlan(plan) && role === "esg-analyst" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs h-8 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={handleEscalate}
            >
              <AlertOctagon className="size-3" />
              Escalate
            </Button>
          )}
        </div>
      </div>

      {planBlocked && (
        <Alert className="border-destructive/30 bg-destructive/5">
          <ShieldAlert className="size-4 text-destructive" />
          <AlertTitle className="text-sm font-semibold text-destructive">Procurement approval is blocked</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            Required milestones are incomplete.
            {blockingMissing.length > 0 && ` Missing evidence: ${blockingMissing.map((e) => e.evidenceName).join(", ")}.`}
          </AlertDescription>
        </Alert>
      )}

      {plan.status === "Escalated" && (
        <Alert className="border-destructive/30 bg-destructive/5">
          <AlertOctagon className="size-4 text-destructive" />
          <AlertTitle className="text-sm font-semibold text-destructive">Escalated — senior ESG review required</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            This plan has been escalated. ESG / Compliance Analyst review is required before it can progress.
          </AlertDescription>
        </Alert>
      )}

      {plan.status === "Overdue" && (
        <Alert className="border-destructive/30 bg-destructive/5">
          <Clock className="size-4 text-destructive" />
          <AlertTitle className="text-sm font-semibold text-destructive">Remediation overdue</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            Past due date ({plan.dueDate}). Automatic escalation flag applied.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Plan Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            {[
              { label: "Status", value: <Badge variant="outline" className={cn("text-xs", statusCfg.className)}>{statusCfg.label}</Badge> },
              { label: "Severity", value: plan.severity },
              { label: "Owner", value: plan.owner },
              { label: "Supplier contact", value: plan.supplierContact },
              { label: "Due date", value: plan.dueDate },
              { label: "Progress", value: `${completedMilestones} / ${totalMilestones} milestones` },
            ].map((row, i, arr) => (
              <div key={row.label}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">{row.label}</span>
                  <span className="font-medium text-foreground text-right text-xs">{row.value}</span>
                </div>
                {i < arr.length - 1 && <Separator className="mt-2.5" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Issue Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">{plan.issueSummary}</p>
            {plan.requestedActions.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-foreground">Requested actions:</p>
                <ul className="space-y-1">
                  {plan.requestedActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Milestone progress</span>
          <span>{completedMilestones}/{totalMilestones} complete</span>
        </div>
        <Progress
          value={totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}
          className={cn(
            "h-1.5",
            completedMilestones === totalMilestones
              ? "[&>[data-slot=progress-indicator]]:bg-success"
              : planBlocked
              ? "[&>[data-slot=progress-indicator]]:bg-destructive"
              : "[&>[data-slot=progress-indicator]]:bg-primary"
          )}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ClipboardList className="size-4 text-muted-foreground" />
            Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {plan.milestones.map((milestone) => {
            const mStatus = milestoneStatusConfig[milestone.status];
            const canComplete = canCompleteMilestone(plan, milestone.id);
            const isAnalystOwned = milestone.owner === "ESG / Compliance Analyst";
            const isSupplierOwned = milestone.owner === "Supplier User";

            return (
              <div
                key={milestone.id}
                className={cn(
                  "rounded-md border px-4 py-3 space-y-2",
                  milestone.blocksApproval && milestone.status !== "Complete"
                    ? "border-destructive/30 bg-destructive/5"
                    : "bg-card"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground leading-tight">{milestone.title}</p>
                      {milestone.blocksApproval && milestone.status !== "Complete" && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 bg-destructive/10 text-destructive border-destructive/20 shrink-0">
                          Blocks approval
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>Due {milestone.dueDate}</span>
                      <span>·</span>
                      <span>{milestone.owner}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={cn("text-xs", mStatus.className)}>
                      {mStatus.label}
                    </Badge>
                    {isAnalystOwned && milestone.status === "Under Review" && role === "esg-analyst" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1 border-success/40 text-success hover:bg-success/10"
                        onClick={() => handleMilestoneAction(milestone.id, "Complete")}
                      >
                        <CheckSquare className="size-3" />
                        Approve
                      </Button>
                    )}
                    {isSupplierOwned && milestone.status === "Submitted" && role !== "supplier" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleMilestoneAction(milestone.id, "Under Review")}>
                        Start Review
                      </Button>
                    )}
                    {isSupplierOwned && milestone.status === "Not Started" && role !== "supplier" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleMilestoneAction(milestone.id, "Requested")}>
                        Request
                      </Button>
                    )}
                  </div>
                </div>
                {!canComplete.allowed && milestone.status === "Under Review" && (
                  <p className="text-xs text-muted-foreground italic">{canComplete.reason}</p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {(plan.status === "Sent to Supplier" || plan.status === "In Progress") && role !== "supplier" && (
        <Alert className="border-primary/20 bg-primary/5">
          <MessageSquare className="size-4 text-primary" />
          <AlertDescription className="text-xs text-muted-foreground flex items-center justify-between gap-3">
            <span>Awaiting supplier response.</span>
            <Button size="sm" variant="outline" className="h-7 text-xs shrink-0" onClick={handleMarkSupplierResponded}>
              Mark Responded
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {plan.messages.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="size-4 text-muted-foreground" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.messages.map((msg) => (
              <div key={msg.id} className="space-y-1 border-l-2 border-border pl-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{msg.author}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{msg.date}</span>
                  <Badge variant="outline" className="text-[10px] h-4 px-1 bg-muted text-muted-foreground border-border">{msg.role}</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{msg.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Alert className="border-muted bg-muted/30 py-2.5">
        <Info className="size-3.5 text-muted-foreground" />
        <AlertDescription className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">AI boundary:</span> AI can summarize and draft. Deterministic rules govern blocked actions, status transitions, and approval eligibility. A supplier-submitted item moves to Under Review — not automatically Complete.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// ─── Role-aware context ─────────────────────────────────────────────────────────

const roleActionLabels: Record<Role, string> = {
  procurement: "Sourcing risk review and supplier prioritisation",
  "esg-analyst": "Evidence gap review and compliance assessment",
  supplier: "Evidence submission and remediation milestones",
};

// ─── AI Brief generator (static/deterministic from supplier attributes) ─────────

function generateAIBrief(supplier: ReturnType<typeof suppliers.find>): string {
  if (!supplier) return "";

  const riskLabel =
    supplier.riskLevel === "critical"
      ? "critical risk"
      : supplier.riskLevel === "high"
      ? "high risk"
      : supplier.riskLevel === "medium"
      ? "medium risk"
      : "low risk";

  const evidenceNote =
    supplier.evidenceCompleteness < 50
      ? `Evidence completeness is critically low at ${supplier.evidenceCompleteness}%, with key approval-blocking documentation missing.`
      : supplier.evidenceCompleteness < 75
      ? `Evidence completeness stands at ${supplier.evidenceCompleteness}%, with several documents pending or under review.`
      : `Evidence completeness is ${supplier.evidenceCompleteness}%, indicating a largely complete documentation set.`;

  const remediationNote =
    supplier.remediationStatus === "overdue"
      ? "The active remediation plan is overdue and has been flagged for escalation."
      : supplier.remediationStatus === "escalated"
      ? "The remediation status has been escalated for senior review."
      : supplier.remediationStatus === "in-progress"
      ? "A remediation plan is in progress."
      : supplier.remediationStatus === "complete"
      ? "All remediation actions have been completed."
      : "No remediation plan has been initiated.";

  const regulatoryNote =
    supplier.regulatoryExposure.length > 0
      ? `This supplier is in scope for: ${supplier.regulatoryExposure.join(", ")}.`
      : "No specific regulatory frameworks identified.";

  const riskDriverNote =
    supplier.riskDrivers.length > 0
      ? `Primary risk factors include: ${supplier.riskDrivers.slice(0, 2).join("; ")}.`
      : "No active risk drivers identified at this time.";

  return (
    `${supplier.name} is a ${supplier.criticality.toLowerCase()}-criticality ${supplier.category.toLowerCase()} supplier based in ${supplier.country} (${supplier.region}), ` +
    `with annual spend of approximately €${(supplier.annualSpendEur / 1_000_000).toFixed(1)}M. ` +
    `The supplier currently carries a ${riskLabel} rating with a risk score of ${supplier.riskScore}/100. ` +
    `${evidenceNote} ` +
    `${remediationNote} ` +
    `${regulatoryNote} ` +
    `${riskDriverNote}`
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function SupplierDetailPage({ supplierId, role, demoMode, onBack, onNavigateToMethodology, remediationStore }: SupplierDetailPageProps) {
  const [retrying, setRetrying] = useState(false);
  const supplier = suppliers.find((s) => s.id === supplierId);

  function handleEvidenceRetry() {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      toast.info("Demo mode: refresh is simulated.", {
        description: "Cached supplier evidence remains available. Real-time source is still offline.",
      });
    }, 1200);
  }

  if (!supplier) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to Suppliers
        </Button>
        <p className="text-sm text-muted-foreground">Supplier not found.</p>
      </div>
    );
  }

  const evidenceList = getEvidenceForSupplier(supplierId);
  const complianceList = getComplianceMappingsForSupplier(supplierId);
  const baseTimeline = getTimelineForSupplier(supplierId);
  const extraTimeline = remediationStore.getExtraTimelineForSupplier(supplierId);
  const timeline = [...extraTimeline, ...baseTimeline].sort((a, b) => b.date.localeCompare(a.date));

  const remediationPlan = remediationStore.plans.find((p) => p.supplierId === supplierId) ?? null;

  const blockingMissing = evidenceList.filter(
    (e) => e.blocksApproval && (e.status === "Missing" || e.status === "Expired")
  );
  const isApprovalBlocked =
    blockingMissing.length > 0 ||
    supplier.remediationStatus === "overdue" ||
    supplier.remediationStatus === "escalated";

  const spendFormatted = new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(supplier.annualSpendEur);

  const evidenceColor =
    supplier.evidenceCompleteness >= 75
      ? "[&>[data-slot=progress-indicator]]:bg-success"
      : supplier.evidenceCompleteness >= 50
      ? "[&>[data-slot=progress-indicator]]:bg-warning"
      : "[&>[data-slot=progress-indicator]]:bg-destructive";

  const aiBrief = generateAIBrief(supplier);

  if (demoMode === "loading") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to Suppliers
        </Button>

        {/* Loading explanatory callout */}
        <Alert className="border-primary/20 bg-primary/5">
          <BrainCircuit className="size-4 text-primary animate-pulse" />
          <AlertTitle className="text-sm font-semibold text-foreground">
            Analyzing supplier risk and evidence status…
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            This simulated loading state represents delayed supplier analysis while layout and navigation remain stable.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-4 border-b pb-5">
          <div className="space-y-3">
            <Skeleton className="h-8 w-56" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-4 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-14" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-9 w-full rounded-none" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3"><Skeleton className="h-4 w-28" /></CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-5/6" />
                  <Skeleton className="h-3.5 w-4/5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Button variant="ghost" size="sm" className="gap-2 -ml-2" onClick={onBack}>
        <ArrowLeft className="size-4" />
        Back to Suppliers
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {supplier.name}
              </h1>
              <Badge variant="outline" className="text-xs text-muted-foreground bg-muted border-border">
                {supplier.id}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {supplier.country}, {supplier.region}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="size-3.5" />
                {supplier.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Euro className="size-3.5" />
                {spendFormatted} annual spend
              </span>
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {supplier.owner}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Review: {supplier.nextReviewDate}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RiskBadge level={supplier.riskLevel} score={supplier.riskScore} />
            <RemediationBadge status={supplier.remediationStatus} />
            <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
              {supplier.criticality} criticality
            </Badge>
          </div>
        </div>

        {/* Approval blocked callout */}
        {isApprovalBlocked && (
          <Alert className="border-destructive/30 bg-destructive/5">
            <ShieldAlert className="size-4 text-destructive" />
            <AlertTitle className="text-sm font-semibold text-destructive">
              Procurement approval is blocked
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              {blockingMissing.length > 0
                ? `Required evidence is missing or expired: ${blockingMissing.map((e) => e.evidenceName).join(", ")}. `
                : ""}
              {(supplier.remediationStatus === "overdue" || supplier.remediationStatus === "escalated")
                ? "Remediation plan is overdue or escalated. "
                : ""}
              Procurement approval cannot proceed until all required evidence is submitted and reviewed.
            </AlertDescription>
          </Alert>
        )}

        {/* Role-aware context */}
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="size-4 text-primary" />
          <AlertDescription className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{roleActionLabels[role]}:</span>{" "}
            {supplier.requiredActions.length > 0
              ? supplier.requiredActions[0]
              : "No immediate actions pending for this supplier."}
          </AlertDescription>
        </Alert>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
              <ShieldAlert className="size-3.5" />
              <span className="text-xs font-medium">Risk Score</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{supplier.riskScore}</p>
            <RiskBadge level={supplier.riskLevel} className="mt-2 text-[10px] h-5" />
            {onNavigateToMethodology && (
              <button
                onClick={onNavigateToMethodology}
                className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="size-2.5" />
                Scoring methodology
              </button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
              <FileCheck2 className="size-3.5" />
              <span className="text-xs font-medium">Evidence</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{supplier.evidenceCompleteness}%</p>
            <Progress value={supplier.evidenceCompleteness} className={cn("h-1.5 mt-2", evidenceColor)} />
            {onNavigateToMethodology && (
              <button
                onClick={onNavigateToMethodology}
                className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="size-2.5" />
                Evidence methodology
              </button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
              <AlertTriangle className="size-3.5" />
              <span className="text-xs font-medium">Open Findings</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{supplier.openFindings}</p>
            <p className="text-xs text-muted-foreground mt-1">unresolved items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
              <ClipboardList className="size-3.5" />
              <span className="text-xs font-medium">Remediation</span>
            </div>
            <RemediationBadge status={supplier.remediationStatus} className="mt-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-0">
          {(["overview", "evidence", "compliance", "remediation", "timeline"] as const).map((tab) => {
            const labels: Record<string, string> = {
              overview: "Overview",
              evidence: "Evidence",
              compliance: "Compliance Mapping",
              remediation: "Remediation Workflow",
              timeline: "Activity Timeline",
            };
            return (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground"
              >
                {labels[tab]}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* ── Overview ────────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Risk Drivers */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldAlert className="size-4 text-destructive" />
                  Risk Drivers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {supplier.riskDrivers.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="size-4" />
                    No active risk drivers identified.
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {supplier.riskDrivers.map((driver, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span className="text-foreground leading-snug">{driver}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Required Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ClipboardList className="size-4 text-warning" />
                  Required Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {supplier.requiredActions.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="size-4" />
                    No pending actions.
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {supplier.requiredActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span className="text-foreground leading-snug">{action}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Regulatory exposure */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Regulatory Exposure</CardTitle>
              </CardHeader>
              <CardContent>
                {supplier.regulatoryExposure.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No frameworks identified.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {supplier.regulatoryExposure.map((reg) => (
                      <Badge key={reg} variant="outline" className="bg-muted text-muted-foreground border-border">
                        {reg}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supplier details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Supplier Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2.5 text-sm">
                  {[
                    { label: "Owner", value: supplier.owner, icon: <User className="size-3.5" /> },
                    { label: "Next Review", value: supplier.nextReviewDate, icon: <Calendar className="size-3.5" /> },
                    { label: "Last Updated", value: supplier.lastUpdated },
                    { label: "Annual Spend", value: spendFormatted },
                    { label: "Criticality", value: supplier.criticality },
                    { label: "Supplier ID", value: supplier.id },
                  ].map((row, i, arr) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1.5 text-muted-foreground">
                          {row.icon}
                          {row.label}
                        </dt>
                        <dd className="font-medium text-foreground">{row.value}</dd>
                      </div>
                      {i < arr.length - 1 && <Separator className="mt-2.5" />}
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* Deterministic policy callout */}
          <Card className="border-muted-foreground/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Cpu className="size-4 text-muted-foreground" />
                Deterministic Policy Rules Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {[
                  `Risk score ${supplier.riskScore} → ${supplier.riskLevel.charAt(0).toUpperCase() + supplier.riskLevel.slice(1)} risk (threshold: ≥90 Critical, ≥75 High, ≥45 Medium)`,
                  supplier.evidenceCompleteness < 60 && supplier.criticality === "High"
                    ? `Evidence ${supplier.evidenceCompleteness}% + High criticality → Review Required flag triggered`
                    : null,
                  blockingMissing.length > 0
                    ? `Missing approval-blocking evidence (${blockingMissing.length} item${blockingMissing.length > 1 ? "s" : ""}) → Procurement hold active`
                    : null,
                  supplier.remediationStatus === "overdue"
                    ? "Remediation overdue >30 days → Auto-escalated to Action Queue"
                    : null,
                  supplier.remediationStatus === "escalated"
                    ? "Escalated status → Priority review flag applied"
                    : null,
                ]
                  .filter(Boolean)
                  .map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                      {rule}
                    </li>
                  ))}
                {[
                  `Risk score ${supplier.riskScore} → ${supplier.riskLevel} risk`,
                  blockingMissing.length === 0 && supplier.remediationStatus !== "overdue" && supplier.remediationStatus !== "escalated"
                    ? "No blocking policy rules active for this supplier"
                    : null,
                ]
                  .filter(
                    () =>
                      [
                        supplier.evidenceCompleteness < 60 && supplier.criticality === "High",
                        blockingMissing.length > 0,
                        supplier.remediationStatus === "overdue",
                        supplier.remediationStatus === "escalated",
                      ].every((x) => !x)
                  )
                  .filter(Boolean)
                  .slice(0, 1)
                  .map((rule, i) => (
                    <li key={`default-${i}`} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                      {rule}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          {/* AI brief */}
          {demoMode === "ai-unavailable" ? (
            <Card className="border-warning/30 bg-warning/5">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="size-4 text-warning" />
                      AI brief unavailable
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      AI analysis service is temporarily offline
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0 bg-warning/10 text-warning border-warning/30">
                    Degraded
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-warning/30 bg-warning/5 py-2.5">
                  <WifiOff className="size-3.5 text-warning" />
                  <AlertDescription className="text-xs text-muted-foreground">
                    The AI summary service is unavailable. Deterministic risk data, evidence records, and policy rules below are fully accurate and unaffected.
                  </AlertDescription>
                </Alert>
                <div className="rounded-md border bg-muted/30 p-3 space-y-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground text-sm">Deterministic summary (always available):</p>
                  <p>Risk score: <span className="text-foreground font-medium">{supplier.riskScore}/100</span> · Level: <span className="text-foreground font-medium capitalize">{supplier.riskLevel}</span></p>
                  <p>Evidence completeness: <span className="text-foreground font-medium">{supplier.evidenceCompleteness}%</span></p>
                  <p>Remediation status: <span className="text-foreground font-medium capitalize">{supplier.remediationStatus.replace("-", " ")}</span></p>
                  {supplier.regulatoryExposure.length > 0 && (
                    <p>Regulatory scope: <span className="text-foreground font-medium">{supplier.regulatoryExposure.join(", ")}</span></p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <BrainCircuit className="size-4 text-primary" />
                      AI-generated draft brief
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Generated from supplier attributes · Not reviewed · Draft only
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onNavigateToMethodology && (
                      <button
                        onClick={onNavigateToMethodology}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="size-2.5" />
                        AI boundaries
                      </button>
                    )}
                    <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground border-border">
                      Draft
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{aiBrief}</p>
                <Alert className="border-muted bg-muted/30 py-2.5">
                  <Info className="size-3.5 text-muted-foreground" />
                  <AlertDescription className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">AI boundary:</span> This brief summarizes supplier context from structured data. Deterministic rules govern risk level, blocked actions, and approval eligibility. Human reviewers have final authority on all compliance decisions.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Evidence ─────────────────────────────────────────────────────── */}
        <TabsContent value="evidence" className="mt-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Evidence Records</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Evidence completeness determines supplier approval eligibility. Missing approval-blocking evidence triggers a procurement hold regardless of risk score.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {onNavigateToMethodology && (
                <button
                  onClick={onNavigateToMethodology}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="size-2.5" />
                  How evidence works
                </button>
              )}
              <Button variant="outline" size="sm" disabled className="opacity-50 gap-2 text-xs">
                Request Evidence
              </Button>
            </div>
          </div>

          {demoMode === "evidence-unavailable" && (            <Alert className="border-warning/30 bg-warning/5">
              <WifiOff className="size-4 text-warning" />
              <AlertTitle className="text-sm font-semibold text-warning">Evidence source unavailable</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground flex items-center justify-between gap-3">
                <span>The evidence data source is temporarily offline. Showing last cached records. Real-time status may differ.</span>
                <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs gap-1.5" onClick={handleEvidenceRetry} disabled={retrying}>
                  <RefreshCw className={cn("size-3", retrying && "animate-spin")} />
                  {retrying ? "Retrying…" : "Retry"}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {demoMode === "stale-data" && (
            <Alert className="border-warning/20 bg-warning/5">
              <Clock className="size-4 text-warning" />
              <AlertTitle className="text-sm font-semibold text-warning">Evidence data may be stale</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Last refreshed more than 30 days ago. Evidence statuses shown below may not reflect the current state. Request a manual refresh from the data team.
              </AlertDescription>
            </Alert>
          )}

          {blockingMissing.length > 0 && (
                <Alert className="border-destructive/30 bg-destructive/5">
                  <FileX className="size-4 text-destructive" />
                  <AlertTitle className="text-sm font-semibold text-destructive">
                    Approval-blocking evidence missing
                  </AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground">
                    {blockingMissing.map((e) => e.evidenceName).join(", ")} — procurement approval is on hold until these items are submitted and reviewed.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evidence Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Blocks Approval</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evidenceList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="py-10 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <FileCheck2 className="size-8 text-muted-foreground/30" />
                              <p className="text-sm text-muted-foreground">No evidence records for this supplier.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        evidenceList.map((item) => {
                          const statusCfg = evidenceStatusConfig[item.status];
                          return (
                            <TableRow key={item.id} className={cn(
                              item.blocksApproval && (item.status === "Missing" || item.status === "Expired")
                                ? "bg-destructive/5"
                                : ""
                            )}>
                              <TableCell>
                                <div className="space-y-0.5">
                                  <p className="font-medium text-foreground text-sm leading-tight">{item.evidenceName}</p>
                                  <p className="text-xs text-muted-foreground">{item.owner}</p>
                                  {demoMode === "stale-data" && (
                                    <Badge variant="outline" className="text-[9px] h-3.5 px-1 bg-warning/10 text-warning border-warning/20">
                                      Stale
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn("text-xs", statusCfg.className)}>
                                  {statusCfg.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">{item.sourceType}</TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{item.dueDate}</TableCell>
                              <TableCell>
                                {item.blocksApproval ? (
                                  <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20">
                                    Yes
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground/60">No</span>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">{item.notes}</TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                  <div className="border-t px-4 py-2.5">
                    <p className="text-xs text-muted-foreground">
                      {evidenceList.filter((e) => e.status === "Complete").length} complete · {evidenceList.filter((e) => e.status === "Missing" || e.status === "Expired").length} missing/expired · {evidenceList.filter((e) => e.status === "Under Review" || e.status === "Requested").length} in progress
                      {" · "}Evidence upload available in the next milestone.
                    </p>
                  </div>
                </CardContent>
              </Card>
        </TabsContent>

        {/* ── Compliance Mapping ───────────────────────────────────────────── */}
        <TabsContent value="compliance" className="mt-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Compliance Framework Mapping</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Readiness is determined by evidence completeness and supplier attributes. This is a demo readiness model — not legal advice.
              </p>
            </div>
            {onNavigateToMethodology && (
              <button
                onClick={onNavigateToMethodology}
                className="shrink-0 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="size-2.5" />
                How readiness is determined
              </button>
            )}
          </div>

          <Alert className="border-muted bg-muted/30 py-2.5">
            <Info className="size-3.5 text-muted-foreground" />
            <AlertDescription className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Deterministic readiness model:</span> Compliance readiness is calculated from supplier attributes, regulatory exposure flags, and evidence status — not AI judgment. Applicability is assessed against sector, commodity, and geography rules defined by the compliance team.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-3">
            {complianceList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No compliance mappings for this supplier.</p>
            ) : (
              complianceList.map((mapping) => {
                const readinessCfg = readinessConfig[mapping.readiness];
                const applicCfg = applicabilityConfig[mapping.applicability];
                return (
                  <Card key={mapping.id} className={cn(
                    mapping.readiness === "Blocked" ? "border-destructive/30" :
                    mapping.readiness === "Evidence Gap" ? "border-warning/30" : ""
                  )}>
                    <CardContent className="py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{mapping.framework}</span>
                            <Badge variant="outline" className={cn("text-xs", applicCfg.className)}>
                              {applicCfg.label}
                            </Badge>
                            <Badge variant="outline" className={cn("text-xs", readinessCfg.className)}>
                              {readinessCfg.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{mapping.reason}</p>
                          {mapping.requiredEvidence.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <span className="text-xs text-muted-foreground">Required:</span>
                              {mapping.requiredEvidence.map((ev) => (
                                <Badge key={ev} variant="outline" className="text-[10px] h-4 px-1.5 bg-muted text-muted-foreground border-border">
                                  {ev}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                          Assessed {mapping.lastAssessed}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <p className="text-xs text-muted-foreground border-t pt-3">
            This demo readiness model is based on deterministic rules applied to supplier attributes and evidence status. It does not constitute legal advice and should be verified with qualified legal counsel before regulatory submission.
          </p>
        </TabsContent>

        {/* ── Remediation Workflow ─────────────────────────────────────────── */}
        <TabsContent value="remediation" className="mt-6 space-y-4">
          <RemediationWorkflowTab
            supplier={supplier}
            plan={remediationPlan}
            role={role}
            isApprovalBlocked={isApprovalBlocked}
            blockingMissing={blockingMissing}
            remediationStore={remediationStore}
          />
        </TabsContent>

        {/* ── Activity Timeline ────────────────────────────────────────────── */}
        <TabsContent value="timeline" className="mt-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Activity Timeline</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              All system-generated and human-entered events for this supplier. System events are deterministic and rule-based.
            </p>
          </div>

          {timeline.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm text-muted-foreground">No activity recorded for this supplier.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />
              <div className="space-y-0">
                {timeline.map((event, i) => {
                  const Icon = timelineEventIcons[event.eventType];
                  const iconColor = timelineEventIconColors[event.eventType];
                  const sourceCfg = timelineSourceConfig[event.source];
                  return (
                    <div key={event.id} className={cn("relative flex gap-4 pb-6", i === timeline.length - 1 && "pb-0")}>
                      <div className={cn("relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-card", iconColor)}>
                        <Icon className="size-3.5" />
                      </div>
                      <div className="flex-1 pt-1 pb-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={cn("text-[10px] rounded-sm px-1.5 py-0.5 font-medium", sourceCfg.className)}>
                            {sourceCfg.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                          {event.source !== "System" && event.source !== "AI Draft" && (
                            <span className="text-xs text-muted-foreground">· {event.actor}</span>
                          )}
                          {event.systemGenerated && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1 bg-muted/50 text-muted-foreground/70 border-border/50">
                              Auto
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground leading-snug">{event.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
