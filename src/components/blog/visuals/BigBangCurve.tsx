"use client";

import { useRef } from "react";
import { CAPABILITIES } from "./coreModel";
import { useStepsOnView } from "./useMotionReady";

/**
 * "Big bang vs. strangler": value delivered over 36 months, and how many customers are exposed on the day of each
 * switch. A big-bang replacement delivers nothing until cut-over, then exposes everyone at once. A strangler
 * delivers value every quarter (the same steps as the Strangler Fig visual), each step rolled out in rings,
 * starting with about 1% of customers. Illustrative; the TSB note below the chart is factual (FCA, 2022).
 */

const MONTHS = 36;
const CUTOVER = 30;
const W = 600;
const H = 200;
const x = (m: number) => (m / MONTHS) * W;
const y = (v: number) => H - (v / 100) * (H - 16) - 2;

const STRANGLER_STEPS = CAPABILITIES.map((c) => ({ month: c.quarter * 3, add: c.share }));

function stranglerPath() {
  let v = 0;
  let d = `M ${x(0)} ${y(0)}`;
  for (const s of STRANGLER_STEPS) {
    d += ` L ${x(s.month)} ${y(v)}`;
    v += s.add;
    d += ` L ${x(s.month)} ${y(v)}`;
  }
  return `${d} L ${x(MONTHS)} ${y(v)}`;
}
const BIGBANG = `M ${x(0)} ${y(0)} L ${x(CUTOVER)} ${y(0)} L ${x(CUTOVER)} ${y(100)} L ${x(MONTHS)} ${y(100)}`;
const STRANGLER = stranglerPath();

export default function BigBangCurve({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const drawn = useStepsOnView(ref, 1, 200, 0.45) >= 1;
  const draw = (len: number) => ({
    strokeDasharray: len,
    strokeDashoffset: drawn ? 0 : len,
    transition: "stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
  });

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="eyebrow text-fg-4">Replace it or surround it · 36 months</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            <li className="flex items-center gap-1.5 text-fg-2">
              <span className="h-0.5 w-5 rounded-full bg-danger" aria-hidden="true" /> Big-bang replacement
            </li>
            <li className="flex items-center gap-1.5 text-fg-2">
              <span className="h-0.5 w-5 rounded-full bg-signal" aria-hidden="true" /> Strangler fig
            </li>
          </ul>
        </div>

        {/* Value delivered */}
        <p className="mt-4 text-[12px] text-fg-3">Value in customers’ hands</p>
        <div className="relative mt-1" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Value delivered over 36 months. The big-bang replacement delivers nothing until month 30, then everything at once. The strangler delivers value every quarter from month 3 and reaches the same point by month 24.">
            {[0, 50, 100].map((v) => (
              <line key={v} x1={0} x2={W} y1={y(v)} y2={y(v)} style={{ stroke: "var(--c-line)" }} strokeWidth={1} strokeDasharray={v === 0 ? undefined : "3 5"} />
            ))}
            <path d={BIGBANG} fill="none" style={{ stroke: "var(--c-danger)", ...draw(1400) }} strokeWidth={2.5} strokeLinejoin="round" />
            <path d={STRANGLER} fill="none" style={{ stroke: "var(--c-signal)", ...draw(1400) }} strokeWidth={2.5} strokeLinejoin="round" />
          </svg>
          <span className="absolute -translate-x-full whitespace-nowrap pe-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-danger" style={{ left: `${(CUTOVER / MONTHS) * 100}%`, top: "52%" }}>
            Nothing until cut-over
          </span>
        </div>

        {/* Customers exposed on the day */}
        <p className="mt-4 text-[12px] text-fg-3">Customers exposed on the day of each switch</p>
        <div className="relative mt-1 h-16 border-b border-line" dir="ltr" aria-hidden="true">
          {STRANGLER_STEPS.map((s) => (
            <span
              key={s.month}
              className="absolute bottom-0 w-1.5 -translate-x-1/2 rounded-t-sm bg-signal transition-[height] duration-700"
              style={{ left: `${(s.month / MONTHS) * 100}%`, height: drawn ? "6%" : "0%", minHeight: drawn ? 3 : 0 }}
            />
          ))}
          <span
            className="absolute bottom-0 w-2.5 -translate-x-1/2 rounded-t-sm bg-danger transition-[height] delay-300 duration-700"
            style={{ left: `${(CUTOVER / MONTHS) * 100}%`, height: drawn ? "100%" : "0%" }}
          />
          <span className="absolute top-0 -translate-x-full whitespace-nowrap pe-2 font-mono text-[10px] uppercase tracking-[0.1em] text-danger" style={{ left: `${(CUTOVER / MONTHS) * 100}%` }}>
            Every customer, one weekend
          </span>
          <span className="absolute bottom-2 start-0 font-mono text-[10px] uppercase tracking-[0.1em] text-signal">≈1% at each step</span>
        </div>
        <div className="relative mt-1.5 h-4 font-mono text-[10px] text-fg-4" dir="ltr" aria-hidden="true">
          {[0, 12, 24, 36].map((m, i) => (
            <span key={m} className={`absolute top-0 whitespace-nowrap ${i === 0 ? "" : i === 3 ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: `${(m / MONTHS) * 100}%` }}>
              {m === 0 ? "Month 0" : `${m}`}
            </span>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-danger/35 bg-danger/[0.06] px-4 py-3.5">
          <p className="eyebrow text-danger">A real big bang · April 2018</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-fg-2">
            When TSB moved its customer data to a new platform in one go, all its branches and a significant proportion of its 5.2 million customers were
            affected. Business as usual returned in December. It paid <strong className="font-semibold text-fg">£32.7m</strong> in redress, and UK regulators
            fined it <strong className="font-semibold text-fg">£48.65m</strong>.
          </p>
          <a
            href="https://www.fca.org.uk/news/press-releases/tsb-fined-48m-operational-resilience-failings"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4 hover:text-accent"
          >
            Source: FCA, December 2022 ↗
          </a>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "The two curves are illustrative; the strangler’s steps match the quarters in the next visual."}
      </figcaption>
    </figure>
  );
}
