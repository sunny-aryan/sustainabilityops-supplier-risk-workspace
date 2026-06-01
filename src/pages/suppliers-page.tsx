import { useState, useMemo } from "react";
import { Search, PlusCircle, X } from "lucide-react";
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
import type { RiskLevel, RemediationStatus } from "@/types";
import { cn } from "@/lib/utils";

const ALL = "all";

const riskOptions: { value: RiskLevel | "all"; label: string }[] = [
  { value: ALL, label: "All Risk Levels" },
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

const categoryOptions = [
  ALL,
  ...Array.from(new Set(suppliers.map((s) => s.category))).sort(),
];

export function SuppliersPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>(ALL);
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL);
  const [remediationFilter, setRemediationFilter] = useState<string>(ALL);

  const filtered = useMemo(() => {
    return suppliers.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q);
      const matchesRisk = riskFilter === ALL || s.riskLevel === riskFilter;
      const matchesCat = categoryFilter === ALL || s.category === categoryFilter;
      const matchesRem = remediationFilter === ALL || s.remediationStatus === remediationFilter;
      return matchesSearch && matchesRisk && matchesCat && matchesRem;
    });
  }, [search, riskFilter, categoryFilter, remediationFilter]);

  const hasFilters =
    !!search || riskFilter !== ALL || categoryFilter !== ALL || remediationFilter !== ALL;

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
              later milestone. This workflow is not yet implemented in the demo.
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
              <div className="flex flex-wrap items-center gap-2">
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="h-9 w-[150px] text-xs">
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
                  <SelectTrigger className="h-9 w-[160px] text-xs">
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
                  <SelectTrigger className="h-9 w-[160px] text-xs">
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

                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setRiskFilter(ALL);
                      setCategoryFilter(ALL);
                      setRemediationFilter(ALL);
                    }}
                    className="h-9 gap-1.5 text-xs text-muted-foreground"
                  >
                    <X className="size-3" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
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
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No suppliers match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((supplier) => (
                  <TableRow key={supplier.id} className="cursor-default">
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
                ))
              )}
            </TableBody>
          </Table>

          <div className="border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {suppliers.length} suppliers
              {hasFilters ? " (filtered)" : " in demo portfolio"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
