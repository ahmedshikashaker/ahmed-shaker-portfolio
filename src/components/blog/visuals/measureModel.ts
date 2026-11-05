/**
 * Shared, illustrative model for "The One Number a Board Should Watch". Every visual in the article reads its
 * numbers from here, so they always agree with each other, and with "Evidence, Not Meetings" (change 27's route
 * from finished to live comes from pipelineModel.ts). Round numbers, not data from any bank.
 */

import { MANUAL_HOURS } from "./pipelineModel";

/* ------------------------------------------------------------------ Change 27, end to end (days) */

export const C27_WAIT_TO_START = 30; // approved, then waited in the backlog for a month
export const C27_BUILD = 4 / 24; // written in an afternoon
export const C27_TO_LIVE = (MANUAL_HOURS - 4) / 24 + 4 / 24; // review + the gates, as in essay two (≈ 14.7 days)
export const C27_TOTAL = C27_WAIT_TO_START + C27_BUILD + C27_TO_LIVE; // ≈ 45 days
export const C27_EFFORT_DAYS = 0.5; // writing + reviewing, in working time
export const C27_FLOW_EFFICIENCY = C27_EFFORT_DAYS / C27_TOTAL; // ≈ 1%

/* ------------------------------------------------------------------ The board pack (quarter vs. previous quarter) */

export const PACK = {
  velocity: { now: "+38%", note: "story points per sprint" },
  deployments: { now: "112", was: "68", note: "releases this quarter" },
  commitments: { now: "94%", note: "sprint commitments met" },
  squads: { now: "12", was: "9", note: "squads in the factory" },
  agile: { now: "100%", note: "of teams working in sprints" },
  wipNow: 340,
  wipWas: 210,
  deliveredPerWeek: 34,
};
/** Little's Law: average lead time = work in progress ÷ throughput (weeks → days). */
export const LEAD_NOW_DAYS = Math.round((PACK.wipNow / PACK.deliveredPerWeek) * 7); // 70
export const LEAD_WAS_DAYS = Math.round((PACK.wipWas / PACK.deliveredPerWeek) * 7); // 43

/* ------------------------------------------------------------------ Lead-time distribution (one quarter, 200 changes) */

/** Inverse standard normal CDF (Acklam's rational approximation; error < 1.2e-9). */
function invNorm(p: number) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - pl) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/**
 * 200 lead times with a long right tail (log-normal, σ = 0.7), placed on evenly spaced quantiles so the shape is
 * smooth and deterministic. The average is tuned to the board pack's 70 days.
 */
const SIGMA = 0.7;
const MU = Math.log(LEAD_NOW_DAYS) - (SIGMA * SIGMA) / 2;
export const LEAD_TIMES: number[] = Array.from({ length: 200 }, (_, i) => Math.exp(MU + SIGMA * invNorm((i + 0.5) / 200)));

export function percentile(p: number) {
  const sorted = LEAD_TIMES; // already ascending
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}
export const LEAD_MEAN = LEAD_TIMES.reduce((s, x) => s + x, 0) / LEAD_TIMES.length;
export const LEAD_MEDIAN = percentile(50);
export const LEAD_P85 = percentile(85);

/* ------------------------------------------------------------------ Flow: 26 weeks of a factory and its boundary */

export const FLOW = {
  weeks: 26,
  approvedPerWeek: 44, // new work the bank approves each week
  factoryCapacity: 48, // changes the squads can finish per week
  boundaryCapacity: 34, // changes the boundary can release per week
  boundaryFunded: 46,
  wipLimit: 210, // in-progress limit (factory + boundary) when limiting work in progress
  start: { waiting: 0, factory: 70, boundary: 140 }, // 210 in progress at week 0 (the previous board pack)
  boardPackWeek: 13,
};

export type StartPolicy = "push" | "limit";

export interface FlowWeek {
  week: number;
  arrived: number; // cumulative
  started: number;
  built: number;
  delivered: number;
  waiting: number; // approved, not started
  factory: number;
  boundary: number;
  throughput: number; // delivered this week
  leadIdea: number; // days, idea → customer (Little's Law)
  leadStart: number; // days, start → customer
}

export function simulateFlow(policy: StartPolicy, funded: boolean): FlowWeek[] {
  const cQ = funded ? FLOW.boundaryFunded : FLOW.boundaryCapacity;
  let { waiting: B, factory: F, boundary: Q } = FLOW.start;
  let D = 0;
  let Fd = Q; // cumulative built = delivered so far + what's waiting at the boundary
  let S = Fd + F;
  let A = S + B;
  const out: FlowWeek[] = [];
  const snap = (week: number, thr: number): FlowWeek => {
    const t = Math.max(1, thr || cQ);
    return {
      week,
      arrived: A,
      started: S,
      built: Fd,
      delivered: D,
      waiting: B,
      factory: F,
      boundary: Q,
      throughput: thr,
      leadIdea: ((B + F + Q) / t) * 7,
      leadStart: ((F + Q) / t) * 7,
    };
  };
  out.push(snap(0, cQ));
  for (let w = 1; w <= FLOW.weeks; w++) {
    const d = Math.min(Q, cQ);
    Q -= d;
    D += d;
    const f = Math.min(F, FLOW.factoryCapacity);
    F -= f;
    Q += f;
    Fd += f;
    B += FLOW.approvedPerWeek;
    A += FLOW.approvedPerWeek;
    const s = policy === "push" ? B : Math.min(B, Math.max(0, FLOW.wipLimit - (F + Q)));
    B -= s;
    F += s;
    S += s;
    out.push(snap(w, d));
  }
  return out;
}

export const fmtDays = (d: number) => `${Math.round(d)} days`;
