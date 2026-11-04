"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { ALL_AUTO, ALL_MANUAL, AUTO_HOURS, GATES, MANUAL_HOURS, MEETING_MINUTES, fmtDuration, stepFor, type StepKind } from "./pipelineModel";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * "Change Journey": one small change (change 27) travelling from "finished" to "live", drawn to scale.
 * - before: today's route. Fifteen days, almost all of it waiting; the approval meeting itself is two minutes.
 * - after: the same change through the automated pipeline, on the same scale, then zoomed in.
 * Numbers come from pipelineModel.ts (the same model as Pipeline Gates). Server render = finished state; after
 * mount the journey replays once when it scrolls into view. Per-frame updates write to the DOM directly.
 */

type Variant = "before" | "after";
type Phase = "idle" | "zoom" | "run" | "meeting" | "done";

interface Seg {
  id: string;
  name: string;
  label: string;
  hours: number;
  kind: StepKind;
}

const segsFor = (modes: typeof ALL_MANUAL): Seg[] =>
  GATES.map((g) => {
    const { step, kind } = stepFor(g, modes, false);
    return { id: g.id, name: g.name, label: step.label, hours: step.hours, kind };
  });

const BEFORE = segsFor(ALL_MANUAL);
const AFTER = segsFor(ALL_AUTO);
const MEETING_AFTER = BEFORE.findIndex((s) => s.id === "approval");
const MEETING_AT = BEFORE.slice(0, MEETING_AFTER + 1).reduce((a, s) => a + s.hours, 0) / MANUAL_HOURS;
const MEETING_SHARE = MEETING_MINUTES / 60 / MANUAL_HOURS; // ≈ 0.0095%

interface PlanItem {
  startH: number;
  endH: number;
  t0: number;
  t1: number;
}

/** Map each segment to a playback window: long waits take longer to cross, with a floor so short steps register. */
function makePlan(segs: Seg[], spanMs: number, minMs: number, pauseAfter = -1, pauseMs = 0) {
  const total = segs.reduce((a, s) => a + s.hours, 0);
  let cum = 0;
  let t = 0;
  const items: PlanItem[] = segs.map((s, i) => {
    const dur = Math.max(minMs, (s.hours / total) * spanMs);
    const it = { startH: cum, endH: cum + s.hours, t0: t, t1: t + dur };
    cum += s.hours;
    t += dur;
    if (i === pauseAfter) t += pauseMs;
    return it;
  });
  return { total, items, endT: t };
}

function at(plan: ReturnType<typeof makePlan>, t: number, pauseAfter: number) {
  if (t >= plan.endT) return { hours: plan.total, seg: plan.items.length - 1, paused: false, done: true };
  for (let i = 0; i < plan.items.length; i++) {
    const it = plan.items[i];
    if (t < it.t0) return { hours: plan.items[i - 1]?.endH ?? 0, seg: i - 1, paused: i - 1 === pauseAfter, done: false };
    if (t < it.t1) return { hours: it.startH + ((t - it.t0) / (it.t1 - it.t0)) * (it.endH - it.startH), seg: i, paused: false, done: false };
  }
  return { hours: plan.total, seg: plan.items.length - 1, paused: false, done: true };
}

/** Short names for labels drawn inside the bar. */
const SHORT: Record<string, { manual: string; auto: string }> = {
  review: { manual: "Review", auto: "Peer review" },
  tests: { manual: "Test cycle", auto: "Tests" },
  security: { manual: "Security queue", auto: "Scans" },
  inventory: { manual: "Inventory", auto: "SBOM" },
  approval: { manual: "Change board", auto: "Policy" },
  deploy: { manual: "Window", auto: "Staged rollout" },
};

const fmtElapsed = (h: number) => (h < 0.02 ? "0 h" : fmtDuration(h));

const TONE: Record<StepKind, string> = {
  human: "bg-signal/75",
  auto: "bg-signal/75",
  manual: "bg-danger/70",
  escalated: "bg-accent/80",
};

