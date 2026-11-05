"use client";

import { useRef, useState } from "react";
import { C28_FREE_FROM, LEAD_END, LEAD_PEAK, LEAD_START, MONTHS, PEAK_MONTH, YEAR, fmtDays } from "./yearModel";
import { useStepsOnView } from "./useMotionReady";

/**
 * "Change 27's year": how long a small fix like change 27 takes from idea to customer, month by month through the
 * first year, split into waiting to start, time in the gates, and the factory's own afternoon. Plays through the
 * months once when scrolled into view; then the reader can pick any month. Numbers from yearModel.ts.
 */

const MAX = LEAD_PEAK * 1.08;

export default function ChangeYear({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const auto = useStepsOnView(ref, MONTHS, 420, 0.45);
  const [picked, setPicked] = useState<number | null>(null);
  const sel = picked ?? Math.max(1, auto);
  const cur = YEAR[sel - 1];

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="eyebrow text-fg-4">Change 27 · idea to customer, month by month</p>
        <div className="mt-3 flex items-baseline gap-3">
          <p className={`shrink-0 font-display text-[2.2rem] leading-none tabular-nums ${cur.lead > LEAD_START ? "text-danger" : cur.lead < 10 ? "text-signal" : "text-fg"}`}>
            {fmtDays(cur.lead)}
          </p>
          <p className="min-w-0 text-[13.5px] leading-snug text-fg-2" aria-live="polite">
            <span className="font-medium text-fg">Month {cur.m}:</span> {cur.built}
            {cur.essay && (
              <a href={cur.essay.href} className="ms-2 whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent hover:underline">
                Essay {cur.essay.n} →
              </a>
            )}
          </p>
        </div>

        {/* Bars */}
        <div className="mt-6 flex h-52 items-end gap-1.5 sm:gap-2" dir="ltr" role="group" aria-label="Months">
          {YEAR.map((y) => {
            const active = y.m === sel;
            const played = picked !== null || y.m <= Math.max(1, auto);
            const h = (v: number) => `${(v / MAX) * 100}%`;
            return (
              <button
                key={y.m}
                type="button"
                onClick={() => setPicked(y.m)}
                aria-pressed={active}
                aria-label={`Month ${y.m}: ${fmtDays(y.lead)}. ${y.built}.`}
                className={`group relative flex h-full flex-1 flex-col justify-end rounded-t-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active ? "" : "opacity-80 hover:opacity-100"}`}
              >
                <span
                  className={`mb-1 text-center font-mono text-[9.5px] tabular-nums transition-opacity sm:text-[10.5px] ${
                    active || y.m === 1 || y.m === PEAK_MONTH || y.m === MONTHS ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  } ${y.lead > LEAD_START ? "text-danger" : "text-fg-3"}`}
                >
                  {Math.round(y.lead)}
                </span>
                <span
                  className={`block w-full overflow-hidden rounded-t-md transition-all duration-500 ${active ? "ring-2 ring-accent ring-offset-2 ring-offset-surface" : ""}`}
                  style={{ height: played ? h(y.lead) : "0%" }}
                >
                  {/* The factory's afternoon is drawn at a visible minimum; the backlog takes whatever is left. */}
                  <span className="block w-full bg-accent/80" style={{ height: `${(y.gates / y.lead) * 100}%` }} />
                  <span
                    className="block w-full bg-danger/55"
                    style={{ height: `${100 - (y.gates / y.lead) * 100 - Math.max(3, (y.build / y.lead) * 100)}%` }}
                  />
                  <span className="block w-full bg-signal" style={{ height: `${Math.max(3, (y.build / y.lead) * 100)}%` }} />
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-1.5 flex gap-1.5 font-mono text-[10px] text-fg-4 sm:gap-2" dir="ltr" aria-hidden="true">
          {YEAR.map((y) => (
            <span key={y.m} className={`flex-1 text-center tabular-nums ${y.m === sel ? "text-accent" : ""}`}>
              {y.m}
            </span>
          ))}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-fg-3">
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-danger/55" aria-hidden="true" /> Waiting to start: <span className="font-mono tabular-nums text-fg-2">{fmtDays(cur.backlog)}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-accent/80" aria-hidden="true" /> In the gates: <span className="font-mono tabular-nums text-fg-2">{fmtDays(cur.gates)}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-signal" aria-hidden="true" /> The factory’s afternoon: <span className="font-mono tabular-nums text-fg-2">4 h, every month</span>
          </li>
        </ul>

        {/* Change 28 */}
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[12.5px] text-fg-2">Change 28, which needs the core’s data: ready to live</p>
          <div className="mt-2 flex gap-1.5 sm:gap-2" dir="ltr" aria-label={`Change 28 waits for the core's quarterly release until month ${C28_FREE_FROM}, then goes live the next day.`} role="img">
            {YEAR.map((y) => {
              const free = y.m >= C28_FREE_FROM;
              return (
                <span
                  key={y.m}
                  className={`flex h-7 flex-1 items-center justify-center rounded-md font-mono text-[9px] sm:text-[10px] ${free ? "bg-signal/80 text-on-accent" : "bg-danger/25 text-danger"} ${y.m === sel ? "ring-2 ring-accent ring-offset-1 ring-offset-surface" : ""}`}
                >
                  <span className="hidden sm:inline">{free ? "1d" : "≤13w"}</span>
                </span>
              );
            })}
          </div>
          <p className="mt-1.5 text-[11.5px] text-fg-4">Up to a quarter while it waits for the core; the next day once the edge quotes service is live (Essay 5).</p>
        </div>

        <p className="mt-5 rounded-xl border border-line bg-bg-2/40 px-4 py-3 text-[13px] leading-relaxed text-fg-2">
          From <strong className="font-semibold text-fg">{fmtDays(LEAD_START)}</strong> to <strong className="font-semibold text-danger">{fmtDays(LEAD_PEAK)}</strong> at month{" "}
          {PEAK_MONTH}, then down to <strong className="font-semibold text-signal">{fmtDays(LEAD_END)}</strong>. The factory’s own part, one afternoon, never changed.
        </p>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Tap a month. The gate times come from the second essay’s model; the backlog waits and the timing of each fix are illustrative."}
      </figcaption>
    </figure>
  );
}
