import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Globe,
  ShieldCheck,
  Leaf,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import type { Page } from "@/types";

interface NavItem {
  label: string;
  page: Page;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", page: "dashboard", icon: LayoutDashboard },
  { label: "Suppliers", page: "suppliers", icon: Building2 },
  { label: "Action Queue", page: "action-queue", icon: ClipboardList },
  { label: "Supplier Portal", page: "supplier-portal", icon: Globe },
  {
    label: "Methodology & Trust",
    page: "methodology",
    icon: ShieldCheck,
  },
];

interface AppSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-4">
        <button
          onClick={() => onNavigate("welcome")}
          className="flex items-center gap-2.5 rounded-md p-1 -m-1 hover:bg-muted transition-colors text-left"
          aria-label="Return to home"
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </div>
          <span className="truncate text-sm font-semibold tracking-tight text-foreground">
            SustainOps
          </span>
        </button>
      </SidebarHeader>

      <Separator className="mb-2" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    isActive={currentPage === item.page}
                    tooltip={item.label}
                    onClick={() => onNavigate(item.page)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Demo workspace — sample data only
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
