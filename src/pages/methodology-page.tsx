import {
  BarChart3,
  CheckSquare,
  BrainCircuit,
  FileSearch,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SectionHeader } from "@/components/shared/section-header";
import { RoleContextBanner } from "@/components/shared/role-context-banner";
import type { Role } from "@/types";

const methodologyCards = [
  {
    icon: BarChart3,
    title: "Risk Scoring Methodology",
    badge: "Deterministic",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    description:
      "Supplier risk scores are calculated using a weighted, rule-based algorithm across five ESG dimensions: environmental compliance, labour standards, supply chain transparency, governance integrity, and third-party audit history.",
    details: [
      "Scores range 0–100 (higher = greater risk)",
      "Dimension weights configurable by compliance team",
      "Quarterly recalculation with evidence inputs",
      "All scoring logic is fully auditable and version-controlled",
    ],
  },
  {
    icon: CheckSquare,
    title: "Deterministic Policy Rules",
    badge: "Governance",
    badgeClass: "bg-warning/10 text-warning border-warning/20",
    description:
      "Policy rules govern hard boundaries in the system. They are not influenced by AI and cannot be overridden by user input. These rules determine supplier blocking, approval eligibility, and escalation triggers.",
    details: [
      "Score ≥ 80 triggers automatic procurement hold",
      "Missing critical evidence blocks approval regardless of score",
      "Overdue remediation after 30 days escalates to compliance lead",
      "Policy rule changes require dual authorisation and are logged",
    ],
  },
  {
    icon: BrainCircuit,
    title: "AI Assistance Boundaries",
    badge: "AI-Assisted",
    badgeClass: "bg-muted text-muted-foreground border-border",
    description:
      "AI is used to assist — never to govern. The system uses AI for drafting remediation summaries, surfacing evidence gaps, and suggesting remediation language. AI outputs are always presented as drafts requiring human review.",
    details: [
      "AI may summarise supplier risk profiles",
      "AI may draft remediation plan templates",
      "AI cannot approve, block, or alter risk scores",
      "All AI-generated content is marked and logged",
    ],
  },
  {
    icon: FileSearch,
    title: "Auditability & Evidence Chain",
    badge: "Audit-Ready",
    badgeClass: "bg-success/10 text-success border-success/20",
    description:
      "Every risk score change, policy rule evaluation, remediation decision, and AI-generated draft is recorded with timestamp, user identity, and the data inputs used. The full decision history is exportable for regulatory review.",
    details: [
      "Immutable audit log for all risk and compliance decisions",
      "Evidence submissions stored with hash verification",
      "Exportable decision trail for ISO, ESG, and regulatory audits",
      "Role-based access control on all sensitive records",
    ],
  },
];

interface MethodologyPageProps {
  role: Role;
}

const roleDescriptions: Record<Role, string> = {
  procurement:
    "Understand how SustainOps calculates risk, applies policy, and uses AI responsibly.",
  "esg-analyst":
    "Reference documentation for evidence standards, policy rules, and audit trail requirements.",
  supplier:
    "Demo view: This page documents how the platform governs risk scoring and AI use.",
};

export function MethodologyPage({ role }: MethodologyPageProps) {
  return (
    <div className="space-y-6">
      <RoleContextBanner role={role} />
      <SectionHeader
        title="Methodology & Trust Center"
        description={roleDescriptions[role]}
      />

      {/* Principle banner */}
      <Alert className="border-primary/30 bg-primary/5">
        <BrainCircuit className="size-4 text-primary" />
        <AlertTitle className="text-sm font-semibold text-foreground">
          Core Principle
        </AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          AI can summarize and draft. Deterministic rules govern risk level,
          blocked actions, and approval eligibility. Human reviewers have final
          authority on all compliance decisions.
        </AlertDescription>
      </Alert>

      {/* Filter & priority note */}
      <Alert className="border-muted bg-muted/30">
        <BarChart3 className="size-4 text-muted-foreground" />
        <AlertTitle className="text-sm font-semibold text-foreground">
          Filtering & Priority Views
        </AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          Supplier filtering, priority ordering, and the "Suppliers Needing Action" view are derived entirely from deterministic supplier attributes and policy rules — not AI-generated rankings. Filters apply rule-based logic: risk score thresholds, remediation status flags, and evidence completeness buckets. No AI inference is involved in supplier ordering or filter results.
        </AlertDescription>
      </Alert>

      {/* Methodology cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {methodologyCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <card.icon className="size-4 text-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">
                      {card.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`${card.badgeClass} text-xs`}
                    >
                      {card.badge}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs leading-relaxed">
                    {card.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {card.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                    {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
