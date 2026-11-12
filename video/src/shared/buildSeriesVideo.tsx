import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile } from "remotion";
import { Background, Chrome, SceneClock } from "../primitives";
import manifest from "../voiceover/manifest.json";

export type SceneDef = { id: string; dur: number; C: React.FC<{ dur: number }> };

const FPS = 30;
const MAX_STRETCH = 1.45;
const VO_LEAD = 12; // narration starts 0.4 s into each scene (after the fade-in begins)
const VO_TAIL = 26; // breathing room after each line before the scene fades out
const MUSIC = "music/governed-autonomy-bed.mp3";
const MUSIC_VOLUME = 0.12; // subtle bed, ~12 dB under the narration
const MUSIC_FADE = 45;

type Manifest = Record<string, Record<string, { seconds: number }>>;

/**
 * Lays scenes end to end on one timeline with the persistent background + brand chrome.
 * When `voKey` is given, each scene plays its ElevenLabs narration clip and is stretched
 * (never shortened) so the narration always fits, and a subtle music bed runs underneath.
 */
export const buildSeriesVideo = (scenes: SceneDef[], part: number, voKey?: string, of = 8) => {
  const vo = voKey ? (manifest as Manifest)[voKey] ?? {} : {};
  const timed = scenes.map((s) => {
    const clip = vo[s.id];
    const voFrames = clip ? Math.ceil(clip.seconds * FPS) : 0;
    const dur = clip ? Math.max(s.dur, VO_LEAD + voFrames + VO_TAIL) : s.dur;
    // Slow the scene's own animations to follow the narration (capped so motion never drags).
    const clock = Math.min(MAX_STRETCH, dur / s.dur);
    return { ...s, dur, clock, hasVo: Boolean(clip) };
  });
  const duration = timed.reduce((a, s) => a + s.dur, 0);
  const starts = timed.reduce<number[]>((acc, s, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + timed[i - 1].dur);
    return acc;
  }, []);

  const Video: React.FC = () => (
    <AbsoluteFill>
      <Background />
      {timed.map((s, i) => (
        <Sequence key={s.id} from={starts[i]} durationInFrames={s.dur} name={s.id}>
          <SceneClock.Provider value={s.clock}>
            <s.C dur={s.dur} />
          </SceneClock.Provider>
          {s.hasVo && (
            <Sequence from={VO_LEAD} name={`vo-${s.id}`}>
              <Html5Audio src={staticFile(`vo/${voKey}/${s.id}.mp3`)} volume={1} />
            </Sequence>
          )}
        </Sequence>
      ))}
      {voKey && (
        <Html5Audio
          src={staticFile(MUSIC)}
          loop
          volume={(f) =>
            MUSIC_VOLUME *
            interpolate(f, [0, MUSIC_FADE, duration - MUSIC_FADE * 2, duration - 4], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      )}
      <Chrome total={duration} ticks={starts.slice(1)} part={part} of={of} />
    </AbsoluteFill>
  );
  return { duration, Video };
};
