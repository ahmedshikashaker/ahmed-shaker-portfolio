"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionAfterMount } from "./useMotionReady";
import { C27_TOTAL, LEAD_MEAN, LEAD_TIMES, percentile } from "./measureModel";

/**
 * "Don't report the average": one quarter's lead times (200 changes) as a histogram. A slider turns the chart into
 * a promise ("p% of changes reach customers within N days"); the average is marked for comparison, and so is change 27.
 */

const BIN = 10;
const MAX = 250; // last bin collects everything above
const BINS = MAX / BIN + 1;

export default function LeadTimeChart({ caption }: { caption?: string }) {
  const [p, setP] = useState(85);
  const sliderId = useId();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const reduced = useReducedMotionAfterMount();
  const [grown, setGrown] = useState(true);
  useEffect(() => {
    if (reduced === false && !inView) setGrown(false);
  }, [reduced, inView]);
  useEffect(() => {
    if (reduced === false && inView) {
      const id = window.setTimeout(() => setGrown(true), 60);
      return () => window.clearTimeout(id);
    }
  }, [reduced, inView]);

  const counts = useMemo(() => {
    const c = new Array(BINS).fill(0);
    for (const x of LEAD_TIMES) c[Math.min(BINS - 1, Math.floor(x / BIN))] += 1;
    return c;
  }, []);
  const maxCount = Math.max(...counts);
  const promise = percentile(p);
  const aboveMean = LEAD_TIMES.filter((x) => x > LEAD_MEAN).length / LEAD_TIMES.length;
  const slowerThanC27 = LEAD_TIMES.filter((x) => x > C27_TOTAL).length / LEAD_TIMES.length;

  // Chart geometry
  const W = 640;
  const H = 260;
  const pad = { l: 36, r: 14, t: 34, b: 34 };
  const bw = (W - pad.l - pad.r) / BINS;
  const x = (days: number) => pad.l + (Math.min(days, MAX + BIN) / BIN) * bw;
  const y = (n: number) => H - pad.b - (n / maxCount) * (H - pad.t - pad.b);

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <span className="eyebrow text-fg-3">Lead time, idea to customer · 200 changes, one quarter</span>
          <span className="font-mono text-[11px] text-fg-4">illustrative</span>
        </div>

        <div className="px-3 pt-4 sm:px-5">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Histogram of lead times. ${p}% of changes reached customers within ${Math.round(promise)} days; the average is ${Math.round(LEAD_MEAN)} days.`}>
            {[0, 50, 100, 150, 200, 250].map((d) => (
              <text key={d} x={x(d)} y={H - pad.b + 16} textAnchor="middle" className="font-mono" style={{ fill: "var(--c-fg-4)", fontSize: 10 }}>
                {d === 250 ? "250+" : d}
              </text>
            ))}
            <text x={W - pad.r} y={H - 4} textAnchor="end" className="font-mono uppercase" style={{ fill: "var(--c-fg-4)", fontSize: 9, letterSpacing: "0.12em" }}>
              days
            </text>
            <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} style={{ stroke: "var(--c-line-2)" }} />
            {counts.map((n, i) => {
              const inside = (i + 1) * BIN <= promise + 0.0001 || i * BIN < promise;
              const h = H - pad.b - y(n);
              return (
                <rect
                  key={i}
                  x={pad.l + i * bw + 1.5}
                  width={bw - 3}
                  y={y(n)}
                  height={Math.max(0, h)}
                  rx={2}
                  style={{
                    fill: inside ? "var(--c-signal)" : "var(--c-line-3)",
                    fillOpacity: inside ? 0.75 : 1,
                    transformBox: "fill-box",
                    transformOrigin: "bottom",
                    transform: grown ? "scaleY(1)" : "scaleY(0)",
                    transition: `transform 0.6s cubic-bezier(0.16,1,0.3,1) ${grown ? i * 18 : 0}ms, fill 0.25s ease`,
                  }}
                />
              );
            })}
            {/* Average */}
            <line x1={x(LEAD_MEAN)} x2={x(LEAD_MEAN)} y1={pad.t - 6} y2={H - pad.b} style={{ stroke: "var(--c-accent)" }} strokeDasharray="4 4" strokeWidth={1.5} />
            <text x={x(LEAD_MEAN) + 6} y={pad.t - 10} className="font-mono" style={{ fill: "var(--c-accent)", fontSize: 11 }}>
              average {Math.round(LEAD_MEAN)}
            </text>
            {/* Promise */}
            <line x1={x(promise)} x2={x(promise)} y1={pad.t + 10} y2={H - pad.b} style={{ stroke: "var(--c-signal)" }} strokeWidth={2} />
            <text x={x(promise) + 6} y={pad.t + 22} className="font-mono" style={{ fill: "var(--c-signal)", fontSize: 11 }}>
              {p}% within {Math.round(promise)}
            </text>
            {/* Change 27 */}
            <line x1={x(C27_TOTAL)} x2={x(C27_TOTAL)} y1={pad.t - 14} y2={H - pad.b} style={{ stroke: "var(--c-danger)" }} strokeDasharray="2 3" strokeWidth={1.5} />
            <circle cx={x(C27_TOTAL)} cy={pad.t - 14} r={3.5} style={{ fill: "var(--c-danger)" }} />
            <text x={x(C27_TOTAL) - 8} y={pad.t - 10} textAnchor="end" className="font-mono" style={{ fill: "var(--c-danger)", fontSize: 11 }}>
              change 27
            </text>
          </svg>
        </div>

        <div className="border-t border-line px-5 py-5 sm:px-6">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={sliderId} className="text-[13.5px] font-medium text-fg">
              How sure do you want to be?
            </label>
            <span className="font-mono text-[13px] tabular-nums text-signal">{p}%</span>
          </div>
          <input
            id={sliderId}
            type="range"
            suppressHydrationWarning
            min={50}
            max={95}
            step={5}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            aria-valuetext={`${p} percent: within ${Math.round(promise)} days`}
            className="ql-range mt-2 w-full"
          />
          <p className="mt-4 font-display text-[1.45rem] leading-snug text-fg">
            “{p}% of changes reach customers within <span className="text-signal tabular-nums">{Math.round(promise)} days</span>.”
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-fg-3">
            The average, {Math.round(LEAD_MEAN)} days, promises nothing: {Math.round(aboveMean * 100)}% of changes took longer. And change 27,{" "}
            {Math.round(C27_TOTAL)} days for one line, was quicker than {Math.round(slowerThanC27 * 100)}% of the quarter&rsquo;s work.
          </p>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Move the slider. A percentile is a promise a business can plan with; an average isn't."}
      </figcaption>
    </figure>
  );
}
