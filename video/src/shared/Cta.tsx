import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, SANS, SERIF } from "../theme";
import { Eyebrow, Headline, SceneWrap, prog, rise, useLayout, useSceneFrame } from "../primitives";

/** Closing call-to-action, shared by every part of the series. */
export const makeCta = (part: number, title: string, subtitle: string) => {
  const Cta: React.FC<{ dur: number }> = ({ dur }) => {
    const f = useSceneFrame();
    const { portrait, pad } = useLayout();
    return (
      <SceneWrap dur={dur}>
        <AbsoluteFill style={{ padding: `0 ${pad}px`, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <Eyebrow start={4} center>
            The full interactive essay
          </Eyebrow>
          <div style={{ marginTop: 26 }}>
            <Headline start={12} center size={portrait ? 112 : 124} lineHeight={1.0} text={title} />
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: SANS,
              fontSize: portrait ? 34 : 36,
              color: C.fg3,
              maxWidth: portrait ? 860 : 1240,
              lineHeight: 1.35,
              letterSpacing: "-0.012em",
              ...rise(prog(f, 50, 20)),
            }}
          >
            {subtitle}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 40, ...rise(prog(f, 66, 18)) }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === part - 1 ? 44 : 14,
                  height: 14,
                  borderRadius: 99,
                  background: i < part ? C.accent : C.line3,
                }}
              />
            ))}
          </div>

          <div
            style={{
              marginTop: 46,
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: portrait ? "22px 38px" : "22px 42px",
              borderRadius: 999,
              background: C.accent,
              color: "#ffffff",
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 32,
              letterSpacing: "-0.01em",
              ...rise(prog(f, 80, 20)),
            }}
          >
            Read the interactive article →
          </div>
          <div style={{ marginTop: 22, fontFamily: SANS, fontWeight: 500, fontSize: 25, color: C.fg3, letterSpacing: "-0.01em", ...rise(prog(f, 92, 20)) }}>
            ahmed-shaker.com/blog
          </div>

          <div style={{ marginTop: portrait ? 70 : 56, display: "flex", alignItems: "center", gap: 20, ...rise(prog(f, 106, 20)) }}>
            <div style={{ width: 84, height: 84, borderRadius: 99, overflow: "hidden", border: `1.5px solid ${C.line2}` }}>
              <Img
                src={staticFile("ahmed-shaker-portrait.jpg")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 24%" }}
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, letterSpacing: "-0.025em", color: C.fg }}>Ahmed Shaker</div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 19, color: C.fg3, marginTop: 4 }}>
                Enterprise Technology Leader
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  };
  return Cta;
};
