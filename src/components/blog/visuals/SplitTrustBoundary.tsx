"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Cpu,
  KeyRound,
  Lock,
  Network,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";
import { TRUST_BOUNDARIES, PLATFORM_METRICS } from "./aiGovernanceModel";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * Interactive Split-Zone Trust Boundary Explorer.
 * Shows the 3 isolated runtime zones and the 5 trust boundaries (Boundary A–E),
 * with interactive threat simulation for each boundary.
 */
export default function SplitTrustBoundary({
  caption,
}: {
  caption?: string;
}) {
  const [selectedBoundaryId, setSelectedBoundaryId] = useState<string>("boundary-b");
  const [simulatingAttack, setSimulatingAttack] = useState<boolean>(false);
  const reduced = useReducedMotionAfterMount();

  const boundary =
    TRUST_BOUNDARIES.find((b) => b.id === selectedBoundaryId) ?? TRUST_BOUNDARIES[1];

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="eyebrow text-fg-3">
              Interactive Architecture Blueprint · Split-Zone Trust Model &amp; Boundaries
            </span>
          </div>
          <span className="font-mono text-[11.5px] text-fg-4">
            Three Isolated Runtime Zones · Five Security Boundaries
          </span>
        </div>

        {/* 3 Isolated Zones Architectural Diagram */}
        <div className="blueprint-grid border-b border-line bg-bg-2/65 p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Zone 1: Deterministic Control Plane */}
            <div
              className={`rounded-xl border p-4 transition-colors ${
                selectedBoundaryId === "boundary-a" ||
                selectedBoundaryId === "boundary-b" ||
                selectedBoundaryId === "boundary-e"
                  ? "border-signal/60 bg-surface shadow-[var(--shadow-soft)]"
                  : "border-line-2 bg-surface/85"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/45 bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-signal">
                  <Shield className="size-3" strokeWidth={2} /> Zone 1 · Deterministic Authority
                </span>
                <Server className="size-4 text-signal" strokeWidth={1.75} />
              </div>
              <h4 className="mt-3 font-display text-[1.2rem] text-fg">
                Governance Control Plane &amp; PEP
              </h4>
              <p className="mt-1 text-[12.5px] leading-snug text-fg-3">
                Owns identity context, capability catalog, policy enforcement, proposals, approvals, and authoritative relational state.
              </p>
              <ul className="mt-3 space-y-1.5 border-t border-line pt-3 font-mono text-[11px] text-fg-2">
                <li className="flex items-center justify-between">
                  <span>• Identity &amp; OIDC Guard</span>
                  <span className="text-signal">Boundary A</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Policy Decision Engine</span>
                  <span className="text-fg-4">&lt; {PLATFORM_METRICS.policyLatencyTargetMs}ms p95</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Relational State &amp; Fencing</span>
                  <span className="text-fg-4">Isolated Schemas</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Scope &amp; Grant Signer</span>
                  <span className="text-accent">Private Key Only</span>
                </li>
              </ul>
            </div>

            {/* Zone 2: Isolated AI Runtimes */}
            <div
              className={`rounded-xl border p-4 transition-colors ${
                selectedBoundaryId === "boundary-b" || selectedBoundaryId === "boundary-d"
                  ? "border-amber-400/60 bg-surface shadow-[var(--shadow-soft)]"
                  : "border-line-2 bg-surface/85"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/45 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                  <Cpu className="size-3" strokeWidth={2} /> Zone 2 · Untrusted AI Runtimes
                </span>
                <Terminal className="size-4 text-amber-500" strokeWidth={1.75} />
              </div>
              <h4 className="mt-3 font-display text-[1.2rem] text-fg">
                Reasoning &amp; Scoped Retrieval
              </h4>
              <p className="mt-1 text-[12.5px] leading-snug text-fg-3">
                Interprets intent, queries brokered evidence, and proposes bounded plan DAGs. Holds zero connector secrets and has no direct route to business APIs.
              </p>
              <ul className="mt-3 space-y-1.5 border-t border-line pt-3 font-mono text-[11px] text-fg-2">
                <li className="flex items-center justify-between">
                  <span>• Bounded Planning Graph</span>
                  <span className="text-amber-600 dark:text-amber-300">Boundary B</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Scoped Retrieval Engine</span>
                  <span className="text-amber-600 dark:text-amber-300">Boundary D</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Planner → Retrieval Direct Path</span>
                  <span className="text-danger">FORBIDDEN</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Database Access Scope</span>
                  <span className="text-fg-4">Checkpoint schema only</span>
                </li>
              </ul>
            </div>

            {/* Zone 3: Controlled Execution & Secret Custody */}
            <div
              className={`rounded-xl border p-4 transition-colors ${
                selectedBoundaryId === "boundary-c"
                  ? "border-accent/65 bg-surface shadow-[var(--shadow-soft)]"
                  : "border-line-2 bg-surface/85"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
                  <Workflow className="size-3" strokeWidth={2} /> Zone 3 · Isolated Execution
                </span>
                <KeyRound className="size-4 text-accent" strokeWidth={1.75} />
              </div>
              <h4 className="mt-3 font-display text-[1.2rem] text-fg">
                Durable Workers &amp; Secret Vault
              </h4>
              <p className="mt-1 text-[12.5px] leading-snug text-fg-3">
                Executes deterministic workflows, verifies single-attempt Signed Execution Grants, resolves short-lived credentials, and enforces egress allowlists.
              </p>
              <ul className="mt-3 space-y-1.5 border-t border-line pt-3 font-mono text-[11px] text-fg-2">
                <li className="flex items-center justify-between">
                  <span>• Durable Execution Worker</span>
                  <span className="text-accent">Boundary C</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Canonical Grant Verifier</span>
                  <span className="text-fg-4">SHA-256 Digest Checks</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Enterprise Secret Vault</span>
                  <span className="text-fg-4">Worker-only lease</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• REST/OpenAPI &amp; MCP Adapters</span>
                  <span className="text-signal">Pinned Egress</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 5 Boundary Selector Pills */}
          <div className="mt-5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-4 mb-2">
              Select a Trust Boundary to Inspect Threats &amp; Controls
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" role="tablist">
              {TRUST_BOUNDARIES.map((b) => {
                const active = b.id === selectedBoundaryId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedBoundaryId(b.id);
                      setSimulatingAttack(false);
                    }}
                    className={`rounded-xl border px-3 py-2.5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                      active
                        ? "border-accent bg-accent/12 text-fg"
                        : "border-line-2 bg-surface text-fg-2 hover:border-line-3"
                    }`}
                  >
                    <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {b.code}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] font-medium text-fg">
                      {b.name.split("↔")[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Boundary Deep-Dive */}
        <AnimatePresence mode="wait">
          <motion.div
            key={boundary.id}
            initial={reduced ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-accent/45 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent">
                    {boundary.code}
                  </span>
                  <span className="font-mono text-[11.5px] text-fg-3">
                    {boundary.keyAdr}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-[1.45rem] leading-tight text-fg">
                  {boundary.name}
                </h3>
                <p className="mt-1 font-mono text-[12px] text-fg-3">
                  Crossing path: {boundary.between}
                </p>
              </div>
              <button
                type="button"
                aria-pressed={simulatingAttack}
                onClick={() => setSimulatingAttack((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                  simulatingAttack
                    ? "border-danger bg-danger text-on-accent"
                    : "border-danger/50 bg-danger/10 text-danger hover:bg-danger/15"
                }`}
              >
                <ShieldAlert className="size-4" strokeWidth={1.85} aria-hidden="true" />
                {simulatingAttack ? "Hide Breach Simulation" : "Simulate Boundary Attack / Fault"}
              </button>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {/* Threats */}
              <div className="rounded-xl border border-danger/35 bg-danger/[0.04] p-4">
                <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-danger">
                  <AlertTriangle className="size-3.5" strokeWidth={2} />
                  Attack Vectors at {boundary.code}
                </div>
                <ul className="mt-3 space-y-2 text-[13px] leading-snug text-fg-2">
                  {boundary.threats.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-danger" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deterministic Controls */}
              <div className="rounded-xl border border-signal/35 bg-signal/[0.04] p-4">
                <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-signal">
                  <Lock className="size-3.5" strokeWidth={2} />
                  Deterministic Architectural Controls
                </div>
                <ul className="mt-3 space-y-2 text-[13px] leading-snug text-fg-2">
                  {boundary.deterministicControls.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Simulated Attack / Fault Panel */}
            <AnimatePresence initial={false}>
              {simulatingAttack && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduced ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 rounded-xl border border-accent/55 bg-bg-2/85 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
                        <Network className="size-3.5" />
                        Live Containment Drill · {boundary.simulateAttackTitle}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-signal">
                        <ShieldCheck className="size-3.5" /> Blast Radius Contained
                      </span>
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="font-mono text-[10.5px] uppercase tracking-wider text-danger">
                          1. What the Adversary or Failure Attempts
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-fg-2">
                          {boundary.simulateAttackWhatHappens}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[10.5px] uppercase tracking-wider text-signal">
                          2. How the Boundary Enforces Fail-Closed Control
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-fg-2">
                          {boundary.simulateAttackBlockedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
      <figcaption className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption ||
          "Explore the five trust boundaries separating non-deterministic AI reasoning runtimes from the Governance Control Plane, Policy Engine, and Durable Execution Workers."}
      </figcaption>
    </figure>
  );
}
