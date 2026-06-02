# Trade-offs

This document captures key product, UX, and system trade-offs made while building **SustainOps — Supplier Sustainability Risk & Compliance Workspace**.

The goal of SustainOps is not to build a production ESG platform. The goal is to demonstrate how complex supplier sustainability risk workflows can be translated into a polished, trustworthy, SaaS-grade product experience.

---

## 1. Polished SaaS prototype vs production backend

### Decision

Build a polished frontend-first SaaS prototype using local mock data and client-side state.

### Why

The main goal of Project 5 is to demonstrate:

* product packaging
* information architecture
* dashboard-to-detail workflow design
* role-aware experience
* trust and explainability
* empty/loading/error/degraded states
* modern AI-assisted prototyping capability

A production backend would add complexity, but it would not be the highest-signal improvement for this project.

### Trade-off

The app does not include durable workflow persistence, real multi-user collaboration, backend authorization, or production audit storage.

### Production implication

A production version would need:

* persistent database
* workflow engine
* user/account model
* supplier authentication
* authorization model
* audit log storage
* background jobs
* integration with procurement and ESG systems

---

## 2. Synthetic supplier data vs real integrations

### Decision

Use realistic synthetic supplier data instead of connecting to real supplier, procurement, ESG, or ERP systems.

### Why

The product needs data that demonstrates realistic workflows without exposing sensitive supplier or customer information.

Synthetic data allows the prototype to show:

* varied supplier categories
* country and regional risk differences
* evidence gaps
* regulatory exposure
* remediation states
* role-specific workflows
* degraded-state behavior

### Trade-off

The product does not prove real integration capability with supplier management systems, ERP platforms, ESG data providers, or document repositories.

### Production implication

A production version would need integrations with systems such as:

* ERP/procurement platforms
* supplier master data systems
* document storage systems
* ESG data providers
* audit and certification databases
* notification channels

---

## 3. Deterministic scoring vs AI-generated risk scoring

### Decision

Use deterministic logic for risk levels, evidence status, compliance readiness, blocked actions, and workflow transitions.

### Why

Supplier risk and compliance workflows require explainability, auditability, and predictable behavior.

AI-generated risk scores would be difficult to justify in regulated or compliance-sensitive workflows, especially when users need to understand why a supplier is blocked, escalated, or marked review-required.

### Trade-off

The scoring model is simplified and handcrafted. It is not statistically calibrated, validated against real outcomes, or configurable by policy administrators.

### Production implication

A production version would need:

* configurable scoring models
* policy versioning
* customer-specific thresholds
* jurisdiction-specific rules
* model validation
* audit-ready scoring explanations
* change history for policy updates

---

## 4. AI assistance vs AI authority

### Decision

Limit AI-style content to advisory use cases such as supplier briefs, plain-language explanations, and suggested remediation wording.

### Why

AI can help users understand complex supplier context, but it should not make authoritative compliance or procurement decisions.

The product principle is:

> AI can summarize and draft. Deterministic rules govern. Humans decide. Audit records.

### Trade-off

The prototype does not demonstrate deep agentic behavior or autonomous AI decision-making.

### Production implication

A production version could add AI capabilities such as:

* document summarization
* evidence gap detection
* supplier response classification
* draft outreach generation
* remediation plan suggestions
* executive summaries

But AI outputs would still need:

* confidence indicators
* human review
* prompt/version tracking
* evaluation datasets
* guardrails
* audit records

---

## 5. Broad ESG platform vs focused supplier-risk workflow

### Decision

Focus on supplier sustainability risk, evidence gaps, compliance readiness, remediation workflow, and auditability.

### Why

A broad ESG platform would be too diffuse for a 2–3 week portfolio project. The stronger product choice was to make one workflow legible and credible.

The focused workflow answers:

```text
Which suppliers need attention?
Why are they risky?
What evidence is missing?
What compliance impact exists?
Who owns the next action?
What is blocked until evidence is reviewed?
```

### Trade-off

The prototype does not cover every ESG use case, such as:

* carbon accounting
* sustainability reporting
* full audit management
* supplier benchmarking
* emissions forecasting
* investor reporting
* policy administration
* regulatory filing workflows

### Production implication

A production roadmap could expand into these areas only after the core supplier-risk workflow is useful and trusted.

---

## 6. Demo role selector vs production authentication/RBAC

### Decision

Use a role selector to demonstrate different user contexts instead of implementing real authentication and role-based access control.

### Why

Authentication is important in production, but it is not the main portfolio signal for this project.

The role selector helps demonstrate how the product changes context for:

* Procurement Manager
* ESG / Compliance Analyst
* Supplier User

without requiring account setup.

### Trade-off

The app does not enforce real permissions. Supplier users can still access internal pages in the demo, but contextual banners explain how production access would differ.

### Production implication

A production version would need:

