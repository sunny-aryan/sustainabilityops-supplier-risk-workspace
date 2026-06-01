import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { WelcomePage } from "@/pages/welcome-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { SuppliersPage } from "@/pages/suppliers-page";
import { SupplierDetailPage } from "@/pages/supplier-detail-page";
import { ActionQueuePage } from "@/pages/action-queue-page";
import { SupplierPortalPage } from "@/pages/supplier-portal-page";
import { MethodologyPage } from "@/pages/methodology-page";
import type { Page, Role, SupplierFilters } from "@/types";

interface PageContentProps {
  page: Page;
  role: Role;
  supplierDetailId: string | null;
  supplierFilters: SupplierFilters;
  onNavigate: (page: Page, filters?: SupplierFilters) => void;
  onOpenSupplier: (id: string) => void;
  onBackFromDetail: () => void;
}

function PageContent({
  page,
  role,
  supplierDetailId,
  supplierFilters,
  onNavigate,
  onOpenSupplier,
  onBackFromDetail,
}: PageContentProps) {
  if (supplierDetailId) {
    return (
      <SupplierDetailPage
        supplierId={supplierDetailId}
        role={role}
        onBack={onBackFromDetail}
      />
    );
  }

  switch (page) {
    case "dashboard":
      return (
        <DashboardPage
          role={role}
          onNavigate={onNavigate}
          onOpenSupplier={onOpenSupplier}
        />
      );
    case "suppliers":
      return (
        <SuppliersPage
          initialFilters={supplierFilters}
          onOpenSupplier={onOpenSupplier}
        />
      );
    case "action-queue":
      return (
        <ActionQueuePage
          role={role}
          onOpenSupplier={onOpenSupplier}
        />
      );
    case "supplier-portal":
      return <SupplierPortalPage role={role} />;
    case "methodology":
      return <MethodologyPage role={role} />;
    default:
      return (
        <DashboardPage
          role={role}
          onNavigate={onNavigate}
          onOpenSupplier={onOpenSupplier}
        />
      );
  }
}

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [currentRole, setCurrentRole] = useState<Role>("procurement");
  const [supplierDetailId, setSupplierDetailId] = useState<string | null>(null);
  const [supplierFilters, setSupplierFilters] = useState<SupplierFilters>({});

  function handleRoleChange(role: Role) {
    setCurrentRole(role);
    if (role === "supplier" && currentPage !== "welcome") {
      setCurrentPage("supplier-portal");
      setSupplierDetailId(null);
    }
  }

  function handleEnter(role: Role) {
    setCurrentRole(role);
    setCurrentPage(role === "supplier" ? "supplier-portal" : "dashboard");
  }

  function handleNavigate(page: Page, filters?: SupplierFilters) {
    setSupplierDetailId(null);
    setSupplierFilters(filters ?? {});
    setCurrentPage(page);
  }

  function handleOpenSupplier(id: string) {
    setSupplierDetailId(id);
  }

  function handleBackFromDetail() {
    setSupplierDetailId(null);
  }

  if (currentPage === "welcome") {
    return <WelcomePage onEnter={handleEnter} />;
  }

  return (
    <AppLayout
      currentPage={currentPage}
      currentRole={currentRole}
      onNavigate={(page) => handleNavigate(page)}
      onRoleChange={handleRoleChange}
    >
      <PageContent
        page={currentPage}
        role={currentRole}
        supplierDetailId={supplierDetailId}
        supplierFilters={supplierFilters}
        onNavigate={handleNavigate}
        onOpenSupplier={handleOpenSupplier}
        onBackFromDetail={handleBackFromDetail}
      />
    </AppLayout>
  );
}

export default App;
