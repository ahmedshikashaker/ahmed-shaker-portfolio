"use client";

import { useRef } from "react";
import { useStepsOnView } from "./useMotionReady";

/**
 * "Hope vs. reward": Steven Kerr's folly of rewarding A while hoping for B, as a balance. What the bank hopes
 * for sits on one pan, what it actually rewards on the other, and the beam tips towards the reward.
 * The pans follow the beam ends at any width: they move by (half the beam) × sin(tilt), using container units.
 */

const HOPED = ["Small, frequent releases", "Risks raised early", "Ideas from the front line", "Teams that share the work"];
const REWARDED = ["No incident with your name on it", "Launch dates hit", "Every change through the committee", "Your own team’s targets met"];
const TILT = 7; // degrees
const HALF_BEAM = 28; // beam spans 22%–78% of the container: half of it is 28cqw

export default function HopeReward({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const tipped = useStepsOnView(ref, 1, 450, 0.5) >= 1;
  const shift = `calc(${HALF_BEAM}cqw * sin(${TILT}deg))`;
  const move = "transition-transform duration-[1400ms] ease-[cubic-bezier(0.34,1.4,0.5,1)]";

  const pan = (title: string, items: string[], side: "hope" | "reward") => (
    <div className={`relative ${move}`} style={{ transform: tipped ? `translateY(${side === "hope" ? `calc(-1 * ${shift})` : shift})` : "translateY(0)" }}>
      {/* the string up to the beam */}
      <span aria-hidden="true" className="mx-auto block h-7 w-px bg-line-3" />
      <div className={`rounded-2xl border px-3 py-3 sm:px-4 ${side === "hope" ? "border-line-2 bg-bg-2/40" : "border-danger/45 bg-danger/[0.07]"}`}>
        <p className={`eyebrow ${side === "hope" ? "text-fg-4" : "text-danger"}`}>{title}</p>
        <ul className="mt-2.5 space-y-1.5">
          {items.map((t) => (
            <li
              key={t}
              className={`rounded-lg border px-2.5 py-1.5 text-[12px] leading-snug sm:text-[12.5px] ${
                side === "hope" ? "border-dashed border-line-3 text-fg-3" : "border-danger/35 bg-surface font-medium text-fg"
              }`}
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="rounded-2xl border border-line-2 bg-surface px-4 pb-5 pt-6 shadow-[var(--shadow-soft)] sm:px-6">
        <div className="@container relative pt-6" dir="ltr">
          {/* beam */}
          <div className="absolute left-[22%] right-[22%] top-6 h-0" aria-hidden="true">
            <div className={`absolute inset-x-0 -top-[3px] h-[6px] origin-center rounded-full bg-fg-3 ${move}`} style={{ transform: tipped ? `rotate(${TILT}deg)` : "rotate(0deg)" }} />
          </div>
          {/* fulcrum and post */}
          <div aria-hidden="true" className="absolute left-1/2 top-6 -translate-x-1/2">
            <div className="mx-auto size-3 -translate-y-1.5 rounded-full border-2 border-fg-3 bg-surface" />
          </div>
          <div aria-hidden="true" className="absolute bottom-0 left-1/2 top-[1.9rem] w-[3px] -translate-x-1/2 rounded-full bg-line-3" />
          <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-[3px] w-24 -translate-x-1/2 rounded-full bg-line-3" />

          <div className="relative grid grid-cols-2 gap-x-[16%] px-[1%] pb-4">
            {pan("What the bank hopes for", HOPED, "hope")}
            {pan("What it actually rewards", REWARDED, "reward")}
          </div>
        </div>
        <p className="sr-only">
          A balance. On one side, what the bank hopes for: {HOPED.join(", ")}. On the heavier side, what it actually rewards: {REWARDED.join(", ")}.
        </p>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "“On the Folly of Rewarding A, While Hoping for B” (Steven Kerr, 1975). People follow the reward."}
      </figcaption>
    </figure>
  );
}
