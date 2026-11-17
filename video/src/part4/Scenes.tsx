import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
import { DrawPath, Eyebrow, Headline, Particles, Pt, SceneWrap, card, clamp, pathD, prog, rise, useLayout, useSceneFrame } from "../primitives";

/* ------------------------------------------------------------------ shared bits */

const Header: React.FC<{ eyebrow: string; text: string | [string, string]; size: [number, number]; tone?: string }> = ({ eyebrow, text, size, tone }) => {
  const { portrait, pad } = useLayout();
  const t = typeof text === "string" ? text : portrait ? text[0] : text[1];
  return (
    <div style={{ position: "absolute", left: pad, right: pad, top: portrait ? 150 : 132 }}>
      <Eyebrow start={2} color={tone}>
        {eyebrow}
      </Eyebrow>
      <div style={{ marginTop: 22 }}>
        <Headline start={8} size={portrait ? size[0] : size[1]} lineHeight={1.08} text={t} />
      </div>
    </div>
  );
};

const label = (color: string = C.fg4, size = 15): React.CSSProperties => ({
  fontFamily: MONO,
  fontSize: size,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color,
});

const Check: React.FC<{ p: number; size?: number; color?: string }> = ({ p, size = 24, color = C.signal }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" style={{ flex: "none" }}>
    <path d="M5 13.5 L11 19 L21 7" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
  </svg>
);

const Cross: React.FC<{ p: number; size?: number; color?: string }> = ({ p, size = 24, color = C.danger }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" style={{ flex: "none" }}>
    <path d="M7 7 L19 19" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, p * 2)} />
    <path d="M19 7 L7 19" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
  </svg>
);

const ClockIcon: React.FC<{ f: number; color: string; size?: number }> = ({ f, color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" style={{ flex: "none" }}>
    <circle cx="14" cy="14" r="11" fill="none" stroke={color} strokeWidth="2.4" />
    <line x1="14" y1="14" x2="14" y2="7" stroke={color} strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${(f * 14) % 360} 14 14)`} />
    <line x1="14" y1="14" x2="18.5" y2="14" stroke={color} strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${(f * 1.2) % 360} 14 14)`} />
  </svg>
);

const rad = (d: number) => (d * Math.PI) / 180;

/* ------------------------------------------------------------------ 1. The demo-ware loop */

const LOOP_NODES = [
  { t: "Call model", a: -90, at: 108 },
  { t: "Call tool", a: 30, at: 138 },
  { t: "Feed result back", a: 150, at: 168 },
];

export const Loop: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const cx = portrait ? width / 2 : 590;
  const cy = portrait ? 676 : 640;
  const r = portrait ? 196 : 212;
  const ring = prog(f, 66, 44);
  const doom = prog(f, 236, 24);
  const ringColor = doom > 0.5 ? C.danger : C.accent;
  const tokenAng = -90 + Math.max(0, f - 118) * (360 / 96);
  const tok = { x: cx + r * Math.cos(rad(tokenAng)), y: cy + r * Math.sin(rad(tokenAng)) };
  const tokP = prog(f, 118, 14);
  const stamp = spring({ frame: f - 268, fps, config: { damping: 12, mass: 0.8 } });
  const ringD = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`;
  const col: React.CSSProperties = portrait
    ? { position: "absolute", left: pad, right: pad, top: 930, textAlign: "center" }
    : { position: "absolute", left: 1030, right: pad, top: 470, textAlign: "left" };

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="The demo-ware agent" size={[78, 72]} text={["In a demo, an agent\nis a *while loop.*", "In a demo, an agent is a *while loop.*"]} />

        {/* danger glow once the loop meets reality */}
        <div
          style={{
            position: "absolute",
            left: cx - r * 1.6,
            top: cy - r * 1.6,
            width: r * 3.2,
            height: r * 3.2,
            borderRadius: 999,
            background: "transparent",
            opacity: doom,
          }}
        />

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.line} strokeWidth={14} opacity={ring} />
          <DrawPath d={ringD} p={ring} color={ringColor} width={2.5} opacity={0.75} />
          {[-30, 90, 210].map((a) => {
            const x = cx + r * Math.cos(rad(a));
            const y = cy + r * Math.sin(rad(a));
            return (
              <polygon
                key={a}
                points="-9,-8 7,0 -9,8"
                fill={ringColor}
                opacity={prog(f, 100, 16) * 0.9}
                transform={`translate(${x} ${y}) rotate(${a + 90})`}
              />
            );
          })}
          {f >= 118 && (
            <g opacity={tokP}>
              <circle cx={tok.x} cy={tok.y} r={24} fill={ringColor} opacity={0.18} />
              <circle cx={tok.x} cy={tok.y} r={10} fill={ringColor} />
            </g>
          )}
        </svg>

        {LOOP_NODES.map((n, i) => {
          const x = cx + r * Math.cos(rad(n.a));
          const y = cy + r * Math.sin(rad(n.a));
          const diff = (((tokenAng - n.a) % 360) + 360) % 360;
          const near = f >= 118 && (diff < 22 || diff > 350);
          const p = prog(f, n.at, 18);
          return (
            <div
              key={n.t}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) translateY(${(1 - p) * 18}px)`,
                opacity: p,
                ...card(near ? ringColor : C.line2),
                padding: "16px 26px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 17, color: near ? ringColor : C.fg4 }}>0{i + 1}</span>
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 26 : 27, color: C.fg }}>{n.t}</span>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy + 6,
            transform: `translate(-50%, -50%) translateY(${(1 - prog(f, 90, 18)) * 14}px)`,
            opacity: prog(f, 90, 18),
            fontFamily: MONO,
            fontSize: portrait ? 23 : 25,
            color: C.fg2,
            background: C.surface,
            border: `1px solid ${C.line2}`,
            borderRadius: 12,
            padding: "12px 20px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: ringColor }}>while</span> (!done) {"{ … }"}
        </div>

        <div style={col}>
          <div style={{ ...label(C.fg3, portrait ? 19 : 20), ...rise(prog(f, 198, 18)) }}>In a system of record</div>
          <div
            style={{
              display: "inline-block",
              marginTop: portrait ? 22 : 26,
              border: `3px solid ${C.danger}`,
              borderRadius: 16,
              padding: portrait ? "18px 30px" : "22px 36px",
              fontFamily: SERIF,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              fontSize: portrait ? 50 : 60,
              lineHeight: 1.04,
              color: C.danger,
              whiteSpace: "pre-line",
              background: "rgba(215, 0, 21, 0.06)",
              opacity: interpolate(stamp, [0, 0.3], [0, 1], clamp),
              transform: `rotate(-2.5deg) scale(${1.3 - 0.3 * stamp})`,
              transformOrigin: portrait ? "50% 50%" : "0% 50%",
            }}
          >
            {portrait ? "a distributed-systems disaster" : "a distributed-systems\ndisaster"}
          </div>
          <div style={{ marginTop: portrait ? 30 : 34, fontFamily: MONO, fontSize: portrait ? 19 : 21, color: C.fg3, ...rise(prog(f, 290, 18)) }}>
            approvals wait hours · networks time out · pods restart
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 2. How the loop fails */

