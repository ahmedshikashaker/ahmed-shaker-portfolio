import React from "react";
import { useCurrentFrame } from "remotion";
import { PROOF } from "./content";
import { EASE, Stage, rise, span, useFrameInfo } from "./kit";
import { TONES, TYPE } from "./theme";

/**
 * 6 · Proof (light). PROOF_METRICS as four flat tiles, like the site's proof grid: a huge solid numeral that
 * counts to its value (the lock-in counts down to zero, as on the site) over its label.
 */

const geo = (portrait: boolean, W: number, H: number) => {
  if (portrait) {
    const gap = 24;
    const w = (W - 2 * 64 - gap) / 2;
    const h = 500;
    const top = (H - 2 * h - gap) / 2;
    return { tiles: [0, 1, 2, 3].map((i) => ({ x: 64 + (i % 2) * (w + gap), y: top + Math.floor(i / 2) * (h + gap), w, h })), num: 200, label: 34, pad: 44 };
  }
  const gap = 24;
  const w = (W - 2 * 104 - 3 * gap) / 4;
  const h = 500;
  const top = (H - h) / 2;
  return { tiles: [0, 1, 2, 3].map((i) => ({ x: 104 + i * (w + gap), y: top, w, h })), num: 180, label: 32, pad: 44 };
};

/** "16+" → counts 0 → 16 and then shows "+"; "0" counts down from 9. */
const Figure: React.FC<{ value: string; p: number }> = ({ value, p }) => {
  const m = value.match(/^(\d+)(\+?)$/);
  const to = m ? Number(m[1]) : 0;
  const from = to === 0 ? 9 : 0;
  const shown = Math.round(from + (to - from) * p);
  return (
    <>
      {m ? shown : value}
      {m?.[2] ?? ""}
    </>
  );
};

export const Proof: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { W, H, portrait } = useFrameInfo();
  const g = geo(portrait, W, H);
  const pal = TONES.light;
  const out = span(f, dur - 32, dur - 14);

  return (
    <Stage tone="light" dur={dur} push={0.03}>
      {PROOF.map((metric, i) => {
        const t = g.tiles[i];
        const t0 = 16 + i * 7;
        const p = span(f, t0, t0 + 34);
        const count = span(f, t0 + 4, t0 + 52, EASE);
        return (
          <div
            key={metric.value}
            style={{
              position: "absolute",
              left: t.x,
              top: t.y,
              width: t.w,
              height: t.h,
              borderRadius: 32,
              background: pal.card,
              padding: g.pad,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              opacity: p * (1 - out),
              transform: `translateY(${(1 - p) * 60 - out * 30}px)`,
            }}
          >
            <div style={{ ...TYPE.num, fontSize: g.num, color: pal.fg, marginLeft: "-0.04em" }}>
              <Figure value={metric.value} p={count} />
            </div>
            <div style={{ ...TYPE.kicker, fontSize: g.label, lineHeight: 1.22, color: pal.fg, marginTop: "auto", ...rise(span(f, t0 + 14, t0 + 42), 0, 0.4, 4) }}>
              {metric.label}
            </div>
          </div>
        );
      })}
    </Stage>
  );
};
