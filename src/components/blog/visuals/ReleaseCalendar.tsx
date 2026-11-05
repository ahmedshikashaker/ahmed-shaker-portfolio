"use client";

import { useRef } from "react";
import { Flag, Rocket } from "lucide-react";
import { C28_LIVE, C28_READY_DAY, CORE_RELEASE_DAY, DAYS, WEEKS, edgeReleasesBetween, isEdgeRelease } from "./coreModel";
import { useStepsOnView } from "./useMotionReady";

/**
 * "Change 28's quarter": one quarter of working days. The edge releases every Thursday; the core releases once,
 * in the last week. Change 28 is ready in week 2. Coupled to the core, it waits for the core's release; decoupled,
 * it goes out with the next edge release. A cursor sweeps the wait when the calendar scrolls into view.
 * Numbers come from coreModel.ts.
 */

type Variant = "coupled" | "decoupled";
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function ReleaseCalendar({ variant = "coupled", caption }: { variant?: Variant; caption?: string }) {
  const coupled = variant !== "decoupled";
  const live = coupled ? C28_LIVE.coupled : C28_LIVE.decoupled;
  const wait = live - C28_READY_DAY;
  const missedEdge = edgeReleasesBetween(C28_READY_DAY, live);

  const ref = useRef<HTMLElement>(null);
  // The cursor advances over the wait in ~2.4 s, whatever its length.
  const steps = Math.max(1, wait);
  const step = useStepsOnView(ref, steps, Math.min(500, Math.max(40, Math.round(2400 / steps))), 0.5);
  const cursor = C28_READY_DAY + step; // last day reached
  const done = step >= steps;

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-fg-4">Change 28 · one quarter, {coupled ? "coupled to the core" : "decoupled from the core"}</p>
            <p className="mt-2 max-w-md font-display text-[1.4rem] leading-snug text-fg">
              {coupled ? "Ready in week 2. Live in week 13." : "Ready in week 2. Live the next day."}
            </p>
          </div>
          <div className="sm:text-end">
            <p className="eyebrow text-fg-4">Waiting</p>
            <p className={`mt-1 font-display text-[2rem] leading-none tabular-nums ${coupled ? "text-danger" : "text-signal"}`}>
              {Math.min(wait, step)} <span className="text-[1rem] text-fg-3">working {Math.min(wait, step) === 1 ? "day" : "days"}</span>
            </p>
          </div>
        </div>

        {/* The quarter: 13 weeks × 5 working days */}
        <div className="mt-6" dir="ltr">
          <div className="grid grid-cols-[1.9rem_repeat(13,minmax(0,1fr))] gap-[3px] sm:grid-cols-[2.4rem_repeat(13,minmax(0,1fr))]">
            <span />
            {Array.from({ length: WEEKS }, (_, w) => (
              <span key={w} className="pb-1 text-center font-mono text-[9.5px] tabular-nums text-fg-4 sm:text-[10.5px]">
                {w + 1}
              </span>
            ))}
            {WEEKDAYS.map((wd, r) => (
              <div key={wd} className="contents">
                <span className="flex items-center font-mono text-[9.5px] text-fg-4 sm:text-[10.5px]">{wd}</span>
                {Array.from({ length: WEEKS }, (_, w) => {
                  const d = w * 5 + r;
                  const edge = isEdgeRelease(d);
                  const core = d === CORE_RELEASE_DAY;
                  const ready = d === C28_READY_DAY;
                  const isLive = d === live;
                  const waiting = d > C28_READY_DAY && d < live && d <= cursor;
                  return (
                    <span
                      key={d}
                      title={core ? "Core release" : edge ? "Edge release" : undefined}
                      className={`relative flex aspect-square items-center justify-center rounded-[4px] border transition-colors duration-150 ${
                        isLive && done
                          ? "border-signal bg-signal/80 text-on-accent"
                          : ready
                            ? "border-accent bg-accent/80 text-on-accent"
                            : core
                              ? "border-accent/70 bg-accent/15"
                              : waiting
                                ? "border-danger/50 bg-danger/35"
                                : "border-line bg-bg-2/40"
                      }`}
                    >
                      {ready ? (
                        <Flag className="size-3 sm:size-3.5" strokeWidth={2} aria-hidden="true" />
                      ) : isLive && done ? (
                        <>
                          <Rocket className="size-3 sm:size-3.5" strokeWidth={2} aria-hidden="true" />
                          {core && (
                            <span className="absolute -end-1 -top-1 flex size-3.5 items-center justify-center rounded-[3px] border border-accent bg-surface font-mono text-[8px] font-semibold text-accent" aria-hidden="true">
                              C
                            </span>
                          )}
                        </>
                      ) : edge ? (
                        <span className={`size-1.5 rounded-full sm:size-2 ${waiting ? "bg-fg/70" : "bg-signal/80"}`} aria-hidden="true" />
                      ) : core ? (
                        <span className="font-mono text-[8px] font-semibold text-accent sm:text-[9px]">C</span>
                      ) : null}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-fg-3">
          <li className="flex items-center gap-1.5">
            <Flag className="size-3 text-accent" strokeWidth={2} aria-hidden="true" /> Change 28 ready
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-signal/80" aria-hidden="true" /> Edge release (every Thursday)
          </li>
          <li className="flex items-center gap-1.5">
            <span className="flex size-3.5 items-center justify-center rounded-[3px] border border-accent/70 bg-accent/15 font-mono text-[8px] font-semibold text-accent" aria-hidden="true">
              C
            </span>
            Core release (once a quarter)
          </li>
          {coupled && (
            <li className="flex items-center gap-1.5">
              <span className="size-3 rounded-[3px] bg-danger/35" aria-hidden="true" /> Waiting
            </li>
          )}
        </ul>

        <div className={`mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}>
          {(coupled
            ? [
                { v: `${(wait / 5).toFixed(1).replace(/\.0$/, "")} weeks`, l: "waiting for the core’s quarterly release", tone: "text-danger" },
                { v: String(missedEdge), l: "edge releases that went out while it waited", tone: "text-fg" },
              ]
            : [
                { v: `${wait} day`, l: "from ready to live, on the next edge release", tone: "text-signal" },
                { v: "0", l: "changes to the core, which keeps its own calendar", tone: "text-fg" },
              ]
          ).map((x) => (
            <div key={x.l} className="bg-surface px-4 py-3.5">
              <p className={`font-display text-[1.6rem] leading-none tabular-nums ${x.tone}`}>{x.v}</p>
              <p className="mt-1.5 text-[12px] leading-snug text-fg-3">{x.l}</p>
            </div>
          ))}
        </div>
        <p className="sr-only">
          {coupled
            ? `Change 28 is ready on day ${C28_READY_DAY + 1} of the quarter and waits ${wait} working days for the core's quarterly release on day ${CORE_RELEASE_DAY + 1}. ${missedEdge} edge releases go out while it waits.`
            : `Change 28 is ready on day ${C28_READY_DAY + 1} and goes live the next day with the weekly edge release. The core is not changed.`}
        </p>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption ||
          (coupled
            ? `One quarter of working days, ${DAYS} squares. Illustrative release calendar.`
            : "The same quarter. The core still releases once, at the end; nothing waits for it.")}
      </figcaption>
    </figure>
  );
}
