import { useState } from "react";
import {
  Globe,
  Upload,
  CheckSquare,
  Clock,
  ShieldAlert,
  Info,
  MessageSquare,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { suppliers } from "@/data/suppliers";
import { getEvidenceForSupplier } from "@/data/evidence";
import { useRemediationStore } from "@/utils/remediation";
import type { Role, EvidenceItemStatus } from "@/types";
import { cn } from "@/lib/utils";

// Suppliers that have open remediation plans (high/critical risk)
const PORTAL_SUPPLIER_IDS = ["sup-001", "sup-002", "sup-003", "sup-004", "sup-005"];

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

interface SupplierPortalPageProps {
  role: Role;
  remediationStore: ReturnType<typeof useRemediationStore>;
}

export function SupplierPortalPage({ role, remediationStore }: SupplierPortalPageProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(PORTAL_SUPPLIER_IDS[0]);

  const supplier = suppliers.find((s) => s.id === selectedSupplierId);
  const plan = remediationStore.plans.find((p) => p.supplierId === selectedSupplierId) ?? null;
  const evidenceList = getEvidenceForSupplier(selectedSupplierId).filter(
    (e) => e.status === "Missing" || e.status === "Requested" || e.status === "Expired" || e.status === "Under Review"
  );

  const isInternalRole = role === "procurement" || role === "esg-analyst";

  function handleMarkSubmitted(evidenceName: string, _supplierId: string) {
    // Find matching plan milestone and submit it
    if (plan) {
      const milestone = plan.milestones.find(
        (m) =>
          m.owner === "Supplier User" &&
          (m.status === "Not Started" || m.status === "Requested") &&
          (m.requiredEvidence.some((e) => e.toLowerCase().includes(evidenceName.toLowerCase())) ||
            evidenceName.toLowerCase().includes(m.title.toLowerCase().replace("submitted", "").trim()))
      );
      if (milestone) {
        remediationStore.supplierSubmitMilestone(plan.id, milestone.id, supplier?.name ?? "Supplier");
      } else {
        // Still log an event even if no milestone matched
        remediationStore.supplierSubmitMilestone(
          plan.id,
          plan.milestones.find((m) => m.owner === "Supplier User" && m.status !== "Complete")?.id ?? plan.milestones[0]?.id ?? "",
          supplier?.name ?? "Supplier"
        );
      }
    }
    toast.success("Submitted for review", {
      description: `"${evidenceName}" marked as submitted. Your compliance team will review and confirm. Procurement approval remains on hold until the review is complete.`,
    });
  }

  function handleUploadClick(title: string) {
    toast.info("File upload not available in this demo", {
      description: `File upload for "${title}" is not implemented. Use "Mark as Submitted" to simulate the submission flow.`,
    });
  }

  function handleSubmitMilestone(milestoneId: string, milestoneTitle: string) {
    if (!plan) return;
    remediationStore.supplierSubmitMilestone(plan.id, milestoneId, supplier?.name ?? "Supplier");
    toast.success("Response submitted", {
      description: `"${milestoneTitle}" submitted for review. Your compliance team will review this item. Procurement approval remains on hold until review is complete.`,
    });
  }

  const pendingEvidenceCount = evidenceList.filter(
    (e) => e.status === "Missing" || e.status === "Requested" || e.status === "Expired"
  ).length;

  const openMilestones = plan
    ? plan.milestones.filter(
        (m) =>
          m.owner === "Supplier User" &&
          m.status !== "Complete" &&
          m.status !== "Under Review"
      )
    : [];

  const completedMilestones = plan ? plan.milestones.filter((m) => m.status === "Complete").length : 0;
  const totalMilestones = plan ? plan.milestones.length : 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Supplier Portal"
        description="Submit evidence, track requests, and manage your compliance obligations."
      />

      {/* Internal role banner */}
      {isInternalRole && (
        <Alert className="border-primary/20 bg-primary/5">
          <Globe className="size-4 text-primary" />
          <AlertDescription className="text-sm text-muted-foreground">
            {role === "procurement"
              ? "You are viewing the Supplier Portal as a Procurement Manager. This is the external-facing workspace your suppliers use to submit evidence and respond to remediation requests."
              : "You are viewing the Supplier Portal as an ESG / Compliance Analyst. This is the supplier-facing workspace showing what evidence and milestones have been assigned."}
          </AlertDescription>
        </Alert>
      )}

      {/* Supplier selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground shrink-0">Viewing portal for:</label>
        <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
          <SelectTrigger className="w-64 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PORTAL_SUPPLIER_IDS.map((id) => {
              const s = suppliers.find((s) => s.id === id);
              return s ? (
                <SelectItem key={id} value={id} className="text-sm">
                  {s.name}
                </SelectItem>
              ) : null;
            })}
          </SelectContent>
        </Select>
      </div>

      {supplier && (
        <>
          {/* Welcome banner */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Globe className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Welcome, {supplier.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pendingEvidenceCount > 0
                    ? `You have ${pendingEvidenceCount} pending evidence request${pendingEvidenceCount > 1 ? "s" : ""}`
                    : "No pending evidence requests"}
                  {openMilestones.length > 0
                    ? ` and ${openMilestones.length} open remediation milestone${openMilestones.length > 1 ? "s" : ""}`
                    : ""}
                  {". "}Please review and respond before the deadlines below.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-muted-foreground">Owner</p>
                <p className="text-sm font-medium text-foreground">{supplier.owner}</p>
              </div>
            </CardContent>
          </Card>

          {/* Procurement blocked notice */}
          {plan?.blocksProcurementApproval && (
            <Alert className="border-destructive/30 bg-destructive/5">
              <ShieldAlert className="size-4 text-destructive" />
              <AlertTitle className="text-sm font-semibold text-destructive">
                Procurement approval on hold
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Procurement decisions for your account are currently on hold pending completion of required compliance evidence. Submitting the items below will initiate the internal review process.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Evidence requests */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileCheck2 className="size-4 text-muted-foreground" />
                      Evidence Requests
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      Documents requested by your compliance team
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      pendingEvidenceCount > 0
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {pendingEvidenceCount} pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {evidenceList.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-success py-2">
                    <CheckCircle2 className="size-4" />
                    No outstanding evidence requests.
                  </div>
                ) : (
                  evidenceList.map((item) => {
                    const statusCfg = evidenceStatusConfig[item.status];
                    const canSubmit = item.status === "Missing" || item.status === "Requested" || item.status === "Expired";
                    return (
                      <div key={item.id} className={cn(
                        "rounded-md border px-4 py-3 space-y-2",
                        item.blocksApproval && canSubmit ? "border-destructive/30 bg-destructive/5" : ""
                      )}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground leading-tight">{item.evidenceName}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.category} · {item.sourceType}</p>
                          </div>
                          <Badge variant="outline" className={cn("text-xs shrink-0", statusCfg.className)}>
                            {statusCfg.label}
                          </Badge>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.notes}</p>
                        )}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            Due {item.dueDate}
                            {item.blocksApproval && canSubmit && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1 bg-destructive/10 text-destructive border-destructive/20">
                                Blocks approval
                              </Badge>
                            )}
                          </div>
                          {canSubmit && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs gap-1 text-muted-foreground"
                                onClick={() => handleUploadClick(item.evidenceName)}
                              >
                                <Upload className="size-3" />
                                Upload
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1"
                                onClick={() => handleMarkSubmitted(item.evidenceName, item.supplierId)}
                              >
                                <CheckSquare className="size-3" />
                                Mark as submitted
                              </Button>
                            </div>
                          )}
                          {item.status === "Under Review" && (
                            <span className="text-xs text-primary font-medium">Under internal review</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <p className="text-[10px] text-muted-foreground/70 pt-1">
                  File upload is not implemented in this demo. Use "Mark as submitted" to simulate the submission flow.
                </p>
              </CardContent>
            </Card>

            {/* Remediation milestones */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Remediation Milestones</CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {plan ? plan.title : "No active remediation plan"}
                    </CardDescription>
                  </div>
                  {plan && (
                    <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                      {completedMilestones}/{totalMilestones} done
                    </Badge>
                  )}
                </div>
                {plan && (
                  <Progress
                    value={totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}
                    className="mt-2 h-1.5"
                  />
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {!plan ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                    <CheckCircle2 className="size-4 text-success" />
                    No active remediation plan.
                  </div>
                ) : (
                  plan.milestones
                    .filter((m) => m.owner === "Supplier User")
                    .map((milestone) => {
                      const isComplete = milestone.status === "Complete";
                      const isUnderReview = milestone.status === "Under Review";
                      const isSubmitted = milestone.status === "Submitted";
                      const canAct = milestone.status === "Not Started" || milestone.status === "Requested";

                      return (
                        <div
                          key={milestone.id}
                          className={cn(
                            "flex items-start gap-3 rounded-md border px-4 py-3",
                            milestone.blocksApproval && !isComplete ? "border-destructive/20 bg-destructive/5" : ""
                          )}
                        >
                          <div
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full mt-0.5",
                              isComplete
                                ? "bg-success/10 text-success"
                                : isUnderReview || isSubmitted
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="size-3" />
                            ) : isUnderReview || isSubmitted ? (
                              <Clock className="size-3" />
                            ) : (
                              <CheckSquare className="size-3" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className={cn(
                              "text-sm leading-tight",
                              isComplete ? "line-through text-muted-foreground" : "font-medium text-foreground"
                            )}>
                              {milestone.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span>Due {milestone.dueDate}</span>
                              {isUnderReview && <span className="text-primary font-medium">Under internal review</span>}
                              {isSubmitted && <span className="text-primary font-medium">Submitted — awaiting review</span>}
                            </div>
                          </div>
                          {canAct && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs shrink-0 gap-1"
                              onClick={() => handleSubmitMilestone(milestone.id, milestone.title)}
                            >
                              <CheckSquare className="size-3" />
                              Submit
                            </Button>
                          )}
                        </div>
                      );
                    })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message from team */}
          {plan && plan.messages.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="size-4 text-muted-foreground" />
                  Message from your compliance team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.messages.slice(0, 1).map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{msg.author}</span>
                      <Separator orientation="vertical" className="h-3" />
                      <span>{msg.date}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1 bg-muted text-muted-foreground border-border">
                        {msg.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{msg.body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Portal disclaimer */}
          <Alert className="border-muted bg-muted/30 py-2.5">
            <Info className="size-3.5 text-muted-foreground" />
            <AlertDescription className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Important:</span> Submitting evidence marks it for internal review. Your compliance team will verify and approve submissions. Procurement approval remains on hold until all required evidence is reviewed and confirmed. File upload is not implemented in this demo.
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
}
