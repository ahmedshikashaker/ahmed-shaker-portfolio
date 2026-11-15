import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FACTORIES, Factory, linesCaption } from "./content";
import { EASE, Stage, rise, span, useFrameInfo } from "./kit";
import { AppTile, PHONE, PhoneAt, PhoneShadow, SplashScreen } from "./Phone3D";
import { TONES, TYPE } from "./theme";

/**
 * 3 · Two factories (light). Factory I (Warba Bank · Al-Wateen) and Factory II (KIB) side by side, like a
 * compare-models page: each phone turns round to its flagship app, and the row of line icons under it
 * shows the factory growing from three product lines to eight.
 */

type Col = {
  /** Phone centre and width; `face` is the resting turn (towards the other column). */
  cx: number;
  cy: number;
  w: number;
  face: number;
  /** Text block: left edge or centre, top, width, alignment. */
  tx: number;
  ty: number;
  tw: number;
  align: "left" | "center";
};

const geo = (portrait: boolean, W: number) =>
  portrait
    ? {
        cols: [
          { cx: 258, cy: 352, w: 236, face: -14, tx: 452, ty: 200, tw: 568, align: "left" },
          { cx: 258, cy: 1000, w: 236, face: -14, tx: 452, ty: 848, tw: 568, align: "left" },
        ] as Col[],
        kicker: 34,
        title: 70,
        sub: 32,
        period: 28,
        icon: 54,
        gap: 10,
        caption: 28,
      }
    : {
        cols: [
          { cx: W / 2 - 430, cy: 306, w: 240, face: -12, tx: W / 2 - 430, ty: 596, tw: 780, align: "center" },
          { cx: W / 2 + 430, cy: 306, w: 240, face: 12, tx: W / 2 + 430, ty: 596, tw: 780, align: "center" },
        ] as Col[],
        kicker: 34,
        title: 76,
        sub: 32,
        period: 28,
        icon: 66,
        gap: 14,
        caption: 28,
      };

/** Scene-local start of each factory's entrance. */
const START = [14, 50];

const Column: React.FC<{ factory: Factory; col: Col; t0: number; g: ReturnType<typeof geo> }> = ({ factory, col, t0, g }) => {
  const f = useCurrentFrame();
  const pal = TONES.light;
  const up = span(f, t0, t0 + 44);
  const turn = span(f, t0 + 2, t0 + 62, EASE);
  const ry = col.face + 180 * (1 - turn);
  const h = col.w * PHONE.height;
  const text = (k: number) => rise(span(f, t0 + 16 + k * 5, t0 + 44 + k * 5), 0, 0.45, 5);
  const box: React.CSSProperties =
    col.align === "center"
      ? { position: "absolute", left: col.tx - col.tw / 2, width: col.tw, top: col.ty, textAlign: "center" }
      : { position: "absolute", left: col.tx, width: col.tw, top: col.ty, textAlign: "left" };
  const iconsAt = t0 + 38;
  return (
    <>
      <PhoneShadow x={col.cx} y={col.cy + h / 2 + col.w * 0.05} w={col.w} ry={ry} opacity={span(f, t0 + 22, t0 + 52) * 0.55} />
      <PhoneAt
        cx={col.cx}
        cy={col.cy}
        w={col.w}
        ry={ry}
        finish={factory.numeral === "I" ? "silver" : "midnight"}
        lift={{ y: (1 - up) * 360 }}
        layer={{ opacity: span(f, t0, t0 + 18) }}
        screen={<SplashScreen icon={factory.app.icon} name={factory.app.name} />}
      />
      <div style={box}>
        <div style={{ ...TYPE.kicker, fontSize: g.kicker, color: pal.fg3, ...text(0) }}>Factory {factory.numeral}</div>
        <div style={{ ...TYPE.h1, fontSize: g.title, color: pal.fg, marginTop: 6, ...text(1) }}>{factory.bank}</div>
        <div style={{ ...TYPE.lede, fontSize: g.sub, color: pal.fg, marginTop: 12, ...text(2) }}>{factory.factoryName}</div>
        <div style={{ ...TYPE.text, fontSize: g.period, color: pal.fg3, marginTop: 4, ...text(3) }}>{factory.period}</div>
        <div
          style={{
            display: "flex",
            gap: g.gap,
            justifyContent: col.align === "center" ? "center" : "flex-start",
            marginTop: 28,
          }}
        >
          {factory.lines.map((line, i) => {
            const p = span(f, iconsAt + i * 4, iconsAt + i * 4 + 18);
            return (
              <AppTile
                key={line.label}
                icon={line.icon}
                size={g.icon}
                style={{ opacity: p, transform: `translateY(${(1 - p) * 18}px) scale(${0.82 + 0.18 * p})` }}
              />
            );
          })}
        </div>
        <div style={{ ...TYPE.text, fontWeight: 500, fontSize: g.caption, color: pal.fg3, marginTop: 14, ...text(5 + factory.lines.length * 0.8) }}>
          {linesCaption(factory.lines.length)}
        </div>
      </div>
    </>
  );
};

export const Factories: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { W, portrait } = useFrameInfo();
  const g = geo(portrait, W);
  // Clears the frame just before the next beat crossfades in, so the two never sit on top of each other.
  const out = span(f, dur - 32, dur - 14);
  return (
    <Stage tone="light" dur={dur} push={0.03}>
      <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
        {FACTORIES.map((factory, i) => (
          <Column key={factory.numeral} factory={factory} col={g.cols[i]} t0={START[i]} g={g} />
        ))}
      </AbsoluteFill>
    </Stage>
  );
};
