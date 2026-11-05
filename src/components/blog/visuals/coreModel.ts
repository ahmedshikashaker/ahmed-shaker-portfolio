/**
 * Shared, illustrative model for "Fast Edge, Steady Core" (part 5). Release cadences, the changes in the coupling
 * map, the release calendar for change 28, and the strangler-fig timeline all read from here, so the visuals
 * agree. Round numbers, not data from any bank.
 */

/** Weeks between production releases, by kind of system. */
export const CADENCE_WEEKS = { edge: 1, integration: 4, core: 13 } as const;
export type Tier = keyof typeof CADENCE_WEEKS;

export const TIER_LABEL: Record<Tier, string> = {
  edge: "Edge (app, web, edge services)",
  integration: "Integration layer",
  core: "Core banking system",
};
export const CADENCE_LABEL: Record<Tier, string> = { edge: "weekly", integration: "monthly", core: "quarterly" };

/* ---------------------------------------------------------------- The coupling map */

export type NodeId =
  | "app" | "web" | "branch" | "partners"
  | "eQuotes" | "eAccounts" | "eNotify" | "ePartner"
  | "middleware"
  | "customer" | "ledger" | "payments" | "pricing";

export const NODE: Record<NodeId, { label: string; tier: Tier; team: string }> = {
  app: { label: "Mobile app", tier: "edge", team: "App squad" },
  web: { label: "Web banking", tier: "edge", team: "Web squad" },
  branch: { label: "Branch systems", tier: "edge", team: "Branch systems" },
  partners: { label: "Partners", tier: "edge", team: "Partnerships" },
  eQuotes: { label: "Quotes", tier: "edge", team: "Edge team" },
  eAccounts: { label: "Accounts view", tier: "edge", team: "Edge team" },
  eNotify: { label: "Notifications", tier: "edge", team: "Edge team" },
  ePartner: { label: "Partner API", tier: "edge", team: "Edge team" },
  middleware: { label: "Middleware", tier: "integration", team: "Integration team" },
  customer: { label: "Customer", tier: "core", team: "Core team" },
  ledger: { label: "Accounts & ledger", tier: "core", team: "Core team" },
  payments: { label: "Payments", tier: "core", team: "Core team" },
  pricing: { label: "Pricing & products", tier: "core", team: "Core team" },
};

export type Arch = "p2p" | "edge";

export interface ChangeCase {
  id: string;
  name: string;
  short: string;
  /** Systems the change has to touch, and weeks of work, in each architecture. */
  touches: Record<Arch, NodeId[]>;
  buildWeeks: Record<Arch, number>;
  note: Record<Arch, string>;
}

export const CHANGES: ChangeCase[] = [
  {
    id: "c27",
    name: "Change 27",
    short: "Reword a sentence on a screen",
    touches: { p2p: ["app"], edge: ["app"] },
    buildWeeks: { p2p: 0.1, edge: 0.1 },
    note: {
      p2p: "It only touches the app, so it rides the next weekly release. Changes like this were never the core’s problem.",
      edge: "Same as before: an app-only change rides the next weekly release.",
    },
  },
  {
    id: "c28",
    name: "Change 28",
    short: "Show the rate and fee before the customer confirms",
    touches: { p2p: ["app", "middleware", "pricing"], edge: ["app", "eQuotes"] },
    buildWeeks: { p2p: 2, edge: 1 },
    note: {
      p2p: "The app has to ask the core for a quote it was never built to give, so the change waits for the core’s quarterly release.",
      edge: "The edge already has a quotes service, fed by the core through a stable contract. The core doesn’t change at all.",
    },
  },
  {
    id: "partner",
    name: "A partner API",
    short: "Let a partner read a customer’s accounts, with consent",
    touches: { p2p: ["partners", "middleware", "ledger", "customer"], edge: ["partners", "ePartner", "eAccounts"] },
    buildWeeks: { p2p: 3, edge: 1.5 },
    note: {
      p2p: "New endpoints in the middleware and new access paths into the core: two release trains, and the slow one decides.",
      edge: "The partner API sits at the edge and reads the same accounts view the app uses. The core keeps its calendar.",
    },
  },
  {
    id: "product",
    name: "A new savings product",
    short: "Launch a savings account with a new interest rule",
    touches: { p2p: ["app", "web", "middleware", "pricing", "ledger"], edge: ["app", "web", "eAccounts", "pricing", "ledger"] },
    buildWeeks: { p2p: 4, edge: 4 },
    note: {
      p2p: "A new product and a new interest rule genuinely belong in the core, and so does the wait.",
      edge: "This one belongs to the core, so it still waits. The difference: only changes like this wait now, and the journeys are ready when the core is.",
    },
  },
];

