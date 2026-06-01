import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  className?: string;
  accentClassName?: string;
}

export function StatCard({
  label,
  value,
  description,
  trend,
  trendUp,
  icon,
  className,
  accentClassName,
}: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {icon && (
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground",
                accentClassName
              )}
            >
              {icon}
            </div>
          )}
        </div>
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </p>
      </CardHeader>
      {(description ?? trend) && (
        <CardContent className="pt-0">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trendUp === true && "text-success",
                trendUp === false && "text-destructive",
                trendUp === undefined && "text-muted-foreground"
              )}
            >
              {trend}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
