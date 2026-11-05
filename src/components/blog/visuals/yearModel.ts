/**
 * Shared, illustrative model for "Year One" (part 6): the first twelve months of a digital factory, month by month.
 * Change 27's lead time is built from the series' own models: the backlog wait (measureModel.ts) and the six gates
 * (pipelineModel.ts), each gate switching to its automated time in the month that fix lands. The backlog waits and
 * the month each fix lands are illustrative assumptions. Round numbers, not data from any bank.
 */

import { GATES, stepFor, type Mode } from "./pipelineModel";
import { C27_BUILD, C27_WAIT_TO_START } from "./measureModel";

export const MONTHS = 12;

/** Month in which each gate becomes automated (part 2's fixes). Peer review stays human. */
const AUTOMATED_FROM: Record<string, number> = {
  tests: 5,
  security: 6,
  inventory: 6,
  approval: 8,
  deploy: 9,
};

/** Days a small fix waits before anyone starts it (part 3: 30 days at the start). Growth makes it worse first. */
const BACKLOG_WAIT = [C27_WAIT_TO_START, 30, 36, 40, 40, 38, 25, 20, 14, 5, 4, 3];

export interface Month {
  m: number;
  backlog: number;
  gates: number; // days spent in the six gates
  build: number;
  lead: number;
  board: string; // what the board pack showed
  built: string; // what was being built underneath
  essay?: { n: number; href: string };
}

const ESSAYS = {
  1: "/blog/the-factory-is-the-easy-part",
  2: "/blog/evidence-not-meetings",
  3: "/blog/the-one-number-a-board-should-watch",
  4: "/blog/fear-is-rational",
  5: "/blog/fast-edge-steady-core",
} as const;

const STORY: { board: string; built: string; essay?: keyof typeof ESSAYS }[] = [
  { board: "Factory launched", built: "Squads formed, platform and first pipeline", essay: 1 },
  { board: "Squad demos", built: "Hiring; the boundary is untouched" },
  { board: "Three more squads", built: "More work arrives at the same boundary", essay: 1 },
  { board: "Nothing new for customers", built: "Bottom of the J: more work in progress, same boundary" },
  { board: "First release to staff", built: "Automated tests on every change", essay: 2 },
  { board: "Two features live", built: "Security scans and bill of materials in the pipeline", essay: 2 },
  { board: "Lead time on the board pack", built: "One number; work in progress limited", essay: 3 },
  { board: "Release every week", built: "Standard changes approved by policy, not meeting", essay: 2 },
  { board: "Daytime releases", built: "Staged rollouts replace the release window", essay: 2 },
  { board: "Fewer calls about the app", built: "Capacity for small fixes; calls removed count", essay: 4 },
  { board: "Rate and fee before confirming", built: "Edge quotes service live; change 28 stops waiting", essay: 5 },
  { board: "A failure, fixed in minutes", built: "Blameless review of the first fast failure", essay: 4 },
];

function gatesDays(month: number) {
  return GATES.reduce((sum, g) => {
    const mode: Mode = AUTOMATED_FROM[g.id] !== undefined && month >= AUTOMATED_FROM[g.id] ? "auto" : "manual";
    return sum + stepFor(g, { [g.id]: mode }, false).step.hours / 24;
  }, 0);
}

export const YEAR: Month[] = STORY.map((s, i) => {
  const m = i + 1;
  const backlog = BACKLOG_WAIT[i];
  const gates = gatesDays(m);
  return {
    m,
    backlog,
    gates,
    build: C27_BUILD,
    lead: backlog + gates + C27_BUILD,
    board: s.board,
    built: s.built,
    essay: s.essay ? { n: s.essay, href: ESSAYS[s.essay] } : undefined,
  };
});

export const LEAD_START = YEAR[0].lead; // ≈ 45 days, as in part 3
export const LEAD_PEAK = Math.max(...YEAR.map((x) => x.lead)); // the bottom of the J
export const PEAK_MONTH = YEAR.find((x) => x.lead === LEAD_PEAK)!.m;
export const LEAD_END = YEAR[MONTHS - 1].lead;

/** Change 28 waits for the core's quarterly release until the edge quotes service is live. */
export const C28_FREE_FROM = 11;

/** Customer-visible value, 0–100: what boards expect (a straight line) vs. a typical J. Illustrative. */
export const EXPECTED = Array.from({ length: MONTHS + 1 }, (_, i) => (i / MONTHS) * 100);
export const ACTUAL = [0, 6, 9, 8, 7, 12, 22, 36, 52, 67, 81, 92, 100];

export const fmtDays = (d: number) => {
  const v = d < 10 ? d.toFixed(1).replace(/\.0$/, "") : String(Math.round(d));
  return `${v} ${v === "1" ? "day" : "days"}`;
};
