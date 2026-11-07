"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileCode,
  GitCompareArrows,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { CANONICAL_CONTRACT_VIEWS } from "./aiGovernanceModel";
import { useReducedMotionAfterMount } from "./useMotionReady";

type ContractTab = keyof typeof CANONICAL_CONTRACT_VIEWS;

const LIFECYCLE_STEPS = [
  { id: "registered", label: "1. Registered", sub: "Endpoint & vault ref bound" },
  { id: "discovering", label: "2. Discovering", sub: "Import OpenAPI / MCP tools/list" },
  { id: "draft", label: "3. Draft (R4)", sub: "Disabled pending review" },
  { id: "reviewed", label: "4. Reviewed", sub: "Risk, ownership & context fields" },
  { id: "certified", label: "5. Certified", sub: "Sandbox security & SSRF suite pass" },
  { id: "published", label: "6. Published", sub: "Immutable version @v5 pinned" },
] as const;

/**
 * Interactive Canonical Capability Contract & Connector Lifecycle Explorer.
 * Shows how OpenAPI 3.2 and MCP 2025-11-25 normalize into one immutable Capability Contract,
 * and how upstream schema drift / list_changed notifications are quarantined.
 */
export default function CanonicalContractExplorer({
  caption,
}: {
  caption?: string;
}) {
  const [tab, setTab] = useState<ContractTab>("canonical");
  const [driftSimulated, setDriftSimulated] = useState(false);
  const reduced = useReducedMotionAfterMount();

  const view = CANONICAL_CONTRACT_VIEWS[tab];

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="eyebrow text-fg-3">
              Interactive Contract Normalization · OpenAPI &amp; MCP to Canonical Capability Contract
            </span>
          </div>
          <span className="font-mono text-[11px] text-fg-4">
            Protocol-Agnostic Enterprise Governance
          </span>
        </div>

        {/* Connector Onboarding & Drift State Machine */}
        <div className="border-b border-line bg-bg-2/50 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-4">
                Connector Publication Lifecycle · Discover Broadly, Publish Narrowly
              </span>
              <p className="mt-0.5 text-[12.5px] text-fg-3">
                Discovery never transitions directly to Published. Every imported operation begins as a disabled R4 draft.
              </p>
            </div>
            <button
              type="button"
              aria-pressed={driftSimulated}
              onClick={() => setDriftSimulated((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                driftSimulated
                  ? "border-danger bg-danger text-on-accent"
                  : "border-line-2 bg-surface text-fg-2 hover:border-accent/50 hover:text-accent"
              }`}
            >
              <GitCompareArrows className="size-3.5" strokeWidth={1.85} />
              {driftSimulated
                ? "Reset Upstream Schema Drift"
                : "Simulate MCP list_changed / Spec Drift"}
            </button>
          </div>

          <ol className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {LIFECYCLE_STEPS.map((s, idx) => {
              const isPublished = s.id === "published";
              const isDraft = s.id === "draft";
              return (
                <li
                  key={s.id}
                  className={`rounded-xl border px-3 py-2.5 transition-colors ${
                    driftSimulated && isPublished
                      ? "border-danger/65 bg-danger/10"
                      : driftSimulated && isDraft
                        ? "border-accent/65 bg-accent/12"
                        : isPublished
                          ? "border-signal/55 bg-signal/[0.08]"
                          : "border-line-2 bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10.5px] font-semibold text-fg">
                      {s.label}
                    </span>
                    {idx < LIFECYCLE_STEPS.length - 1 && (
                      <ArrowRight className="hidden size-3 text-fg-4 lg:block" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-fg-3">
                    {driftSimulated && isPublished
                      ? "Suspended on breaking drift"
                      : driftSimulated && isDraft
                        ? "New diff @draft-6 queued"
                        : s.sub}
                  </p>
                </li>
              );
            })}
          </ol>

          {driftSimulated && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-danger/45 bg-danger/[0.07] px-3.5 py-2.5 text-[12.5px] text-fg-2">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={1.85} />
              <span>
                <strong className="font-semibold text-fg">Breaking Drift Contained:</strong>{" "}
                When an upstream OpenAPI spec or MCP server emits{" "}
                <code className="font-mono text-[11.5px] text-danger">notifications/tools/list_changed</code>{" "}
                with altered required fields or side-effect hints, the control plane never auto-updates{" "}
                <code className="font-mono text-[11.5px]">leave.request.create@v5</code>. It suspends the affected version and opens a blocking diff in <code className="font-mono text-[11.5px]">Draft (R4)</code> for security review.
              </span>
            </div>
          )}
        </div>

        {/* 3-Way Contract Comparison Tabs */}
        <div
          className="grid grid-cols-1 gap-px border-b border-line bg-line sm:grid-cols-3"
          role="tablist"
          aria-label="Protocol contract views"
        >
          {(["openapi", "mcp", "canonical"] as ContractTab[]).map((key) => {
            const item = CANONICAL_CONTRACT_VIEWS[key];
            const active = tab === key;
            const isCanonical = key === "canonical";
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(key)}
                className={`flex flex-col items-start justify-between p-4 text-start transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent ${
                  active ? "bg-surface-2" : "bg-surface hover:bg-surface-2/60"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider ${
                      isCanonical ? "text-signal" : "text-fg-4"
                    }`}
                  >
                    {item.protocol}
                  </span>
                  {isCanonical ? (
                    <ShieldCheck className="size-4 text-signal" strokeWidth={1.85} />
                  ) : (
                    <FileCode className="size-4 text-fg-4" strokeWidth={1.75} />
                  )}
                </div>
                <p className="mt-1.5 font-display text-[1.15rem] text-fg">
                  {item.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Contract Code & Governance Callouts */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="grid gap-5 p-5 sm:p-6 lg:grid-cols-12"
          >
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-xl border border-line-2 bg-bg-2/85">
                <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                  <span className="font-mono text-[11px] text-fg-3">{view.protocol}</span>
                  <span
                    className={`font-mono text-[10.5px] ${
                      tab === "canonical" ? "text-signal" : "text-amber-500"
                    }`}
                  >
                    {view.trustStatus}
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-fg-2">
                  <code>{view.code}</code>
                </pre>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
              <div
                className={`rounded-xl border p-4 ${
                  tab === "canonical"
                    ? "border-signal/45 bg-signal/[0.06]"
                    : "border-amber-500/45 bg-amber-400/[0.07]"
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg">
                  {tab === "canonical" ? (
                    <CheckCircle2 className="size-4 text-signal" />
                  ) : (
                    <AlertTriangle className="size-4 text-amber-500" />
                  )}
                  {tab === "canonical"
                    ? "Why the Canonical Contract Is Safe"
                    : "Why Raw Transport Schemas Are Insufficient"}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-fg-2">
                  {view.warning}
                </p>
              </div>

              <div className="rounded-xl border border-line bg-bg-2/45 p-4 space-y-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-accent">
                  <Lock className="size-3.5" />
                  Four Guarantees Added by Normalization
                </div>
                <ul className="space-y-2 text-[12.5px] leading-snug text-fg-2">
                  <li>
                    <strong className="text-fg">1. Context-Injected Field Stripping:</strong>{" "}
                    <code className="font-mono text-[11px]">employeeId</code> and{" "}
                    <code className="font-mono text-[11px]">idempotencyKey</code> are removed from model input and bound deterministically by the server.
                  </li>
                  <li>
                    <strong className="text-fg">2. Resource-Level Ownership Check:</strong>{" "}
                    Verifies target ownership and optimistic version before execution.
                  </li>
                  <li>
                    <strong className="text-fg">3. Transport-Neutral Policy &amp; Audit:</strong>{" "}
                    Policy, workflow workers, and audit evaluate the exact same contract whether the target is REST or MCP.
                  </li>
                  <li>
                    <strong className="text-fg">4. Audience-Specific Projection:</strong>{" "}
                    The model, user, downstream DAG node, and audit sink each receive only their allowlisted JSON paths.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <figcaption className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption ||
          "Compare a raw OpenAPI operation and an MCP tool against the published Canonical Capability Contract (leave.request.create@v5) that governs both."}
      </figcaption>
    </figure>
  );
}
