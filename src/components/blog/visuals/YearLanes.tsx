"use client";

import { useRef } from "react";
import { Eye, Hammer } from "lucide-react";
import { YEAR } from "./yearModel";
import { useStepsOnView } from "./useMotionReady";

/**
 * "Two lanes": the first twelve months of a digital factory. On one side, what the board pack showed; on the
 * other, what was being built underneath, with a link to the essay in this series that describes each fix.
 * Months reveal one by one when the figure scrolls into view. Story from yearModel.ts (illustrative).
 */

export default function YearLanes({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const shown = useStepsOnView(ref, YEAR.length, 160, 0.25);

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="eyebrow px-1 text-fg-4">Year one · what the board saw, and what was being built</p>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[minmax(0,1fr)_2.75rem_minmax(0,1fr)] sm:gap-x-3">
          <p className="flex items-center gap-1.5 pb-2 text-[12px] font-medium text-fg-2">
            <Eye className="size-3.5 text-fg-3" strokeWidth={1.75} aria-hidden="true" /> The board pack
          </p>
          <span />
          <p className="flex items-center gap-1.5 pb-2 text-[12px] font-medium text-fg-2">
            <Hammer className="size-3.5 text-accent" strokeWidth={1.75} aria-hidden="true" /> Underneath
          </p>

          {YEAR.map((y, i) => {
            const on = shown > i;
            const quiet = y.m >= 2 && y.m <= 4;
            return (
              <div key={y.m} className="contents">
                <div className={`py-1 transition-all duration-500 ${on ? "opacity-100" : "translate-y-1 opacity-0"}`}>
                  <p
                    className={`rounded-lg border px-2.5 py-1.5 text-[12px] leading-snug sm:text-[12.5px] ${
                      quiet ? "border-dashed border-line-3 text-fg-4" : y.m >= 7 ? "border-signal/40 bg-signal/[0.07] text-fg" : "border-line-2 bg-bg-2/40 text-fg-2"
                    }`}
                  >
                    {y.board}
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <span aria-hidden="true" className="absolute w-px bg-line-2" style={{ top: i === 0 ? "50%" : 0, bottom: i === YEAR.length - 1 ? "50%" : 0 }} />
                  <span
                    className={`relative z-10 flex size-7 items-center justify-center rounded-full border font-mono text-[10.5px] tabular-nums transition-colors duration-500 sm:size-8 ${
                      on ? (y.m === 4 ? "border-danger bg-danger/15 text-danger" : "border-accent/60 bg-surface text-accent") : "border-line-2 bg-surface text-fg-4"
                    }`}
                    title={`Month ${y.m}`}
                  >
                    {y.m}
                  </span>
                </div>
                <div className={`py-1 transition-all delay-75 duration-500 ${on ? "opacity-100" : "translate-y-1 opacity-0"}`}>
                  <p className="rounded-lg border border-accent/35 bg-accent/[0.06] px-2.5 py-1.5 text-[12px] leading-snug text-fg sm:text-[12.5px]">
                    {y.built}
                    {y.essay && (
                      <a href={y.essay.href} className="ms-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-accent hover:underline">
                        Essay {y.essay.n}
                      </a>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-[12.5px] leading-snug">
          <p className="bg-surface px-3.5 py-3 text-fg-3">
            <strong className="font-semibold text-fg">Months 1–6:</strong> the board pack is thin, and the work is underneath.
          </p>
          <p className="bg-surface px-3.5 py-3 text-fg-3">
            <strong className="font-semibold text-fg">Months 7–12:</strong> the foundations start paying out, every month.
          </p>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "An illustrative first year. Each fix underneath is one this series has already described."}
      </figcaption>
    </figure>
  );
}
