"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BookOpen,
  CheckCircle2,
  Database,
  KeyRound,
  Layers,
  Lock,
  Play,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Workflow,
} from "lucide-react";
import {
  AI_MATURITY_STAGES,
  type MaturityStageId,
} from "./aiGovernanceModel";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * Interactive 4-stage architectural comparator:
 * Knowledge AI -> Contextual Co-Pilot -> Unconstrained Agent -> Governed AI Manager.
 * Shows how the system topology, trust boundary, and failure modes shift at each stage.
 */
export default function AiEvolutionSpectrum({
  variant = "full",
  caption,
}: {
  variant?: "full" | "compact";
  caption?: string;
}) {
  const [selectedId, setSelectedId] = useState<MaturityStageId>("governed-manager");
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);
  const reduced = useReducedMotionAfterMount();

  const stageIndex = AI_MATURITY_STAGES.findIndex((s) => s.id === selectedId);
  const stage = AI_MATURITY_STAGES[stageIndex] ?? AI_MATURITY_STAGES[3];

  function stopAutoPlay() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
  }

  useEffect(() => stopAutoPlay, []);

  function playSequence() {
    stopAutoPlay();
    if (reduced) {
      setSelectedId("governed-manager");
      return;
    }
    setPlaying(true);
    let idx = 0;
    setSelectedId(AI_MATURITY_STAGES[0].id);
    const step = () => {
      timerRef.current = window.setTimeout(() => {
        idx += 1;
        if (idx < AI_MATURITY_STAGES.length) {
          setSelectedId(AI_MATURITY_STAGES[idx].id);
          step();
        } else {
          setPlaying(false);
        }
      }, 1800);
    };
    step();
  }

  const verdictBadge = {
    "safe-but-passive": {
      ring: "border-line-3 bg-bg-2/70 text-fg-2",
      dot: "bg-fg-3",
      icon: BookOpen,
    },
    "manual-bottleneck": {
      ring: "border-accent/45 bg-accent/10 text-accent",
      dot: "bg-accent",
      icon: UserCheck,
    },
    "unacceptable-risk": {
      ring: "border-danger/55 bg-danger/12 text-danger",
      dot: "bg-danger",
      icon: ShieldAlert,
    },
    "enterprise-grade": {
      ring: "border-signal/55 bg-signal/12 text-signal",
      dot: "bg-signal",
      icon: ShieldCheck,
    },
  }[stage.trustVerdict];

  const VerdictIcon = verdictBadge.icon;

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="eyebrow text-fg-3">
              Interactive Architecture Comparator · The Four Stages of Enterprise AI
            </span>
          </div>
          <button
            type="button"
            onClick={playSequence}
            disabled={playing}
            className="inline-flex items-center gap-1.5 rounded-full border border-line-2 bg-bg-2/60 px-3 py-1 text-[12px] font-medium text-fg-2 transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Play className="size-3 text-accent" strokeWidth={2} aria-hidden="true" />
            {playing ? "Stepping through stages…" : "Animate progression"}
          </button>
        </div>

        {/* Stage selector tabs */}
        <div
          className="grid grid-cols-2 gap-px border-b border-line bg-line lg:grid-cols-4"
          role="tablist"
          aria-label="AI evolution stages"
        >
          {AI_MATURITY_STAGES.map((item, idx) => {
            const active = item.id === selectedId;
            const isDanger = item.id === "naive-agent";
            const isTarget = item.id === "governed-manager";
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  stopAutoPlay();
                  setSelectedId(item.id);
                }}
                className={`group relative flex flex-col items-start justify-between p-4 text-start transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent sm:p-5 ${
                  active
                    ? "bg-surface-2"
                    : "bg-surface hover:bg-surface-2/60"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-4">
                    {item.step}
                  </span>
                  <span
                    className={`size-2 rounded-full transition-transform ${
                      active ? "scale-125" : "opacity-55"
                    } ${
                      isTarget
                        ? "bg-signal"
                        : isDanger
                          ? "bg-danger"
                          : idx === 1
                            ? "bg-accent"
                            : "bg-fg-4"
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <p
                  className={`mt-2 font-display text-[1.2rem] leading-tight transition-colors ${
                    active ? "text-fg" : "text-fg-2 group-hover:text-fg"
                  }`}
                >
                  {item.name}
                </p>
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-fg-3">
                  {item.subtitle}
                </p>
                {active && (
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-0.5 ${
                      isTarget
                        ? "bg-signal"
                        : isDanger
                          ? "bg-danger"
                          : "bg-accent"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Hero & Live Topology */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium ${verdictBadge.ring}`}
                  >
                    <VerdictIcon className="size-3.5" strokeWidth={1.85} aria-hidden="true" />
                    {stage.trustLabel}
                  </span>
                  <span className="font-mono text-[11.5px] text-fg-4">
                    {stage.architecturePattern}
                  </span>
                </div>
                <p className="mt-3 font-display text-[1.35rem] italic leading-snug text-fg">
                  {stage.coreQuestion}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-fg-2">
                  {stage.summary}
                </p>
              </div>
            </div>

            {/* Live System Topology Schematic */}
            <div className="blueprint-grid mt-6 overflow-hidden rounded-xl border border-line-2 bg-bg-2/75 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <span className="eyebrow text-fg-4">
                  Runtime Topology &amp; Authority Path · {stage.name}
                </span>
                <span
                  className={`font-mono text-[11px] ${
                    stage.id === "naive-agent"
                      ? "text-danger"
                      : stage.id === "governed-manager"
                        ? "text-signal"
                        : "text-fg-3"
                  }`}
                >
                  {stage.id === "naive-agent"
                    ? "⚠ No deterministic barrier between LLM output and external APIs"
                    : stage.id === "governed-manager"
                      ? "✓ Reasoning separated from authority via Policy Engine & Signed Execution Grants"
                      : stage.id === "knowledge"
                        ? "Read-only boundary: human executes all downstream actions"
                        : "Single-app boundary: human bridges cross-system workflows"}
                </span>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
                {/* Node 1: Planner / AI */}
                <div className="flex flex-col justify-between rounded-xl border border-line-2 bg-surface p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                      01 · AI Layer
                    </span>
                    <Bot className="size-4 text-accent" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-[13px] font-semibold text-fg">
                    {stage.topology.planner}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug text-fg-3">
                    {stage.id === "governed-manager"
                      ? "Proposes typed DAG; holds zero credentials"
                      : stage.id === "naive-agent"
                        ? "Holds raw tool schemas & decides next call in loop"
                        : "Generates text or single-screen form draft"}
                  </p>
                </div>

                <div className="flex items-center justify-center text-fg-4" aria-hidden="true">
                  <ArrowRight className="size-4 rotate-90 lg:rotate-0" />
                </div>

                {/* Node 2: Policy & Control Gate */}
                <div
                  className={`flex flex-col justify-between rounded-xl border p-3.5 ${
                    stage.id === "naive-agent"
                      ? "border-danger/50 bg-danger/[0.07]"
                      : stage.id === "governed-manager"
                        ? "border-signal/50 bg-signal/[0.07]"
                        : "border-line-2 bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                      02 · Control Boundary
                    </span>
                    {stage.id === "naive-agent" ? (
                      <AlertTriangle className="size-4 text-danger" strokeWidth={1.75} />
                    ) : stage.id === "governed-manager" ? (
                      <Lock className="size-4 text-signal" strokeWidth={1.75} />
                    ) : (
                      <Layers className="size-4 text-fg-3" strokeWidth={1.75} />
                    )}
                  </div>
                  <p className="mt-2 text-[13px] font-semibold text-fg">
                    {stage.topology.policyGate}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug text-fg-3">
                    {stage.id === "governed-manager"
                      ? "7-stage continuous auth + R0–R4 obligations + hash-bound confirmation"
                      : stage.id === "naive-agent"
                        ? "Prompt instructions can be bypassed by indirect injection"
                        : "Relies on manual human review before acting"}
                  </p>
                </div>

                <div className="flex items-center justify-center text-fg-4" aria-hidden="true">
                  <ArrowRight className="size-4 rotate-90 lg:rotate-0" />
                </div>

                {/* Node 3: Execution Path */}
                <div
                  className={`flex flex-col justify-between rounded-xl border p-3.5 ${
                    stage.id === "naive-agent"
                      ? "border-danger/50 bg-danger/[0.07]"
                      : stage.id === "governed-manager"
                        ? "border-accent/50 bg-accent/[0.07]"
                        : "border-line-2 bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                      03 · Execution Broker
                    </span>
                    {stage.id === "governed-manager" ? (
                      <KeyRound className="size-4 text-accent" strokeWidth={1.75} />
                    ) : (
                      <Workflow className="size-4 text-fg-3" strokeWidth={1.75} />
                    )}
                  </div>
                  <p className="mt-2 text-[13px] font-semibold text-fg">
                    {stage.topology.executionPath}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug text-fg-3">
                    {stage.id === "governed-manager"
                      ? "Verifies canonical grant digests; resolves vault secret in worker"
                      : stage.id === "naive-agent"
                        ? "Ambient service credentials; blind retry on timeout risks duplicate writes"
                        : "Human manually copies data into target forms"}
                  </p>
                </div>

                <div className="flex items-center justify-center text-fg-4" aria-hidden="true">
                  <ArrowRight className="size-4 rotate-90 lg:rotate-0" />
                </div>

                {/* Node 4: Enterprise Systems */}
                <div className="flex flex-col justify-between rounded-xl border border-line-2 bg-surface p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                      04 · Enterprise Core
                    </span>
                    <Database className="size-4 text-fg-3" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-[13px] font-semibold text-fg">
                    {stage.topology.businessSystems}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug text-fg-3">
                    {stage.id === "governed-manager"
                      ? "Idempotent mutations + hash-chained audit trail across every step"
                      : stage.id === "naive-agent"
                        ? "Target APIs cannot distinguish model hallucination from user intent"
                        : "Systems remain safe only because AI cannot reach them"}
                  </p>
                </div>
              </div>
            </div>

            {/* 6-Dimension Architectural Breakdown */}
            {variant === "full" && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    label: "Capability & Tool Scope",
                    value: stage.dimensions.capabilityScope,
                  },
                  {
                    label: "Identity & Authorization",
                    value: stage.dimensions.identityAndAuth,
                  },
                  {
                    label: "Credential Custody",
                    value: stage.dimensions.credentialCustody,
                  },
                  {
                    label: "Multi-Action Orchestration",
                    value: stage.dimensions.multiStepExecution,
                  },
                  {
                    label: "Side-Effect & Timeout Safety",
                    value: stage.dimensions.sideEffectSafety,
                  },
                  {
                    label: "Audit & Non-Repudiation",
                    value: stage.dimensions.auditAndTraceability,
                  },
                ].map((dim) => (
                  <div
                    key={dim.label}
                    className="rounded-xl border border-line bg-bg-2/45 px-4 py-3"
                  >
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">
                      {dim.label}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-snug text-fg-2">
                      {dim.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Callout: Human Role vs Primary Failure Mode */}
            <div className="mt-5 grid gap-3 border-t border-line pt-4 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-line bg-bg-2/35 px-4 py-3">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">
                    Role of the Human
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-fg-2">
                    {stage.humanRole}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                  stage.id === "naive-agent"
                    ? "border-danger/45 bg-danger/[0.06]"
                    : stage.id === "governed-manager"
                      ? "border-signal/45 bg-signal/[0.06]"
                      : "border-line bg-bg-2/35"
                }`}
              >
                {stage.id === "governed-manager" ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={1.85} aria-hidden="true" />
                ) : (
                  <AlertTriangle
                    className={`mt-0.5 size-4 shrink-0 ${
                      stage.id === "naive-agent" ? "text-danger" : "text-accent"
                    }`}
                    strokeWidth={1.85}
                    aria-hidden="true"
                  />
                )}
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">
                    {stage.id === "governed-manager"
                      ? "Fail-Closed Guarantee"
                      : "Architectural Failure Mode"}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-fg-2">
                    {stage.failureMode}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <figcaption className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption ||
          "Select each stage to compare how authority, credentials, and failure modes shift from passive RAG chatbots to a governed enterprise AI manager."}
      </figcaption>
    </figure>
  );
}
