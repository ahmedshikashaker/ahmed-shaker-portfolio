import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
import { DrawPath, Eyebrow, Headline, Particles, Pt, SceneWrap, card, clamp, prog, rise, useLayout, useSceneFrame } from "../primitives";

/* ------------------------------------------------------------------ shared bits */

const Header: React.FC<{ eyebrow: string; text: string; size: [number, number]; tone?: string }> = ({ eyebrow, text, size, tone }) => {
  const { portrait, pad } = useLayout();
  return (
    <div style={{ position: "absolute", left: pad, right: pad, top: portrait ? 150 : 132 }}>
      <Eyebrow start={2} color={tone}>
        {eyebrow}
      </Eyebrow>
      <div style={{ marginTop: 22 }}>
        <Headline start={8} size={portrait ? size[0] : size[1]} lineHeight={1.08} text={text} />
      </div>
    </div>
  );
};

const Tick: React.FC<{ p: number; size?: number; color?: string; stroke?: number }> = ({ p, size = 26, color = C.signal, stroke = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" style={{ display: "block", flex: "none" }}>
    <path
      d="M5 13.5 L11 19 L21 7"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
    />
  </svg>
);

const Cross: React.FC<{ p: number; size?: number; color?: string; stroke?: number }> = ({ p, size = 22, color = C.danger, stroke = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" style={{ display: "block", flex: "none" }}>
    {["M7 7 L19 19", "M19 7 L7 19"].map((d, i) => (
      <path
        key={d}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - interpolate(p, [i * 0.5, i * 0.5 + 0.5], [0, 1], clamp)}
      />
    ))}
  </svg>
);

const RingBadge: React.FC<{ p: number; color: string; children: React.ReactNode; size?: number }> = ({ p, color, children, size = 52 }) => (
  <div
    style={{
      width: size,
      height: size,
      flex: "none",
      borderRadius: 99,
      border: `2px solid ${color}`,
      background: `${color}${Math.round(0x40 * p)
        .toString(16)
        .padStart(2, "0")}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ 1. Perimeter authorization */

const MILESTONES = ["search", "plan", "wait", "execute"];

export const Perimeter: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const roadY = portrait ? 870 : 650;
  const half = portrait ? 46 : 48;
  const gateX = pad + (portrait ? 150 : 210);
  const x0 = pad;
  const x1 = width - pad;
  const stubP = prog(f, 26, 18);
  const gateP = prog(f, 34, 20);
  const check = prog(f, 56, 14);
  const roadP = prog(f, 82, 60);
  const len = x1 - gateX;
  const roadPts: [Pt, Pt, Pt, Pt] = [
    { x: gateX + 20, y: roadY },
    { x: gateX + len / 3, y: roadY },
    { x: gateX + (2 * len) / 3, y: roadY },
    { x: x1 - 10, y: roadY },
  ];
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Perimeter authorization" size={[92, 84]} text={portrait ? "One check at login\nis *not enough.*" : "One check at login is *not enough.*"} />

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id="p5fadeGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="white" />
              <stop offset="0.72" stopColor="white" />
              <stop offset="1" stopColor="black" />
            </linearGradient>
            <mask id="p5fade">
              <rect x={gateX} y={roadY - 300} width={len} height={600} fill="url(#p5fadeGrad)" />
            </mask>
            <clipPath id="p5road">
              <rect x={gateX} y={roadY - 300} width={len * roadP} height={600} />
            </clipPath>
          </defs>

          {/* checked entrance stub */}
          <g opacity={stubP}>
            <rect x={x0} y={roadY - half} width={gateX - x0} height={half * 2} fill="rgba(36, 138, 61, 0.08)" />
            <line x1={x0} y1={roadY - half} x2={gateX} y2={roadY - half} stroke="rgba(36, 138, 61, 0.45)" strokeWidth={2} />
            <line x1={x0} y1={roadY + half} x2={gateX} y2={roadY + half} stroke="rgba(36, 138, 61, 0.45)" strokeWidth={2} />
          </g>

          {/* the long unguarded road */}
          <g mask="url(#p5fade)">
            <g clipPath="url(#p5road)">
              <rect x={gateX} y={roadY - half} width={len} height={half * 2} fill="rgba(215, 0, 21, 0.05)" />
              <line x1={gateX} y1={roadY - half} x2={x1} y2={roadY - half} stroke={C.line3} strokeWidth={2} />
              <line x1={gateX} y1={roadY + half} x2={x1} y2={roadY + half} stroke={C.line3} strokeWidth={2} />
              <line x1={gateX + 30} y1={roadY} x2={x1} y2={roadY} stroke={C.fg4} strokeWidth={2.5} strokeDasharray="22 20" opacity={0.55} />
            </g>
          </g>

          {/* milestone ticks across the road */}
          {MILESTONES.map((m, i) => {
            const x = gateX + ((i + 1) * len) / 5;
            const p = prog(f, 112 + i * 14, 14);
            return <line key={m} x1={x} y1={roadY - half} x2={x} y2={roadY + half} stroke={C.danger} strokeWidth={2} strokeDasharray="5 7" opacity={0.55 * p} />;
          })}

          {/* the single gate */}
          <g opacity={gateP}>
            <rect x={gateX - 7} y={roadY - half - 46 + (1 - gateP) * 20} width={14} height={half * 2 + 92} rx={7} fill={C.signal} />
            <rect x={gateX - 40} y={roadY - half - 46} width={80} height={half * 2 + 92} rx={18} fill="rgba(36, 138, 61, 0.10)" />
          </g>

          <Particles pts={roadPts} frame={f} start={124} color={C.danger} count={2} period={84} r={7} />
        </svg>

        {/* gate label */}
        <div
          style={{
            ...card("rgba(36, 138, 61, 0.4)"),
            ...rise(prog(f, 40, 18), 16),
            position: "absolute",
            left: pad,
            top: roadY - half - 160,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <RingBadge p={check} color={C.signal} size={44}>
            <Tick p={check} size={22} />
          </RingBadge>
          <span style={{ fontFamily: MONO, fontSize: portrait ? 23 : 24, color: C.fg }}>JWT check at login</span>
        </div>

        {/* milestone labels */}
        {MILESTONES.map((m, i) => {
          const x = gateX + ((i + 1) * len) / 5;
          const p = prog(f, 112 + i * 14, 14);
          return (
            <React.Fragment key={m}>
              <div
                style={{
                  position: "absolute",
                  left: x - 90,
                  width: 180,
                  top: roadY - half - 44,
                  textAlign: "center",
                  fontFamily: MONO,
                  fontSize: portrait ? 20 : 21,
                  color: C.fg3,
                  ...rise(p, 10),
                }}
              >
                {m}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: x - 90,
                  width: 180,
                  top: roadY + half + 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: MONO,
                  fontSize: portrait ? 16 : 17,
                  letterSpacing: "0.08em",
                  color: C.danger,
                  opacity: p,
                }}
              >
                <Cross p={prog(f, 120 + i * 14, 12)} size={18} />
                unchecked
              </div>
            </React.Fragment>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: roadY + half + (portrait ? 120 : 110),
            fontFamily: SANS,
            fontSize: portrait ? 34 : 36,
            color: C.fg2,
            textAlign: portrait ? "left" : "center",
            ...rise(prog(f, 168, 20)),
          }}
        >
          Everything after the door runs <span style={{ color: C.danger }}>unguarded.</span>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 2. The confused deputy */

const JOURNEY: { t: string; sub?: string }[] = [{ t: "Prompt" }, { t: "Search" }, { t: "Plan" }, { t: "Wait for approval", sub: "hours" }, { t: "API call" }];

export const Deputy: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const ty = portrait ? 540 : 470;
  const R = portrait ? 30 : 34;
  const xs = JOURNEY.map((_, i) => pad + 70 + (i * (W - 140)) / 4);
  const pos = interpolate(f, [34, 70, 104, 138, 226, 258], [0, 1, 2, 3, 3, 4], clamp);
  const agentX = interpolate(pos, [0, 1, 2, 3, 4], xs, clamp);
  const agentP = prog(f, 26, 14);
  const tokenS = spring({ frame: f - 226, fps, config: { damping: 14 } });
  const waiting = f >= 132 && f < 232;
  const hit = prog(f, 256, 10);

  // power comparison
  const by = portrait ? 790 : 650;
  const labelW = portrait ? 0 : 330;
  const barX = pad + labelW;
  const barW = W - labelW;
  const barH = portrait ? 40 : 46;
  const userP = prog(f, 284, 26);
  const agentBarP = prog(f, 302, 36);
  const stampS = spring({ frame: f - 334, fps, config: { damping: 11, mass: 0.8 } });
  const rows = portrait
    ? [
        { label: "User's authority", y: by, barY: by + 46 },
        { label: "Agent's token", y: by + 124, barY: by + 170 },
      ]
    : [
        { label: "User's authority", y: by, barY: by },
        { label: "Agent's token", y: by + 100, barY: by + 100 },
      ];
  const userFrac = 0.26;

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="The confused deputy" tone={C.danger} size={[76, 68]} text={portrait ? "Hours between the prompt\nand the *API call.*" : "Hours pass between the prompt\nand the *API call.*"} />

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <DrawPath d={`M ${xs[0]} ${ty} L ${xs[4]} ${ty}`} p={prog(f, 16, 26)} color={C.line3} width={2} />
          <DrawPath d={`M ${xs[0]} ${ty} L ${agentX} ${ty}`} p={agentP} color={C.accent} width={3} />
          {JOURNEY.map((n, i) => {
            const p = prog(f, 14 + i * 6, 16);
            const passed = pos >= i - 0.02;
            const isApi = i === 4;
            const col = isApi && hit > 0.5 ? C.danger : passed ? C.signal : C.line3;
            return (
              <g key={n.t} opacity={p}>
                <circle cx={xs[i]} cy={ty} r={R} fill={C.bg2} stroke={col} strokeWidth={2.5} />
                {isApi && <circle cx={xs[i]} cy={ty} r={R + 14 * hit} fill="none" stroke={C.danger} strokeWidth={2} opacity={hit * (1 - prog(f, 262, 30)) + 0.0001} />}
                {i === 3 ? (
                  <g stroke={passed ? C.accent : C.fg4} strokeWidth={2.5} strokeLinecap="round">
                    <circle cx={xs[i]} cy={ty} r={R * 0.48} fill="none" />
                    <line x1={xs[i]} y1={ty} x2={xs[i]} y2={ty - R * 0.34} transform={`rotate(${Math.max(0, f - 132) * 9} ${xs[i]} ${ty})`} />
                    <line x1={xs[i]} y1={ty} x2={xs[i] + R * 0.24} y2={ty} transform={`rotate(${Math.max(0, f - 132) * 0.75} ${xs[i]} ${ty})`} />
                  </g>
                ) : (
                  <text x={xs[i]} y={ty + 7} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={passed ? C.fg : C.fg4}>
                    {i + 1}
                  </text>
                )}
              </g>
            );
          })}
          {/* waiting ring */}
          {f >= 132 && (
            <circle
              cx={xs[3]}
              cy={ty}
              r={R + 13}
              fill="none"
              stroke={C.accent}
              strokeWidth={3}
              strokeDasharray={`${(R + 13) * 1.6} ${(R + 13) * 4.7}`}
              transform={`rotate(${(f - 132) * 7} ${xs[3]} ${ty})`}
              opacity={(waiting ? 1 : 1 - prog(f, 232, 12)) * prog(f, 132, 10)}
            />
          )}
          {/* agent */}
          <g opacity={agentP}>
            <circle cx={agentX} cy={ty} r={30} fill={C.accent} opacity={0.16} />
            <circle cx={agentX} cy={ty} r={13} fill={C.accent} />
          </g>
        </svg>

        {/* agent tag → shared service token */}
        <div
          style={{
            position: "absolute",
            left: agentX - 150,
            width: 300,
            top: ty - R - 64,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", height: 40, width: 300 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: MONO,
                fontSize: 19,
                letterSpacing: "0.14em",
                color: C.accent,
                opacity: agentP * (1 - interpolate(tokenS, [0, 0.4], [0, 1], clamp)),
              }}
            >
              AI AGENT
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: interpolate(tokenS, [0, 0.3], [0, 1], clamp),
                transform: `scale(${0.6 + 0.4 * tokenS})`,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 19,
                  letterSpacing: "0.08em",
                  color: C.danger,
                  border: `1.5px solid ${C.danger}`,
                  background: "rgba(215, 0, 21, 0.08)",
                  borderRadius: 99,
                  padding: "6px 16px",
                  whiteSpace: "nowrap",
                }}
              >
                shared service token
              </span>
            </div>
          </div>
        </div>

        {/* node labels */}
        {JOURNEY.map((n, i) => (
          <div
            key={n.t}
            style={{
              position: "absolute",
              left: xs[i] - 100,
              width: 200,
              top: ty + R + 18,
              textAlign: "center",
              ...rise(prog(f, 18 + i * 6, 16), 10),
            }}
          >
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 22 : 25, color: C.fg, lineHeight: 1.2 }}>
              {portrait && n.sub ? (
                <>
                  Wait for
                  <br />
                  approval
                </>
              ) : (
                n.t
              )}
            </div>
            {n.sub && (
              <div style={{ fontFamily: MONO, fontSize: portrait ? 18 : 19, color: C.accent, marginTop: 6, opacity: prog(f, 136, 14) }}>{n.sub}</div>
            )}
          </div>
        ))}

        {/* power comparison */}
        {rows.map((r, i) => {
          const isAgent = i === 1;
          const p = isAgent ? agentBarP : userP;
          const frac = isAgent ? 1 : userFrac;
          const col = isAgent ? C.danger : C.blue;
          return (
            <React.Fragment key={r.label}>
              <div
                style={{
                  position: "absolute",
                  left: pad,
                  top: portrait ? r.y : r.barY,
                  height: portrait ? undefined : barH,
                  display: "flex",
                  alignItems: "center",
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: portrait ? 26 : 28,
                  color: isAgent ? C.danger : C.fg,
                  ...rise(prog(f, isAgent ? 296 : 278, 16), 12),
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: barX,
                  top: r.barY,
                  width: barW,
                  height: barH,
                  borderRadius: 12,
                  background: C.surface,
                  border: `1px solid ${C.line2}`,
                  overflow: "hidden",
                  opacity: prog(f, isAgent ? 296 : 278, 14),
                }}
              >
                <div
                  style={{
                    width: `${frac * p * 100}%`,
                    height: "100%",
                    borderRadius: 12,
                    background: col,
                  }}
                />
                {isAgent && (
                  <div
                    style={{
                      position: "absolute",
                      right: 20,
                      top: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      fontFamily: MONO,
                      fontSize: portrait ? 17 : 18,
                      letterSpacing: "0.1em",
                      color: C.bg,
                      fontWeight: 500,
                      opacity: prog(f, 330, 14),
                    }}
                  >
                    EXCESS AUTHORITY
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
        {/* user's limit marker */}
        <div
          style={{
            position: "absolute",
            left: barX + barW * userFrac,
            top: rows[0].barY - 12,
            height: rows[1].barY + barH - rows[0].barY + 24,
            borderLeft: `2px dashed ${C.blue}`,
            opacity: 0.8 * prog(f, 306, 14),
          }}
        />

        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: rows[1].barY + barH + (portrait ? 64 : 56),
            display: "flex",
            alignItems: "center",
            justifyContent: portrait ? "flex-start" : "center",
            gap: 30,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: portrait ? 30 : 32,
              fontWeight: 500,
              letterSpacing: "0.16em",
              color: C.danger,
              border: `3px solid ${C.danger}`,
              borderRadius: 10,
              padding: "10px 22px",
              whiteSpace: "nowrap",
              opacity: interpolate(stampS, [0, 0.25], [0, 1], clamp),
              transform: `rotate(-4deg) scale(${1.5 - 0.5 * stampS})`,
            }}
          >
            CONFUSED DEPUTY
          </div>
          <div style={{ fontFamily: SANS, fontSize: portrait ? 28 : 32, color: C.fg2, lineHeight: 1.25, ...rise(prog(f, 348, 18)) }}>
            More power than {portrait && <br />}the person who asked.
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 3. Authority is an intersection */

const SETS = [
  { l1: "Signed-in", l2: "user", sx: -1, sy: -1, color: C.blue, t: 86 },
  { l1: "Assistant", l2: "ceiling", sx: 1, sy: -1, color: C.signal, t: 124 },
  { l1: "Live record", l2: "ownership", sx: -1, sy: 1, color: C.accent2, t: 164 },
  { l1: "Single-use", l2: "grant", sx: 1, sy: 1, color: C.danger, t: 222 },
];

export const Intersection: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const cx = portrait ? width / 2 : pad + 470;
  const cy = portrait ? 790 : 650;
  const d = portrait ? 88 : 92;
  const r = portrait ? 196 : 206;
  const glow = prog(f, 250, 26);
  const pulse = 0.85 + 0.15 * Math.sin(f / 9);
  const circles = SETS.map((s) => ({ ...s, x: cx + s.sx * d, y: cy + s.sy * d }));
  const callout = portrait ? { x: pad, y: 1112, w: width - pad * 2 } : { x: pad + 1000, y: 470, w: width - pad * 2 - 1000 };

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Effective authority" size={[84, 76]} text={portrait ? "Authority is an\n*intersection.*" : "Authority is an *intersection.*"} />

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            {circles.map((c, i) => (
              <clipPath key={i} id={`p5set${i}`}>
                <circle cx={c.x} cy={c.y} r={r} />
              </clipPath>
            ))}
            <filter id="p5glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
          {circles.map((c, i) => {
            const p = prog(f, c.t, 22);
            return (
              <g key={i} opacity={p}>
                <circle cx={c.x} cy={c.y} r={r * (0.86 + 0.14 * p)} fill={c.color} fillOpacity={0.07} stroke={c.color} strokeOpacity={0.75} strokeWidth={2.5} />
              </g>
            );
          })}
          {/* the intersection itself */}
          <g clipPath="url(#p5set0)">
            <g clipPath="url(#p5set1)">
              <g clipPath="url(#p5set2)">
                <circle cx={circles[3].x} cy={circles[3].y} r={r} fill={C.accent} opacity={0.95 * glow} />
              </g>
            </g>
          </g>
        </svg>

        {/* lobe labels */}
        {circles.map((c, i) => {
          const lx = cx + c.sx * (d + 0.42 * r);
          const ly = cy + c.sy * (d + 0.42 * r);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: lx - 110,
                width: 220,
                top: ly - 32,
                textAlign: "center",
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: portrait ? 24 : 25,
                lineHeight: 1.15,
                color: c.color,
                ...rise(prog(f, c.t + 6, 18), 10),
              }}
            >
              {c.l1}
              <br />
              {c.l2}
            </div>
          );
        })}

        {/* centre label */}
        <div
          style={{
            position: "absolute",
            left: cx - 90,
            width: 180,
            top: cy - 22,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "0.1em",
            lineHeight: 1.3,
            color: C.bg,
            opacity: prog(f, 262, 16),
          }}
        >
          EFFECTIVE
          <br />
          AUTHORITY
        </div>

        {/* callout */}
        <div
          style={{
            position: "absolute",
            left: callout.x,
            top: callout.y,
            width: callout.w,
            ...rise(prog(f, 268, 20)),
          }}
        >
          {!portrait && <div style={{ width: 60, height: 3, background: C.accent, marginBottom: 30 }} />}
          <div style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.035em", fontSize: portrait ? 44 : 56, lineHeight: 1.08, color: C.fg, textAlign: portrait ? "center" : "left" }}>
            An agent never owns {!portrait && <br />}permissions <span style={{ color: C.accent }}>of its own.</span>
          </div>
          {!portrait && (
            <div style={{ marginTop: 34, fontFamily: MONO, fontSize: 21, color: C.fg3, lineHeight: 1.6 }}>
              user ∩ ceiling ∩ ownership ∩ grant
            </div>
          )}
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 4. Seven checkpoints */

const STAGES = [
  "Session & Principal Verification",
  "Hard Capability Pre-Filter",
  "Brokered RAG Signed Scope",
  "Two-Step Citation Release Re-Auth",
  "Context-Injected Fields & Ownership Check",
  "Pre-Grant Live Principal Re-Verification",
  "Single-Attempt Signed Execution Grant Check",
];

export const SevenStages: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const t0 = 66;
  const step = 19;
  const lit = (i: number) => prog(f, t0 + i * step, 12);
  const fill = interpolate(f, [t0, t0 + 6 * step], [0, 6], clamp);
  const current = Math.min(6, Math.floor((f - t0) / step));

  const endLabel = (txt: string, p: number, align: "left" | "right" | "center") => (
    <span style={{ fontFamily: MONO, fontSize: portrait ? 19 : 19, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, opacity: p, textAlign: align }}>{txt}</span>
  );

  if (portrait) {
    const railX = pad + 30;
    const top = 470;
    const rowH = 96;
    const nodeY = (i: number) => top + i * rowH + 30;
    return (
      <SceneWrap dur={dur}>
        <AbsoluteFill>
          <Header eyebrow="Continuous authorization" size={[80, 72]} text={"Seven checkpoints,\n*not one.*"} />
          <div style={{ position: "absolute", left: pad, top: top - 64 }}>{endLabel("Session", prog(f, 50, 16), "left")}</div>
          <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={railX} y1={nodeY(0)} x2={railX} y2={nodeY(6)} stroke={C.line3} strokeWidth={2} opacity={prog(f, 30, 20)} />
            <line x1={railX} y1={nodeY(0)} x2={railX} y2={nodeY(0) + (fill / 6) * (nodeY(6) - nodeY(0))} stroke={C.signal} strokeWidth={3} />
          </svg>
          {STAGES.map((s, i) => {
            const p = lit(i);
            const active = i === current && f < t0 + 7 * step + 10;
            return (
              <div key={s} style={{ position: "absolute", left: pad, top: nodeY(i) - 30, width: W, height: 60, display: "flex", alignItems: "center", gap: 30, ...rise(prog(f, 30 + i * 4, 16), 10) }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    flex: "none",
                    borderRadius: 99,
                    background: p > 0.01 ? `rgba(36, 138, 61, ${0.12 * p})` : C.bg2,
                    border: `2px solid ${p > 0.5 ? C.signal : C.line3}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: MONO,
                    fontSize: 22,
                    color: p > 0.5 ? C.signal : C.fg4,
                    backgroundColor: C.bg2,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: interpolate(p, [0, 1], [0.45, 1]) > 0.7 ? C.fg : C.fg3 }}>{s}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: pad, top: nodeY(6) + 56 }}>{endLabel("Millisecond of execution", prog(f, t0 + 6 * step + 8, 16), "left")}</div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  const colW = W / 7;
  const railY = 520;
  const nx = (i: number) => pad + colW * (i + 0.5);
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Continuous authorization" size={[80, 70]} text={"Seven checkpoints, *not one.*"} />
        <div style={{ position: "absolute", left: nx(0) - 30, top: railY - 82 }}>{endLabel("Session", prog(f, 50, 16), "left")}</div>
        <div style={{ position: "absolute", right: width - nx(6) - 30, top: railY - 82 }}>{endLabel("Millisecond of execution", prog(f, t0 + 6 * step + 8, 16), "right")}</div>
        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={nx(0)} y1={railY} x2={nx(6)} y2={railY} stroke={C.line3} strokeWidth={2} opacity={prog(f, 30, 20)} />
          <line x1={nx(0)} y1={railY} x2={nx(0) + (fill / 6) * (nx(6) - nx(0))} y2={railY} stroke={C.signal} strokeWidth={3} />
        </svg>
        {STAGES.map((s, i) => {
          const p = lit(i);
          return (
            <React.Fragment key={s}>
              <div
                style={{
                  position: "absolute",
                  left: nx(i) - 32,
                  top: railY - 32,
                  width: 64,
                  height: 64,
                  borderRadius: 99,
                  backgroundColor: C.bg2,
                  backgroundImage: `linear-gradient(rgba(36, 138, 61, ${0.12 * p}), rgba(36, 138, 61, ${0.12 * p}))`,
                  border: `2px solid ${p > 0.5 ? C.signal : C.line3}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontSize: 23,
                  color: p > 0.5 ? C.signal : C.fg4,
                  ...rise(prog(f, 30 + i * 4, 16), 10),
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  ...card(p > 0.5 ? "rgba(36, 138, 61, 0.4)" : C.line),
                  ...rise(prog(f, 36 + i * 4, 16), 12),
                  position: "absolute",
                  left: nx(i) - colW / 2 + 9,
                  width: colW - 18,
                  top: railY + 64,
                  height: 196,
                  borderRadius: 18,
                  padding: "22px 18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 23, lineHeight: 1.22, color: p > 0.5 ? C.fg : C.fg3 }}>{s}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 15, letterSpacing: "0.12em", color: C.signal, opacity: p }}>
                  <Tick p={prog(f, t0 + i * step + 4, 10)} size={18} />
                  VERIFIED
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: pad, right: pad, top: 870, textAlign: "center", fontFamily: SANS, fontSize: 34, color: C.fg2, ...rise(prog(f, 200, 20)) }}>
          Authorization is re-checked <span style={{ color: C.signal }}>at every step</span>, not just at the door.
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 5. Three structural pillars */

const PillarShell: React.FC<{
  i: number;
  t: number;
  title: string;
  label: string;
  box: { x: number; y: number; w: number; h: number };
  children: React.ReactNode;
}> = ({ i, t, title, label, box, children }) => {
  const f = useSceneFrame();
  const { portrait } = useLayout();
  const head = (
    <>
      <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.16em", color: C.accent }}>0{i + 1}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 29 : 30, lineHeight: 1.18, color: C.fg, marginTop: 10 }}>{title}</div>
    </>
  );
  const foot = <div style={{ fontFamily: MONO, fontSize: portrait ? 17 : 18, lineHeight: 1.4, color: C.signal, opacity: prog(f, t + 30, 16) }}>{label}</div>;
  return (
    <div
      style={{
        ...card(),
        ...rise(prog(f, t, 20), 18),
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        padding: portrait ? "26px 30px" : "32px 34px",
        display: "flex",
        flexDirection: portrait ? "row" : "column",
        gap: portrait ? 30 : 0,
        justifyContent: "space-between",
      }}
    >
      {portrait ? (
        <>
          <div style={{ width: 300, flex: "none", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>{head}</div>
            {foot}
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
        </>
      ) : (
        <>
          <div>{head}</div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
          {foot}
        </>
      )}
    </div>
  );
};

const SchemaView: React.FC<{ t: number }> = ({ t }) => {
  const f = useSceneFrame();
  const { portrait } = useLayout();
  const fs = portrait ? 19 : 21;
  const lines: { k?: string; v?: string; raw?: string; hidden?: boolean }[] = [
    { raw: "{" },
    { k: "leaveType", v: '"annual"' },
    { k: "days", v: "4" },
    { k: "employeeId", v: '"…"', hidden: true },
    { k: "tenantId", v: '"…"', hidden: true },
    { raw: "}" },
  ];
  let h = 0;
  return (
    <div style={{ fontFamily: MONO, fontSize: fs, lineHeight: 1.5, color: C.fg2, background: "#ffffff", border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 20px", width: "100%" }}>
      {lines.map((l, idx) => {
        if (l.raw) return <div key={idx}>{l.raw}</div>;
        const s = l.hidden ? prog(f, t + 24 + h++ * 8, 14) : 0;
        return (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 24 }}>
            <span style={{ position: "relative", color: l.hidden ? interpolateColor(s) : C.fg2, whiteSpace: "nowrap" }}>
              <span style={{ color: l.hidden ? undefined : C.blue }}>"{l.k}"</span>: {l.v}
              {l.hidden && <span style={{ position: "absolute", left: 0, top: "52%", height: 2.5, width: `${s * 100}%`, background: C.danger }} />}
            </span>
            {l.hidden && (
              <span style={{ fontSize: fs - 5, letterSpacing: "0.1em", color: C.danger, border: `1px solid rgba(215, 0, 21, 0.45)`, borderRadius: 6, padding: "1px 7px", opacity: s, whiteSpace: "nowrap" }}>
                HIDDEN
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const interpolateColor = (s: number) => (s > 0.5 ? C.fg4 : C.fg2);

const Funnel: React.FC<{ t: number }> = ({ t }) => {
  const f = useSceneFrame();
  const { portrait } = useLayout();
  const tiers = [
    { label: "10,000+ capabilities", w: 100, color: C.fg4, bg: "#ffffff" },
    { label: "policy allow-set", w: 76, color: C.accent, bg: "rgba(0, 113, 227, 0.08)" },
    { label: "semantic ranking", w: 54, color: C.signal, bg: "rgba(36, 138, 61, 0.08)" },
  ];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: portrait ? 10 : 14 }}>
      {tiers.map((x, i) => {
        const p = prog(f, t + 10 + i * 24, 16);
        return (
          <React.Fragment key={x.label}>
            {i > 0 && !portrait && <div style={{ fontFamily: MONO, fontSize: 18, color: C.fg4, opacity: p, lineHeight: 1 }}>↓</div>}
            <div
              style={{
                width: `${x.w}%`,
                height: portrait ? 46 : 54,
                borderRadius: 10,
                border: `1.5px solid ${x.color}`,
                background: x.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontSize: portrait ? 18 : 19,
                color: i === 0 ? C.fg2 : x.color,
                whiteSpace: "nowrap",
                opacity: p,
                transform: `scaleX(${0.9 + 0.1 * p})`,
              }}
            >
              {x.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const ScopeToken: React.FC<{ t: number }> = ({ t }) => {
  const f = useSceneFrame();
  const { portrait } = useLayout();
  const size = portrait ? 136 : 168;
  const rr = size / 2 - 10;
  const circ = 2 * Math.PI * rr;
  const draw = prog(f, t + 6, 20);
  const elapsed = Math.max(0, (f - (t + 26)) / 30);
  const remaining = Math.max(0, 60 - elapsed);
  const frac = (remaining / 60) * draw;
  return (
    <div style={{ display: "flex", flexDirection: portrait ? "row" : "column", alignItems: "center", gap: portrait ? 28 : 22 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={rr} fill="none" stroke={C.line2} strokeWidth={8} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={rr}
            fill="none"
            stroke={C.signal}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={`${circ * frac} ${circ}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: draw }}>
          <span style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.04em", fontSize: portrait ? 46 : 56, color: C.fg, lineHeight: 1 }}>{Math.ceil(remaining)}</span>
          <span style={{ fontFamily: MONO, fontSize: 15, letterSpacing: "0.14em", color: C.fg4, marginTop: 4 }}>SECONDS</span>
        </div>
      </div>
      <div style={{ fontFamily: MONO, fontSize: portrait ? 17 : 18, lineHeight: 1.7, color: C.fg3, opacity: prog(f, t + 20, 16), textAlign: portrait ? "left" : "center" }}>
        <div>
          scope <span style={{ color: C.fg2 }}>· matched docs only</span>
        </div>
        <div>
          sig <span style={{ color: C.signal }}>· verified</span>
        </div>
      </div>
    </div>
  );
};

export const Pillars: React.FC<{ dur: number }> = ({ dur }) => {
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const boxes = portrait
    ? [0, 1, 2].map((i) => ({ x: pad, y: 430 + i * 262, w: W, h: 240 }))
    : [0, 1, 2].map((i) => ({ x: pad + i * ((W - 60) / 3 + 30), y: 380, w: (W - 60) / 3, h: 560 }));
  const T = [28, 96, 204];
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Three structural pillars" size={[78, 70]} text={portrait ? "Least privilege,\n*enforced by structure.*" : "Least privilege, *enforced by structure.*"} />
        <PillarShell i={0} t={T[0]} box={boxes[0]} title="The model never sees identity" label="context-injected by the control plane">
          <SchemaView t={T[0]} />
        </PillarShell>
        <PillarShell i={1} t={T[1]} box={boxes[1]} title="Policy filters before ranking" label="the model ranks only what policy allows">
          <Funnel t={T[1]} />
        </PillarShell>
        <PillarShell i={2} t={T[2]} box={boxes[2]} title="Retrieval on signed scopes" label="Ed25519-signed retrieval scope">
          <ScopeToken t={T[2]} />
        </PillarShell>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 6. Post-approval tamper */

const HEX = "0123456789abcdef";
const scramble = (seed: number, n: number) =>
  Array.from({ length: n })
    .map((_, i) => HEX[Math.floor(Math.abs(Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453)) % 16])
    .join("");

export const Tamper: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const cardBox = portrait ? { x: pad, y: 420, w: W, h: 470 } : { x: pad, y: 380, w: 1010, h: 540 };
  const right = portrait ? null : { x: pad + 1070, w: W - 1070 };
  const dispatchBox = portrait ? { x: pad, y: 940, w: 400, h: 230 } : { x: right!.x, y: 380, w: right!.w, h: 190 };
  const vaultBox = portrait ? { x: pad + 480, y: 940, w: W - 480, h: 230 } : { x: right!.x, y: 650, w: right!.w, h: 270 };

  const approved = prog(f, 36, 14);
  const flip = spring({ frame: f - 70, fps, config: { damping: 12 } });
  const tampered = f >= 70;
  const recompute = f >= 108;
  const settled = f >= 136;
  const mismatch = prog(f, 136, 14);
  const stampS = spring({ frame: f - 192, fps, config: { damping: 10, mass: 0.9 } });
  const blocked = prog(f, 196, 14);
  const zeroS = spring({ frame: f - 226, fps, config: { damping: 14 } });

  const good = "sha256:9f2c41…a41e";
  const bad = "sha256:3b7d08…e90c";
  const dispatchDigest = !recompute ? good : settled ? bad : `sha256:${scramble(Math.floor(f / 2), 6)}…${scramble(Math.floor(f / 2) + 99, 4)}`;

  const fs = portrait ? 22 : 24;
  const labelW = portrait ? 230 : 250;

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Post-approval tamper" tone={C.danger} size={[76, 70]} text={portrait ? "Tamper after approval,\nand the grant *breaks.*" : "Tamper after approval, and the grant *breaks.*"} />

        {/* grant card */}
        <div
          style={{
            ...card(settled ? "rgba(215, 0, 21, 0.5)" : C.line),
            ...rise(prog(f, 18, 20), 18),
            position: "absolute",
            left: cardBox.x,
            top: cardBox.y,
            width: cardBox.w,
            height: cardBox.h,
            padding: portrait ? "30px 34px" : "36px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: MONO, fontSize: portrait ? 16 : 17, letterSpacing: "0.14em", color: C.fg4 }}>SIGNED EXECUTION GRANT · SINGLE-USE</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: portrait ? 16 : 17, letterSpacing: "0.12em", color: C.signal, opacity: approved }}>
              <Tick p={approved} size={20} />
              APPROVED
            </span>
          </div>

          <div>
            <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.14em", color: C.fg4, marginBottom: 12 }}>PAYLOAD</div>
            <div style={{ fontFamily: MONO, fontSize: portrait ? 46 : 52, color: C.fg, display: "flex", alignItems: "center", whiteSpace: "pre" }}>
              <span>{'{ "days": '}</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "0 10px",
                  borderRadius: 10,
                  color: tampered ? C.danger : C.fg,
                  background: tampered ? `rgba(215, 0, 21, ${0.10 * flip})` : "transparent",
                  border: `2px solid ${tampered ? `rgba(215, 0, 21, ${0.75 * flip})` : "transparent"}`,
                  transform: `scale(${tampered ? 0.7 + 0.3 * flip : 1})`,
                }}
              >
                {tampered ? "14" : "4"}
              </span>
              <span>{" }"}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: portrait ? 18 : 30 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "baseline", opacity: prog(f, 28, 16) }}>
                <span style={{ width: labelW, fontFamily: MONO, fontSize: portrait ? 16 : 17, letterSpacing: "0.1em", color: C.fg4 }}>APPROVED DIGEST</span>
                <span style={{ fontFamily: MONO, fontSize: fs, color: C.signal }}>{good}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", opacity: prog(f, 100, 14) }}>
                <span style={{ width: labelW, fontFamily: MONO, fontSize: portrait ? 16 : 17, letterSpacing: "0.1em", color: C.fg4 }}>AT DISPATCH</span>
                <span style={{ fontFamily: MONO, fontSize: fs, color: settled ? C.danger : C.fg2 }}>{dispatchDigest}</span>
              </div>
            </div>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: portrait ? 72 : 84, lineHeight: 0.8, color: C.danger, opacity: mismatch, transform: `scale(${0.6 + 0.4 * mismatch})` }}>≠</span>
          </div>

          {/* stamp */}
          <div
            style={{
              position: "absolute",
              right: portrait ? 36 : 56,
              top: portrait ? 150 : 170,
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: portrait ? 30 : 38,
              lineHeight: 1.15,
              letterSpacing: "0.14em",
              textAlign: "center",
              color: C.danger,
              border: `4px solid ${C.danger}`,
              borderRadius: 12,
              padding: portrait ? "10px 18px" : "12px 26px",
              background: "rgba(255, 255, 255, 0.96)",
              opacity: interpolate(stampS, [0, 0.25], [0, 1], clamp),
              transform: `rotate(-7deg) scale(${1.6 - 0.6 * stampS})`,
            }}
          >
            DISPATCH
            <br />
            BLOCKED
          </div>
        </div>

        {/* dispatch → vault */}
        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {portrait ? (
            <line x1={dispatchBox.x + dispatchBox.w + 8} y1={dispatchBox.y + dispatchBox.h / 2} x2={vaultBox.x - 8} y2={vaultBox.y + vaultBox.h / 2} stroke={C.line3} strokeWidth={2.5} strokeDasharray="8 8" opacity={prog(f, 50, 16)} />
          ) : (
            <line x1={dispatchBox.x + dispatchBox.w / 2} y1={dispatchBox.y + dispatchBox.h + 8} x2={vaultBox.x + vaultBox.w / 2} y2={vaultBox.y - 8} stroke={C.line3} strokeWidth={2.5} strokeDasharray="8 8" opacity={prog(f, 50, 16)} />
          )}
        </svg>
        <div
          style={{
            position: "absolute",
            left: portrait ? dispatchBox.x + dispatchBox.w + 40 - 17 : dispatchBox.x + dispatchBox.w / 2 - 17,
            top: portrait ? dispatchBox.y + dispatchBox.h / 2 - 17 : (dispatchBox.y + dispatchBox.h + vaultBox.y) / 2 - 17,
            width: 34,
            height: 34,
            borderRadius: 99,
            background: C.bg,
            border: `2px solid ${C.danger}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: blocked,
          }}
        >
          <Cross p={blocked} size={20} />
        </div>

        <div
          style={{
            ...card(blocked > 0.5 ? "rgba(215, 0, 21, 0.45)" : C.line),
            ...rise(prog(f, 44, 18), 16),
            position: "absolute",
            left: dispatchBox.x,
            top: dispatchBox.y,
            width: dispatchBox.w,
            height: dispatchBox.h,
            padding: "26px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.14em", color: C.fg4 }}>DURABLE WORKER</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.03em", fontSize: portrait ? 38 : 42, color: C.fg }}>Dispatch</div>
          <div style={{ position: "relative", height: 26 }}>
            <span style={{ position: "absolute", left: 0, fontFamily: MONO, fontSize: portrait ? 17 : 19, color: C.fg3, opacity: 1 - blocked, whiteSpace: "nowrap" }}>verifying grant digest…</span>
            <span style={{ position: "absolute", left: 0, fontFamily: MONO, fontSize: portrait ? 17 : 19, color: C.danger, opacity: blocked, whiteSpace: "nowrap" }}>stopped · digest mismatch</span>
          </div>
        </div>

        <div
          style={{
            ...card(),
            ...rise(prog(f, 54, 18), 16),
            position: "absolute",
            left: vaultBox.x,
            top: vaultBox.y,
            width: vaultBox.w,
            height: vaultBox.h,
            padding: "26px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="26" height="30" viewBox="0 0 26 30">
              <path d="M7 13 V9 a6 6 0 0 1 12 0 V13" fill="none" stroke={C.fg3} strokeWidth="2.5" />
              <rect x="3" y="13" width="20" height="15" rx="3" fill="none" stroke={C.fg3} strokeWidth="2.5" />
            </svg>
            <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.14em", color: C.fg4 }}>SECRET VAULT</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                fontSize: portrait ? 120 : 140,
                lineHeight: 0.85,
                color: C.signal,
                opacity: interpolate(zeroS, [0, 0.3], [0, 1], clamp),
                transform: `translateY(${(1 - zeroS) * 16}px)`,
                display: "inline-block",
              }}
            >
              0
            </span>
            <span style={{ fontFamily: SANS, fontSize: portrait ? 26 : 30, color: C.fg2, lineHeight: 1.2, opacity: prog(f, 232, 16) }}>
              secrets
              <br />
              fetched
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
