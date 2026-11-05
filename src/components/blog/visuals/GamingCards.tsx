"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * "Make it the target": pick a metric a board might set as a target and see how it gets gamed (Goodhart's law),
 * and what the customer notices. Lead time from idea to customer is the hard one, with one weak spot.
 */

interface Metric {
  id: string;
  name: string;
  gamed: string;
  customer: string;
  ease: number; // 1 (hard) … 5 (trivial)
  easeLabel: string;
  defence?: string;
}

const METRICS: Metric[] = [
  {
    id: "velocity",
    name: "Velocity (story points)",
    gamed: "Estimates quietly grow. The same work is worth more points next quarter, and velocity rises without anything moving faster.",
    customer: "Nothing.",
    ease: 5,
    easeLabel: "Trivial",
  },
  {
    id: "deployments",
    name: "Number of deployments",
    gamed: "Every configuration tweak and internal component release starts to count. The number climbs; what reaches customers doesn't.",
    customer: "Nothing, unless the releases carry something they use.",
    ease: 4,
    easeLabel: "Easy",
  },
  {
    id: "commitments",
    name: "Sprint commitments met",
    gamed: "Teams commit to less. The percentage rises as ambition falls.",
    customer: "Less, delivered more reliably.",
    ease: 5,
    easeLabel: "Trivial",
  },
  {
    id: "squads",
    name: "Squads and headcount",
    gamed: "Hire. The number goes up whether or not anything flows faster, and more people usually start more work.",
    customer: "Often a longer wait: more work started, same boundary.",
    ease: 5,
    easeLabel: "Trivial",
  },
  {
    id: "lead",
    name: "Lead time, idea to customer",
    gamed: "Only one way: start the clock later. Call work “approved” at the last possible moment and the number improves while nothing changes.",
    customer: "Everything. It is the only one of these numbers they actually live through.",
    ease: 1,
    easeLabel: "Hard",
    defence: "So the board, not the factory, decides when the clock starts: the moment the bank commits to doing the work.",
  },
];

export default function GamingCards({ caption }: { caption?: string }) {
  const [sel, setSel] = useState("velocity");
  const reduced = useReducedMotionAfterMount();
  const baseId = useId();
  const m = METRICS.find((x) => x.id === sel)!;

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        <div className="border-b border-line px-5 py-3.5 sm:px-6">
          <span className="eyebrow text-fg-3">Make it a target, and see what happens</span>
        </div>
        <div className="grid md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <div className="flex gap-1.5 overflow-x-auto border-b border-line p-3 md:flex-col md:overflow-visible md:border-b-0 md:border-e" role="tablist" aria-label="Metrics">
            {METRICS.map((x) => (
              <button
                key={x.id}
                id={`${baseId}-tab-${x.id}`}
                type="button"
                role="tab"
                aria-selected={sel === x.id}
                aria-controls={`${baseId}-panel`}
                onClick={() => setSel(x.id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-start text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                  sel === x.id
                    ? x.id === "lead"
                      ? "bg-signal/12 text-signal"
                      : "bg-surface-3 text-fg"
                    : "text-fg-3 hover:bg-surface-2 hover:text-fg"
                }`}
              >
                {x.name}
              </button>
            ))}
          </div>
          <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${sel}`} className="relative min-h-[260px] p-5 sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={m.id}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-[1.4rem] leading-snug text-fg">{m.name}</p>
                  <div className="flex items-center gap-2" aria-label={`How easy to game: ${m.easeLabel}`}>
                    <span className="eyebrow text-[9.5px] text-fg-4">Easy to game?</span>
                    <span className="flex gap-1" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className={`size-2 rounded-full ${i <= m.ease ? (m.ease >= 4 ? "bg-danger" : "bg-signal") : "bg-line-2"}`} />
                      ))}
                    </span>
                    <span className={`text-[12px] font-medium ${m.ease >= 4 ? "text-danger" : "text-signal"}`}>{m.easeLabel}</span>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow text-[10px] text-fg-4">Make it a target, and…</p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-fg-2">{m.gamed}</p>
                  </div>
                  <div>
                    <p className="eyebrow text-[10px] text-fg-4">What customers notice</p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-fg-2">{m.customer}</p>
                  </div>
                </div>
                {m.defence && (
                  <p className="mt-5 rounded-lg border border-signal/35 bg-signal/[0.07] px-4 py-3 text-[13.5px] leading-relaxed text-fg">{m.defence}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Goodhart's law, one tab at a time. Choose the last tab last."}
      </figcaption>
    </figure>
  );
}
