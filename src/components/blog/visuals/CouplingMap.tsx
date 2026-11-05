"use client";

import { useId, useState } from "react";
import { CADENCE_LABEL, CADENCE_WEEKS, CHANGES, NODE, changeStats, fmtWeeks, type Arch, type NodeId, type Tier } from "./coreModel";

/**
 * "The coupling map": pick a change and an architecture, and see which systems it has to touch, how many teams
 * must coordinate, and which release train decides its lead time. Point-to-point wiring vs. an edge layer with
 * stable contracts into the core. Illustrative model (coreModel.ts).
 */

type Row = { id: string; label: string; nodes: NodeId[] };
const ROWS: Record<Arch, Row[]> = {
  p2p: [
    { id: "channels", label: "Channels", nodes: ["app", "web", "branch", "partners"] },
    { id: "integration", label: "Integration", nodes: ["middleware"] },
    { id: "core", label: "Core banking system", nodes: ["customer", "ledger", "payments", "pricing"] },
  ],
  edge: [
    { id: "channels", label: "Channels", nodes: ["app", "web", "branch", "partners"] },
    { id: "edge", label: "Edge services", nodes: ["eQuotes", "eAccounts", "eNotify", "ePartner"] },
    { id: "integration", label: "Integration · contracts: APIs and events", nodes: ["middleware"] },
    { id: "core", label: "Core banking system", nodes: ["customer", "ledger", "payments", "pricing"] },
  ],
};

// Wires between consecutive rows, in a 400-wide band: [from node, from x, to node, to x].
type Wire = [NodeId, number, NodeId, number];
const WIRES: Record<Arch, Wire[][]> = {
  p2p: [
    [
      ["app", 50, "middleware", 40], ["app", 50, "middleware", 230], ["app", 50, "middleware", 340],
      ["web", 150, "middleware", 90], ["web", 150, "middleware", 280],
      ["branch", 250, "middleware", 120], ["branch", 250, "middleware", 310],
      ["partners", 350, "middleware", 60], ["partners", 350, "middleware", 380],
    ],
    [
      ["middleware", 30, "customer", 50], ["middleware", 210, "customer", 50],
      ["middleware", 90, "ledger", 150], ["middleware", 330, "ledger", 150], ["middleware", 380, "ledger", 150],
      ["middleware", 160, "payments", 250], ["middleware", 360, "payments", 250],
      ["middleware", 20, "pricing", 350], ["middleware", 250, "pricing", 350],
    ],
  ],
  edge: [
    [
      ["app", 50, "eQuotes", 50], ["app", 50, "eAccounts", 150], ["web", 150, "eAccounts", 150], ["web", 150, "eQuotes", 50],
      ["branch", 250, "eAccounts", 150], ["branch", 250, "eNotify", 250], ["partners", 350, "ePartner", 350],
    ],
    [
      ["eQuotes", 50, "middleware", 50], ["eAccounts", 150, "middleware", 150], ["eNotify", 250, "middleware", 250], ["ePartner", 350, "middleware", 350],
      ["ePartner", 350, "middleware", 160],
    ],
    [
      ["middleware", 50, "customer", 50], ["middleware", 150, "ledger", 150], ["middleware", 250, "payments", 250], ["middleware", 350, "pricing", 350],
    ],
  ],
};

const TIER_TONE: Record<Tier, string> = { edge: "text-signal", integration: "text-fg-2", core: "text-accent" };

