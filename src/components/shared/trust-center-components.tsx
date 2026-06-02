import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RuleCardProps {
  rule: string;
  consequence: string;
  type?: "threshold" | "block" | "trigger" | "boundary";
}

const ruleTypeConfig = {
  threshold: { label: "Threshold", className: "bg-primary/10 text-primary border-primary/20" },
  block: { label: "Blocks", className: "bg-destructive/10 text-destructive border-destructive/20" },
  trigger: { label: "Triggers", className: "bg-warning/10 text-warning border-warning/20" },
  boundary: { label: "Boundary", className: "bg-muted text-muted-foreground border-border" },
};

export function RuleCard({ rule, consequence, type = "threshold" }: RuleCardProps) {
  const config = ruleTypeConfig[type];
  return (
    <div className="flex items-start gap-3 rounded-md border bg-card px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-foreground leading-relaxed">{rule}</p>
        <p className="text-xs text-muted-foreground mt-1">{consequence}</p>
      </div>
      <Badge variant="outline" className={cn("text-[10px] h-4 px-1.5 shrink-0", config.className)}>
        {config.label}
      </Badge>
    </div>
  );
}

interface BoundaryCardProps {
  canDo: string[];
  cannotDo: string[];
  principle?: string;
}

export function BoundaryCard({ canDo, cannotDo, principle }: BoundaryCardProps) {
  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-success uppercase tracking-wide">AI can</p>
            <ul className="space-y-1.5">
              {canDo.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-destructive uppercase tracking-wide">AI cannot</p>
            <ul className="space-y-1.5">
              {cannotDo.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {principle && (
          <div className="rounded-md border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground italic border-muted">
            &ldquo;{principle}&rdquo;
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MethodologySectionProps {
  title: string;
  badge?: string;
  badgeClass?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export function MethodologySection({ title, badge, badgeClass, icon: Icon, children }: MethodologySectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="size-3.5 text-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {badge && (
          <Badge variant="outline" className={cn("text-[10px] h-4 px-1.5", badgeClass)}>
            {badge}
          </Badge>
        )}
      </div>
      {children}
    </div>
  );
}

interface ExplainabilityLinkProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export function ExplainabilityLink({ label, onClick, className }: ExplainabilityLinkProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline",
        className
      )}
    >
      {label}
    </button>
  );
}
