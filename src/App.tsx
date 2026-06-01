import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { WelcomePage } from "@/pages/welcome-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { SuppliersPage } from "@/pages/suppliers-page";
import { ActionQueuePage } from "@/pages/action-queue-page";
import { SupplierPortalPage } from "@/pages/supplier-portal-page";
import { MethodologyPage } from "@/pages/methodology-page";
import type { Page, Role } from "@/types";

interface PageContentProps {
  page: Page;
  role: Role;
}

function PageContent({ page, role }: PageContentProps) {
  switch (page) {
    case "dashboard":
      return <DashboardPage role={role} />;
    case "suppliers":
      return <SuppliersPage />;
    case "action-queue":
      return <ActionQueuePage role={role} />;
    case "supplier-portal":
      return <SupplierPortalPage role={role} />;
    case "methodology":
      return <MethodologyPage role={role} />;
    default:
      return <DashboardPage role={role} />;
  }
}

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [currentRole, setCurrentRole] = useState<Role>("procurement");

  // When role changes to supplier, auto-navigate to portal
  function handleRoleChange(role: Role) {
    setCurrentRole(role);
    if (role === "supplier" && currentPage !== "welcome") {
      setCurrentPage("supplier-portal");
    }
  }

  // When entering workspace as supplier, go to portal
  function handleEnter(role: Role) {
    setCurrentRole(role);
    setCurrentPage(role === "supplier" ? "supplier-portal" : "dashboard");
  }

  if (currentPage === "welcome") {
    return <WelcomePage onEnter={handleEnter} />;
  }

  return (
    <AppLayout
      currentPage={currentPage}
      currentRole={currentRole}
      onNavigate={setCurrentPage}
      onRoleChange={handleRoleChange}
    >
      <PageContent page={currentPage} role={currentRole} />
    </AppLayout>
  );
}

export default App;
