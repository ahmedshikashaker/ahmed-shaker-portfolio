import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
import { DrawPath, Eyebrow, Headline, SceneWrap, card, clamp, prog, rise, useLayout, useSceneFrame } from "../primitives";

/* ------------------------------------------------------------------ 1. Hook */

export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, pad } = useLayout();
  const chips: [string, string, string, string][] = [
    ["HR", "Leave Assistant", "regex filter · chat logs", C.signal],
    ["Finance", "Invoice Copilot", "prompt rules · CSV exports", C.accent],
    ["IT Ops", "Service Agent", "no guardrail · no audit", C.blue],
  ];
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill style={{ padding: `0 ${pad}px`, justifyContent: "center" }}>
        <Eyebrow start={4}>A pattern every enterprise is repeating</Eyebrow>
        <div style={{ marginTop: 34 }}>
          <Headline start={12} size={portrait ? 106 : 120} text={"Every department is\nbuilding its *own* AI."} />
        </div>
        <div
          style={
            portrait
              ? { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18, marginTop: 58 }
              : { position: "absolute", right: pad, top: "50%", transform: "translateY(-38%)", display: "flex", flexDirection: "column", gap: 22, width: 560 }
          }
        >
          {chips.map(([dept, name, sub, color], i) => {
            const p = prog(f, 56 + i * 11, 18);
            return (
              <div
                key={dept}
                style={{
                  ...card(),
                  ...rise(p, 20),
                  borderRadius: 18,
                  padding: portrait ? "20px 28px" : "26px 32px",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <span style={{ width: 13, height: 13, borderRadius: 99, background: color, boxShadow: `0 0 22px ${color}` }} />
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.18em", textTransform: "uppercase", color: C.fg4 }}>
                    {dept}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: portrait ? 32 : 36, fontWeight: 500, color: C.fg, marginTop: 2 }}>{name}</div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: portrait ? 17 : 18,
                      color: sub.startsWith("no") ? C.danger : C.fg3,
                      marginTop: 6,
                      opacity: prog(f, 84 + i * 8, 16),
                    }}
                  >
                    {sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 46, fontFamily: SANS, fontSize: portrait ? 34 : 36, color: C.fg3, ...rise(prog(f, 98, 20)) }}>
          Each with its own prompts, guardrails and audit logs.
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 2. Governance silos */

const AGENTS = [
  { name: "HR Bot", guard: "regex filter", app: "HRMS" },
  { name: "Finance Copilot", guard: "prompt rules", app: "ERP" },
  { name: "IT Agent", guard: "no guardrail", app: "ITSM" },
  { name: "Sales Assistant", guard: "LLM judge", app: "CRM" },
  { name: "Ops Agent", guard: "allowlist", app: "Payments" },
];
const CROSS: [number, number][] = [
  [0, 1],
  [1, 3],
  [2, 0],
  [3, 4],
  [4, 1],
  [2, 4],
];

export const Silos: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const H = portrait ? 560 : 400;
  const colW = W / 5;
  const agentW = colW * (portrait ? 0.9 : 0.82);
  const agentH = portrait ? 118 : 104;
  const appH = portrait ? 76 : 70;
  const agentTop = 0;
  const appTop = H - appH;
  const cx = (i: number) => colW * (i + 0.5);
  const link = (a: number, b: number) => {
    const x1 = cx(a);
    const y1 = agentTop + agentH;
    const x2 = cx(b);
    const y2 = appTop;
    const mid = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
  };
  const chaos = prog(f, 150, 30);

  const counters: [number, string, string][] = [
    [5, "prompt-filtering schemes", C.fg],
    [5, "incompatible audit formats", C.fg],
    [0, "unified kill switches", C.danger],
  ];

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill style={{ padding: `${portrait ? 150 : 132}px ${pad}px 0` }}>
        <Eyebrow start={2} color={C.danger}>
          Point-to-point governance silos
        </Eyebrow>
        <div style={{ marginTop: 24 }}>
          <Headline
            start={8}
            stagger={2}
            size={portrait ? 62 : 60}
            lineHeight={1.1}
            text={portrait ? "…and quietly rebuilds the\nworst integration anti-pattern\nof the *2000s.*" : "…and quietly rebuilds the worst\nintegration anti-pattern of the *2000s.*"}
          />
        </div>

        <div style={{ position: "relative", width: W, height: H, marginTop: portrait ? 56 : 44 }}>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {AGENTS.map((_, i) => (
              <DrawPath key={`own-${i}`} d={link(i, i)} p={prog(f, 74 + i * 4, 26)} color={C.line3} width={2.5} />
            ))}
            {CROSS.map(([a, b], j) => (
              <DrawPath key={`x-${j}`} d={link(a, b)} p={prog(f, 98 + j * 7, 30)} color={C.danger} width={2.2} opacity={0.6} />
            ))}
          </svg>
          {AGENTS.map((a, i) => {
            const p = prog(f, 36 + i * 6, 18);
            const flicker = chaos * (0.5 + 0.5 * Math.sin(f / 4 + i * 1.7));
            return (
              <div
                key={a.name}
                style={{
                  ...card(`rgba(240, 144, 127, ${0.18 + flicker * 0.5})`),
                  ...rise(p, 18),
                  position: "absolute",
                  left: cx(i) - agentW / 2,
                  top: agentTop,
                  width: agentW,
                  height: agentH,
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 10px",
                }}
              >
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 23 : 25, color: C.fg, lineHeight: 1.1 }}>{a.name}</div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: MONO,
                    fontSize: portrait ? 15 : 16,
                    color: a.guard === "no guardrail" ? C.danger : C.fg4,
                    letterSpacing: "0.04em",
                  }}
                >
                  {a.guard}
                </div>
              </div>
            );
          })}
          {AGENTS.map((a, i) => {
            const p = prog(f, 50 + i * 6, 18);
            return (
              <div
                key={a.app}
                style={{
                  ...rise(p, 18),
                  position: "absolute",
                  left: cx(i) - agentW / 2,
                  top: appTop,
                  width: agentW,
                  height: appH,
                  borderRadius: 14,
                  border: `1.5px solid ${C.line3}`,
                  background: "rgba(12, 17, 27, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontSize: portrait ? 19 : 21,
                  letterSpacing: "0.08em",
                  color: C.fg2,
                }}
              >
                {a.app}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: portrait ? 18 : 28, marginTop: portrait ? 64 : 48 }}>
          {counters.map(([n, label, color], i) => {
            const p = prog(f, 165 + i * 14, 20);
            return (
              <div
                key={label}
                style={{
                  flex: 1,
                  ...rise(p, 18),
                  borderTop: `2px solid ${i === 2 ? C.danger : C.line3}`,
                  paddingTop: 16,
                }}
              >
                <div style={{ fontFamily: SERIF, fontSize: portrait ? 96 : 92, lineHeight: 1, color }}>
                  {Math.round(n * p)}
                </div>
                <div style={{ fontFamily: SANS, fontSize: portrait ? 24 : 25, color: C.fg3, marginTop: 8, lineHeight: 1.25 }}>{label}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 3. Thesis */

export const Thesis: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, pad } = useLayout();
  const rule = prog(f, 62, 26);
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill style={{ padding: `0 ${pad}px`, justifyContent: "center" }}>
        <Eyebrow start={2}>{portrait ? "Principle · Application independence" : "Architectural principle · Application independence"}</Eyebrow>
        <div style={{ marginTop: 34 }}>
          <Headline
            start={10}
            size={portrait ? 100 : 110}
            text={portrait ? "Governance should\nnever live inside\nthe *application.*" : "Governance should never\nlive inside the *application.*"}
          />
        </div>
        <div style={{ height: 2, width: `${rule * (portrait ? 60 : 38)}%`, background: C.accent, marginTop: 52 }} />
        <div
          style={{
            marginTop: 40,
            fontFamily: SANS,
            fontSize: portrait ? 42 : 44,
            lineHeight: 1.3,
            color: C.fg2,
            maxWidth: portrait ? 900 : 1300,
            ...rise(prog(f, 74, 22)),
          }}
        >
          Business capabilities become <span style={{ color: C.accent, fontWeight: 500 }}>governed data contracts</span>—not
          source-code branches inside every AI runtime.
        </div>
        <div
          style={{
            marginTop: 34,
            fontFamily: MONO,
            fontSize: portrait ? 21 : 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.fg4,
            opacity: interpolate(f, [104, 122], [0, 1], clamp),
          }}
        >
          Onboard by configuration · certify once · reuse everywhere
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
