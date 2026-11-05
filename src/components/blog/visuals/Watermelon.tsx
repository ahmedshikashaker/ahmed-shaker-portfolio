"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { useReducedMotionAfterMount } from "./useMotionReady";
import { EASE_OUT } from "@/lib/motion";
import { C27_TOTAL, LEAD_NOW_DAYS, LEAD_WAS_DAYS, PACK } from "./measureModel";

/**
 * "Watermelon dashboard": the board pack (all green) vs. the customer's view (red), for the same quarter.
 * Flips to the customer's view once, a moment after it scrolls into view, unless the reader has already chosen.
 */

type View = "pack" | "customer";

interface Tile {
  label: string;
  value: string;
  note: string;
  trend: "up" | "down" | "flat";
  good: boolean;
}

const PACK_TILES: Tile[] = [
  { label: "Velocity", value: PACK.velocity.now, note: PACK.velocity.note, trend: "up", good: true },
  { label: "Deployments", value: PACK.deployments.now, note: `${PACK.deployments.note} (was ${PACK.deployments.was})`, trend: "up", good: true },
  { label: "Commitments met", value: PACK.commitments.now, note: PACK.commitments.note, trend: "up", good: true },
  { label: "Squads", value: PACK.squads.now, note: `${PACK.squads.note} (was ${PACK.squads.was})`, trend: "up", good: true },
  { label: "Agile adoption", value: PACK.agile.now, note: PACK.agile.note, trend: "up", good: true },
];

const CUSTOMER_TILES: Tile[] = [
  { label: "Lead time", value: `${LEAD_NOW_DAYS} days`, note: `average, approved idea to customer (was ${LEAD_WAS_DAYS})`, trend: "up", good: false },
  { label: "Work in progress", value: String(PACK.wipNow), note: `changes started, not yet with customers (was ${PACK.wipWas})`, trend: "up", good: false },
  { label: "Delivered", value: `${PACK.deliveredPerWeek} / week`, note: "changes reaching customers (unchanged)", trend: "flat", good: false },
  { label: "Change 27", value: `${Math.round(C27_TOTAL)} days`, note: "for a one-line fix customers were calling about", trend: "up", good: false },
];

function TrendIcon({ t, good }: { t: Tile["trend"]; good: boolean }) {
  const cls = `size-4 ${good ? "text-signal" : t === "flat" ? "text-fg-3" : "text-danger"}`;
  if (t === "flat") return <Minus className={cls} strokeWidth={2} aria-hidden="true" />;
  return t === "up" ? <ArrowUpRight className={cls} strokeWidth={2} aria-hidden="true" /> : <ArrowDownRight className={cls} strokeWidth={2} aria-hidden="true" />;
}

export default function Watermelon({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const reduced = useReducedMotionAfterMount();
  const [view, setView] = useState<View>("pack");
  const touched = useRef(false);

  useEffect(() => {
    if (reduced !== false || !inView) return;
    const id = window.setTimeout(() => {
      if (!touched.current) setView("customer");
    }, 2600);
    return () => window.clearTimeout(id);
  }, [inView, reduced]);

  const choose = (v: View) => {
    touched.current = true;
    setView(v);
  };
  const tiles = view === "pack" ? PACK_TILES : CUSTOMER_TILES;

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
          <span className="eyebrow text-fg-3">Quarterly board pack · illustrative</span>
          <div className="inline-flex rounded-full border border-line-2 p-0.5" role="tablist" aria-label="Which view">
            {(
              [
                ["pack", "What the board saw"],
                ["customer", "What customers lived"],
              ] as [View, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                onClick={() => choose(v)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  view === v ? (v === "pack" ? "bg-signal/15 text-signal" : "bg-danger/15 text-danger") : "text-fg-3 hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[300px] px-5 py-6 sm:min-h-[248px] sm:px-6" role="tabpanel" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={reduced ? false : { opacity: 0, rotateX: -12, y: 10 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, rotateX: 10, y: -8 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              style={{ transformPerspective: 900 }}
              className={`grid gap-3 ${view === "pack" ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"}`}
            >
              {tiles.map((t) => (
                <div
                  key={t.label}
                  className={`rounded-xl border border-t-2 bg-bg/40 p-3.5 ${t.good ? "border-line-2 border-t-signal" : "border-line-2 border-t-danger"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="eyebrow text-[9.5px] text-fg-4">{t.label}</p>
                    <TrendIcon t={t.trend} good={t.good} />
                  </div>
                  <p className={`mt-2 font-display text-[1.65rem] leading-none tabular-nums ${t.good ? "text-fg" : "text-danger"}`}>{t.value}</p>
                  <p className="mt-2 text-[11.5px] leading-snug text-fg-3">{t.note}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <p className="mt-5 text-[13px] text-fg-2">
            {view === "pack" ? (
              <>Every tile is green. Every one of them measures the factory.</>
            ) : (
              <>Same quarter, same bank. More was started, nothing more was delivered, and customers waited longer.</>
            )}
          </p>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "A watermelon dashboard: green on the outside, red on the inside. Illustrative numbers."}
      </figcaption>
    </figure>
  );
}
