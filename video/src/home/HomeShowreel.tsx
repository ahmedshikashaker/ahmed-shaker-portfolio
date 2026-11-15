import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { ColdOpen } from "./ColdOpen";
import { EightLines } from "./EightLines";
import { EndCard } from "./EndCard";
import { Factories } from "./Factories";
import { Premise } from "./Premise";
import { Proof } from "./Proof";
import { Stack } from "./Stack";
import { MOVE, span } from "./kit";
import { FADE, T, TOTAL, WIPE } from "./timeline";

export const HOME_SHOWREEL_DURATION = TOTAL;

type Key = keyof typeof T;

const SCENES: Partial<Record<Key, React.FC<{ dur: number }>>> = {
  open: ColdOpen,
  premise: Premise,
  factories: Factories,
  eight: EightLines,
  stack: Stack,
  proof: Proof,
  end: EndCard,
};

const ORDER = Object.keys(T) as Key[];

/** How a beat arrives: a band of its tone rising from the bottom of the frame, or a crossfade. */
const Entry: React.FC<{ k: Key; children: React.ReactNode }> = ({ k, children }) => {
  const f = useCurrentFrame();
  const { enter } = T[k];
  if (enter === "wipe") {
    const p = span(f, 0, WIPE, MOVE);
    return <AbsoluteFill style={{ clipPath: p < 1 ? `inset(${(1 - p) * 100}% 0 0 0)` : undefined }}>{children}</AbsoluteFill>;
  }
  if (enter === "fade") return <AbsoluteFill style={{ opacity: span(f, 0, FADE) }}>{children}</AbsoluteFill>;
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

/** The outgoing beat drifts up a little while the next one wipes over it, like the page scrolling on. */
const Exit: React.FC<{ next?: Key; children: React.ReactNode }> = ({ next, children }) => {
  const f = useCurrentFrame();
  if (!next || T[next].enter !== "wipe") return <AbsoluteFill>{children}</AbsoluteFill>;
  const q = span(f, T[next].from, T[next].from + WIPE, MOVE);
  return <AbsoluteFill style={{ transform: q > 0 ? `translateY(${-q * 110}px)` : undefined }}>{children}</AbsoluteFill>;
};

export const HomeShowreel: React.FC = () => (
  <AbsoluteFill style={{ background: "#ffffff" }}>
    {ORDER.map((k, i) => {
      const Scene = SCENES[k];
      if (!Scene) return null;
      return (
        <Exit key={k} next={ORDER[i + 1]}>
          <Sequence from={T[k].from} durationInFrames={T[k].dur} name={k}>
            <Entry k={k}>
              <Scene dur={T[k].dur} />
            </Entry>
          </Sequence>
        </Exit>
      );
    })}
  </AbsoluteFill>
);
