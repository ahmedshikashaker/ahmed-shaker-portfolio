"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionAfterMount } from "./useMotionReady";
import { C27_BUILD, C27_FLOW_EFFICIENCY, C27_TOTAL, C27_TO_LIVE, C27_WAIT_TO_START } from "./measureModel";

/**
 * "Where does the clock start?": change 27 from decision to customer, to scale, with the three numbers three
 * honest people could report for it. Server render = fully drawn; on the client it draws once when scrolled into view.
 */

const pct = (d: number) => (d / C27_TOTAL) * 100;

const ROWS = [
  {
    who: "The factory",
    measures: "Effort: time someone was working on it",
    value: "½ day",
    from: C27_WAIT_TO_START,
    to: C27_WAIT_TO_START + C27_BUILD,
    tone: "accent",
  },
  {
    who: "DORA's change lead time",
    measures: "From code committed to running in production",
    value: `${Math.round(C27_TO_LIVE)} days`,
    from: C27_WAIT_TO_START + C27_BUILD,
    to: C27_TOTAL,
    tone: "fg",
  },
  {
    who: "The customer",
    measures: "From the bank deciding to fix it to the fix in their hands",
    value: `${Math.round(C27_TOTAL)} days`,
    from: 0,
    to: C27_TOTAL,
    tone: "danger",
  },
] as const;

const TONE = {
  accent: { text: "text-accent", line: "border-accent" },
  fg: { text: "text-fg", line: "border-fg-3" },
  danger: { text: "text-danger", line: "border-danger" },
};

export default function ClockStart({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const reduced = useReducedMotionAfterMount();
  const [stage, setStage] = useState(4); // 0 = empty … 4 = everything shown

  useEffect(() => {
    if (reduced === false && !inView) setStage(0);
  }, [reduced, inView]);
  useEffect(() => {
    if (reduced !== false || !inView) return;
    const timers = [1, 2, 3, 4].map((s, i) => window.setTimeout(() => setStage(s), 150 + i * 650));
    return () => timers.forEach(window.clearTimeout);
  }, [reduced, inView]);

  const segs = [
    { label: "Waiting to start", days: C27_WAIT_TO_START, cls: "bg-fg-3/25", text: "text-fg-3" },
    { label: "Built", days: C27_BUILD, cls: "bg-accent", text: "text-accent" },
    { label: "Waiting to go live", days: C27_TO_LIVE, cls: "bg-danger/45", text: "text-danger" },
  ];

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-5 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="eyebrow text-fg-4">Change 27 · decision to customer, to scale</p>
          <p className="font-mono text-[11px] text-fg-4">1 line of code · {Math.round(C27_TOTAL)} days</p>
        </div>

        {/* The bar */}
        <div className="relative mt-6">
          <div className="flex h-9 w-full overflow-hidden rounded-md border border-line-2 bg-bg/40" role="img" aria-label={`Change 27: ${C27_WAIT_TO_START} days waiting to start, an afternoon of building, ${Math.round(C27_TO_LIVE)} days waiting to go live.`}>
            {segs.map((s) => (
              <div
                key={s.label}
                className={`h-full ${s.cls} origin-left transition-transform duration-700 ease-out`}
                style={{
                  width: `${pct(s.days)}%`,
                  minWidth: s.days < 1 ? 5 : undefined,
                  transform: stage >= 1 ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex text-[11.5px]" aria-hidden="true">
            <span className="text-fg-3" style={{ width: `${pct(C27_WAIT_TO_START)}%` }}>
              Approved · waiting to start ({C27_WAIT_TO_START} days)
            </span>
            <span className="ms-auto text-danger">Waiting to go live ({Math.round(C27_TO_LIVE)} days)</span>
          </div>
        </div>

        {/* Three honest numbers */}
        <div className="mt-6 space-y-4">
          {ROWS.map((r, i) => {
            const shown = stage >= i + 2 || (stage >= 4);
            return (
              <div key={r.who} className={`transition-opacity duration-500 ${shown ? "opacity-100" : "opacity-0"}`}>
                <div className="relative h-3" aria-hidden="true">
                  <div
                    className={`absolute top-0 h-3 rounded-t-sm border-x border-t ${TONE[r.tone].line}`}
                    style={{ left: `${pct(r.from)}%`, width: `max(6px, ${pct(r.to - r.from)}%)` }}
                  />
                </div>
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <p className="text-[13.5px]">
                    <span className="font-medium text-fg">{r.who}</span>
                    <span className="text-fg-3"> · {r.measures}</span>
                  </p>
                  <p className={`font-display text-[1.5rem] leading-none tabular-nums ${TONE[r.tone].text}`}>{r.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className={`mt-6 border-t border-line pt-4 text-[13.5px] text-fg-2 transition-opacity duration-500 ${stage >= 4 ? "opacity-100" : "opacity-0"}`}>
          Someone was actually working on change 27 for about{" "}
          <strong className="font-semibold text-fg">{Math.max(1, Math.round(C27_FLOW_EFFICIENCY * 100))}%</strong> of its life. The rest was
          waiting.
        </p>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Three honest numbers for the same change. Only one of them is what the customer lived through."}
      </figcaption>
    </figure>
  );
}
