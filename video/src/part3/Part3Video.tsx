import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Background, Chrome } from "../primitives";
import { Hook, Silos, Thesis } from "./ActOne";
import { Normalize, Pipeline } from "./ActTwo";
import { Cta, Drift, Hub } from "./ActThree";

type SceneDef = { id: string; dur: number; C: React.FC<{ dur: number }> };

export const PART3_SCENES: SceneDef[] = [
  { id: "hook", dur: 150, C: Hook },
  { id: "silos", dur: 270, C: Silos },
  { id: "thesis", dur: 156, C: Thesis },
  { id: "normalize", dur: 390, C: Normalize },
  { id: "pipeline", dur: 360, C: Pipeline },
  { id: "drift", dur: 300, C: Drift },
  { id: "hub", dur: 216, C: Hub },
  { id: "cta", dur: 246, C: Cta },
];

export const PART3_DURATION = PART3_SCENES.reduce((a, s) => a + s.dur, 0);

const STARTS = PART3_SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + PART3_SCENES[i - 1].dur);
  return acc;
}, []);

export const Part3Video: React.FC = () => (
  <AbsoluteFill>
    <Background />
    {PART3_SCENES.map((s, i) => (
      <Sequence key={s.id} from={STARTS[i]} durationInFrames={s.dur} name={s.id}>
        <s.C dur={s.dur} />
      </Sequence>
    ))}
    <Chrome total={PART3_DURATION} ticks={STARTS.slice(1)} part={3} of={8} />
  </AbsoluteFill>
);
