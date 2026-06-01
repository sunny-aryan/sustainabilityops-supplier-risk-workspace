import { useState, useCallback } from "react";
import { defaultRemediationPlans } from "@/data/remediationPlans";
import type {
  RemediationPlan,
  RemediationPlanStatus,
  MilestoneStatus,
  TimelineEvent,
  TimelineEventType,
  TimelineEventSource,
} from "@/types";

const STORAGE_KEY = "sustainops_remediation_plans";
const TIMELINE_KEY = "sustainops_timeline_events";

// ─── Persistence helpers ───────────────────────────────────────────────────────

function loadPlans(): RemediationPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as RemediationPlan[];
  } catch {
    // ignore parse errors
  }
  return defaultRemediationPlans.map((p) => ({ ...p, milestones: p.milestones.map((m) => ({ ...m })) }));
}

function savePlans(plans: RemediationPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch {
    // ignore storage errors
  }
}

function loadExtraTimeline(): TimelineEvent[] {
  try {
    const raw = localStorage.getItem(TIMELINE_KEY);
    if (raw) return JSON.parse(raw) as TimelineEvent[];
  } catch {
    // ignore
  }
  return [];
}

function saveExtraTimeline(events: TimelineEvent[]): void {
  try {
    localStorage.setItem(TIMELINE_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }
}

// ─── Deterministic rule helpers ────────────────────────────────────────────────

/** Returns true when a milestone can be marked Complete (no missing/expired required evidence in plan) */
export function canCompleteMilestone(
  plan: RemediationPlan,
  milestoneId: string
): { allowed: boolean; reason?: string } {
  const milestone = plan.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return { allowed: false, reason: "Milestone not found." };
  if (milestone.status === "Complete") return { allowed: false, reason: "Already complete." };
  if (milestone.status === "Not Started" || milestone.status === "Requested") {
    return { allowed: false, reason: "Evidence must be submitted by the supplier before this milestone can be completed." };
  }
  // Analyst-owned milestones in Under Review CAN be completed
  if (milestone.owner === "ESG / Compliance Analyst" && milestone.status === "Under Review") {
    return { allowed: true };
  }
  // Supplier-owned milestones that are Submitted can be moved to Under Review, not Complete
  if (milestone.owner === "Supplier User" && milestone.status === "Submitted") {
    return { allowed: false, reason: "Supplier submission moves to Under Review. Analyst must complete the review." };
  }
  return { allowed: true };
}

/** Returns true if a plan can be escalated */
export function canEscalatePlan(plan: RemediationPlan): boolean {
  return plan.status !== "Escalated" && plan.status !== "Complete";
}

/** Returns true if a plan can be sent to supplier */
export function canSendToSupplier(plan: RemediationPlan): boolean {
  return plan.status === "Draft";
}

/** Returns whether procurement approval is blocked for a plan */
export function isProcurementBlocked(plan: RemediationPlan): boolean {
  if (!plan.blocksProcurementApproval) return false;
  const blockingMilestones = plan.milestones.filter((m) => m.blocksApproval);
  return blockingMilestones.some((m) => m.status !== "Complete");
}

function makeTimelineEvent(
  supplierId: string,
  eventType: TimelineEventType,
  source: TimelineEventSource,
  actor: string,
  description: string
): TimelineEvent {
  return {
    id: `tl-rt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    supplierId,
    date: new Date().toISOString().slice(0, 10),
    actor,
    eventType,
    description,
    source,
    systemGenerated: source === "System",
  };
}

// ─── React hook ───────────────────────────────────────────────────────────────

export function useRemediationStore() {
  const [plans, setPlans] = useState<RemediationPlan[]>(() => loadPlans());
  const [extraTimeline, setExtraTimeline] = useState<TimelineEvent[]>(() => loadExtraTimeline());

  const updatePlans = useCallback((next: RemediationPlan[]) => {
    savePlans(next);
    setPlans(next);
  }, []);

  const addTimelineEvent = useCallback(
    (event: TimelineEvent) => {
      const next = [event, ...extraTimeline];
      saveExtraTimeline(next);
      setExtraTimeline(next);
    },
    [extraTimeline]
  );

  const getExtraTimelineForSupplier = useCallback(
    (supplierId: string) =>
      extraTimeline.filter((e) => e.supplierId === supplierId),
    [extraTimeline]
  );

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Update milestone status */
  const updateMilestoneStatus = useCallback(
    (planId: string, milestoneId: string, newStatus: MilestoneStatus, actor: string, actorSource: TimelineEventSource) => {
      const next = plans.map((plan) => {
        if (plan.id !== planId) return plan;
        const milestones = plan.milestones.map((m) =>
          m.id === milestoneId ? { ...m, status: newStatus } : m
        );
        const updatedAt = new Date().toISOString().slice(0, 10);
        return { ...plan, milestones, updatedAt };
      });
      updatePlans(next);

      const plan = next.find((p) => p.id === planId);
      const milestone = plan?.milestones.find((m) => m.id === milestoneId);
      if (plan && milestone) {
        const eventTypeMap: Record<MilestoneStatus, TimelineEventType> = {
          "Not Started": "evidence_requested",
          Requested: "evidence_requested",
          Submitted: "evidence_submitted",
          "Under Review": "evidence_submitted",
          Complete: "review_completed",
          Blocked: "policy_triggered",
        };
        addTimelineEvent(
          makeTimelineEvent(
            plan.supplierId,
            eventTypeMap[newStatus] ?? "evidence_submitted",
            actorSource,
            actor,
            `Milestone "${milestone.title}" moved to ${newStatus}.`
          )
        );

        // System: check if approval is still blocked
        if (isProcurementBlocked(plan)) {
          addTimelineEvent(
            makeTimelineEvent(
              plan.supplierId,
              "policy_triggered",
              "System",
              "System",
              "Procurement approval remains blocked — required evidence not yet complete."
            )
          );
        }
      }
    },
    [plans, updatePlans, addTimelineEvent]
  );

  /** Escalate a plan */
  const escalatePlan = useCallback(
    (planId: string, actor: string) => {
      const next = plans.map((plan) =>
        plan.id === planId
          ? { ...plan, status: "Escalated" as RemediationPlanStatus, updatedAt: new Date().toISOString().slice(0, 10) }
          : plan
      );
      updatePlans(next);
      const plan = next.find((p) => p.id === planId);
      if (plan) {
        addTimelineEvent(
          makeTimelineEvent(
            plan.supplierId,
            "finding_flagged",
            "ESG Analyst",
            actor,
            `Remediation plan "${plan.title}" escalated for senior ESG review by ${actor}.`
          )
        );
      }
    },
    [plans, updatePlans, addTimelineEvent]
  );

  /** Send plan to supplier */
  const sendToSupplier = useCallback(
    (planId: string, actor: string) => {
      const next = plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              status: "Sent to Supplier" as RemediationPlanStatus,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : plan
      );
      updatePlans(next);
      const plan = next.find((p) => p.id === planId);
      if (plan) {
        addTimelineEvent(
          makeTimelineEvent(
            plan.supplierId,
            "evidence_requested",
            "Procurement Manager",
            actor,
            `Remediation plan "${plan.title}" sent to supplier contact ${plan.supplierContact}.`
          )
        );
      }
    },
    [plans, updatePlans, addTimelineEvent]
  );

  /** Mark supplier response received */
  const markSupplierResponded = useCallback(
    (planId: string) => {
      const next = plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              status: "Supplier Responded" as RemediationPlanStatus,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : plan
      );
      updatePlans(next);
      const plan = next.find((p) => p.id === planId);
      if (plan) {
        addTimelineEvent(
          makeTimelineEvent(
            plan.supplierId,
            "evidence_submitted",
            "Supplier User",
            plan.supplierContact,
            `Supplier ${plan.supplierContact} responded to remediation plan "${plan.title}".`
          )
        );
      }
    },
    [plans, updatePlans, addTimelineEvent]
  );

  /** Supplier submits a milestone (portal action) */
  const supplierSubmitMilestone = useCallback(
    (planId: string, milestoneId: string, supplierName: string) => {
      const next = plans.map((plan) => {
        if (plan.id !== planId) return plan;
        const milestones = plan.milestones.map((m) =>
          m.id === milestoneId && (m.status === "Not Started" || m.status === "Requested")
            ? { ...m, status: "Submitted" as MilestoneStatus }
            : m
        );
        // update plan status to Supplier Responded if not already further along
        const planStatus: RemediationPlanStatus =
          plan.status === "Sent to Supplier" || plan.status === "In Progress"
            ? "Supplier Responded"
            : plan.status;
        return { ...plan, milestones, status: planStatus, updatedAt: new Date().toISOString().slice(0, 10) };
      });
      updatePlans(next);

      const plan = next.find((p) => p.id === planId);
      const milestone = plan?.milestones.find((m) => m.id === milestoneId);
      if (plan && milestone) {
        addTimelineEvent(
          makeTimelineEvent(
            plan.supplierId,
            "evidence_submitted",
            "Supplier User",
            supplierName,
            `${supplierName} submitted "${milestone.title}" via Supplier Portal. Item moved to Under Review — internal review required.`
          )
        );
        addTimelineEvent(
          makeTimelineEvent(
            plan.supplierId,
            "policy_triggered",
            "System",
            "System",
            "Supplier submission received. Item placed Under Review. Procurement approval remains blocked until analyst completes review."
          )
        );
      }
    },
    [plans, updatePlans, addTimelineEvent]
  );

  return {
    plans,
    extraTimeline,
    getExtraTimelineForSupplier,
    updateMilestoneStatus,
    escalatePlan,
    sendToSupplier,
    markSupplierResponded,
    supplierSubmitMilestone,
    canCompleteMilestone,
    canEscalatePlan,
    canSendToSupplier,
    isProcurementBlocked,
  };
}
