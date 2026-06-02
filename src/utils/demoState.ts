export type DemoMode =
  | "normal"
  | "ai-unavailable"
  | "evidence-unavailable"
  | "loading"
  | "stale-data"
  | "empty-portfolio";

export const DEMO_MODE_LABELS: Record<DemoMode, string> = {
  normal: "Normal",
  "ai-unavailable": "AI Brief Unavailable",
  "evidence-unavailable": "Evidence Source Unavailable",
  loading: "Loading Supplier Analysis",
  "stale-data": "Stale Evidence Data",
  "empty-portfolio": "Empty Portfolio",
};
