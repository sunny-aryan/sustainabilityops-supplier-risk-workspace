import type { ComplianceMapping } from "@/types";

export const complianceMappings: ComplianceMapping[] = [
  // ── sup-001: GreenWeave Textiles (CSDDD, CSRD, Internal)
  { id: "cm-001-01", supplierId: "sup-001", framework: "CSDDD", applicability: "Applicable", readiness: "Blocked", requiredEvidence: ["Labour Standards Audit", "Modern Slavery Policy Statement", "Environmental Compliance Certificate"], reason: "Supplier is in scope as a direct business partner in a high-risk sector (textiles, Bangladesh). Critical evidence missing blocks compliance.", lastAssessed: "2026-05-01" },
  { id: "cm-001-02", supplierId: "sup-001", framework: "CSRD", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["Carbon Emissions Baseline", "Supplier Code of Conduct Acknowledgement"], reason: "CSRD Scope 3 value chain disclosure requires emissions data from direct suppliers.", lastAssessed: "2026-05-01" },
  { id: "cm-001-03", supplierId: "sup-001", framework: "EUDR", applicability: "Not Applicable", readiness: "Ready", requiredEvidence: [], reason: "Textiles sector not currently in scope of EUDR commodities list.", lastAssessed: "2026-05-01" },
  { id: "cm-001-04", supplierId: "sup-001", framework: "CBAM", applicability: "Not Applicable", readiness: "Ready", requiredEvidence: [], reason: "Textiles not in CBAM covered sectors (cement, iron, steel, aluminium, fertilisers, electricity, hydrogen).", lastAssessed: "2026-05-01" },
  { id: "cm-001-05", supplierId: "sup-001", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Blocked", requiredEvidence: ["Labour Standards Audit", "Anti-bribery & Corruption Policy"], reason: "Mandatory for all direct suppliers. Audit and policy missing.", lastAssessed: "2026-05-01" },

  // ── sup-002: Rainforest Oils Collective (EUDR, CSDDD, CSRD)
  { id: "cm-002-01", supplierId: "sup-002", framework: "EUDR", applicability: "Applicable", readiness: "Blocked", requiredEvidence: ["Deforestation-Free Declaration (EUDR)", "Geo-coordinates of Sourcing Plots", "Third-party Environmental Audit"], reason: "Palm oil is a listed EUDR commodity. Deforestation-free declaration and plot traceability are required before goods can be placed on EU market.", lastAssessed: "2026-05-01" },
  { id: "cm-002-02", supplierId: "sup-002", framework: "CSDDD", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["Labour Standards Self-Assessment", "Third-party Environmental Audit"], reason: "Supplier in high-deforestation-risk region with incomplete due diligence. CSDDD Art. 8 requires risk mitigation plan.", lastAssessed: "2026-05-01" },
  { id: "cm-002-03", supplierId: "sup-002", framework: "CSRD", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["Carbon Emissions Baseline"], reason: "CSRD value chain disclosure requires GHG data from direct suppliers.", lastAssessed: "2026-05-01" },
  { id: "cm-002-04", supplierId: "sup-002", framework: "CBAM", applicability: "Not Applicable", readiness: "Ready", requiredEvidence: [], reason: "Palm oil not in CBAM covered sectors.", lastAssessed: "2026-05-01" },
  { id: "cm-002-05", supplierId: "sup-002", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["Anti-bribery & Corruption Policy"], reason: "Code of conduct signed but anti-bribery policy not yet on file.", lastAssessed: "2026-05-01" },

  // ── sup-003: SunVolt Battery Materials (CSDDD, CSRD, CBAM)
  { id: "cm-003-01", supplierId: "sup-003", framework: "CSDDD", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["Cobalt Chain-of-Custody Documentation", "Environmental Impact Assessment"], reason: "Battery materials with cobalt sourcing in high-risk jurisdiction. CSDDD Annex requires minerals conflict risk assessment.", lastAssessed: "2026-05-05" },
  { id: "cm-003-02", supplierId: "sup-003", framework: "CSRD", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["Carbon Emissions Baseline"], reason: "Scope 3 reporting requires full value chain emissions. Scope 3 data not yet submitted.", lastAssessed: "2026-05-05" },
  { id: "cm-003-03", supplierId: "sup-003", framework: "CBAM", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["CBAM Carbon Data Disclosure"], reason: "Battery materials include aluminium and steel components in CBAM scope. Embedded carbon data required.", lastAssessed: "2026-05-05" },
  { id: "cm-003-04", supplierId: "sup-003", framework: "EUDR", applicability: "Not Applicable", readiness: "Ready", requiredEvidence: [], reason: "Battery materials sector not in EUDR commodities scope.", lastAssessed: "2026-05-05" },
  { id: "cm-003-05", supplierId: "sup-003", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Code of conduct signed. Anti-bribery policy on file.", lastAssessed: "2026-05-05" },

  // ── sup-004: BlueRiver Cocoa Exporters (EUDR, CSDDD)
  { id: "cm-004-01", supplierId: "sup-004", framework: "EUDR", applicability: "Applicable", readiness: "Blocked", requiredEvidence: ["EUDR Traceability Evidence Package", "Geo-coordinates of Sourcing Plots"], reason: "Cocoa is a listed EUDR commodity. Traceability package overdue 28 days. Procurement hold triggered.", lastAssessed: "2026-05-01" },
  { id: "cm-004-02", supplierId: "sup-004", framework: "CSDDD", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["Child Labour Due Diligence Report"], reason: "High-risk sector and geography for child labour. CSDDD Art. 7 requires documented risk prevention.", lastAssessed: "2026-05-01" },
  { id: "cm-004-03", supplierId: "sup-004", framework: "CSRD", applicability: "Possibly Applicable", readiness: "Review Required", requiredEvidence: ["Carbon Emissions Baseline"], reason: "Depends on group turnover threshold of buyer. CSRD applicability to be confirmed for 2026 reporting year.", lastAssessed: "2026-05-01" },
  { id: "cm-004-04", supplierId: "sup-004", framework: "CBAM", applicability: "Not Applicable", readiness: "Ready", requiredEvidence: [], reason: "Cocoa not in CBAM covered sectors.", lastAssessed: "2026-05-01" },
  { id: "cm-004-05", supplierId: "sup-004", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Code of conduct signed. No additional requirements.", lastAssessed: "2026-05-01" },

  // ── sup-005: CleanFiber Apparel (CSDDD, CSRD)
  { id: "cm-005-01", supplierId: "sup-005", framework: "CSDDD", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["Wastewater Discharge Compliance Report", "Working Hours & Overtime Audit"], reason: "Environmental non-compliance and labour hour violations are CSDDD Art. 6 adverse impacts.", lastAssessed: "2026-05-05" },
  { id: "cm-005-02", supplierId: "sup-005", framework: "CSRD", applicability: "Applicable", readiness: "Review Required", requiredEvidence: ["Carbon Emissions Baseline"], reason: "Scope 3 data under review. Readiness pending analyst sign-off.", lastAssessed: "2026-05-05" },
  { id: "cm-005-03", supplierId: "sup-005", framework: "EUDR", applicability: "Not Applicable", readiness: "Ready", requiredEvidence: [], reason: "Apparel sector not in EUDR commodities scope.", lastAssessed: "2026-05-05" },
  { id: "cm-005-04", supplierId: "sup-005", framework: "CBAM", applicability: "Not Applicable", readiness: "Ready", requiredEvidence: [], reason: "Apparel not in CBAM covered sectors.", lastAssessed: "2026-05-05" },
  { id: "cm-005-05", supplierId: "sup-005", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Code of conduct signed.", lastAssessed: "2026-05-05" },

  // ── sup-006–010: Medium risk suppliers (representative mappings)
  { id: "cm-006-01", supplierId: "sup-006", framework: "CSDDD", applicability: "Applicable", readiness: "Review Required", requiredEvidence: ["OECD Due Diligence Self-Assessment"], reason: "Metals sector with water-stress and carbon risks. OECD DD guidance applicable.", lastAssessed: "2026-05-10" },
  { id: "cm-006-02", supplierId: "sup-006", framework: "CBAM", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["CBAM Carbon Data Report"], reason: "Metals processing is in CBAM scope. Carbon data overdue.", lastAssessed: "2026-05-10" },
  { id: "cm-006-03", supplierId: "sup-006", framework: "CSRD", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Carbon emissions baseline complete. Value chain disclosure satisfied.", lastAssessed: "2026-05-10" },
  { id: "cm-006-04", supplierId: "sup-006", framework: "EUDR", applicability: "Not Applicable", readiness: "Ready", requiredEvidence: [], reason: "Metals not in EUDR scope.", lastAssessed: "2026-05-10" },
  { id: "cm-006-05", supplierId: "sup-006", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Code of conduct and anti-bribery on file.", lastAssessed: "2026-05-10" },

  { id: "cm-007-01", supplierId: "sup-007", framework: "CSRD", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["CBAM Transitional Carbon Report"], reason: "CSRD Scope 3 includes chemicals. Carbon reporting overdue.", lastAssessed: "2026-05-12" },
  { id: "cm-007-02", supplierId: "sup-007", framework: "CBAM", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["CBAM Transitional Carbon Report"], reason: "Chemical fertilisers are in CBAM scope. Transitional report overdue.", lastAssessed: "2026-05-12" },
  { id: "cm-007-03", supplierId: "sup-007", framework: "CSDDD", applicability: "Possibly Applicable", readiness: "Review Required", requiredEvidence: ["REACH Substance Compliance List"], reason: "REACH gaps may constitute environmental adverse impacts under CSDDD.", lastAssessed: "2026-05-12" },
  { id: "cm-007-04", supplierId: "sup-007", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Code of conduct signed.", lastAssessed: "2026-05-12" },

  { id: "cm-008-01", supplierId: "sup-008", framework: "CSDDD", applicability: "Applicable", readiness: "Review Required", requiredEvidence: ["Health & Safety Audit Report"], reason: "H&S audit under review. CSDDD health/safety adverse impact assessment pending.", lastAssessed: "2026-05-08" },
  { id: "cm-008-02", supplierId: "sup-008", framework: "CSRD", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Emissions and social data on file.", lastAssessed: "2026-05-08" },
  { id: "cm-008-03", supplierId: "sup-008", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Signed.", lastAssessed: "2026-05-08" },

  { id: "cm-009-01", supplierId: "sup-009", framework: "CSRD", applicability: "Applicable", readiness: "Evidence Gap", requiredEvidence: ["Scope 3 Logistics Emissions Disclosure"], reason: "Logistics Scope 3 disclosures required for CSRD value chain reporting.", lastAssessed: "2026-05-14" },
  { id: "cm-009-02", supplierId: "sup-009", framework: "CSDDD", applicability: "Possibly Applicable", readiness: "Review Required", requiredEvidence: ["Subcontractor ESG Due Diligence"], reason: "Subcontractor chain coverage incomplete. Potential indirect adverse impacts.", lastAssessed: "2026-05-14" },
  { id: "cm-009-03", supplierId: "sup-009", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Signed. Anti-bribery on file.", lastAssessed: "2026-05-14" },

  { id: "cm-010-01", supplierId: "sup-010", framework: "CSRD", applicability: "Applicable", readiness: "Review Required", requiredEvidence: ["Recycled Content Certification"], reason: "EU Packaging Regulation requires recycled content evidence for CSRD value chain.", lastAssessed: "2026-05-16" },
  { id: "cm-010-02", supplierId: "sup-010", framework: "CSDDD", applicability: "Possibly Applicable", readiness: "Ready", requiredEvidence: [], reason: "No adverse impact flags pending. Low criticality sector risk.", lastAssessed: "2026-05-16" },
  { id: "cm-010-03", supplierId: "sup-010", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Signed.", lastAssessed: "2026-05-16" },

  // ── sup-011–015: Low risk suppliers
  { id: "cm-011-01", supplierId: "sup-011", framework: "EUDR", applicability: "Applicable", readiness: "Review Required", requiredEvidence: ["EUDR Compliance Checklist"], reason: "Olive oil is a listed EUDR commodity. Minor documentation gap under final review.", lastAssessed: "2026-05-18" },
  { id: "cm-011-02", supplierId: "sup-011", framework: "CSRD", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "All required evidence on file.", lastAssessed: "2026-05-18" },
  { id: "cm-011-03", supplierId: "sup-011", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Signed.", lastAssessed: "2026-05-18" },

  { id: "cm-012-01", supplierId: "sup-012", framework: "CSRD", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "CSRD report submitted and reviewed.", lastAssessed: "2026-05-20" },
  { id: "cm-012-02", supplierId: "sup-012", framework: "CSDDD", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Full due diligence on file.", lastAssessed: "2026-05-20" },
  { id: "cm-012-03", supplierId: "sup-012", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Signed. All policies on file.", lastAssessed: "2026-05-20" },

  { id: "cm-013-01", supplierId: "sup-013", framework: "EUDR", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Timber is a listed EUDR commodity. FSC chain-of-custody and deforestation declaration complete.", lastAssessed: "2026-05-22" },
  { id: "cm-013-02", supplierId: "sup-013", framework: "CSRD", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "All evidence complete.", lastAssessed: "2026-05-22" },
  { id: "cm-013-03", supplierId: "sup-013", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Signed.", lastAssessed: "2026-05-22" },

  { id: "cm-014-01", supplierId: "sup-014", framework: "CSRD", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Full CSRD report with double materiality complete.", lastAssessed: "2026-05-23" },
  { id: "cm-014-02", supplierId: "sup-014", framework: "CSDDD", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "All due diligence evidence on file.", lastAssessed: "2026-05-23" },
  { id: "cm-014-03", supplierId: "sup-014", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Signed. Policies complete.", lastAssessed: "2026-05-23" },

  { id: "cm-015-01", supplierId: "sup-015", framework: "CSRD", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "CSRD report reviewed and approved.", lastAssessed: "2026-05-24" },
  { id: "cm-015-02", supplierId: "sup-015", framework: "CSDDD", applicability: "Possibly Applicable", readiness: "Ready", requiredEvidence: [], reason: "Logistics sector. No adverse impact flags. Monitoring continues.", lastAssessed: "2026-05-24" },
  { id: "cm-015-03", supplierId: "sup-015", framework: "Internal Supplier Code", applicability: "Applicable", readiness: "Ready", requiredEvidence: [], reason: "Signed. All policies on file.", lastAssessed: "2026-05-24" },
];

export function getComplianceMappingsForSupplier(supplierId: string): ComplianceMapping[] {
  return complianceMappings.filter((m) => m.supplierId === supplierId);
}
