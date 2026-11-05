"use client";

import { useId, useRef, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import { CAPABILITIES, STRANGLER_QUARTERS } from "./coreModel";
import { useReducedMotionAfterMount, useStepsOnView } from "./useMotionReady";

/**
 * "Strangler fig": quarter by quarter, capabilities move from the core to the edge, the way a fig grows around a
 * tree. The share of customer interactions that no longer wait for the core's release calendar rises; the ledger
 * stays in the core throughout. Plays once when scrolled into view, then the reader can scrub. Illustrative shares.
 */

export default function StranglerFig({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const auto = useStepsOnView(ref, STRANGLER_QUARTERS, 1100, 0.45);
  const [manual, setManual] = useState<number | null>(null);
  const reduced = useReducedMotionAfterMount();
  const q = manual ?? auto;
  const id = useId();

  const moved = CAPABILITIES.filter((c) => c.quarter <= q);
  const stayed = CAPABILITIES.filter((c) => c.quarter > q);
  const share = moved.reduce((a, c) => a + c.share, 0);
  const latest = CAPABILITIES.find((c) => c.quarter === q);

  const pill = (c: (typeof CAPABILITIES)[number], atEdge: boolean) => (
    <motion.li
      key={c.id}
      layout={reduced ? false : "position"}
      layoutId={`${id}-${c.id}`}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] leading-tight sm:text-[12.5px] ${
        atEdge ? (latest?.id === c.id ? "border-signal bg-signal/20 text-fg" : "border-signal/40 bg-signal/[0.08] text-fg") : "border-line-2 bg-bg-2/50 text-fg-3"
      }`}
    >
      <span>{c.label}</span>
      <span className="font-mono text-[10px] tabular-nums text-fg-4">{c.share}%</span>
    </motion.li>
  );

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="eyebrow text-fg-4">Strangler fig · quarter by quarter</p>
        <p className="mt-2 font-display text-[1.4rem] leading-snug text-fg">
          {q === 0 ? "Everything goes through the core." : `Quarter ${q}: ${latest?.label} move${latest?.label.endsWith("s") ? "" : "s"} to the edge.`}
        </p>

        <div className="mt-4 flex items-baseline gap-3">
          <p className="font-display text-[2.2rem] leading-none tabular-nums text-signal">{share}%</p>
          <p className="text-[13px] leading-snug text-fg-2">of customer interactions no longer wait for the core’s release calendar</p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full rounded-full bg-signal transition-[width] duration-500" style={{ width: `${share}%` }} />
        </div>

        <LayoutGroup id={id}>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-signal/35 bg-signal/[0.04] p-3.5">
              <p className="eyebrow text-signal">The edge · changes weekly</p>
              <ul className="mt-2.5 min-h-[2.4rem] space-y-1.5">
                {moved.map((c) => pill(c, true))}
                {moved.length === 0 && <li className="rounded-lg border border-dashed border-line-2 px-2.5 py-1.5 text-[12px] text-fg-4">Nothing yet</li>}
              </ul>
            </div>
            <div className="rounded-xl border border-accent/35 bg-accent/[0.04] p-3.5">
              <p className="eyebrow text-accent">The core · changes quarterly</p>
              <ul className="mt-2.5 space-y-1.5">
                {stayed.map((c) => pill(c, false))}
                <li className="flex items-center justify-between gap-2 rounded-lg border border-accent/50 bg-accent/[0.1] px-2.5 py-1.5 text-[12px] font-medium leading-tight text-fg sm:text-[12.5px]">
                  <span>The ledger: balances, postings, interest</span>
                  <Lock className="size-3.5 shrink-0 text-accent" strokeWidth={2} aria-label="stays in the core" />
                </li>
              </ul>
            </div>
          </div>
        </LayoutGroup>

        <div className="mt-5">
          <label htmlFor={`${id}-q`} className="flex items-baseline justify-between text-[12.5px] text-fg-2">
            <span>Quarter</span>
            <span className="font-mono tabular-nums text-fg">
              {q} of {STRANGLER_QUARTERS}
            </span>
          </label>
          <input
            id={`${id}-q`}
            type="range"
            suppressHydrationWarning
            min={0}
            max={STRANGLER_QUARTERS}
            step={1}
            value={q}
            onChange={(e) => setManual(Number(e.target.value))}
            aria-valuetext={`Quarter ${q}: ${share}% of customer interactions no longer wait for the core`}
            className="ql-range mt-2 w-full"
          />
        </div>

        <p className="mt-4 border-t border-line pt-4 text-[13px] leading-relaxed text-fg-2">
          The ledger never moves. It doesn’t need to: what customers see and do every day has moved to the edge, and the core is left with the job it’s best
          at, keeping the books.
        </p>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Drag through the quarters. The order and the shares of customer interactions are illustrative."}
      </figcaption>
    </figure>
  );
}
