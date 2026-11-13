import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
import { DrawPath, Eyebrow, Headline, Particles, Pt, SceneWrap, card, clamp, pathD, prog, rise, useLayout, useSceneFrame } from "../primitives";

/* ------------------------------------------------------------------ shared bits */

const tint = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const R1C = "#aac7a1"; // signal → accent
const R3C = "#e4a581"; // accent → danger

const TIERS = [
  { id: "R0", name: "Conversational", short: "Autonomous", gate: "autonomous · no footprint", color: C.signal },
  { id: "R1", name: "Governed read-only", short: "Under policy", gate: "autonomous under policy", color: R1C },
  { id: "R2", name: "Reversible low-impact write", short: "User confirms", gate: "user confirms the exact payload", color: C.accent },
  { id: "R3", name: "Sensitive · financial · irreversible", short: "Four-eyes + MFA", gate: "four-eyes approval + step-up MFA", color: R3C },
  { id: "R4", name: "Prohibited for the model", short: "Never", gate: "never executed by the model", color: C.danger },
];

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

const Check: React.FC<{ p: number; size?: number; color?: string }> = ({ p, size = 52, color = C.signal }) => (
  <div
    style={{
      width: size,
      height: size,
      flex: "none",
      borderRadius: 99,
      border: `2px solid ${p > 0.02 ? color : C.line3}`,
      background: tint(color, 0.22 * p),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 26 26">
      <path d="M5 13.5 L11 19 L21 7" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  </div>
);

const Avatar: React.FC<{ cx: number; cy: number; r: number; initials: string; color: string; p: number; dim?: number }> = ({ cx, cy, r, initials, color, p, dim = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: cx - r,
      top: cy - r,
      width: r * 2,
      height: r * 2,
      borderRadius: 999,
      border: `2.5px solid ${color}`,
      background: `radial-gradient(circle at 50% 35%, ${tint(color, 0.28)}, rgba(15,21,37,0.95) 72%)`,
      boxShadow: `0 0 ${40 * p}px -6px ${tint(color, 0.55)}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SERIF,
      fontSize: r * 0.78,
      color,
      opacity: p * (1 - dim),
      transform: `scale(${0.85 + 0.15 * p})`,
    }}
  >
    {initials}
  </div>
);

/* ------------------------------------------------------------------ 1. The confirm button on everything */

const MODALS = ["read dashboard", "summarize thread", "run diagnostic", "create draft", "look up policy", "update leave request", "change payroll"];

export const ConfirmEverything: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, pad } = useLayout();
  const m = portrait ? { w: 640, h: 196, dx: 40, dy: 92, x: 100, y: 410 } : { w: 500, h: 206, dx: 160, dy: 52, x: 230, y: 350 };
  const t0 = (i: number) => 28 + i * 15;
  const shown = MODALS.filter((_, j) => f >= t0(j)).length;
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="The default fix" size={[80, 76]} text={portrait ? "Put a *confirm button*\non everything." : "Put a *confirm button* on everything."} />
        {MODALS.map((a, i) => {
          const s = spring({ frame: f - t0(i), fps, config: { damping: 15, stiffness: 150 } });
          const depth = Math.max(0, shown - 1 - i);
          const last = i === MODALS.length - 1;
          return (
            <div
              key={a}
              style={{
                ...card(last ? "rgba(240,144,127,0.45)" : C.line3),
                position: "absolute",
                left: m.x + i * m.dx,
                top: m.y + i * m.dy,
                width: m.w,
                height: m.h,
                padding: "22px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: Math.min(1, s * 1.4) * (1 - Math.min(0.5, depth * 0.08)),
                transform: `translateY(${(1 - s) * 34}px) scale(${0.94 + 0.06 * s})`,
                transformOrigin: "50% 0%",
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: portrait ? 16 : 15, letterSpacing: "0.14em", textTransform: "uppercase", color: last ? C.danger : C.fg4 }}>
                action · {a}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: portrait ? 40 : 38, color: C.fg, lineHeight: 1 }}>Are you sure?</div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 14 }}>
                <span style={{ fontFamily: SANS, fontSize: 19, color: C.fg3, padding: "9px 20px", borderRadius: 10, border: `1px solid ${C.line2}` }}>Cancel</span>
                <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 19, color: C.bg, padding: "9px 24px", borderRadius: 10, background: C.accent }}>Confirm</span>
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: portrait ? 1196 : 912,
            fontFamily: SANS,
            fontSize: portrait ? 30 : 32,
            color: C.fg2,
            textAlign: "center",
            ...rise(prog(f, 140, 18)),
          }}
        >
          The same dialog for a dashboard read <span style={{ color: C.danger }}>and a payroll change.</span>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 2. It fails twice */

export const TwoFailures: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const A = portrait ? { x: pad, y: 330, w: W, h: 430 } : { x: pad, y: 340, w: (W - 40) / 2, h: 600 };
  const B = portrait ? { x: pad, y: 790, w: W, h: 440 } : { x: pad + (W - 40) / 2 + 40, y: 340, w: (W - 40) / 2, h: 600 };
  const cStart = 48;
  const cEnd = 132;
  const count = Math.round(interpolate(f, [cStart, cEnd], [0, 20], clamp));
  const k = (f - cStart) / ((cEnd - cStart) / 20);
  const pressing = f >= cStart && f <= cEnd + 2 && ((k % 1) + 1) % 1 < 0.35;
  const neq = spring({ frame: f - 246, fps, config: { damping: 11, stiffness: 140 } });
  const cardTitle = (n: string, t: string) => (
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 32 : 34, color: C.fg }}>
      <span style={{ fontFamily: MONO, fontSize: 18, color: C.danger, marginRight: 14 }}>{n}</span>
      {t}
    </div>
  );
  const person = (initials: string, color: string, label: string, sub: string, p: number) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...rise(p, 14), width: portrait ? 260 : 250 }}>
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 99,
          border: `2.5px solid ${color}`,
          background: `radial-gradient(circle at 50% 35%, ${tint(color, 0.28)}, rgba(15,21,37,0.95) 72%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SERIF,
          fontSize: 40,
          color,
        }}
      >
        {initials}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: C.fg }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 16, color: C.fg3, marginTop: -4 }}>{sub}</div>
    </div>
  );
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Why it breaks" tone={C.danger} size={[84, 80]} text="It fails *twice.*" />

        {/* A — approval fatigue */}
        <div
          style={{
            ...card(),
            ...rise(prog(f, 34, 18), 18),
            position: "absolute",
            left: A.x,
            top: A.y,
            width: A.w,
            height: A.h,
            padding: portrait ? "28px 34px" : "34px 38px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: `3px solid ${C.danger}`,
          }}
        >
          {cardTitle("01", "Approval fatigue")}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: portrait ? 150 : 170, lineHeight: 0.9, color: count >= 20 ? C.danger : C.fg, fontVariantNumeric: "tabular-nums" }}>{count}</div>
              <div style={{ fontFamily: MONO, fontSize: portrait ? 19 : 20, letterSpacing: "0.12em", textTransform: "uppercase", color: C.fg3, marginTop: 10 }}>approvals today</div>
            </div>
            <div style={{ position: "relative", ...rise(prog(f, 42, 16), 14) }}>
              <div style={{ ...card(C.line3), width: portrait ? 340 : 320, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ fontFamily: SERIF, fontSize: 30, color: C.fg }}>Are you sure?</div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span
                    style={{
                      fontFamily: SANS,
                      fontWeight: 600,
                      fontSize: 19,
                      color: C.bg,
                      padding: "9px 24px",
                      borderRadius: 10,
                      background: pressing ? C.accent2 : C.accent,
                      boxShadow: pressing ? "0 0 26px rgba(216,187,132,0.8)" : "none",
                    }}
                  >
                    Confirm
                  </span>
                </div>
              </div>
              <svg
                width="40"
                height="48"
                viewBox="0 0 40 48"
                style={{ position: "absolute", right: 22, bottom: -16, transform: `scale(${pressing ? 0.84 : 1})`, transformOrigin: "0 0", opacity: prog(f, 44, 10) }}
              >
                <path d="M4 3 L4 38 L13 29 L20 44 L27 41 L20 26 L33 26 Z" fill={C.fg} stroke={C.bg} strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", ...rise(prog(f, 120, 18), 12) }}>
            <span style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.08em", color: C.danger, padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(240,144,127,0.45)" }}>
              the cookie-banner effect
            </span>
            <span style={{ fontFamily: SANS, fontSize: portrait ? 21 : 22, color: C.fg3 }}>clicked by habit, never read</span>
          </div>
        </div>

        {/* B — the authority fallacy */}
        <div
          style={{
            ...card(),
            ...rise(prog(f, 136, 18), 18),
            position: "absolute",
            left: B.x,
            top: B.y,
            width: B.w,
            height: B.h,
            padding: portrait ? "28px 34px" : "34px 38px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: `3px solid ${C.danger}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {cardTitle("02", "The authority fallacy")}
            {portrait && (
              <span style={{ fontFamily: MONO, fontSize: 17, color: R3C, padding: "6px 14px", borderRadius: 999, border: `1px solid ${tint(R3C, 0.5)}`, ...rise(prog(f, 150, 14), 10) }}>
                payroll change · R3
              </span>
            )}
          </div>
          {!portrait && (
            <div style={{ display: "flex", justifyContent: "center", ...rise(prog(f, 150, 14), 10) }}>
              <span style={{ fontFamily: MONO, fontSize: 19, color: R3C, padding: "8px 18px", borderRadius: 999, border: `1px solid ${tint(R3C, 0.5)}` }}>payroll change · R3</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: portrait ? 30 : 10 }}>
            {person("R", C.blue, "Requester", "typed the prompt", prog(f, 160, 16))}
            <div style={{ width: 120, height: 100, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", opacity: prog(f, 176, 14) }}>
              <span style={{ position: "absolute", fontFamily: SERIF, fontSize: 84, color: C.fg3, opacity: 1 - neq }}>=?</span>
              <span style={{ position: "absolute", fontFamily: SERIF, fontSize: 104, color: C.danger, opacity: neq, transform: `scale(${0.6 + 0.4 * neq})`, textShadow: "0 0 30px rgba(240,144,127,0.6)" }}>≠</span>
            </div>
            {person("A", C.signal, "Approver", "holds the authority", prog(f, 188, 16))}
          </div>
          <div style={{ fontFamily: SANS, fontSize: portrait ? 25 : 26, color: C.fg2, textAlign: "center", ...rise(prog(f, 262, 18), 12) }}>
            User confirmation <span style={{ color: C.danger }}>≠</span> organizational authorization.
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 3. Friction follows blast radius */

export const BlastRadius: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, height, pad } = useLayout();
  const W = width - pad * 2;
  const g = portrait ? { cx: 540, cy: 612, step: 44 } : { cx: 420, cy: 652, step: 60 };
  const radii = TIERS.map((_, i) => g.step * (i + 1));
  const tStart = (i: number) => 96 + i * 26;
  const list = portrait ? { x: pad, y: 874, w: W, rowH: 74, h: 64 } : { x: 860, y: 362, w: width - pad - 860, rowH: 120, h: 104 };
  const waveP = f > 250 ? (((f - 250) / 64) % 1 + 1) % 1 : -1;
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Risk-proportional friction" size={[78, 74]} text={portrait ? "Friction should follow\n*blast radius.*" : "Friction should follow *blast radius.*"} />

        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <pattern id="p6hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="14" stroke={C.danger} strokeWidth="3" opacity="0.22" />
            </pattern>
          </defs>
          {[...TIERS].reverse().map((t) => {
            const i = TIERS.indexOf(t);
            const s = spring({ frame: f - tStart(i), fps, config: { damping: 16, stiffness: 110 } });
            const r = radii[i] * (0.55 + 0.45 * s);
            const isR4 = i === 4;
            return (
              <g key={t.id} opacity={Math.min(1, s * 1.3)}>
                <circle cx={g.cx} cy={g.cy} r={r} fill={C.bg2} />
                <circle cx={g.cx} cy={g.cy} r={r} fill={tint(t.color, isR4 ? 0.07 : 0.12)} stroke={t.color} strokeWidth={isR4 ? 2.5 : 2} strokeDasharray={isR4 ? "10 8" : undefined} />
                {isR4 && <circle cx={g.cx} cy={g.cy} r={r} fill="url(#p6hatch)" />}
              </g>
            );
          })}
          {waveP >= 0 && (
            <circle cx={g.cx} cy={g.cy} r={radii[0] + (radii[4] - radii[0]) * waveP} fill="none" stroke={C.accent} strokeWidth={3} opacity={0.55 * (1 - waveP)} />
          )}
          {TIERS.map((t, i) => {
            const y = i === 0 ? g.cy : g.cy - (radii[i] + radii[i - 1]) / 2;
            return (
              <text
                key={t.id}
                x={g.cx}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={MONO}
                fontWeight={500}
                fontSize={portrait ? (i === 0 ? 22 : 19) : i === 0 ? 26 : 23}
                fill={t.color}
                opacity={prog(f, tStart(i) + 6, 14)}
              >
                {t.id}
              </text>
            );
          })}
          {portrait && (
            <g opacity={prog(f, 220, 18)}>
              <line x1={g.cx + radii[0]} y1={g.cy} x2={g.cx + radii[4] + 120} y2={g.cy} stroke={C.fg3} strokeWidth={1.5} strokeDasharray="4 6" />
              <path d={`M ${g.cx + radii[4] + 120} ${g.cy} l -12 -7 v 14 z`} fill={C.fg3} />
              <text x={g.cx + radii[4] + 120} y={g.cy + 30} textAnchor="end" fontFamily={MONO} fontSize={16} letterSpacing="2.4" fill={C.fg3}>
                BLAST RADIUS
              </text>
            </g>
          )}
          {!portrait && (
            <g opacity={prog(f, 220, 18)}>
              <text x={g.cx} y={g.cy + radii[4] + 36} textAnchor="middle" fontFamily={MONO} fontSize={17} letterSpacing="3" fill={C.fg3}>
                BLAST RADIUS →
              </text>
            </g>
          )}
        </svg>

        {TIERS.map((t, i) => {
          const p = prog(f, tStart(i) + 4, 18);
          return (
            <div
              key={t.id}
              style={{
                ...rise(p, 14),
                position: "absolute",
                left: list.x,
                top: list.y + i * list.rowH,
                width: list.w,
                height: list.h,
                display: "flex",
                alignItems: "center",
                gap: portrait ? 22 : 26,
                padding: portrait ? "0 22px" : "0 28px",
                borderRadius: 16,
                border: `1.5px solid ${tint(t.color, 0.32)}`,
                background: `linear-gradient(90deg, ${tint(t.color, 0.1)}, rgba(17,24,42,0.9) 45%)`,
              }}
            >
              <div
                style={{
                  width: portrait ? 58 : 66,
                  height: portrait ? 40 : 46,
                  flex: "none",
                  borderRadius: 10,
                  background: t.color,
                  color: C.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontWeight: 500,
                  fontSize: portrait ? 20 : 23,
                }}
              >
                {t.id}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 24 : 28, color: C.fg, whiteSpace: "nowrap" }}>{t.name}</div>
                <div style={{ fontFamily: MONO, fontSize: portrait ? 17 : 19, color: t.color, marginTop: portrait ? 2 : 6, whiteSpace: "nowrap" }}>{t.gate}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 4. Context escalates the tier */

const TRIGGERS = [
  { label: "Restricted data", sub: "data classification", to: 2, at: 74 },
  { label: "Targets > 10 records", sub: "bulk scope", to: 2, at: 122 },
  { label: "Irreversible change", sub: "no safe idempotency", to: 3, at: 212 },
];

export const Escalation: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const L = portrait
    ? {
        req: { x: pad, y: 410, w: W, h: 134 },
        trig: { x: pad, y: 590, w: 540, rowH: 140, h: 120 },
        lad: { x: pad + 580, y: 590, w: W - 580, rowH: 82, h: 70 },
        badge: { x: pad, y: 1050, w: W, h: 136 },
      }
    : {
        req: { x: pad, y: 360, w: 900, h: 150 },
        trig: { x: pad, y: 540, w: 900, rowH: 110, h: 92 },
        lad: { x: 1090, y: 360, w: width - pad - 1090, rowH: 100, h: 86 },
        badge: { x: pad, y: 884, w: W, h: 84 },
      };
  // Effective tier: max(base, triggers fired so far) — animated between integer levels.
  const lvl = 1 + prog(f, TRIGGERS[0].at + 6, 18) * 1 + prog(f, TRIGGERS[2].at + 6, 18) * 1;
  const lvlInt = Math.round(lvl);
  const rungTop = (tier: number) => L.lad.y + (4 - tier) * L.lad.rowH;
  const markerTop = interpolate(lvl, [0, 4], [rungTop(0), rungTop(4)]);
  const cur = TIERS[lvlInt];
  const badgeS = spring({ frame: f - 258, fps, config: { damping: 13 } });
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Runtime escalation" size={[78, 76]} text={portrait ? "Context *escalates*\nthe tier." : "Context *escalates* the tier."} />

        {/* request card */}
        <div
          style={{
            ...card(tint(cur.color, 0.5)),
            ...rise(prog(f, 26, 18), 16),
            position: "absolute",
            left: L.req.x,
            top: L.req.y,
            width: L.req.w,
            height: L.req.h,
            padding: portrait ? "0 30px" : "0 34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontFamily: MONO, fontSize: portrait ? 16 : 17, letterSpacing: "0.14em", color: C.fg4 }}>PROPOSED ACTION</div>
            <div style={{ fontFamily: SERIF, fontSize: portrait ? 36 : 40, color: C.fg, marginTop: 8 }}>
              Base tier <span style={{ fontFamily: MONO, fontSize: portrait ? 30 : 34, color: R1C }}>R1</span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: portrait ? 15 : 16, color: C.fg3, marginTop: 6 }}>from its certified contract</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: MONO, fontSize: portrait ? 16 : 17, letterSpacing: "0.14em", color: C.fg4 }}>EFFECTIVE</div>
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: portrait ? 62 : 68, lineHeight: 1, color: cur.color, marginTop: 6, textShadow: `0 0 30px ${tint(cur.color, 0.5)}` }}>{cur.id}</div>
          </div>
        </div>

        {/* triggers */}
        {TRIGGERS.map((t, i) => {
          const appear = prog(f, 40 + i * 10, 16);
          const lit = prog(f, t.at, 14);
          const col = TIERS[t.to].color;
          return (
            <div
              key={t.label}
              style={{
                ...rise(appear, 14),
                position: "absolute",
                left: L.trig.x,
                top: L.trig.y + i * L.trig.rowH,
                width: L.trig.w,
                height: L.trig.h,
                borderRadius: 18,
                border: `1.5px solid ${lit > 0.5 ? tint(col, 0.6) : C.line2}`,
                background: lit > 0.02 ? `linear-gradient(90deg, ${tint(col, 0.14 * lit)}, rgba(17,24,42,0.9) 60%)` : "rgba(17,24,42,0.7)",
                boxShadow: lit > 0.5 ? `0 0 ${36 * lit}px -12px ${tint(col, 0.7)}` : "none",
                padding: portrait ? "0 24px" : "0 30px",
                display: "flex",
                alignItems: "center",
                gap: portrait ? 18 : 24,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  flex: "none",
                  borderRadius: 99,
                  background: lit > 0.5 ? col : "transparent",
                  border: `2px solid ${lit > 0.5 ? col : C.line3}`,
                  boxShadow: lit > 0.5 ? `0 0 16px ${col}` : "none",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 26 : 29, color: lit > 0.5 ? C.fg : C.fg3, whiteSpace: "nowrap" }}>{t.label}</div>
                <div style={{ fontFamily: MONO, fontSize: portrait ? 16 : 17, color: C.fg4, marginTop: 4 }}>{t.sub}</div>
              </div>
              <span
                style={{
                  fontFamily: MONO,
                  fontWeight: 500,
                  fontSize: portrait ? 22 : 24,
                  color: col,
                  padding: "6px 14px",
                  borderRadius: 10,
                  border: `1.5px solid ${tint(col, 0.55)}`,
                  opacity: lit,
                  transform: `translateX(${(1 - lit) * -14}px)`,
                  whiteSpace: "nowrap",
                }}
              >
                ⇒ {TIERS[t.to].id}
              </span>
            </div>
          );
        })}

        {/* ladder */}
        <div style={{ position: "absolute", left: L.lad.x, top: L.lad.y, width: L.lad.w, ...rise(prog(f, 34, 18), 14) }}>
          {[4, 3, 2, 1, 0].map((ti) => {
            const t = TIERS[ti];
            const on = ti === lvlInt;
            return (
              <div
                key={t.id}
                style={{
                  position: "absolute",
                  left: 0,
                  top: rungTop(ti) - L.lad.y,
                  width: L.lad.w,
                  height: L.lad.h,
                  borderRadius: 14,
                  border: `1px solid ${C.line2}`,
                  background: "rgba(17,24,42,0.6)",
                  display: "flex",
                  alignItems: "center",
                  gap: portrait ? 16 : 22,
                  padding: portrait ? "0 16px" : "0 24px",
                  opacity: on ? 1 : 0.62,
                }}
              >
                <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: portrait ? 22 : 26, color: t.color, width: portrait ? 40 : 48 }}>{t.id}</span>
                <span style={{ fontFamily: SANS, fontSize: portrait ? 21 : 25, color: on ? C.fg : C.fg3, whiteSpace: "nowrap" }}>{portrait ? t.short : t.gate}</span>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: -8,
              top: markerTop - L.lad.y - 6,
              width: L.lad.w + 16,
              height: L.lad.h + 12,
              borderRadius: 18,
              border: `2.5px solid ${cur.color}`,
              boxShadow: `0 0 36px -6px ${tint(cur.color, 0.7)}, inset 0 0 24px -10px ${tint(cur.color, 0.6)}`,
              opacity: prog(f, 40, 16),
            }}
          />
        </div>

        {/* rule badge */}
        <div
          style={{
            ...card(tint(C.accent, 0.55)),
            position: "absolute",
            left: L.badge.x,
            top: L.badge.y,
            width: L.badge.w,
            height: L.badge.h,
            display: "flex",
            flexDirection: portrait ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: portrait ? 10 : 34,
            opacity: interpolate(badgeS, [0, 0.4], [0, 1], clamp),
            transform: `scale(${0.92 + 0.08 * badgeS})`,
          }}
        >
          <span style={{ fontFamily: SERIF, fontSize: portrait ? 44 : 42, color: C.fg }}>
            Most-restrictive <span style={{ fontStyle: "italic", color: C.accent }}>wins.</span>
          </span>
          <span style={{ fontFamily: MONO, fontSize: portrait ? 22 : 24, color: C.fg2 }}>
            max(<span style={{ color: R1C }}>R1</span>, <span style={{ color: C.accent }}>R2</span>, <span style={{ color: C.accent }}>R2</span>,{" "}
            <span style={{ color: R3C }}>R3</span>) = <span style={{ color: R3C }}>R3</span>
          </span>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 5. Approval as a cryptographic commitment */

const BINDINGS = [
  { t: "Deterministic preview", d: ["rendered from ", "resolvedInput", " · never an LLM summary"], at: 100 },
  { t: "Plan hash", d: ["", "planHash", "  sha256:9f2c…e41a"], at: 150 },
  { t: "Single-use nonce", d: ["", "confirmationNonce", " · single use · 15 min TTL"], at: 198 },
  { t: "Step-up MFA", d: ["fresh second factor · ", "≤ 5 min", " old"], at: 250 },
];

const Padlock: React.FC<{ lock: number; size: number }> = ({ lock, size }) => {
  const col = lock > 0.5 ? C.signal : C.fg3;
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 140 168" style={{ overflow: "visible" }}>
      <circle cx="70" cy="104" r={88} fill="none" stroke={C.signal} strokeWidth="2" opacity={0.5 * lock} />
      <circle cx="70" cy="104" r={100 + 14 * lock} fill="none" stroke={C.signal} strokeWidth="1.2" opacity={0.25 * lock} strokeDasharray="3 7" />
      <g transform={`translate(0 ${(1 - lock) * -26})`}>
        <path d="M 38 82 V 52 a 32 32 0 0 1 64 0 V 82" fill="none" stroke={col} strokeWidth="12" strokeLinecap="round" />
      </g>
      <rect x="16" y="76" width="108" height="88" rx="18" fill={C.surface2} stroke={col} strokeWidth="3" />
      <rect x="16" y="76" width="108" height="88" rx="18" fill={C.signal} opacity={0.14 * lock} />
      <circle cx="70" cy="112" r="11" fill={col} />
      <rect x="65" y="114" width="10" height="26" rx="4" fill={col} />
    </svg>
  );
};

