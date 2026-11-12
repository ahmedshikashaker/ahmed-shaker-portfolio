import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
import { DrawPath, Eyebrow, Headline, Particles, Pt, SceneWrap, card, clamp, prog, rise, useLayout, useSceneFrame } from "../primitives";

/* ------------------------------------------------------------------ 6. Drift containment */

export const Drift: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const event = prog(f, 40, 16);
  const pulse = 0.5 + 0.5 * Math.sin(f / 3);
  const stamp = spring({ frame: f - 156, fps, config: { damping: 11, stiffness: 160 } });
  const live = prog(f, 176, 18);

  const W = width - pad * 2;
  const cardW = portrait ? W : (W - 56) / 2;
  const cardH = portrait ? 262 : 268;
  const liveBox = portrait ? { x: pad, y: 560 } : { x: pad, y: 516 };
  const candBox = portrait ? { x: pad, y: 860 } : { x: pad + cardW + 56, y: 516 };

  const line = (txt: React.ReactNode, color: string = C.fg2, key?: string) => (
    <div key={key} style={{ fontFamily: MONO, fontSize: portrait ? 21 : 22, color, marginTop: 10, whiteSpace: "nowrap" }}>
      {txt}
    </div>
  );

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: pad, right: pad, top: portrait ? 150 : 132 }}>
          <Eyebrow start={2} color={C.danger}>
            Supply-chain drift · contained
          </Eyebrow>
          <div style={{ marginTop: 22 }}>
            <Headline start={8} size={portrait ? 74 : 68} lineHeight={1.08} text={"What happens when a tool\n*changes overnight?*"} />
          </div>
        </div>

        {/* Event ticker */}
        <div
          style={{
            position: "absolute",
            left: pad,
            top: portrait ? 448 : 412,
            ...rise(event, 12),
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 22px",
            borderRadius: 999,
            border: `1.5px solid rgba(240,144,127,${0.35 + 0.4 * pulse})`,
            background: "rgba(240, 144, 127, 0.08)",
            fontFamily: MONO,
            fontSize: portrait ? 20 : 22,
            color: C.fg2,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: 99, background: C.danger, boxShadow: `0 0 ${10 + 14 * pulse}px ${C.danger}` }} />
          <span style={{ color: C.fg4 }}>02:14</span>
          <span style={{ color: C.danger }}>MCP</span>
          notifications/tools/list_changed
        </div>

        {/* Live version */}
        <div
          style={{
            ...card(C.signal),
            ...rise(prog(f, 66, 20), 20),
            position: "absolute",
            left: liveBox.x,
            top: liveBox.y,
            width: cardW,
            height: cardH,
            padding: portrait ? "26px 30px" : "30px 34px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.18em", color: C.signal }}>LIVE VERSION</span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 16,
                letterSpacing: "0.12em",
                padding: "6px 12px",
                borderRadius: 999,
                background: `rgba(125, 211, 191, ${0.12 + 0.1 * live})`,
                color: C.signal,
              }}
            >
              {live > 0.5 ? "UNCHANGED · STILL SERVING" : "SERVING"}
            </span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: portrait ? 42 : 46, color: C.fg, marginTop: 12 }}>
            create_leave<span style={{ color: C.signal }}>@v5</span>
          </div>
          {line("params  start_date, end_date, type")}
          {line(
            <>
              hash    <span style={{ color: C.signal }}>sha256:9f3a…c41e</span>
              <span style={{ color: C.fg4 }}>  pinned</span>
            </>,
          )}
        </div>

        {/* Candidate (drifted) version */}
        <div
          style={{
            ...card(C.danger),
            ...rise(prog(f, 96, 20), 20),
            position: "absolute",
            left: candBox.x,
            top: candBox.y,
            width: cardW,
            height: cardH,
            padding: portrait ? "26px 30px" : "30px 34px",
            overflow: "hidden",
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.18em", color: C.danger }}>UPSTREAM CANDIDATE</div>
          <div style={{ fontFamily: SERIF, fontSize: portrait ? 42 : 46, color: C.fg, marginTop: 12 }}>
            create_leave<span style={{ color: C.danger }}>@draft-6</span>
          </div>
          {line("params  start_date, end_date, type")}
          <div style={{ opacity: prog(f, 118, 14) }}>
            {line(
              <>
                <span style={{ background: "rgba(240,144,127,0.16)", padding: "2px 6px", borderRadius: 6 }}>+ forward_to: string</span>
                <span style={{ color: C.fg4 }}>  ← new, undeclared</span>
              </>,
              C.danger,
            )}
          </div>
          <div style={{ opacity: prog(f, 134, 14) }}>
            {line(
              <>
                hash    <span style={{ color: C.danger, textDecoration: "line-through" }}>sha256:51be…07a9</span>
                <span style={{ color: C.danger }}>  ≠ mismatch</span>
              </>,
            )}
          </div>
          <div
            style={{
              position: "absolute",
              right: portrait ? 26 : 34,
              top: portrait ? 26 : 30,
              transform: `rotate(-7deg) scale(${interpolate(stamp, [0, 1], [1.8, 1])})`,
              opacity: interpolate(stamp, [0, 0.2], [0, 1], clamp),
              border: `3px solid ${C.danger}`,
              color: C.danger,
              borderRadius: 10,
              padding: "8px 16px",
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: portrait ? 22 : 24,
              letterSpacing: "0.14em",
              background: "rgba(10, 14, 23, 0.85)",
            }}
          >
            QUARANTINED · R4
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: portrait ? 1168 : 868,
            fontFamily: SANS,
            fontSize: portrait ? 32 : 34,
            color: C.fg2,
            textAlign: portrait ? "left" : "center",
            ...rise(prog(f, 206, 22)),
          }}
        >
          Upstream drift never reaches the model <span style={{ color: C.accent }}>without re-certification.</span>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 7. Hub: one control plane */

