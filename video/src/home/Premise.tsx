import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PREMISE } from "./content";
import { LitLine, Stage, span, useFrameInfo } from "./kit";
import { TYPE } from "./theme";

/**
 * 2 · Premise (dark). STORY.premise, one sentence per screen: each arrives dim and lights up word by word.
 * One accent per beat: only the closing "From zero." lights into the accent colour; the other marked phrases
 * light up white like the rest of their sentence.
 */

/** The sentence whose marked phrase keeps the accent. */
const ACCENTED = 3;

/** Where a sentence breaks before its accent phrase (copy unchanged). */
const BREAK_BEFORE_ACCENT = [false, true, false, true];

/** Scene-local frames: [enter, first word lights, exit]. */
const SCHEDULE: [number, number, number][] = [
  [14, 22, 86],
  [92, 98, 150],
  [156, 162, 220],
  [226, 232, 999],
];

export const Premise: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { portrait } = useFrameInfo();
  return (
    <Stage tone="dark" dur={dur} push={0.03}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {PREMISE.map((line, i) => {
          const [enter, lit0, exit] = SCHEDULE[i];
          if (f < enter - 1 || f > exit + 16) return null;
          const broken = BREAK_BEFORE_ACCENT[i] ? line.replace(" *", "\n*") : line;
          const text = i === ACCENTED ? broken : broken.replace(/\*/g, "");
          return (
            <div key={line} style={{ position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <LitLine
                text={text}
                tone="dark"
                enter={span(f, enter, enter + 18)}
                frame={f}
                lit0={lit0}
                stagger={2.6}
                len={11}
                out={span(f, exit, exit + 14)}
                size={portrait ? 84 : 96}
                type={TYPE.h1}
                style={{ maxWidth: portrait ? 940 : 1640, lineHeight: 1.08, wordSpacing: "0.05em" }}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
