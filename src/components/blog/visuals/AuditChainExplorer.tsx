"use client";

import { useState } from "react";
import {
  AlertOctagon,
  Hash,
} from "lucide-react";

interface AuditBlock {
  seq: number;
  eventType: string;
  actor: string;
  prevHash: string;
  cleanPayload: string;
  tamperedPayload?: string;
  cleanHash: string;
  tamperedHash: string;
}

const AUDIT_CHAIN_BLOCKS: AuditBlock[] = [
  {
    seq: 1041,
    eventType: "turn.intent.classified",
    actor: "principal:emp-1042",
    prevHash: "sha256:0091a8...4e10",
    cleanPayload: '{"turnId":"trn_88","intent":"action_dag","riskCeiling":"R2"}',
    cleanHash: "sha256:3c71b4...92d1",
    tamperedHash: "sha256:3c71b4...92d1",
  },
  {
    seq: 1042,
    eventType: "proposal.policy.evaluated",
    actor: "policy-engine:v1.42",
    prevHash: "sha256:3c71b4...92d1",
    cleanPayload: '{"proposalId":"prp_19","capability":"leave.request.create@v5","decision":"ALLOW_R2"}',
    cleanHash: "sha256:7f20e9...11a8",
    tamperedHash: "sha256:7f20e9...11a8",
  },
  {
    seq: 1043,
    eventType: "approval.confirmation.bound",
    actor: "approver:mgr-0210",
    prevHash: "sha256:7f20e9...11a8",
    cleanPayload: '{"approvalId":"apr_07","planHash":"sha256:4b21...77d1","days":4}',
    tamperedPayload: '{"approvalId":"apr_07","planHash":"sha256:4b21...77d1","days":14}',
    cleanHash: "sha256:a914c0...65f2",
    tamperedHash: "sha256:ff08d1...99e0 [TAMPERED]",
  },
  {
    seq: 1044,
    eventType: "execution.grant.issued",
    actor: "control-plane-signer:k3",
    prevHash: "sha256:a914c0...65f2",
    cleanPayload: '{"grantId":"grt_55","operationId":"op_31","singleAttempt":true}',
    cleanHash: "sha256:d402b7...38c9",
    tamperedHash: "sha256:BROKEN_PREV_LINK",
  },
  {
    seq: 1045,
    eventType: "operation.succeeded",
    actor: "worker:exec-pool-02",
    prevHash: "sha256:d402b7...38c9",
    cleanPayload: '{"operationId":"op_31","externalReceipt":"HRMS-99201","redactedFields":3}',
    cleanHash: "sha256:e819f3...70b4",
    tamperedHash: "sha256:ANCHOR_MISMATCH",
  },
];

const CORRELATED_IDS = [
  { group: "Ingress & Trace", ids: ["traceId (W3C)", "conversationId", "turnId", "principalId"] },
  { group: "Reasoning & RAG", ids: ["runId", "retrievalScopeId", "evidenceChunkId", "planId"] },
  { group: "Governance & Policy", ids: ["proposalId", "policyRevisionId", "approvalId", "grantId"] },
  { group: "Execution & Audit", ids: ["operationId", "capabilityVersionId", "idempotencyKey", "externalReceiptId"] },
];

