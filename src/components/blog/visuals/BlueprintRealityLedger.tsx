"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  ExternalLink,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { BLUEPRINT_SUBSYSTEMS, PLATFORM_METRICS } from "./aiGovernanceModel";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * Interactive Enterprise AI Production Readiness & Verification Matrix.
 * Shows how to separate Tier 1 (Deterministic Code & Contract Verification)
 * from Tier 2 (Integration & Replay Qualification) and Tier 3 (Target Infrastructure & Pentest Gates).
 */
export default function BlueprintRealityLedger({
  caption,
}: {
  caption?: string;
}) {
  const [selectedId, setSelectedId] = useState<string>(BLUEPRINT_SUBSYSTEMS[0].id);
  const reduced = useReducedMotionAfterMount();

  const current =
    BLUEPRINT_SUBSYSTEMS.find((s) => s.id === selectedId) ?? BLUEPRINT_SUBSYSTEMS[0];

  const passPct = PLATFORM_METRICS.verifiedPass;
  const repoGapPct = PLATFORM_METRICS.repoQualificationGaps;
  const extPct = PLATFORM_METRICS.externalProductionGates;

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
            <span className="eyebrow text-fg-3">
              Production Readiness Framework · Code Verification vs. Target Environment Gates
            </span>
          </div>
          <span className="font-mono text-[11px] text-fg-4">
            Three-Tier Enterprise Qualification Model
          </span>
        </div>

        {/* Top Summary Metrics Bar */}
        <div className="border-b border-line bg-bg-2/45 px-5 py-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-signal/40 bg-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-signal">
                  Tier 1 · Deterministic Core Gates
                </span>
                <CheckCircle2 className="size-4 text-signal" strokeWidth={2} />
              </div>
              <p className="mt-1.5 font-display text-[1.85rem] leading-none tabular-nums text-fg">
                Code &amp; Contracts{" "}
                <span className="font-mono text-[13px] text-signal">({passPct}%)</span>
              </p>
              <p className="mt-1 text-[11.5px] text-fg-3">
                Schema normalization, policy determinism, cryptographic grants, and append-only audit rules
              </p>
            </div>

            <div className="rounded-xl border border-accent/40 bg-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                  Tier 2 · Integration &amp; Replay
                </span>
                <Clock className="size-4 text-accent" strokeWidth={2} />
              </div>
              <p className="mt-1.5 font-display text-[1.85rem] leading-none tabular-nums text-fg">
                Sandbox &amp; E2E{" "}
                <span className="font-mono text-[13px] text-accent">({repoGapPct}%)</span>
              </p>
              <p className="mt-1 text-[11.5px] text-fg-3">
                Golden adversarial evaluation suites, live identity E2E flows, and connector replay harnesses
              </p>
            </div>

            <div className="rounded-xl border border-line-2 bg-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-3">
                  Tier 3 · Target Infrastructure
                </span>
                <ExternalLink className="size-4 text-fg-4" strokeWidth={1.85} />
              </div>
              <p className="mt-1.5 font-display text-[1.85rem] leading-none tabular-nums text-fg">
                Cluster &amp; Audit{" "}
                <span className="font-mono text-[13px] text-fg-4">({extPct}%)</span>
              </p>
              <p className="mt-1 text-[11.5px] text-fg-3">
                HA cluster failover soak, 500-session concurrency test, CNI isolation, and external pentest
              </p>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
            <div className="bg-signal" style={{ width: `${passPct}%` }} />
            <div className="bg-accent" style={{ width: `${repoGapPct}%` }} />
            <div className="bg-fg-4/50" style={{ width: `${extPct}%` }} />
          </div>
        </div>

        {/* Subsystem Selector & Detail */}
        <div className="grid gap-0 lg:grid-cols-12">
          <div
            className="border-b border-line lg:col-span-5 lg:border-b-0 lg:border-e"
            role="tablist"
            aria-label="Architecture subsystems"
          >
            {BLUEPRINT_SUBSYSTEMS.map((item) => {
              const active = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedId(item.id)}
                  className={`flex w-full items-start justify-between gap-3 border-b border-line px-5 py-3.5 text-start last:border-b-0 transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent ${
                    active ? "bg-surface-2" : "bg-surface hover:bg-surface-2/50"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold leading-snug text-fg">
                      {item.subsystem}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[10.5px] text-fg-4">
                      {item.stack}
                    </p>
                  </div>
                  <span
                    className={`mt-0.5 size-2.5 shrink-0 rounded-full ${
                      item.status === "implemented-verified"
                        ? "bg-signal"
                        : item.status === "implemented-qualifying"
                           ? "bg-accent"
                          : "bg-fg-3"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div className="p-5 sm:p-6 lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="flex h-full flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-semibold ${
                        current.status === "implemented-verified"
                          ? "border-signal/45 bg-signal/10 text-signal"
                          : "border-accent/45 bg-accent/10 text-accent"
                      }`}
                    >
                      <ClipboardCheck className="size-3.5" />
                      {current.statusLabel}
                    </span>
                    <span className="font-mono text-[11px] text-fg-4">{current.stack}</span>
                  </div>

                  <h4 className="mt-3 font-display text-[1.4rem] leading-tight text-fg">
                    {current.subsystem}
                  </h4>

                  <div className="mt-4">
                    <p className="font-mono text-[10.5px] uppercase tracking-wider text-signal">
                      Architectural Controls Verified in Code &amp; Contract Suites
                    </p>
                    <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-fg-2">
                      {current.implementedInCode.map((line) => (
                        <li key={line} className="flex items-start gap-2">
                          <ShieldCheck
                            className="mt-0.5 size-4 shrink-0 text-signal"
                            strokeWidth={1.85}
                            aria-hidden="true"
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-bg-2/55 p-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-accent">
                    <Layers className="size-3.5" />
                    Target Environment &amp; Operational Release Gate
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-fg-2">
                    {current.remainingOrExternalGate}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption ||
          "A working prototype is not production evidence: enterprise AI governance separates deterministic code verification from integration qualification and target-cluster release gates."}
      </figcaption>
    </figure>
  );
}
