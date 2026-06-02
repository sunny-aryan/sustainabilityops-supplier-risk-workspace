import {
  BarChart3,
  BrainCircuit,
  FileSearch,
  CheckSquare,
  ShieldAlert,
  ClipboardList,
  Clock,
  Database,
  FlaskConical,
  Lock,
  BookOpen,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SectionHeader } from "@/components/shared/section-header";
import { RoleContextBanner } from "@/components/shared/role-context-banner";
import {
  MethodologySection as _MethodologySection,
  RuleCard,
  BoundaryCard,
} from "@/components/shared/trust-center-components";
import { TrustCallout } from "@/components/shared/trust-callout";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

// ─── Data ───────────────────────────────────────────────────────────────────────

const scoringDimensions = [
  { label: "Labor & Human Rights Risk", weight: 25, description: "Forced labor indicators, living wage gaps, audit findings, labor rights violations." },
  { label: "Environmental Compliance Risk", weight: 25, description: "Environmental certifications, violation history, waste handling, and local regulatory compliance." },
  { label: "Supply Chain Transparency Risk", weight: 20, description: "Tier 2/3 visibility, sub-contractor disclosure, conflict minerals declarations." },
  { label: "Emissions / Decarbonization Readiness", weight: 15, description: "Scope 1/2/3 baseline, decarbonization targets, CBAM exposure readiness." },
  { label: "Governance & Ethics Risk", weight: 15, description: "Anti-bribery controls, sanctions exposure, compliance violations, governance structure." },
];