export function changeStats(c: ChangeCase, arch: Arch) {
  const nodes = c.touches[arch];
  const tiers = Array.from(new Set(nodes.map((n) => NODE[n].tier)));
  const slowest = tiers.reduce<Tier>((a, t) => (CADENCE_WEEKS[t] > CADENCE_WEEKS[a] ? t : a), "edge");
  const teams = Array.from(new Set(nodes.map((n) => NODE[n].team)));
  const build = c.buildWeeks[arch];
  const avg = build + CADENCE_WEEKS[slowest] / 2;
  const worst = build + CADENCE_WEEKS[slowest];
  return { nodes, tiers, slowest, teams, avg, worst };
}

export const fmtWeeks = (w: number) => {
  if (w < 1.5) {
    const d = Math.max(1, Math.round(w * 5));
    return `${d} working ${d === 1 ? "day" : "days"}`;
  }
  const v = w < 10 ? w.toFixed(1).replace(/\.0$/, "") : String(Math.round(w));
  return `${v} ${v === "1" ? "week" : "weeks"}`;
};

/* ---------------------------------------------------------------- Change 28's quarter */

export const WEEKS = CADENCE_WEEKS.core; // one quarter
export const DAYS = WEEKS * 5; // working days
export const EDGE_RELEASE_WEEKDAY = 3; // every Thursday
export const CORE_RELEASE_DAY = DAYS - 1; // the last Friday of the quarter
export const C28_READY_DAY = 7; // Wednesday of week 2, two weeks of work after the quarter's start

export const isEdgeRelease = (d: number) => d % 5 === EDGE_RELEASE_WEEKDAY;
export const nextEdgeRelease = (from: number) => {
  for (let d = from + 1; d < DAYS; d++) if (isEdgeRelease(d)) return d;
  return DAYS - 1;
};
/** When change 28 goes live, coupled to the core or not. */
export const C28_LIVE = { coupled: CORE_RELEASE_DAY, decoupled: nextEdgeRelease(C28_READY_DAY) } as const;
export const edgeReleasesBetween = (a: number, b: number) => {
  let n = 0;
  for (let d = a + 1; d < b; d++) if (isEdgeRelease(d)) n++;
  return n;
};

/* ---------------------------------------------------------------- Strangler fig */

/** Capabilities that move from the core to the edge, quarter by quarter, with their (illustrative) share of customer interactions. */
export const CAPABILITIES = [
  { id: "notify", label: "Notifications", share: 20, quarter: 1 },
  { id: "balances", label: "Balances & statements", share: 45, quarter: 2 },
  { id: "cards", label: "Card controls", share: 8, quarter: 3 },
  { id: "quotes", label: "Rates & quotes", share: 5, quarter: 4 },
  { id: "onboarding", label: "Onboarding", share: 3, quarter: 5 },
  { id: "payments", label: "Payment journeys", share: 12, quarter: 6 },
  { id: "profile", label: "Customer profile", share: 4, quarter: 7 },
  { id: "loans", label: "Loan applications", share: 3, quarter: 8 },
] as const;
export const STRANGLER_QUARTERS = 8;