const NODES = ["HRMS", "ERP", "CRM", "ITSM", "Payments", "Knowledge"];

export const Hub: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const center: Pt = portrait ? { x: width / 2, y: 790 } : { x: 1390, y: 600 };
  const R = portrait ? 310 : 330;
  const coreR = portrait ? 138 : 150;
  const nodeW = portrait ? 172 : 184;
  const nodeH = portrait ? 66 : 70;
  const coreP = prog(f, 16, 24);

  const nodes = NODES.map((n, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return { n, x: center.x + R * Math.cos(a), y: center.y + R * Math.sin(a), a };
  });

  const bullets: [string, string][] = [
    ["One", "policy engine"],
    ["One", "audit trail"],
    ["One", "kill switch"],
  ];

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: pad,
            ...(portrait ? { right: pad, top: 150 } : { width: 760, top: 300 }),
          }}
        >
          <Eyebrow start={2}>One control plane</Eyebrow>
          <div style={{ marginTop: 22 }}>
            <Headline start={8} size={portrait ? 84 : 92} lineHeight={1.04} text={"Govern once.\n*Connect everything.*"} />
          </div>
          {!portrait && (
            <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 22 }}>
              {bullets.map(([a, b], i) => (
                <div key={b} style={{ ...rise(prog(f, 90 + i * 12, 18), 14), display: "flex", alignItems: "center", gap: 18 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: C.signal, boxShadow: `0 0 16px ${C.signal}` }} />
                  <span style={{ fontFamily: SANS, fontSize: 36, color: C.fg }}>
                    <span style={{ color: C.accent }}>{a}</span> {b}
                  </span>
                </div>
              ))}
              <div style={{ ...rise(prog(f, 132, 18), 14), fontFamily: MONO, fontSize: 20, color: C.fg4, letterSpacing: "0.1em", marginTop: 14 }}>
                N×M CUSTOM INTEGRATIONS → 1 CONTRACT MODEL
              </div>
            </div>
          )}
        </div>

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {nodes.map((nd, i) => {
            const p0: Pt = { x: center.x + coreR * Math.cos(nd.a), y: center.y + coreR * Math.sin(nd.a) };
            const p3: Pt = { x: nd.x - (nodeW / 2) * Math.cos(nd.a) * 0.55, y: nd.y - (nodeH / 2) * Math.sin(nd.a) * 1.0 };
            const pts: [Pt, Pt, Pt, Pt] = [
              p0,
              { x: p0.x + (p3.x - p0.x) / 3, y: p0.y + (p3.y - p0.y) / 3 },
              { x: p0.x + ((p3.x - p0.x) * 2) / 3, y: p0.y + ((p3.y - p0.y) * 2) / 3 },
              p3,
            ];
            return (
              <React.Fragment key={nd.n}>
                <DrawPath d={`M ${p0.x} ${p0.y} L ${p3.x} ${p3.y}`} p={prog(f, 40 + i * 5, 24)} color={C.signal} width={2} opacity={0.45} />
                <Particles pts={pts} frame={f} start={70 + i * 4} color={C.signal} period={40} count={2} r={5} />
              </React.Fragment>
            );
          })}
          <circle
            cx={center.x}
            cy={center.y}
            r={coreR + 22}
            fill="none"
            stroke={C.accent}
            strokeOpacity={0.4 * coreP}
            strokeWidth={1.5}
            strokeDasharray="6 10"
            transform={`rotate(${f * 0.6} ${center.x} ${center.y})`}
          />
        </svg>

        {/* Core */}
        <div
          style={{
            position: "absolute",
            left: center.x - coreR,
            top: center.y - coreR,
            width: coreR * 2,
            height: coreR * 2,
            borderRadius: 999,
            border: `2px solid ${C.accent}`,
            background: "radial-gradient(circle at 50% 35%, rgba(216,187,132,0.22), rgba(17,24,42,0.96) 70%)",
            boxShadow: `0 0 ${110 * coreP}px -10px rgba(216, 187, 132, 0.55)`,
            opacity: coreP,
            transform: `scale(${0.85 + 0.15 * coreP})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: portrait ? 36 : 38, color: C.fg, lineHeight: 1.05 }}>
            Governance
            <br />
            <span style={{ fontStyle: "italic", color: C.accent }}>Control Plane</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 14, color: C.fg3, letterSpacing: "0.12em", marginTop: 10 }}>POLICY · RISK · AUDIT</div>
        </div>

        {nodes.map((nd, i) => {
          const p = prog(f, 30 + i * 6, 18);
          return (
            <div
              key={nd.n}
              style={{
                ...card(C.line3),
                position: "absolute",
                left: nd.x - nodeW / 2,
                top: nd.y - nodeH / 2,
                width: nodeW,
                height: nodeH,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontFamily: MONO,
                fontSize: portrait ? 20 : 21,
                color: C.fg,
                letterSpacing: "0.06em",
                opacity: p,
                transform: `scale(${0.9 + 0.1 * p})`,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 99, background: C.signal }} />
              {nd.n}
            </div>
          );
        })}

        {portrait && (
          <div style={{ position: "absolute", left: pad, right: pad, top: 1176, display: "flex", justifyContent: "space-between" }}>
            {bullets.map(([a, b], i) => (
              <div key={b} style={{ ...rise(prog(f, 96 + i * 12, 18), 14), fontFamily: SANS, fontSize: 30, color: C.fg }}>
                <span style={{ color: C.accent }}>{a}</span> {b}
              </div>
            ))}
          </div>
        )}
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 8. Call to action */

export const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, pad } = useLayout();
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill style={{ padding: `0 ${pad}px`, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <Eyebrow start={4} center>
          The full interactive essay
        </Eyebrow>
        <div style={{ marginTop: 30 }}>
          <Headline start={12} center size={portrait ? 112 : 124} lineHeight={1.0} text={"The Universal\n*Governance Layer*"} />
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: SANS,
            fontSize: portrait ? 34 : 36,
            color: C.fg2,
            maxWidth: portrait ? 860 : 1200,
            lineHeight: 1.3,
            ...rise(prog(f, 50, 20)),
          }}
        >
          Why AI governance must be decoupled from every business application.
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 40, ...rise(prog(f, 66, 18)) }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: i === 2 ? 44 : 14,
                height: 14,
                borderRadius: 99,
                background: i < 3 ? C.accent : C.line3,
                boxShadow: i === 2 ? `0 0 20px ${C.accent}` : "none",
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
            fontSize: portrait ? 32 : 32,
            boxShadow: "0 20px 60px -20px rgba(216,187,132,0.7)",
            ...rise(prog(f, 80, 20)),
          }}
        >
          Read the interactive article →
        </div>
        <div style={{ marginTop: 22, fontFamily: MONO, fontSize: portrait ? 26 : 26, color: C.fg2, letterSpacing: "0.04em", ...rise(prog(f, 92, 20)) }}>
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
