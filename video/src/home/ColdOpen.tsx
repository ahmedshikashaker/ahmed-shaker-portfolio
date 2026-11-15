import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { APPS, HEADLINE, NAME } from "./content";
import { DRIFT, EASE, MOVE, Stage, Statement, lerp, rise, span, useFrameInfo } from "./kit";
import { Finish, ListingScreen, Phone3D, SplashScreen } from "./Phone3D";
import { TONES, TYPE } from "./theme";

/**
 * 1 · Cold open (light). The site's hero, as a film: the name, "Digital Factory architect." ("Digital Factory" in
 * the accent colour), and the lineup
 * (src/components/launch/Hero.tsx) rising into frame with its backs turned, then turning round: KIB Mobile to
 * its store page, the four phones behind it to their apps. Positions are in phone widths, as on the site.
 */
const LINEUP: { app: keyof typeof APPS; slot: number; finish: Finish; x: number; y: number; z: number; turn: number }[] = [
  { app: "kibInvest", slot: -2, finish: "blue", x: -1.8, y: 0.17, z: -0.66, turn: 40 },
  { app: "kibCorporate", slot: -1, finish: "silver", x: -1.0, y: 0.06, z: -0.24, turn: 26 },
  { app: "kibAqari", slot: 1, finish: "natural", x: 1.0, y: 0.06, z: -0.24, turn: -26 },
  { app: "kibBuyNow", slot: 2, finish: "midnight", x: 1.8, y: 0.17, z: -0.66, turn: -40 },
  // Drawn last: nearest the camera.
  { app: "kibMobile", slot: 0, finish: "midnight", x: 0, y: 0, z: 0.16, turn: 0 },
];

const geo = (portrait: boolean) =>
  portrait
    ? { lw: 318, kicker: 40, size: 120, textTop: 120, settle: 300, lineupTop: 552 }
    : { lw: 286, kicker: 40, size: 150, textTop: 84, settle: 250, lineupTop: 486 };

/** Frames (scene-local). */
const RISE = 60; // the lineup starts rising
const GLIDE = [44, 92] as const; // the title moves from the centre to the top

export const ColdOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { W, H, portrait } = useFrameInfo();
  const g = geo(portrait);
  const pal = TONES.light;
  const glide = span(f, GLIDE[0], GLIDE[1], MOVE);
  const textY = lerp(g.settle, 0, glide);

  // The lineup leans back a touch and the camera pans slowly across it while it holds.
  const hold = span(f, 116, dur, DRIFT);
  const pan = lerp(-2.5, 2.5, hold);
  const tilt = lerp(0, 4, hold);

  const originY = g.lineupTop + 0.15 * 1.62 * g.lw;
  // Far enough down that no phone shows before it starts to rise (the site's 118%, or the frame's bottom edge).
  const below = Math.max(1.18 * 2.06 * g.lw, H - g.lineupTop + 0.6 * g.lw);

  return (
    <Stage tone="light" dur={dur} push={0.045} origin={`50% ${portrait ? 46 : 44}%`}>
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: `${W / 2}px ${originY}px` }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: g.lineupTop,
            width: W,
            height: 0,
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt}deg) rotateY(${pan}deg)`,
          }}
        >
          {/* Phones show the inner three, as the site's lineup does on narrow screens. */}
          {(portrait ? LINEUP.filter((entry) => Math.abs(entry.slot) < 2) : LINEUP).map((entry) => {
            const app = APPS[entry.app];
            const front = entry.slot === 0;
            const side = Math.abs(entry.slot);
            const t0 = RISE + side * 4;
            const up = span(f, t0, t0 + 42);
            const slotTurn = (front ? 180 : entry.slot < 0 ? 70 : -70) * (1 - span(f, t0 + 2, t0 + 2 + (front ? 66 : 54)));
            // Backs first; each side phone turns round over its own stretch, inner ones first.
            const back = front ? 0 : 1 - span(f, 112 + (side - 1) * 14, 158 + (side - 1) * 14, EASE);
            const turn = entry.turn + (entry.slot < 0 ? -180 : 180) * back;
            // As they turn round, the side phones open out a little (the site's scroll spread), so each app shows.
            const spread = entry.slot * 0.16 * g.lw * span(f, 112, 180, EASE);
            return (
              <div
                key={entry.app}
                style={{
                  position: "absolute",
                  left: W / 2 - g.lw / 2,
                  top: 0,
                  transformStyle: "preserve-3d",
                  transform: `translate3d(${entry.x * g.lw + spread}px, ${entry.y * g.lw}px, ${entry.z * g.lw}px)`,
                }}
              >
                <div style={{ transformStyle: "preserve-3d", transform: `translateY(${(1 - up) * below}px) rotateY(${slotTurn}deg)` }}>
                  <Phone3D
                    w={g.lw}
                    finish={entry.finish}
                    ry={turn}
                    screen={
                      front ? (
                        <ListingScreen icon={app.icon} name={app.name} maker={APPS.kibMobile.maker} shots={[...APPS.kibMobile.shots]} />
                      ) : (
                        <SplashScreen icon={app.icon} name={app.name} />
                      )
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: g.textTop, transform: `translateY(${textY}px)`, textAlign: "center" }}>
        <div style={{ ...TYPE.kicker, fontSize: g.kicker, color: pal.fg3, ...rise(span(f, 6, 34), 0, 0.5, 4) }}>{NAME}</div>
        <Statement
          text={HEADLINE.join("\n")}
          tone="light"
          start={12}
          stagger={7}
          len={30}
          size={g.size}
          type={TYPE.display}
          align="center"
          style={{ marginTop: portrait ? 14 : 18 }}
        />
      </div>
    </Stage>
  );
};
