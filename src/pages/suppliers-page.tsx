import { useState } from "react";
import { Search, SlidersHorizontal, PlusCircle } from "lucide-react";
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
import { SectionHeader } from "@/components/shared/section-header";
import { RiskBadge } from "@/components/shared/risk-badge";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import { RemediationBadge } from "@/components/shared/remediation-badge";
import { mockSuppliers } from "@/data/mock-data";

export function SuppliersPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

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

      {/* Add Supplier placeholder dialog */}
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

      {/* Search & filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search suppliers by name, category, or country…"
                className="pl-9"
                disabled
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-2 opacity-50"
              >
                <SlidersHorizontal className="size-3.5" />
                Risk Level
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-2 opacity-50"
              >
                <SlidersHorizontal className="size-3.5" />
                Evidence Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-2 opacity-50"
              >
                <SlidersHorizontal className="size-3.5" />
                Category
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Remediation</TableHead>
                <TableHead>Last Assessed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSuppliers.map((supplier) => (
                <TableRow key={supplier.id} className="cursor-default">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {supplier.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {supplier.id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {supplier.category}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {supplier.country}
                  </TableCell>
                  <TableCell>
                    <RiskBadge
                      level={supplier.riskLevel}
                      score={supplier.riskScore}
                    />
                  </TableCell>
                  <TableCell>
                    <EvidenceBadge
                      status={supplier.evidenceStatus}
                      completion={supplier.evidenceCompletion}
                    />
                  </TableCell>
                  <TableCell>
                    <RemediationBadge status={supplier.remediationStatus} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {supplier.lastAssessed}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Showing 3 sample suppliers from a 47-supplier demo portfolio.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
