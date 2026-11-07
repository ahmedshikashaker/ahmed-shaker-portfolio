"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  Check,
  ChevronRight,
  Clock,
  FileCode2,
  Lock,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  SkipForward,
  UserCheck,
  Zap,
} from "lucide-react";
import {
  EXECUTION_JOURNEY_STAGES,
  JOURNEY_SCENARIOS,
  type JourneyScenarioId,
  type ScenarioStageDetail,
} from "./aiGovernanceModel";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * Flagship Interactive Simulator:
 * User Request -> Identity -> Pre-Filter -> Grounding -> Plan DAG -> Policy & Schema
 * -> Risk Gate (Confirm/Approve) -> Signed Execution Grant -> Idempotent Activity -> Hash-Chained Audit.
 *
 * Includes 4 enterprise scenarios (R1, R2, R3, Adversarial R4 Block) plus 3 live fault/security toggles
 * (Role Revoked Before Execution, Target Mutated During Confirmation, Network Timeout After Dispatch).
 */
export default function ExecutionJourneyLab({
  initialScenario = "r2-leave-dag",
  caption,
}: {
  initialScenario?: JourneyScenarioId;
  caption?: string;
}) {
  const [scenarioId, setScenarioId] = useState<JourneyScenarioId>(initialScenario);
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [runningIdx, setRunningIdx] = useState<number | null>(null);
  const [completedUpTo, setCompletedUpTo] = useState<number>(8);

  // Live security & reliability perturbation toggles
  const [revokeBeforeGrant, setRevokeBeforeGrant] = useState(false);
  const [staleResource, setStaleResource] = useState(false);
  const [timeoutAfterDispatch, setTimeoutAfterDispatch] = useState(false);

  const timerRef = useRef<number | null>(null);
  const reduced = useReducedMotionAfterMount();

  const baseScenario = useMemo(
    () => JOURNEY_SCENARIOS.find((s) => s.id === scenarioId) ?? JOURNEY_SCENARIOS[1],
    [scenarioId]
  );

  // Compute effective stage details when runtime perturbations are toggled
  const effectiveScenario = useMemo(() => {
    const stages: Record<string, ScenarioStageDetail> = { ...baseScenario.stages };
    let stoppedAtStage = baseScenario.stoppedAtStage;
    let outcomeSummary = baseScenario.outcomeSummary;

    if (baseScenario.id !== "adversarial-block") {
      if (staleResource && (baseScenario.id === "r2-leave-dag" || baseScenario.id === "r3-payroll")) {
        stoppedAtStage = 7;
        outcomeSummary =
          "Blocked at Stage 7 (Execution-Time Reauthorization): target resource version drifted after the proposal was displayed. Confirmation invalidated (PROPOSAL_INVALIDATED) to prevent acting on stale state.";
        stages.grant = {
          status: "blocked",
          headline: "STALE RESOURCE DETECTED: Target version changed since proposal display",
          detail:
            "Expected resource version (bal_v74 / employee:74) no longer matches live state. Control plane refuses to sign SignedExecutionGrant and returns 409 PROPOSAL_INVALIDATED.",
          contractSnippet: `{
  "error": {
    "code": "PROPOSAL_INVALIDATED",
    "message": "The target or policy changed. Review a new proposal before continuing.",
    "retryable": false,
    "details": [{ "pointer": "/expectedVersion", "reason": "stale_resource" }]
  }
}`,
          latencyLabel: "14 ms (Refused)",
        };
        stages.execution = {
          status: "blocked",
          headline: "Never dispatched — stale proposal blocked before worker grant",
          detail: "No network call is made when the underlying resource state changes beneath a human confirmation.",
          contractSnippet: `// Blocked at Stage 7 (stale_resource guard)`,
          latencyLabel: "—",
        };
      } else if (revokeBeforeGrant) {
        stoppedAtStage = 7;
        outcomeSummary =
          "Blocked at Stage 7 (Execution-Time Reauthorization): although planning was allowed at Stage 2, the principal’s role or policy was revoked before execution. Zero grants issued.",
        stages.grant = {
          status: "blocked",
          headline: "EXECUTION REAUTHORIZATION DENIED: Role/policy revoked after planning",
          detail:
            "Continuous authorization invariant: an earlier allow never guarantees a later allow. Fresh OPA check at grant issuance denies the operation.",
          contractSnippet: `{
  "allow": false,
  "decisionId": "opa_dec_revoked_904",
  "reasonCode": "PRINCIPAL_PERMISSION_REVOKED_BEFORE_EXECUTION",
  "grantIssued": false
}`,
          latencyLabel: "16 ms (Denied)",
        };
        stages.execution = {
          status: "blocked",
          headline: "Never dispatched — worker receives denial instead of SignedExecutionGrant",
          detail: "Without a signed grant, the execution worker cannot resolve secret references or open a socket.",
          contractSnippet: `// Blocked at Stage 7 (Execution Reauthorization)`,
          latencyLabel: "—",
        };
      } else if (timeoutAfterDispatch && (baseScenario.id === "r2-leave-dag" || baseScenario.id === "r3-payroll")) {
        outcomeSummary =
          "Protected at Stage 8 (Outcome-Unknown Reconciliation): network timed out after request dispatch. Automated mutation retry is 0; operation enters outcome_unknown and reconciles by idempotency key without duplicating the write.";
        stages.execution = {
          status: "reconcile",
          headline: "TIMEOUT AFTER NETWORK FENCE → Enters outcome_unknown reconciliation",
          detail:
            "Because afterDispatchMaximumAttempts = 0 for mutations, the worker refuses to blindly re-POST. It invokes reconcileActionRef with the original idempotency key.",
          contractSnippet: `{
  "operationId": "op_0192_mutation",
  "status": "outcome_unknown -> reconciling",
  "afterDispatchRetry": 0,
  "reconcileBy": "idempotencyKey (ik_0192_88a1)",
  "duplicateSideEffects": 0
}`,
          latencyLabel: "20,000 ms (Timeout → Reconcile)",
        };
      }
    }

    return { ...baseScenario, stages, stoppedAtStage, outcomeSummary };
  }, [baseScenario, revokeBeforeGrant, staleResource, timeoutAfterDispatch]);

  function stopTimer() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setRunningIdx(null);
  }

  useEffect(() => stopTimer, []);

  // When scenario or fault toggles change, focus the most relevant stage
  useEffect(() => {
    stopTimer();
    if (effectiveScenario.stoppedAtStage) {
      const stopIdx = effectiveScenario.stoppedAtStage - 1;
      setCompletedUpTo(stopIdx);
      setSelectedStageIdx(stopIdx);
    } else if (timeoutAfterDispatch && (scenarioId === "r2-leave-dag" || scenarioId === "r3-payroll")) {
      setCompletedUpTo(8);
      setSelectedStageIdx(7); // Stage 8 (index 7)
    } else {
      setCompletedUpTo(8);
      setSelectedStageIdx(scenarioId === "r1-read" ? 2 : 5);
    }
  }, [scenarioId, revokeBeforeGrant, staleResource, timeoutAfterDispatch, effectiveScenario.stoppedAtStage]);

  function runSimulation() {
    stopTimer();
    const maxIdx = effectiveScenario.stoppedAtStage ? effectiveScenario.stoppedAtStage - 1 : 8;
    if (reduced) {
      setCompletedUpTo(maxIdx);
      setSelectedStageIdx(maxIdx);
      return;
    }
    let idx = 0;
    setRunningIdx(0);
    setSelectedStageIdx(0);
    setCompletedUpTo(0);

    const tick = () => {
      timerRef.current = window.setTimeout(() => {
        idx += 1;
        if (idx <= maxIdx) {
          setRunningIdx(idx);
          setSelectedStageIdx(idx);
          setCompletedUpTo(idx);
          tick();
        } else {
          setRunningIdx(null);
        }
      }, 620);
    };
    tick();
  }

  const activeStageSpec = EXECUTION_JOURNEY_STAGES[selectedStageIdx] ?? EXECUTION_JOURNEY_STAGES[0];
  const activeDetail = effectiveScenario.stages[activeStageSpec.id];

  const zoneBadge = {
    deterministic: "border-signal/45 bg-signal/10 text-signal",
    "untrusted-ai": "border-amber-400/45 bg-amber-400/10 text-amber-600 dark:text-amber-300",
    "human-governance": "border-accent/55 bg-accent/12 text-accent",
    "isolated-worker": "border-sky-400/45 bg-sky-400/10 text-sky-600 dark:text-sky-300",
  }[activeStageSpec.trustZone];

  const zoneLabel = {
    deterministic: "Deterministic Control Zone (Control Plane / Policy / Relational State)",
    "untrusted-ai": "Untrusted AI Runtime Zone (Isolated Planner / Zero Secrets)",
    "human-governance": "Human Governance & Segregated Approval Gate",
    "isolated-worker": "Isolated Durable Execution Worker (Grant-Verified)",
  }[activeStageSpec.trustZone];

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="eyebrow text-fg-3">
              Interactive Execution Simulator · From Natural-Language Intent to Governed Action
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runSimulation}
              disabled={runningIdx !== null}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Play className="size-3" strokeWidth={2.2} aria-hidden="true" />
              {runningIdx !== null ? "Tracing execution…" : "Trace 9-stage journey"}
            </button>
            <button
              type="button"
              onClick={() => {
                stopTimer();
                setScenarioId("r2-leave-dag");
                setRevokeBeforeGrant(false);
                setStaleResource(false);
                setTimeoutAfterDispatch(false);
              }}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
            >
              <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> Reset
            </button>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="border-b border-line bg-bg-2/40 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-4">
              Select Enterprise Scenario
            </span>
            <span className="font-mono text-[11px] text-fg-3">{effectiveScenario.actorSummary}</span>
          </div>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Execution scenarios">
            {JOURNEY_SCENARIOS.map((item) => {
              const selected = item.id === scenarioId;
              const isBlock = item.id === "adversarial-block";
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setScenarioId(item.id)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-start transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                    selected
                      ? isBlock
                        ? "border-danger bg-danger/[0.09]"
                        : "border-accent bg-accent/[0.09]"
                      : "border-line-2 bg-surface hover:border-line-3"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-semibold uppercase tracking-wider ${
                      isBlock
                        ? "text-danger"
                        : item.riskTier === "R3"
                          ? "text-accent"
                          : "text-signal"
                    }`}
                  >
                    {item.badge}
                  </span>
                  <span className="mt-1 text-[13px] font-semibold leading-snug text-fg">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prompt & Perturbation Switches */}
          <div className="mt-3.5 flex flex-col justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                Inbound User Turn
              </span>
              <p className="mt-0.5 font-display text-[1.08rem] italic text-fg">
                {effectiveScenario.userPrompt}
              </p>
            </div>
            {scenarioId !== "adversarial-block" && (
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4 me-1">
                  Inject Fault:
                </span>
                <button
                  type="button"
                  aria-pressed={revokeBeforeGrant}
                  onClick={() => {
                    setRevokeBeforeGrant((v) => !v);
                    setStaleResource(false);
                  }}
                  className={`rounded-full border px-2.5 py-1 text-[11.5px] transition-colors ${
                    revokeBeforeGrant
                      ? "border-danger bg-danger/15 text-danger font-medium"
                      : "border-line-2 text-fg-3 hover:text-fg"
                  }`}
                >
                  Revoke role pre-grant
                </button>
                {(scenarioId === "r2-leave-dag" || scenarioId === "r3-payroll") && (
                  <>
                    <button
                      type="button"
                      aria-pressed={staleResource}
                      onClick={() => {
                        setStaleResource((v) => !v);
                        setRevokeBeforeGrant(false);
                      }}
                      className={`rounded-full border px-2.5 py-1 text-[11.5px] transition-colors ${
                        staleResource
                          ? "border-danger bg-danger/15 text-danger font-medium"
                          : "border-line-2 text-fg-3 hover:text-fg"
                      }`}
                    >
                      Stale target version
                    </button>
                    <button
                      type="button"
                      aria-pressed={timeoutAfterDispatch}
                      onClick={() => {
                        setTimeoutAfterDispatch((v) => !v);
                        setRevokeBeforeGrant(false);
                        setStaleResource(false);
                      }}
                      className={`rounded-full border px-2.5 py-1 text-[11.5px] transition-colors ${
                        timeoutAfterDispatch
                          ? "border-accent bg-accent/15 text-accent font-medium"
                          : "border-line-2 text-fg-3 hover:text-fg"
                      }`}
                    >
                      Timeout after dispatch
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 9-Stage Horizontal / Responsive Pipeline */}
        <div className="px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="eyebrow text-fg-4">
              9-Stage Governed Execution Pipeline (Click any stage to inspect contract)
            </span>
            <span className="font-mono text-[11px] text-fg-3">
              Stage {selectedStageIdx + 1} of {EXECUTION_JOURNEY_STAGES.length}
            </span>
          </div>

          <ol className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
            {EXECUTION_JOURNEY_STAGES.map((stage, idx) => {
              const detail = effectiveScenario.stages[stage.id];
              const isSelected = idx === selectedStageIdx;
              const isRunningHere = idx === runningIdx;
              const isReached = idx <= completedUpTo;

              const statusTone =
                detail.status === "blocked"
                  ? "border-danger/65 bg-danger/[0.08] text-danger"
                  : detail.status === "reconcile"
                    ? "border-accent/65 bg-accent/[0.1] text-accent"
                    : detail.status === "gate"
                      ? "border-accent/60 bg-accent/[0.08] text-accent"
                      : detail.status === "skipped"
                        ? "border-line-2 bg-bg-2/40 text-fg-4"
                        : isReached
                          ? "border-signal/55 bg-signal/[0.07] text-signal"
                          : "border-line-2 bg-surface text-fg-3";

              return (
                <li key={stage.id} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      stopTimer();
                      setSelectedStageIdx(idx);
                    }}
                    className={`group flex h-full w-full flex-col justify-between rounded-xl border p-2.5 text-start transition-all focus-visible:outline-2 focus-visible:outline-accent ${statusTone} ${
                      isSelected
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-[var(--c-surface)]"
                        : "hover:border-line-3"
                    } ${isRunningHere ? "scale-[1.03]" : ""}`}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-semibold">
                        0{stage.index}
                      </span>
                      {detail.status === "blocked" ? (
                        <AlertOctagon className="size-3.5 shrink-0 text-danger" strokeWidth={2} />
                      ) : detail.status === "reconcile" ? (
                        <RefreshCw className="size-3.5 shrink-0 text-accent" strokeWidth={2} />
                      ) : detail.status === "gate" ? (
                        <UserCheck className="size-3.5 shrink-0 text-accent" strokeWidth={2} />
                      ) : detail.status === "skipped" ? (
                        <SkipForward className="size-3.5 shrink-0 text-fg-4" strokeWidth={1.75} />
                      ) : (
                        <Check className="size-3.5 shrink-0 text-signal" strokeWidth={2.2} />
                      )}
                    </div>
                    <p className="mt-2 text-[12px] font-semibold leading-tight text-fg">
                      {stage.shortName.replace(/^\d+\.\s*/, "")}
                    </p>
                    <span className="mt-1 block truncate font-mono text-[9.5px] text-fg-4">
                      {stage.owner}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Active Stage Inspector Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${effectiveScenario.id}-${activeStageSpec.id}-${revokeBeforeGrant}-${staleResource}-${timeoutAfterDispatch}`}
              initial={reduced ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-5 grid gap-5 rounded-xl border border-line-2 bg-bg-2/55 p-4 sm:p-5 lg:grid-cols-12"
            >
              {/* Left column: Stage explanation & invariant */}
              <div className="flex flex-col justify-between lg:col-span-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] ${zoneBadge}`}>
                      {zoneLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-fg-4">
                      <Clock className="size-3" strokeWidth={1.75} aria-hidden="true" />
                      {activeDetail.latencyLabel}
                    </span>
                  </div>

                  <h4 className="mt-3 font-display text-[1.35rem] leading-snug text-fg">
                    Stage {activeStageSpec.index}: {activeStageSpec.title}
                  </h4>

                  <p
                    className={`mt-2 text-[13.5px] font-semibold leading-snug ${
                      activeDetail.status === "blocked"
                        ? "text-danger"
                        : activeDetail.status === "gate" || activeDetail.status === "reconcile"
                          ? "text-accent"
                          : "text-signal"
                    }`}
                  >
                    {activeDetail.headline}
                  </p>

                  <p className="mt-2 text-[13.5px] leading-relaxed text-fg-2">
                    {activeDetail.detail}
                  </p>
                </div>

                <div className="mt-4 rounded-lg border border-line bg-surface px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                    <Lock className="size-3" strokeWidth={2} aria-hidden="true" />
                    Architectural Invariant
                  </div>
                  <p className="mt-1 text-[12.5px] leading-snug text-fg-2">
                    {activeStageSpec.invariant}
                  </p>
                </div>
              </div>

              {/* Right column: Live Contract / Payload Inspector */}
              <div className="flex flex-col justify-between rounded-xl border border-line-2 bg-surface p-4 lg:col-span-6">
                <div className="flex items-center justify-between border-b border-line pb-2.5">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-3">
                    <FileCode2 className="size-3.5 text-accent" strokeWidth={1.75} aria-hidden="true" />
                    Deterministic Contract / State Snapshot
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                    {activeStageSpec.owner}
                  </span>
                </div>
                <pre className="mt-3 overflow-x-auto font-mono text-[12px] leading-relaxed text-fg-2">
                  <code>{activeDetail.contractSnippet}</code>
                </pre>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                  <button
                    type="button"
                    disabled={selectedStageIdx === 0}
                    onClick={() => setSelectedStageIdx((i) => Math.max(0, i - 1))}
                    className="text-[12px] font-medium text-fg-3 hover:text-fg disabled:opacity-40"
                  >
                    ← Previous stage
                  </button>
                  <button
                    type="button"
                    disabled={selectedStageIdx === EXECUTION_JOURNEY_STAGES.length - 1}
                    onClick={() =>
                      setSelectedStageIdx((i) => Math.min(EXECUTION_JOURNEY_STAGES.length - 1, i + 1))
                    }
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:opacity-85 disabled:opacity-40"
                  >
                    Next stage <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Outcome Summary Footer */}
        <div
          className={`flex flex-wrap items-start justify-between gap-4 border-t border-line px-5 py-4 sm:px-6 ${
            effectiveScenario.stoppedAtStage
              ? "bg-danger/[0.06]"
              : timeoutAfterDispatch && (scenarioId === "r2-leave-dag" || scenarioId === "r3-payroll")
                ? "bg-accent/[0.06]"
                : "bg-signal/[0.05]"
          }`}
        >
          <div className="flex items-start gap-3 max-w-3xl">
            {effectiveScenario.stoppedAtStage ? (
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={1.85} aria-hidden="true" />
            ) : timeoutAfterDispatch && (scenarioId === "r2-leave-dag" || scenarioId === "r3-payroll") ? (
              <Zap className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.85} aria-hidden="true" />
            ) : (
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-signal" strokeWidth={1.85} aria-hidden="true" />
            )}
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-4">
                End-to-End Execution Outcome
              </span>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-fg-2">
                {effectiveScenario.outcomeSummary}
              </p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption ||
          "Switch between R1, R2, R3, and adversarial scenarios—or inject runtime faults like pre-grant role revocation and post-dispatch timeouts—to see how each stage enforces deterministic authority."}
      </figcaption>
    </figure>
  );
}
