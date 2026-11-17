import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
import { Eyebrow, Headline, SceneWrap, card, clamp, prog, rise, useLayout, useSceneFrame } from "../primitives";

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

const CheckMark: React.FC<{ p: number; size?: number; color?: string; stroke?: number }> = ({ p, size = 26, color = C.signal, stroke = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 26 26">
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

const RING_COLORS = [C.fg3, C.signal, C.blue, C.accent, C.danger];

/* ------------------------------------------------------------------ 1. The board's two questions */

const Stairs: React.FC<{ f: number; start: number }> = ({ f, start }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 96 }}>
    {RING_COLORS.map((col, i) => {
      const p = prog(f, start + i * 6, 14);
      return (
        <div
          key={i}
          style={{
            width: 24,
            height: 24 + i * 18,
            borderRadius: 6,
            background: col,
            opacity: 0.25 + 0.75 * p,
            transform: `scaleY(${0.3 + 0.7 * p})`,
            transformOrigin: "bottom",
          }}
        />
      );
    })}
  </div>
);

const Stopwatch: React.FC<{ p: number; size: number }> = ({ p, size }) => {
  const cx = size / 2;
  const cy = size * 0.57;
  const r = size * 0.36;
  const ang = ((-90 + p * 320) * Math.PI) / 180;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x={cx - size * 0.07} y={size * 0.06} width={size * 0.14} height={size * 0.08} rx={4} fill={C.fg3} />
      <rect x={cx - size * 0.025} y={size * 0.13} width={size * 0.05} height={size * 0.07} fill={C.fg3} />
      <circle cx={cx} cy={cy} r={r} fill={C.surface2} stroke={C.line3} strokeWidth={4} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={C.danger}
        strokeWidth={6}
        pathLength={1}
        strokeDasharray={`${p * 0.89} 1`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <line x1={cx} y1={cy} x2={cx + Math.cos(ang) * (r - 12)} y2={cy + Math.sin(ang) * (r - 12)} stroke={C.fg} strokeWidth={4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill={C.fg} />
    </svg>
  );
};

export const BoardQuestion: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const gap = portrait ? 36 : 40;
  const c1 = portrait ? { x: pad, y: 410, w: W, h: 330 } : { x: pad, y: 380, w: (W - gap) / 2, h: 450 };
  const c2 = portrait ? { x: pad, y: 410 + 330 + gap, w: W, h: 390 } : { x: pad + (W - gap) / 2 + gap, y: 380, w: (W - gap) / 2, h: 450 };
  const p1 = prog(f, 84, 20);
  const p2 = prog(f, 166, 20);
  const sweep = prog(f, 184, 24);
  const pop = spring({ frame: f - 204, fps, config: { damping: 12 } });
  const qSize = portrait ? 66 : 70;
  const label: React.CSSProperties = { fontFamily: MONO, fontSize: 17, letterSpacing: "0.16em", color: C.fg4 };
  const inner: React.CSSProperties = {
    position: "absolute",
    padding: portrait ? "34px 40px" : "42px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header
          eyebrow="The board's two questions"
          size={[76, 76]}
          text={portrait ? "Every board eventually\nasks *two questions.*" : "Every board eventually asks *two questions.*"}
        />

        <div style={{ ...card(), ...inner, ...rise(p1, 22), left: c1.x, top: c1.y, width: c1.w, height: c1.h }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={label}>
              QUESTION 01 <span style={{ color: C.accent }}>· ROLLOUT</span>
            </div>
            <Stairs f={f} start={104} />
          </div>
          <Headline start={90} stagger={2} size={qSize} lineHeight={1.06} text={"How do we roll\nit out *safely?*"} />
        </div>

        <div
          style={{
            ...card(pop > 0.5 ? "rgba(215, 0, 21, 0.45)" : C.line),
            ...inner,
            ...rise(p2, 22),
            left: c2.x,
            top: c2.y,
            width: c2.w,
            height: c2.h,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={label}>
              QUESTION 02 <span style={{ color: C.danger }}>· CONTAINMENT</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ textAlign: "right", opacity: interpolate(pop, [0, 0.4], [0, 1], clamp), transform: `scale(${0.8 + 0.2 * pop})`, transformOrigin: "right center" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.04em", fontSize: portrait ? 64 : 68, lineHeight: 1, color: C.signal, whiteSpace: "nowrap" }}>{"< 1 s"}</div>
                <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: "0.14em", color: C.fg3, marginTop: 8 }}>SUB-SECOND STOP</div>
              </div>
              <Stopwatch p={sweep} size={portrait ? 128 : 136} />
            </div>
          </div>
          <Headline start={172} stagger={2} size={qSize} lineHeight={1.06} text={"How fast can\nwe *stop* it?"} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 2. Five rollout rings */

const RINGS = [
  { tier: "SHADOW", name: "Shadow & contract certification" },
  { tier: "R0", name: "Read-only & brokered RAG" },
  { tier: "R1", name: "Bounded low-blast-radius writes" },
  { tier: "R2", name: "Hash-confirmed standard writes" },
  { tier: "R3", name: "Four-eyes quorum & regulated operations" },
];

export const RolloutRings: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const geo = portrait
    ? { cx: width / 2, cy: 800, r0: 92, dr: 60, bw: 38 }
    : { cx: pad + 392, cy: 880, r0: 104, dr: 66, bw: 42 };
  const list = portrait ? { x: pad, y: 868, w: W, rowH: 78 } : { x: pad + 860, y: 452, w: W - 860, rowH: 92 };
  const stripY = portrait ? 316 : 304;
  const strike = prog(f, 84, 16);
  const stamp = spring({ frame: f - 98, fps, config: { damping: 11 } });
  const stripDim = 1 - 0.5 * prog(f, 150, 24);
  const ringT = (i: number) => 160 + i * 26;
  const pill = (txt: string, col: string): React.ReactNode => (
    <span
      style={{
        fontFamily: MONO,
        fontSize: portrait ? 20 : 21,
        letterSpacing: "0.08em",
        color: col,
        border: `1.5px solid ${col}`,
        borderRadius: 999,
        padding: "10px 22px",
        background: C.surface,
        whiteSpace: "nowrap",
      }}
    >
      {txt}
    </span>
  );
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Progressive adoption" size={[74, 76]} text="Five rings. *No shortcuts.*" />

        {/* The forbidden shortcut */}
        <div style={{ position: "absolute", left: pad, top: stripY, display: "flex", alignItems: "center", gap: 26, ...rise(prog(f, 22, 18), 14), opacity: prog(f, 22, 18) * stripDim }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
            {pill("PILOT", C.fg2)}
            <svg width={portrait ? 150 : 180} height={24} style={{ overflow: "visible" }}>
              <line x1={4} y1={12} x2={(portrait ? 150 : 180) - 14} y2={12} stroke={C.danger} strokeWidth={3} strokeDasharray="8 8" strokeDashoffset={-f * 1.2} />
              <path d={`M ${(portrait ? 150 : 180) - 16} 3 L ${portrait ? 150 : 180} 12 L ${(portrait ? 150 : 180) - 16} 21`} fill="none" stroke={C.danger} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {pill("R3 WRITES", C.danger)}
            <div style={{ position: "absolute", left: -8, top: "50%", height: 4, marginTop: -2, width: `calc(${strike * 100}% + 16px)`, background: C.danger, borderRadius: 4 }} />
          </div>
          <span
            style={{
              fontFamily: MONO,
              fontSize: portrait ? 20 : 22,
              fontWeight: 500,
              letterSpacing: "0.2em",
              color: C.danger,
              border: `2px solid ${C.danger}`,
              borderRadius: 8,
              padding: "6px 14px",
              opacity: interpolate(stamp, [0, 0.3], [0, 1], clamp),
              transform: `rotate(-6deg) scale(${1.4 - 0.4 * stamp})`,
            }}
          >
            NEVER
          </span>
        </div>

        {/* Concentric rings */}
        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {RINGS.map((_, i) => {
            const r = geo.r0 + i * geo.dr;
            const d = `M ${geo.cx - r} ${geo.cy} A ${r} ${r} 0 0 1 ${geo.cx + r} ${geo.cy}`;
            const p = prog(f, ringT(i), 24);
            const ghost = prog(f, 120 + i * 4, 20);
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={C.line2} strokeWidth={geo.bw} opacity={ghost * 0.6} />
                <path
                  d={d}
                  fill="none"
                  stroke={RING_COLORS[i]}
                  strokeWidth={geo.bw}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - p}
                  opacity={0.22 + 0.5 * p}
                />
                <path d={`M ${geo.cx - r - geo.bw / 2} ${geo.cy} A ${r + geo.bw / 2} ${r + geo.bw / 2} 0 0 1 ${geo.cx + r + geo.bw / 2} ${geo.cy}`} fill="none" stroke={RING_COLORS[i]} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
                <text x={geo.cx - r} y={geo.cy + 36} textAnchor="middle" fontFamily={MONO} fontSize={portrait ? 22 : 24} fill={RING_COLORS[i]} opacity={prog(f, ringT(i) + 8, 14)}>
                  {i}
                </text>
                <text x={geo.cx + r} y={geo.cy + 36} textAnchor="middle" fontFamily={MONO} fontSize={portrait ? 22 : 24} fill={RING_COLORS[i]} opacity={prog(f, ringT(i) + 8, 14)}>
                  {i}
                </text>
              </g>
            );
          })}
          <circle cx={geo.cx} cy={geo.cy} r={9} fill={C.accent} opacity={prog(f, 140, 16)} />
          <circle cx={geo.cx} cy={geo.cy} r={24} fill={C.accent} opacity={0.18 * prog(f, 140, 16)} />
        </svg>

        {/* Ring legend */}
        {RINGS.map((rg, i) => {
          const p = prog(f, ringT(i) + 4, 18);
          return (
            <div
              key={rg.tier}
              style={{
                ...rise(p, 14),
                position: "absolute",
                left: list.x,
                top: list.y + i * list.rowH,
                width: list.w,
                height: list.rowH - 14,
                display: "flex",
                alignItems: "center",
                gap: portrait ? 20 : 24,
                padding: portrait ? "0 22px" : "0 26px",
                borderRadius: 16,
                border: `1.5px solid ${C.line}`,
                borderLeft: `4px solid ${RING_COLORS[i]}`,
                background: C.surface,
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: portrait ? 17 : 18, letterSpacing: "0.14em", color: C.fg4, width: portrait ? 84 : 92, flex: "none" }}>RING {i}</span>
              <span style={{ flex: 1, fontFamily: SANS, fontWeight: 500, fontSize: portrait ? 26 : 28, color: C.fg, whiteSpace: "nowrap" }}>{rg.name}</span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: portrait ? 15 : 16,
                  letterSpacing: "0.1em",
                  color: RING_COLORS[i],
                  border: `1px solid ${RING_COLORS[i]}`,
                  borderRadius: 8,
                  padding: "4px 10px",
                  flex: "none",
                }}
              >
                {rg.tier}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 3. Twelve release gates */

const HIGHLIGHTS: Record<number, string> = {
  0: "contract certification",
  2: "replay & fault injection",
  10: "500-session load · p95 ≤ 4.0 s",
  11: "external penetration test",
};

export const ReleaseGates: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const cols = portrait ? 3 : 6;
  const gap = 20;
  const tw = (W - gap * (cols - 1)) / cols;
  const th = portrait ? 168 : 196;
  const top = portrait ? 408 : 392;
  const flipT = (i: number) => 96 + i * 10;
  const passed = Array.from({ length: 12 }).filter((_, i) => f >= flipT(i) + 7).length;
  const done = spring({ frame: f - 216, fps, config: { damping: 13 } });
  const rows = 12 / cols;
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header
          eyebrow="Mandatory release gates"
          size={[70, 72]}
          text={portrait ? "Every rollout ring is\nguarded by *release gates.*" : "Every rollout ring is guarded by *release gates.*"}
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const fp = prog(f, flipT(i), 14);
          const isPassed = fp >= 0.5;
          const hl = HIGHLIGHTS[i];
          const accentBorder = isPassed ? (hl ? C.accent : "rgba(36, 138, 61, 0.4)") : C.line;
          return (
            <div
              key={i}
              style={{
                ...rise(prog(f, 30 + i * 3, 16), 16),
                position: "absolute",
                left: pad + col * (tw + gap),
                top: top + row * (th + gap),
                width: tw,
                height: th,
              }}
            >
              <div
                style={{
                  ...card(accentBorder),
                  width: "100%",
                  height: "100%",
                  padding: portrait ? "18px 20px" : "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: `scaleX(${Math.max(0.04, Math.abs(Math.cos(Math.PI * fp)))})`,
                  background: C.surface,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: MONO, fontSize: portrait ? 17 : 18, letterSpacing: "0.1em", color: isPassed ? C.fg2 : C.fg4 }}>
                    GATE-{String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 99,
                      border: `2px solid ${isPassed ? C.signal : C.line3}`,
                      background: isPassed ? "rgba(36, 138, 61, 0.12)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isPassed && <CheckMark p={prog(f, flipT(i) + 7, 10)} size={20} />}
                  </div>
                </div>
                {hl ? (
                  <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: portrait ? 21 : 22, lineHeight: 1.25, color: isPassed ? C.fg : C.fg4 }}>{hl}</div>
                ) : (
                  <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: "0.16em", color: isPassed ? C.signal : C.fg4 }}>{isPassed ? "PASSED" : "PENDING"}</div>
                )}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: top + rows * (th + gap) + (portrait ? 26 : 36),
            display: "flex",
            alignItems: "baseline",
            justifyContent: portrait ? "flex-start" : "center",
            gap: 22,
            ...rise(prog(f, 90, 18), 14),
          }}
        >
          <span style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.04em", fontSize: portrait ? 72 : 76, lineHeight: 1, color: passed === 12 ? C.signal : C.fg }}>
            {passed}
            <span style={{ color: C.fg4 }}> / 12</span>
          </span>
          <span style={{ fontFamily: SANS, fontSize: portrait ? 28 : 32, color: C.fg2 }}>
            release gates passed
            <span style={{ color: C.signal, opacity: interpolate(done, [0, 0.4], [0, 1], clamp), marginLeft: 16 }}>· promotion unlocked</span>
          </span>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 4. Four kill switches */

