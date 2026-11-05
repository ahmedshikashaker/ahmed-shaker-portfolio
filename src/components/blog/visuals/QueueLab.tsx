"use client";

import { useId, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

/**
 * "Queue Lab": an explorable model of a digital factory feeding three boundary stages.
 *
 * Each stage is modelled as a single-server queue (M/M/1). With arrival rate λ (changes per week) and
 * capacity μ (changes per week), utilisation ρ = λ/μ and the average time a change spends at the stage is
 *   W = (1/μ) / (1 − ρ)
 * Lead time = fixed time in the factory + Σ W. Work waiting at the boundary follows Little's Law: L = λ · ΣW.
 * Everything is a closed-form formula, so every reader sees exactly the same numbers.
 */

const STAGES = ["Integration", "Risk & compliance", "Go-to-market"] as const;
const BASE_CAPACITY = 5;
const BOOST = 4;
const FACTORY_WEEKS = 6;
const BAR_SCALE_WEEKS = 30;
const MIN_LAMBDA = 1;
const MAX_LAMBDA = 8;

type Boosts = [boolean, boolean, boolean];

interface Preset {
  id: string;
  label: string;
  lambda: number;
  boosts: Boosts;
}

const PRESETS: Preset[] = [
  { id: "today", label: "Today · 80% busy", lambda: 4, boosts: [false, false, false] },
  { id: "push", label: "Push to 95%", lambda: 4.75, boosts: [false, false, false] },
  { id: "double", label: "Double the factory", lambda: 8, boosts: [false, false, false] },
  { id: "fund", label: "Double it and fund the boundary", lambda: 8, boosts: [true, true, true] },
];

function fmtWeeks(w: number) {
  if (!Number.isFinite(w)) return "∞";
  return w < 10 ? w.toFixed(1) : Math.round(w).toString();
}

function model(lambda: number, boosts: Boosts) {
  const stages = STAGES.map((name, i) => {
    const mu = BASE_CAPACITY + (boosts[i] ? BOOST : 0);
    const rho = lambda / mu;
    const w = rho < 1 ? 1 / mu / (1 - rho) : Infinity;
    const l = Number.isFinite(w) ? lambda * w : Infinity;
    return { name, mu, rho, w, l };
  });
  const boundary = stages.reduce((s, x) => s + x.w, 0);
  const total = FACTORY_WEEKS + boundary;
  const waiting = Number.isFinite(boundary) ? lambda * boundary : Infinity;
  const bottleneck = stages.reduce((b, s, i) => (s.rho > stages[b].rho ? i : b), 0);
  return { stages, boundary, total, waiting, bottleneck };
}

function tone(rho: number) {
  if (rho >= 1) return { bar: "bg-danger", text: "text-danger", label: "Overloaded" };
  if (rho >= 0.9) return { bar: "bg-danger", text: "text-danger", label: "Saturated" };
  if (rho >= 0.8) return { bar: "bg-accent", text: "text-accent", label: "Busy" };
  return { bar: "bg-signal", text: "text-signal", label: "Has slack" };
}

/* ------------------------------------------------------------ Utilisation curve */

function Curve({ rho }: { rho: number }) {
  const W = 300;
  const H = 170;
  const pad = { l: 34, r: 10, t: 12, b: 30 };
  const yMax = 22; // multiplier axis (1 / (1 − ρ))
  const x = (r: number) => pad.l + r * (W - pad.l - pad.r);
  const y = (m: number) => H - pad.b - (Math.min(m, yMax) / yMax) * (H - pad.t - pad.b);
  const pts: string[] = [];
  for (let r = 0; r <= 0.955; r += 0.005) pts.push(`${x(r).toFixed(1)},${y(1 / (1 - r)).toFixed(1)}`);
  const clamped = Math.min(rho, 0.955);
  const mult = rho < 1 ? 1 / (1 - rho) : Infinity;
  const off = mult > yMax;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Utilisation curve. At ${Math.round(rho * 100)}% busy, a change takes ${Number.isFinite(mult) ? mult.toFixed(1) : "infinitely many"} times as long as the work itself.`}>
      {[0, 5, 10, 15, 20].map((m) => (
        <g key={m}>
          <line x1={pad.l} x2={W - pad.r} y1={y(m)} y2={y(m)} style={{ stroke: "var(--c-line)" }} />
          <text x={pad.l - 6} y={y(m) + 3.5} textAnchor="end" className="font-mono" style={{ fill: "var(--c-fg-4)", fontSize: 9 }}>
            {m}×
          </text>
        </g>
      ))}
      {[0, 0.5, 0.8, 0.95].map((r) => (
        <text key={r} x={x(r)} y={H - pad.b + 14} textAnchor="middle" className="font-mono" style={{ fill: "var(--c-fg-4)", fontSize: 9 }}>
          {Math.round(r * 100)}%
        </text>
      ))}
      <text x={(W + pad.l) / 2} y={H - 3} textAnchor="middle" className="font-mono uppercase" style={{ fill: "var(--c-fg-4)", fontSize: 8.5, letterSpacing: "0.14em" }}>
        How busy the stage is
      </text>
      <polyline points={pts.join(" ")} fill="none" style={{ stroke: "var(--c-accent)" }} strokeWidth={2} />
      <line x1={x(clamped)} x2={x(clamped)} y1={pad.t} y2={H - pad.b} style={{ stroke: "var(--c-line-3)" }} strokeDasharray="3 3" />
      <circle cx={x(clamped)} cy={off ? pad.t : y(mult)} r={5} style={{ fill: rho >= 0.9 ? "var(--c-danger)" : "var(--c-accent)", stroke: "var(--c-bg)" }} strokeWidth={2} />
      {off && (
        <text x={x(clamped) - 8} y={pad.t + 4} textAnchor="end" className="font-mono" style={{ fill: "var(--c-danger)", fontSize: 10 }}>
          {Number.isFinite(mult) ? `${Math.round(mult)}× ↑` : "∞ ↑"}
        </text>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------ Component */

export default function QueueLab({ caption }: { caption?: string }) {
  const [lambda, setLambda] = useState(4);
  const [boosts, setBoosts] = useState<Boosts>([false, false, false]);
  const sliderId = useId();
  const m = useMemo(() => model(lambda, boosts), [lambda, boosts]);
  const activePreset = PRESETS.find((p) => p.lambda === lambda && p.boosts.every((b, i) => b === boosts[i]))?.id;
  const overloaded = !Number.isFinite(m.boundary);
  const flowSeconds = (1.6 * 4) / lambda; // particle speed proportional to throughput

  const factoryPct = (FACTORY_WEEKS / BAR_SCALE_WEEKS) * 100;
  const boundaryPct = overloaded ? 100 - factoryPct : Math.min(100 - factoryPct, (m.boundary / BAR_SCALE_WEEKS) * 100);
  const offScale = overloaded || m.total > BAR_SCALE_WEEKS;

  const summary = overloaded
    ? `At ${lambda} changes a week, at least one boundary stage is overloaded. The queue grows without limit and lead time never settles.`
    : `At ${lambda} changes a week, lead time is ${fmtWeeks(m.total)} weeks: ${FACTORY_WEEKS} in the factory and ${fmtWeeks(m.boundary)} waiting at the boundary, with about ${Math.round(m.waiting)} changes in the queue.`;

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="eyebrow text-fg-3">Interactive model · Where the queue goes</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setLambda(4);
              setBoosts([false, false, false]);
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> Reset
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 border-b border-line px-5 py-4 sm:px-6" role="group" aria-label="Scenarios">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={activePreset === p.id}
              onClick={() => {
                setLambda(p.lambda);
                setBoosts(p.boosts);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                activePreset === p.id
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line-2 text-fg-2 hover:border-line-3 hover:text-fg"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="px-5 pt-5 sm:px-6">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={sliderId} className="text-[13.5px] font-medium text-fg">
              Factory output
            </label>
            <span className="font-mono text-[13px] tabular-nums text-accent">{lambda.toFixed(2)} changes / week</span>
          </div>
          <input
            id={sliderId}
            type="range"
            suppressHydrationWarning
            min={MIN_LAMBDA}
            max={MAX_LAMBDA}
            step={0.25}
            value={lambda}
            onChange={(e) => setLambda(Number(e.target.value))}
            aria-valuetext={`${lambda} changes per week`}
            className="ql-range mt-2 w-full"
          />
          <div className="flex justify-between font-mono text-[10px] text-fg-4">
            <span>{MIN_LAMBDA}</span>
            <span>Each stage clears {BASE_CAPACITY} / week unless funded</span>
            <span>{MAX_LAMBDA}</span>
          </div>
        </div>

        {/* Pipeline */}
        <div className="grid gap-2 px-5 py-6 sm:grid-cols-[minmax(0,0.8fr)_repeat(3,minmax(0,1fr))] sm:gap-3 sm:px-6">
          <div className="flex flex-col justify-between rounded-xl border border-accent/40 bg-accent/[0.07] p-3.5">
            <p className="eyebrow text-accent">Factory</p>
            <p className="mt-2 font-display text-[1.6rem] leading-none tabular-nums text-fg">{FACTORY_WEEKS} wk</p>
            <p className="mt-1.5 text-[11.5px] leading-snug text-fg-3">Build time per change. Fixed: more squads, same craft.</p>
          </div>
          {m.stages.map((s, i) => {
            const t = tone(s.rho);
            const shownQueue = Number.isFinite(s.l) ? Math.min(12, Math.round(s.l)) : 12;
            return (
              <div key={s.name} className="relative">
                {/* connector with moving work */}
                <div
                  aria-hidden="true"
                  className="ql-flow absolute -start-3 top-1/2 hidden h-1.5 w-3 -translate-y-1/2 sm:block"
                  style={{ animationDuration: `${flowSeconds}s` }}
                  data-stalled={s.rho >= 1}
                />
                <div
                  aria-hidden="true"
                  className="ql-flow-v mx-auto -mt-2 mb-0 h-2 w-1.5 sm:hidden"
                  style={{ animationDuration: `${flowSeconds}s` }}
                  data-stalled={s.rho >= 1}
                />
                <div className={`h-full rounded-xl border p-3.5 transition-colors ${s.rho >= 0.9 ? "border-danger/45" : "border-line-2"} bg-bg/40`}>
                  <p className="eyebrow text-fg-3 sm:min-h-[2.8em]">{s.name}</p>
                  <span className={`text-[11px] font-medium ${t.text}`}>{t.label}</span>
                  {/* queue */}
                  <div className="mt-2.5 flex min-h-[18px] flex-wrap items-center gap-[3px]" aria-hidden="true">
                    {Array.from({ length: shownQueue }, (_, k) => (
                      <span key={k} className={`size-[7px] rounded-full ${s.rho >= 0.9 ? "bg-danger/80" : "bg-fg-3/70"}`} />
                    ))}
                    {!Number.isFinite(s.l) && <span className="ms-1 font-mono text-[11px] text-danger">+∞</span>}
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line">
                    <div className={`h-full rounded-full transition-[width] duration-500 ${t.bar}`} style={{ width: `${Math.min(100, s.rho * 100)}%` }} />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between text-[12px] tabular-nums">
                    <span className="text-fg-3">{Math.round(s.rho * 100)}% busy</span>
                    <span className={`font-medium ${Number.isFinite(s.w) ? "text-fg" : "text-danger"}`}>{fmtWeeks(s.w)} wk</span>
                  </div>
                  <button
                    type="button"
                    aria-pressed={boosts[i]}
                    onClick={() => setBoosts((b) => b.map((v, j) => (j === i ? !v : v)) as Boosts)}
                    className={`mt-3 w-full rounded-md border px-2 py-1.5 text-[11.5px] transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                      boosts[i] ? "border-signal/50 bg-signal/10 text-signal" : "border-line-2 text-fg-3 hover:text-fg"
                    }`}
                  >
                    {boosts[i] ? `Funded · clears ${s.mu} / wk` : `Fund this stage (+${BOOST} / wk)`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Readouts */}
        <div className="grid gap-px border-t border-line bg-line md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="bg-surface px-5 py-5 sm:px-6">
            <p className="eyebrow text-fg-4">Lead time · approved idea to customer</p>
            <p className={`mt-2 font-display text-[2.6rem] leading-none tabular-nums ${overloaded ? "text-danger" : "text-fg"}`}>
              {overloaded ? "Never settles" : `${fmtWeeks(m.total)} weeks`}
            </p>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="h-full bg-fg-3/60" style={{ width: `${factoryPct}%` }} />
              <div
                className={`h-full transition-[width] duration-500 ${overloaded || m.boundary > 10 ? "bg-danger" : "bg-accent"}`}
                style={{ width: `${boundaryPct}%` }}
              />
            </div>
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-[11.5px] text-fg-3">
              <span>
                <span className="me-1.5 inline-block size-2 rounded-full bg-fg-3/60 align-middle" />
                Factory {FACTORY_WEEKS} wk
              </span>
              <span>
                <span className={`me-1.5 inline-block size-2 rounded-full align-middle ${overloaded || m.boundary > 10 ? "bg-danger" : "bg-accent"}`} />
                Boundary {fmtWeeks(m.boundary)} wk{offScale ? " (off scale)" : ""}
              </span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-fg-2">
              Changes waiting at the boundary right now:{" "}
              <strong className="font-semibold tabular-nums text-fg">{overloaded ? "growing every week" : Math.round(m.waiting)}</strong>
              <span className="text-fg-4"> · Little&rsquo;s Law: waiting = output × time</span>
            </p>
          </div>
          <div className="bg-surface px-5 py-5 sm:px-6">
            <p className="eyebrow text-fg-4">Why it bends: time to clear vs. work itself</p>
            <div className="mt-2">
              <Curve rho={m.stages[m.bottleneck].rho} />
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {summary}
        </p>

        <details className="group border-t border-line px-5 py-4 text-[13px] leading-relaxed text-fg-3 sm:px-6">
          <summary className="cursor-pointer list-none font-medium text-fg-2 marker:hidden hover:text-fg">
            <span className="me-2 inline-block transition-transform group-open:rotate-90">›</span>
            How this model works
          </summary>
          <div className="mt-3 space-y-2 ps-4">
            <p>
              Each boundary stage is a standard single-server queue. If changes arrive at rate <em>λ</em> per week and a stage can clear{" "}
              <em>μ</em> per week, it is busy a share <em>ρ = λ / μ</em> of the time, and a change spends on average{" "}
              <code className="rounded bg-line px-1 font-mono text-[12px] text-fg-2">(1/μ) ÷ (1 − ρ)</code> weeks there, waiting plus being worked on.
            </p>
            <p>
              Lead time is the factory&rsquo;s fixed {FACTORY_WEEKS} weeks plus the time at all three stages. The waiting count uses Little&rsquo;s
              Law (L = λW). When λ reaches μ, the formula has no finite answer: the queue grows for as long as the overload lasts.
            </p>
            <p className="text-fg-4">
              Illustrative model with round numbers. It is not data from any bank. Real arrivals and reviews are lumpier than this model assumes,
              which makes queues worse, not better.
            </p>
          </div>
        </details>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption ||
          "Try “Push to 95%”: about 19% more output, four times the wait. Then double the factory, and fund the boundary to bring lead time back."}
      </figcaption>
    </figure>
  );
}
