"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Play,
} from "lucide-react";

interface PlannerNodeSpec {
  index: number;
  id: string;
  label: string;
  plane: "planner" | "control-plane" | "worker";
  role: string;
  inputs: string;
  outputs: string;
  dbState: string;
  boundRule: string;
}

const PLANNER_10_STAGES: PlannerNodeSpec[] = [
  {
    index: 1,
    id: "context_hydration",
    label: "1. Context Hydration",
    plane: "planner",
    role: "Hydrate verified principal metadata, conversation state, and turn budgets from the control-plane envelope.",
    inputs: "turnId, conversationId, principalContext, budgetCaps",
    outputs: "TurnState initialized (zero secrets)",
    dbState: "Isolated Checkpoint Store (turn start)",
    boundRule: "Max 1 active turn per conversation advisory lock",
  },
  {
    index: 2,
    id: "intent_triage",
    label: "2. Intent Triage",
    plane: "planner",
    role: "Classify user intent into informational (R0), single-action, or multi-action DAG orchestration.",
    inputs: "Normalized user message + conversation summary",
    outputs: "IntentClassification { needsKnowledge, needsCapabilities }",
    dbState: "Isolated Checkpoint Store (stage 2)",
    boundRule: "Fast path skips capability ranking if purely conversational",
  },
  {
    index: 3,
    id: "scoped_retrieval",
    label: "3. Scoped Retrieval",
    plane: "control-plane",
    role: "Request brokered hybrid search via the control plane using a 60s cryptographically signed retrieval scope.",
    inputs: "Query + Signed Retrieval Scope",
    outputs: "Reauthorized, delimited evidence snippets",
    dbState: "Retrieval Audit Log",
    boundRule: "Two-step citation release re-verified against live ACLs",
  },
  {
    index: 4,
    id: "capability_prefilter",
    label: "4. Capability Pre-Filter",
    plane: "control-plane",
    role: "Fetch policy-filtered Capability Contracts ranked for current intent.",
    inputs: "Principal role allow-set + semantic query",
    outputs: "Top-K authorized Capability Contracts (no contextInjectedFields)",
    dbState: "Capability Catalog (read-only)",
    boundRule: "Unpublished or R4-quarantined tools never enter context",
  },
  {
    index: 5,
    id: "plan_dag_synthesis",
    label: "5. Plan DAG Synthesis",
    plane: "planner",
    role: "Synthesize a typed, bounded Action DAG with JSONPath result bindings and preconditions.",
    inputs: "Authorized Capability Contracts + evidence",
    outputs: "ProposedPlanDAG { bounded nodes & serialized writes }",
    dbState: "Isolated Checkpoint Store (draft_plan)",
    boundRule: "Hard cap on total nodes, write mutations, and parallel writes (= 1)",
  },
  {
    index: 6,
    id: "deterministic_validation",
    label: "6. Deterministic Validation",
    plane: "control-plane",
    role: "Deterministic control-plane validation of JSON Schema, DAG acyclicity, and RBAC/ABAC policy.",
    inputs: "ProposedPlanDAG",
    outputs: "ValidatedProposal or deterministic schema error feedback",
    dbState: "Action Proposals Store",
    boundRule: "Max 1 schema repair loop (prevents infinite model retries)",
  },
  {
    index: 7,
    id: "risk_approval_gate",
    label: "7. Risk & Approval Gate",
    plane: "control-plane",
    role: "Evaluate R0–R4 risk gate; suspend turn checkpoint if R2 confirmation or R3 quorum approval is needed.",
    inputs: "Effective Risk Tier (most-restrictive rule)",
    outputs: "Signed Execution Grant or ApprovalPending interrupt",
    dbState: "Approvals & Grants Store",
    boundRule: "Graph suspends cleanly without holding threads or locks",
  },
  {
    index: 8,
    id: "grant_verified_dispatch",
    label: "8. Grant-Verified Dispatch",
    plane: "worker",
    role: "Durable execution worker verifies grant digests, dispatches connector call, and returns redacted projection.",
    inputs: "Signed Execution Grant + deterministic idempotencyKey",
    outputs: "Redacted OperationResult or post-timeout reconciliation state",
    dbState: "Operations & Append-Only Audit",
    boundRule: "Pre-dispatch verifier checks all canonical SHA-256 digests pre-I/O",
  },
  {
    index: 9,
    id: "precondition_evaluation",
    label: "9. Precondition Check",
    plane: "planner",
    role: "Evaluate downstream DAG preconditions against step outputs; advance to next node or halt on failure.",
    inputs: "Redacted OperationResult + JSONPath preconditions",
    outputs: "Next ready DAG node or terminal synthesis state",
    dbState: "Isolated Checkpoint Store (stage 9)",
    boundRule: "Halt immediately if any mutation enters outcome reconciliation",
  },
  {
    index: 10,
    id: "grounded_synthesis",
    label: "10. Grounded Synthesis",
    plane: "planner",
    role: "Compose grounded user response citing verified operation receipts and knowledge evidence IDs.",
    inputs: "Completed operation receipts + authorized citations",
    outputs: "Final assistant response + distributed trace correlation",
    dbState: "Conversation Turns & Audit Ledger",
    boundRule: "PII & secret scrubber verifies output before stream release",
  },
];