export const Bindings: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const lock = spring({ frame: f - 282, fps, config: { damping: 12, stiffness: 160 } });
  const cardBox = portrait ? { x: pad, y: 390, w: W, h: 630 } : { x: pad, y: 350, w: 1080, h: 600 };
  const rowH = portrait ? 132 : 122;
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Hash-bound approval" size={[72, 74]} text={portrait ? "An approval is a\n*cryptographic commitment.*" : "An approval is a *cryptographic commitment.*"} />

        <div
          style={{
            ...card(lock > 0.5 ? "rgba(125,211,191,0.55)" : C.line2),
            ...rise(prog(f, 30, 20), 18),
            position: "absolute",
            left: cardBox.x,
            top: cardBox.y,
            width: cardBox.w,
            height: cardBox.h,
            padding: portrait ? "26px 34px" : "28px 40px",
            boxShadow: lock > 0.5 ? `0 0 ${70 * lock}px -20px rgba(125,211,191,0.6)` : card().boxShadow,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 18, borderBottom: `1px solid ${C.line2}` }}>
            <span style={{ fontFamily: MONO, fontSize: portrait ? 17 : 18, letterSpacing: "0.14em", color: C.fg4 }}>APPROVAL CHALLENGE · R2 / R3</span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: portrait ? 17 : 18,
                letterSpacing: "0.14em",
                padding: "6px 14px",
                borderRadius: 999,
                color: lock > 0.5 ? C.signal : C.fg4,
                border: `1px solid ${lock > 0.5 ? "rgba(125,211,191,0.6)" : C.line3}`,
                transform: `scale(${1 + 0.12 * Math.sin(Math.PI * Math.min(1, lock))})`,
              }}
            >
              {lock > 0.5 ? "BOUND" : "UNBOUND"}
            </span>
          </div>
          {BINDINGS.map((b, i) => {
            const p = prog(f, b.at, 18);
            const ck = prog(f, b.at + 12, 14);
            return (
              <div key={b.t} style={{ ...rise(p, 14), height: rowH, display: "flex", alignItems: "center", gap: portrait ? 24 : 28, borderBottom: i < 3 ? `1px solid ${C.line}` : "none" }}>
                <Check p={ck} size={portrait ? 50 : 54} />
                <div>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 29 : 31, color: C.fg }}>
                    <span style={{ fontFamily: MONO, fontSize: 17, color: C.accent, marginRight: 14 }}>0{i + 1}</span>
                    {b.t}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: portrait ? 18 : 20, color: C.fg3, marginTop: 8, whiteSpace: "nowrap" }}>
                    {b.d[0]}
                    <span style={{ color: C.accent }}>{b.d[1]}</span>
                    {b.d[2]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {portrait ? (
          <div style={{ position: "absolute", left: pad, right: pad, top: 1064, display: "flex", alignItems: "center", justifyContent: "center", gap: 46, opacity: prog(f, 60, 20) }}>
            <Padlock lock={lock} size={118} />
            <div style={{ fontFamily: SERIF, fontSize: 52, lineHeight: 1.08, color: C.fg, ...rise(prog(f, 288, 18), 12) }}>
              Bound to one
              <br />
              <span style={{ fontStyle: "italic", color: C.signal }}>exact payload.</span>
            </div>
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              left: cardBox.x + cardBox.w + 40,
              right: pad,
              top: 380,
              height: 560,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 70,
              opacity: prog(f, 60, 20),
            }}
          >
            <Padlock lock={lock} size={170} />
            <div style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1.08, color: C.fg, textAlign: "center", ...rise(prog(f, 288, 18), 12) }}>
              Bound to one
              <br />
              <span style={{ fontStyle: "italic", color: C.signal }}>exact payload.</span>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 6. Four eyes */

