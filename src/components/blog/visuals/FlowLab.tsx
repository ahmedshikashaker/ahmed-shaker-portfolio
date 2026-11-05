"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotionAfterMount } from "./useMotionReady";
import { FLOW, simulateFlow, type FlowWeek, type StartPolicy } from "./measureModel";

/**
 * "Flow Lab": 26 weeks of a factory and its boundary as a cumulative flow diagram. The reader chooses how work is
 * started (everything approved vs. a work-in-progress limit) and whether the boundary is funded. Vertical distance
 * between the top and bottom lines is work in progress; horizontal distance is lead time.
 */

const W = 640;
const H = 300;
const pad = { l: 48, r: 16, t: 18, b: 34 };
const Y_MAX = 1400;

const BANDS = [
  { key: "waiting", label: "Approved, not started", fill: "var(--c-fg-4)", opacity: 0.22 },
  { key: "factory", label: "In the factory", fill: "var(--c-accent)", opacity: 0.5 },
  { key: "boundary", label: "Waiting at the boundary", fill: "var(--c-danger)", opacity: 0.45 },
  { key: "delivered", label: "Delivered to customers", fill: "var(--c-signal)", opacity: 0.55 },
] as const;

const xs = (w: number) => pad.l + (w / FLOW.weeks) * (W - pad.l - pad.r);
const ys = (v: number) => H - pad.b - (Math.min(v, Y_MAX) / Y_MAX) * (H - pad.t - pad.b);

function band(data: FlowWeek[], top: (d: FlowWeek) => number, bottom: (d: FlowWeek) => number) {
  const up = data.map((d) => `${xs(d.week).toFixed(1)},${ys(top(d)).toFixed(1)}`);
  const down = [...data].reverse().map((d) => `${xs(d.week).toFixed(1)},${ys(bottom(d)).toFixed(1)}`);
  return [...up, ...down].join(" ");
}

