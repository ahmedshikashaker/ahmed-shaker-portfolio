"use client";

import { useEffect, useRef } from "react";
import { BookLock, MessagesSquare } from "lucide-react";

/**
 * "Slow on purpose, fast on purpose": what belongs in the core (the bank's memory) and what belongs at the edge
 * (the bank's voice), joined by contracts. Dots travel the contract band: events up from the core, requests down
 * from the edge (CSS animation, paused off-screen, off under reduced motion).
 */

const CORE = ["Ledger and balances", "Interest and fees", "Product rules", "Regulatory books"];
const EDGE = ["Screens and journeys", "Notifications", "Quotes and previews", "Partner APIs"];

export default function TwoSpeeds({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.playing = e.isIntersecting ? "true" : "false";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const card = (side: "core" | "edge") => {
    const isCore = side === "core";
    const Icon = isCore ? BookLock : MessagesSquare;
    return (
      <div className={`flex flex-col rounded-xl border p-4 ${isCore ? "border-accent/40 bg-accent/[0.05]" : "border-signal/40 bg-signal/[0.05]"}`}>
        <div className="flex items-center gap-2.5">
          <span className={`flex size-9 items-center justify-center rounded-full border ${isCore ? "border-accent/60 text-accent" : "border-signal/60 text-signal"}`}>
            <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <p className={`eyebrow ${isCore ? "text-accent" : "text-signal"}`}>{isCore ? "The core" : "The edge"}</p>
            <p className="font-display text-[1.2rem] leading-tight text-fg">{isCore ? "The bank’s memory" : "The bank’s voice"}</p>
          </div>
        </div>
        <ul className="mt-3.5 space-y-1.5">
          {(isCore ? CORE : EDGE).map((t) => (
            <li key={t} className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12.5px] text-fg-2">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-3.5 text-[12.5px] leading-snug text-fg-3">
          {isCore ? (
            <>
              Changes rarely and carefully, on its own calendar. <strong className="font-semibold text-fg">Slow on purpose.</strong>
            </>
          ) : (
            <>
              Changes every week, safely, because it can’t corrupt the books. <strong className="font-semibold text-fg">Fast on purpose.</strong>
            </>
          )}
        </p>
      </div>
    );
  };

  return (
    <figure ref={ref} className="two-speeds not-prose my-14 font-sans" data-playing="false">
      <div className="grid items-stretch gap-3 rounded-2xl border border-line-2 bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-5 md:grid-cols-[minmax(0,1fr)_9.5rem_minmax(0,1fr)]">
        {card("core")}
        {/* The contract band */}
        <div className="relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-line-3 px-3 py-4 text-center md:py-3">
          <p className="eyebrow text-fg-3">Contracts</p>
          <p className="text-[11.5px] leading-snug text-fg-3">APIs and events, versioned and owned</p>
          <div className="relative h-10 w-full md:h-40" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={`up${i}`} className="ts-dot ts-up bg-accent" style={{ animationDelay: `${i * 0.9}s` }} />
            ))}
            {[0, 1, 2].map((i) => (
              <span key={`dn${i}`} className="ts-dot ts-down bg-signal" style={{ animationDelay: `${0.45 + i * 0.9}s` }} />
            ))}
          </div>
          <p className="font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.1em] text-fg-4">
            <span className="text-accent">events out of the core</span>
            <br />
            <span className="text-signal">requests into it</span>
          </p>
        </div>
        {card("edge")}
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Two speeds, each on purpose, joined by contracts that change slowly and deliberately."}
      </figcaption>
    </figure>
  );
}
