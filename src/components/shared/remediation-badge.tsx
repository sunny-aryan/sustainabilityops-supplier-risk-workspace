import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RemediationStatus } from "@/types";

interface RemediationBadgeProps {
  status: RemediationStatus;
  className?: string;
}

const remediationConfig: Record<RemediationStatus, { label: string; className: string }> = {
  complete: {
    label: "Complete",
    className: "bg-success/10 text-success border-success/20 hover:bg-success/10",
  },
  "on-track": {
    label: "On Track",
    className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10",
  },
  overdue: {
    label: "Overdue",
    className:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10",
  },
  escalated: {
    label: "Escalated",
    className:
      "bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/20 font-semibold",
  },
  "not-started": {
    label: "Not Started",
    className: "bg-muted text-muted-foreground border-border hover:bg-muted",
  },
};

export function RemediationBadge({ status, className }: RemediationBadgeProps) {
  const config = remediationConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn(config.className, "font-medium", className)}
    >
      {config.label}
    </Badge>
  );
}
