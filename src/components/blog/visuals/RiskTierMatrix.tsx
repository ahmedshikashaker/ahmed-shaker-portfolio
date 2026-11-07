"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  ArrowUpRight,
  CheckCircle2,
  KeyRound,
  Lock,
  RefreshCcw,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  UserCheck,
} from "lucide-react";
import {
  ESCALATION_FACTORS,
  RISK_TIERS,
  type RiskTierId,
} from "./aiGovernanceModel";
import { useReducedMotionAfterMount } from "./useMotionReady";

const TIER_ORDER: RiskTierId[] = ["R0", "R1", "R2", "R3", "R4"];

/**
 * Interactive R0–R4 Risk Governance & Escalation Matrix.
 * Lets readers explore each risk tier and toggle runtime escalation rules
 * to see how 'conflictingRules: most-restrictive' promotes risk and enforces obligations.
 */
export default function RiskTierMatrix({
  caption,
}: {
  caption?: string;
}) {
  const [baseTier, setBaseTier] = useState<RiskTierId>("R2");
  const [activeFactors, setActiveFactors] = useState<Record<string, boolean>>({});
  const reduced = useReducedMotionAfterMount();

  const toggleFactor = (id: string) => {
    setActiveFactors((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { effectiveTier, triggeredRules } = useMemo(() => {
    let maxIdx = TIER_ORDER.indexOf(baseTier);
    const rules: typeof ESCALATION_FACTORS = [];

    for (const factor of ESCALATION_FACTORS) {
      if (activeFactors[factor.id]) {
        rules.push(factor);
        const factorIdx = TIER_ORDER.indexOf(factor.escalatesTo);
        if (factorIdx > maxIdx) maxIdx = factorIdx;
      }
    }
    return {
      effectiveTier: TIER_ORDER[maxIdx] ?? baseTier,
      triggeredRules: rules,
    };
  }, [baseTier, activeFactors]);

  const spec = RISK_TIERS[effectiveTier];
  const wasEscalated = effectiveTier !== baseTier;

  const tierTone = (tier: RiskTierId) => {
    switch (tier) {
      case "R0":
        return "border-line-3 bg-bg-2/70 text-fg-2";
      case "R1":
        return "border-signal/50 bg-signal/10 text-signal";
      case "R2":
        return "border-sky-400/50 bg-sky-400/10 text-sky-600 dark:text-sky-300";
      case "R3":
        return "border-accent/60 bg-accent/12 text-accent";
      case "R4":
        return "border-danger/65 bg-danger/12 text-danger";
    }
  };

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="eyebrow text-fg-3">
              Interactive Policy Matrix · R0–R4 Risk Governance &amp; Escalation Simulator
            </span>
          </div>
          <span className="font-mono text-[11px] text-fg-4">
            Rule resolution: most-restrictive wins
          </span>
        </div>

        {/* Tier Selector Bar */}
        <div className="grid grid-cols-5 gap-px border-b border-line bg-line" role="tablist" aria-label="Base risk tier">
          {TIER_ORDER.map((t) => {
            const isBase = t === baseTier;
            const isEffective = t === effectiveTier;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={isBase}
                onClick={() => {
                  setBaseTier(t);
                  setActiveFactors({});
                }}
                className={`relative flex flex-col items-start justify-between p-3.5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent sm:p-4 ${
                  isEffective ? "bg-surface-2" : "bg-surface hover:bg-surface-2/60"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <span
                    className={`font-display text-[1.45rem] leading-none ${
                      t === "R4"
                        ? "text-danger"
                        : t === "R3"
                          ? "text-accent"
                          : t === "R1"
                            ? "text-signal"
                            : "text-fg"
                    }`}
                  >
                    {t}
                  </span>
                  {isEffective && (
                    <span className="rounded-full border border-line-3 px-1.5 py-0.5 font-mono text-[9.5px] uppercase text-fg-2">
                      {wasEscalated ? "Escalated" : "Active"}
                    </span>
                  )}
                </div>
                <span className="mt-2 hidden text-[11.5px] leading-snug text-fg-3 sm:block">
                  {RISK_TIERS[t].name.split("·")[1]?.trim()}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-12">
          {/* Left: Escalation Rule Toggles */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">
                <SlidersHorizontal className="size-3.5 text-accent" />
                Test Context &amp; Escalation Triggers
              </span>
              {Object.values(activeFactors).some(Boolean) && (
                <button
                  type="button"
                  onClick={() => setActiveFactors({})}
                  className="text-[11.5px] text-accent hover:underline"
                >
                  Clear triggers
                </button>
              )}
            </div>
            <p className="mt-1 text-[12.5px] text-fg-3">
              Production bindings can never lower an action’s minimum risk—they can only raise it or add obligations:
            </p>

            <div className="mt-3 space-y-2">
              {ESCALATION_FACTORS.map((f) => {
                const checked = Boolean(activeFactors[f.id]);
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    onClick={() => toggleFactor(f.id)}
                    className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-start transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                      checked
                        ? f.escalatesTo === "R4"
                          ? "border-danger/60 bg-danger/[0.08]"
                          : "border-accent/60 bg-accent/[0.08]"
                        : "border-line-2 bg-bg-2/40 hover:border-line-3"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium leading-snug text-fg">
                        {f.label}
                      </p>
                      <p className="mt-0.5 font-mono text-[10.5px] text-fg-4">
                        {f.ruleName}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10.5px] font-semibold ${
                        f.escalatesTo === "R4"
                          ? "border-danger/50 text-danger"
                          : "border-accent/50 text-accent"
                      }`}
                    >
                      → {f.escalatesTo}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Resulting Governance Contract */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={effectiveTier + triggeredRules.map((r) => r.id).join(",")}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="flex h-full flex-col justify-between rounded-xl border border-line-2 bg-bg-2/55 p-4 sm:p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11.5px] font-semibold ${tierTone(effectiveTier)}`}>
                      {effectiveTier === "R4" ? (
                        <AlertOctagon className="size-3.5" />
                      ) : effectiveTier === "R3" ? (
                        <ShieldAlert className="size-3.5" />
                      ) : (
                        <Shield className="size-3.5" />
                      )}
                      {spec.name}
                    </span>
                    {wasEscalated && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-accent">
                        <ArrowUpRight className="size-3.5" />
                        Escalated from {baseTier} to {effectiveTier}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-[14px] leading-relaxed text-fg-2">
                    {spec.tagline}
                  </p>

                  {/* 6 Mandatory Policy Obligations */}
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    <div className="rounded-lg border border-line bg-surface p-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                        Model Capability Exposure
                      </span>
                      <p className="mt-1 text-[12.5px] font-medium text-fg">
                        {spec.modelExposure}
                      </p>
                    </div>
                    <div className="rounded-lg border border-line bg-surface p-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                        Confirmation &amp; Hash Binding
                      </span>
                      <p className="mt-1 text-[12.5px] font-medium text-fg">
                        {spec.confirmationMode}
                      </p>
                    </div>
                    <div className="rounded-lg border border-line bg-surface p-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-fg-4">
                        <KeyRound className="size-3 text-accent" /> Step-Up Authentication
                      </span>
                      <p className="mt-1 text-[12.5px] font-medium text-fg">
                        {spec.stepUpMfa}
                      </p>
                    </div>
                    <div className="rounded-lg border border-line bg-surface p-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-fg-4">
                        <UserCheck className="size-3 text-accent" /> Approval &amp; Four-Eyes
                      </span>
                      <p className="mt-1 text-[12.5px] font-medium text-fg">
                        {spec.approvalRule}
                      </p>
                    </div>
                    <div className="rounded-lg border border-line bg-surface p-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-fg-4">
                        <Lock className="size-3 text-signal" /> Decision Caching
                      </span>
                      <p className="mt-1 text-[12.5px] font-medium text-fg">
                        {spec.authCaching}
                      </p>
                    </div>
                    <div className="rounded-lg border border-line bg-surface p-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-fg-4">
                        <RefreshCcw className="size-3 text-signal" /> Post-Dispatch Retry
                      </span>
                      <p className="mt-1 text-[12.5px] font-medium text-fg">
                        {spec.retryAfterDispatch}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Representative Enterprise Operations */}
                <div className="mt-4 border-t border-line pt-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                    Representative Enterprise Actions at {effectiveTier}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {spec.examples.map((ex) => (
                      <span
                        key={ex}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line-2 bg-surface px-3 py-1 text-[12px] text-fg-2"
                      >
                        <CheckCircle2 className="size-3 text-accent" />
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption ||
          "Select a base risk tier (R0–R4) and toggle escalation factors to see how the policy engine enforces confirmation, step-up MFA, four-eyes approvals, and retry limits."}
      </figcaption>
    </figure>
  );
}
