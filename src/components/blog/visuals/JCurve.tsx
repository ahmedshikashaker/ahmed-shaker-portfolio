"use client";

import { useRef } from "react";
import { ACTUAL, EXPECTED, MONTHS } from "./yearModel";
import { useStepsOnView } from "./useMotionReady";

/**
 * "The J-curve": customer-visible value over the first year, as boards usually expect it (a straight line) and as
 * it typically arrives (a dip, then a steep rise). The gap between them, where boards lose patience, is shaded.
 * Illustrative curve; the two research notes beneath it are sourced (DORA 2018; Brynjolfsson, Rock & Syverson 2021).
 */

const W = 600;
const H = 230;
const PAD = 8;
const x = (m: number) => PAD + (m / MONTHS) * (W - 2 * PAD);
const y = (v: number) => H - PAD - (v / 100) * (H - 2 * PAD);
const r1 = (n: number) => Math.round(n * 10) / 10;

type P = readonly [number, number];

/** Smooth curve through the points (Catmull–Rom converted to cubic Béziers). Starts with M, or continues with L. */
function smooth(p: P[], move = true) {
  let d = `${move ? "M" : " L"} ${r1(p[0][0])} ${r1(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[Math.min(p.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${r1(c1[0])} ${r1(c1[1])}, ${r1(c2[0])} ${r1(c2[1])}, ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

const ACTUAL_PTS: P[] = ACTUAL.map((v, i) => [x(i), y(v)] as const);
const ACTUAL_PATH = smooth(ACTUAL_PTS);
const EXPECTED_PATH = `M ${r1(x(0))} ${r1(y(EXPECTED[0]))} L ${r1(x(MONTHS))} ${r1(y(EXPECTED[MONTHS]))}`;
// The patience gap: along the expected line, then back along the actual curve.
const GAP_PATH = `${EXPECTED_PATH}${smooth([...ACTUAL_PTS].reverse(), false)} Z`;

export default function JCurve({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const drawn = useStepsOnView(ref, 1, 250, 0.45) >= 1;
  const stroke = (len: number, delay = 0) => ({
    strokeDasharray: len,
    strokeDashoffset: drawn ? 0 : len,
    transition: `stroke-dashoffset 1.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="eyebrow text-fg-4">Value customers can see · year one</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            <li className="flex items-center gap-1.5 text-fg-2">
              <span className="h-0 w-5 border-t-2 border-dashed border-fg-3" aria-hidden="true" /> What the board expects
            </li>
            <li className="flex items-center gap-1.5 text-fg-2">
              <span className="h-0.5 w-5 rounded-full bg-accent" aria-hidden="true" /> What usually happens
            </li>
          </ul>
        </div>

        <div className="relative mt-4" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Customer-visible value over twelve months. Boards expect a straight line. The usual result rises a little, dips around months three to five, then climbs steeply and catches up by month twelve. The gap between the two is largest around months four to six.">
            {[0, 50, 100].map((v) => (
              <line key={v} x1={PAD} x2={W - PAD} y1={y(v)} y2={y(v)} style={{ stroke: "var(--c-line)" }} strokeWidth={1} strokeDasharray={v === 0 ? undefined : "3 5"} />
            ))}
            {/* months 4–6: where boards lose patience */}
            <rect x={x(3.5)} y={PAD} width={x(6.5) - x(3.5)} height={H - 2 * PAD} style={{ fill: "var(--c-danger)", fillOpacity: drawn ? 0.07 : 0, transition: "fill-opacity 0.8s ease 1.2s" }} />
            <path d={GAP_PATH} style={{ fill: "var(--c-accent)", fillOpacity: drawn ? 0.1 : 0, transition: "fill-opacity 0.8s ease 1s" }} />
            <path d={EXPECTED_PATH} fill="none" style={{ stroke: "var(--c-fg-3)", strokeDasharray: "6 6", opacity: drawn ? 1 : 0, transition: "opacity 0.6s ease" }} strokeWidth={2} />
            <path d={ACTUAL_PATH} fill="none" style={{ stroke: "var(--c-accent)", ...stroke(1200, 0.2) }} strokeWidth={3} strokeLinecap="round" />
            <circle cx={x(4)} cy={y(ACTUAL[4])} r={5} style={{ fill: "var(--c-danger)", opacity: drawn ? 1 : 0, transition: "opacity 0.4s ease 1.1s" }} />
          </svg>
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-danger"
            style={{ left: `${(x(5) / W) * 100}%`, top: "6%" }}
          >
            Where boards lose patience
          </span>
          <span className="absolute whitespace-nowrap ps-2 font-mono text-[10px] uppercase tracking-[0.1em] text-danger" style={{ left: `${(x(4) / W) * 100}%`, top: `${(y(ACTUAL[4]) / H) * 100 + 4}%` }}>
            Bottom of the J
          </span>
          <span className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-accent max-sm:hidden" style={{ left: `${(x(7.3) / W) * 100}%`, top: `${(y(44) / H) * 100}%` }}>
            The patience gap
          </span>
        </div>
        <div className="relative mt-1.5 h-4 font-mono text-[10px] text-fg-4" dir="ltr" aria-hidden="true">
          {[0, 3, 6, 9, 12].map((m, i) => (
            <span key={m} className={`absolute top-0 whitespace-nowrap ${i === 0 ? "" : i === 4 ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: `${(x(m) / W) * 100}%` }}>
              {m === 0 ? "Month 0" : m}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-bg-2/40 px-4 py-3.5">
            <p className="eyebrow text-fg-4">DORA · State of DevOps 2018</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-fg-2">
              A “J-curve of transformation”: medium performers did <strong className="font-semibold text-fg">more</strong> manual work than low performers.{" "}
              <span className="font-mono tabular-nums text-danger">75%</span> of their change approvals were manual, against <span className="font-mono tabular-nums">40%</span> for low
              performers.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-bg-2/40 px-4 py-3.5">
            <p className="eyebrow text-fg-4">Brynjolfsson, Rock &amp; Syverson · 2021</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-fg-2">
              The “productivity J-curve”: new technology needs intangible investment that measurements miss, so results look{" "}
              <strong className="font-semibold text-fg">worse early and better later</strong>.
            </p>
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "The curve is illustrative. Its shape is the one both research notes describe."}
      </figcaption>
    </figure>
  );
}
