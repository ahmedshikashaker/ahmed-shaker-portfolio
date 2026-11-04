"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * "Meeting agenda": the same change board on one time scale, before and after.
 * Before: ninety minutes, forty changes at about two minutes each (change 27 highlighted).
 * After: sixty minutes, three decisions at twenty minutes each, and thirty minutes back.
 * Server render is the finished drawing; after mount the slots draw in when they scroll into view.
 */

const BEFORE_MIN = 90;
const BEFORE_N = 40;
const HIGHLIGHT = 26; // change 27
const AFTER = [
  { label: "New third party", min: 20 },
  { label: "Unusual data flow", min: 20 },
  { label: "Exception request", min: 20 },
];
const AFTER_MIN = AFTER.reduce((a, x) => a + x.min, 0);

export default function MeetingAgenda({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const reduced = useReducedMotionAfterMount();
  const [shown, setShown] = useState(true); // server / no-JS: fully drawn

  useEffect(() => {
    if (reduced === false && !inView) setShown(false);
  }, [reduced, inView]);
  useEffect(() => {
    if (reduced === false && inView) {
      const id = window.setTimeout(() => setShown(true), 60);
      return () => window.clearTimeout(id);
    }
  }, [reduced, inView]);

  const slot = 100 / BEFORE_N;
  const pct = (min: number) => (min / BEFORE_MIN) * 100;

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <p className="eyebrow text-fg-4">The Tuesday change board, before and after</p>

        {/* Before */}
        <div className="mt-6">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 text-[13px]">
            <span className="font-medium text-fg">Today</span>
            <span className="text-fg-3">
              <span className="font-mono tabular-nums text-danger">{BEFORE_N}</span> changes · <span className="font-mono tabular-nums">{BEFORE_MIN}</span> minutes
            </span>
          </div>
          <div className="relative pt-7" dir="ltr">
            <span
              className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent"
              style={{ left: `${(HIGHLIGHT + 0.5) * slot}%` }}
            >
              Change 27 · 2 min
            </span>
            <div className="relative h-11" role="img" aria-label={`Today: ${BEFORE_N} changes in ${BEFORE_MIN} minutes, a little over two minutes each.`}>
              {Array.from({ length: BEFORE_N }, (_, i) => (
                <span
                  key={i}
                  className={`absolute inset-y-0 origin-bottom rounded-[2px] transition-transform duration-300 ${i === HIGHLIGHT ? "bg-accent" : "bg-danger/45"}`}
                  style={{
                    left: `${i * slot}%`,
                    width: `calc(${slot}% - 2px)`,
                    transform: shown ? "scaleY(1)" : "scaleY(0)",
                    transitionDelay: shown ? `${i * 22}ms` : "0ms",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* After */}
        <div className="mt-7">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 text-[13px]">
            <span className="font-medium text-fg">After</span>
            <span className="text-fg-3">
              <span className="font-mono tabular-nums text-signal">{AFTER.length}</span> decisions · <span className="font-mono tabular-nums">{AFTER_MIN}</span> minutes
            </span>
          </div>
          <div className="relative h-14" dir="ltr" role="img" aria-label={`After: ${AFTER.length} decisions in ${AFTER_MIN} minutes, twenty minutes each, and ${BEFORE_MIN - AFTER_MIN} minutes back.`}>
            {AFTER.map((a, i) => {
              const left = pct(AFTER.slice(0, i).reduce((s, x) => s + x.min, 0));
              return (
                <div
                  key={a.label}
                  className="absolute inset-y-0 flex origin-left flex-col justify-center overflow-hidden rounded-md bg-signal/80 px-2 text-on-accent transition-[transform,opacity] duration-500"
                  style={{
                    left: `${left}%`,
                    width: `calc(${pct(a.min)}% - 3px)`,
                    transform: shown ? "scaleX(1)" : "scaleX(0.2)",
                    opacity: shown ? 1 : 0,
                    transitionDelay: shown ? `${BEFORE_N * 22 + 150 + i * 160}ms` : "0ms",
                  }}
                >
                  <span className="text-[11px] font-semibold leading-tight sm:text-[12px]">{a.label}</span>
                  <span className="hidden font-mono text-[10.5px] opacity-80 sm:block">{a.min} min</span>
                </div>
              );
            })}
            <div
              className="absolute inset-y-0 flex items-center justify-center rounded-md border border-dashed border-line-3 px-2 text-center text-[11.5px] leading-tight text-fg-3 transition-opacity duration-500"
              style={{ left: `${pct(AFTER_MIN)}%`, right: 0, opacity: shown ? 1 : 0, transitionDelay: shown ? `${BEFORE_N * 22 + 700}ms` : "0ms" }}
            >
              {BEFORE_MIN - AFTER_MIN} minutes back
            </div>
          </div>
        </div>

        {/* Shared time axis */}
        <div className="relative mt-2 h-4 font-mono text-[10.5px] text-fg-4" dir="ltr" aria-hidden="true">
          {[0, 30, 60, 90].map((m, i) => (
            <span key={m} className={`absolute top-0 whitespace-nowrap ${i === 0 ? "" : i === 3 ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: `${pct(m)}%` }}>
              {m} min
            </span>
          ))}
        </div>

        <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-fg-2">
          Routine changes aren’t on the agenda any more. Their evidence is already attached, so the meeting spends its time on the few things that need judgement.
        </p>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Both rows use the same time scale. Illustrative."}
      </figcaption>
    </figure>
  );
}
