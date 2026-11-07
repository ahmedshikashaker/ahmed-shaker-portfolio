"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Power,
} from "lucide-react";

interface RolloutRing {
  ring: number;
  name: string;
  allowedTiers: string;
  scope: string;
  exitCriteria: string;
  gatesRequired: string[];
}

const ROLLOUT_RINGS: RolloutRing[] = [
  {
    ring: 0,
    name: "Ring 0 · Shadow & Contract Certification",
    allowedTiers: "Dry-Run / No Live Egress",
    scope: "Platform engineering & security red-team replay harness",
    exitCriteria: "100% schema/policy determinism; 0 critical prompt-injection bypasses across golden eval suite.",
    gatesRequired: ["Identity & Session Integrity", "Capability Catalog Pinning", "Policy Determinism"],
  },
  {
    ring: 1,
    name: "Ring 1 · R0 Read-Only & Brokered RAG",
    allowedTiers: "R0 Only (Mutations Disabled)",
    scope: "Internal pilot departments querying live status and cited policies",
    exitCriteria: "Zero cross-tenant citation leaks; interactive turn latency within SLA under load.",
    gatesRequired: ["Brokered RAG Scopes", "PII & Secret Scrubbing", "Audit Chain Integrity"],
  },
  {
    ring: 2,
    name: "Ring 2 · R1 Bounded Low-Blast-Radius Writes",
    allowedTiers: "R0 + R1 (Auto-Executed with Evidence)",
    scope: "IT service desk & internal workspace ticket/draft creation",
    exitCriteria: "100% idempotency key coverage; 0 duplicate writes across simulated timeout injection.",
    gatesRequired: ["Durable Workflow Fencing", "Execution Grant Verification"],
  },
  {
    ring: 3,
    name: "Ring 3 · R2 Hash-Confirmed Standard Writes",
    allowedTiers: "R0 + R1 + R2 (User Confirmation Bound to planHash)",
    scope: "Employee self-service (HR leave requests, travel bookings, roster updates)",
    exitCriteria: "Zero stale-ETag overwrites; 100% confirmation nonce & planHash verification.",
    gatesRequired: ["Optimistic Concurrency & Nonce", "Signed GitOps Promotion"],
  },
  {
    ring: 4,
    name: "Ring 4 · R3 Four-Eyes Quorum & Regulated Operations",
    allowedTiers: "R0 – R3 (R4 Hard-Blocked Always)",
    scope: "Cross-system enterprise operations with segregation of duties and step-up MFA",
    exitCriteria: "High-concurrency HA soak pass, DR failover drill, and independent external penetration test.",
    gatesRequired: ["Four-Eyes & Step-Up MFA", "HA Soak & External Pen-Test"],
  },
];