export const Failure: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const hours = Math.min(4, Math.floor(interpolate(f, [44, 96], [0, 4.2], clamp)));
  const fail = prog(f, 140, 14);
  const flash = interpolate(f, [206, 212, 236], [0, 1, 0], clamp);
  const wipe = prog(f, 212, 18);
  const retry = spring({ frame: f - 272, fps, config: { damping: 11, mass: 0.7 } });
  const paid = f >= 272 ? 2 : 1;

  const steps = [
    { n: "Step 1", t: "Read the record", mono: false, at: 14 },
    { n: "Step 2", t: "Manager approval", mono: false, at: 32 },
    { n: "Step 3", t: "POST /payments", mono: true, at: 100 },
  ];
  const stepBox = (i: number) =>
    portrait ? { x: pad, y: 400 + i * 134, w: W, h: 114 } : { x: pad + i * ((W - 60) / 3 + 30), y: 370, w: (W - 60) / 3, h: 164 };
  const scratch = portrait ? { x: pad, y: 836, w: 500, h: 330 } : { x: pad, y: 592, w: (W - 40) / 2, h: 300 };
  const counter = portrait ? { x: pad + 530, y: 836, w: W - 530, h: 330 } : { x: pad + (W - 40) / 2 + 40, y: 592, w: (W - 40) / 2, h: 300 };

  const status = (i: number) => {
    if (i === 0)
      return (
        <span style={{ display: "flex", alignItems: "center", gap: 10, color: C.signal }}>
          <Check p={prog(f, 24, 14)} size={24} /> read · 200 OK
        </span>
      );
    if (i === 1)
      return (
        <span style={{ display: "flex", alignItems: "center", gap: 10, color: C.accent }}>
          <ClockIcon f={f} color={C.accent} size={24} /> waiting for approval · {hours}h
        </span>
      );
    return fail > 0.05 ? (
      <span style={{ display: "flex", alignItems: "center", gap: 10, color: C.danger, opacity: fail }}>
        <Cross p={fail} size={24} /> 504 after send
      </span>
    ) : (
      <span style={{ color: C.fg3 }}>sending…</span>
    );
  };

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Where the loop breaks" tone={C.danger} size={[76, 70]} text={["Real work outlives\nthe *simple loop.*", "Real work outlives the *simple loop.*"]} />

        {steps.map((s, i) => {
          const b = stepBox(i);
          const tone = i === 0 ? C.signal : i === 1 ? C.accent : fail > 0.5 ? C.danger : C.line2;
          return (
            <div
              key={s.n}
              style={{
                ...card(i === 2 && fail > 0.5 ? "rgba(215, 0, 21, 0.5)" : C.line),
                ...rise(prog(f, s.at, 18), 18),
                position: "absolute",
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                padding: portrait ? "0 28px" : "26px 30px",
                display: "flex",
                flexDirection: portrait ? "row" : "column",
                justifyContent: "space-between",
                alignItems: portrait ? "center" : "flex-start",
                borderLeft: `3px solid ${tone}`,
              }}
            >
              <div>
                <div style={label(C.fg4, 15)}>{s.n}</div>
                <div style={{ fontFamily: s.mono ? MONO : SANS, fontWeight: s.mono ? 500 : 600, fontSize: s.mono ? (portrait ? 26 : 27) : portrait ? 29 : 30, color: C.fg, marginTop: 6 }}>{s.t}</div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: portrait ? 19 : 20 }}>{status(i)}</div>
            </div>
          );
        })}

        {/* in-memory scratchpad wiped by a restart */}
        <div
          style={{
            ...card(flash > 0.2 ? C.danger : C.line2),
            ...rise(prog(f, 164, 18), 18),
            position: "absolute",
            left: scratch.x,
            top: scratch.y,
            width: scratch.w,
            height: scratch.h,
            padding: portrait ? "26px 28px" : "28px 34px",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={label(C.fg4, portrait ? 14 : 15)}>Agent scratchpad · in memory</div>
          </div>
          <div style={{ marginTop: 22, position: "relative" }}>
            {["step = 3", "approval = granted", "payment = sent?"].map((l, i) => (
              <div
                key={l}
                style={{
                  fontFamily: MONO,
                  fontSize: portrait ? 23 : 25,
                  color: C.fg2,
                  padding: "8px 0",
                  borderTop: i ? `1px solid ${C.line}` : "none",
                  opacity: prog(f, 172 + i * 6, 12) * (1 - wipe),
                  transform: `translateX(${wipe * (40 + i * 30)}px)`,
                  filter: wipe > 0.01 ? `blur(${wipe * 6}px)` : undefined,
                }}
              >
                {l}
              </div>
            ))}
            <div style={{ position: "absolute", left: 0, top: 30, opacity: prog(f, 226, 14) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.03em", fontSize: portrait ? 50 : 56, color: C.danger, lineHeight: 1 }}>state lost</div>
              <div style={{ fontFamily: MONO, fontSize: portrait ? 18 : 20, color: C.fg4, marginTop: 12 }}>did step 3 run? nobody knows</div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(215, 0, 21, 0.16)",
              opacity: flash,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...label(C.fg, portrait ? 30 : 34),
              letterSpacing: "0.3em",
            }}
          >
            Pod restart
          </div>
        </div>

        {/* blind retry counter */}
        <div
          style={{
            ...card(paid === 2 ? "rgba(215, 0, 21, 0.5)" : C.line),
            ...rise(prog(f, 176, 18), 18),
            position: "absolute",
            left: counter.x,
            top: counter.y,
            width: counter.w,
            height: counter.h,
            padding: portrait ? "26px 28px" : "28px 34px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={label(C.fg4, portrait ? 14 : 15)}>Payments executed</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                fontSize: portrait ? 132 : 140,
                lineHeight: 0.9,
                color: paid === 2 ? C.danger : C.fg2,
                display: "inline-block",
                transform: `scale(${paid === 2 ? 0.7 + 0.3 * retry : 1})`,
                transformOrigin: "0% 100%",
              }}
            >
              {paid}×
            </span>
            <span style={{ fontFamily: SANS, fontSize: portrait ? 30 : 34, color: paid === 2 ? C.danger : C.fg3 }}>paid</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: portrait ? 18 : 20, color: C.danger, ...rise(prog(f, 258, 16), 10) }}>
            blind retry → POST /payments
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 3. Two engines */

