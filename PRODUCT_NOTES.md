# Product Notes

These notes capture the product thinking behind **SustainOps — Supplier Sustainability Risk & Compliance Workspace**.

The project is part of my [GitHub product portfolio](https://github.com/sunny-aryan) focused on demonstrating Senior / Principal Technical Product Management thinking through working systems.

---

## Product intent

SustainOps is designed to show how supplier sustainability risk can be translated into a clear operational workflow.

The product is not intended to be a full ESG platform. It focuses on the operational layer:

```text
Which suppliers need attention?
Why are they risky?
What evidence is missing?
What compliance impact exists?
Who owns the next action?
What is blocked until evidence is reviewed?
What has already happened?
```

The goal is to move beyond a static ESG dashboard and show a product that helps users understand risk, take action, and preserve trust.

---

## Product thesis

SustainOps helps procurement, ESG, and compliance teams move from supplier sustainability risk visibility to auditable remediation action.

The core thesis is:

> Supplier sustainability risk is only useful if teams can understand it, prioritize it, act on it, and trust how decisions are governed.

The product therefore combines:

* portfolio-level visibility
* supplier-level investigation
* evidence review
* compliance readiness context
* remediation workflow
* supplier response
* deterministic controls
* activity history
* degraded-state handling
* trust and methodology explanation

---

## User problem

Procurement, ESG, and compliance teams often work across fragmented supplier data, incomplete evidence, changing regulations, and unclear ownership.

A dashboard alone is not enough.

Teams need to answer:

* Which suppliers require attention first?
* Why is a supplier risky?
* Which evidence is missing, expired, or under review?
* Which compliance frameworks may be affected?
* What action should happen next?
* Who owns the next step?
* What cannot proceed until evidence is reviewed?
* What has changed since the last review?

SustainOps is designed around these questions.

---

## Target personas

### Procurement Manager

The Procurement Manager needs to understand supplier risk in the context of sourcing decisions.

Primary questions:

* Can sourcing proceed?
* Which suppliers require follow-up?
* Which suppliers are high or critical risk?
* Which risks block procurement approval?
* Who owns the next action?

Product needs:

* portfolio dashboard
* supplier prioritization
* sourcing-risk context
* blocked approval visibility
* remediation status
* clear handoff to ESG / Compliance

---

### ESG / Compliance Analyst

The ESG / Compliance Analyst needs to review evidence, apply policy, maintain auditability, and ensure that supplier actions are not approved prematurely.

Primary questions:

* What evidence is missing or expired?
* Which deterministic rules triggered review?
* Which compliance frameworks are affected?
* Has the supplier response been reviewed?
* Can a remediation milestone be closed?
* What should be escalated?

Product needs:

* evidence review
* compliance mapping
* methodology visibility
* blocked-action rules
* audit timeline
* supplier response status
* degraded-state handling

---

### Supplier User

The Supplier User needs a simple external-facing workspace that explains what is required from them.

Primary questions:

* What evidence has been requested?
* What is due?
* What remediation milestone is open?
* What happens after submission?
* Who is waiting for my response?

Product needs:

* supplier-facing task list
* requested evidence cards
* due dates
* milestone status
* submission action
* clear message that submission moves evidence to review, not automatic approval

---

## Workflow design

The core workflow is intentionally structured as:

```text
Dashboard
→ Supplier list
→ Supplier detail
→ Evidence review
→ Compliance mapping
→ Remediation workflow
→ Supplier portal response
→ Activity timeline
→ Trust Center
```

This avoids the common dashboard trap where users can see risk but cannot act on it.

The workflow is designed to answer progressively deeper questions:

| Step                 | User question                          |
| -------------------- | -------------------------------------- |
| Dashboard            | Where is risk concentrated?            |
| Supplier list        | Which suppliers should I inspect?      |
| Supplier detail      | Why is this supplier risky?            |
| Evidence review      | What evidence is missing or blocking?  |
| Compliance mapping   | What readiness issue exists?           |
| Remediation workflow | What action needs to happen next?      |
| Supplier portal      | What does the supplier need to submit? |
| Activity timeline    | What happened and who did it?          |
| Trust Center         | Why should I trust the system?         |

---

## Information architecture

The app uses five primary areas:

| Area                | Purpose                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| Dashboard           | Portfolio-level supplier risk visibility                               |
| Suppliers           | Search, filtering, prioritization, and supplier navigation             |
| Action Queue        | Operational work requiring attention                                   |
| Supplier Portal     | Supplier-facing evidence and remediation tasks                         |
| Methodology & Trust | Explainability, rules, AI boundaries, degraded states, and limitations |

This structure was chosen to make the product understandable quickly while still supporting deeper workflows.

---

## Dashboard design

The dashboard is designed to answer the question:

> What needs attention right now?

It includes:

* total suppliers monitored
* high/critical risk suppliers
* evidence completion
* overdue remediation
* suppliers requiring review
* risk distribution
* evidence completeness summary
* suppliers needing action
* recent activity

The dashboard is not intended to show every possible ESG metric. It focuses on operational prioritization.

---

## Supplier list design

The supplier list helps users move from portfolio-level insight to supplier-level investigation.

It supports:

* search by supplier, country, region, or category
* risk-level filtering
* category filtering
* remediation-status filtering
* evidence-completeness filtering
* reset filters
* empty-state handling

This creates a clear dashboard-to-detail flow rather than leaving users in a static overview.

---

## Supplier detail design

The supplier detail workspace is the main investigation surface.

It includes:

* Overview
* Evidence
* Compliance Mapping
* Remediation Workflow
* Activity Timeline

This structure separates different kinds of decision context:

| Tab                  | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| Overview             | Summarize supplier risk and next actions                |
| Evidence             | Show missing, expired, submitted, and blocking evidence |
| Compliance Mapping   | Explain simplified readiness impact                     |
| Remediation Workflow | Track action plans and blocked states                   |
| Activity Timeline    | Preserve auditability and history                       |

The page uses progressive disclosure so the user is not overwhelmed by all information at once.

---

## Remediation workflow design

The remediation workflow exists because identifying risk is not enough.

The workflow supports:

* evidence requests
* remediation requests
* supplier response
* internal review
* escalation
* blocked procurement approval
* activity updates

The product intentionally does not allow supplier submission to automatically mark evidence complete.

Instead:

```text
Supplier submission
→ Under Review
→ ESG / Compliance Analyst review required
→ possible completion
```

This protects the workflow from unsafe shortcuts.

---

## Supplier Portal design

The Supplier Portal demonstrates the external-facing side of the workflow.

It is intentionally simpler than the internal workspace.

Supplier users see:

* requested evidence
* remediation milestones
* due dates
* messages from procurement/compliance
* submission actions
* status after submission

The supplier experience is scoped to action clarity, not internal compliance complexity.

---

## AI boundaries

AI-style content exists only as advisory support.

AI can:

* summarize supplier risk context
* draft supplier-facing language
* explain risk drivers
* suggest remediation wording
* help users understand missing evidence

AI cannot:

* approve suppliers
* mark evidence complete
* override risk scores
* override blocked actions
* close remediation
* change compliance readiness
* make legal compliance determinations

The key product principle is:

> AI can summarize and draft. Deterministic rules govern. Humans decide. Audit records.

---

## Deterministic controls

Deterministic rules govern safety, compliance, and workflow state.

Examples:

```text
Risk score >= 90 → Critical risk
Risk score >= 75 → High risk
Evidence completeness < 60% + high criticality → Review required
Missing or expired mandatory evidence → Procurement approval blocked
Supplier submission → Under Review, not Complete
Overdue remediation → Action Queue escalation
Escalated items → ESG / Compliance Analyst review required
```

These rules are simplified for the prototype, but the system design principle is important:

> Compliance-sensitive state should be explainable, testable, and auditable.

---

## Trust and explainability

The Methodology & Trust Center exists because users should not have to blindly trust a score or AI-generated summary.

It explains:

* how risk scoring works
* how evidence completeness works
* how compliance readiness is simplified
* what deterministic rules govern
* what AI can and cannot do
* what is recorded in the activity timeline
* what degraded states mean
* what is outside demo scope

This makes trust part of the product experience, not just part of the documentation.

---

## Empty, loading, error, and degraded-state handling

The product includes demo modes for:

* AI unavailable
* evidence source unavailable
* loading supplier analysis
* stale evidence data
* empty supplier search results
* empty action queue
* role-context mismatch
* blocked workflow actions

These states were included because real SaaS products rarely operate in perfect conditions.

The key product choice is:

> The system should remain useful even when AI is unavailable or evidence refresh fails.

When AI is unavailable, deterministic risk, evidence, compliance, and workflow controls remain visible.

---

## Role-context handling

The prototype uses a role selector instead of real authentication.

The role selector demonstrates different product contexts:

| Role                     | Product emphasis                                                    |
| ------------------------ | ------------------------------------------------------------------- |
| Procurement Manager      | sourcing risk, supplier prioritization, blocked procurement actions |
| ESG / Compliance Analyst | evidence review, compliance readiness, auditability                 |
| Supplier User            | requested evidence, remediation milestones, supplier response       |

Production RBAC is intentionally out of scope, but the role-context banners explain how access would differ in a real product.

---

## Sample data strategy

The project uses synthetic supplier data designed to feel realistic.

The sample data includes:

* varied supplier categories
* different regions and countries
* annual spend
* criticality
* risk scores
* evidence completeness
* remediation status
* regulatory exposure
* risk drivers
* required actions
* owners and review dates

The goal is not data volume. The goal is product realism.

---

## Why this is not just an ESG dashboard

A weak version of this idea would only show:

```text
supplier name
ESG score
risk badge
chart
```

SustainOps instead includes:

* workflow ownership
* evidence gaps
* compliance readiness
* remediation actions
* supplier response
* blocked-action logic
* activity timeline
* role-specific context
* degraded states
* trust methodology

This makes the product a workflow SaaS prototype rather than a static reporting dashboard.

---

## What improved vs Projects 1–4

### Project 1: Safe Treasury Copilot

Project 1 demonstrated AI-assisted decision support with deterministic safety controls.

Improvement in Project 5:

* stronger SaaS packaging
* better onboarding
* role-aware experience
* more polished UI

---

### Project 2: Marketplace Dispute Resolution Copilot

Project 2 demonstrated operational workflow lifecycle, reviewer validation, state transitions, and auditability.

Improvement in Project 5:

* more modern product experience
* stronger information architecture
* clearer dashboard-to-detail journey
* better external-facing role view

---

### Project 3: Travel Disruption Operations Copilot

Project 3 improved workflow UX with prioritized queues, role views, and external dependency status.

Improvement in Project 5:

* more polished SaaS visual system
* stronger onboarding
* better product packaging
* clearer trust and methodology layer

---

### Project 4: Billing Recovery Execution Console

Project 4 crossed the execution boundary with provider writes, idempotency, retries, reconciliation, and recovery.

Improvement in Project 5:

* intentionally shifts from backend execution reliability to polished SaaS-grade product experience
* demonstrates modern prototyping with Bolt
* emphasizes adoption, legibility, and trust

---

## What is still intentionally limited

SustainOps does not include:

* production backend
* real supplier authentication
* production RBAC
* real document upload
* real OCR or document extraction
* real AI API calls
* real legal or regulatory validation
* ERP/procurement integration
* real notification channels
* durable workflow persistence
* production audit export

These are intentional scope choices. The purpose of Project 5 is to demonstrate product experience quality, not production infrastructure.

---

## How ChatGPT and Bolt were used

This project intentionally used an AI-assisted prototyping workflow.

### ChatGPT was used for:

* problem selection
* product framing
* user personas
* workflow design
* information architecture
* commit planning
* Bolt prompt design
* trade-off analysis
* documentation structure
* portfolio narrative

### Bolt was used for:

* frontend scaffolding
* React/TypeScript implementation
* visual layout
* component generation
* clickable SaaS flows
* UI polish

The project was built through staged commits rather than a one-shot generated app. This was intentional because the goal was to show product direction and iteration, not only tool usage.

---

## Build progression

The project was built through staged commits:

```text
Commit 1: SaaS shell
Commit 2: Supplier dataset and portfolio risk dashboard
Commit 3: Supplier filters and dashboard-to-detail flow
Commit 4: Supplier detail workflow with evidence and compliance tabs
Commit 5: Remediation workflow and supplier portal
Commit 6: Empty, loading, error, and degraded AI states
Commit 7: Methodology trust center and AI boundaries
Commit 8: Product documentation and portfolio narrative
```

This progression mirrors the intended product learning arc:

```text
structure
→ data realism
→ navigation
→ detail workflow
→ action workflow
→ resilience
→ trust
→ portfolio packaging
```

---

## Interview positioning

A concise way to explain the project:

> SustainOps is a polished B2B SaaS prototype for supplier sustainability risk and compliance workflows. It helps procurement and ESG teams identify supplier risk, review evidence gaps, map compliance readiness, trigger remediation, and preserve auditability. The key product idea is that AI can summarize and draft, but deterministic systems govern risk levels, blocked actions, and workflow state.

What this project demonstrates:

* I can choose a high-signal product problem.
* I can translate complex workflows into a legible SaaS experience.
* I can define AI boundaries clearly.
* I can model deterministic controls around compliance-sensitive workflows.
* I can think through degraded states and trust.
* I can use modern AI prototyping tools without letting them drive product direction.
