"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Headset, ServerCog, ShieldCheck, Wrench } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import { ALL_MANUAL, GATES, stepFor } from "./pipelineModel";
import { C27_BUILD, C27_TOTAL, C27_WAIT_TO_START } from "./measureModel";
import { useReducedMotionAfterMount, useStepsOnView } from "./useMotionReady";

/**
 * "Four chairs": change 27's 45 days (parts 2 and 3 of the series), seen from the four people outside the squad
 * who touched it. Each chair shows the share of the wait that sat with them, what they are measured on, and the
 * rule that would flip their incentive. Numbers come from pipelineModel.ts and measureModel.ts.
 */

type Owner = "po" | "squad" | "sec" | "ops";

const hoursOf = (id: string) => (GATES.find((g) => g.id === id) ? stepFor(GATES.find((g) => g.id === id)!, ALL_MANUAL, false).step.hours : 0);

/** Change 27's life, in days, in order. */
const SEGMENTS: { id: string; label: string; days: number; owner: Owner }[] = [
  { id: "backlog", label: "Approved, waiting to start", days: C27_WAIT_TO_START, owner: "po" },
  { id: "build", label: "Written", days: C27_BUILD, owner: "squad" },
  { id: "review", label: "Peer review", days: hoursOf("review") / 24, owner: "squad" },
  { id: "tests", label: "Regression test cycle", days: hoursOf("tests") / 24, owner: "ops" },
  { id: "security", label: "Security review queue", days: hoursOf("security") / 24, owner: "sec" },
  { id: "inventory", label: "Component list by hand", days: hoursOf("inventory") / 24, owner: "sec" },
  { id: "approval", label: "Weekly change board", days: hoursOf("approval") / 24, owner: "ops" },
  { id: "deploy", label: "Release window", days: hoursOf("deploy") / 24, owner: "ops" },
];
const TOTAL = SEGMENTS.reduce((a, s) => a + s.days, 0); // ≈ C27_TOTAL

interface Chair {
  id: "po" | "sec" | "ops" | "cc";
  role: string;
  icon: typeof Wrench;
  measured: string;
  badDay: string;
  sees: string;
  rational: string;
  rationalLabel?: string;
  flip: string;
  before: string;
  after: string;
  rule: string;
}

const CHAIRS: Chair[] = [
  {
    id: "po",
    role: "Product owner",
    icon: ClipboardList,
    measured: "Delivering the quarter’s committed features, on the dates promised to the business.",
    badDay: "A launch date slips in front of the steering committee.",
    sees: "A one-line fix that appears in no roadmap, no launch and no objective. Starting it means interrupting work that does.",
    rational: "Every hour spent on change 27 is taken from something they’ll be judged on. Nobody will ever ask about the sentence.",
    flip: "Reserve a fixed slice of capacity for small fixes, and judge product owners on lead time and the customer calls their fixes remove, not only on launch dates.",
    before: "Left it in the backlog for a month. It wasn’t a launch.",
    after: "Picks it up the same week. Small fixes have their own capacity, and the calls they remove now count.",
    rule: "Capacity for small fixes",
  },
  {
    id: "sec",
    role: "Security reviewer",
    icon: ShieldCheck,
    measured: "No incident ever traced back to something they approved.",
    badDay: "A breach review that starts with their signature.",
    sees: "One more item in a queue where a one-line text change and a new payment flow look exactly alike.",
    rational: "Their name goes on every approval, and nobody rewards a quick one. Treating every change with the same caution is the only defensible position.",
    flip: "Let automated scans approve standard changes against agreed thresholds, and spend the reviewer’s judgement on what’s genuinely new. Accountability moves to the policy, not the signature.",
    before: "Queued it behind everything else, with the same caution as a new payment flow.",
    after: "Never has to see it. Automated scans approve it against the policy their team wrote.",
    rule: "Evidence by default",
  },
  {
    id: "ops",
    role: "Operations lead",
    icon: ServerCog,
    measured: "Stability: uptime, incidents and audit findings.",
    badDay: "The 2 a.m. call, and the incident report the next morning.",
    sees: "Another change for the regression cycle, the weekly board and the out-of-hours window. Fewer release nights means fewer chances to be woken up.",
    rational: "Batching changes into one window keeps the calendar predictable. It makes each release bigger and riskier, but the old rules count the nights, not the size.",
    flip: "Small releases with automatic rollback, an on-call rota the squad shares, and one objective for speed and stability together, which DORA’s research shows rise together.",
    before: "Held it for the weekly board and the out-of-hours release window.",
    after: "Watches it go out in daylight, to staff first, with a rollback ready that nobody needs.",
    rule: "Small releases, shared on-call",
  },
  {
    id: "cc",
    role: "Contact-centre lead",
    icon: Headset,
    measured: "Call volumes, handling time and customer satisfaction.",
    badDay: "A surge of calls about something nobody in the room can fix.",
    sees: "The cause of a month of worried calls, with no way to speed up the fix and no seat where priorities are set.",
    rational: "Raising it again changes nothing, so the team writes a script for agents and absorbs the cost. The problem disappears from every meeting except theirs.",
    rationalLabel: "Why staying quiet was the smart choice",
    flip: "Make the top reasons customers call a standing input to the factory’s priorities, with the contact-centre lead in the room where they’re set.",
    before: "Wrote a script for agents and absorbed a month of calls.",
    after: "Brings the calls to the weekly priority meeting, where the top reasons customers call are a standing item.",
    rule: "A seat where priorities are set",
  },
];

