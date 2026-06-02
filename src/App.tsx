import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { WelcomePage } from "@/pages/welcome-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { SuppliersPage } from "@/pages/suppliers-page";
import { SupplierDetailPage } from "@/pages/supplier-detail-page";
import { ActionQueuePage } from "@/pages/action-queue-page";
import { SupplierPortalPage } from "@/pages/supplier-portal-page";
import { MethodologyPage } from "@/pages/methodology-page";
import { useRemediationStore } from "@/utils/remediation";
import type { DemoMode } from "@/utils/demoState";
import type { Page, Role, SupplierFilters } from "@/types";

interface PageContentProps {
  page: Page;
  role: Role;
  demoMode: DemoMode;
  supplierDetailId: string | null;
  supplierFilters: SupplierFilters;
  onNavigate: (page: Page, filters?: SupplierFilters) => void;
  onOpenSupplier: (id: string) => void;
  onBackFromDetail: () => void;
  remediationStore: ReturnType<typeof useRemediationStore>;
}

function PageContent({
  page,
  role,
  demoMode,
  supplierDetailId,
  supplierFilters,
  onNavigate,
  onOpenSupplier,
  onBackFromDetail,
  remediationStore,
}: PageContentProps) {
  if (supplierDetailId) {
    return (
      <SupplierDetailPage
        supplierId={supplierDetailId}
        role={role}
        demoMode={demoMode}
        onBack={onBackFromDetail}
        remediationStore={remediationStore}
      />
    );
  }

  switch (page) {
    case "dashboard":
      return (
        <DashboardPage
          role={role}
          demoMode={demoMode}
          onNavigate={onNavigate}
          onOpenSupplier={onOpenSupplier}
        />
      );
    case "suppliers":
      return (
        <SuppliersPage
          initialFilters={supplierFilters}
          demoMode={demoMode}
          role={role}
          onOpenSupplier={onOpenSupplier}
        />
      );
    case "action-queue":
      return (
        <ActionQueuePage
          role={role}
          demoMode={demoMode}
          onOpenSupplier={onOpenSupplier}
          remediationStore={remediationStore}
        />
      );
    case "supplier-portal":
      return <SupplierPortalPage role={role} demoMode={demoMode} remediationStore={remediationStore} />;
    case "methodology":
      return <MethodologyPage role={role} />;
    default:
      return (
        <DashboardPage
          role={role}
          demoMode={demoMode}
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
  const [demoMode, setDemoMode] = useState<DemoMode>("normal");
  const remediationStore = useRemediationStore();

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
      demoMode={demoMode}
      onNavigate={(page) => handleNavigate(page)}
      onRoleChange={handleRoleChange}
      onDemoModeChange={setDemoMode}
    >
      <PageContent
        page={currentPage}
        role={currentRole}
        demoMode={demoMode}
        supplierDetailId={supplierDetailId}
        supplierFilters={supplierFilters}
        onNavigate={handleNavigate}
        onOpenSupplier={handleOpenSupplier}
        onBackFromDetail={handleBackFromDetail}
        remediationStore={remediationStore}
      />
    </AppLayout>
  );
}

export default App;
