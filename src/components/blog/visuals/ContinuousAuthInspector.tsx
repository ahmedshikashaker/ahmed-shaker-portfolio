"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  KeyRound,
  XCircle,
} from "lucide-react";

interface AuthStageSpec {
  stage: number;
  title: string;
  timing: string;
  enforcer: string;
  questionAnswered: string;
  mechanism: string;
  attackPrevented: string;
}

const SEVEN_AUTH_STAGES: AuthStageSpec[] = [
  {
    stage: 1,
    title: "Session & Principal Verification",
    timing: "Turn Ingress (0ms)",
    enforcer: "Control Plane (Identity Guard)",
    questionAnswered: "Is the human caller authenticated, active, and operating within a valid revocation epoch?",
    mechanism:
      "Validates OIDC JWT signature, tenant, department, role bindings, and checks live revocation epoch in the state store.",
    attackPrevented: "Forged identity headers, expired sessions, or replayed bearer tokens.",
  },
  {
    stage: 2,
    title: "Hard Capability Pre-Filter",
    timing: "Pre-Discovery (~15ms)",
    enforcer: "Control Plane + Policy Engine",
    questionAnswered: "Which catalog capabilities is this principal allowed to even know exist?",
    mechanism:
      "Computes deterministic RBAC/ABAC allow-set before semantic top-K ranking; strips all R4 and unauthorized tools.",
    attackPrevented: "Prompt-injected discovery or hallucinated invocation of restricted admin capabilities.",
  },
  {
    stage: 3,
    title: "Brokered RAG Signed Scope",
    timing: "Knowledge Query (~40ms)",
    enforcer: "Control Plane → Retrieval Engine",
    questionAnswered: "Which knowledge spaces and sensitivity tiers may this specific turn query?",
    mechanism:
      "Mints a 60-second cryptographically signed retrieval scope verified against live session ownership.",
    attackPrevented: "Direct vector DB queries from a compromised planner or cross-tenant embedding bleed.",
  },
  {
    stage: 4,
    title: "Two-Step Citation Release Re-Auth",
    timing: "Post-Retrieval (~95ms)",
    enforcer: "Control Plane (Evidence Broker)",
    questionAnswered: "Are the matched document versions still authorized for release into the prompt right now?",
    mechanism:
      "Re-verifies matched document IDs and live ACLs before releasing snippet text to the reasoning runtime.",
    attackPrevented: "Stale cache hits serving documents whose permissions were revoked mid-session.",
  },
  {
    stage: 5,
    title: "Context-Injected Fields & Ownership Check",
    timing: "Proposal Validation (~180ms)",
    enforcer: "Control Plane (Proposal Validator)",
    questionAnswered: "Does the caller own the target resource, and who supplies principal-identifying parameters?",
    mechanism:
      "Strips context-injected fields (e.g., employeeId, tenantId) from LLM output and binds verified caller claims.",
    attackPrevented: "BOLA / IDOR parameter smuggling where an LLM fills another user's ID.",
  },
  {
    stage: 6,
    title: "Pre-Grant Live Principal Re-Verification",
    timing: "Post-Approval / Pre-Grant",
    enforcer: "Control Plane (Grant Issuer)",
    questionAnswered: "Did the requester's role or target resource ETag change while waiting for R2/R3 approval?",
    mechanism:
      "Re-evaluates policy against live identity state and expectedTargetVersion immediately before minting grant.",
    attackPrevented: "Time-of-check to time-of-use (TOCTOU) privilege escalation during async approval windows.",
  },
  {
    stage: 7,
    title: "Single-Attempt Signed Execution Grant Check",
    timing: "Worker Pre-Dispatch (Millisecond of I/O)",
    enforcer: "Durable Execution Worker",
    questionAnswered: "Is every byte of input, connector contract, egress policy, and authority cryptographically intact?",
    mechanism:
      "Pre-dispatch verifier validates cryptographic signature over canonical JSON payload and all SHA-256 contract digests.",
    attackPrevented: "Payload tampering between control plane and worker, replay attacks, or connector drift.",
  },
];

const GRANT_DIGEST_FIELDS = [
  { field: "capabilityVersion", value: "leave.request.create@v5", hash: "sha256:9f84c2...18a0" },
  { field: "resolvedInputHash", value: '{"days":4,"employeeId":"emp-1042","startDate":"2026-11-08"}', hash: "sha256:4b21e8...77d1" },
  { field: "contractDigest", value: "hrms-openapi-v3.2-rev9", hash: "sha256:c019a4...55e9" },
  { field: "authorityHash", value: "actor:emp-1042|approver:mgr-0210|tier:R2", hash: "sha256:7d12f0...91b4" },
  { field: "egressPolicyHash", value: "allow:https://hrms.internal.corp:443/v2/*", hash: "sha256:e830b1...30c2" },
  { field: "resultPolicyHash", value: "redact:[nationalId,salaryBand,bankIban]", hash: "sha256:2a67d9...84f3" },
];

