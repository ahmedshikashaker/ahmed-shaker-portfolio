"use client";

import { useId, useState } from "react";
import { Check, X } from "lucide-react";

/**
 * "The gatekeeper's arithmetic": the personal payoff of approving a change now vs. holding it for the next
 * committee, under three sets of rules. Illustrative scores (not survey data); the point is the shape.
 * Optionally, losses are weighted about twice as heavily as gains (loss aversion; Brown et al., 2024 meta-analysis).
 */

type RuleSet = "old" | "bonus" | "new";
type Cell = { score: number; note: string };
interface Rules {
  label: string;
  short: string;
  approve: [Cell, Cell]; // [it works, it breaks]
  hold: [Cell, Cell];
}

const RULES: Record<RuleSet, Rules> = {
  old: {
    label: "The old rules",
    short: "Old rules",
    approve: [
      { score: 0, note: "Nobody notices. Speed isn’t in your objectives." },
      { score: -10, note: "Your signature is on it: incident review, audit finding, questions about your judgement." },
    ],
    hold: [
      { score: 0, note: "Nobody notices the extra week either." },
      { score: -2, note: "It went through the committee. The process failed, not you." },
    ],
  },
  bonus: {
    label: "Old rules plus a speed target",
    short: "+ speed target",
    approve: [
      { score: 2, note: "A little credit towards the new speed target." },
      { score: -10, note: "Still your signature, still your incident review." },
    ],
    hold: [
      { score: 0, note: "Nobody notices the extra week." },
      { score: -2, note: "It went through the committee. The process failed, not you." },
    ],
  },
  new: {
    label: "New rules",
    short: "New rules",
    approve: [
      { score: 2, note: "Lead time is a shared objective. Fast and safe counts for you too." },
      { score: -2, note: "A small release, rolled back automatically in minutes. A blameless review, shared by the team." },
    ],
    hold: [
      { score: -1, note: "Holding has a visible cost: the wait shows on the lead-time chart you share." },
      { score: -3, note: "Held changes go out in bigger batches, and bigger batches fail harder." },
    ],
  },
};

const LAMBDA = 2; // losses weigh about twice as much as gains
const P_MAX = 0.3;

