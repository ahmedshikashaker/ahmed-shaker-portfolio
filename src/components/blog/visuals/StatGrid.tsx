"use client";

import { useRef } from "react";
import { useStepsOnView } from "./useMotionReady";

/**
 * "Stat grid": one share, drawn as 100 squares. Reusable: the value, both labels, the title and the source are
 * block attributes. Fills in when scrolled into view; the server render and reduced motion show it complete.
 */

const N = 100;

export default function StatGrid({
  value = 50,
  label = "",
  restLabel = "",
  title,
  source,
  caption,
}: {
  value?: number;
  label?: string;
  restLabel?: string;
  title?: string;
  source?: string;
  caption?: string;
}) {
  const v = Math.max(0, Math.min(N, Math.round(Number(value) || 0)));
  const ref = useRef<HTMLElement>(null);
  // 20 steps × 5 squares; the server render is the finished grid.
  const step = useStepsOnView(ref, 20, 45, 0.5);
  const filled = Math.min(N, step * 5);

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="grid items-center gap-6 rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:p-7">
        <div className="mx-auto grid w-full max-w-[15rem] grid-cols-10 gap-[4px]" role="img" aria-label={`${v} of ${N}: ${label}. ${N - v} of ${N}: ${restLabel}.`}>
          {Array.from({ length: N }, (_, i) => {
            const isValue = i < v;
            const lit = i < filled;
            return (
              <span
                key={i}
                className={`aspect-square rounded-[3px] border transition-colors duration-200 ${
                  !lit ? "border-line-2 bg-transparent" : isValue ? "border-accent/70 bg-accent/75" : "border-danger/60 bg-danger/55"
                }`}
              />
            );
          })}
        </div>
        <div>
          {title && <p className="eyebrow text-fg-4">{title}</p>}
          <p className="mt-2 font-display text-[3.4rem] leading-none tabular-nums text-accent">{v}%</p>
          <ul className="mt-4 space-y-2 text-[13.5px] leading-snug text-fg-2">
            <li className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-1 size-2.5 shrink-0 rounded-[2px] bg-accent/75" />
              <span>
                <strong className="font-semibold text-fg">{v}</strong> {label}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-1 size-2.5 shrink-0 rounded-[2px] bg-danger/55" />
              <span>
                <strong className="font-semibold text-fg">{N - v}</strong> {restLabel}
              </span>
            </li>
          </ul>
          {source && <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">{source}</p>}
        </div>
      </div>
      {caption && <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">{caption}</figcaption>}
    </figure>
  );
}