const SWITCHES = [
  { t: "Global write kill switch", d: "freeze all R1–R3 writes" },
  { t: "Freeze R3 high-risk ops", d: "hold four-eyes operations" },
  { t: "Quarantine one connector", d: "isolate HRMS only" },
  { t: "Pause scheduled triggers", d: "no new scheduled runs" },
];
const CAPS = [
  { t: "R1–R3 writes", off: "HALTED" },
  { t: "R3 high-risk ops", off: "FROZEN" },
  { t: "HRMS connector", off: "QUARANTINED" },
  { t: "Scheduled triggers", off: "PAUSED" },
];
const SWITCH_T = [110, 160, 210, 256];

const Toggle: React.FC<{ on: number; scale?: number }> = ({ on, scale = 1 }) => {
  const w = 96 * scale;
  const h = 52 * scale;
  const k = 40 * scale;
  return (
    <div
      style={{
        width: w,
        height: h,
        flex: "none",
        borderRadius: 99,
        position: "relative",
        border: `2px solid ${on > 0.5 ? C.danger : C.line3}`,
        background: `rgba(215, 0, 21, ${0.14 * on})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: (h - 4 - k) / 2,
          left: 4 * scale + on * (w - 4 - k - 8 * scale),
          width: k,
          height: k,
          borderRadius: 99,
          background: on > 0.5 ? C.danger : C.fg4,
        }}
      />
    </div>
  );
};

export const KillSwitches: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const consoleBox = portrait ? { x: pad, y: 384, w: W, h: 430 } : { x: pad, y: 330, w: 880, h: 600 };
  const statusBox = portrait ? { x: pad, y: 846, w: W, h: 410 } : { x: pad + 920, y: 330, w: W - 920, h: 600 };
  const pulse = 0.5 + 0.5 * Math.sin(f / 7);
  const liveEmph = prog(f, 282, 20);
  const monoLabel: React.CSSProperties = { fontFamily: MONO, fontSize: portrait ? 16 : 17, letterSpacing: "0.16em", color: C.fg4 };
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header
          eyebrow="Runtime kill switches"
          tone={C.danger}
          size={[72, 74]}
          text={portrait ? "Four independent\n*kill switches.*" : "Four independent *kill switches.*"}
        />

        {/* Switch console */}
        <div
          style={{
            ...card(),
            ...rise(prog(f, 30, 20), 18),
            position: "absolute",
            left: consoleBox.x,
            top: consoleBox.y,
            width: consoleBox.w,
            height: consoleBox.h,
            padding: portrait ? "24px 32px" : "34px 40px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={monoLabel}>OPERATOR CONSOLE</div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", marginTop: portrait ? 8 : 14 }}>
            {SWITCHES.map((s, i) => {
              const on = prog(f, SWITCH_T[i], 10);
              return (
                <div key={s.t} style={{ display: "flex", alignItems: "center", gap: portrait ? 24 : 30, ...rise(prog(f, 40 + i * 8, 16), 12) }}>
                  <Toggle on={on} scale={portrait ? 0.86 : 1} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 28 : 31, color: on > 0.5 ? C.fg : C.fg2 }}>{s.t}</div>
                    <div style={{ fontFamily: MONO, fontSize: portrait ? 16 : 18, color: on > 0.5 ? C.danger : C.fg4, marginTop: 4 }}>{s.d}</div>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: portrait ? 14 : 15, letterSpacing: "0.14em", color: on > 0.5 ? C.danger : C.fg4 }}>{on > 0.5 ? "ON" : "OFF"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Effective posture */}
        <div
          style={{
            ...card(),
            ...rise(prog(f, 50, 20), 18),
            position: "absolute",
            left: statusBox.x,
            top: statusBox.y,
            width: statusBox.w,
            height: statusBox.h,
            padding: portrait ? "24px 32px" : "34px 40px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={monoLabel}>EFFECTIVE RUNTIME POSTURE</div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", marginTop: portrait ? 4 : 10 }}>
            {CAPS.map((c, i) => {
              const off = prog(f, SWITCH_T[i] + 6, 12);
              return (
                <div key={c.t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 1 - 0.45 * off }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 99, background: off > 0.5 ? C.fg4 : C.signal }} />
                    <span style={{ fontFamily: SANS, fontSize: portrait ? 25 : 27, color: off > 0.5 ? C.fg3 : C.fg, textDecoration: off > 0.5 ? "line-through" : "none", textDecorationColor: C.fg4 }}>{c.t}</span>
                  </div>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: portrait ? 14 : 15,
                      letterSpacing: "0.12em",
                      color: off > 0.5 ? C.danger : C.signal,
                      border: `1px solid ${off > 0.5 ? "rgba(215, 0, 21, 0.45)" : "rgba(36, 138, 61, 0.4)"}`,
                      borderRadius: 8,
                      padding: "4px 10px",
                    }}
                  >
                    {off > 0.5 ? c.off : "LIVE"}
                  </span>
                </div>
              );
            })}
            <div
              style={{
                marginTop: portrait ? 6 : 12,
                borderRadius: 16,
                border: `1.5px solid rgba(36, 138, 61, ${0.4 + 0.35 * liveEmph})`,
                background: `rgba(36, 138, 61, ${0.05 + 0.05 * liveEmph})`,
                padding: portrait ? "14px 20px" : "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ width: 14, height: 14, borderRadius: 99, background: C.signal }} />
                <span style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.025em", fontSize: portrait ? 30 : 32, color: C.fg }}>R0 knowledge answers</span>
              </div>
              <span style={{ fontFamily: MONO, fontSize: portrait ? 17 : 18, fontWeight: 500, letterSpacing: "0.16em", color: C.signal }}>LIVE</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 5. Signed bundle promotion */

const STAGES = [
  { t: "Declarative bundle", s: "v42 · versioned" },
  { t: "Dry-run diff", s: "against production" },
  { t: "Policy simulation", s: "replay suites" },
  { t: "Detached signature", s: "verified", check: true },
  { t: "Promoted", s: "to production" },
];
const STAGE_T = [40, 104, 128, 152, 182];

export const BundlePromotion: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const n = STAGES.length;
  const pos = interpolate(f, STAGE_T, [0, 1, 2, 3, 4], clamp);
  const final = spring({ frame: f - 182, fps, config: { damping: 13 } });

  // geometry
  const lgap = 36;
  const lw = (W - lgap * (n - 1)) / n;
  const box = (i: number) =>
    portrait ? { x: pad + 74, y: 404 + i * 156, w: W - 74, h: 128 } : { x: pad + i * (lw + lgap), y: 420, w: lw, h: 236 };
  const station = (i: number) => {
    const b = box(i);
    return portrait ? { x: pad + 20, y: b.y + b.h / 2 } : { x: b.x + b.w / 2, y: b.y + b.h + 64 };
  };
  const s0 = station(0);
  const sN = station(n - 1);
  const lerp = (t: number) => {
    const i = Math.min(n - 2, Math.floor(t));
    const a = station(i);
    const b = station(i + 1);
    const u = t - i;
    return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
  };
  const tok = lerp(pos);
  const trackIn = prog(f, 26, 22);
  const tokenOn = prog(f, 34, 10);

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header
          eyebrow="Signed promotion"
          size={[68, 74]}
          text={portrait ? "Configuration ships as\n*signed, versioned bundles.*" : "Configuration ships as\n*signed, versioned bundles.*"}
        />

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={s0.x} y1={s0.y} x2={s0.x + (sN.x - s0.x) * trackIn} y2={s0.y + (sN.y - s0.y) * trackIn} stroke={C.line3} strokeWidth={3} />
          <line x1={s0.x} y1={s0.y} x2={tok.x} y2={tok.y} stroke={C.accent} strokeWidth={4} opacity={tokenOn} />
          {STAGES.map((_, i) => {
            const st = station(i);
            const lit = pos >= i - 0.02 && f >= STAGE_T[0];
            return (
              <g key={i} opacity={trackIn}>
                <circle cx={st.x} cy={st.y} r={12} fill={lit ? (i === n - 1 ? C.signal : C.accent) : C.bg} stroke={lit ? (i === n - 1 ? C.signal : C.accent) : C.line3} strokeWidth={3} />
              </g>
            );
          })}
          <g opacity={tokenOn}>
            <circle cx={tok.x} cy={tok.y} r={26} fill={C.accent} opacity={0.18} />
            <circle cx={tok.x} cy={tok.y} r={11} fill={C.accent2} />
          </g>
        </svg>

        {STAGES.map((s, i) => {
          const b = box(i);
          const lit = pos >= i - 0.02 && f >= STAGE_T[0];
          const isFinal = i === n - 1;
          const tone = isFinal ? C.signal : C.accent;
          const litP = prog(f, STAGE_T[i], 12);
          return (
            <div
              key={s.t}
              style={{
                ...card(lit ? (isFinal ? "rgba(36, 138, 61, 0.5)" : "rgba(0, 113, 227, 0.45)") : C.line),
                ...rise(prog(f, 18 + i * 7, 16), 16),
                position: "absolute",
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                padding: portrait ? "0 30px" : "28px 26px",
                display: "flex",
                flexDirection: portrait ? "row" : "column",
                alignItems: portrait ? "center" : "flex-start",
                justifyContent: portrait ? "flex-start" : "space-between",
                gap: portrait ? 26 : 0,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  flex: "none",
                  borderRadius: 99,
                  border: `2px solid ${lit ? tone : C.line3}`,
                  background: lit ? `rgba(${isFinal ? "36, 138, 61" : "0, 113, 227"}, ${0.12 * litP})` : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontSize: 18,
                  color: lit ? tone : C.fg4,
                }}
              >
                {s.check ? <CheckMark p={prog(f, STAGE_T[i] + 4, 14)} size={28} color={C.accent} /> : `0${i + 1}`}
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 30 : 28, lineHeight: 1.15, color: lit ? C.fg : C.fg3 }}>{s.t}</div>
                <div style={{ fontFamily: MONO, fontSize: portrait ? 17 : 17, color: lit ? tone : C.fg4, marginTop: 6 }}>{s.s}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 6. The series thesis */

const PARTS = ["Paradigm shift", "Trust gap", "Universal layer", "Intent to action", "Least privilege", "Risk & approvals", "Traceability", "Rollout"];

export const Thesis: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const strike = prog(f, 118, 16);
  const lineSize = portrait ? 76 : 92;
  const dotT = (i: number) => 150 + i * 15;
  const recapTop = portrait ? 1094 : 892;
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill style={{ padding: `0 ${pad}px`, paddingBottom: portrait ? 200 : 150, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <Eyebrow start={4} center>
          The series thesis
        </Eyebrow>
        <div style={{ marginTop: 30, fontFamily: SANS, fontSize: portrait ? 32 : 34, color: C.fg3, ...rise(prog(f, 14, 18)) }}>The future of enterprise AI is</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 10, ...rise(prog(f, 76, 18)) }}>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: portrait ? 78 : 88, letterSpacing: "-0.035em", color: strike < 0.5 ? C.fg : C.fg3 }}>
            not more access.
          </span>
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "54%",
              height: 6,
              width: `calc(${strike * 100}% + 20px)`,
              background: C.danger,
              borderRadius: 6,
            }}
          />
        </div>
        <div style={{ marginTop: portrait ? 34 : 30 }}>
          <Headline start={148} center size={lineSize} lineHeight={1.12} text="The right *capabilities.*" />
          <Headline start={202} center size={lineSize} lineHeight={1.12} text="Within the right *boundaries.*" />
          <Headline start={252} center size={lineSize} lineHeight={1.12} text="Under the right *governance.*" />
        </div>
      </AbsoluteFill>

      {/* Eight-part recap */}
      <div
        style={{
          position: "absolute",
          left: pad,
          top: recapTop,
          width: W,
          display: "grid",
          gridTemplateColumns: `repeat(${portrait ? 4 : 8}, 1fr)`,
          rowGap: 26,
          ...rise(prog(f, 140, 18), 12),
        }}
      >
        {PARTS.map((p, i) => {
          const on = prog(f, dotT(i), 12);
          const last = i === PARTS.length - 1;
          return (
            <div key={p} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: last ? 40 : 14,
                  height: 14,
                  borderRadius: 99,
                  background: on > 0.5 ? C.accent : C.line3,
                }}
              />
              <span style={{ fontFamily: MONO, fontSize: portrait ? 14 : 15, letterSpacing: "0.08em", textTransform: "uppercase", color: on > 0.5 ? C.fg2 : C.fg4, whiteSpace: "nowrap" }}>
                <span style={{ color: on > 0.5 ? C.accent : C.fg4 }}>{i + 1}</span> {p}
              </span>
            </div>
          );
        })}
      </div>
    </SceneWrap>
  );
};
