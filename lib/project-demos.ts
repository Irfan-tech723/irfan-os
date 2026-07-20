export type DemoStepKind =
  | "login"
  | "dashboard"
  | "expense"
  | "upload"
  | "prediction"
  | "workspace"
  | "qr"
  | "record";

export type DemoStep = { kind: DemoStepKind; title: string };

// Keyed by the project's `index` field in lib/data.ts (01-04). Each is a
// short guided walkthrough, not a screenshot — ProjectDemoModal renders a
// small interactive mockup per step kind.
export const PROJECT_DEMOS: Record<string, DemoStep[]> = {
  "01": [
    { kind: "upload", title: "Upload a microscopy image" },
    { kind: "prediction", title: "Detection + safety score" },
  ],
  "02": [
    { kind: "login", title: "Sign in" },
    { kind: "dashboard", title: "Group dashboard" },
    { kind: "expense", title: "Add an expense" },
  ],
  "03": [
    { kind: "qr", title: "Scan the QR code" },
    { kind: "record", title: "Emergency medical record" },
  ],
  "04": [{ kind: "workspace", title: "Workspace preview" }],
};
