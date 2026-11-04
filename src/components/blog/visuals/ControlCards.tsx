"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FileCheck2, FlaskConical, MessageSquareQuote, PackageSearch, ShieldCheck, Stamp, Undo2, UserRound, Users, Zap } from "lucide-react";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * "Control cards": the six questions every change approval has to answer, each answered two ways:
 * out loud in a meeting, or by the pipeline with evidence attached. A toggle switches the emphasis; the first
 * time the cards scroll into view they switch to the pipeline on their own (not with reduced motion).
 * Both answers are always in the markup, so the static and no-JS versions still say everything.
 */

type Mode = "meeting" | "pipeline";

const CONTROLS = [
  { icon: Users, q: "Did someone other than the author review it?", said: "“Yes, it was reviewed.”", check: "Mandatory peer review before merge", evidence: "Review record: approver, comments, time", people: "Review the code" },
  { icon: FlaskConical, q: "Was it tested, and does it break anything else?", said: "“Yes, it’s been tested.”", check: "Automated tests on every change", evidence: "Test report", people: "Write and maintain the tests" },
  { icon: ShieldCheck, q: "Does it carry any known vulnerabilities?", said: "“Security had a look.”", check: "Code, dependency and container scans", evidence: "Scan results against agreed thresholds", people: "Set thresholds, triage findings" },
  { icon: PackageSearch, q: "Do we know exactly what’s inside it?", said: "“It’s on the component list.”", check: "Software bill of materials generated at build", evidence: "SBOM and build provenance", people: "Review new dependencies" },
  { icon: Stamp, q: "Did someone accountable approve it?", said: "“Approved. Next.”", check: "Policy check: all evidence present and within thresholds", evidence: "Approval record linked to the evidence", people: "Own the policy, decide exceptions" },
  { icon: Undo2, q: "Can it be released safely, and reversed?", said: "“There’s a rollback plan.”", check: "Staged rollout with automatic rollback", evidence: "Deployment log", people: "Watch the early rings" },
] as const;

export default function ControlCards({ caption }: { caption?: string }) {
  const [mode, setMode] = useState<Mode>("meeting");
  const touched = useRef(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const reduced = useReducedMotionAfterMount();

  useEffect(() => {
    if (reduced !== false || !inView) return;
    const id = window.setTimeout(() => {
      if (!touched.current) setMode("pipeline");
    }, 1800);
    return () => window.clearTimeout(id);
  }, [inView, reduced]);

  const pick = (m: Mode) => {
    touched.current = true;
    setMode(m);
  };
  const isPipe = mode === "pipeline";

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <p className="eyebrow text-fg-4">Six questions every approval must answer</p>
          <div className="inline-flex rounded-full border border-line-2 p-0.5" role="group" aria-label="Who answers the questions">
            {(
              [
                ["meeting", "In a meeting"],
                ["pipeline", "By the pipeline"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => pick(m)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  mode === m ? (m === "pipeline" ? "bg-signal text-on-accent" : "bg-danger text-on-accent") : "text-fg-3 hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ol className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
          {CONTROLS.map((c, i) => {
            const Icon = c.icon;
            const delay = { transitionDelay: `${i * 90}ms` };
            return (
              <li key={c.q} className="flex flex-col rounded-xl border border-line bg-bg-2/40 p-4">
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-2 bg-surface text-accent">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <span className="font-mono text-[10.5px] tabular-nums text-fg-4">{String(i + 1).padStart(2, "0")}</span>
                    <p className="font-display text-[1.08rem] leading-snug text-fg">{c.q}</p>
                  </div>
                </div>

                <div className="mb-3 mt-4 space-y-2">
                  <div
                    className={`flex items-start gap-2.5 rounded-lg px-3 py-2 text-[12.5px] leading-snug transition-all duration-500 ${
                      isPipe ? "opacity-40" : "bg-danger/10"
                    }`}
                    style={delay}
                  >
                    <MessageSquareQuote className="mt-0.5 size-3.5 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
                    <span>
                      <span className="sr-only">In a meeting: </span>
                      <span className="italic text-fg-2">{c.said}</span>
                      <span className="block text-[11.5px] text-fg-4">Evidence: whatever the minutes say</span>
                    </span>
                  </div>
                  <div
                    className={`flex items-start gap-2.5 rounded-lg px-3 py-2 text-[12.5px] leading-snug transition-all duration-500 ${
                      isPipe ? "bg-signal/10" : "opacity-40"
                    }`}
                    style={delay}
                  >
                    <Zap className="mt-0.5 size-3.5 shrink-0 text-signal" strokeWidth={1.75} aria-hidden="true" />
                    <span>
                      <span className="sr-only">By the pipeline: </span>
                      <span className="text-fg-2">{c.check}</span>
                      <span className="mt-1 flex items-start gap-1.5 text-[11.5px] text-signal">
                        <FileCheck2 className="mt-px size-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                        {c.evidence}
                      </span>
                    </span>
                  </div>
                </div>

                <p className="mt-auto flex items-start gap-1.5 border-t border-line pt-2.5 text-[11.5px] text-fg-3">
                  <UserRound className="mt-px size-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span>
                    People now: <span className="text-fg-2">{c.people}</span>
                  </span>
                </p>
              </li>
            );
          })}
        </ol>

        <div className="grid gap-px border-t border-line bg-line sm:grid-cols-2">
          <div className="bg-surface px-5 py-4 sm:px-6">
            <div className={`transition-opacity duration-500 ${isPipe ? "opacity-45" : ""}`}>
            <p className="eyebrow text-fg-4">In a meeting</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-fg-2">
              Six answers, out loud, in about <strong className="font-semibold text-fg">two minutes</strong>. Left for an auditor: the minutes.
            </p>
            </div>
          </div>
          <div className="bg-surface px-5 py-4 sm:px-6">
            <div className={`transition-opacity duration-500 ${isPipe ? "" : "opacity-45"}`}>
            <p className="eyebrow text-fg-4">By the pipeline</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-fg-2">
              Six answers, checked the same way <strong className="font-semibold text-fg">every time</strong>. Left for an auditor: a record for each one.
            </p>
            </div>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {isPipe ? "Showing the pipeline's answers, with evidence attached." : "Showing the meeting's answers."}
        </p>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Switch between the two ways of answering. People don’t disappear; their job moves to the last line of each card."}
      </figcaption>
    </figure>
  );
}
