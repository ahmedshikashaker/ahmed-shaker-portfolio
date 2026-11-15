import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { STACK, STACK_TITLE } from "./content";
import { DRIFT, EASE, Stage, Statement, lerp, rise, span, useFrameInfo } from "./kit";
import { TONES, TYPE } from "./theme";

/**
 * 5 · Architecture (dark). ARCHITECTURE_STACK as four plates of flat dark glass in true 3D: they arrive pressed
 * together, then separate, each naming its layer, from the fast edge at the top to the steady core at the bottom.
 * The core plate, the beat's accent ("steady core."), is the one outlined in the accent colour.
 */

/** The highlighted plate: the regulated core. */
const CORE = STACK.length - 1;

const geo = (portrait: boolean, W: number) =>
  portrait
    ? { cx: 318, cy: 836, S: 300, title: { x: 0, y: 104, w: W, size: 104, align: "center" as const }, name: 38, tags: 22, labelW: 372, wrap: true, gap: 172 }
    : { cx: 1020, cy: 560, S: 380, title: { x: 128, y: 0, w: 700, size: 112, align: "left" as const }, name: 40, tags: 22, labelW: 560, wrap: false, gap: 150 };

const TILT = 56;

export const Stack: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { W, portrait } = useFrameInfo();
  const g = geo(portrait, W);
  const pal = TONES.dark;

  const arrive = span(f, 16, 58);
  const open = span(f, 50, 112, EASE);
  const gap = lerp(16, g.gap, open);
  const spin = lerp(-46, -36, span(f, 0, dur, DRIFT));
  const R = g.S * 0.09;

  return (
    <Stage tone="dark" dur={dur} push={0.03} origin={`${(g.cx / W) * 100}% 50%`}>
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: `${g.cx}px ${g.cy}px` }}>
        <div
          style={{
            position: "absolute",
            left: g.cx,
            top: g.cy,
            width: 0,
            height: 0,
            transformStyle: "preserve-3d",
            transform: `translateY(${(1 - arrive) * 220}px) rotateX(${TILT}deg) rotateZ(${spin}deg)`,
          }}
        >
          {STACK.map((layer, i) => {
            const z = (1.5 - i) * gap;
            const plateIn = span(f, 16 + (3 - i) * 5, 40 + (3 - i) * 5);
            const labelIn = span(f, 74 + i * 8, 100 + i * 8);
            return (
              <div
                key={layer.short}
                style={{
                  position: "absolute",
                  left: -g.S / 2,
                  top: -g.S / 2,
                  width: g.S,
                  height: g.S,
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${z}px)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: R,
                    opacity: plateIn,
                    background: "rgba(29, 29, 31, 0.9)",
                    border: `1.5px solid ${i === CORE ? pal.accent : "rgba(255, 255, 255, 0.22)"}`,
                  }}
                />
                {/* the layer's name, turned back to face the camera, standing off the plate's right corner */}
                <div
                  style={{
                    position: "absolute",
                    left: g.S,
                    top: g.S,
                    transformOrigin: "0 0",
                    transform: `rotateZ(${-spin}deg) rotateX(${-TILT}deg) translate(${g.S * 0.07}px, -50%)`,
                    width: g.labelW,
                  }}
                >
                  <div style={{ ...rise(labelIn, 0, 0.4, 4) }}>
                    <div style={{ ...TYPE.h3, fontSize: g.name, color: pal.fg, whiteSpace: "nowrap" }}>{layer.short}</div>
                    <div style={{ ...TYPE.text, fontSize: g.tags, color: pal.fg3, marginTop: 6, lineHeight: 1.3, whiteSpace: g.wrap ? "normal" : "nowrap" }}>
                      {layer.tags.join(" · ")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: portrait ? "flex-start" : "center" }}>
        <div style={{ position: "relative", marginLeft: g.title.x, marginTop: g.title.y, width: g.title.w }}>
          <Statement
            text={STACK_TITLE.replace(" *", "\n*")}
            tone="dark"
            start={14}
            stagger={6}
            len={30}
            size={g.title.size}
            type={TYPE.display}
            align={g.title.align}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
