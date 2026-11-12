import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Background, Chrome } from "../primitives";

export type SceneDef = { id: string; dur: number; C: React.FC<{ dur: number }> };

/** Lays scenes end to end on one timeline with the persistent background + brand chrome. */
export const buildSeriesVideo = (scenes: SceneDef[], part: number, of = 8) => {
  const duration = scenes.reduce((a, s) => a + s.dur, 0);
  const starts = scenes.reduce<number[]>((acc, s, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + scenes[i - 1].dur);
    return acc;
  }, []);
  const Video: React.FC = () => (
    <AbsoluteFill>
      <Background />
      {scenes.map((s, i) => (
        <Sequence key={s.id} from={starts[i]} durationInFrames={s.dur} name={s.id}>
          <s.C dur={s.dur} />
        </Sequence>
      ))}
      <Chrome total={duration} ticks={starts.slice(1)} part={part} of={of} />
    </AbsoluteFill>
  );
  return { duration, Video };
};