export default function ProductionRolloutGate() {
  const [selectedRing, setSelectedRing] = useState<number>(3);
  const [killSwitches, setKillSwitches] = useState({
    disableAllMutations: false,
    freezeR3Approvals: false,
    quarantineConnector: false,
    pauseSchedules: false,
  });

  const activeRing = ROLLOUT_RINGS[selectedRing] ?? ROLLOUT_RINGS[0];

  const toggleSwitch = (key: keyof typeof killSwitches) => {
    setKillSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const anyKillSwitchActive = Object.values(killSwitches).some(Boolean);

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
      {/* Header */}
      <div className="border-b border-line bg-bg-2/50 px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-accent">Production Operations &amp; Release Console · Progressive Adoption</span>
            <h3 className="mt-1 font-display text-[1.45rem] leading-tight text-fg">
              5-Ring Staged Rollout, Mandatory Release Gates, and Runtime Kill Switches
            </h3>
          </div>
          <span
            className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold ${
              anyKillSwitchActive
                ? "border-amber-400/50 bg-amber-400/15 text-amber-500"
                : "border-signal/40 bg-signal/10 text-signal"
            }`}
          >
            {anyKillSwitchActive ? "CONTAINMENT OVERRIDE ACTIVE" : "NOMINAL GOVERNED POSTURE"}
          </span>
        </div>

        {/* 5 Rollout Rings Selector */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {ROLLOUT_RINGS.map((r, idx) => {
            const isSelected = idx === selectedRing;
            return (
              <button
                key={r.ring}
                type="button"
                onClick={() => setSelectedRing(idx)}
                className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/15 shadow-sm ring-1 ring-accent"
                    : "border-line bg-surface/80 hover:border-line-3"
                }`}
              >
                <span className="font-mono text-[10px] font-semibold uppercase text-accent">Ring {r.ring}</span>
                <span className="mt-1 line-clamp-2 text-[11.5px] font-medium leading-tight text-fg">
                  {r.name.split(" · ")[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Selected Ring Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRing.ring}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl border border-line-2 bg-bg-2/45 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <h4 className="font-display text-[1.3rem] text-fg">{activeRing.name}</h4>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent">
                Permitted Risk Ceiling: {activeRing.allowedTiers}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-line bg-surface p-3.5">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-fg-4">Deployment Scope</span>
                <p className="mt-1 text-[12.5px] leading-snug text-fg-2">{activeRing.scope}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-3.5">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-signal">
                  Quantitative Exit Criteria
                </span>
                <p className="mt-1 text-[12.5px] leading-snug text-fg-2">{activeRing.exitCriteria}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-3.5">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-accent">
                  Prerequisite Release Gates
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {activeRing.gatesRequired.map((g) => (
                    <span
                      key={g}
                      className="rounded border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10.5px] text-signal"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Runtime Emergency Kill-Switch Console */}
        <div className="mt-5 rounded-xl border border-line-2 bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-danger">
                Interactive Emergency Containment Console · Sub-Second Authority Revocation
              </span>
              <h4 className="mt-0.5 font-display text-[1.2rem] text-fg">
                Toggle independent runtime kill switches without taking down conversational R0 knowledge
              </h4>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                key: "disableAllMutations" as const,
                title: "Global Write Kill Switch",
                desc: "Instantly blocks all R1–R3 grants; degrades assistant to pure R0 read-only mode.",
              },
              {
                key: "freezeR3Approvals" as const,
                title: "Freeze R3 High-Risk Ops",
                desc: "Holds all R3 four-eyes dispatches while allowing routine R1/R2 self-service.",
              },
              {
                key: "quarantineConnector" as const,
                title: "Quarantine HRMS Connector",
                desc: "Trips circuit breaker on a single misbehaving downstream API without halting ERP/ITSM.",
              },
              {
                key: "pauseSchedules" as const,
                title: "Pause Scheduled Triggers",
                desc: "Suspends background cron/webhook runs in the trigger worker immediately.",
              },
            ].map((sw) => {
              const active = killSwitches[sw.key];
              return (
                <button
                  key={sw.key}
                  type="button"
                  onClick={() => toggleSwitch(sw.key)}
                  className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                    active
                      ? "border-danger bg-danger/12 shadow-sm"
                      : "border-line bg-bg-2/40 hover:border-line-3"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-fg">{sw.title}</span>
                    <Power className={`size-4 ${active ? "text-danger" : "text-fg-4"}`} />
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-snug text-fg-3">{sw.desc}</p>
                  <span
                    className={`mt-3 inline-block rounded px-2 py-0.5 font-mono text-[9.5px] uppercase ${
                      active ? "bg-danger/20 text-danger" : "bg-signal/15 text-signal"
                    }`}
                  >
                    {active ? "TRIPPED (BLOCKING)" : "ARMED (NORMAL)"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Effective Posture Bar */}
          <div className="mt-4 rounded-lg border border-line bg-bg-2/60 px-4 py-3 font-mono text-[11.5px] text-fg-2">
            <span className="font-semibold text-accent">Effective Runtime Posture: </span>
            {killSwitches.disableAllMutations
              ? "R0 READ-ONLY DEGRADATION — All mutation grants denied at PEP; knowledge retrieval & R0 status lookups remain 100% available."
              : [
                  killSwitches.freezeR3Approvals ? "R3 dispatches held" : "R0–R3 active per ring policy",
                  killSwitches.quarantineConnector ? "HRMS connector isolated" : "All certified connectors healthy",
                  killSwitches.pauseSchedules ? "Background schedules paused" : "Scheduled triggers running",
                ].join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}
