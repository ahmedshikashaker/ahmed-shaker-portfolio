"use client";

import { useRef } from "react";
import { ChevronDown, Search, Wrench } from "lucide-react";

/**
 * "Look closer": the diagnoses a board usually hears about stalled transformations, each opened to the rule
 * underneath it and the rewrite that changes behaviour. Built on native <details>, so it works without JavaScript
 * and with any assistive technology; the "Open all" button is a convenience.
 */

const CARDS = [
  {
    heard: "They lack an agile mindset.",
    actually: "Their objectives still reward hitting big launch dates, and their calendars are full of approvals. Small, frequent delivery earns them nothing.",
    rewrite: "Put lead time from idea to customer into their objectives, and give back the hours the approval meetings take.",
  },
  {
    heard: "Middle management is blocking us.",
    actually: "The approval matrix puts a manager’s name on every change, and incidents land on that name. Credit for speed lands on the factory.",
    rewrite: "Approve standard changes by evidence, not signature. Keep managers’ signatures for what’s genuinely new.",
  },
  {
    heard: "The branches won’t promote the app.",
    actually: "In many banks, branch targets still count transactions done in the branch. Every customer a branch moves to the app is a point lost.",
    rewrite: "Credit branches for the digital activity of the customers they serve, including the ones they moved online.",
  },
  {
    heard: "Operations resists frequent releases.",
    actually: "Operations takes the 2 a.m. calls and none of the credit. Fewer, bigger release nights is the only lever they have.",
    rewrite: "Small releases with automatic rollback, and an on-call rota the squad shares, so the people who build it feel the nights too.",
  },
  {
    heard: "Compliance slows everything down.",
    actually: "Their name goes on every approval, and they meet each change for the first time in a committee, two minutes before deciding.",
    rewrite: "Invite them to the demos, and give them evidence by default instead of a meeting.",
  },
  {
    heard: "We need a culture change programme.",
    actually: "Culture is what people learned the last time something broke. A programme can’t outvote the last incident review.",
    rewrite: "Run the next incident review without blame, openly, starting with “what made this easy to miss?”",
  },
];

export default function LookCloser({ caption }: { caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const toggleAll = () => {
    const all = Array.from(ref.current?.querySelectorAll("details") ?? []);
    const open = all.some((d) => !d.open);
    all.forEach((d) => (d.open = open));
  };

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="eyebrow text-fg-4">What the board hears · what’s underneath</p>
        <button
          type="button"
          onClick={toggleAll}
          className="rounded-md px-2 py-1 text-[12px] text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
        >
          Open all
        </button>
      </div>
      <div ref={ref} className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((c) => (
          <details key={c.heard} className="look-closer group rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)] open:border-accent/40">
            <summary className="flex cursor-pointer list-none items-start gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">
                <span className="eyebrow block text-fg-4">The board hears</span>
                <span className="mt-1.5 block font-display text-[1.2rem] italic leading-snug text-fg decoration-danger/60 decoration-1 group-open:line-through group-open:text-fg-3">
                  “{c.heard}”
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-accent group-open:hidden">
                  <Search className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> Look closer
                </span>
              </span>
              <ChevronDown className="mt-1 size-4 shrink-0 text-fg-4 transition-transform duration-300 group-open:rotate-180" strokeWidth={1.75} aria-hidden="true" />
            </summary>
            <div className="look-closer-body px-4 pb-4 sm:px-5 sm:pb-5">
              <p className="eyebrow text-fg-4">What’s actually happening</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-fg-2">{c.actually}</p>
              <div className="mt-3 rounded-xl border border-signal/35 bg-signal/[0.07] px-3.5 py-3">
                <p className="eyebrow flex items-center gap-1.5 text-signal">
                  <Wrench className="size-3" strokeWidth={2} aria-hidden="true" /> The rule to rewrite
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-fg">{c.rewrite}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Open a card. Almost every “culture problem” has a rule underneath it."}
      </figcaption>
    </figure>
  );
}