export default function AuditChainExplorer() {
  const [tampered, setTampered] = useState<boolean>(false);
  const [audience, setAudience] = useState<"llm" | "user" | "auditor">("llm");

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
      {/* Header */}
      <div className="border-b border-line bg-bg-2/50 px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-accent">Non-Repudiation &amp; Correlation Explorer · Tamper-Evident Audit</span>
            <h3 className="mt-1 font-display text-[1.45rem] leading-tight text-fg">
              End-to-End Causal Correlation &amp; Tamper-Evident SHA-256 Audit Chain
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setTampered((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold transition-colors ${
              tampered
                ? "border-danger bg-danger/15 text-danger"
                : "border-line-2 bg-surface text-fg-2 hover:border-accent"
            }`}
          >
            {tampered ? (
              <>
                <AlertOctagon className="size-3.5" /> DB Tamper Injected at Seq #1043
              </>
            ) : (
              <>
                <Hash className="size-3.5" /> Simulate Direct DB Row Tamper (Seq #1043)
              </>
            )}
          </button>
        </div>

        {/* Correlated IDs Strip */}
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {CORRELATED_IDS.map((g) => (
            <div key={g.group} className="rounded-xl border border-line bg-surface/80 p-3">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-accent">{g.group}</span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {g.ids.map((id) => (
                  <span
                    key={id}
                    className="rounded border border-line-2 bg-bg-2 px-1.5 py-0.5 font-mono text-[10px] text-fg-2"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hash Chain Blocks */}
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 font-mono text-[11px] text-fg-3">
          <span>
            Each row computes <code className="text-fg">event_hash = SHA256(prev_event_hash || canonical_payload)</code>:
          </span>
          <span className={tampered ? "font-semibold text-danger" : "font-semibold text-signal"}>
            {tampered
              ? "CHAIN INTEGRITY FAILED: Seq #1043–#1045 diverge from Signed WORM Anchor!"
              : "CHAIN INTEGRITY VERIFIED: Matches Signed WORM Partition Anchor"}
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          {AUDIT_CHAIN_BLOCKS.map((b) => {
            const isMutatedBlock = tampered && b.seq === 1043;
            const isDownstreamBroken = tampered && b.seq > 1043;
            const isBroken = isMutatedBlock || isDownstreamBroken;

            return (
              <div
                key={b.seq}
                className={`flex flex-col justify-between rounded-xl border p-3.5 font-mono text-[11px] transition-all ${
                  isBroken
                    ? "border-danger bg-danger/[0.08]"
                    : "border-signal/40 bg-signal/[0.04]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 border-b border-line/60 pb-2">
                    <span className="font-semibold text-fg">Seq #{b.seq}</span>
                    {isBroken ? (
                      <span className="rounded bg-danger/20 px-1.5 py-0.5 text-[9.5px] text-danger">
                        {isMutatedBlock ? "TAMPERED" : "BROKEN LINK"}
                      </span>
                    ) : (
                      <span className="rounded bg-signal/15 px-1.5 py-0.5 text-[9.5px] text-signal">VALID</span>
                    )}
                  </div>
                  <p className="mt-2 font-semibold text-accent">{b.eventType}</p>
                  <p className="text-[10px] text-fg-3">{b.actor}</p>

                  <div className="mt-2.5 rounded border border-line bg-surface/80 p-2 text-[10px] text-fg-2">
                    <span className="block text-[9px] uppercase text-fg-4">Canonical Payload</span>
                    <span className="mt-0.5 block break-all">
                      {isMutatedBlock && b.tamperedPayload ? b.tamperedPayload : b.cleanPayload}
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-1 border-t border-line/60 pt-2 text-[9.5px]">
                  <div className="truncate text-fg-4">prev: {b.prevHash}</div>
                  <div className={`truncate font-semibold ${isBroken ? "text-danger" : "text-signal"}`}>
                    curr: {tampered ? b.tamperedHash : b.cleanHash}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audience Result Redaction Projector */}
        <div className="mt-6 rounded-xl border border-line-2 bg-bg-2/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-accent">
                Privacy by Design · Audience-Specific Result Projection
              </span>
              <h4 className="mt-0.5 font-display text-[1.15rem] text-fg">
                The same connector response is projected differently for the LLM, the User UI, and the Audit Vault
              </h4>
            </div>
            <div className="flex rounded-full border border-line-2 bg-surface p-1 text-[11px] font-mono">
              {(
                [
                  { id: "llm", label: "1. LLM Context Projection" },
                  { id: "user", label: "2. Caller UI Card" },
                  { id: "auditor", label: "3. Hash-Chained Audit" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAudience(tab.id)}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    audience === tab.id ? "bg-accent text-on-accent" : "text-fg-3 hover:text-fg"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-line bg-surface p-3.5 font-mono text-[11.5px] text-fg-2">
            {audience === "llm" && (
              <div>
                <span className="text-signal">// Minimal projection returned to the reasoning runtime:</span>
                <pre className="mt-1 overflow-x-auto text-fg">
                  {`{ "operationId": "op_31", "status": "succeeded", "leaveRequestId": "LR-8821", "remainingDays": 14, "redactedFields": ["nationalId", "salaryBand", "approverEmail"] }`}
                </pre>
              </div>
            )}
            {audience === "user" && (
              <div>
                <span className="text-accent">// Rich receipt rendered in the authenticated employee's UI card:</span>
                <pre className="mt-1 overflow-x-auto text-fg">
                  {`{ "leaveRequestId": "LR-8821", "dates": "2026-11-08 → 2026-11-11 (4 days)", "approver": "Line Manager (mgr-0210)", "remainingDays": 14, "externalReceipt": "HRMS-99201" }`}
                </pre>
              </div>
            )}
            {audience === "auditor" && (
              <div>
                <span className="text-amber-500">// Tamper-evident record in the audit ledger (PII tokenized, hashes pinned):</span>
                <pre className="mt-1 overflow-x-auto text-fg">
                  {`{ "auditEventId": "evt_1045", "traceId": "4bf92f3577b34da6a3ce929d0e0e4736", "grantId": "grt_55", "resolvedInputHash": "sha256:4b21e8...77d1", "resultHash": "sha256:88c01a...19e2", "canaryLeakCheck": "PASS" }`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