const riskThresholds = [
  { range: "90–100", level: "Critical", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
  { range: "75–89", level: "High", color: "text-destructive/80", bg: "bg-destructive/5 border-destructive/10" },
  { range: "45–74", level: "Medium", color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  { range: "0–44", level: "Low", color: "text-success", bg: "bg-success/10 border-success/20" },
];

const evidenceCategories = [
  { name: "Labor Audit", blocksApproval: true },
  { name: "Environmental Certification", blocksApproval: true },
  { name: "Emissions Baseline", blocksApproval: false },
  { name: "Supplier Code of Conduct", blocksApproval: true },
  { name: "Deforestation Declaration", blocksApproval: false },
  { name: "Anti-Bribery Policy", blocksApproval: false },
  { name: "Water Usage Audit", blocksApproval: false },
  { name: "Conflict Minerals Declaration", blocksApproval: false },
];

const evidenceStatuses = [
  { status: "Complete", color: "bg-success/10 text-success border-success/20", description: "Reviewed and accepted by ESG / Compliance Analyst." },
  { status: "Requested", color: "bg-warning/10 text-warning border-warning/20", description: "Requested from supplier. Not yet submitted." },
  { status: "Submitted", color: "bg-primary/10 text-primary border-primary/20", description: "Supplier has submitted. Internal review not yet started." },
  { status: "Under Review", color: "bg-primary/10 text-primary border-primary/20", description: "Under active internal review. Does NOT count as Complete." },
  { status: "Missing", color: "bg-destructive/10 text-destructive border-destructive/20", description: "Not submitted. If approval-blocking, procurement hold is active." },
  { status: "Expired", color: "bg-destructive/10 text-destructive border-destructive/20", description: "Previously complete but now expired. Treated same as Missing." },
];

const readinessStates = [
  { state: "Ready", color: "bg-success/10 text-success border-success/20", description: "All required evidence complete. No regulatory gaps detected." },
  { state: "Evidence Gap", color: "bg-warning/10 text-warning border-warning/20", description: "One or more required evidence items are Missing, Requested, or Expired." },
  { state: "Review Required", color: "bg-primary/10 text-primary border-primary/20", description: "Evidence submitted but under review, or high-risk supplier attributes trigger analyst review." },
  { state: "Blocked", color: "bg-destructive/10 text-destructive border-destructive/20", description: "Approval-blocking evidence is Missing or Expired. Procurement hold active." },
  { state: "Not Applicable", color: "bg-muted text-muted-foreground border-border", description: "Framework does not apply based on sector, commodity, or geography rules." },
];

const policyRules = [
  { rule: "Risk score ≥ 90", consequence: "Supplier classified as Critical risk. Procurement hold triggered.", type: "threshold" as const },
  { rule: "Risk score ≥ 75", consequence: "Supplier classified as High risk. Elevated monitoring applied.", type: "threshold" as const },
  { rule: "Risk score ≥ 45", consequence: "Supplier classified as Medium risk.", type: "threshold" as const },
  { rule: "Evidence completeness < 60% AND criticality = High", consequence: "Automatic review-required flag triggered. Appears in Action Queue.", type: "trigger" as const },
  { rule: "Mandatory labor or environmental evidence is Missing or Expired", consequence: "Procurement approval is blocked regardless of risk score.", type: "block" as const },
  { rule: "Remediation plan past due date and not Complete", consequence: "Plan marked Overdue. Supplier appears in Action Queue. Escalation flag applied.", type: "trigger" as const },
  { rule: "Supplier submits evidence or milestone", consequence: "Item moves to Under Review — NOT automatically Complete. Analyst review required.", type: "boundary" as const },
  { rule: "Escalated status on remediation plan", consequence: "ESG / Compliance Analyst review required before plan can progress.", type: "block" as const },
];

const auditEvents = [
  "Risk score change (with previous and new score)",
  "Evidence status update (with actor, role, and timestamp)",
  "Remediation plan created, sent to supplier, or escalated",
  "Supplier milestone submission or review completion",
  "Procurement hold applied or lifted",
  "Blocked action attempt (with reason logged)",
  "AI draft generated (with source data snapshot)",
  "Human review action or override decision",
];

const auditEventStructure = [
  { field: "timestamp", description: "ISO 8601 datetime of event" },
  { field: "actor", description: "User name or system identifier" },
  { field: "role", description: "Procurement Manager / ESG Analyst / Supplier User / System" },
  { field: "action", description: "Action type (e.g., evidence_submitted, risk_recalculated)" },
  { field: "source", description: "Human action / System rule / AI Draft" },
  { field: "affectedSupplier", description: "Supplier ID and name" },
  { field: "previousState", description: "Value or status before the event" },
  { field: "newState", description: "Value or status after the event" },
];

const degradedStates = [
  { state: "AI Unavailable", description: "AI summary and draft capabilities are offline. All deterministic risk scores, evidence records, and policy rule evaluations remain fully available and accurate." },
  { state: "Evidence Source Unavailable", description: "Real-time evidence feed is offline. Last cached evidence records are displayed. Statuses shown may not reflect the current state." },
  { state: "Stale Data", description: "Evidence data has not been refreshed in more than 30 days. Statuses shown may not reflect the current state. Manual refresh recommended." },
  { state: "Loading", description: "Supplier analysis is being fetched. Layout and navigation remain stable. Deterministic controls are available once data loads." },
];

const demoLimitations = [
  "No real supplier authentication or multi-tenant RBAC",
  "No real document upload, storage, or OCR validation",
  "No real legal compliance verification — all readiness is simplified demo logic",
  "No production ERP or procurement system integration",
  "No real AI API calls — AI brief content is generated from structured supplier attributes",
  "No real evidence hash verification or immutable audit storage",
  "No supplier notification channels (email, portal invites)",
  "Risk scores and evidence records are static demo data",
];

const productionConsiderations = [
  "RBAC with supplier authentication and multi-tenant access controls",
  "Policy versioning with dual-authorisation and change logs",
  "Evidence document storage with hash verification and tamper detection",
  "Workflow approvals with configurable gates and escalation paths",
  "Integration with ERP and procurement systems (SAP, Coupa, Ariba)",
  "Supplier notification channels (email, in-portal, Slack/Teams)",
  "Audit export (CSV, PDF) for regulatory and ISO submission",
  "Legal/compliance review layer with qualified counsel sign-off",
  "AI evaluation pipeline with guardrails, confidence scores, and human-in-the-loop",
  "Evidence OCR and extraction with validation rules",
];

// ─── Role descriptions ───────────────────────────────────────────────────────────

const roleDescriptions: Record<Role, string> = {
  procurement:
    "Understand how SustainOps calculates risk, applies deterministic policy rules, and uses AI responsibly.",
  "esg-analyst":
    "Reference documentation for evidence standards, compliance readiness models, policy rules, and audit trail requirements.",
  supplier:
    "Demo view: This page documents how the platform governs risk scoring, evidence standards, and AI use.",
};

// ─── Component ──────────────────────────────────────────────────────────────────

interface MethodologyPageProps {
  role: Role;
}

export function MethodologyPage({ role }: MethodologyPageProps) {
  return (
    <div className="space-y-8">
      <RoleContextBanner role={role} />
      <SectionHeader
        title="Methodology & Trust Center"
        description={roleDescriptions[role]}
      />

      {/* Core principle banner */}
      <Alert className="border-primary/30 bg-primary/5">
        <BrainCircuit className="size-4 text-primary" />
        <AlertTitle className="text-sm font-semibold text-foreground">Core Governance Principle</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground mt-1">
          AI can summarize and draft. Deterministic rules govern risk level, blocked actions, and approval eligibility.
          Humans decide. Audit records every action.
          <br />
          <span className="text-xs mt-1 block">
            SustainOps is a demo workspace. All risk scores, status labels, blocked actions, and workflow transitions
            are deterministic. AI-style content is advisory and never authoritative. This is a demo methodology, not legal advice.
          </span>
        </AlertDescription>
      </Alert>

      {/* A. Overview */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <BookOpen className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">A. Platform Overview</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Risk Engine", value: "Deterministic", description: "All risk scores computed from rule-based algorithms, not ML predictions.", color: "bg-primary/10 text-primary border-primary/20" },
            { label: "AI Role", value: "Advisory", description: "AI drafts and summarizes. Never approves, scores, or blocks.", color: "bg-muted text-muted-foreground border-border" },
            { label: "Policy Rules", value: "Hard Constraints", description: "Policy rules cannot be overridden by user input or AI output.", color: "bg-warning/10 text-warning border-warning/20" },
            { label: "Audit Trail", value: "Comprehensive", description: "Every state transition, action, and AI draft is recorded.", color: "bg-success/10 text-success border-success/20" },
          ].map((item) => (
            <Card key={item.label} className="border">
              <CardContent className="pt-4 space-y-2">
                <Badge variant="outline" className={cn("text-[10px]", item.color)}>{item.value}</Badge>
                <p className="text-xs font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* B. Risk Scoring */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <BarChart3 className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">B. Risk Scoring Methodology</h2>
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-primary/10 text-primary border-primary/20">Deterministic</Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Supplier risk scores (0–100, higher = greater risk) are calculated from a weighted, rule-based algorithm across
          five ESG dimensions. Scores are recalculated quarterly using evidence inputs. All scoring logic is version-controlled and auditable.
          This is simplified demo logic.
        </p>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground mb-2">Scoring Dimensions & Weights</p>
            {scoringDimensions.map((dim) => (
              <div key={dim.label} className="rounded-md border bg-card px-4 py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{dim.label}</span>
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-muted text-muted-foreground border-border">
                    {dim.weight}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{dim.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground mb-2">Deterministic Risk Thresholds</p>
            {riskThresholds.map((t) => (
              <div key={t.level} className={cn("rounded-md border px-4 py-3 flex items-center justify-between", t.bg)}>
                <div>
                  <span className={cn("text-sm font-semibold", t.color)}>{t.level}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Score range: {t.range}</p>
                </div>
                <span className="text-xl font-mono font-bold text-muted-foreground/40">{t.range.split("–")[0]}</span>
              </div>
            ))}
            <TrustCallout variant="muted">
              Score thresholds are fixed demo values. In production, weights and thresholds are configurable by the compliance team with full version history.
            </TrustCallout>
          </div>
        </div>
      </section>

      {/* C. Evidence Completeness */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <FileSearch className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">C. Evidence Completeness Methodology</h2>
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-warning/10 text-warning border-warning/20">Approval Gate</Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Evidence completeness is the percentage of required documentation that has been reviewed and accepted (status = Complete).
          Submitted or Under Review items do <strong className="text-foreground">not</strong> count toward completeness.
          Missing or expired approval-blocking evidence triggers a procurement hold regardless of risk score.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground mb-2">Evidence Categories</p>
            <div className="rounded-md border overflow-hidden">
              {evidenceCategories.map((cat, i) => (
                <div key={cat.name} className={cn(
                  "flex items-center justify-between px-4 py-2.5 text-xs",
                  i < evidenceCategories.length - 1 && "border-b",
                  i % 2 === 0 ? "bg-card" : "bg-muted/20"
                )}>
                  <span className="text-foreground">{cat.name}</span>
                  {cat.blocksApproval ? (
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-destructive/10 text-destructive border-destructive/20">
                      Blocks approval
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground/60">Advisory</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground mb-2">Evidence Status Definitions</p>
            <div className="space-y-2">
              {evidenceStatuses.map((es) => (
                <div key={es.status} className="flex items-start gap-3 rounded-md border bg-card px-3 py-2.5">
                  <Badge variant="outline" className={cn("text-[10px] shrink-0 mt-0.5", es.color)}>
                    {es.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">{es.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* D. Compliance Readiness */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <ClipboardList className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">D. Compliance Readiness Methodology</h2>
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-muted text-muted-foreground border-border">Demo Model</Badge>
        </div>

        <Alert className="border-warning/30 bg-warning/5">
          <ShieldAlert className="size-4 text-warning" />
          <AlertDescription className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Disclaimer:</span> This is a portfolio demo readiness model, not legal or regulatory advice. Readiness states are calculated from deterministic rules applied to supplier attributes and evidence status. Always verify with qualified legal counsel before regulatory submission.
          </AlertDescription>
        </Alert>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Compliance readiness is assessed for CSDDD, CSRD, EUDR, CBAM, and Internal Supplier Code frameworks.
          Applicability is determined by sector, commodity, and geography rules. Readiness is recalculated when evidence changes.
        </p>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">Readiness States</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {readinessStates.map((rs) => (
              <div key={rs.state} className="rounded-md border bg-card px-4 py-3 space-y-1.5">
                <Badge variant="outline" className={cn("text-xs", rs.color)}>{rs.state}</Badge>
                <p className="text-xs text-muted-foreground leading-relaxed">{rs.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E. Deterministic Policy Rules */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <CheckSquare className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">E. Deterministic Policy Rules</h2>
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-warning/10 text-warning border-warning/20">Governance</Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Policy rules are hard constraints evaluated by the system. They are not influenced by AI and cannot be overridden by user input.
          All rule evaluations are logged with the triggering supplier state and outcome.
        </p>

        <div className="space-y-2">
          {policyRules.map((rule) => (
            <RuleCard key={rule.rule} rule={rule.rule} consequence={rule.consequence} type={rule.type} />
          ))}
        </div>
      </section>

      {/* F. AI Assistance Boundaries */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <BrainCircuit className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">F. AI Assistance Boundaries</h2>
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-muted text-muted-foreground border-border">AI-Assisted</Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          AI is used to assist — never to govern. AI output is always presented as a draft requiring human review.
          All AI-generated content is clearly labeled, and the data inputs used are logged.
        </p>

        <BoundaryCard
          canDo={[
            "Summarize supplier risk context from structured data",
            "Draft supplier outreach and remediation language",
            "Explain risk drivers in plain language",
            "Suggest remediation wording and milestone descriptions",
            "Highlight missing or expired evidence items",
          ]}
          cannotDo={[
            "Approve suppliers or remove procurement holds",
            "Override or modify risk scores",
            "Change compliance readiness status",
            "Mark evidence as Complete",
            "Close remediation plans",
            "Override blocked actions",
            "Make legal compliance determinations",
          ]}
          principle="AI can summarize and draft. Deterministic rules govern. Humans decide. Audit records."
        />
      </section>

      {/* G. Auditability Model */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Activity className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">G. Auditability Model</h2>
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-success/10 text-success border-success/20">Audit-Ready</Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Every risk score change, policy evaluation, remediation action, and AI draft generation is recorded with full context.
          The audit trail is immutable and exportable for ISO, ESG, and regulatory reviews.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Events Recorded</p>
            <div className="rounded-md border bg-card">
              {auditEvents.map((event, i) => (
                <div key={event} className={cn(
                  "flex items-start gap-2 px-4 py-2.5 text-xs",
                  i < auditEvents.length - 1 && "border-b"
                )}>
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span className="text-muted-foreground">{event}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Audit Event Structure</p>
            <div className="rounded-md border bg-card overflow-hidden">
              <div className="grid grid-cols-2 bg-muted/30 px-4 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide border-b">
                <span>Field</span>
                <span>Description</span>
              </div>
              {auditEventStructure.map((row, i) => (
                <div key={row.field} className={cn(
                  "grid grid-cols-2 px-4 py-2 text-xs",
                  i < auditEventStructure.length - 1 && "border-b",
                  i % 2 === 0 ? "bg-card" : "bg-muted/20"
                )}>
                  <span className="font-mono text-primary text-[10px]">{row.field}</span>
                  <span className="text-muted-foreground">{row.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* H. Data Freshness and Degraded States */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Clock className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">H. Data Freshness & Degraded States</h2>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          SustainOps is designed to remain operational and useful even when external data sources or AI services are unavailable.
          Deterministic controls, risk scores, and policy rule evaluations are always available regardless of AI or data feed status.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {degradedStates.map((ds) => (
            <div key={ds.state} className="rounded-md border bg-card px-4 py-3 space-y-1.5">
              <p className="text-xs font-medium text-foreground">{ds.state}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{ds.description}</p>
            </div>
          ))}
        </div>

        <TrustCallout variant="muted">
          When AI is unavailable, all deterministic data (risk scores, evidence status, policy rule evaluation) remains fully accurate and available.
          AI unavailability does not affect the reliability of any governance or compliance output.
        </TrustCallout>
      </section>

      {/* I. Demo Scope and Production */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <FlaskConical className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">I. Demo Scope & Production Considerations</h2>
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-muted text-muted-foreground border-border">Demo</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="size-3.5 text-destructive/70" />
              <p className="text-xs font-semibold text-foreground">Demo Limitations</p>
            </div>
            <div className="rounded-md border border-destructive/20 bg-destructive/5 overflow-hidden">
              {demoLimitations.map((item, i) => (
                <div key={item} className={cn(
                  "flex items-start gap-2 px-4 py-2.5 text-xs",
                  i < demoLimitations.length - 1 && "border-b border-destructive/10"
                )}>
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-destructive/50" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="size-3.5 text-success/70" />
              <p className="text-xs font-semibold text-foreground">Production Considerations</p>
            </div>
            <div className="rounded-md border border-success/20 bg-success/5 overflow-hidden">
              {productionConsiderations.map((item, i) => (
                <div key={item} className={cn(
                  "flex items-start gap-2 px-4 py-2.5 text-xs",
                  i < productionConsiderations.length - 1 && "border-b border-success/10"
                )}>
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-success/50" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer disclaimer */}
      <div className="rounded-md border bg-muted/20 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">SustainOps Trust Center</span> — This documentation describes the demo methodology in use.
          All risk scoring, compliance readiness mapping, and AI assistance boundaries described here apply to this demo workspace only.
          Nothing in this Trust Center constitutes legal, regulatory, or compliance advice. Always consult qualified legal counsel for regulatory obligations.
        </p>
      </div>
    </div>
  );
}
