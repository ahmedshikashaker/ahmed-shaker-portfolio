"use client";

import { useRef } from "react";
import { LEAD_END, LEAD_START, fmtDays } from "./yearModel";
import { C28_LIVE, C28_READY_DAY } from "./coreModel";
import { useStepsOnView } from "./useMotionReady";

/**
 * "Year one, scored": the series' numbers at the start and the end of the first year, side by side. Every figure
 * comes from the shared models (pipelineModel, measureModel, coreModel, yearModel). Rows reveal in order.
 */

const c28WeeksBefore = ((C28_LIVE.coupled - C28_READY_DAY) / 5).toFixed(1).replace(/\.0$/, "");

const ROWS: { what: string; before: string; after: string; note: string; essay: number; steady?: boolean }[] = [
  { what: "Change 27, idea to customer", before: fmtDays(LEAD_START), after: fmtDays(LEAD_END), note: "the same afternoon of work, far less waiting", essay: 3 },
  { what: "Change 28, ready to live", before: `${c28WeeksBefore} weeks`, after: `${C28_LIVE.decoupled - C28_READY_DAY} day`, note: "the core no longer in the way", essay: 5 },
  { what: "Controls with evidence attached automatically", before: "1 of 6", after: "6 of 6", note: "approval by evidence, not meeting", essay: 2 },
  { what: "Changes on the weekly change board", before: "40", after: "3", note: "only what needs judgement", essay: 2 },
  { what: "What the board watches", before: "Green tiles", after: "One number", note: "with two guardrails", essay: 3 },
  { what: "Rules rewritten", before: "0", after: "4", note: "one a quarter", essay: 4 },
  { what: "Core banking releases", before: "Quarterly", after: "Quarterly", note: "unchanged, on purpose", essay: 5, steady: true },
];

const HREF: Record<number, string> = {
  1: "/blog/the-factory-is-the-easy-part",
  2: "/blog/evidence-not-meetings",
  3: "/blog/the-one-number-a-board-should-watch",
  4: "/blog/fear-is-rational",
  5: "/blog/fast-edge-steady-core",
};

export default function YearScoreboard({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const shown = useStepsOnView(ref, ROWS.length, 220, 0.3);

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-accent/35 bg-surface shadow-[var(--shadow-float)]">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <p className="eyebrow text-accent">Year one, scored</p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">Month 1 → month 12</p>
        </div>
        <ol>
          {ROWS.map((r, i) => (
            <li
              key={r.what}
              className={`grid grid-cols-1 items-center gap-x-4 gap-y-1.5 border-b border-line px-5 py-3.5 transition-all duration-500 last:border-b-0 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:gap-y-1 sm:px-6 ${
                shown > i ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
              }`}
            >
              <div className="min-w-0">
                <p className="text-[13.5px] font-medium leading-snug text-fg">{r.what}</p>
                <p className="text-[12px] leading-snug text-fg-3">
                  {r.note} ·{" "}
                  <a href={HREF[r.essay]} className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent hover:underline">
                    Essay {r.essay}
                  </a>
                </p>
              </div>
              <p className="flex items-baseline justify-start gap-2.5 sm:justify-end sm:text-end">
                <span className={`font-mono text-[12px] tabular-nums ${r.steady ? "text-fg-3" : "text-fg-4 line-through decoration-danger/60"}`}>{r.before}</span>
                <span className="text-fg-4" aria-hidden="true">→</span>
                <span className={`font-display text-[1.45rem] leading-none tabular-nums ${r.steady ? "text-accent" : "text-signal"}`}>{r.after}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Every number comes from the models in the earlier essays. The last line is the one that didn’t need to change."}
      </figcaption>
    </figure>
  );
}
