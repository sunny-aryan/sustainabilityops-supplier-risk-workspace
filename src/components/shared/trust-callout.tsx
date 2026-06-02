import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface TrustCalloutProps {
  children: React.ReactNode;
  variant?: "info" | "warning" | "destructive" | "muted";
  className?: string;
}

export function TrustCallout({ children, variant = "info", className }: TrustCalloutProps) {
  const variantClass =
    variant === "warning"
      ? "border-warning/30 bg-warning/5"
      : variant === "destructive"
      ? "border-destructive/30 bg-destructive/5"
      : variant === "muted"
      ? "border-muted bg-muted/30"
      : "border-primary/20 bg-primary/5";

  const iconClass =
    variant === "warning"
      ? "text-warning"
      : variant === "destructive"
      ? "text-destructive"
      : variant === "muted"
      ? "text-muted-foreground"
      : "text-primary";

  return (
    <Alert className={cn(variantClass, "py-2.5", className)}>
      <Info className={cn("size-3.5", iconClass)} />
      <AlertDescription className="text-xs text-muted-foreground">{children}</AlertDescription>
    </Alert>
  );
}