export default function FlowLab({ caption }: { caption?: string }) {
  const [policy, setPolicy] = useState<StartPolicy>("push");
  const [funded, setFunded] = useState(false);
  const data = useMemo(() => simulateFlow(policy, funded), [policy, funded]);
  const last = data[data.length - 1];
  const pack = data[FLOW.boardPackWeek];

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const reduced = useReducedMotionAfterMount();
  const [drawKey, setDrawKey] = useState(0);
  useEffect(() => setDrawKey((k) => k + 1), [policy, funded]);
  const animate = reduced === false && inView;
  const clipId = "flowlab-clip";

  const inProgress = last.factory + last.boundary;

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="eyebrow text-fg-3">Interactive model · 26 weeks of flow</span>
          </div>
          <span className="font-mono text-[11px] text-fg-4">
            {FLOW.approvedPerWeek} approved / week · boundary clears {funded ? FLOW.boundaryFunded : FLOW.boundaryCapacity}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
          <div className="inline-flex rounded-full border border-line-2 p-0.5" role="group" aria-label="How work is started">
            {(
              [
                ["push", "Start everything approved"],
                ["limit", `Limit work in progress (${FLOW.wipLimit})`],
              ] as [StartPolicy, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                aria-pressed={policy === v}
                onClick={() => setPolicy(v)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  policy === v ? "bg-accent text-on-accent" : "text-fg-3 hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="ms-auto inline-flex cursor-pointer items-center gap-2.5 text-[12.5px] text-fg-2">
            <span>Fund the boundary (+{FLOW.boundaryFunded - FLOW.boundaryCapacity} / week)</span>
            <button
              type="button"
              role="switch"
              aria-checked={funded}
              onClick={() => setFunded((v) => !v)}
              className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                funded ? "border-signal bg-signal" : "border-line-3 bg-line"
              }`}
            >
              <span className={`absolute top-0.5 size-3.5 rounded-full bg-bg shadow transition-[inset-inline-start] ${funded ? "start-[1.05rem]" : "start-0.5"}`} />
            </button>
          </label>
        </div>

        <div className="px-3 pt-4 sm:px-5">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Cumulative flow over ${FLOW.weeks} weeks. At week ${FLOW.weeks}: ${inProgress} changes in progress, ${last.waiting} approved but not started, ${last.throughput} delivered per week.`}>
            <defs>
              <clipPath id={clipId}>
                <motion.rect
                  key={`${drawKey}-${animate}`}
                  x={pad.l}
                  y={0}
                  height={H}
                  initial={animate ? { width: 0 } : false}
                  animate={{ width: W - pad.l - pad.r }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  width={W - pad.l - pad.r}
                />
              </clipPath>
            </defs>
            {[0, 350, 700, 1050, 1400].map((v) => (
              <g key={v}>
                <line x1={pad.l} x2={W - pad.r} y1={ys(v)} y2={ys(v)} style={{ stroke: "var(--c-line)" }} />
                <text x={pad.l - 6} y={ys(v) + 3.5} textAnchor="end" className="font-mono" style={{ fill: "var(--c-fg-4)", fontSize: 12 }}>
                  {v}
                </text>
              </g>
            ))}
            {[0, 13, 26].map((w) => (
              <text key={w} x={xs(w)} y={H - pad.b + 18} textAnchor={w === 0 ? "start" : w === FLOW.weeks ? "end" : "middle"} className="font-mono" style={{ fill: "var(--c-fg-4)", fontSize: 12 }}>
                week {w}
              </text>
            ))}
            <g clipPath={`url(#${clipId})`}>
              <polygon points={band(data, (d) => d.arrived, (d) => d.started)} style={{ fill: BANDS[0].fill, fillOpacity: BANDS[0].opacity }} />
              <polygon points={band(data, (d) => d.started, (d) => d.built)} style={{ fill: BANDS[1].fill, fillOpacity: BANDS[1].opacity }} />
              <polygon points={band(data, (d) => d.built, (d) => d.delivered)} style={{ fill: BANDS[2].fill, fillOpacity: BANDS[2].opacity }} />
              <polygon points={band(data, (d) => d.delivered, () => 0)} style={{ fill: BANDS[3].fill, fillOpacity: BANDS[3].opacity }} />
            </g>
            {/* Board pack marker */}
            <line x1={xs(FLOW.boardPackWeek)} x2={xs(FLOW.boardPackWeek)} y1={pad.t} y2={H - pad.b} style={{ stroke: "var(--c-fg-3)" }} strokeDasharray="3 4" />
            <text x={xs(FLOW.boardPackWeek) + 6} y={pad.t + 10} className="font-mono" style={{ fill: "var(--c-fg-3)", fontSize: 12.5 }}>
              board pack · {pack.factory + pack.boundary + pack.waiting} open, {Math.round(pack.leadIdea)} days
            </text>
          </svg>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 px-2 pb-3 text-[11.5px] text-fg-3">
            {BANDS.map((b) => (
              <li key={b.key} className="inline-flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-[2px]" style={{ background: b.fill, opacity: Math.min(1, b.opacity + 0.3) }} />
                {b.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
          {[
            { label: "Lead time, idea → customer", value: `${Math.round(last.leadIdea)} days`, tone: last.leadIdea > 60 ? "text-danger" : "text-fg" },
            { label: "Lead time, start → customer", value: `${Math.round(last.leadStart)} days`, tone: last.leadStart > 60 ? "text-danger" : "text-fg" },
            { label: "In progress", value: String(inProgress), tone: "text-fg" },
            {
              label: "Approved, not started",
              value: String(last.waiting),
              tone: last.waiting > 0 ? "text-accent" : "text-fg",
            },
          ].map((r) => (
            <div key={r.label} className="bg-surface px-4 py-4">
              <p className="eyebrow text-[9.5px] text-fg-4">{r.label}</p>
              <p className={`mt-1.5 font-display text-[1.6rem] leading-none tabular-nums ${r.tone}`}>{r.value}</p>
            </div>
          ))}
        </div>
        <p className="border-t border-line px-5 py-4 text-[13px] leading-relaxed text-fg-2 sm:px-6" aria-live="polite">
          {funded
            ? `The boundary now clears more than the bank approves, so queues shrink and lead time falls to ${Math.round(last.leadIdea)} days, whichever way work is started.`
            : policy === "push"
              ? `Starting everything keeps the factory busy and the board pack green, but ${FLOW.approvedPerWeek - FLOW.boundaryCapacity} more changes pile up at the boundary every week. Lead time climbs to ${Math.round(last.leadIdea)} days.`
              : `Work that's started now finishes in a predictable ${Math.round(last.leadStart)} days. The rest waits before anyone touches it, where it's cheap and visible: ${last.waiting} approved changes the board must decide not to start yet.`}
        </p>

        <details className="group border-t border-line px-5 py-4 text-[13px] leading-relaxed text-fg-3 sm:px-6">
          <summary className="cursor-pointer list-none font-medium text-fg-2 hover:text-fg">
            <span className="me-2 inline-block transition-transform group-open:rotate-90">›</span>
            How to read this chart
          </summary>
          <div className="mt-3 space-y-2 ps-4">
            <p>
              Each band counts changes in one state, stacked over time. The vertical distance from the top line to the green band is work in
              progress; the horizontal distance between them is roughly lead time. Lead time here is the average from Little&rsquo;s Law: work
              in progress divided by the changes delivered each week.
            </p>
            <p className="text-fg-4">
              Illustrative model: the bank approves {FLOW.approvedPerWeek} changes a week, squads can finish {FLOW.factoryCapacity}, the boundary
              can release {FLOW.boundaryCapacity} ({FLOW.boundaryFunded} if funded). It starts at the previous quarter&rsquo;s {FLOW.wipLimit}{" "}
              changes in progress. Not data from any bank.
            </p>
          </div>
        </details>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Try both ways of starting work, then fund the boundary. Only one of the three moves the customer's number."}
      </figcaption>
    </figure>
  );
}
