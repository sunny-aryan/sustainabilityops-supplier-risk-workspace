import { ClipboardList, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Role } from "@/types";

interface ActionQueuePageProps {
  role: Role;
}

const roleDescriptions: Record<Role, string> = {
  procurement:
    "Tasks, evidence requests, and overdue items requiring your review or sourcing decision.",
  "esg-analyst":
    "Evidence gaps, policy flags, and compliance items requiring your review or decision.",
  supplier:
    "Demo view: Action Queue is an internal workspace. Supplier users manage evidence and milestones via the Supplier Portal.",
};

export function ActionQueuePage({ role }: ActionQueuePageProps) {
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

      <Card>
        <CardContent className="py-12">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardList />
              </EmptyMedia>
              <EmptyTitle>No items in queue</EmptyTitle>
              <EmptyDescription>
                Supplier evidence gaps, overdue remediation tasks, and
                suppliers requiring review will surface here as prioritised,
                actionable items.
              </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
              <div className="grid w-full gap-3 text-left">
                {[
                  {
                    title: "Evidence Gaps",
                    description:
                      "Suppliers with missing or incomplete documentation will appear here for follow-up.",
                  },
                  {
                    title: "Overdue Remediation",
                    description:
                      "Remediation plans past their due date are escalated to this queue automatically.",
                  },
                  {
                    title: "Review Required",
                    description:
                      "Suppliers flagged by policy rules for manual compliance review.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-md border bg-muted/30 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  );
}