export default function ContinuousAuthInspector() {
  const [selectedStage, setSelectedStage] = useState<number>(6);
  const [tamperInput, setTamperInput] = useState<boolean>(false);

  const active = SEVEN_AUTH_STAGES[selectedStage] ?? SEVEN_AUTH_STAGES[0];

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
      {/* Header */}
      <div className="border-b border-line bg-bg-2/50 px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-accent">7-Stage Continuous Authorization · Zero-Trust Agent Execution</span>
            <h3 className="mt-1 font-display text-[1.45rem] leading-tight text-fg">
              Why One Login Check Is Never Enough for Autonomous Execution
            </h3>
          </div>
          <span className="rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[11px] text-signal">
            Zero Ambient Credentials in Planner
          </span>
        </div>

        {/* 7 Stage Stepper */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-7">
          {SEVEN_AUTH_STAGES.map((s, idx) => {
            const isSelected = idx === selectedStage;
            return (
              <button
                key={s.stage}
                type="button"
                onClick={() => setSelectedStage(idx)}
                className={`flex flex-col justify-between rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/15 shadow-sm ring-1 ring-accent"
                    : "border-line bg-surface/80 hover:border-line-3"
                }`}
              >
                <span className="font-mono text-[10px] font-semibold text-accent">Stage {s.stage}</span>
                <span className="mt-1 line-clamp-2 text-[11.5px] font-medium leading-tight text-fg">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail */}
      <div className="p-5 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.stage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl border border-line-2 bg-bg-2/45 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div>
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent">
                  Authorization Gate {active.stage} of 7 · {active.timing}
                </span>
                <h4 className="mt-0.5 font-display text-[1.3rem] text-fg">{active.title}</h4>
              </div>
              <span className="rounded-full border border-line-2 bg-surface px-3 py-1 font-mono text-[11px] text-fg-2">
                Enforced by: {active.enforcer}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-line bg-surface p-3.5">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-fg-4">
                  Security Question Answered
                </span>
                <p className="mt-1 text-[12.5px] font-medium leading-snug text-fg">{active.questionAnswered}</p>
              </div>
              <div className="rounded-lg border border-signal/35 bg-signal/[0.05] p-3.5">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-signal">
                  Deterministic Mechanism
                </span>
                <p className="mt-1 text-[12.5px] leading-snug text-fg-2">{active.mechanism}</p>
              </div>
              <div className="rounded-lg border border-danger/35 bg-danger/[0.05] p-3.5">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-danger">
                  Attack Class Eliminated
                </span>
                <p className="mt-1 text-[12.5px] leading-snug text-fg-2">{active.attackPrevented}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Interactive Signed Execution Grant Inspector */}
        <div className="mt-5 rounded-xl border border-line-2 bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent">
                Cryptographic Dispatch Inspector · Pre-Dispatch Verification
              </span>
              <h4 className="mt-0.5 font-display text-[1.2rem] text-fg">
                Canonical <code className="font-mono text-[1rem]">SignedExecutionGrant</code> Digest Verification
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setTamperInput((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold transition-colors ${
                tamperInput
                  ? "border-danger bg-danger/15 text-danger"
                  : "border-line-2 bg-bg-2 text-fg-2 hover:border-accent"
              }`}
            >
              {tamperInput ? (
                <>
                  <XCircle className="size-3.5" /> Payload Tampered (days: 4 → 14)
                </>
              ) : (
                <>
                  <KeyRound className="size-3.5" /> Simulate Post-Approval Payload Tamper
                </>
              )}
            </button>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {GRANT_DIGEST_FIELDS.map((item) => {
              const isTamperedField = tamperInput && item.field === "resolvedInputHash";
              return (
                <div
                  key={item.field}
                  className={`rounded-lg border p-3 font-mono text-[11px] transition-colors ${
                    isTamperedField
                      ? "border-danger bg-danger/10"
                      : "border-line bg-bg-2/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-fg">{item.field}</span>
                    {isTamperedField ? (
                      <span className="rounded bg-danger/20 px-1.5 py-0.5 text-[9.5px] text-danger">MISMATCH</span>
                    ) : (
                      <span className="rounded bg-signal/15 px-1.5 py-0.5 text-[9.5px] text-signal">VERIFIED</span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-[10.5px] text-fg-3">
                    {isTamperedField
                      ? '{"days":14,"employeeId":"emp-1042","startDate":"2026-11-08"}'
                      : item.value}
                  </p>
                  <p className={`mt-1 text-[10px] ${isTamperedField ? "text-danger" : "text-accent"}`}>
                    {isTamperedField ? "computed: sha256:e190f4...00c8 != grant" : item.hash}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 font-mono text-[11.5px] ${
              tamperInput
                ? "border-danger/50 bg-danger/15 text-danger"
                : "border-signal/50 bg-signal/12 text-signal"
            }`}
          >
            <span>
              {tamperInput
                ? "Pre-Dispatch Grant Verification → REJECTED (ERR_RESOLVED_INPUT_HASH_MISMATCH). Vault secret fetch blocked."
                : "Pre-Dispatch Grant Verification → PASS (Cryptographic signature + all canonical SHA-256 digests matched). Single-attempt lease acquired."}
            </span>
            <span className="uppercase">{tamperInput ? "Zero Network I/O" : "Authorized for Dispatch"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
