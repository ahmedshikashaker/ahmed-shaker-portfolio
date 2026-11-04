/**
 * Shared, illustrative model for "Evidence, Not Meetings": six control gates a routine change passes through,
 * each run either as a manual queue (people, meetings, windows) or as an automated check that produces evidence.
 * Pipeline Gates and Change Journey both read these numbers, so the article's visuals always agree.
 * Round numbers, not data from any bank. Times are elapsed hours, not working hours.
 */

export type Mode = "manual" | "auto";

export interface Step {
  label: string;
  hours: number;
  evidence: string;
}

export interface Gate {
  id: string;
  name: string;
  control: string;
  human?: Step; // fixed human step (same in both modes)
  manual?: Step;
  auto?: Step;
}

export const GATES: Gate[] = [
  {
    id: "review",
    name: "Peer review",
    control: "Segregation of duties: someone other than the author approves",
    human: { label: "A colleague reviews and approves in the development platform", hours: 4, evidence: "Review record: approver, comments, time" },
  },
  {
    id: "tests",
    name: "Testing",
    control: "It works, and breaks nothing else",
    manual: { label: "Waits for the next regression test cycle", hours: 72, evidence: "Test sign-off email" },
    auto: { label: "Automated tests run on every change", hours: 0.4, evidence: "Test report" },
  },
  {
    id: "security",
    name: "Security",
    control: "No known vulnerabilities in code or dependencies",
    manual: { label: "Queued for a security review", hours: 120, evidence: "Review spreadsheet" },
    auto: { label: "Code, dependency and container scans", hours: 0.3, evidence: "Scan results vs. thresholds" },
  },
  {
    id: "inventory",
    name: "Software inventory",
    control: "We know exactly what is in the release",
    manual: { label: "Component list maintained by hand", hours: 24, evidence: "Spreadsheet (often stale)" },
    auto: { label: "Bill of materials generated at build", hours: 0.05, evidence: "SBOM + build provenance" },
  },
  {
    id: "approval",
    name: "Change approval",
    control: "Someone accountable approved the release",
    manual: { label: "Waits for the weekly change board", hours: 84, evidence: "Meeting minutes" },
    auto: { label: "Policy check: all evidence present and within thresholds", hours: 0.1, evidence: "Approval record linked to evidence" },
  },
  {
    id: "deploy",
    name: "Deployment",
    control: "Released safely, and reversible",
    manual: { label: "Waits for the out-of-hours release window", hours: 48, evidence: "Release checklist" },
    auto: { label: "Staged rollout with automatic rollback", hours: 1, evidence: "Deployment log" },
  },
];

export const NOVEL_REVIEW: Step = {
  label: "Escalated: risk owners review the evidence and decide",
  hours: 48,
  evidence: "Risk decision, named owner",
};

/** Minutes the weekly change board spends on one change (forty changes in a ninety-minute meeting). */
export const MEETING_MINUTES = 2;

export type Modes = Record<string, Mode>;
export const ALL_MANUAL: Modes = Object.fromEntries(GATES.map((g) => [g.id, "manual"]));
export const ALL_AUTO: Modes = Object.fromEntries(GATES.map((g) => [g.id, "auto"]));

export type StepKind = "human" | "manual" | "auto" | "escalated";

export function stepFor(g: Gate, modes: Modes, novel: boolean): { step: Step; kind: StepKind } {
  if (g.human) return { step: g.human, kind: "human" };
  const mode = modes[g.id];
  if (g.id === "approval" && novel && mode === "auto") return { step: NOVEL_REVIEW, kind: "escalated" };
  return mode === "auto" ? { step: g.auto!, kind: "auto" } : { step: g.manual!, kind: "manual" };
}

export function totalHours(modes: Modes, novel = false) {
  return GATES.reduce((s, g) => s + stepFor(g, modes, novel).step.hours, 0);
}

export function fmtDuration(hours: number) {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 24) return `${hours < 10 ? hours.toFixed(1).replace(/\.0$/, "") : Math.round(hours)} h`;
  const d = hours / 24;
  const v = d < 10 ? d.toFixed(1).replace(/\.0$/, "") : String(Math.round(d));
  return `${v} ${v === "1" ? "day" : "days"}`;
}

/** Elapsed hours for the all-manual and all-automated routes. */
export const MANUAL_HOURS = totalHours(ALL_MANUAL);
export const AUTO_HOURS = totalHours(ALL_AUTO);
