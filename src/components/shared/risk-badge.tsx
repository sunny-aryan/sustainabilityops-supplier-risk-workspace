import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  className?: string;
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  critical: {
    label: "Critical",
    className:
      "bg-destructive/20 text-destructive border-destructive/40 hover:bg-destructive/20 font-semibold",
  },
  high: {
    label: "High Risk",
    className:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10",
  },
  medium: {
    label: "Medium Risk",
    className:
      "bg-warning/10 text-warning border-warning/20 hover:bg-warning/10",
  },
  low: {
    label: "Low Risk",
    className:
      "bg-success/10 text-success border-success/20 hover:bg-success/10",
  },
};

export function RiskBadge({ level, score, className }: RiskBadgeProps) {
  const config = riskConfig[level];
  return (
    <Badge
      variant="outline"
      className={cn(config.className, "font-medium", className)}
    >
      {score !== undefined ? `${score} · ` : ""}
      {config.label}
    </Badge>
  );
}
