import React from "react";
import { useCurrentFrame } from "remotion";
import { EIGHT, FACTORIES, segments, splitLine } from "./content";
import { Accent, DRIFT, EASE, MOVE, Stage, lerp, rise, span, useFrameInfo } from "./kit";
import { AppTile, HomeScreen, PHONE, PhoneAt, PhoneShadow, homeIcon } from "./Phone3D";
import { TONES, TYPE } from "./theme";

/**
 * 4 · One factory, eight lines (mist). A phone turns from its back to its home screen: one icon per KIB product
 * line. The icons lift off the glass and fly out to a ring around the phone, each landing with its line's
 * name; the phone is left showing the factory they came from. "Eight product lines. One factory."
 */

const KIB = FACTORIES[1];
/** "Eight product lines." and the accent phrase, "One factory." */
const [FIRST, INKED] = segments(EIGHT).map((seg) => seg.text.trim());

/**
 * Ring slots (angles, screen coordinates with y down) for the home-screen icons in grid order: the left column
 * goes left, the right column right, so no flight path crosses another.
 */
const geo = (portrait: boolean, W: number) =>
  portrait
    ? {
        cx: W / 2,
        cy: 790,
        w: 256,
        rx: 392,
        ry: 410,
        angles: [-160, -120, -60, -20, 160, 120, 60, 20],
        icon: 96,
        cat: 27,
        prod: 23,
        size: 86,
        titleTop: 92,
        oneLine: false,
      }
    : {
        cx: W / 2,
        cy: 604,
        w: 262,
        rx: 568,
        ry: 300,
        angles: [-157.5, -112.5, -67.5, -22.5, 157.5, 112.5, 67.5, 22.5],
        icon: 106,
        cat: 28,
        prod: 24,
        size: 84,
        titleTop: 66,
        oneLine: true,
      };

/** Scene-local frames. */
const PHONE_IN = 16;
const TURN = [26, 92] as const;
const LIFT0 = 100; // first icon leaves the glass
const LIFT_STEP = 5;
const FLIGHT = 36;
const SECOND = LIFT0 + 7 * LIFT_STEP + FLIGHT - 10; // "One factory." arrives as the last icon lands

export const EightLines: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { W, portrait } = useFrameInfo();
  const g = geo(portrait, W);
  const pal = TONES.mist;
  const h = g.w * PHONE.height;

  const up = span(f, PHONE_IN, PHONE_IN + 46);
  const turn = span(f, TURN[0], TURN[1], EASE);
  // After the icons have gone, the phone settles into a slow three-quarter turn.
  const settle = span(f, SECOND, dur, DRIFT);
  const ry = 180 * (1 - turn) - 10 * settle;
  const rx = 10 * (1 - turn);

  // Front glass sits half a phone depth towards the camera: what it shows is scaled by the perspective.
  const P = 1700;
  const s = P / (P - (g.w * PHONE.depth) / 2);
  const onGlass = (i: number) => {
    const ic = homeIcon(i);
    const size = ic.size * g.w * s;
    return { x: g.cx + (ic.x * g.w - g.w / 2) * s + size / 2, y: g.cy + (ic.y * g.w - h / 2) * s + size / 2, size };
  };

  const lift = KIB.lines.map((_, i) => span(f, LIFT0 + i * LIFT_STEP, LIFT0 + i * LIFT_STEP + FLIGHT, MOVE));
  const titleIn = span(f, SECOND - 6, SECOND + 22);

  const statement = (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: g.titleTop,
        textAlign: "center",
        ...TYPE.h1,
        fontSize: g.size,
        color: pal.fg,
        wordSpacing: "0.04em",
      }}
    >
      <span style={{ display: "inline-block", ...rise(span(f, 22, 52)) }}>{FIRST}</span>
      {g.oneLine ? (
        // On one line, the second phrase opens up beside the first, pushing it left into the centred line.
        <span
          style={{
            display: "inline-block",
            verticalAlign: "bottom",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: `${span(f, SECOND, SECOND + 34) * 6}em`,
            padding: "0.12em 0 0.18em",
            margin: "-0.12em 0 -0.18em",
          }}
        >
          <span style={{ display: "inline-block", paddingLeft: "0.26em", ...rise(span(f, SECOND + 6, SECOND + 36), 0, 0.3, 6) }}>
            <Accent tone="mist">{INKED}</Accent>
          </span>
        </span>
      ) : (
        <>
          <br />
          <span style={{ display: "inline-block", ...rise(span(f, SECOND, SECOND + 30)) }}>
            <Accent tone="mist">{INKED}</Accent>
          </span>
        </>
      )}
    </div>
  );

  return (
    <Stage tone="mist" dur={dur} push={0.04} origin={`50% ${(g.cy / (portrait ? 1350 : 1080)) * 100}%`}>
      {statement}

      <PhoneShadow x={g.cx} y={g.cy + h / 2 + g.w * 0.06} w={g.w} ry={ry} opacity={span(f, PHONE_IN + 24, PHONE_IN + 56) * 0.5} />
      <PhoneAt
        cx={g.cx}
        cy={g.cy}
        w={g.w}
        rx={rx}
        ry={ry}
        finish="blue"
        perspective={P}
        lift={{ y: (1 - up) * 520 }}
        layer={{ opacity: span(f, PHONE_IN, PHONE_IN + 18) }}
        screen={<HomeScreen lines={KIB.lines} lift={lift} title={KIB.factoryName} titleIn={titleIn} />}
      />

      {KIB.lines.map((line, i) => {
        const t = lift[i];
        if (t <= 0) return null;
        const from = onGlass(i);
        const a = (g.angles[i] * Math.PI) / 180;
        const to = { x: g.cx + g.rx * Math.cos(a), y: g.cy + g.ry * Math.sin(a), size: g.icon };
        // A gentle outward arc, a little lift in scale mid-flight, and a shadow that grows with the height.
        const bulge = Math.sin(Math.PI * t);
        const nx = Math.cos(a);
        const x = lerp(from.x, to.x, t) - nx * 30 * bulge;
        const y = lerp(from.y, to.y, t) - 46 * bulge;
        const size = lerp(from.size, to.size, t) * (1 + 0.14 * bulge);
        const landed = span(f, LIFT0 + i * LIFT_STEP + FLIGHT - 8, LIFT0 + i * LIFT_STEP + FLIGHT + 14);
        const float = Math.sin((f - LIFT0) / 26 + i * 0.8) * 4 * landed;
        const [cat, prod] = splitLine(line.label);
        return (
          <div key={line.label} style={{ position: "absolute", left: x, top: y + float, width: 0, height: 0 }}>
            <AppTile
              icon={line.icon}
              size={size}
              style={{
                position: "absolute",
                left: -size / 2,
                top: -size / 2,
                boxShadow: `0 ${8 + 22 * bulge}px ${18 + 36 * bulge}px -${6 + 6 * bulge}px rgba(0,0,0,${0.22 + 0.12 * bulge}), 0 0 0 0.5px rgba(0,0,0,0.1)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: g.icon / 2 + 16,
                left: -170,
                width: 340,
                textAlign: "center",
                ...rise(landed, 0, 0.35, 4),
              }}
            >
              <div style={{ ...TYPE.kicker, fontSize: g.cat, color: pal.fg }}>{cat}</div>
              {prod && <div style={{ ...TYPE.text, fontSize: g.prod, color: pal.fg3, marginTop: 2 }}>{prod}</div>}
            </div>
          </div>
        );
      })}
    </Stage>
  );
};