export const FourEyes: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, height, pad } = useLayout();
  const G = portrait
    ? {
        req: { x: 170, y: 500 },
        apr: { x: 910, y: 500 },
        r: 62,
        card: { x: 330, y: 392, w: 420, h: 216 },
        btn: { x: 380, y: 830, w: 320, h: 66 },
        chipY: 930,
        finalY: 1050,
        labelY: 580,
      }
    : {
        req: { x: 330, y: 482 },
        apr: { x: 1590, y: 482 },
        r: 74,
        card: { x: 700, y: 362, w: 520, h: 240 },
        btn: { x: 800, y: 690, w: 320, h: 66 },
        chipY: 784,
        finalY: 872,
        labelY: 574,
      };
  const bc = { x: G.btn.x + G.btn.w / 2, y: G.btn.y + G.btn.h / 2 };
  const reqPath: [Pt, Pt, Pt, Pt] = portrait
    ? [{ x: G.req.x, y: 700 }, { x: G.req.x, y: bc.y }, { x: G.btn.x - 110, y: bc.y }, { x: G.btn.x, y: bc.y }]
    : [{ x: G.req.x + G.r * 0.9, y: G.req.y + G.r * 0.45 }, { x: 520, y: 540 }, { x: 640, y: bc.y }, { x: G.btn.x, y: bc.y }];
  const aprPath: [Pt, Pt, Pt, Pt] = portrait
    ? [{ x: G.apr.x, y: 700 }, { x: G.apr.x, y: bc.y }, { x: G.btn.x + G.btn.w + 110, y: bc.y }, { x: G.btn.x + G.btn.w, y: bc.y }]
    : [{ x: G.apr.x - G.r * 0.9, y: G.apr.y + G.r * 0.45 }, { x: 1400, y: 540 }, { x: 1280, y: bc.y }, { x: G.btn.x + G.btn.w, y: bc.y }];
  const xAt = (pts: [Pt, Pt, Pt, Pt], t: number) => {
    const u = 1 - t;
    return {
      x: u * u * u * pts[0].x + 3 * u * u * t * pts[1].x + 3 * u * t * t * pts[2].x + t * t * t * pts[3].x,
      y: u * u * u * pts[0].y + 3 * u * u * t * pts[1].y + 3 * u * t * t * pts[2].y + t * t * t * pts[3].y,
    };
  };
  const blockT = 0.62;
  const bx = xAt(reqPath, blockT);
  const aMid = xAt(aprPath, 0.45);
  const reqDraw = prog(f, 112, 22) * blockT;
  const xS = spring({ frame: f - 136, fps, config: { damping: 11, stiffness: 170 } });
  const aprDraw = prog(f, 166, 22);
  const okS = spring({ frame: f - 186, fps, config: { damping: 12 } });
  const reqIn = prog(f, 48, 18);
  const aprIn = prog(f, 92, 18);
  const lineY = portrait ? G.req.y : G.req.y;
  const label = (cx: number, title: string, sub: string, p: number) => (
    <div style={{ position: "absolute", left: cx - 160, width: 320, top: G.labelY + (portrait ? 0 : 6), textAlign: "center", ...rise(p, 12) }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 24 : 28, color: C.fg, lineHeight: 1.15, whiteSpace: "pre-line" }}>{title}</div>
      <div style={{ fontFamily: MONO, fontSize: portrait ? 15 : 17, color: C.fg3, marginTop: 6 }}>{sub}</div>
    </div>
  );
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Segregation of duties" size={[72, 72]} text={portrait ? "The requester is never\nthe *final approver.*" : "The requester is never the *final approver.*"} />

        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* requester → payload */}
          <DrawPath d={`M ${G.req.x + G.r} ${lineY} L ${G.card.x} ${lineY}`} p={prog(f, 62, 18)} color={C.blue} width={2.5} />
          <Particles pts={[{ x: G.req.x + G.r, y: lineY }, { x: G.req.x + G.r + 20, y: lineY }, { x: G.card.x - 20, y: lineY }, { x: G.card.x, y: lineY }]} frame={f} start={76} color={C.blue} count={2} period={40} r={4} />
          {/* approver → payload */}
          <DrawPath d={`M ${G.apr.x - G.r} ${lineY} L ${G.card.x + G.card.w} ${lineY}`} p={prog(f, 104, 18)} color={C.signal} width={2.5} />
          <Particles
            pts={[{ x: G.apr.x - G.r, y: lineY }, { x: G.apr.x - G.r - 20, y: lineY }, { x: G.card.x + G.card.w + 20, y: lineY }, { x: G.card.x + G.card.w, y: lineY }]}
            frame={f}
            start={118}
            color={C.signal}
            count={2}
            period={40}
            r={4}
          />
          {/* payload → final approval */}
          <DrawPath d={`M ${bc.x} ${G.card.y + G.card.h} L ${bc.x} ${G.btn.y}`} p={prog(f, 100, 16)} color={C.fg4} width={2} />
          {/* requester attempts final approve — blocked */}
          <g strokeDasharray="10 8">
            <path d={pathD(...reqPath)} fill="none" stroke={C.danger} strokeWidth={2.5} opacity={0.18 * prog(f, 112, 20)} />
          </g>
          <DrawPath d={pathD(...reqPath)} p={reqDraw} color={C.danger} width={3} />
          <g transform={`translate(${bx.x} ${bx.y}) scale(${xS})`} opacity={Math.min(1, xS * 1.5)}>
            <circle r={24} fill={C.bg} stroke={C.danger} strokeWidth={2.5} />
            <path d="M -9 -9 L 9 9 M 9 -9 L -9 9" stroke={C.danger} strokeWidth={3.5} strokeLinecap="round" />
          </g>
          {/* approver final approve */}
          <DrawPath d={pathD(...aprPath)} p={aprDraw} color={C.signal} width={3} />
          <g transform={`translate(${aMid.x} ${aMid.y}) scale(${okS})`} opacity={Math.min(1, okS * 1.5)}>
            <circle r={24} fill={C.bg} stroke={C.signal} strokeWidth={2.5} />
            <path d="M -10 1 L -3 8 L 10 -7" fill="none" stroke={C.signal} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>

        <Avatar cx={G.req.x} cy={G.req.y} r={G.r} initials="R" color={C.blue} p={reqIn} />
        <Avatar cx={G.apr.x} cy={G.apr.y} r={G.r} initials="A" color={C.signal} p={aprIn} />
        {label(G.req.x, "Requester", "initiated the turn", reqIn)}
        {label(G.apr.x, portrait ? "Independent\napprover" : "Independent approver", portrait ? "distinct principal" : "distinct principal · fresh MFA", aprIn)}

        {/* payload */}
        <div
          style={{
            ...card(tint(R3C, 0.55)),
            ...rise(prog(f, 26, 18), 16),
            position: "absolute",
            left: G.card.x,
            top: G.card.y,
            width: G.card.w,
            height: G.card.h,
            padding: portrait ? "22px 26px" : "26px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: MONO, fontSize: portrait ? 15 : 16, letterSpacing: "0.14em", color: C.fg4 }}>PAYLOAD</span>
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: portrait ? 18 : 20, color: C.bg, background: R3C, padding: "3px 12px", borderRadius: 8 }}>R3</span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: portrait ? 34 : 40, color: C.fg, lineHeight: 1.05 }}>Compensation adjustment</div>
          <div style={{ fontFamily: MONO, fontSize: portrait ? 16 : 18, color: C.fg3 }}>
            <span style={{ color: C.accent }}>planHash</span> sha256:4be1…a07c
          </div>
        </div>

        {/* final approval slot */}
        <div
          style={{
            position: "absolute",
            left: G.btn.x,
            top: G.btn.y,
            width: G.btn.w,
            height: G.btn.h,
            borderRadius: 14,
            border: `2px solid ${okS > 0.5 ? C.signal : C.line3}`,
            background: okS > 0.5 ? "rgba(125,211,191,0.14)" : "rgba(17,24,42,0.92)",
            boxShadow: okS > 0.5 ? `0 0 ${40 * okS}px -10px rgba(125,211,191,0.7)` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: portrait ? 24 : 25,
            color: okS > 0.5 ? C.signal : C.fg2,
            ...rise(prog(f, 104, 16), 12),
          }}
        >
          Final approval
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: G.chipY, display: "flex", justifyContent: "center", ...rise(prog(f, 148, 16), 12) }}>
          <span style={{ fontFamily: MONO, fontSize: portrait ? 19 : 20, color: C.danger, padding: "9px 18px", borderRadius: 999, border: "1.5px solid rgba(240,144,127,0.5)", background: "rgba(240,144,127,0.07)" }}>
            requesterMayFinalApprove: false
          </span>
        </div>

        <div style={{ position: "absolute", left: pad, right: pad, top: G.finalY, textAlign: "center", fontFamily: SERIF, fontSize: portrait ? 60 : 62, color: C.fg, ...rise(prog(f, 200, 20), 14) }}>
          Two people. <span style={{ fontStyle: "italic", color: C.accent }}>One exact payload.</span>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
