"use client";

import { useRef } from "react";
import { CircleCheck, CircleHelp, TriangleAlert } from "lucide-react";
import { useStepsOnView } from "./useMotionReady";

/**
 * "What to ask each quarter": one question per quarter of year one, with what a good answer sounds like and the
 * warning sign to listen for. Cards reveal in order when scrolled into view.
 */

const QUARTERS = [
  {
    q: 1,
    months: "Months 1–3",
    ask: "Is the platform real?",
    good: "A change can go from a developer to staff in a day, through the pipeline, with the evidence attached.",
    warn: "Slides about the platform, and nothing has been through it yet.",
    href: "/blog/the-factory-is-the-easy-part",
  },
  {
    q: 2,
    months: "Months 4–6",
    ask: "Which approvals are becoming evidence?",
    good: "Tests and scans run on every change, and the risk team agreed the thresholds.",
    warn: "More squads, the same meetings, and lead time rising with no explanation.",
    href: "/blog/evidence-not-meetings",
  },
  {
    q: 3,
    months: "Months 7–9",
    ask: "How long from idea to customer, and where does work wait?",
    good: "One number, falling, with work in progress limited and the waits named.",
    warn: "Velocity and deployment counts in the pack instead.",
    href: "/blog/the-one-number-a-board-should-watch",
  },
  {
    q: 4,
    months: "Months 10–12",
    ask: "Which rule did we rewrite, and what stopped waiting?",
    good: "Small fixes have capacity, and changes like 28 no longer wait for the core.",
    warn: "A culture programme where a rule change should be.",
    href: "/blog/fear-is-rational",
  },
];

export default function QuarterQuestions({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const shown = useStepsOnView(ref, QUARTERS.length, 260, 0.3);

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <p className="eyebrow mb-3 text-fg-4">One question a quarter</p>
      <ol className="grid gap-3 sm:grid-cols-2">
        {QUARTERS.map((x, i) => (
          <li
            key={x.q}
            className={`flex flex-col rounded-2xl border border-line-2 bg-surface p-4 shadow-[var(--shadow-soft)] transition-all duration-500 sm:p-5 ${
              shown > i ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full border border-accent/50 px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">Q{x.q}</span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-4">{x.months}</span>
            </div>
            <p className="mt-3 flex items-start gap-2 font-display text-[1.2rem] leading-snug text-fg">
              <CircleHelp className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
              {x.ask}
            </p>
            <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-fg-2">
              <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-signal" strokeWidth={2} aria-hidden="true" />
              <span>
                <span className="sr-only">A good answer: </span>
                {x.good}
              </span>
            </p>
            <p className="mt-2 flex items-start gap-2 text-[13px] leading-snug text-fg-3">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-danger" strokeWidth={2} aria-hidden="true" />
              <span>
                <span className="sr-only">A warning sign: </span>
                {x.warn}
              </span>
            </p>
            <a href={x.href} className="mt-auto pt-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent hover:underline">
              More in essay {x.q} →
            </a>
          </li>
        ))}
      </ol>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "A good answer, and the warning sign to listen for."}
      </figcaption>
    </figure>
  );
}
