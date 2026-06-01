import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import type { Page, Role } from "@/types";

interface AppLayoutProps {
  currentPage: Page;
  currentRole: Role;
  onNavigate: (page: Page) => void;
  onRoleChange: (role: Role) => void;
  children: React.ReactNode;
}

export function AppLayout({
  currentPage,
  currentRole,
  onNavigate,
  onRoleChange,
  children,
}: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} onNavigate={onNavigate} />
      <SidebarInset>
        <AppHeader
          currentPage={currentPage}
          currentRole={currentRole}
          onRoleChange={onRoleChange}
        />
        <main className="flex flex-1 flex-col gap-6 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