export default function ChangeJourney({ variant = "before", caption }: { variant?: Variant; caption?: string }) {
  const isBefore = variant !== "after";
  const segs = isBefore ? BEFORE : AFTER;
  const pauseAfter = isBefore ? MEETING_AFTER : -1;
  const plan = useMemo(
    () => (isBefore ? makePlan(BEFORE, 6400, 450, MEETING_AFTER, 1900) : makePlan(AFTER, 2600, 320)),
    [isBefore]
  );

  const figRef = useRef<HTMLElement>(null);
  const inView = useInView(figRef, { amount: 0.55, once: true });
  const reduced = useReducedMotionAfterMount();

  // React-rendered state changes only a few times per run; per-frame values go straight to the DOM.
  const [phase, setPhase] = useState<Phase>("done");
  const [seg, setSeg] = useState<number>(segs.length - 1);
  const [shownHours, setShownHours] = useState<number>(plan.total);
  const tokenRef = useRef<HTMLDivElement>(null);
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const zoomTimer = useRef(0);

  function paint(hours: number) {
    if (tokenRef.current) tokenRef.current.style.left = `${(hours / plan.total) * 100}%`;
    plan.items.forEach((it, j) => {
      const el = fillRefs.current[j];
      if (el) el.style.transform = `scaleX(${Math.min(1, Math.max(0, (hours - it.startH) / (it.endH - it.startH)))})`;
    });
    if (counterRef.current) counterRef.current.textContent = fmtElapsed(hours);
  }

  function arm() {
    cancelAnimationFrame(raf.current);
    window.clearTimeout(zoomTimer.current);
    setShownHours(0);
    setSeg(-1);
    setPhase("idle");
    paint(0);
  }

  function play() {
    arm();
    const start = () => {
      setPhase("run");
      const t0 = performance.now();
      let lastSeg = -2;
      let lastPaused = false;
      const tick = (now: number) => {
        const s = at(plan, now - t0, pauseAfter);
        paint(s.hours);
        if (s.seg !== lastSeg) {
          lastSeg = s.seg;
          setSeg(s.seg);
        }
        if (s.paused !== lastPaused) {
          lastPaused = s.paused;
          setPhase(s.paused ? "meeting" : "run");
        }
        if (s.done) {
          setShownHours(plan.total);
          setPhase("done");
          return;
        }
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    };
    if (isBefore) start();
    else {
      setPhase("zoom");
      zoomTimer.current = window.setTimeout(start, 1100);
    }
  }

  // Off-screen on mount: rewind, so the journey can play when the reader arrives.
  useEffect(() => {
    if (reduced === false && !inView) arm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    if (reduced === false && inView) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, inView]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      window.clearTimeout(zoomTimer.current);
    },
    []
  );

  const done = phase === "done";
  const zoomed = !isBefore && phase !== "idle";
  const fillOf = (j: number) => Math.min(1, Math.max(0, (shownHours - plan.items[j].startH) / (plan.items[j].endH - plan.items[j].startH)));
  const title = isBefore
    ? `Finished in an afternoon. Live ${fmtDuration(MANUAL_HOURS)} later.`
    : `Same change, same scale: live in ${fmtDuration(AUTO_HOURS)}.`;
  const summary = isBefore
    ? `Change 27 today: ${fmtDuration(MANUAL_HOURS)} from finished to live. ${BEFORE.filter((s) => s.kind === "manual")
        .map((s) => `${s.label}, ${fmtDuration(s.hours)}`)
        .join("; ")}. The approval meeting itself takes ${MEETING_MINUTES} minutes.`
    : `Change 27 with evidence in the pipeline: ${fmtDuration(AUTO_HOURS)} from finished to live, against ${fmtDuration(MANUAL_HOURS)} today. ${AFTER.map(
        (s) => `${s.name}, ${fmtDuration(s.hours)}`
      ).join("; ")}.`;

  /* ------------------------------------------------------------ pieces */

  const track = (
    <div className="relative" dir="ltr">
      {/* Token: change 27 */}
      <div ref={tokenRef} aria-hidden="true" className="pointer-events-none absolute bottom-full z-10 h-0 w-0" style={{ left: `${(shownHours / plan.total) * 100}%` }}>
        <div className="absolute bottom-1.5 left-0 flex -translate-x-1/2 flex-col items-center">
          {isBefore && (
            // The meeting, as the change passes through it: to the left of the token (it happens near the end of the bar).
            <div
              className={`absolute bottom-3 right-[calc(100%+0.5rem)] w-max rounded-lg border border-line-2 bg-bg px-2.5 py-1.5 text-[12px] leading-snug text-fg-2 shadow-[var(--shadow-soft)] transition-all duration-300 ${
                phase === "meeting" ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
              }`}
            >
              <span className="italic">“Tested?” “Yes.”</span> <span className="font-medium text-fg">Approved. Next.</span>
            </div>
          )}
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-on-accent shadow-[var(--shadow-soft)]">27</span>
          <span className="h-2.5 w-px bg-accent" />
        </div>
      </div>

      <div className="relative h-9 overflow-hidden rounded-lg bg-line/70" role="img" aria-label={summary}>
        {segs.map((s, j) => {
          const left = (plan.items[j].startH / plan.total) * 100;
          const width = (s.hours / plan.total) * 100;
          const isLast = j === segs.length - 1;
          return (
            <div key={s.id} className="absolute inset-y-0" style={{ left: `${left}%`, width: `${width}%` }}>
              <div
                ref={(el) => {
                  fillRefs.current[j] = el;
                }}
                className={`absolute inset-y-0 left-0 origin-left ${isLast ? "right-0" : "right-[2px]"} ${TONE[s.kind]} ${
                  s.kind === "manual" ? "bg-[repeating-linear-gradient(135deg,transparent_0_6px,color-mix(in_oklab,var(--c-bg)_22%,transparent)_6px_9px)]" : ""
                }`}
                style={{ transform: `scaleX(${fillOf(j)})` }}
              />
              {/* Inline label for segments wide enough to hold one */}
              {width > 12 && (
                <span aria-hidden="true" className="absolute inset-0 hidden items-center px-2.5 text-[11px] font-medium text-on-accent sm:flex">
                  <span className="truncate">{SHORT[s.id]?.[isBefore ? "manual" : "auto"] ?? s.name}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const legend = (
    <ol className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {segs.map((s, j) => {
        const active = !done && phase !== "idle" && j === seg;
        return (
          <li
            key={s.id}
            className={`flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-[12.5px] leading-snug transition-colors duration-300 ${
              active ? "bg-surface-2" : ""
            }`}
          >
            <span aria-hidden="true" className={`mt-1 size-2.5 shrink-0 rounded-[3px] ${TONE[s.kind]}`} />
            <span className="min-w-0 flex-1">
              <span className="font-medium text-fg">{s.name}</span>
              <span className="text-fg-3"> · {s.label}</span>
            </span>
            <span className={`shrink-0 font-mono text-[12px] tabular-nums ${s.kind === "manual" ? "text-danger" : "text-fg-3"}`}>{fmtDuration(s.hours)}</span>
          </li>
        );
      })}
    </ol>
  );

  return (
    <figure ref={figRef} className="not-prose my-14 font-sans" data-phase={phase}>
      <div className="rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow text-fg-4">{isBefore ? "Change 27 · the journey today" : "Change 27 · the second time"}</p>
            <p className="mt-2 max-w-md font-display text-[1.45rem] leading-snug text-fg">{title}</p>
          </div>
          <div className="sm:text-end">
            <p className="eyebrow text-fg-4">Since it was finished</p>
            <p className="mt-1 font-display text-[2rem] leading-none tabular-nums text-fg">
              <span ref={counterRef}>{fmtElapsed(shownHours)}</span>
            </p>
          </div>
        </div>

        {isBefore ? (
          <div className="relative mt-14">
            {track}
            {/* Axis */}
            <div className="relative mt-2 h-4 font-mono text-[10.5px] text-fg-4" dir="ltr" aria-hidden="true">
              {[0, 168, 336].map((h, i) => (
                <span key={h} className={`absolute top-0 whitespace-nowrap ${i === 0 ? "" : "-translate-x-1/2"}`} style={{ left: `${(h / MANUAL_HOURS) * 100}%` }}>
                  {i === 0 ? "Finished" : i === 1 ? "1 week" : "2 weeks"}
                </span>
              ))}
            </div>
            {/* Meeting marker: a line through the bar, labelled underneath */}
            <div className="relative h-5" dir="ltr" aria-hidden="true">
              <span className="absolute bottom-full z-[5] h-[calc(2.25rem+1.5rem)] w-px bg-accent" style={{ left: `${MEETING_AT * 100}%` }} />
              <span
                className="absolute top-0.5 -translate-x-full whitespace-nowrap pe-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent"
                style={{ left: `${MEETING_AT * 100}%` }}
              >
                Approval meeting · {MEETING_MINUTES} min
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {/* Same scale */}
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[12.5px]">
                <span className="text-fg-3">Today</span>
                <span className="font-mono tabular-nums text-danger">{fmtDuration(MANUAL_HOURS)}</span>
              </div>
              <div className="relative h-5 overflow-hidden rounded-md" dir="ltr">
                {BEFORE.map((s, j) => {
                  const startH = BEFORE.slice(0, j).reduce((a, x) => a + x.hours, 0);
                  return (
                    <div
                      key={s.id}
                      className={`absolute inset-y-0 ${TONE[s.kind]} opacity-55`}
                      style={{ left: `${(startH / MANUAL_HOURS) * 100}%`, width: `calc(${(s.hours / MANUAL_HOURS) * 100}% - 2px)` }}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[12.5px]">
                <span className="text-fg-2">With evidence in the pipeline</span>
                <span className="font-mono tabular-nums text-signal">{fmtDuration(AUTO_HOURS)}</span>
              </div>
              <div className="relative h-5 rounded-md bg-line/50" dir="ltr">
                <div
                  className={`absolute inset-y-0 left-0 origin-left rounded-[3px] bg-signal transition-transform duration-700 ${zoomed || done ? "scale-x-100" : "scale-x-0"}`}
                  style={{ width: `max(4px, ${(AUTO_HOURS / MANUAL_HOURS) * 100}%)` }}
                />
              </div>
              {/* Zoom funnel from the sliver to the detail bar */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                className={`block h-12 w-full transition-opacity duration-700 ${zoomed || done ? "opacity-100" : "opacity-0"}`}
              >
                <polygon points={`0,0 ${Math.max(0.8, (AUTO_HOURS / MANUAL_HOURS) * 100)},0 100,100 0,100`} style={{ fill: "var(--c-signal)", fillOpacity: 0.09 }} />
                <line x1={Math.max(0.8, (AUTO_HOURS / MANUAL_HOURS) * 100)} y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" style={{ stroke: "var(--c-signal)", strokeOpacity: 0.45, strokeDasharray: "3 3" }} />
              </svg>
              <p className="eyebrow mb-10 text-fg-4">Zoomed in: the {fmtDuration(AUTO_HOURS)}</p>
              {track}
            </div>
          </div>
        )}

        {legend}

        {/* Takeaways */}
        <div className={`mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}>
          {(isBefore
            ? [
                { v: fmtDuration(MANUAL_HOURS), l: "from finished to customers", tone: "text-danger" },
                { v: `${MEETING_MINUTES} min`, l: `spent approving it: less than ${MEETING_SHARE < 0.0001 ? "0.01" : (MEETING_SHARE * 100).toFixed(2)}% of the journey`, tone: "text-accent" },
              ]
            : [
                { v: fmtDuration(AUTO_HOURS), l: "from finished to customers", tone: "text-signal" },
                { v: "6 of 6", l: "controls with evidence attached automatically", tone: "text-signal" },
              ]
          ).map((x) => (
            <div key={x.l} className="bg-surface px-4 py-3.5">
              <p className={`font-display text-[1.7rem] leading-none tabular-nums ${x.tone}`}>{x.v}</p>
              <p className="mt-1.5 text-[12px] leading-snug text-fg-3">{x.l}</p>
            </div>
          ))}
        </div>

        {reduced === false && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={play}
              disabled={!done}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-0 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> Replay
            </button>
          </div>
        )}
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption ||
          (isBefore
            ? "Drawn to scale. Illustrative model with round numbers, the same one used in the interactive model below."
            : "Both bars use the same scale, from finished to live. Illustrative model with round numbers.")}
      </figcaption>
    </figure>
  );
}
