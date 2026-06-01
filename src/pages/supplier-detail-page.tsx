import {
  ArrowLeft,
  MapPin,
  Tag,
  Euro,
  ShieldAlert,
  FileCheck2,
  ClipboardList,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RiskBadge } from "@/components/shared/risk-badge";
import { RemediationBadge } from "@/components/shared/remediation-badge";
import { suppliers } from "@/data/suppliers";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

interface SupplierDetailPageProps {
  supplierId: string;
  role: Role;
  onBack: () => void;
}

const roleActionLabels: Record<Role, string> = {
  procurement: "Sourcing risk review and supplier prioritisation",
  "esg-analyst": "Evidence gap review and compliance assessment",
  supplier: "Evidence submission and remediation milestones",
};

export function SupplierDetailPage({ supplierId, role, onBack }: SupplierDetailPageProps) {
  const supplier = suppliers.find((s) => s.id === supplierId);

  if (!supplier) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to Suppliers
        </Button>
        <p className="text-sm text-muted-foreground">Supplier not found.</p>
      </div>
    );
  }

  const evidenceColor =
    supplier.evidenceCompleteness >= 75
      ? "[&>[data-slot=progress-indicator]]:bg-success"
      : supplier.evidenceCompleteness >= 50
      ? "[&>[data-slot=progress-indicator]]:bg-warning"
      : "[&>[data-slot=progress-indicator]]:bg-destructive";

  const spendFormatted = new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(supplier.annualSpendEur);

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to Suppliers
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {supplier.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {supplier.country}, {supplier.region}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="size-3.5" />
              {supplier.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Euro className="size-3.5" />
              {spendFormatted} annual spend
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RiskBadge level={supplier.riskLevel} score={supplier.riskScore} />
          <RemediationBadge status={supplier.remediationStatus} />
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground border-border"
          >
            {supplier.criticality} criticality
          </Badge>
        </div>
      </div>

      {/* Role-aware context */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="size-4 text-primary" />
        <AlertDescription className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{roleActionLabels[role]}:</span>{" "}
          {supplier.requiredActions.length > 0
            ? supplier.requiredActions[0]
            : "No immediate actions pending for this supplier."}
        </AlertDescription>
      </Alert>

      {/* Core metrics row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <ShieldAlert className="size-3.5" />
              <span className="text-xs font-medium">Risk Score</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{supplier.riskScore}</p>
            <RiskBadge level={supplier.riskLevel} className="mt-1.5 text-[10px] h-5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileCheck2 className="size-3.5" />
              <span className="text-xs font-medium">Evidence</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{supplier.evidenceCompleteness}%</p>
            <Progress value={supplier.evidenceCompleteness} className={cn("h-1.5 mt-2", evidenceColor)} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="size-3.5" />
              <span className="text-xs font-medium">Open Findings</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{supplier.openFindings}</p>
            <p className="text-xs text-muted-foreground mt-1">unresolved items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <ClipboardList className="size-3.5" />
              <span className="text-xs font-medium">Remediation</span>
            </div>
            <RemediationBadge status={supplier.remediationStatus} className="mt-1" />
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Risk drivers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldAlert className="size-4 text-destructive" />
              Risk Drivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supplier.riskDrivers.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 className="size-4" />
                No active risk drivers identified.
              </div>
            ) : (
              <ul className="space-y-2">
                {supplier.riskDrivers.slice(0, 3).map((driver, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-foreground leading-snug">{driver}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Required actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="size-4 text-warning" />
              Required Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supplier.requiredActions.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 className="size-4" />
                No pending actions for this supplier.
              </div>
            ) : (
              <ul className="space-y-2">
                {supplier.requiredActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-foreground leading-snug">{action}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Regulatory exposure */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Regulatory Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supplier.regulatoryExposure.map((reg) => (
                <Badge
                  key={reg}
                  variant="outline"
                  className="bg-muted text-muted-foreground border-border"
                >
                  {reg}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supplier details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Supplier Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <User className="size-3.5" />
                  Owner
                </dt>
                <dd className="font-medium text-foreground">{supplier.owner}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Next Review
                </dt>
                <dd className="font-medium text-foreground">{supplier.nextReviewDate}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Last Updated</dt>
                <dd className="font-medium text-foreground">{supplier.lastUpdated}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Annual Spend</dt>
                <dd className="font-medium text-foreground">{spendFormatted}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Criticality</dt>
                <dd className="font-medium text-foreground">{supplier.criticality}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Future capabilities placeholder */}
      <Card className="border-dashed border-muted-foreground/30">
        <CardContent className="py-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">Coming in the next milestone</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Detailed evidence review, compliance mapping, remediation workflow, and activity timeline will be added in the next milestones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
