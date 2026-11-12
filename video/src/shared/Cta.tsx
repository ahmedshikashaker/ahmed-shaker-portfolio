import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
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
          <div style={{ marginTop: 30 }}>
            <Headline start={12} center size={portrait ? 112 : 124} lineHeight={1.0} text={title} />
          </div>
          <div
            style={{
              marginTop: 30,
              fontFamily: SANS,
              fontSize: portrait ? 34 : 36,
              color: C.fg2,
              maxWidth: portrait ? 860 : 1240,
              lineHeight: 1.3,
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
                  boxShadow: i === part - 1 ? `0 0 20px ${C.accent}` : "none",
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
              color: C.bg,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 32,
              boxShadow: "0 20px 60px -20px rgba(216,187,132,0.7)",
              ...rise(prog(f, 80, 20)),
            }}
          >
            Read the interactive article →
          </div>
          <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 26, color: C.fg2, letterSpacing: "0.04em", ...rise(prog(f, 92, 20)) }}>
            ahmed-shaker.com/blog
          </div>

          <div style={{ marginTop: portrait ? 70 : 56, display: "flex", alignItems: "center", gap: 20, ...rise(prog(f, 106, 20)) }}>
            <div style={{ width: 84, height: 84, borderRadius: 99, overflow: "hidden", border: `2px solid ${C.accent}` }}>
              <Img
                src={staticFile("ahmed-shaker-portrait.jpg")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 24%", filter: "grayscale(0.25)" }}
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: SERIF, fontSize: 36, color: C.fg }}>Ahmed Shaker</div>
              <div style={{ fontFamily: MONO, fontSize: 17, color: C.fg3, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>
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
