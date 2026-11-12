import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONO, SERIF } from "./theme";

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 progress between `start` and `start + dur`, eased. */
export const prog = (frame: number, start: number, dur = 20) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: EASE });

export const rise = (p: number, dist = 26): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dist}px)`,
});

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return { portrait, width, height, pad: portrait ? 80 : 110 };
};

/**
 * Scene clock: when a scene is stretched to fit its narration, its internal animations are
 * slowed by the same factor so reveals stay in step with the voice. 1 = original timing.
 */
export const SceneClock = React.createContext(1);
export const useSceneFrame = () => useCurrentFrame() / React.useContext(SceneClock);

export type Pt = { x: number; y: number };

export const cubic = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
};

export const pathD = (p0: Pt, p1: Pt, p2: Pt, p3: Pt) =>
  `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

/** Fades/zooms a scene in and out at its edges. */
export const SceneWrap: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const a = Math.min(prog(f, 0, 16), interpolate(f, [dur - 16, dur], [1, 0], clamp));
  return (
    <AbsoluteFill
      style={{
        opacity: a,
        transform: `scale(${0.985 + 0.015 * a})`,
        filter: a < 0.999 ? `blur(${(1 - a) * 8}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const card = (border: string = C.line2): React.CSSProperties => ({
  background: "linear-gradient(180deg, rgba(24, 33, 54, 0.94), rgba(15, 21, 37, 0.94))",
  border: `1.5px solid ${border}`,
  borderRadius: 22,
  boxShadow: "0 30px 80px -34px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
});

export const Eyebrow: React.FC<{ start: number; children: React.ReactNode; color?: string; center?: boolean }> = ({
  start,
  children,
  color = C.accent,
  center,
}) => {
  const f = useSceneFrame();
  const { portrait } = useLayout();
  const p = prog(f, start, 18);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        gap: 16,
        fontFamily: MONO,
        fontSize: portrait ? 22 : 21,
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color,
        ...rise(p, 14),
      }}
    >
      <span style={{ width: 46 * p, height: 2, background: color, display: "inline-block" }} />
      {children}
    </div>
  );
};

/**
 * Word-by-word serif headline. Wrap words in *asterisks* for the gold italic emphasis,
 * use \n for line breaks.
 */
export const Headline: React.FC<{
  text: string;
  start: number;
  size: number;
  stagger?: number;
  center?: boolean;
  lineHeight?: number;
}> = ({ text, start, size, stagger = 3, center, lineHeight = 1.06 }) => {
  const f = useSceneFrame();
  let idx = 0;
  let emph = false;
  return (
    <div
      style={{
        fontFamily: SERIF,
        fontSize: size,
        lineHeight,
        letterSpacing: "-0.025em",
        color: C.fg,
        textAlign: center ? "center" : "left",
      }}
    >
      {text.split("\n").map((line, li) => (
        <div key={li}>
          {line.split(" ").map((raw, wi) => {
            let w = raw;
            let thisEm = emph;
            if (w.startsWith("*")) {
              thisEm = true;
              emph = true;
              w = w.slice(1);
            }
            const close = w.indexOf("*");
            if (close >= 0) {
              w = w.slice(0, close) + w.slice(close + 1);
              emph = false;
            }
            const p = prog(f, start + idx * stagger, 22);
            idx += 1;
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  marginRight: "0.24em",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 0.38}em)`,
                  filter: p < 0.999 ? `blur(${(1 - p) * 8}px)` : undefined,
                  fontStyle: thisEm ? "italic" : "normal",
                  color: thisEm ? C.accent : C.fg,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Animated SVG stroke that draws itself from 0 → p. */
export const DrawPath: React.FC<{
  d: string;
  p: number;
  color: string;
  width?: number;
  opacity?: number;
}> = ({ d, p, color, width = 2.5, opacity = 1 }) => (
  <path
    d={d}
    pathLength={1}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeDasharray="1 1"
    strokeDashoffset={1 - p}
    strokeLinecap="round"
    opacity={opacity}
  />
);

/** Small glowing dots travelling along a bezier path (signal flow). */
export const Particles: React.FC<{
  pts: [Pt, Pt, Pt, Pt];
  frame: number;
  start: number;
  color: string;
  count?: number;
  period?: number;
  reverse?: boolean;
  r?: number;
}> = ({ pts, frame, start, color, count = 3, period = 48, reverse, r = 6 }) => {
  if (frame < start) return null;
  const fadeIn = prog(frame, start, 20);
  return (
    <>
      {Array.from({ length: count }).map((_, k) => {
        let t = (((frame - start) / period + k / count) % 1 + 1) % 1;
        if (reverse) t = 1 - t;
        const pt = cubic(pts[0], pts[1], pts[2], pts[3], t);
        const edge = Math.min(t, 1 - t) * 6;
        const o = Math.min(1, edge) * fadeIn;
        return (
          <g key={k} opacity={o}>
            <circle cx={pt.x} cy={pt.y} r={r * 2.6} fill={color} opacity={0.18} />
            <circle cx={pt.x} cy={pt.y} r={r} fill={color} />
          </g>
        );
      })}
    </>
  );
};

/** Persistent atmospheric background: drafting grid + slow-drifting gold/teal glows. */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const dx = Math.sin(f / 110) * 6;
  const dy = Math.cos(f / 140) * 5;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 50% at ${16 + dx}% ${10 + dy}%, rgba(216, 187, 132, 0.17), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(55% 55% at ${86 - dx}% ${92 - dy}%, rgba(125, 211, 191, 0.11), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(232, 224, 207, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 224, 207, 0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(75% 70% at 50% 45%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(75% 70% at 50% 45%, black 30%, transparent 100%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Brand chrome visible across the whole video: series label, site, and a progress rail. */
export const Chrome: React.FC<{ total: number; ticks: number[]; part: number; of: number }> = ({ total, ticks, part, of }) => {
  const f = useCurrentFrame();
  const { portrait, width, height, pad } = useLayout();
  const a = prog(f, 0, 20);
  const railW = width - pad * 2;
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: portrait ? 58 : 52,
          left: pad,
          right: pad,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: MONO,
          fontSize: portrait ? 19 : 18,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: C.accent }}>
          Governed Autonomy <span style={{ color: C.fg4 }}>· Part {part} of {of}</span>
        </span>
        <span style={{ color: C.fg3, letterSpacing: "0.08em", textTransform: "none" }}>ahmed-shaker.com</span>
      </div>
      <div style={{ position: "absolute", left: pad, bottom: portrait ? 56 : 44, width: railW, height: 3, background: C.line2, borderRadius: 3 }}>
        <div style={{ width: `${(f / total) * 100}%`, height: "100%", background: C.accent, borderRadius: 3 }} />
        {ticks.map((t) => (
          <span
            key={t}
            style={{
              position: "absolute",
              left: `${(t / total) * 100}%`,
              top: -4,
              width: 2,
              height: 11,
              background: f >= t ? C.accent : C.line3,
            }}
          />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, width, height: height * 0 }} />
    </AbsoluteFill>
  );
};
