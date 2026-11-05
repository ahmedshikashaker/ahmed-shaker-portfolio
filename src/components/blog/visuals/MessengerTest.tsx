"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Handshake, Lightbulb, Megaphone, Siren } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * "The messenger test": the same moment handled by Westrum's three organisational cultures (pathological,
 * bureaucratic, generative), and what people learn from each response. The row labels are Westrum's own
 * (as tabulated by DORA); the responses are illustrative.
 */

const CULTURES = [
  { id: "path", name: "Pathological", orient: "Power-oriented" },
  { id: "bur", name: "Bureaucratic", orient: "Rule-oriented" },
  { id: "gen", name: "Generative", orient: "Performance-oriented" },
] as const;

interface Scenario {
  id: string;
  tab: string;
  icon: typeof Siren;
  moment: string;
  westrum: [string, string, string]; // Westrum's row, one phrase per culture
  responses: [string, string, string];
  lessons: [string, string, string];
}

const SCENARIOS: Scenario[] = [
  {
    id: "failure",
    tab: "A release breaks",
    icon: Siren,
    moment: "A release breaks something at 2 a.m.",
    westrum: ["Failure leads to scapegoating", "Failure leads to justice", "Failure leads to inquiry"],
    responses: [
      "The first question is who approved it.",
      "A new sign-off step is added, for every change, from now on.",
      "A blameless review asks what made the problem easy to miss, and fixes that.",
    ],
    lessons: ["Never be the one who signs.", "More steps, slower releases, the same blind spots.", "Report problems early. They get fixed, not punished."],
  },
  {
    id: "messenger",
    tab: "Someone raises a risk",
    icon: Megaphone,
    moment: "An engineer flags a risk the day before a launch.",
    westrum: ["Messengers punished", "Messengers neglected", "Messengers trained"],
    responses: [
      "The launch goes ahead, and the engineer is “not a team player”.",
      "The concern is logged and routed to next month’s committee.",
      "The launch pauses for an hour while the people who can judge it take a look.",
    ],
    lessons: ["Keep quiet next time.", "Raising an issue is paperwork.", "Speaking up is part of the job."],
  },
  {
    id: "novelty",
    tab: "A new idea",
    icon: Lightbulb,
    moment: "The contact-centre lead proposes fixing the sentence behind a month of calls.",
    westrum: ["Novelty crushed", "Novelty leads to problems", "Novelty implemented"],
    responses: [
      "It’s outside their remit, and it goes nowhere.",
      "Please submit it through the demand process for next quarter.",
      "It goes onto the factory’s board this week, with the call data attached.",
    ],
    lessons: ["Ideas are risky.", "Ideas are slow.", "Ideas from the front line count."],
  },
  {
    id: "bridging",
    tab: "Teams need each other",
    icon: Handshake,
    moment: "Two teams need each other to finish a change.",
    westrum: ["Bridging discouraged", "Bridging tolerated", "Bridging encouraged"],
    responses: [
      "Each protects its own targets, and the work waits between them.",
      "A coordination meeting is booked for next month.",
      "They sit together until it ships.",
    ],
    lessons: ["Stay in your lane.", "Cross the line only with a meeting.", "The customer’s outcome is everyone’s job."],
  },
];

const TONE = ["text-danger", "text-fg-3", "text-signal"] as const;

export default function MessengerTest({ caption }: { caption?: string }) {
  const [sel, setSel] = useState(SCENARIOS[0].id);
  const baseId = useId();
  const reduced = useReducedMotionAfterMount();
  const s = SCENARIOS.find((x) => x.id === sel)!;

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        <div className="border-b border-line px-5 pt-4 sm:px-6">
          <p className="eyebrow text-fg-4">The messenger test · three cultures, one moment</p>
          <div className="mt-3 flex flex-wrap gap-1.5 pb-4" role="tablist" aria-label="Moments">
            {SCENARIOS.map((x) => {
              const I = x.icon;
              const active = x.id === sel;
              return (
                <button
                  key={x.id}
                  id={`${baseId}-tab-${x.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${baseId}-panel`}
                  onClick={() => setSel(x.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    active ? "border-accent bg-accent text-on-accent" : "border-line-2 text-fg-2 hover:border-line-3 hover:text-fg"
                  }`}
                >
                  <I className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {x.tab}
                </button>
              );
            })}
          </div>
        </div>

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${sel}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={s.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <p className="px-5 pb-1 pt-5 font-display text-[1.3rem] leading-snug text-fg sm:px-6">{s.moment}</p>
              <div className="grid gap-3 p-5 sm:px-6 md:grid-cols-3">
                {CULTURES.map((c, i) => {
                  const gen = c.id === "gen";
                  return (
                    <div
                      key={c.id}
                      className={`flex flex-col rounded-xl border p-4 ${gen ? "border-signal/45 bg-signal/[0.06]" : "border-line bg-bg-2/40"}`}
                    >
                      <p className={`text-[13px] font-semibold ${TONE[i]}`}>{c.name}</p>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">{c.orient}</p>
                      <p className="mt-3 text-[13.5px] leading-snug text-fg">{s.responses[i]}</p>
                      <p className="mt-auto pt-3 text-[12.5px] leading-snug text-fg-3">
                        <span className="eyebrow block text-fg-4">People learn</span>
                        <span className={gen ? "text-fg-2" : ""}>{s.lessons[i]}</span>
                      </p>
                      <p className={`mt-3 border-t pt-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] ${gen ? "border-signal/30 text-signal" : "border-line text-fg-4"}`}>
                        {s.westrum[i]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="border-t border-line px-5 py-4 text-[13px] leading-relaxed text-fg-2 sm:px-6">
          DORA’s research finds that a high-trust, generative culture <strong className="font-semibold text-fg">predicts software delivery and organisational performance</strong>.
        </p>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "The labels at the foot of each column are Ron Westrum’s typology, as used in DORA’s research. The responses are illustrative."}
      </figcaption>
    </figure>
  );
}