* tenant model
* supplier organization accounts
* internal user roles
* permission policies
* invite flows
* audit records for access
* restricted supplier-facing views

---

## 7. Client-side workflow state vs durable workflow engine

### Decision

Use client-side state and local mock data for remediation workflow actions and supplier portal interactions.

### Why

The goal is to demonstrate workflow logic and user experience without building backend infrastructure.

This keeps the prototype focused on product behavior:

* request evidence
* supplier submits response
* status moves to review
* blocked actions remain visible
* activity timeline records events

### Trade-off

Workflow changes are not durably persisted across users or environments. The app does not handle concurrency, retries, access control, or server-side audit guarantees.

### Production implication

A production version would need:

* durable workflow state
* state transition validation
* background jobs
* notification triggers
* audit event persistence
* user attribution
* concurrency handling
* escalation logic
* workflow ownership

---

## 8. Simplified compliance readiness vs legal-grade compliance engine

### Decision

Use a simplified readiness model for frameworks such as CSDDD, CSRD, EUDR, CBAM, and Internal Supplier Code.

### Why

The project is meant to show product structure, not provide legal compliance advice.

A simplified model helps users understand:

* what framework may apply
* what evidence is missing
* why readiness is blocked
* what needs review

### Trade-off

The prototype should not be interpreted as a real regulatory assessment tool.

### Production implication

A production version would require:

* legal review
* jurisdiction-specific rules
* policy versioning
* customer-specific configuration
* supplier-category applicability logic
* audit-ready compliance evidence
* updates for regulatory changes

---

## 9. Complete supplier portal vs lightweight supplier-facing workflow

### Decision

Build a lightweight supplier portal that shows requested evidence, remediation milestones, due dates, and supplier response actions.

### Why

The supplier-facing experience is important because supplier risk management is not only an internal dashboard problem. It requires collaboration with external suppliers.

However, building a full supplier portal would have expanded scope significantly.

### Trade-off

The supplier portal does not include real authentication, file upload, messaging, notification history, document review, or supplier-side team collaboration.

### Production implication

A production supplier portal would need:

* supplier login
* invite and onboarding flows
* secure document upload
* messaging
* notifications
* evidence status history
* multilingual support
* supplier-side task ownership
* legal terms and privacy controls

---

## 10. Degraded-state simulation vs real failure handling

### Decision

Use demo controls to simulate AI unavailable, evidence source unavailable, loading, stale data, and empty states.

### Why

A strong SaaS product must handle imperfect conditions. The demo controls make these states easy to evaluate without needing real service outages or backend failures.

### Trade-off

The failure modes are simulated. There is no real observability, service health monitoring, retry queue, or incident response.

### Production implication

A production version would need:

* service health checks
* observability
* retry mechanisms
* cached data strategy
* stale-data policy
* incident messaging
* provider error handling
* alerting and recovery workflows

---

## 11. Trust Center in product vs separate documentation only

### Decision

Include methodology and trust explanations inside the product experience, not only in the README.

### Why

Supplier risk users need to understand why the product shows a risk score, blocks an action, or marks a supplier as review-required.

Trust should be part of the workflow, not hidden in external documentation.

### Trade-off

Adding methodology content inside the app increases information density and requires careful layout to avoid overwhelming users.

### Production implication

A production product would need to balance:

* concise in-product explanations
* detailed methodology documentation
* customer-specific policy configuration
* legal disclaimers
* audit-ready methodology history

---

## 12. Bolt-assisted frontend generation vs manually coded UI

### Decision

Use Bolt to accelerate frontend implementation after defining the product concept, scope, workflows, and build plan with ChatGPT.

### Why

One purpose of Project 5 is to demonstrate modern AI-assisted prototyping capability.

Bolt helped accelerate:

* React/TypeScript scaffolding
* component generation
* polished SaaS layout
* clickable workflows
* visual refinement

### Trade-off

Generated code still required product review, local testing, staged commits, theme fixes, scope control, and refinement prompts.

### Production implication

AI prototyping tools are useful accelerators, but they do not replace product judgment. The PM still needs to own:

* problem selection
* user workflows
* prioritization
* edge cases
* state handling
* trade-offs
* documentation
* quality bar

---

## Summary

The central trade-off in SustainOps was choosing **product experience depth** over production infrastructure.

The project intentionally prioritizes:

* polished SaaS UX
* clear information architecture
* role-aware workflows
* supplier risk review
* remediation action
* trust and explainability
* deterministic controls
* degraded-state handling

over:

* real integrations
* production backend
* full RBAC
* legal-grade compliance logic
* real AI execution
* durable workflow infrastructure

This was the right scope for Project 5 in my [GitHub product portfolio](https://github.com/sunny-aryan) because its portfolio goal is to show:

> the ability to translate complex product/system thinking into a modern, credible, trustworthy SaaS product experience.
