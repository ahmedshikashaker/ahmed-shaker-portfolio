"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * "Coverage": a sample checked by people after the fact vs. every change checked by the pipeline before release.
 * Conceptual illustration: 100 squares = 100 releases.
 */

const N = 100;
const SAMPLE = new Set([6, 17, 23, 38, 41, 55, 62, 79, 84, 97]);

export default function CoverageGrid({ caption }: { caption?: string }) {
  // Watch the evidence grid itself: on mobile the panels stack, so the figure can be in view before this grid is.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = mounted ? prefersReduced : null;

  const [filled, setFilled] = useState(N); // server / no-JS: fully drawn

  // Prepare the animation off-screen, then fill when the reader arrives.
  useEffect(() => {
    if (reduced === false && !inView) setFilled(0);
  }, [reduced, inView]);

  useEffect(() => {
    if (reduced !== false || !inView) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 3;
      setFilled(Math.min(N, n));
      if (n >= N) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const cells = Array.from({ length: N }, (_, i) => i);

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line-2 bg-line sm:grid-cols-2">
        <div className="bg-surface p-5 sm:p-6">
          <p className="eyebrow text-fg-4">Meeting-based assurance</p>
          <p className="mt-2 font-display text-[1.35rem] leading-snug text-fg">A sample, checked by people, after the fact</p>
          <div className="mt-5 grid grid-cols-10 gap-[5px]" role="img" aria-label="100 releases; 10 of them sampled and checked manually.">
            {cells.map((i) => (
              <span
                key={i}
                className={`aspect-square rounded-[3px] border ${SAMPLE.has(i) ? "border-accent bg-accent/80" : "border-line-2 bg-transparent"}`}
              />
            ))}
          </div>
          <p className="mt-4 text-[12.5px] text-fg-3">
            <span className="me-1.5 inline-block size-2 rounded-[2px] bg-accent/80 align-middle" />
            Checked in depth · the rest rely on what was said in the meeting
          </p>
        </div>
        <div className="bg-surface p-5 sm:p-6">
          <p className="eyebrow text-fg-4">Evidence-based assurance</p>
          <p className="mt-2 font-display text-[1.35rem] leading-snug text-fg">Every change, checked the same way, before release</p>
          <div ref={ref} className="mt-5 grid grid-cols-10 gap-[5px]" role="img" aria-label="100 releases; every one checked automatically, with evidence attached.">
            {cells.map((i) => (
              <span
                key={i}
                className={`aspect-square rounded-[3px] border transition-colors duration-200 ${
                  i < filled ? "border-signal/70 bg-signal/70" : "border-line-2 bg-transparent"
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-[12.5px] text-fg-3">
            <span className="me-1.5 inline-block size-2 rounded-[2px] bg-signal/70 align-middle" />
            Evidence attached to every release · <span className="tabular-nums">{filled}</span> of {N}
          </p>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "100 squares, 100 releases. Conceptual illustration."}
      </figcaption>
    </figure>
  );
}
