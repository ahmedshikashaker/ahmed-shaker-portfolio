import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { segments } from "./content";
import { TONES, Tone } from "./theme";

/* ------------------------------------------------------------------ timing */

/** The site's ease (launch/motion.tsx EASE): quick to start, long soft landing. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
/** Symmetric ease for things that travel across the frame (wipes, camera moves). */
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
/** A gentle in-out for long, slow moves (push-ins, drifts). */
export const DRIFT = Easing.bezier(0.45, 0, 0.55, 1);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Eased 0 → 1 between two frames. */
export const span = (f: number, a: number, b: number, easing: (t: number) => number = EASE) =>
  b <= a ? (f >= b ? 1 : 0) : interpolate(f, [a, b], [0, 1], { ...clamp, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const useFrameInfo = () => {
  const { width, height } = useVideoConfig();
  return { W: width, H: height, portrait: height > width };
};

/* ------------------------------------------------------------------ stage */

/**
 * A scene's band: one tone, full frame, and a slow camera push-in on everything inside it.
 * `push` is the extra scale reached at the end of the scene.
 */
export const Stage: React.FC<{
  tone: Tone;
  dur: number;
  push?: number;
  origin?: string;
  children: React.ReactNode;
}> = ({ tone, dur, push = 0.035, origin = "50% 50%", children }) => {
  const f = useCurrentFrame();
  const s = 1 + push * span(f, 0, dur, DRIFT);
  return (
    <AbsoluteFill style={{ background: TONES[tone].bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origin }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ type */

/** The accent phrase: solid --l-accent, the only colour a beat's copy carries. */
export const Accent: React.FC<{ tone: Tone; children: React.ReactNode; style?: React.CSSProperties }> = ({ tone, children, style }) => (
  <span style={{ color: TONES[tone].accent, ...style }}>{children}</span>
);

/** Rise-and-fade for one element: p 0 → 1 lifts it into place; `out` 0 → 1 carries it up and away. */
export const rise = (p: number, out = 0, dist = 0.4, blur = 6): React.CSSProperties => {
  const o = p * (1 - out);
  const y = (1 - p) * dist - out * dist * 0.6;
  const b = (1 - p) * blur + out * blur;
  return {
    opacity: o,
    transform: `translateY(${y}em)`,
    filter: b > 0.05 ? `blur(${b}px)` : undefined,
  };
};

export type Unit = { text: string; ink: boolean; br?: boolean };

/** Copy split into animation units: single words, except the accent phrase, which moves as one. "\n" breaks. */
export const units = (text: string): Unit[] => {
  const out: Unit[] = [];
  text.split("\n").forEach((line, li) => {
    if (li > 0) out.push({ text: "", ink: false, br: true });
    segments(line).forEach((seg) => {
      if (seg.ink) out.push({ text: seg.text.trim(), ink: true });
      else
        seg.text
          .split(" ")
          .filter(Boolean)
          .forEach((w) => out.push({ text: w, ink: false }));
    });
  });
  return out;
};

/**
 * A statement whose words rise into place one after another (the accent phrase rises as one piece).
 * `start` is the frame the first word starts; `stagger` frames between words; `len` frames per word.
 */
export const Statement: React.FC<{
  text: string;
  tone: Tone;
  start: number;
  stagger?: number;
  len?: number;
  out?: number;
  size: number;
  type?: React.CSSProperties;
  color?: string;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ text, tone, start, stagger = 3, len = 26, out = 0, size, type, color, align = "left", style }) => {
  const f = useCurrentFrame();
  const list = units(text);
  let k = 0;
  return (
    <div style={{ fontSize: size, color: color ?? TONES[tone].fg, textAlign: align, textWrap: "balance", ...type, ...style } as React.CSSProperties}>
      {list.map((unit, i) => {
        if (unit.br) return <br key={i} />;
        const p = span(f, start + k * stagger, start + k * stagger + len);
        k += 1;
        const next = list[i + 1];
        return (
          <React.Fragment key={i}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap", ...rise(p, out) }}>
              {unit.ink ? <Accent tone={tone}>{unit.text}</Accent> : unit.text}
            </span>
            {next && !next.br ? " " : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * A sentence that arrives dim, then lights up word by word (apple.com's scroll-lit copy). The accent phrase
 * lights up into the accent colour as one piece.
 */
export const LitLine: React.FC<{
  text: string;
  tone: Tone;
  /** 0 → 1: the sentence rises in, still dim. */
  enter: number;
  /** Frame-based light-up: word k lights over [lit0 + k·stagger, … + len]. */
  frame: number;
  lit0: number;
  stagger?: number;
  len?: number;
  out?: number;
  size: number;
  type?: React.CSSProperties;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ text, tone, enter, frame, lit0, stagger = 3, len = 10, out = 0, size, type, align = "center", style }) => {
  const pal = TONES[tone];
  const dim = tone === "dark" ? "rgba(245, 245, 247, 0.2)" : "rgba(29, 29, 31, 0.18)";
  const list = units(text);
  let k = 0;
  return (
    <div style={{ fontSize: size, textAlign: align, textWrap: "balance", ...rise(enter, out, 0.3, 8), ...type, ...style } as React.CSSProperties}>
      {list.map((unit, i) => {
        if (unit.br) return <br key={i} />;
        const p = span(frame, lit0 + k * stagger, lit0 + k * stagger + len, Easing.out(Easing.quad));
        k += unit.ink ? 2 : 1;
        const next = list[i + 1];
        return (
          <React.Fragment key={i}>
            <span style={{ color: interpolateColors(p, [0, 1], [dim, unit.ink ? pal.accent : pal.fg]), whiteSpace: unit.ink ? "nowrap" : undefined }}>{unit.text}</span>
            {next && !next.br ? " " : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