export default function GatekeeperMath({ caption }: { caption?: string }) {
  const [rules, setRules] = useState<RuleSet>("old");
  const [p, setP] = useState(0.05);
  const [averse, setAverse] = useState(true);
  const id = useId();
  const R = RULES[rules];
  const lam = averse ? LAMBDA : 1;
  const felt = (x: number) => (x < 0 ? x * lam : x);
  const ev = (cells: [Cell, Cell], q: number) => (1 - q) * felt(cells[0].score) + q * felt(cells[1].score);
  const evA = ev(R.approve, p);
  const evH = ev(R.hold, p);
  const diff = evA - evH;
  const verdict: "approve" | "hold" | "tie" = Math.abs(diff) < 1e-9 ? "tie" : diff > 0 ? "approve" : "hold";

  // Where along the risk axis does approving stop paying? d(q) is linear in q.
  const d0 = ev(R.approve, 0) - ev(R.hold, 0);
  const d1 = ev(R.approve, 1) - ev(R.hold, 1);
  const crossing = d0 !== d1 ? d0 / (d0 - d1) : null; // q where d = 0
  const approveZone =
    d0 > 0 && d1 >= 0 ? [0, P_MAX] : d0 > 0 && crossing !== null ? [0, Math.min(P_MAX, crossing)] : d0 <= 0 && d1 > 0 && crossing !== null ? [Math.max(0, crossing), P_MAX] : null;

  const scale = 12; // bar scale, in felt points
  const bar = (v: number) => {
    const w = Math.min(50, (Math.abs(v) / scale) * 50);
    return v >= 0 ? { left: "50%", width: `${w}%` } : { left: `${50 - w}%`, width: `${w}%` };
  };
  const pctTxt = (q: number) => `${Math.round(q * 100)}%`;

  return (
    <figure className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <p className="eyebrow text-fg-4">The gatekeeper’s arithmetic</p>
          <div className="inline-flex flex-wrap rounded-full border border-line-2 p-0.5" role="group" aria-label="Which rules apply">
            {(Object.keys(RULES) as RuleSet[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={rules === k}
                onClick={() => setRules(k)}
                className={`rounded-full px-3 py-1.5 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  rules === k ? "bg-accent text-on-accent" : "text-fg-3 hover:text-fg"
                }`}
              >
                {RULES[k].short}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pt-5 sm:px-6">
          <p className="text-[13.5px] leading-relaxed text-fg-2">
            You’re the person who has to say yes to change 27. Here’s what each choice is worth to <em>you</em>, personally, under{" "}
            <strong className="font-semibold text-fg">{R.label.toLowerCase()}</strong>.
          </p>

          {/* The 2×2 */}
          <div className="mt-4 overflow-hidden rounded-xl border border-line">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)] bg-line text-[12.5px] sm:grid-cols-[8.5rem_minmax(0,1fr)_minmax(0,1fr)]" style={{ gap: 1 }}>
              <div className="bg-surface-2/60" />
              <div className="bg-surface-2/60 px-3 py-2 font-medium text-fg">
                It works <span className="font-mono text-[11px] font-normal text-fg-4">{pctTxt(1 - p)}</span>
              </div>
              <div className="bg-surface-2/60 px-3 py-2 font-medium text-fg">
                It breaks <span className="font-mono text-[11px] font-normal text-fg-4">{pctTxt(p)}</span>
              </div>
              {(
                [
                  ["Approve now", R.approve],
                  ["Hold for the committee", R.hold],
                ] as const
              ).map(([label, cells]) => (
                <div key={label} className="contents">
                  <div className="flex items-center bg-surface-2/60 px-3 py-3 font-medium leading-snug text-fg">{label}</div>
                  {cells.map((c, i) => (
                    <div key={i} className="bg-surface px-3 py-3">
                      <span
                        className={`font-display text-[1.45rem] leading-none tabular-nums ${c.score > 0 ? "text-signal" : c.score < 0 ? "text-danger" : "text-fg-3"}`}
                      >
                        {c.score > 0 ? `+${c.score}` : c.score === 0 ? "0" : `−${Math.abs(c.score)}`}
                      </span>
                      <p className="mt-1.5 text-[12px] leading-snug text-fg-3">{c.note}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:px-6">
          <div>
            <label htmlFor={`${id}-p`} className="flex items-baseline justify-between text-[12.5px] text-fg-2">
              <span>How likely is it that this change causes a problem?</span>
              <span className="font-mono tabular-nums text-fg">{pctTxt(p)}</span>
            </label>
            <input
              id={`${id}-p`}
              type="range"
              suppressHydrationWarning
              min={1}
              max={P_MAX * 100}
              step={1}
              value={Math.round(p * 100)}
              onChange={(e) => setP(Number(e.target.value) / 100)}
              aria-valuetext={`${pctTxt(p)} chance of a problem`}
              className="ql-range mt-2 w-full"
            />
            {/* Where approving pays, along the same axis */}
            <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-danger/35" aria-hidden="true">
              {approveZone && (
                <span
                  className="absolute inset-y-0 bg-signal/80"
                  style={{ left: `${(approveZone[0] / P_MAX) * 100}%`, width: `${((approveZone[1] - approveZone[0]) / P_MAX) * 100}%` }}
                />
              )}
            </div>
            <p className="mt-1.5 text-[11.5px] text-fg-4">
              <span className="me-1 inline-block size-2 rounded-full bg-signal/80 align-middle" /> approving pays
              <span className="me-1 ms-3 inline-block size-2 rounded-full bg-danger/50 align-middle" /> holding pays
              {rules === "bonus" && crossing !== null && crossing > 0 && crossing < P_MAX && <> · the speed target only wins below {pctTxt(crossing)}</>}
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-[12.5px] text-fg-2">
            <button
              type="button"
              role="switch"
              aria-checked={averse}
              onClick={() => setAverse((v) => !v)}
              className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                averse ? "border-accent bg-accent" : "border-line-3 bg-line"
              }`}
            >
              <span className={`absolute top-0.5 size-3.5 rounded-full bg-bg shadow transition-[inset-inline-start] ${averse ? "start-[1.05rem]" : "start-0.5"}`} />
            </button>
            <span>Losses weigh about twice as much as gains</span>
          </label>
        </div>

        {/* Result */}
        <div className="border-t border-line px-5 py-5 sm:px-6">
          <p className="eyebrow text-fg-4">What each choice is worth to you, on average</p>
          <div className="mt-3 space-y-2.5">
            {(
              [
                ["Approve now", evA, verdict === "approve"],
                ["Hold for the committee", evH, verdict === "hold"],
              ] as const
            ).map(([label, v, win]) => (
              <div key={label} className="grid grid-cols-[7.5rem_minmax(0,1fr)_3.2rem] items-center gap-3 text-[12.5px] sm:grid-cols-[10rem_minmax(0,1fr)_3.5rem]">
                <span className={`flex items-center gap-1.5 ${win ? "font-medium text-fg" : "text-fg-3"}`}>
                  {win ? <Check className="size-3.5 text-signal" strokeWidth={2.25} aria-hidden="true" /> : <X className="size-3.5 text-fg-4" strokeWidth={2} aria-hidden="true" />}
                  {label}
                </span>
                <div className="relative h-3 rounded-full bg-line/60" aria-hidden="true" dir="ltr">
                  <span className="absolute inset-y-[-3px] left-1/2 w-px bg-line-3" />
                  <span className={`absolute inset-y-0 rounded-full transition-all duration-300 ${v >= 0 ? "bg-signal/80" : "bg-danger/70"}`} style={bar(v)} />
                </div>
                <span className={`text-end font-mono tabular-nums ${v >= 0 ? "text-signal" : "text-danger"}`}>
                  {v >= 0 ? "+" : "−"}
                  {Math.abs(v).toFixed(1)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13.5px] leading-relaxed text-fg" aria-live="polite">
            {verdict === "tie"
              ? "No difference either way, and so no reason to hurry."
              : verdict === "hold"
                ? rules === "old"
                  ? "Holding wins, at every level of risk. Even a change that almost certainly works is safer to delay."
                  : `Holding wins at ${pctTxt(p)} risk. The speed credit is too small to outweigh the blame.`
                : rules === "new"
                  ? "Approving wins, at every level of risk. Holding now has a cost, and failing fast no longer costs a career."
                  : `Approving wins, but only because you’re confident: above ${pctTxt(crossing ?? 0)} risk, holding wins again.`}
          </p>
        </div>

        <details className="group border-t border-line px-5 py-4 text-[13px] leading-relaxed text-fg-3 sm:px-6">
          <summary className="cursor-pointer list-none font-medium text-fg-2 hover:text-fg">
            <span className="me-2 inline-block transition-transform group-open:rotate-90">›</span>
            How this model works
          </summary>
          <div className="mt-3 space-y-2 ps-4">
            <p>
              Each cell is an illustrative score for what the outcome means to the person who signs: credit, nothing, or blame. They’re not measured
              data; change them in your head and the shape survives. Each choice’s value is the chance-weighted average of its two outcomes.
            </p>
            <p>
              With the switch on, losses count twice, close to the average loss-aversion coefficient (about 1.96) in a 2024 meta-analysis of 607
              estimates by Brown, Imai, Vieider and Camerer.
            </p>
          </div>
        </details>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Switch the rules, then move the slider. Illustrative scores; the shape is the point."}
      </figcaption>
    </figure>
  );
}
