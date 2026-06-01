import { useState, useMemo, useEffect } from "react";
import { Search, PlusCircle, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/shared/section-header";
import { RiskBadge } from "@/components/shared/risk-badge";
import { RemediationBadge } from "@/components/shared/remediation-badge";
import { suppliers } from "@/data/suppliers";
import type {
  RiskLevel,
  RemediationStatus,
  SupplierFilters,
  EvidenceCompletionBucket,
} from "@/types";
import { cn } from "@/lib/utils";

const ALL = "all";

const riskOptions: { value: RiskLevel | "high-or-critical" | "all"; label: string }[] = [
  { value: ALL, label: "All Risk Levels" },
  { value: "high-or-critical", label: "High or Critical" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const remediationOptions: { value: RemediationStatus | "all"; label: string }[] = [
  { value: ALL, label: "All Statuses" },
  { value: "overdue", label: "Overdue" },
  { value: "escalated", label: "Escalated" },
  { value: "in-progress", label: "In Progress" },
  { value: "not-started", label: "Not Started" },
  { value: "complete", label: "Complete" },
];

const evidenceOptions: { value: EvidenceCompletionBucket | "all"; label: string }[] = [
  { value: ALL, label: "All Evidence" },
  { value: "below60", label: "Below 60%" },
  { value: "60to84", label: "60–84%" },
  { value: "above85", label: "85%+" },
];

const categoryOptions = [
  ALL,
  ...Array.from(new Set(suppliers.map((s) => s.category))).sort(),
];

function matchesEvidence(pct: number, bucket: EvidenceCompletionBucket | "all"): boolean {
  if (bucket === ALL) return true;
  if (bucket === "below60") return pct < 60;
  if (bucket === "60to84") return pct >= 60 && pct < 85;
  return pct >= 85;
}

interface SuppliersPageProps {
  initialFilters?: SupplierFilters;
  onOpenSupplier: (id: string) => void;
}

export function SuppliersPage({ initialFilters = {}, onOpenSupplier }: SuppliersPageProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [riskFilter, setRiskFilter] = useState<string>(initialFilters.riskLevel ?? ALL);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialFilters.category ?? ALL);
  const [remediationFilter, setRemediationFilter] = useState<string>(
    initialFilters.remediationStatus ?? ALL
  );
  const [evidenceFilter, setEvidenceFilter] = useState<string>(
    initialFilters.evidenceBucket ?? ALL
  );

  // Sync when initialFilters changes (e.g. dashboard navigation)
  useEffect(() => {
    setSearch(initialFilters.search ?? "");
    setRiskFilter(initialFilters.riskLevel ?? ALL);
    setCategoryFilter(initialFilters.category ?? ALL);
    setRemediationFilter(initialFilters.remediationStatus ?? ALL);
    setEvidenceFilter(initialFilters.evidenceBucket ?? ALL);
  }, [
    initialFilters.search,
    initialFilters.riskLevel,
    initialFilters.category,
    initialFilters.remediationStatus,
    initialFilters.evidenceBucket,
  ]);

  const filtered = useMemo(() => {
    return suppliers.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q);
      const matchesRisk =
        riskFilter === ALL ||
        (riskFilter === "high-or-critical"
          ? s.riskLevel === "high" || s.riskLevel === "critical"
          : s.riskLevel === riskFilter);
      const matchesCat = categoryFilter === ALL || s.category === categoryFilter;
      const matchesRem = remediationFilter === ALL || s.remediationStatus === remediationFilter;
      const matchesEv = matchesEvidence(
        s.evidenceCompleteness,
        evidenceFilter as EvidenceCompletionBucket | "all"
      );
      return matchesSearch && matchesRisk && matchesCat && matchesRem && matchesEv;
    });
  }, [search, riskFilter, categoryFilter, remediationFilter, evidenceFilter]);

  const hasFilters =
    !!search ||
    riskFilter !== ALL ||
    categoryFilter !== ALL ||
    remediationFilter !== ALL ||
    evidenceFilter !== ALL;

  function resetFilters() {
    setSearch("");
    setRiskFilter(ALL);
    setCategoryFilter(ALL);
    setRemediationFilter(ALL);
    setEvidenceFilter(ALL);
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Suppliers"
        description="Monitor sustainability risk and compliance status across your supplier network."
        action={
          <Button size="sm" className="gap-2" onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="size-3.5" />
            Add Supplier
          </Button>
        }
      />

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
            <DialogDescription>
              Supplier onboarding — including risk profiling, evidence
              configuration, and ESG questionnaire — will be available in a
              later milestone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            The full onboarding flow will allow you to add supplier details,
            configure evidence requirements, assign risk dimensions, and trigger
            initial assessment workflows.
          </div>
          <div className="flex justify-end pt-1">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            {/* Search row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, country, region, or category…"
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearch("")}
                  className="shrink-0 gap-1 text-xs text-muted-foreground"
                >
                  <X className="size-3" />
                  Clear search
                </Button>
              )}
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="h-9 w-[148px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {riskOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-xs">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-9 w-[156px] text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c} value={c} className="text-xs">
                      {c === ALL ? "All Categories" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={remediationFilter} onValueChange={setRemediationFilter}>
                <SelectTrigger className="h-9 w-[156px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {remediationOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-xs">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={evidenceFilter} onValueChange={setEvidenceFilter}>
                <SelectTrigger className="h-9 w-[140px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {evidenceOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-xs">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-9 gap-1.5 text-xs text-muted-foreground"
                >
                  <RotateCcw className="size-3" />
                  Reset filters
                </Button>
              )}
            </div>

            {/* Active filter chips */}
            {riskFilter === "high-or-critical" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Active filter:</span>
                <Badge
                  variant="outline"
                  className="gap-1.5 text-xs bg-destructive/10 text-destructive border-destructive/20 cursor-pointer hover:bg-destructive/15"
                  onClick={() => setRiskFilter(ALL)}
                >
                  Risk: High or Critical
                  <X className="size-3" />
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <Search className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  No suppliers match these filters.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try adjusting or resetting your filters to see more results.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2">
                <RotateCcw className="size-3.5" />
                Reset filters
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Country / Region</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Remediation</TableHead>
                  <TableHead>Regulatory Exposure</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((supplier) => (
                  <TableRow
                    key={supplier.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onOpenSupplier(supplier.id)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground leading-tight">
                          {supplier.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {supplier.id} · {supplier.criticality} criticality
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">{supplier.country}</p>
                      <p className="text-xs text-muted-foreground">{supplier.region}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {supplier.category}
                    </TableCell>
                    <TableCell>
                      <RiskBadge level={supplier.riskLevel} score={supplier.riskScore} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[90px]">
                        <Progress
                          value={supplier.evidenceCompleteness}
                          className={cn(
                            "h-1.5 w-14",
                            supplier.evidenceCompleteness >= 75
                              ? "[&>[data-slot=progress-indicator]]:bg-success"
                              : supplier.evidenceCompleteness >= 50
                              ? "[&>[data-slot=progress-indicator]]:bg-warning"
                              : "[&>[data-slot=progress-indicator]]:bg-destructive"
                          )}
                        />
                        <span className="text-xs text-muted-foreground">
                          {supplier.evidenceCompleteness}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RemediationBadge status={supplier.remediationStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {supplier.regulatoryExposure.slice(0, 2).map((reg) => (
                          <Badge
                            key={reg}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground border-border"
                          >
                            {reg}
                          </Badge>
                        ))}
                        {supplier.regulatoryExposure.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground border-border"
                          >
                            +{supplier.regulatoryExposure.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {supplier.lastUpdated}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {suppliers.length} suppliers
              {hasFilters ? " (filtered)" : ""}
              {filtered.length > 0 && " · Click a row to view supplier details"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
