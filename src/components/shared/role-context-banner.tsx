import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Role } from "@/types";

const SUPPLIER_INTERNAL_COPY =
  "Demo role view: supplier users would normally only access supplier-facing evidence requests and remediation milestones. Their primary workspace is the Supplier Portal.";

interface RoleContextBannerProps {
  role: Role;
}

export function RoleContextBanner({ role }: RoleContextBannerProps) {
  if (role !== "supplier") return null;
  return (
    <Alert className="border-warning/30 bg-warning/5">
      <Info className="size-4 text-warning" />
      <AlertDescription className="text-sm text-muted-foreground">
        {SUPPLIER_INTERNAL_COPY}
      </AlertDescription>
    </Alert>
  );
}
