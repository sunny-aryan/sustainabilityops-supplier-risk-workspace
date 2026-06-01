import type { RemediationPlan } from "@/types";

// Seed data for remediation plans. Runtime state is managed via useRemediationStore.
export const defaultRemediationPlans: RemediationPlan[] = [
  // ── sup-001: GreenWeave Textiles — Critical / Overdue
  {
    id: "rp-001",
    supplierId: "sup-001",
    title: "Labour Compliance & Evidence Remediation",
    status: "Overdue",
    severity: "Critical",
    owner: "Sophie Hartmann",
    supplierContact: "Arif Hossain (Compliance Manager)",
    dueDate: "2026-05-01",
    createdAt: "2026-02-15",
    updatedAt: "2026-04-10",
    issueSummary:
      "GreenWeave Textiles has three critical evidence gaps blocking procurement approval: missing Labour Standards Audit (overdue 42 days), missing Modern Slavery Policy Statement, and no Environmental Compliance Certificate on file. Risk score of 91 places this supplier in the Critical tier. Remediation plan overdue.",
    requestedActions: [
      "Submit updated third-party labour standards audit from an approved auditor",
      "Provide modern slavery policy statement signed by company director",
      "Submit environmental compliance certificate or ISO 14001 renewal",
      "Provide anti-bribery & corruption policy",
    ],
    milestones: [
      {
        id: "ms-001-01",
        title: "Labour Standards Audit submitted",
        status: "Not Started",
        dueDate: "2026-05-15",
        owner: "Supplier User",
        requiredEvidence: ["Labour Standards Audit"],
        blocksApproval: true,
      },
      {
        id: "ms-001-02",
        title: "Modern Slavery Policy Statement submitted",
        status: "Not Started",
        dueDate: "2026-05-15",
        owner: "Supplier User",
        requiredEvidence: ["Modern Slavery Policy Statement"],
        blocksApproval: true,
      },
      {
        id: "ms-001-03",
        title: "Environmental Certificate submitted",
        status: "Not Started",
        dueDate: "2026-05-20",
        owner: "Supplier User",
        requiredEvidence: ["Environmental Compliance Certificate"],
        blocksApproval: true,
      },
      {
        id: "ms-001-04",
        title: "ESG analyst reviews and approves submitted evidence",
        status: "Not Started",
        dueDate: "2026-05-31",
        owner: "ESG / Compliance Analyst",
        requiredEvidence: ["Labour Standards Audit", "Modern Slavery Policy Statement", "Environmental Compliance Certificate"],
        blocksApproval: false,
      },
      {
        id: "ms-001-05",
        title: "Procurement approval decision",
        status: "Blocked",
        dueDate: "2026-06-05",
        owner: "Procurement Manager",
        requiredEvidence: [],
        blocksApproval: false,
      },
    ],
    messages: [
      {
        id: "msg-001-01",
        date: "2026-04-10",
        author: "Sophie Hartmann",
        role: "ESG / Compliance Analyst",
        body: "This remediation plan is now overdue. Labour audit was due 2026-04-01 and has not been submitted. Escalation to senior procurement review has been triggered. Please provide an updated submission timeline immediately.",
      },
      {
        id: "msg-001-02",
        date: "2026-03-01",
        author: "Sophie Hartmann",
        role: "ESG / Compliance Analyst",
        body: "Labour Standards Audit formally requested. Please engage an approved third-party auditor from the approved list shared separately. Modern Slavery Policy Statement and Environmental Certificate are also required.",
      },
    ],
    blocksProcurementApproval: true,
  },

  // ── sup-002: Rainforest Oils — High / Escalated
  {
    id: "rp-002",
    supplierId: "sup-002",
    title: "EUDR Traceability & Deforestation Compliance",
    status: "Escalated",
    severity: "High",
    owner: "James Okafor",
    supplierContact: "Carolina Mendes (Sustainability Director)",
    dueDate: "2026-05-20",
    createdAt: "2026-03-15",
    updatedAt: "2026-04-22",
    issueSummary:
      "EU Deforestation Regulation (EUDR) requires deforestation-free sourcing declarations and plot-level traceability data before goods can be placed on the EU market. Rainforest Oils has not completed its mandatory EUDR due diligence and is missing geo-coordinates for sourcing plots.",
    requestedActions: [
      "Submit deforestation-free declaration (EUDR Art. 3 compliant)",
      "Provide GPS coordinates for all palm oil sourcing plots",
      "Engage third-party auditor for environmental due diligence",
    ],
    milestones: [
      {
        id: "ms-002-01",
        title: "Deforestation-free declaration submitted",
        status: "Submitted",
        dueDate: "2026-05-01",
        owner: "Supplier User",
        requiredEvidence: ["Deforestation-Free Declaration (EUDR)"],
        blocksApproval: true,
      },
      {
        id: "ms-002-02",
        title: "Geo-coordinates for sourcing plots provided",
        status: "Not Started",
        dueDate: "2026-05-10",
        owner: "Supplier User",
        requiredEvidence: ["Geo-coordinates of Sourcing Plots"],
        blocksApproval: true,
      },
      {
        id: "ms-002-03",
        title: "Third-party environmental audit completed",
        status: "Not Started",
        dueDate: "2026-06-01",
        owner: "Supplier User",
        requiredEvidence: ["Third-party Environmental Audit"],
        blocksApproval: true,
      },
      {
        id: "ms-002-04",
        title: "ESG analyst reviews EUDR package",
        status: "Not Started",
        dueDate: "2026-06-10",
        owner: "ESG / Compliance Analyst",
        requiredEvidence: [],
        blocksApproval: false,
      },
    ],
    messages: [
      {
        id: "msg-002-01",
        date: "2026-04-22",
        author: "James Okafor",
        role: "ESG / Compliance Analyst",
        body: "Escalation triggered — EUDR deadline approaching and geo-coordinates have not been provided. The draft deforestation declaration received on 2026-04-18 is under review but cannot substitute for plot-level traceability. Please prioritize submission of GPS data immediately.",
      },
      {
        id: "msg-002-02",
        date: "2026-03-15",
        author: "James Okafor",
        role: "ESG / Compliance Analyst",
        body: "EUDR compliance package initiated. Deforestation-free declaration template shared. Geo-coordinate format specification provided. Third-party auditor must be from the approved EUDR auditor list.",
      },
    ],
    blocksProcurementApproval: true,
  },

  // ── sup-003: SunVolt Battery Materials — High / In Progress
  {
    id: "rp-003",
    supplierId: "sup-003",
    title: "Cobalt Sourcing Risk & CBAM Carbon Compliance",
    status: "In Progress",
    severity: "High",
    owner: "Lena Müller",
    supplierContact: "Budi Santoso (Compliance Officer)",
    dueDate: "2026-06-30",
    createdAt: "2026-03-20",
    updatedAt: "2026-05-01",
    issueSummary:
      "SunVolt Battery Materials requires OECD-aligned cobalt chain-of-custody documentation and CBAM carbon disclosure. Environmental impact assessment for the main processing facility has been commissioned but not yet completed.",
    requestedActions: [
      "Complete OECD Annex II cobalt chain-of-custody documentation",
      "Submit CBAM carbon data disclosure for embedded carbon in battery materials",
      "Provide full environmental impact assessment for primary facility",
    ],
    milestones: [
      {
        id: "ms-003-01",
        title: "Cobalt chain-of-custody documentation under review",
        status: "Under Review",
        dueDate: "2026-05-28",
        owner: "ESG / Compliance Analyst",
        requiredEvidence: ["Cobalt Chain-of-Custody Documentation"],
        blocksApproval: true,
      },
      {
        id: "ms-003-02",
        title: "Environmental Impact Assessment submitted",
        status: "Requested",
        dueDate: "2026-06-15",
        owner: "Supplier User",
        requiredEvidence: ["Environmental Impact Assessment"],
        blocksApproval: true,
      },
      {
        id: "ms-003-03",
        title: "CBAM carbon data disclosure submitted",
        status: "Not Started",
        dueDate: "2026-06-20",
        owner: "Supplier User",
        requiredEvidence: ["CBAM Carbon Data Disclosure"],
        blocksApproval: false,
      },
      {
        id: "ms-003-04",
        title: "Full evidence package reviewed and approved",
        status: "Not Started",
        dueDate: "2026-06-30",
        owner: "ESG / Compliance Analyst",
        requiredEvidence: [],
        blocksApproval: false,
      },
    ],
    messages: [
      {
        id: "msg-003-01",
        date: "2026-05-01",
        author: "Lena Müller",
        role: "ESG / Compliance Analyst",
        body: "Cobalt chain-of-custody documentation received and under review. Environmental impact assessment commissioned from SGS. CBAM carbon disclosure template provided — please complete and return by June 20.",
      },
      {
        id: "msg-003-02",
        date: "2026-03-20",
        author: "Lena Müller",
        role: "ESG / Compliance Analyst",
        body: "Remediation plan issued following elevated risk score (83). OECD Annex II cobalt due diligence required as primary action. Carbon intensity above internal threshold — CBAM disclosure required for Q2 2026.",
      },
    ],
    blocksProcurementApproval: true,
  },

  // ── sup-004: BlueRiver Cocoa — High / Overdue
  {
    id: "rp-004",
    supplierId: "sup-004",
    title: "EUDR Traceability & Child Labour Due Diligence",
    status: "Overdue",
    severity: "High",
    owner: "James Okafor",
    supplierContact: "Kwame Asante (Operations Manager)",
    dueDate: "2026-05-01",
    createdAt: "2026-02-20",
    updatedAt: "2026-04-28",
    issueSummary:
      "BlueRiver Cocoa Exporters is overdue on EUDR traceability evidence (28 days past deadline) and has not initiated the required child labour due diligence assessment. Both items are required before procurement approval can proceed.",
    requestedActions: [
      "Submit EUDR traceability evidence package including farm-level maps",
      "Commission and submit ILO-aligned child labour due diligence assessment",
    ],
    milestones: [
      {
        id: "ms-004-01",
        title: "EUDR traceability package submitted",
        status: "Not Started",
        dueDate: "2026-05-15",
        owner: "Supplier User",
        requiredEvidence: ["EUDR Traceability Evidence Package"],
        blocksApproval: true,
      },
      {
        id: "ms-004-02",
        title: "Child labour due diligence report submitted",
        status: "Not Started",
        dueDate: "2026-06-01",
        owner: "Supplier User",
        requiredEvidence: ["Child Labour Due Diligence Report"],
        blocksApproval: true,
      },
      {
        id: "ms-004-03",
        title: "ESG analyst reviews and approves package",
        status: "Not Started",
        dueDate: "2026-06-15",
        owner: "ESG / Compliance Analyst",
        requiredEvidence: [],
        blocksApproval: false,
      },
    ],
    messages: [
      {
        id: "msg-004-01",
        date: "2026-04-28",
        author: "James Okafor",
        role: "ESG / Compliance Analyst",
        body: "EUDR traceability deadline passed 28 days ago. Procurement approval hold is now active. Final deadline for traceability package: 2026-05-15. Child labour assessment must also begin immediately — ILO framework documentation shared.",
      },
    ],
    blocksProcurementApproval: true,
  },

  // ── sup-005: CleanFiber Apparel — High / In Progress
  {
    id: "rp-005",
    supplierId: "sup-005",
    title: "Environmental Non-Compliance & Labour Hours Audit",
    status: "In Progress",
    severity: "High",
    owner: "Sophie Hartmann",
    supplierContact: "Priya Sharma (HSE Manager)",
    dueDate: "2026-06-15",
    createdAt: "2026-04-10",
    updatedAt: "2026-05-05",
    issueSummary:
      "Two adverse findings raised: wastewater discharge non-compliance flagged at primary facility, and overtime hours reported above national legal limit. Corrective action plan and independent labour audit required.",
    requestedActions: [
      "Submit corrective action plan for wastewater discharge non-compliance",
      "Commission independent working hours audit from approved auditor",
    ],
    milestones: [
      {
        id: "ms-005-01",
        title: "Corrective action plan submitted",
        status: "Requested",
        dueDate: "2026-06-03",
        owner: "Supplier User",
        requiredEvidence: ["Wastewater Discharge Compliance Report"],
        blocksApproval: true,
      },
      {
        id: "ms-005-02",
        title: "Working hours audit submitted",
        status: "Requested",
        dueDate: "2026-06-10",
        owner: "Supplier User",
        requiredEvidence: ["Working Hours & Overtime Audit"],
        blocksApproval: false,
      },
      {
        id: "ms-005-03",
        title: "ESG analyst review of corrective action plan",
        status: "Not Started",
        dueDate: "2026-06-20",
        owner: "ESG / Compliance Analyst",
        requiredEvidence: [],
        blocksApproval: false,
      },
    ],
    messages: [
      {
        id: "msg-005-01",
        date: "2026-05-05",
        author: "Sophie Hartmann",
        role: "ESG / Compliance Analyst",
        body: "Remediation plan issued following audit findings. Wastewater non-compliance is an approval-blocking issue under CSDDD Art. 6. Corrective action plan must be submitted by June 3. Labour hours audit required separately.",
      },
    ],
    blocksProcurementApproval: true,
  },
];

export function getRemediationPlanForSupplier(
  plans: RemediationPlan[],
  supplierId: string
): RemediationPlan | undefined {
  return plans.find((p) => p.supplierId === supplierId);
}

export function getAllRemediationPlans(plans: RemediationPlan[]): RemediationPlan[] {
  return plans;
}