const ENGINES = [
  {
    tag: "Reasoning",
    title: "Bounded Planner",
    color: C.blue,
    owns: ["reasoning", "typed plans", "one repair"],
    at: 104,
    itemAt: 132,
  },
  {
    tag: "Execution",
    title: "Durable Workflow Engine",
    color: C.signal,
    owns: ["execution", "approvals that wait hours", "retries", "state survives restarts"],
    at: 192,
    itemAt: 228,
  },
];

export const TwoEngines: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const boxes = portrait
    ? [
        { x: pad, y: 404, w: W, h: 262 },
        { x: pad, y: 806, w: W, h: 318 },
      ]
    : [
        { x: pad, y: 372, w: 680, h: 470 },
        { x: width - pad - 680, y: 372, w: 680, h: 470 },
      ];
  const a = boxes[0];
  const b = boxes[1];
  const pts: [Pt, Pt, Pt, Pt] = portrait
    ? [
        { x: width / 2, y: a.y + a.h + 6 },
        { x: width / 2, y: a.y + a.h + 50 },
        { x: width / 2, y: b.y - 50 },
        { x: width / 2, y: b.y - 6 },
      ]
    : [
        { x: a.x + a.w + 10, y: a.y + a.h / 2 },
        { x: a.x + a.w + 110, y: a.y + a.h / 2 },
        { x: b.x - 110, y: b.y + b.h / 2 },
        { x: b.x - 10, y: b.y + b.h / 2 },
      ];
  const arrowP = prog(f, 200, 26);
  const end = pts[3];

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Separation of concerns" size={[78, 70]} text={["Split the work\nacross *two engines.*", "Split the work across *two engines.*"]} />

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <DrawPath d={pathD(...pts)} p={arrowP} color={C.accent} width={3} opacity={0.8} />
          <polygon
            points="-12,-10 8,0 -12,10"
            fill={C.accent}
            opacity={prog(f, 220, 10)}
            transform={`translate(${end.x} ${end.y}) rotate(${portrait ? 90 : 0})`}
          />
          <Particles pts={pts} frame={f} start={226} color={C.accent} period={40} count={3} />
        </svg>

        <div
          style={{
            position: "absolute",
            left: portrait ? width / 2 + 34 : (a.x + a.w + b.x) / 2,
            top: portrait ? (a.y + a.h + b.y) / 2 : a.y + a.h / 2 - 54,
            transform: portrait ? "translateY(-50%)" : "translateX(-50%)",
            ...label(C.accent, portrait ? 17 : 18),
            whiteSpace: "nowrap",
            opacity: prog(f, 212, 16),
          }}
        >
          validated plan
        </div>

        {ENGINES.map((e, i) => {
          const g = boxes[i];
          return (
            <div
              key={e.title}
              style={{
                ...card(`${e.color}66`),
                ...rise(prog(f, e.at, 20), 22),
                position: "absolute",
                left: g.x,
                top: g.y,
                width: g.w,
                height: g.h,
                padding: portrait ? "28px 34px" : "38px 42px",
                borderTop: `3px solid ${e.color}`,
              }}
            >
              <div style={label(e.color, portrait ? 16 : 17)}>{e.tag}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.03em", fontSize: portrait ? 48 : 50, color: C.fg, marginTop: 10, lineHeight: 1.05 }}>{e.title}</div>
              <div style={{ ...label(C.fg4, 14), marginTop: portrait ? 20 : 34 }}>owns</div>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: portrait ? "row" : "column",
                  flexWrap: "wrap",
                  gap: portrait ? 12 : 16,
                }}
              >
                {e.owns.map((o, k) => {
                  const p = prog(f, e.itemAt + k * 16, 16);
                  return portrait ? (
                    <span
                      key={o}
                      style={{
                        fontFamily: MONO,
                        fontSize: 21,
                        color: C.fg2,
                        padding: "9px 16px",
                        borderRadius: 999,
                        border: `1.5px solid ${e.color}55`,
                        background: `${e.color}12`,
                        ...rise(p, 10),
                      }}
                    >
                      {o}
                    </span>
                  ) : (
                    <div key={o} style={{ display: "flex", alignItems: "center", gap: 14, ...rise(p, 10) }}>
                      <Check p={prog(f, e.itemAt + k * 16 + 6, 12)} size={26} color={e.color} />
                      <span style={{ fontFamily: SANS, fontSize: 30, color: C.fg2 }}>{o}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: portrait ? 1168 : 900,
            textAlign: "center",
            fontFamily: SANS,
            fontSize: portrait ? 30 : 34,
            color: C.fg2,
            ...rise(prog(f, 292, 20)),
          }}
        >
          Reasoning <span style={{ color: C.blue }}>proposes.</span> Durable authority <span style={{ color: C.signal }}>executes.</span>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 4. The bounded ten-stage graph */

const STAGES = [
  "Context Hydration",
  "Intent Triage",
  "Scoped Retrieval",
  "Capability Pre-Filter",
  "Plan DAG Synthesis",
  "Deterministic Validation",
  "Risk & Approval Gate",
  "Grant-Verified Dispatch",
  "Precondition Check",
  "Grounded Synthesis",
];

const CAPS = [
  { v: "≤ 6", l: "plan nodes", slots: 6, at: 140 },
  { v: "≤ 3", l: "writes", slots: 3, at: 166 },
  { v: "1", l: "write at a time", slots: 1, at: 194 },
  { v: "1", l: "repair attempt", slots: 1, at: 238 },
];

export const BoundedGraph: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const lit = (f - 30) / 10; // stage index being processed
  const stageBox = (i: number) => {
    if (portrait) {
      const col = Math.floor(i / 5);
      const row = i % 5;
      const w = (W - 30) / 2;
      return { x: pad + col * (w + 30), y: 392 + row * 72, w, h: 60 };
    }
    const row = Math.floor(i / 5);
    const col = i % 5;
    const w = (W - 4 * 20) / 5;
    return { x: pad + col * (w + 20), y: 344 + row * 122, w, h: 104 };
  };
  const capBox = (i: number) =>
    portrait
      ? { x: pad + (i % 2) * ((W - 30) / 2 + 30), y: 778 + Math.floor(i / 2) * 168, w: (W - 30) / 2, h: 148 }
      : { x: pad + i * ((W - 60) / 4 + 20), y: 640, w: (W - 60) / 4, h: 170 };

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Bounded reasoning" size={[78, 70]} text={["A fixed *ten-stage*\ngraph, hard-capped.", "A fixed *ten-stage* graph, hard-capped."]} />

        {STAGES.map((s, i) => {
          const g = stageBox(i);
          const state = lit >= 10 || i < Math.floor(lit) ? "pass" : i === Math.floor(lit) ? "active" : "idle";
          const t = state === "pass" ? C.signal : state === "active" ? C.accent : C.line2;
          const p = prog(f, 12 + i * 3, 16);
          return (
            <div
              key={s}
              style={{
                position: "absolute",
                left: g.x,
                top: g.y,
                width: g.w,
                height: g.h,
                borderRadius: 14,
                border: `1.5px solid ${t}`,
                background: state === "idle" ? C.surface : `${t}12`,
                display: "flex",
                flexDirection: portrait ? "row" : "column",
                alignItems: portrait ? "center" : "flex-start",
                justifyContent: portrait ? "flex-start" : "center",
                gap: portrait ? 14 : 6,
                padding: portrait ? "0 18px" : "0 20px",
                ...rise(p, 12),
                opacity: p * (state === "idle" ? 0.55 : 1),
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: portrait ? 17 : 16, color: state === "idle" ? C.fg4 : t, flex: "none" }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: portrait ? 22 : 23, lineHeight: 1.15, color: state === "idle" ? C.fg3 : C.fg, whiteSpace: portrait ? "nowrap" : "normal" }}>{s}</span>
            </div>
          );
        })}

        {CAPS.map((c, i) => {
          const g = capBox(i);
          const p = prog(f, c.at, 18);
          return (
            <div
              key={c.l}
              style={{
                ...card("rgba(0, 113, 227, 0.35)"),
                ...rise(p, 18),
                position: "absolute",
                left: g.x,
                top: g.y,
                width: g.w,
                height: g.h,
                padding: portrait ? "0 26px" : "0 30px",
                display: "flex",
                alignItems: "center",
                gap: portrait ? 20 : 24,
              }}
            >
              <span style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.04em", fontSize: portrait ? 60 : 68, color: C.accent, lineHeight: 1, flex: "none", minWidth: portrait ? 92 : 100 }}>{c.v}</span>
              <div>
                <div style={{ fontFamily: SANS, fontSize: portrait ? 25 : 27, fontWeight: 500, color: C.fg, lineHeight: 1.15 }}>{c.l}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                  {Array.from({ length: c.slots }).map((_, k) => (
                    <span
                      key={k}
                      style={{
                        width: 26,
                        height: 10,
                        borderRadius: 3,
                        background: prog(f, c.at + 10 + k * 4, 8) > 0.5 ? C.accent : C.line2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: portrait ? 1130 : 862,
            display: "flex",
            justifyContent: "center",
            ...rise(prog(f, 268, 18)),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 28px",
              borderRadius: 999,
              border: `1.5px solid rgba(215, 0, 21, 0.45)`,
              background: "rgba(215, 0, 21, 0.06)",
              fontFamily: MONO,
              fontSize: portrait ? 22 : 24,
              color: C.fg2,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30">
              <path d="M22 9 A9 9 0 1 0 24 16" fill="none" stroke={C.danger} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M18 8 L23 8.5 L22.5 3.5" fill="none" stroke={C.danger} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 25 L25 5" stroke={C.danger} strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            not an <span style={{ color: C.danger }}>unbounded ReAct loop</span>
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 5. The typed plan */

export const TypedDag: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const reads = portrait
    ? [
        { x: pad, y: 520, w: (W - 30) / 2, h: 150 },
        { x: pad + (W - 30) / 2 + 30, y: 520, w: (W - 30) / 2, h: 150 },
      ]
    : [
        { x: pad, y: 452, w: 540, h: 146 },
        { x: pad, y: 642, w: 540, h: 146 },
      ];
  const write = portrait ? { x: pad + 110, y: 830, w: W - 220, h: 156 } : { x: width - pad - 580, y: 540, w: 580, h: 160 };
  const etag = portrait ? { x: pad, y: 1024, w: W, h: 150 } : { x: width - pad - 580, y: 736, w: 580, h: 150 };
  const edges: [Pt, Pt, Pt, Pt][] = reads.map((r) => {
    if (portrait) {
      const p0 = { x: r.x + r.w / 2, y: r.y + r.h };
      const p3 = { x: write.x + write.w / 2, y: write.y };
      return [p0, { x: p0.x, y: p0.y + 80 }, { x: p3.x, y: p3.y - 80 }, p3];
    }
    const p0 = { x: r.x + r.w, y: r.y + r.h / 2 };
    const p3 = { x: write.x, y: write.y + write.h / 2 };
    return [p0, { x: p0.x + 260, y: p0.y }, { x: p3.x - 260, y: p3.y }, p3];
  });
  const chip = portrait ? { cx: width / 2, cy: 750 } : { cx: (reads[0].x + reads[0].w + write.x) / 2, cy: write.y + write.h / 2 };
  const run = prog(f, 100, 34);
  const pre = prog(f, 198, 14);
  const ver = prog(f, 244, 14);
  const READS = [
    { name: "leave.balance.get", out: "remainingDays: 9" },
    { name: "team.calendar.check", out: "coverage: ok" },
  ];

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="A typed plan, not a chat" size={[78, 70]} text={["Reads run in parallel.\nThe write *waits.*", "Reads run in parallel. The write *waits.*"]} />

        <div
          style={{
            position: "absolute",
            left: pad,
            right: portrait ? pad : undefined,
            top: portrait ? 412 : 352,
            display: "flex",
            justifyContent: portrait ? "center" : "flex-start",
            ...rise(prog(f, 28, 18), 14),
          }}
        >
          <div style={{ ...card(), padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, borderRadius: 999 }}>
            <span style={label(C.fg4, 14)}>Request</span>
            <span style={{ fontFamily: SANS, fontSize: portrait ? 25 : 26, color: C.fg }}>“Submit 4 days of annual leave.”</span>
            <span style={{ fontFamily: MONO, fontSize: portrait ? 19 : 20, color: C.accent, opacity: prog(f, 56, 14) }}>→ typed plan</span>
          </div>
        </div>

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {edges.map((pts, i) => (
            <React.Fragment key={i}>
              <DrawPath d={pathD(...pts)} p={prog(f, 132, 26)} color={pre > 0.5 ? C.signal : C.accent} width={2.5} opacity={0.7} />
              <Particles pts={pts} frame={f} start={pre > 0.5 ? 210 : 9999} color={C.signal} period={46} count={2} />
            </React.Fragment>
          ))}
        </svg>

        {READS.map((r, i) => {
          const g = reads[i];
          return (
            <div
              key={r.name}
              style={{
                ...card(run >= 1 ? "rgba(36, 138, 61, 0.4)" : C.line),
                ...rise(prog(f, 80 + i * 4, 18), 18),
                position: "absolute",
                left: g.x,
                top: g.y,
                width: g.w,
                height: g.h,
                padding: portrait ? "20px 24px" : "22px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={label(C.signal, 14)}>R0 · read</span>
                <span style={{ ...label(C.fg4, 13), opacity: prog(f, 96, 12) }}>parallel</span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: portrait ? 22 : 25, color: C.fg }}>{r.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 6, background: C.line2, overflow: "hidden" }}>
                  <div style={{ width: `${run * 100}%`, height: "100%", background: C.signal }} />
                </div>
                <Check p={prog(f, 134, 12)} size={22} />
                {!portrait && <span style={{ fontFamily: MONO, fontSize: 17, color: C.fg3, opacity: prog(f, 136, 12) }}>{r.out}</span>}
              </div>
            </div>
          );
        })}

        <div
          style={{
            ...card(ver > 0.5 ? "rgba(36, 138, 61, 0.5)" : "rgba(0, 113, 227, 0.45)"),
            ...rise(prog(f, 140, 20), 18),
            position: "absolute",
            left: write.x,
            top: write.y,
            width: write.w,
            height: write.h,
            padding: portrait ? "22px 28px" : "24px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={label(C.accent, 14)}>Write · serialized</span>
            <span style={{ ...label(pre > 0.5 ? C.signal : C.accent, 13) }}>{pre > 0.5 ? "eligible" : "waiting"}</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: portrait ? 26 : 28, color: C.fg }}>leave.request.create</div>
          <div style={{ fontFamily: MONO, fontSize: portrait ? 17 : 18, color: pre > 0.5 ? C.signal : C.fg3 }}>
            {pre > 0.5 ? "precondition met → may dispatch" : "waits for its precondition…"}
          </div>
        </div>

        {/* precondition chip on the edge */}
        <div
          style={{
            position: "absolute",
            left: chip.cx,
            top: chip.cy,
            transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * prog(f, 164, 16)})`,
            opacity: prog(f, 164, 16),
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 20px",
            borderRadius: 12,
            background: "#ffffff",
            border: `1.5px solid ${pre > 0.5 ? C.signal : C.accent}`,
            fontFamily: MONO,
            fontSize: portrait ? 20 : 20,
            color: pre > 0.5 ? C.signal : C.fg2,
            whiteSpace: "nowrap",
          }}
        >
          <Check p={pre} size={22} />
          $.steps.balance.remainingDays &gt;= 4
        </div>

        {/* optimistic concurrency */}
        <div
          style={{
            ...card(ver > 0.5 ? "rgba(36, 138, 61, 0.4)" : C.line),
            ...rise(prog(f, 220, 18), 18),
            position: "absolute",
            left: etag.x,
            top: etag.y,
            width: etag.w,
            height: etag.h,
            padding: portrait ? "22px 28px" : "22px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={label(C.fg4, 14)}>Record unchanged underneath?</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: portrait ? 23 : 24 }}>
            <span style={{ color: C.fg }}>expectedTargetVersion</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: C.signal, opacity: ver }}>
              <Check p={ver} size={22} /> ETag match
            </span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: portrait ? 17 : 18, color: C.fg4, opacity: prog(f, 258, 14) }}>
            else → <span style={{ color: C.danger }}>409 Conflict</span>, never a silent overwrite
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 6. Post-dispatch timeout */

export const Timeout: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const laneY = portrait ? 488 : 448;
  const worker = portrait ? { x: pad, w: 244 } : { x: pad, w: 330 };
  const target = portrait ? { x: width - pad - 244, w: 244 } : { x: width - pad - 330, w: 330 };
  const cardH = 144;
  const x0 = worker.x + worker.w;
  const x1 = target.x;
  const fenceX = portrait ? 440 : 720;
  const midX = (fenceX + x1) / 2;

  const send = interpolate(f, [34, 80], [0, 1], clamp);
  const pktX = x0 + (x1 - x0) * send;
  const crossed = pktX >= fenceX;
  const back = prog(f, 84, 14);
  const timeout = prog(f, 98, 12);
  const flash = interpolate(f, [98, 104, 136], [0, 1, 0], clamp);
  const unknown = f >= 104;
  const quarantine = spring({ frame: f - 184, fps, config: { damping: 13 } });
  const zero = spring({ frame: f - 134, fps, config: { damping: 14 } });
  const rb = prog(f, 224, 14);
  const rbOut = interpolate(f, [228, 246], [0, 1], clamp);
  const rbBack = interpolate(f, [246, 262], [0, 1], clamp);
  const reconciled = f >= 264;
  const rbY = laneY + 42;
  const rbX = f < 246 ? x0 + (x1 - x0) * rbOut : x1 - (x1 - x0) * rbBack;

  const stateBox = portrait ? { x: pad, y: 640, w: W, h: 200 } : { x: pad, y: 588, w: 1060, h: 210 };
  const retryBox = portrait ? { x: pad, y: 870, w: W, h: 170 } : { x: pad + 1100, y: 588, w: W - 1100, h: 210 };

  const pills = [
    { t: "dispatched", on: crossed, color: C.fg2, border: C.line3 },
    { t: "outcome_unknown", on: unknown, color: C.danger, border: C.accent },
    { t: "reconciled", on: reconciled, color: C.signal, border: C.signal },
  ];

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header
          eyebrow="Post-dispatch timeout"
          tone={C.danger}
          size={[72, 66]}
          text={["After a timeout, nothing\n*retries blindly.*", "After a timeout, nothing *retries blindly.*"]}
        />

        {/* lane glow on timeout */}
        <div
          style={{
            position: "absolute",
            left: x0,
            width: x1 - x0,
            top: laneY - 80,
            height: 160,
            background: "transparent",
            opacity: flash,
          }}
        />

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* forward send */}
          <DrawPath d={`M ${x0 + 6} ${laneY - 20} L ${x1 - 6} ${laneY - 20}`} p={prog(f, 26, 20)} color={C.line3} width={2} />
          {f >= 34 && f < 92 && (
            <g opacity={interpolate(f, [80, 90], [1, 0], clamp)}>
              <circle cx={pktX} cy={laneY - 20} r={22} fill={C.accent} opacity={0.2} />
              <circle cx={pktX} cy={laneY - 20} r={9} fill={C.accent} />
            </g>
          )}
          {/* response that never arrives */}
          <path
            d={`M ${x1 - 6} ${laneY + 8} L ${midX + 20} ${laneY + 8}`}
            stroke={C.danger}
            strokeWidth={2.5}
            strokeDasharray="8 8"
            fill="none"
            opacity={back * (1 - rb * 0.6)}
            pathLength={1}
          />
          <g transform={`translate(${midX} ${laneY + 8})`} opacity={timeout * (1 - rb * 0.6)}>
            <path d="M -10 -10 L 10 10 M 10 -10 L -10 10" stroke={C.danger} strokeWidth={3.5} strokeLinecap="round" />
          </g>
          {/* pre-send fence */}
          <line x1={fenceX} x2={fenceX} y1={laneY - 70} y2={laneY + 70} stroke={crossed ? C.accent : C.line3} strokeWidth={3} strokeDasharray="6 7" opacity={prog(f, 18, 16)} />
          {/* read-back reconcile */}
          <DrawPath d={`M ${x0 + 6} ${rbY} L ${x1 - 6} ${rbY}`} p={rb} color={C.signal} width={2.5} opacity={0.8} />
          {f >= 228 && f < 268 && (
            <g opacity={interpolate(f, [262, 268], [1, 0], clamp)}>
              <circle cx={rbX} cy={rbY} r={20} fill={C.signal} opacity={0.2} />
              <circle cx={rbX} cy={rbY} r={8} fill={C.signal} />
            </g>
          )}
        </svg>

        {/* fence label */}
        <div
          style={{
            position: "absolute",
            left: fenceX,
            top: laneY - 104,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            ...label(crossed ? C.accent : C.fg3, portrait ? 15 : 16),
            opacity: prog(f, 18, 16),
          }}
        >
          pre-send fence {crossed && <Check p={prog(f, 58, 10)} size={20} color={C.accent} />}
        </div>

        {/* timeout label, later replaced by the read-back label */}
        <div
          style={{
            position: "absolute",
            left: midX,
            top: laneY + 58,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            ...label(C.danger, portrait ? 15 : 16),
            opacity: timeout * (1 - prog(f, 218, 8)),
          }}
        >
          network timeout
        </div>
        <div
          style={{
            position: "absolute",
            left: (x0 + x1) / 2,
            top: laneY + 58,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontFamily: MONO,
            fontSize: portrait ? 17 : 19,
            color: C.signal,
            opacity: prog(f, 226, 12),
          }}
        >
          read back by idempotencyKey
        </div>

        {[
          { box: worker, tag: "Durable worker", title: "Dispatch write", mono: false, at: 12, tone: C.line },
          { box: target, tag: "System of record", title: "POST /payments", mono: true, at: 18, tone: reconciled ? "rgba(36, 138, 61, 0.5)" : C.line },
        ].map((n) => (
          <div
            key={n.tag}
            style={{
              ...card(n.tone),
              ...rise(prog(f, n.at, 18), 16),
              position: "absolute",
              left: n.box.x,
              top: laneY - cardH / 2,
              width: n.box.w,
              height: cardH,
              padding: portrait ? "0 22px" : "0 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <div style={label(C.fg4, portrait ? 13 : 14)}>{n.tag}</div>
            <div style={{ fontFamily: n.mono ? MONO : SANS, fontWeight: n.mono ? 500 : 600, fontSize: n.mono ? (portrait ? 21 : 25) : portrait ? 25 : 29, color: C.fg, whiteSpace: "nowrap" }}>
              {n.title}
            </div>
          </div>
        ))}

        {/* operation state machine */}
        <div
          style={{
            ...card(),
            ...rise(prog(f, 54, 18), 18),
            position: "absolute",
            left: stateBox.x,
            top: stateBox.y,
            width: stateBox.w,
            height: stateBox.h,
            padding: portrait ? "26px 26px" : "30px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={label(C.fg4, 14)}>Operation state</div>
          <div style={{ display: "flex", alignItems: "center", gap: portrait ? 10 : 18 }}>
            {pills.map((p, i) => (
              <React.Fragment key={p.t}>
                {i > 0 && <span style={{ fontFamily: MONO, fontSize: 24, color: p.on ? p.border : C.fg4 }}>→</span>}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: portrait ? 20 : 24,
                      padding: portrait ? "12px 16px" : "14px 24px",
                      borderRadius: 999,
                      border: `1.5px solid ${p.on ? p.border : C.line2}`,
                      background: p.on ? `${p.border}1c` : "transparent",
                      color: p.on ? p.color : C.fg4,
                      boxShadow: p.on && i === 1 && f < 140 ? `0 0 ${30 * flash}px ${C.danger}` : "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.t}
                  </div>
                  {i === 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "100%",
                        marginTop: 10,
                        whiteSpace: "nowrap",
                        transform: `translateX(-50%) scale(${1.25 - 0.25 * quarantine})`,
                        opacity: interpolate(quarantine, [0, 0.3], [0, 1], clamp),
                        ...label(C.danger, 14),
                      }}
                    >
                      quarantined
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
          <div style={{ height: 18 }} />
        </div>

        {/* automatic retries: 0 */}
        <div
          style={{
            ...card("rgba(36, 138, 61, 0.4)"),
            ...rise(prog(f, 126, 18), 18),
            position: "absolute",
            left: retryBox.x,
            top: retryBox.y,
            width: retryBox.w,
            height: retryBox.h,
            padding: portrait ? "0 34px" : "0 40px",
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              fontSize: portrait ? 120 : 136,
              lineHeight: 1,
              color: C.signal,
              display: "inline-block",
              transform: `scale(${0.6 + 0.4 * zero})`,
              opacity: interpolate(zero, [0, 0.3], [0, 1], clamp),
            }}
          >
            0
          </span>
          <div>
            <div style={label(C.fg3, portrait ? 17 : 17)}>Automatic retries</div>
            <div style={{ fontFamily: SANS, fontSize: portrait ? 26 : 26, color: C.fg2, marginTop: 8 }}>no blind resend</div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: portrait ? 1090 : 858,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 22,
            ...rise(prog(f, 274, 20)),
          }}
        >
          <Check p={prog(f, 282, 14)} size={portrait ? 46 : 52} />
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: portrait ? 64 : 70, color: C.fg, letterSpacing: "-0.035em" }}>
            Executed <span style={{ color: C.signal }}>exactly once.</span>
          </span>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
