import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EvidenceStatus } from "@/types";

interface EvidenceBadgeProps {
  status: EvidenceStatus;
  completion?: number;
  className?: string;
}

const evidenceConfig: Record<
  EvidenceStatus,
  { label: string; className: string }
> = {
  complete: {
    label: "Complete",
    className:
      "bg-success/10 text-success border-success/20 hover:bg-success/10",
  },
  partial: {
    label: "Partial",
    className:
      "bg-warning/10 text-warning border-warning/20 hover:bg-warning/10",
  },
  missing: {
    label: "Missing",
    className:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10",
  },
};

export function EvidenceBadge({
  status,
  completion,
  className,
}: EvidenceBadgeProps) {
  const config = evidenceConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn(config.className, "font-medium", className)}
    >
      {completion !== undefined ? `${completion}% · ` : ""}
      {config.label}
    </Badge>
  );
}
