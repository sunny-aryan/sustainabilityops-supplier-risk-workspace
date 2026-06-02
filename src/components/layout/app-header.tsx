import { Bell, ChevronRight, Info, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { DEMO_MODE_LABELS, type DemoMode } from "@/utils/demoState";
import type { Page, Role } from "@/types";

const pageTitles: Record<Page, string> = {
  welcome: "Welcome",
  dashboard: "Dashboard",
  suppliers: "Suppliers",
  "action-queue": "Action Queue",
  "supplier-portal": "Supplier Portal",
  methodology: "Methodology & Trust Center",
};

const roleLabels: Record<Role, string> = {
  procurement: "Procurement Manager",
  "esg-analyst": "ESG / Compliance Analyst",
  supplier: "Supplier User",
};

const roleContextNote: Record<Role, string> = {
  procurement: "Supplier risk exposure & sourcing decisions",
  "esg-analyst": "Evidence review, policy rules & audit readiness",
  supplier:
    "Demo view: showing evidence requests & remediation milestones only",
};

interface AppHeaderProps {
  currentPage: Page;
  currentRole: Role;
  demoMode: DemoMode;
  onRoleChange: (role: Role) => void;
  onDemoModeChange: (mode: DemoMode) => void;
}

export function AppHeader({
  currentPage,
  currentRole,
  demoMode,
  onRoleChange,
  onDemoModeChange,
}: AppHeaderProps) {
  const isNormal = demoMode === "normal";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>SustainOps</span>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">
          {pageTitles[currentPage]}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Role context note */}
        <div className="hidden items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground md:flex">
          <Info className="size-3 shrink-0" />
          <span>{roleContextNote[currentRole]}</span>
        </div>

        {/* Demo Controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 gap-1.5 text-xs ${!isNormal ? "border-warning/50 bg-warning/10 text-warning hover:bg-warning/15" : ""}`}
            >
              <FlaskConical className="size-3.5" />
              <span className="hidden sm:inline">
                {isNormal ? "Demo Controls" : DEMO_MODE_LABELS[demoMode]}
              </span>
              {!isNormal && (
                <Badge
                  variant="outline"
                  className="ml-0.5 h-3.5 border-warning/40 bg-warning/20 px-1 text-[9px] text-warning"
                >
                  ACTIVE
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              System State Simulation
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.entries(DEMO_MODE_LABELS) as [DemoMode, string][]).map(
              ([mode, label]) => (
                <DropdownMenuItem
                  key={mode}
                  className="text-xs"
                  onClick={() => onDemoModeChange(mode)}
                >
                  <span
                    className={
                      demoMode === mode ? "font-semibold text-foreground" : ""
                    }
                  >
                    {label}
                  </span>
                  {demoMode === mode && (
                    <Badge
                      variant="outline"
                      className="ml-auto h-3.5 border-success/40 bg-success/10 px-1 text-[9px] text-success"
                    >
                      ON
                    </Badge>
                  )}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select
          value={currentRole}
          onValueChange={(v) => onRoleChange(v as Role)}
        >
          <SelectTrigger className="h-8 w-[220px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(roleLabels) as [Role, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
        </Button>

        <ModeToggle />
      </div>
    </header>
  );
}