const OWNS: Record<Chair["id"], Owner[] | "all"> = { po: ["po"], sec: ["sec"], ops: ["ops"], cc: "all" };
const daysHeld = (c: Chair) => {
  const o = OWNS[c.id];
  return o === "all" ? TOTAL : SEGMENTS.filter((s) => o.includes(s.owner)).reduce((a, s) => a + s.days, 0);
};
const fmt = (d: number) => {
  const v = d < 10 ? d.toFixed(1).replace(/\.0$/, "") : String(Math.round(d));
  return `${v} ${v === "1" ? "day" : "days"}`;
};

export default function FourChairs({ variant = "before", caption }: { variant?: "before" | "after"; caption?: string }) {
  if (variant === "after") return <ChairsAfter caption={caption} />;
  return <ChairsBefore caption={caption} />;
}

/** The same four people under the new rules: what each did with change 27 before, and does now. */
function ChairsAfter({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const step = useStepsOnView(ref, CHAIRS.length + 1, 550, 0.35);
  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-1 pb-4 pt-1">
          <p className="eyebrow text-fg-4">Change 27 · same four people, new rules</p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-signal">Nobody had to become braver</p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {CHAIRS.map((c, i) => {
            const I = c.icon;
            const flipped = step > i;
            return (
              <li key={c.id} className={`flex flex-col rounded-xl border p-4 transition-colors duration-500 ${flipped ? "border-signal/40 bg-signal/[0.05]" : "border-line bg-bg-2/40"}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${flipped ? "border-signal/60 text-signal" : "border-line-2 text-fg-3"}`}>
                    <I className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <p className="text-[14px] font-medium text-fg">{c.role}</p>
                </div>
                <p className="mt-3 text-[12.5px] leading-snug text-fg-4">
                  <span className="sr-only">Under the old rules: </span>
                  <span className={`decoration-danger/60 transition-[text-decoration-color] ${flipped ? "line-through" : ""}`}>{c.before}</span>
                </p>
                <p className={`mt-2 text-[13.5px] leading-snug text-fg transition-all duration-500 ${flipped ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>
                  <span className="sr-only">Under the new rules: </span>
                  {c.after}
                </p>
                <p className={`mt-auto pt-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-signal transition-opacity duration-500 ${flipped ? "opacity-100" : "opacity-0"}`}>
                  {c.rule}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "The same composites as before. What changed is the rules around them."}
      </figcaption>
    </figure>
  );
}

function ChairsBefore({ caption }: { caption?: string }) {
  const [sel, setSel] = useState<Chair["id"]>("po");
  const baseId = useId();
  const reduced = useReducedMotionAfterMount();
  const chair = CHAIRS.find((c) => c.id === sel)!;
  const owns = OWNS[chair.id];
  const isCC = owns === "all";
  const Icon = chair.icon;

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        <div className="border-b border-line px-5 pb-4 pt-5 sm:px-6">
          <p className="eyebrow text-fg-4">Change 27 · {Math.round(C27_TOTAL)} days, seen from four chairs</p>

          {/* Change 27's life, coloured by whose desk it was waiting on */}
          <div className="relative mt-4 flex h-4 gap-[2px] overflow-hidden rounded-md" dir="ltr" role="img" aria-label={`Change 27's ${Math.round(TOTAL)} days. ${chair.role}: ${isCC ? "paid for all of them" : `${fmt(daysHeld(chair))} waited with them`}.`}>
            {SEGMENTS.map((s) => {
              const on = isCC || (owns as Owner[]).includes(s.owner);
              return (
                <span
                  key={s.id}
                  title={`${s.label}: ${fmt(s.days)}`}
                  className={`h-full transition-colors duration-500 ${on ? (isCC ? "bg-accent" : "bg-danger/75") : "bg-line-2"}`}
                  style={{ flexGrow: s.days, flexBasis: 0, minWidth: s.days < 0.5 ? 2 : undefined }}
                />
              );
            })}
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10.5px] text-fg-4" dir="ltr" aria-hidden="true">
            <span>Approved</span>
            <span>Live, day {Math.round(TOTAL)}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[13.5rem_minmax(0,1fr)]">
          <div className="grid grid-cols-2 gap-1.5 border-b border-line p-3 md:flex md:flex-col md:border-b-0 md:border-e" role="tablist" aria-label="Chairs">
            {CHAIRS.map((c) => {
              const I = c.icon;
              const active = sel === c.id;
              return (
                <button
                  key={c.id}
                  id={`${baseId}-tab-${c.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${baseId}-panel`}
                  onClick={() => setSel(c.id)}
                  className={`flex min-w-0 items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-start sm:px-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    active ? "bg-surface-2 text-fg" : "text-fg-3 hover:bg-surface-2/60 hover:text-fg"
                  }`}
                >
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${active ? "border-accent text-accent" : "border-line-2"}`}>
                    <I className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium leading-tight">{c.role}</span>
                    <span className={`block font-mono text-[10.5px] tabular-nums ${c.id === "cc" ? "text-accent" : "text-danger"}`}>
                      {c.id === "cc" ? `paid for all ${Math.round(TOTAL)}` : `${fmt(daysHeld(c))} here`}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${sel}`} className="relative p-5 sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={chair.id}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full border border-accent/50 text-accent">
                    <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-[1.35rem] leading-tight text-fg">{chair.role}</p>
                    <p className="text-[12.5px] text-fg-3">
                      {isCC ? (
                        <>Held none of the wait. <span className="text-accent">Paid for every day of it.</span></>
                      ) : (
                        <>
                          Change 27 waited here for <span className="font-mono tabular-nums text-danger">{fmt(daysHeld(chair))}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <dl className="mt-5 grid gap-x-6 gap-y-4 text-[13.5px] leading-relaxed sm:grid-cols-2">
                  {[
                    ["Measured on", chair.measured],
                    ["A bad day", chair.badDay],
                    ["What change 27 looked like from here", chair.sees],
                    [chair.rationalLabel ?? "Why waiting was the smart choice", chair.rational],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="eyebrow text-fg-4">{k}</dt>
                      <dd className="mt-1 text-fg-2">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 rounded-xl border border-signal/35 bg-signal/[0.07] px-4 py-3.5">
                  <p className="eyebrow text-signal">The rule that flips it</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-fg">{chair.flip}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Change 27 and its days come from the model in the previous two essays. The four people are composites, not anyone in particular."}
      </figcaption>
    </figure>
  );
}
