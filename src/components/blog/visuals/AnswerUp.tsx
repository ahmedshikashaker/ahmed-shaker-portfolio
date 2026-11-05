"use client";

import { useRef } from "react";
import { ArrowDown, Briefcase, Landmark, UserRound, Users } from "lucide-react";
import { ALL_MANUAL, GATES, stepFor } from "./pipelineModel";
import { C27_TOTAL, C27_WAIT_TO_START } from "./measureModel";
import { useStepsOnView } from "./useMotionReady";

/**
 * "Lost on the way up": the board's question about change 27 travels down the organisation, and the precise
 * answer travels back up, summarised honestly at each level, until it arrives as "resistance to change".
 * Builds in steps when scrolled into view; the server render and reduced motion show the finished picture.
 */

const days = (id: string) => stepFor(GATES.find((g) => g.id === id)!, ALL_MANUAL, false).step.hours / 24;
const d = (n: number) => (Number.isInteger(n) ? String(n) : n === 3.5 ? "3½" : n.toFixed(1));

const SPECIFIC = `It waited ${d(C27_WAIT_TO_START)} days behind launch work, then ${d(days("tests"))} for the test cycle, ${d(
  days("security") + days("inventory")
)} for security and the component list, ${d(days("approval"))} for the weekly board and ${d(days("deploy"))} for the release window.`;

const LEVELS = [
  { id: "board", name: "Board", icon: Landmark },
  { id: "exco", name: "Executive committee", icon: Briefcase },
  { id: "heads", name: "Department heads", icon: Users },
  { id: "people", name: "The people who touched it", icon: UserRound },
] as const;

// Upward answers, by level, with the detail each summary drops.
const UP: Record<string, { text: string; dropped?: string; step: number; tone: "specific" | "vague" | "final" }> = {
  people: { text: SPECIFIC, step: 3, tone: "specific" },
  heads: { text: "Approvals and release windows slow things down.", dropped: `the ${C27_WAIT_TO_START} days in the backlog`, step: 4, tone: "vague" },
  exco: { text: "Some areas are still adjusting to the new ways of working.", dropped: "which approvals, which windows", step: 5, tone: "vague" },
  board: { text: "Resistance to change.", dropped: "the rules", step: 6, tone: "final" },
};

const STEPS = 6;

export default function AnswerUp({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const step = useStepsOnView(ref, STEPS, 850, 0.4);
  const on = (n: number) => step >= n;

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <p className="eyebrow text-fg-4">One question down, one answer up</p>

        <ol className="relative mt-5 space-y-4">
          {/* The ladder */}
          <span aria-hidden="true" className="absolute bottom-5 start-[1.1rem] top-5 w-px bg-line-2" />
          {LEVELS.map((lv) => {
            const Icon = lv.icon;
            const up = UP[lv.id];
            const isBoard = lv.id === "board";
            return (
              <li key={lv.id} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3">
                <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-line-2 bg-surface text-fg-3">
                  <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-[12.5px] font-medium text-fg-2">{lv.name}</p>

                  {isBoard && (
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <p
                        className={`inline-block rounded-xl rounded-ss-sm border border-accent/45 bg-accent/[0.08] px-3.5 py-2 font-display text-[1.05rem] italic leading-snug text-fg transition-all duration-500 ${
                          on(1) ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                        }`}
                      >
                        “Why did a one-line fix take {Math.round(C27_TOTAL)} days?”
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent transition-opacity duration-500 ${on(2) ? "opacity-100" : "opacity-0"}`}
                      >
                        <ArrowDown className="size-3" strokeWidth={2} aria-hidden="true" /> Goes down the organisation
                      </span>
                    </div>
                  )}

                  <div className={`mt-2 transition-all duration-500 ${on(up.step) ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>
                    <p
                      className={`inline-block max-w-xl rounded-xl rounded-ss-sm border px-3.5 py-2 leading-snug ${
                        up.tone === "specific"
                          ? "border-signal/45 bg-signal/[0.08] text-[13.5px] text-fg"
                          : up.tone === "final"
                            ? "border-danger/50 bg-danger/[0.09] font-display text-[1.25rem] font-medium text-fg"
                            : "border-line-2 bg-bg-2/50 text-[13.5px] text-fg-2"
                      }`}
                    >
                      {isBoard && <span className="eyebrow mb-1 block text-danger">What the board hears</span>}
                      {up.text}
                    </p>
                    {up.dropped && (
                      <p className="mt-1 text-[11.5px] text-fg-4">
                        Dropped on the way up: <span className="line-through decoration-danger/60">{up.dropped}</span>
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Every level summarises honestly. By the time the answer reaches the top, the rules have turned into “culture”. Illustrative."}
      </figcaption>
    </figure>
  );
}