export default function CouplingMap({ caption }: { caption?: string }) {
  const [arch, setArch] = useState<Arch>("p2p");
  const [sel, setSel] = useState("c28");
  const baseId = useId();
  const change = CHANGES.find((c) => c.id === sel)!;
  const stats = changeStats(change, arch);
  const touched = new Set<NodeId>(stats.nodes);
  const rows = ROWS[arch];

  const chip = (n: NodeId, wide = false) => {
    const on = touched.has(n);
    const tier = NODE[n].tier;
    return (
      <div
        key={n}
        className={`relative flex min-h-[2.6rem] flex-col justify-center rounded-lg border px-2 py-1.5 text-center transition-all duration-300 ${wide ? "col-span-4" : ""} ${
          on ? "border-accent bg-accent/[0.12] text-fg shadow-[0_0_0_3px_color-mix(in_oklab,var(--c-accent)_14%,transparent)]" : "border-line bg-bg-2/40 text-fg-3"
        }`}
      >
        <span className="text-[11px] font-medium leading-tight sm:text-[12px]">{NODE[n].label}</span>
        <span className={`font-mono text-[9px] uppercase tracking-[0.1em] sm:text-[9.5px] ${on ? TIER_TONE[tier] : "text-fg-4"}`}>{CADENCE_LABEL[tier]}</span>
      </div>
    );
  };

  const band = (wires: Wire[], key: string) => (
    <svg key={key} viewBox="0 0 400 100" preserveAspectRatio="none" className="block h-7 w-full sm:h-8" aria-hidden="true">
      {wires.map(([a, x1, b, x2], i) => {
        const on = touched.has(a) && touched.has(b);
        return (
          <path
            key={i}
            d={`M ${x1} 0 C ${x1} 55, ${x2} 45, ${x2} 100`}
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ stroke: on ? "var(--c-accent)" : "var(--c-line-3)", strokeWidth: on ? 2 : 1, opacity: on ? 1 : 0.7, transition: "stroke 0.3s, opacity 0.3s" }}
          />
        );
      })}
    </svg>
  );

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <p className="eyebrow text-fg-4">The coupling map</p>
          <div className="inline-flex rounded-full border border-line-2 p-0.5" role="group" aria-label="Architecture">
            {(
              [
                ["p2p", "Point to point"],
                ["edge", "With an edge layer"],
              ] as const
            ).map(([a, label]) => (
              <button
                key={a}
                type="button"
                aria-pressed={arch === a}
                onClick={() => setArch(a)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  arch === a ? "bg-accent text-on-accent" : "text-fg-3 hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pt-4 sm:px-6">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Changes">
            {CHANGES.map((c) => (
              <button
                key={c.id}
                id={`${baseId}-tab-${c.id}`}
                type="button"
                role="tab"
                aria-selected={sel === c.id}
                aria-controls={`${baseId}-panel`}
                onClick={() => setSel(c.id)}
                className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  sel === c.id ? "border-accent bg-accent/[0.12] text-fg" : "border-line-2 text-fg-3 hover:border-line-3 hover:text-fg"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <p className="mt-3 font-display text-[1.2rem] leading-snug text-fg">{change.short}</p>
        </div>

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${sel}`}>
          {/* Diagram */}
          <div className="px-5 py-5 sm:px-6" dir="ltr">
            {rows.map((r, i) => (
              <div key={r.id}>
                {i > 0 && band(WIRES[arch][i - 1], `${arch}-${i}`)}
                <p className="eyebrow mb-1.5 text-fg-4">{r.label}</p>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">{r.nodes.map((n) => chip(n, r.nodes.length === 1))}</div>
              </div>
            ))}
          </div>

          {/* Result */}
          <div className="grid gap-px border-t border-line bg-line sm:grid-cols-3">
            <div className="bg-surface px-5 py-4">
              <p className="eyebrow text-fg-4">Systems to change</p>
              <p className="mt-1.5 font-display text-[1.7rem] leading-none tabular-nums text-fg">{stats.nodes.length}</p>
              <p className="mt-1.5 text-[12px] leading-snug text-fg-3">
                {stats.teams.length} {stats.teams.length === 1 ? "team" : "teams"} to coordinate
              </p>
            </div>
            <div className="bg-surface px-5 py-4">
              <p className="eyebrow text-fg-4">Release trains to catch</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(["edge", "integration", "core"] as Tier[])
                  .filter((t) => stats.tiers.includes(t))
                  .map((t) => (
                    <span
                      key={t}
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.08em] ${
                        t === stats.slowest ? (t === "core" ? "border-danger/50 bg-danger/10 text-danger" : "border-signal/50 bg-signal/10 text-signal") : "border-line-2 text-fg-3"
                      }`}
                    >
                      {CADENCE_LABEL[t]}
                    </span>
                  ))}
              </div>
              <p className="mt-1.5 text-[12px] leading-snug text-fg-3">The slowest one decides: every {CADENCE_WEEKS[stats.slowest] === 1 ? "week" : `${CADENCE_WEEKS[stats.slowest]} weeks`}</p>
            </div>
            <div className="bg-surface px-5 py-4">
              <p className="eyebrow text-fg-4">Ready to live</p>
              <p className={`mt-1.5 font-display text-[1.7rem] leading-none tabular-nums ${stats.slowest === "core" ? "text-danger" : "text-signal"}`}>{fmtWeeks(stats.avg)}</p>
              <p className="mt-1.5 text-[12px] leading-snug text-fg-3">on average, up to {fmtWeeks(stats.worst)}</p>
            </div>
          </div>
          <p className="border-t border-line px-5 py-4 text-[13.5px] leading-relaxed text-fg-2 sm:px-6" aria-live="polite">
            {change.note[arch]}
          </p>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Pick a change, then switch the architecture. Illustrative release cadences: edge weekly, integration monthly, core quarterly."}
      </figcaption>
    </figure>
  );
}