export default function HybridOrchestrationLab() {
  const [activeIndex, setActiveIndex] = useState<number>(4);
  const [simulateTimeout, setSimulateTimeout] = useState<boolean>(false);

  const activeNode = PLANNER_10_STAGES[activeIndex] ?? PLANNER_10_STAGES[0];

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
      {/* Header */}
      <div className="border-b border-line bg-bg-2/50 px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-accent">Two-Engine Orchestration Explorer · Reasoning vs. Durable Execution</span>
            <h3 className="mt-1 font-display text-[1.45rem] leading-tight text-fg">
              Bounded State-Graph Planner Handshake with Durable Workflow Workers
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % PLANNER_10_STAGES.length)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 font-mono text-[11px] font-semibold text-on-accent transition-opacity hover:opacity-90"
            >
              <Play className="size-3" /> Next Stage ({activeNode.index}/10)
            </button>
          </div>
        </div>

        {/* Bounded DAG Invariants Strip */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Bounded Plan Nodes", value: "Capped DAG", note: "Prevents runaway graphs" },
            { label: "Write Mutations", value: "Bounded Cap", note: "Controlled blast radius" },
            { label: "Parallel Mutations", value: "Width = 1", note: "Strictly serialized writes" },
            { label: "Schema Repair Cap", value: "Max 1 retry", note: "No infinite LLM loops" },
          ].map((b) => (
            <div key={b.label} className="rounded-xl border border-line bg-surface/80 px-3 py-2">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-fg-4">{b.label}</span>
              <span className="mt-0.5 block font-display text-[1.15rem] font-semibold text-accent">{b.value}</span>
              <span className="block text-[11px] text-fg-3">{b.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 10-Stage Interactive Grid */}
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 text-[11.5px] font-mono text-fg-3">
          <span>Click any stage in the explicit turn graph to inspect its trust zone and state boundary:</span>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-accent" /> Reasoning Runtime (Untrusted Planner)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-signal" /> Control Plane (Authoritative PEP)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-400" /> Durable Worker (Grant-Verified)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {PLANNER_10_STAGES.map((node, idx) => {
            const isSelected = idx === activeIndex;
            const planeBadge =
              node.plane === "planner"
                ? "border-accent/40 bg-accent/10 text-accent"
                : node.plane === "control-plane"
                  ? "border-signal/40 bg-signal/10 text-signal"
                  : "border-amber-400/40 bg-amber-400/10 text-amber-500";

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/[0.12] shadow-sm ring-1 ring-accent"
                    : "border-line bg-bg-2/35 hover:border-line-3"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[10px] font-semibold text-fg-4">S0{node.index}</span>
                  <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ${planeBadge}`}>
                    {node.plane === "planner" ? "Planner" : node.plane === "control-plane" ? "PEP" : "Worker"}
                  </span>
                </div>
                <p className="mt-2 truncate font-mono text-[11.5px] font-semibold text-fg">
                  {node.label.replace(/^\d+\.\s*/, "")}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Inspector */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="mt-5 rounded-xl border border-line-2 bg-bg-2/45 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                  Stage {activeNode.index} of 10 · {activeNode.plane.toUpperCase()} ZONE
                </span>
                <h4 className="mt-0.5 font-mono text-[1.15rem] font-semibold text-fg">{activeNode.label}</h4>
              </div>
              <span className="rounded-full border border-line-2 bg-surface px-3 py-1 font-mono text-[11px] text-fg-2">
                State Boundary: {activeNode.dbState}
              </span>
            </div>

            <p className="mt-3 text-[13.5px] leading-relaxed text-fg-2">{activeNode.role}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-line bg-surface p-3">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-fg-4">Stage Inputs</span>
                <span className="mt-1 block font-mono text-[11.5px] text-fg-2">{activeNode.inputs}</span>
              </div>
              <div className="rounded-lg border border-line bg-surface p-3">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-fg-4">Stage Outputs</span>
                <span className="mt-1 block font-mono text-[11.5px] text-fg-2">{activeNode.outputs}</span>
              </div>
              <div className="rounded-lg border border-accent/35 bg-accent/[0.06] p-3">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-accent">
                  Deterministic Guardrail
                </span>
                <span className="mt-1 block font-mono text-[11.5px] font-medium text-fg">{activeNode.boundRule}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Post-Fence Timeout Simulator */}
        <div className="mt-5 rounded-xl border border-line-2 bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-fg-4">
                Post-Fence Network Fault Simulator · Preventing Duplicate Mutations
              </span>
              <h4 className="mt-0.5 font-display text-[1.15rem] text-fg">
                What happens if the target API times out after the request leaves the worker?
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSimulateTimeout((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold transition-colors ${
                simulateTimeout
                  ? "border-amber-400 bg-amber-400/15 text-amber-500"
                  : "border-line-2 bg-bg-2 text-fg-2 hover:border-accent"
              }`}
            >
              <AlertTriangle className="size-3.5" />
              {simulateTimeout ? "Timeout Fault Active (504 Gateway Timeout)" : "Simulate Post-Dispatch HTTP Timeout"}
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-signal/40 bg-signal/[0.05] p-3">
              <span className="font-mono text-[10px] uppercase text-signal">1. Pre-Send Fence</span>
              <p className="mt-1 text-[12px] text-fg-2">
                State store records <code className="font-mono text-[11px]">state=dispatched</code> + SHA-256{" "}
                <code className="font-mono text-[11px]">idempotencyKey</code> before socket write.
              </p>
            </div>
            <div
              className={`rounded-lg border p-3 ${
                simulateTimeout
                  ? "border-danger/50 bg-danger/10"
                  : "border-signal/40 bg-signal/[0.05]"
              }`}
            >
              <span className={`font-mono text-[10px] uppercase ${simulateTimeout ? "text-danger" : "text-signal"}`}>
                2. External Connector I/O
              </span>
              <p className="mt-1 text-[12px] text-fg-2">
                {simulateTimeout
                  ? "504 Timeout at 10.0s! Remote ERP may or may not have committed the write."
                  : "200 OK returned with externalReceiptId within 420ms."}
              </p>
            </div>
            <div
              className={`rounded-lg border p-3 ${
                simulateTimeout
                  ? "border-amber-400/50 bg-amber-400/10"
                  : "border-line bg-bg-2/40"
              }`}
            >
              <span className="font-mono text-[10px] uppercase text-accent">3. State Transition</span>
              <p className="mt-1 text-[12px] text-fg-2">
                {simulateTimeout
                  ? "Operation locked in Indeterminate Outcome Quarantine. Blind automatic retry is strictly forbidden."
                  : "Operation transitions cleanly to status = 'succeeded'."}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-bg-2/40 p-3">
              <span className="font-mono text-[10px] uppercase text-fg-3">4. Reconciliation</span>
              <p className="mt-1 text-[12px] text-fg-2">
                {simulateTimeout
                  ? "Worker runs read-after-timeout query by idempotencyKey (or holds for operator resolution) before resuming DAG."
                  : "Redacted result bound to downstream DAG nodes."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
