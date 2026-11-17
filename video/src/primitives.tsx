import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS, SERIF } from "./theme";

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
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

export const card = (border: string = C.line): React.CSSProperties => ({
  background: C.surface,
  border: `1.5px solid ${border}`,
  borderRadius: 24,
  boxShadow: "none",
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
        fontFamily: SANS,
        fontSize: portrait ? 24 : 23,
        fontWeight: 600,
        letterSpacing: "-0.014em",
        color,
        ...rise(p, 14),
      }}
    >
      {children}
    </div>
  );
};

/**
 * Word-by-word display headline (Inter Tight 700). Wrap words in *asterisks* for the solid
 * Apple-blue accent emphasis (no italics), use \n for line breaks.
 */
export const Headline: React.FC<{
  text: string;
  start: number;
  size: number;
  stagger?: number;
  center?: boolean;
  lineHeight?: number;
}> = ({ text, start, size, stagger = 3, center, lineHeight = 1.04 }) => {
  const f = useSceneFrame();
  let idx = 0;
  let emph = false;
  return (
    <div
      style={{
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: size,
        lineHeight,
        letterSpacing: "-0.038em",
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
                  filter: p < 0.999 ? `blur(${(1 - p) * 6}px)` : undefined,
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

/** Small dots travelling along a bezier path (signal flow). */
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
            <circle cx={pt.x} cy={pt.y} r={r * 2.2} fill={color} opacity={0.14} />
            <circle cx={pt.x} cy={pt.y} r={r} fill={color} />
          </g>
        );
      })}
    </>
  );
};

/** Flat white canvas matching the website's Apple launch aesthetic (no grids, glows, or grain). */
export const Background: React.FC = () => <AbsoluteFill style={{ background: C.bg }} />;

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
          fontFamily: SANS,
          fontSize: portrait ? 20 : 19,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        <span style={{ color: C.fg }}>
          Governed Autonomy <span style={{ color: C.fg4, fontWeight: 500 }}>· Part {part} of {of}</span>
        </span>
        <span style={{ color: C.fg3, fontWeight: 500 }}>ahmed-shaker.com</span>
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
