import { Globe, Upload, CheckSquare } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SectionHeader } from "@/components/shared/section-header";
import { toast } from "sonner";
import type { Role } from "@/types";

const evidenceRequests = [
  {
    id: 1,
    title: "ISO 14001 Environmental Certification",
    description: "Valid certificate or renewal documentation required.",
    status: "pending" as const,
    dueDate: "2026-06-30",
    priority: "high" as const,
  },
  {
    id: 2,
    title: "Conflict Minerals Declaration (RCOI)",
    description:
      "Annual reasonable country of origin inquiry documentation.",
    status: "submitted" as const,
    dueDate: "2026-05-15",
    priority: "medium" as const,
  },
  {
    id: 3,
    title: "Modern Slavery Policy Statement",
    description: "Current year policy statement signed by leadership.",
    status: "pending" as const,
    dueDate: "2026-07-15",
    priority: "medium" as const,
  },
];

const remediationMilestones = [
  {
    id: 1,
    title: "Submit corrective action plan",
    dueDate: "2026-06-10",
    complete: true,
  },
  {
    id: 2,
    title: "Update supplier code of conduct signoff",
    dueDate: "2026-06-25",
    complete: false,
  },
  {
    id: 3,
    title: "Provide updated water usage audit",
    dueDate: "2026-07-05",
    complete: false,
  },
];

interface SupplierPortalPageProps {
  role: Role;
}

export function SupplierPortalPage({ role }: SupplierPortalPageProps) {
  const complete = remediationMilestones.filter((m) => m.complete).length;
  const total = remediationMilestones.length;

  function handleUpload(title: string) {
    toast.info("Evidence upload — coming in a later milestone", {
      description: `The upload workflow for "${title}" will be available when document management is implemented.`,
    });
  }

  const isInternalRole = role === "procurement" || role === "esg-analyst";

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Supplier Portal"
        description="Submit evidence, track requests, and manage your compliance obligations."
      />

      {/* Role-context note for internal roles */}
      {isInternalRole && (
        <Alert className="border-primary/20 bg-primary/5">
          <Globe className="size-4 text-primary" />
          <AlertDescription className="text-sm text-muted-foreground">
            {role === "procurement"
              ? "You are viewing the Supplier Portal as a Procurement Manager. This is the external-facing view your suppliers use to submit evidence and respond to remediation requests."
              : "You are viewing the Supplier Portal as an ESG / Compliance Analyst. This is the supplier-facing workspace. Use this view to understand what evidence and milestones have been assigned to each supplier."}
          </AlertDescription>
        </Alert>
      )}

      {/* Welcome banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Globe className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Welcome, Meridian Logistics Group
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              You have 2 pending evidence requests and 2 open remediation
              milestones. Please review and respond before the deadlines below.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Evidence requests */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Evidence Requests</CardTitle>
                <CardDescription className="mt-0.5">
                  Documents requested by your compliance team
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                2 pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {evidenceRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-md border px-4 py-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {req.title}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      req.status === "submitted"
                        ? "bg-success/10 text-success border-success/20 text-xs shrink-0"
                        : req.priority === "high"
                        ? "bg-destructive/10 text-destructive border-destructive/20 text-xs shrink-0"
                        : "bg-warning/10 text-warning border-warning/20 text-xs shrink-0"
                    }
                  >
                    {req.status === "submitted" ? "Submitted" : "Pending"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {req.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">
                    Due {req.dueDate}
                  </span>
                  {req.status === "pending" && (
                    <Button
                      size="xs"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => handleUpload(req.title)}
                    >
                      <Upload className="size-3" />
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Remediation milestones */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Remediation Milestones
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Steps required to resolve your open remediation plan
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {complete}/{total} complete
              </Badge>
            </div>
            <Progress
              value={(complete / total) * 100}
              className="mt-2 h-1.5"
            />
          </CardHeader>
          <CardContent className="space-y-2">
            {remediationMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-3 rounded-md border px-4 py-3"
              >
                <div
                  className={
                    milestone.complete
                      ? "flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"
                      : "flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                  }
                >
                  <CheckSquare className="size-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={
                      milestone.complete
                        ? "text-sm line-through text-muted-foreground"
                        : "text-sm font-medium text-foreground"
                    }
                  >
                    {milestone.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due {milestone.dueDate}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
