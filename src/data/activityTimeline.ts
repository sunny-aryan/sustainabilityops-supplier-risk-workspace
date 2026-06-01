import type { TimelineEvent } from "@/types";

export const timelineEvents: TimelineEvent[] = [
  // ── sup-001: GreenWeave Textiles
  { id: "tl-001-01", supplierId: "sup-001", date: "2026-04-10", actor: "System", eventType: "policy_triggered", description: "Procurement approval blocked — Labour Audit missing and evidence completeness below 60% threshold for High-criticality supplier.", source: "System", systemGenerated: true },
  { id: "tl-001-02", supplierId: "sup-001", date: "2026-04-05", actor: "Sophie Hartmann", eventType: "evidence_requested", description: "Anti-bribery & Corruption Policy requested from supplier via email and portal notification.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-001-03", supplierId: "sup-001", date: "2026-03-22", actor: "System", eventType: "remediation_overdue", description: "Remediation plan marked overdue — 30-day threshold exceeded. Supplier escalated to Action Queue.", source: "System", systemGenerated: true },
  { id: "tl-001-04", supplierId: "sup-001", date: "2026-03-01", actor: "Sophie Hartmann", eventType: "evidence_requested", description: "Labour Standards Audit requested. Third-party auditor list provided to supplier.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-001-05", supplierId: "sup-001", date: "2026-02-15", actor: "System", eventType: "risk_recalculated", description: "Risk score updated to 91 (Critical) following updated scoring cycle. Labour dimension weighted at maximum.", source: "System", systemGenerated: true },
  { id: "tl-001-06", supplierId: "sup-001", date: "2026-02-01", actor: "AI Draft", eventType: "ai_draft_generated", description: "AI-generated supplier brief drafted for ESG analyst review. Marked as draft — not yet reviewed.", source: "AI Draft", systemGenerated: true },
  { id: "tl-001-07", supplierId: "sup-001", date: "2025-11-10", actor: "Sophie Hartmann", eventType: "evidence_submitted", description: "Supplier Code of Conduct acknowledgement received and filed.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-001-08", supplierId: "sup-001", date: "2025-10-01", actor: "Sophie Hartmann", eventType: "supplier_onboarded", description: "Supplier onboarded to SustainOps. Initial risk profile created. Risk score: 74 (High).", source: "Procurement Manager", systemGenerated: false },

  // ── sup-002: Rainforest Oils Collective
  { id: "tl-002-01", supplierId: "sup-002", date: "2026-04-22", actor: "System", eventType: "policy_triggered", description: "Supplier escalated — EUDR deadline approaching and deforestation declaration not yet complete.", source: "System", systemGenerated: true },
  { id: "tl-002-02", supplierId: "sup-002", date: "2026-04-20", actor: "James Okafor", eventType: "evidence_requested", description: "EUDR deforestation-free declaration and plot geo-coordinates requested. Deadline set 2026-05-20.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-002-03", supplierId: "sup-002", date: "2026-04-18", actor: "Rainforest Oils Collective", eventType: "evidence_submitted", description: "Labour Standards Self-Assessment (SAQ) submitted via supplier portal. Under ESG review.", source: "Supplier User", systemGenerated: false },
  { id: "tl-002-04", supplierId: "sup-002", date: "2026-04-10", actor: "James Okafor", eventType: "finding_flagged", description: "EUDR traceability gap flagged following supplier site visit. Escalation note added.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-002-05", supplierId: "sup-002", date: "2026-03-15", actor: "AI Draft", eventType: "ai_draft_generated", description: "AI draft remediation summary generated. Includes EUDR action steps. Pending analyst approval.", source: "AI Draft", systemGenerated: true },
  { id: "tl-002-06", supplierId: "sup-002", date: "2025-10-01", actor: "James Okafor", eventType: "evidence_submitted", description: "Supplier Code of Conduct acknowledgement received and filed.", source: "ESG Analyst", systemGenerated: false },

  // ── sup-003: SunVolt Battery Materials
  { id: "tl-003-01", supplierId: "sup-003", date: "2026-05-01", actor: "System", eventType: "risk_recalculated", description: "Risk score updated to 83 (High). Cobalt sourcing risk and CBAM data gap raised score from 79.", source: "System", systemGenerated: true },
  { id: "tl-003-02", supplierId: "sup-003", date: "2026-04-28", actor: "SunVolt Battery Materials", eventType: "evidence_submitted", description: "Cobalt Chain-of-Custody documentation submitted. Under ESG review (OECD DD Annex II).", source: "Supplier User", systemGenerated: false },
  { id: "tl-003-03", supplierId: "sup-003", date: "2026-04-15", actor: "Lena Müller", eventType: "evidence_requested", description: "Environmental Impact Assessment commissioned. Third-party auditor engaged. Expected June 2026.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-003-04", supplierId: "sup-003", date: "2026-04-05", actor: "Lena Müller", eventType: "finding_flagged", description: "Carbon intensity above internal threshold flagged. CBAM disclosure requirement noted.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-003-05", supplierId: "sup-003", date: "2026-03-20", actor: "AI Draft", eventType: "ai_draft_generated", description: "AI-generated brief covering cobalt risk and CBAM exposure. Marked as draft.", source: "AI Draft", systemGenerated: true },
  { id: "tl-003-06", supplierId: "sup-003", date: "2025-12-01", actor: "Lena Müller", eventType: "supplier_onboarded", description: "Supplier onboarded. Initial risk profile created. Risk score: 71 (Medium).", source: "Procurement Manager", systemGenerated: false },

  // ── sup-004: BlueRiver Cocoa Exporters
  { id: "tl-004-01", supplierId: "sup-004", date: "2026-04-28", actor: "System", eventType: "policy_triggered", description: "Procurement approval blocked — EUDR traceability evidence overdue 28 days.", source: "System", systemGenerated: true },
  { id: "tl-004-02", supplierId: "sup-004", date: "2026-04-20", actor: "James Okafor", eventType: "evidence_requested", description: "Traceability evidence package re-requested. Final deadline set 2026-05-15.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-004-03", supplierId: "sup-004", date: "2026-04-20", actor: "BlueRiver Cocoa Exporters", eventType: "evidence_submitted", description: "Rainforest Alliance certification renewal submitted for review.", source: "Supplier User", systemGenerated: false },
  { id: "tl-004-04", supplierId: "sup-004", date: "2026-04-01", actor: "System", eventType: "remediation_overdue", description: "EUDR traceability deadline passed. Overdue flag applied automatically.", source: "System", systemGenerated: true },
  { id: "tl-004-05", supplierId: "sup-004", date: "2026-02-01", actor: "James Okafor", eventType: "evidence_requested", description: "Child Labour Due Diligence Report initiated. ILO assessment framework shared.", source: "ESG Analyst", systemGenerated: false },

  // ── sup-005: CleanFiber Apparel
  { id: "tl-005-01", supplierId: "sup-005", date: "2026-05-05", actor: "System", eventType: "risk_recalculated", description: "Risk score updated to 76 following wastewater non-compliance report. Raised from 68.", source: "System", systemGenerated: true },
  { id: "tl-005-02", supplierId: "sup-005", date: "2026-05-03", actor: "Sophie Hartmann", eventType: "evidence_requested", description: "Corrective action plan for wastewater discharge requested. Deadline 2026-06-03.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-005-03", supplierId: "sup-005", date: "2026-04-25", actor: "CleanFiber Apparel", eventType: "evidence_submitted", description: "Carbon emissions baseline (Scope 1 & 2) submitted for analyst review.", source: "Supplier User", systemGenerated: false },
  { id: "tl-005-04", supplierId: "sup-005", date: "2026-04-10", actor: "Sophie Hartmann", eventType: "finding_flagged", description: "Overtime hours above national legal limit reported in facility audit.", source: "ESG Analyst", systemGenerated: false },

  // ── sup-006: Andes Metals Processing
  { id: "tl-006-01", supplierId: "sup-006", date: "2026-05-10", actor: "Lena Müller", eventType: "evidence_requested", description: "Water stewardship plan and CBAM carbon data report requested. Deadlines June 2026.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-006-02", supplierId: "sup-006", date: "2026-05-08", actor: "Andes Metals Processing", eventType: "evidence_submitted", description: "OECD Due Diligence partial submission received. Annex II conflict minerals section pending.", source: "Supplier User", systemGenerated: false },
  { id: "tl-006-03", supplierId: "sup-006", date: "2026-04-15", actor: "System", eventType: "risk_recalculated", description: "Risk score held at 71 (Medium). Water stress flag noted but below escalation threshold.", source: "System", systemGenerated: true },

  // ── sup-007: EuroChem Inputs
  { id: "tl-007-01", supplierId: "sup-007", date: "2026-05-12", actor: "Sophie Hartmann", eventType: "evidence_requested", description: "REACH substance list update and CBAM transitional report requested.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-007-02", supplierId: "sup-007", date: "2026-04-01", actor: "EuroChem Inputs", eventType: "evidence_submitted", description: "Q4 2025 carbon emissions data submitted.", source: "Supplier User", systemGenerated: false },

  // ── sup-008: TerraPack Manufacturing
  { id: "tl-008-01", supplierId: "sup-008", date: "2026-05-08", actor: "TerraPack Manufacturing", eventType: "evidence_submitted", description: "H&S audit report submitted. Under internal review.", source: "Supplier User", systemGenerated: false },
  { id: "tl-008-02", supplierId: "sup-008", date: "2026-05-05", actor: "James Okafor", eventType: "evidence_requested", description: "Packaging recyclability declaration update requested.", source: "ESG Analyst", systemGenerated: false },

  // ── sup-009: EastPort Logistics
  { id: "tl-009-01", supplierId: "sup-009", date: "2026-05-14", actor: "Lena Müller", eventType: "evidence_requested", description: "Scope 3 logistics emissions template provided. Deadline 2026-06-12.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-009-02", supplierId: "sup-009", date: "2026-05-10", actor: "EastPort Logistics", eventType: "evidence_submitted", description: "Subcontractor ESG assessment submitted for 2 of 5 subcontractors.", source: "Supplier User", systemGenerated: false },

  // ── sup-010: NorthSea Plastics
  { id: "tl-010-01", supplierId: "sup-010", date: "2026-05-16", actor: "Sophie Hartmann", eventType: "evidence_requested", description: "Recycled content certification update requested for 2026 target.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-010-02", supplierId: "sup-010", date: "2026-01-15", actor: "NorthSea Plastics", eventType: "evidence_submitted", description: "Carbon emissions baseline submitted and verified.", source: "Supplier User", systemGenerated: false },

  // ── sup-011: PureHarvest Foods
  { id: "tl-011-01", supplierId: "sup-011", date: "2026-05-18", actor: "James Okafor", eventType: "finding_flagged", description: "Minor EUDR documentation gap identified for olive sourcing region. Checklist sign-off pending.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-011-02", supplierId: "sup-011", date: "2026-03-10", actor: "PureHarvest Foods", eventType: "evidence_submitted", description: "Annual review evidence package submitted. All documents within validity.", source: "Supplier User", systemGenerated: false },

  // ── sup-012: Atlas Components GmbH
  { id: "tl-012-01", supplierId: "sup-012", date: "2026-05-20", actor: "System", eventType: "review_completed", description: "Annual review approved. All evidence complete. Risk score: 35 (Low).", source: "System", systemGenerated: true },
  { id: "tl-012-02", supplierId: "sup-012", date: "2026-04-01", actor: "Atlas Components GmbH", eventType: "evidence_submitted", description: "CSRD FY2025 sustainability report submitted and reviewed.", source: "Supplier User", systemGenerated: false },
  { id: "tl-012-03", supplierId: "sup-012", date: "2025-12-01", actor: "Lena Müller", eventType: "supplier_onboarded", description: "Supplier profile migrated to SustainOps from legacy system.", source: "Procurement Manager", systemGenerated: false },

  // ── sup-013: Nordic Timber Cooperative
  { id: "tl-013-01", supplierId: "sup-013", date: "2026-05-22", actor: "System", eventType: "review_completed", description: "Annual review completed. EUDR deforestation-free declaration verified. Risk score: 29 (Low).", source: "System", systemGenerated: true },
  { id: "tl-013-02", supplierId: "sup-013", date: "2026-05-20", actor: "Nordic Timber Cooperative", eventType: "evidence_submitted", description: "EUDR deforestation-free declaration submitted with satellite verification data.", source: "Supplier User", systemGenerated: false },

  // ── sup-014: Alpine Precision Parts
  { id: "tl-014-01", supplierId: "sup-014", date: "2026-05-23", actor: "Lena Müller", eventType: "review_completed", description: "Full annual review completed. CSRD double materiality assessment reviewed and approved.", source: "ESG Analyst", systemGenerated: false },
  { id: "tl-014-02", supplierId: "sup-014", date: "2026-03-15", actor: "Alpine Precision Parts", eventType: "evidence_submitted", description: "CSRD sustainability report with full double materiality assessment submitted.", source: "Supplier User", systemGenerated: false },

  // ── sup-015: OceanLink Freight
  { id: "tl-015-01", supplierId: "sup-015", date: "2026-05-24", actor: "System", eventType: "review_completed", description: "Annual review approved. Evidence completeness: 100%. Risk score: 18 (Low).", source: "System", systemGenerated: true },
  { id: "tl-015-02", supplierId: "sup-015", date: "2026-04-01", actor: "OceanLink Freight", eventType: "evidence_submitted", description: "CSRD report and Scope 3 logistics emissions data submitted and verified.", source: "Supplier User", systemGenerated: false },
  { id: "tl-015-03", supplierId: "sup-015", date: "2026-01-15", actor: "James Okafor", eventType: "supplier_onboarded", description: "Supplier onboarded. Initial risk profile: 18 (Low).", source: "Procurement Manager", systemGenerated: false },
];

export function getTimelineForSupplier(supplierId: string): TimelineEvent[] {
  return timelineEvents
    .filter((e) => e.supplierId === supplierId)
    .sort((a, b) => b.date.localeCompare(a.date));
}
