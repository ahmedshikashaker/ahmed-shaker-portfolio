import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
import { DrawPath, Eyebrow, Headline, Particles, Pt, SceneWrap, card, clamp, pathD, prog, rise, useLayout, useSceneFrame } from "../primitives";

/* ------------------------------------------------------------------ helpers */

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
      border: `2px solid ${color}`,
      background: `rgba(125,211,191,${0.22 * p})`,
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

const Cross: React.FC<{ p: number; size?: number }> = ({ p, size = 40 }) => (
  <div
    style={{
      width: size,
      height: size,
      flex: "none",
      borderRadius: 99,
      border: `2px solid ${C.danger}`,
      background: `rgba(240,144,127,${0.22 * p})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 26 26">
      <path d="M7 7 L19 19 M19 7 L7 19" fill="none" stroke={C.danger} strokeWidth="3.2" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  </div>
);

const Lock: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = C.signal }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" fill="none" stroke={color} strokeWidth="2" />
    <path d="M8 10.5 V7.5 a4 4 0 0 1 8 0 V10.5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = C.fg4, size = 16, style }) => (
  <div style={{ fontFamily: MONO, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color, ...style }}>{children}</div>
);

const Pill: React.FC<{ children: React.ReactNode; color: string; size?: number; style?: React.CSSProperties }> = ({ children, color, size = 15, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: MONO,
      fontSize: size,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color,
      border: `1.5px solid ${color}`,
      borderRadius: 999,
      padding: "6px 14px",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ 1. The auditor's question */

const QUESTION = "Who authorized this —\nand why?";

export const AuditorQuestion: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const typed = Math.round(interpolate(f, [132, 214], [0, QUESTION.length], clamp));
  const caretOn = Math.floor(f / 14) % 2 === 0 || (f > 132 && f < 214);
  const metas: [string, string, string?][] = [
    ["Timestamp", "March 14 · 09:42 UTC"],
    ["Change", "Vendor record V-8821 updated in ERP"],
    ["Actor on record", "service account", C.fg4],
  ];

  const memo = portrait ? { x: pad, y: 470, w: width - pad * 2, h: 650 } : { x: 880, y: 250, w: width - pad - 880, h: 620 };

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        {portrait ? (
          <div style={{ position: "absolute", left: pad, right: pad, top: 150 }}>
            <Eyebrow start={4}>Six months after go-live</Eyebrow>
            <div style={{ marginTop: 26 }}>
              <Headline start={12} size={82} lineHeight={1.06} text={"Internal audit asks\n*one question.*"} />
            </div>
          </div>
        ) : (
          <div style={{ position: "absolute", left: pad, width: 720, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Eyebrow start={4}>Six months after go-live</Eyebrow>
            <div style={{ marginTop: 30 }}>
              <Headline start={12} size={92} lineHeight={1.04} text={"Internal audit\nasks *one*\n*question.*"} />
            </div>
          </div>
        )}

        <div
          style={{
            ...card(),
            ...rise(prog(f, 26, 22), 24),
            position: "absolute",
            left: memo.x,
            top: memo.y,
            width: memo.w,
            height: memo.h,
            padding: portrait ? "36px 40px" : "40px 46px",
            display: "flex",
            flexDirection: "column",
            borderTop: `3px solid ${C.accent}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Label color={C.accent} size={portrait ? 18 : 18}>
              Internal Audit · Request
            </Label>
            <Pill color={C.danger} style={{ opacity: prog(f, 44, 14) }}>
              Open
            </Pill>
          </div>
          <div style={{ height: 1.5, background: C.line2, margin: "26px 0 22px" }} />
          {metas.map(([k, v, tone], i) => (
            <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 24, padding: "10px 0", ...rise(prog(f, 48 + i * 14, 16), 12) }}>
              <Label size={15} style={{ width: portrait ? 230 : 230, flex: "none" }}>
                {k}
              </Label>
              <div style={{ fontFamily: SANS, fontSize: portrait ? 27 : 28, color: tone ?? C.fg }}>{v}</div>
            </div>
          ))}
          <div style={{ height: 1.5, background: C.line2, margin: "22px 0 26px" }} />
          <Label size={15} style={{ opacity: prog(f, 110, 14) }}>
            Question
          </Label>
          <div
            style={{
              marginTop: 14,
              fontFamily: SERIF,
              fontSize: portrait ? 68 : 66,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: C.fg,
              whiteSpace: "pre-wrap",
              opacity: prog(f, 110, 10),
            }}
          >
            {QUESTION.slice(0, typed)}
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: "0.9em",
                marginLeft: 6,
                verticalAlign: "-0.1em",
                background: C.accent,
                opacity: caretOn ? 1 : 0,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 2. The evidence request */

const EVIDENCE: [string, string][] = [
  ["User prompt", "turnId"],
  ["Retrieved evidence", "evidenceChunkId"],
  ["Policy revision", "policyRevisionId"],
  ["MFA-verified approval", "approvalId"],
  ["Execution grant", "grantId"],
  ["External receipt", "externalReceiptId"],
];
const EVIDENCE_AT = [56, 84, 118, 146, 172, 204];

export const EvidenceRequest: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const proof = spring({ frame: f - 232, fps, config: { damping: 14 } });
  const proofBox = portrait ? { x: pad, y: 1096, w: W, h: 130 } : { x: pad, y: 790, w: W, h: 130 };
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="The evidence request" size={[74, 66]} text={"Show every artifact.\nProve it's *untouched.*"} />
        {EVIDENCE.map(([t, id], i) => {
          const t0 = EVIDENCE_AT[i];
          const box = portrait
            ? { x: pad, y: 420 + i * 110, w: W, h: 94 }
            : { x: pad + (i % 2) * ((W - 30) / 2 + 30), y: 380 + Math.floor(i / 2) * 128, w: (W - 30) / 2, h: 108 };
          const chk = prog(f, t0 + 10, 12);
          return (
            <div
              key={t}
              style={{
                ...card(chk > 0.5 ? "rgba(125,211,191,0.4)" : C.line2),
                ...rise(prog(f, t0 - 6, 16), 16),
                position: "absolute",
                left: box.x,
                top: box.y,
                width: box.w,
                height: box.h,
                padding: "0 30px",
                display: "flex",
                alignItems: "center",
                gap: 24,
                borderRadius: 18,
              }}
            >
              <Check p={chk} size={portrait ? 48 : 52} />
              <span style={{ fontFamily: MONO, fontSize: 17, color: C.fg4 }}>0{i + 1}</span>
              <div style={{ flex: 1, fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 30 : 31, color: C.fg }}>{t}</div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: portrait ? 18 : 18,
                  color: C.signal,
                  background: "rgba(10,14,23,0.7)",
                  border: `1px solid ${C.line2}`,
                  borderRadius: 10,
                  padding: "6px 12px",
                  opacity: prog(f, t0 + 6, 14),
                }}
              >
                {id}
              </span>
            </div>
          );
        })}

        <div
          style={{
            ...card(C.accent),
            position: "absolute",
            left: proofBox.x,
            top: proofBox.y,
            width: proofBox.w,
            height: proofBox.h,
            padding: "0 34px",
            display: "flex",
            alignItems: "center",
            gap: 28,
            opacity: interpolate(proof, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - proof) * 22}px) scale(${0.97 + 0.03 * proof})`,
            background: "linear-gradient(90deg, rgba(216,187,132,0.16), rgba(17,24,42,0.94) 55%)",
            boxShadow: `0 0 ${70 * proof}px -18px rgba(216,187,132,0.6)`,
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              flex: "none",
              borderRadius: 16,
              border: `2px solid ${C.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={30} color={C.accent} />
          </div>
          <div style={{ flex: 1 }}>
            <Label color={C.accent} size={15}>
              Requirement 07
            </Label>
            <div style={{ fontFamily: SERIF, fontSize: portrait ? 44 : 48, color: C.fg, marginTop: 4, letterSpacing: "-0.015em" }}>
              Proof <span style={{ fontStyle: "italic", color: C.accent }}>none of it</span> was altered.
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 3. Logs are not proof */

const LOG_LINES = [
  ["09:42:07", "INFO", "erp-adapter", "200 OK"],
  ["09:42:07", "INFO", "gateway", "request accepted"],
  ["09:42:08", "INFO", "worker", "dispatch complete"],
  ["09:42:08", "DEBUG", "erp-adapter", "retry=0"],
  ["09:42:09", "INFO", "health", "ready"],
  ["09:42:09", "INFO", "gateway", "200 OK"],
  ["09:42:10", "INFO", "worker", "queue drained"],
  ["09:42:11", "INFO", "erp-adapter", "200 OK"],
];

const SPARK = [0.42, 0.5, 0.46, 0.58, 0.52, 0.6, 0.55, 0.48, 0.56, 0.62, 0.54, 0.5, 0.57, 0.6, 0.53, 0.58, 0.52, 0.55, 0.6, 0.56];

export const LogsAreNotProof: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const left = portrait ? { x: pad, y: 410, w: W, h: 386 } : { x: pad, y: 390, w: (W - 60) / 2, h: 520 };
  const right = portrait ? { x: pad, y: 830, w: W, h: 400 } : { x: pad + (W - 60) / 2 + 60, y: 390, w: (W - 60) / 2, h: 520 };
  const stamp = spring({ frame: f - 158, fps, config: { damping: 11, mass: 0.8 } });
  const lineH = portrait ? 30 : 36;
  const scroll = (f * 0.9) % (LOG_LINES.length * lineH);
  const sparkW = left.w - 64;
  const sparkH = portrait ? 54 : 80;
  const sparkP = prog(f, 34, 40);
  const sparkD = SPARK.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (SPARK.length - 1)) * sparkW} ${sparkH - v * sparkH}`).join(" ");
  const fields: [string, string][] = [
    ["approved by", "?"],
    ["under policy", "?"],
    ["with grant", "?"],
    ["on evidence", "?"],
  ];
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Observability ≠ accountability" size={[72, 66]} text={"Healthy is not the same\nas *authorized.*"} />

        {/* Observability */}
        <div
          style={{
            ...card(),
            ...rise(prog(f, 22, 20), 20),
            position: "absolute",
            left: left.x,
            top: left.y,
            width: left.w,
            height: left.h,
            padding: portrait ? "28px 32px" : "36px 32px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Label color={C.blue} size={16}>
              Observability
            </Label>
            <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: prog(f, 80, 14) }}>
              <Check p={prog(f, 82, 14)} size={36} />
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: C.signal }}>Yes</span>
            </div>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: portrait ? 44 : 48, color: C.fg, marginTop: portrait ? 8 : 14, letterSpacing: "-0.015em" }}>
            Is the service <span style={{ fontStyle: "italic", color: C.blue }}>healthy?</span>
          </div>
          <svg width={sparkW} height={sparkH} style={{ marginTop: portrait ? 14 : 24, overflow: "visible", flex: "none" }}>
            <line x1={0} y1={sparkH} x2={sparkW} y2={sparkH} stroke={C.line2} strokeWidth={1.5} />
            <DrawPath d={sparkD} p={sparkP} color={C.blue} width={2.5} />
          </svg>
          <div
            style={{
              position: "relative",
              flex: 1,
              marginTop: portrait ? 14 : 22,
              overflow: "hidden",
              maskImage: "linear-gradient(180deg, transparent, black 22%, black 78%, transparent)",
              WebkitMaskImage: "linear-gradient(180deg, transparent, black 22%, black 78%, transparent)",
              opacity: prog(f, 30, 20),
            }}
          >
            <div style={{ transform: `translateY(${-scroll}px)` }}>
              {[...LOG_LINES, ...LOG_LINES, ...LOG_LINES].map(([t, lvl, svc, msg], i) => (
                <div key={i} style={{ height: lineH, display: "flex", gap: 18, alignItems: "center", fontFamily: MONO, fontSize: portrait ? 17 : 19, color: C.fg3, whiteSpace: "nowrap" }}>
                  <span style={{ color: C.fg4 }}>{t}</span>
                  <span style={{ color: lvl === "INFO" ? C.signal : C.fg4, width: portrait ? 64 : 72 }}>{lvl}</span>
                  <span style={{ color: C.fg2, width: portrait ? 140 : 150 }}>{svc}</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Non-repudiation */}
        <div
          style={{
            ...card(stamp > 0.4 ? "rgba(240,144,127,0.5)" : C.line2),
            ...rise(prog(f, 100, 20), 20),
            position: "absolute",
            left: right.x,
            top: right.y,
            width: right.w,
            height: right.h,
            padding: portrait ? "28px 32px" : "36px 32px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Label color={C.accent} size={16}>
            Non-repudiation
          </Label>
          <div style={{ fontFamily: SERIF, fontSize: portrait ? 44 : 48, color: C.fg, marginTop: portrait ? 8 : 14, letterSpacing: "-0.015em" }}>
            Who authorized <span style={{ fontStyle: "italic", color: C.accent }}>what?</span>
          </div>
          <div style={{ marginTop: portrait ? 18 : 30, display: "flex", flexDirection: "column", gap: portrait ? 10 : 16 }}>
            {fields.map(([k], i) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: portrait ? "10px 18px" : "14px 20px",
                  borderRadius: 12,
                  border: `1px dashed ${C.line3}`,
                  ...rise(prog(f, 114 + i * 8, 14), 10),
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: portrait ? 19 : 21, color: C.fg3 }}>{k}</span>
                <span style={{ fontFamily: MONO, fontSize: portrait ? 19 : 21, color: C.danger }}>not in logs</span>
              </div>
            ))}
          </div>
        </div>

        {/* stamp */}
        <div
          style={{
            position: "absolute",
            left: portrait ? right.x + right.w - 330 : right.x + right.w - 340,
            top: portrait ? right.y + 22 : right.y + 26,
            width: portrait ? 300 : 310,
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: portrait ? 50 : 54,
            color: C.danger,
            border: `3px solid ${C.danger}`,
            borderRadius: 14,
            padding: "4px 0 8px",
            background: "rgba(10,14,23,0.85)",
            opacity: interpolate(stamp, [0, 0.25], [0, 1], clamp),
            transform: `rotate(-6deg) scale(${1.5 - 0.5 * stamp})`,
            boxShadow: `0 0 ${50 * stamp}px -14px rgba(240,144,127,0.7)`,
          }}
        >
          logs ≠ proof
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 4. Seventeen correlated identifiers */

const GROUPS: { name: string; ids: string[] }[] = [
  { name: "Ingress & trace", ids: ["traceId (W3C)", "conversationId", "turnId", "principalId"] },
  { name: "Reasoning & RAG", ids: ["runId", "retrievalScopeId", "evidenceChunkId", "planId"] },
  { name: "Governance & policy", ids: ["proposalId", "policyRevisionId", "approvalId", "grantId"] },
  { name: "Execution & audit", ids: ["operationId", "capabilityVersionId", "idempotencyKey", "externalReceiptId", "auditEventId"] },
];
const ENDPOINTS = new Set(["turnId", "externalReceiptId"]);
const ID_START = 40;
const ID_STEP = 9;

export const Correlation: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const lit = Math.max(0, Math.min(17, Math.floor((f - ID_START) / ID_STEP) + 1));
  const railP = prog(f, ID_START, 16 * ID_STEP + 10);
  let k = -1;

  const chip = (id: string, idx: number) => {
    const on = prog(f, ID_START + idx * ID_STEP, 12);
    const end = ENDPOINTS.has(id);
    const tone = end ? C.accent : C.signal;
    return (
      <div
        key={id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          height: portrait ? 50 : 54,
          padding: portrait ? "0 16px" : "0 18px",
          borderRadius: 12,
          border: `1.5px solid ${on > 0.5 ? (end ? C.accent : "rgba(125,211,191,0.5)") : C.line2}`,
          background: on > 0.5 ? (end ? "rgba(216,187,132,0.12)" : "rgba(125,211,191,0.07)") : "rgba(17,24,42,0.7)",
          fontFamily: MONO,
          fontSize: portrait ? 19 : 21,
          color: interpolate(on, [0, 1], [0, 1]) > 0.5 ? C.fg : C.fg4,
          opacity: 0.4 + 0.6 * on,
          whiteSpace: "nowrap",
          boxShadow: end && on > 0.5 ? `0 0 30px -8px rgba(216,187,132,0.6)` : undefined,
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 99, flex: "none", background: on > 0.5 ? tone : C.line3, boxShadow: on > 0.5 ? `0 0 12px ${tone}` : undefined }} />
        {id}
      </div>
    );
  };

  const counter = (
    <div style={{ display: "flex", alignItems: "baseline", gap: 18, ...rise(prog(f, 30, 16), 12) }}>
      <span style={{ fontFamily: SERIF, fontSize: portrait ? 120 : 150, lineHeight: 0.9, color: C.accent, fontVariantNumeric: "tabular-nums", minWidth: portrait ? 130 : 160, textAlign: "right" }}>
        {lit}
      </span>
      <span style={{ fontFamily: MONO, fontSize: portrait ? 18 : 19, letterSpacing: "0.14em", textTransform: "uppercase", color: C.fg3, lineHeight: 1.5 }}>
        / 17
        <br />
        correlated IDs
      </span>
    </div>
  );

  const rail = (y: number) => {
    const x0 = pad;
    const x1 = width - pad;
    const pts: [Pt, Pt, Pt, Pt] = [
      { x: x0, y },
      { x: x0 + (x1 - x0) / 3, y },
      { x: x0 + (2 * (x1 - x0)) / 3, y },
      { x: x1, y },
    ];
    return (
      <>
        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
          <line x1={x0} y1={y} x2={x1} y2={y} stroke={C.line2} strokeWidth={2} />
          <DrawPath d={pathD(...pts)} p={railP} color={C.accent} width={3} />
          <circle cx={x0} cy={y} r={8} fill={C.accent} opacity={prog(f, ID_START + 2 * ID_STEP, 10)} />
          <circle cx={x1} cy={y} r={8} fill={C.accent} opacity={prog(f, ID_START + 15 * ID_STEP, 10)} />
          {railP >= 1 && <Particles pts={pts} frame={f} start={ID_START + 16 * ID_STEP + 10} color={C.accent} count={3} period={70} r={5} />}
        </svg>
        <div style={{ position: "absolute", left: x0, top: y + 20, fontFamily: MONO, fontSize: portrait ? 18 : 19, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, opacity: prog(f, ID_START + 2 * ID_STEP, 12) }}>
          user's turn
        </div>
        <div style={{ position: "absolute", right: pad, top: y + 20, fontFamily: MONO, fontSize: portrait ? 18 : 19, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, opacity: prog(f, ID_START + 15 * ID_STEP, 12) }}>
          external receipt
        </div>
      </>
    );
  };

  if (portrait) {
    let y = 410;
    return (
      <SceneWrap dur={dur}>
        <AbsoluteFill>
          <Header eyebrow="Causal correlation" size={[74, 66]} text={"One run, *seventeen*\ncorrelated identifiers."} />
          {GROUPS.map((g, gi) => {
            const top = y;
            y += gi === 3 ? 0 : 150;
            return (
              <div key={g.name} style={{ position: "absolute", left: pad, width: W, top, ...rise(prog(f, 24 + gi * 6, 16), 12) }}>
                <Label color={C.fg3} size={16} style={{ marginBottom: 12 }}>
                  <span style={{ color: C.accent }}>0{gi + 1}</span>&nbsp;&nbsp;{g.name}
                </Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{g.ids.map((id) => chip(id, ++k))}</div>
              </div>
            );
          })}
          {rail(1078)}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center" }}>{counter}</div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  const colW = (W - 3 * 40) / 4;
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Causal correlation" size={[74, 66]} text={"One run, *seventeen*\ncorrelated identifiers."} />
        <div style={{ position: "absolute", right: pad, top: 190 }}>{counter}</div>
        {GROUPS.map((g, gi) => (
          <div key={g.name} style={{ position: "absolute", left: pad + gi * (colW + 40), top: 390, width: colW, ...rise(prog(f, 24 + gi * 6, 16), 12) }}>
            <Label color={C.fg3} size={16} style={{ marginBottom: 16 }}>
              <span style={{ color: C.accent }}>0{gi + 1}</span>&nbsp;&nbsp;{g.name}
            </Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{g.ids.map((id) => chip(id, ++k))}</div>
          </div>
        ))}
        {rail(860)}
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 5. Hash chain + tamper */

const EVENTS = [
  { seq: 1041, type: "proposal.created", prev: "0b7e…d4a9", hash: "3f9a…c21e", bytes: ["4f", "2a", "7c", "19"] },
  { seq: 1042, type: "policy.evaluated", prev: "3f9a…c21e", hash: "a71c…04bd", bytes: ["e0", "51", "9b", "3d"] },
  { seq: 1043, type: "approval.recorded", prev: "a71c…04bd", hash: "5e02…9f13", bytes: ["7a", "c4", "08", "e6"] },
  { seq: 1044, type: "grant.issued", prev: "5e02…9f13", hash: "c8d4…7a60", bytes: ["11", "f2", "6d", "a9"] },
  { seq: 1045, type: "receipt.stored", prev: "c8d4…7a60", hash: "19be…e5f2", bytes: ["b3", "0e", "47", "5c"] },
];
const TAMPER_AT = 150;
const BREAK_AT = [0, 0, TAMPER_AT + 6, TAMPER_AT + 22, TAMPER_AT + 36];

export const HashChain: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const tamper = prog(f, TAMPER_AT, 8);
  const mismatch = spring({ frame: f - 212, fps, config: { damping: 13 } });

  const boxes = EVENTS.map((_, i) =>
    portrait ? { x: pad, y: 474 + i * 116, w: W, h: 98 } : { x: pad + i * ((W - 4 * 46) / 5 + 46), y: 450, w: (W - 4 * 46) / 5, h: 262 },
  );
  const anchor = portrait ? { x: pad, y: 1080, w: W, h: 160 } : { x: pad, y: 790, w: W, h: 150 };

  const broken = (i: number) => i >= 2 && f >= BREAK_AT[i];
  const brokenP = (i: number) => (i >= 2 ? prog(f, BREAK_AT[i], 10) : 0);

  const hashText = (e: (typeof EVENTS)[number], i: number) => (i === 2 && tamper > 0.5 ? "d6f1…2c08" : e.hash);

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Tamper-evident audit ledger" size={[72, 66]} text={"Change one byte, and\nthe *chain breaks.*"} />

        {/* formula chip */}
        <div
          style={{
            position: "absolute",
            ...(portrait ? { left: pad, top: 392 } : { right: pad, top: 268 }),
            fontFamily: MONO,
            fontSize: portrait ? 20 : 22,
            color: C.accent2,
            background: "rgba(10,14,23,0.75)",
            border: `1.5px solid rgba(216,187,132,0.4)`,
            borderRadius: 12,
            padding: "10px 18px",
            whiteSpace: "nowrap",
            ...rise(prog(f, 56, 16), 12),
          }}
        >
          event_hash = SHA256(prev_hash ‖ payload)
        </div>

        {/* links between blocks + anchor drops */}
        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
          {boxes.slice(0, -1).map((b, i) => {
            const n = boxes[i + 1];
            const bad = broken(i + 1);
            const col = bad ? C.danger : C.signal;
            const p = prog(f, 30 + i * 16 + 10, 14);
            const a: Pt = portrait ? { x: b.x + 70, y: b.y + b.h } : { x: b.x + b.w, y: b.y + b.h / 2 };
            const z: Pt = portrait ? { x: n.x + 70, y: n.y } : { x: n.x, y: n.y + n.h / 2 };
            const mid = { x: (a.x + z.x) / 2, y: (a.y + z.y) / 2 };
            const gapP = brokenP(i + 1);
            return (
              <g key={i}>
                <DrawPath d={`M ${a.x} ${a.y} L ${z.x} ${z.y}`} p={p} color={col} width={3} />
                {!portrait && <path d={`M ${z.x - 10} ${z.y - 7} L ${z.x - 1} ${z.y} L ${z.x - 10} ${z.y + 7}`} fill="none" stroke={col} strokeWidth={2.5} opacity={p} />}
                {gapP > 0 && (
                  <g opacity={gapP}>
                    <circle cx={mid.x} cy={mid.y} r={12} fill={C.bg} stroke={C.danger} strokeWidth={2} />
                    <path d={`M ${mid.x - 5} ${mid.y - 5} L ${mid.x + 5} ${mid.y + 5} M ${mid.x + 5} ${mid.y - 5} L ${mid.x - 5} ${mid.y + 5}`} stroke={C.danger} strokeWidth={2.5} strokeLinecap="round" />
                  </g>
                )}
              </g>
            );
          })}
          {!portrait &&
            boxes.map((b, i) => {
              const col = broken(i) ? C.danger : C.line3;
              const x = b.x + b.w / 2;
              return <DrawPath key={i} d={`M ${x} ${b.y + b.h} L ${x} ${anchor.y}`} p={prog(f, 100 + i * 6, 16)} color={col} width={2} opacity={0.8} />;
            })}
          {portrait && (
            <DrawPath
              d={`M ${boxes[4].x + 70} ${boxes[4].y + boxes[4].h} L ${boxes[4].x + 70} ${anchor.y}`}
              p={prog(f, 110, 14)}
              color={broken(4) ? C.danger : C.line3}
              width={2.5}
            />
          )}
        </svg>

        {EVENTS.map((e, i) => {
          const b = boxes[i];
          const t0 = 30 + i * 16;
          const ok = prog(f, t0 + 26, 12);
          const bad = broken(i);
          const isT = i === 2;
          const prevBad = i === 3 && bad;
          const border = isT && tamper > 0.5 ? C.danger : bad ? "rgba(240,144,127,0.55)" : ok > 0.5 ? "rgba(125,211,191,0.35)" : C.line2;
          const byteRow = (
            <div style={{ display: "flex", gap: portrait ? 6 : 8, fontFamily: MONO, fontSize: portrait ? 18 : 19 }}>
              {e.bytes.map((by, bi) => {
                const flip = isT && bi === 2;
                return (
                  <span
                    key={bi}
                    style={{
                      padding: "2px 6px",
                      borderRadius: 6,
                      color: flip && tamper > 0.5 ? C.bg : C.fg3,
                      background: flip ? `rgba(240,144,127,${tamper})` : "rgba(255,255,255,0.03)",
                      transform: flip ? `scale(${1 + 0.25 * Math.sin(Math.PI * tamper)})` : undefined,
                      display: "inline-block",
                    }}
                  >
                    {flip && tamper > 0.5 ? "09" : by}
                  </span>
                );
              })}
            </div>
          );
          const status = bad ? <Cross p={brokenP(i)} size={portrait ? 40 : 38} /> : <Check p={ok} size={portrait ? 40 : 38} />;
          const kv = (k: string, v: string, tone: string) => (
            <div style={{ display: "flex", gap: 10, alignItems: "baseline", fontFamily: MONO, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: portrait ? 14 : 15, color: C.fg4, width: portrait ? 44 : 46, letterSpacing: "0.08em" }}>{k}</span>
              <span style={{ fontSize: portrait ? 18 : 19, color: tone }}>{v}</span>
            </div>
          );
          const hashTone = isT && tamper > 0.5 ? C.danger : bad ? C.danger : C.fg2;
          return (
            <div
              key={e.seq}
              style={{
                ...card(border),
                ...rise(prog(f, t0, 16), 16),
                position: "absolute",
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                borderRadius: 18,
                padding: portrait ? "0 26px" : "22px 22px",
                display: "flex",
                flexDirection: portrait ? "row" : "column",
                alignItems: portrait ? "center" : "stretch",
                justifyContent: portrait ? "flex-start" : "space-between",
                gap: portrait ? 26 : 0,
                boxShadow: isT && tamper > 0.5 ? `0 0 ${50 * tamper}px -12px rgba(240,144,127,0.7)` : undefined,
              }}
            >
              {portrait ? (
                <>
                  <div style={{ width: 236, flex: "none" }}>
                    <div style={{ fontFamily: MONO, fontSize: 18, color: C.accent, letterSpacing: "0.08em" }}>SEQ #{e.seq}</div>
                    <div style={{ fontFamily: SANS, fontSize: 22, color: C.fg, marginTop: 4 }}>{e.type}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                    {kv("prev", e.prev, prevBad ? C.danger : C.fg3)}
                    {kv("hash", hashText(e, i), hashTone)}
                  </div>
                  {byteRow}
                  {status}
                </>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontFamily: MONO, fontSize: 18, color: C.accent, letterSpacing: "0.08em" }}>SEQ #{e.seq}</div>
                    {status}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 23, color: C.fg }}>{e.type}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {kv("prev", e.prev, prevBad ? C.danger : C.fg3)}
                    {kv("hash", hashText(e, i), hashTone)}
                  </div>
                  {byteRow}
                </>
              )}
            </div>
          );
        })}

        {/* tamper callout */}
        <div
          style={{
            position: "absolute",
            ...(portrait ? { right: pad + 4, top: boxes[2].y - 34 } : { left: boxes[2].x, width: boxes[2].w, top: boxes[2].y - 46, textAlign: "center" as const }),
            fontFamily: MONO,
            fontSize: 16,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.danger,
            opacity: tamper,
          }}
        >
          1 byte changed in the DB
        </div>

        {/* anchor */}
        <div
          style={{
            ...card(mismatch > 0.4 ? C.danger : "rgba(216,187,132,0.45)"),
            ...rise(prog(f, 112, 18), 16),
            position: "absolute",
            left: anchor.x,
            top: anchor.y,
            width: anchor.w,
            height: anchor.h,
            padding: portrait ? "0 30px" : "0 38px",
            display: "flex",
            alignItems: "center",
            gap: portrait ? 22 : 34,
            boxShadow: mismatch > 0.4 ? `0 0 ${60 * mismatch}px -16px rgba(240,144,127,0.7)` : undefined,
          }}
        >
          <div style={{ width: 60, height: 60, flex: "none", borderRadius: 16, border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={28} color={C.accent} />
          </div>
          <div style={{ flex: 1 }}>
            <Label color={C.accent} size={15}>
              Signed WORM anchor
            </Label>
            <div style={{ fontFamily: SANS, fontSize: portrait ? 24 : 26, color: C.fg, marginTop: 4 }}>Partition sealed · Ed25519 signature</div>
            <div style={{ fontFamily: MONO, fontSize: portrait ? 16 : 18, color: C.fg3, marginTop: 6, whiteSpace: "nowrap" }}>
              expected 9c41…e2a7 <span style={{ color: C.fg4 }}>·</span> computed{" "}
              <span style={{ color: mismatch > 0.4 ? C.danger : C.fg3 }}>{mismatch > 0.4 ? "51d7…0b3c" : "9c41…e2a7"}</span>
            </div>
          </div>
          {mismatch > 0.05 ? (
            <div
              style={{
                fontFamily: MONO,
                fontSize: portrait ? 18 : 22,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.danger,
                border: `2.5px solid ${C.danger}`,
                borderRadius: 12,
                padding: portrait ? "10px 14px" : "12px 22px",
                textAlign: "center",
                lineHeight: 1.25,
                opacity: interpolate(mismatch, [0, 0.3], [0, 1], clamp),
                transform: `rotate(-3deg) scale(${1.4 - 0.4 * mismatch})`,
                background: "rgba(240,144,127,0.08)",
              }}
            >
              Mismatch
              {portrait ? <br /> : " "}
              detected
            </div>
          ) : (
            <Pill color={C.signal} size={portrait ? 15 : 17} style={{ opacity: prog(f, 124, 14) }}>
              verified
            </Pill>
          )}
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 6. Audience projections */

type Field = { k: string; v: React.ReactNode };

const Redacted: React.FC<{ w: number }> = ({ w }) => (
  <span style={{ display: "inline-block", width: w, height: "0.8em", verticalAlign: "-0.05em", borderRadius: 4, background: "rgba(232,224,207,0.22)" }} />
);

const AUDIENCES: { name: string; tag: string; tone: string; at: number; fields: Field[] }[] = [
  {
    name: "LLM planner",
    tag: "minimum necessary",
    tone: C.blue,
    at: 112,
    fields: [
      { k: "vendor", v: "V-8821" },
      { k: "national ID", v: <Redacted w={150} /> },
      { k: "IBAN", v: <Redacted w={210} /> },
      { k: "status", v: "updated" },
    ],
  },
  {
    name: "Caller UI",
    tag: "masked",
    tone: C.accent,
    at: 142,
    fields: [
      { k: "vendor", v: "Northwind Supply" },
      { k: "national ID", v: "••-••••-•8317" },
      { k: "IBAN", v: "AE07 •••• •••• 0123 456" },
      { k: "status", v: "updated" },
    ],
  },
  {
    name: "Audit vault",
    tag: "full record · sealed",
    tone: C.signal,
    at: 176,
    fields: [
      { k: "vendor", v: "Northwind Supply" },
      { k: "national ID", v: "29-0412-88317" },
      { k: "IBAN", v: "AE07 0331 2345 6789 0123 456" },
      { k: "status", v: "updated" },
    ],
  },
];

export const Projection: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useSceneFrame();
  const { fps } = useVideoConfig();
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;
  const src = portrait ? { x: pad, y: 400, w: W, h: 96 } : { x: (width - 760) / 2, y: 372, w: 760, h: 96 };
  const cards = AUDIENCES.map((_, i) =>
    portrait ? { x: pad + 64, y: 548 + i * 236, w: W - 64, h: 212 } : { x: pad + i * ((W - 80) / 3 + 40), y: 566, w: (W - 80) / 3, h: 390 },
  );
  const paths: [Pt, Pt, Pt, Pt][] = cards.map((c) => {
    if (portrait) {
      const p0 = { x: pad + 28, y: src.y + src.h };
      const p3 = { x: c.x, y: c.y + c.h / 2 };
      return [p0, { x: p0.x, y: p3.y - 10 }, { x: p0.x + 6, y: p3.y }, p3];
    }
    const p0 = { x: src.x + src.w / 2, y: src.y + src.h };
    const p3 = { x: c.x + c.w / 2, y: c.y };
    return [p0, { x: p0.x, y: p0.y + 60 }, { x: p3.x, y: p3.y - 50 }, p3];
  });
  const seal = spring({ frame: f - 196, fps, config: { damping: 12 } });

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <Header eyebrow="Audience projections" size={[74, 66]} text={"One tool result,\n*three projections.*"} />

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
          {paths.map((pts, i) => (
            <React.Fragment key={i}>
              <DrawPath d={pathD(...pts)} p={prog(f, 60 + i * 10, 30)} color={AUDIENCES[i].tone} width={2.5} opacity={0.6} />
              <Particles pts={pts} frame={f} start={90 + i * 10} color={AUDIENCES[i].tone} count={2} period={44} r={5} />
            </React.Fragment>
          ))}
        </svg>

        <div
          style={{
            ...card(),
            ...rise(prog(f, 24, 18), 16),
            position: "absolute",
            left: src.x,
            top: src.y,
            width: src.w,
            height: src.h,
            padding: "0 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div>
            <Label size={15}>Tool result</Label>
            <div style={{ fontFamily: SANS, fontSize: portrait ? 26 : 27, color: C.fg, marginTop: 4 }}>Vendor record V-8821</div>
          </div>
          <Pill color={C.danger} size={14}>
            raw · contains PII
          </Pill>
        </div>

        {AUDIENCES.map((a, i) => {
          const c = cards[i];
          const vault = i === 2;
          return (
            <div
              key={a.name}
              style={{
                ...card(vault && seal > 0.4 ? "rgba(125,211,191,0.55)" : C.line2),
                ...rise(prog(f, a.at, 18), 18),
                position: "absolute",
                left: c.x,
                top: c.y,
                width: c.w,
                height: c.h,
                padding: portrait ? "22px 28px" : "28px 30px",
                display: "flex",
                flexDirection: "column",
                borderTop: `3px solid ${a.tone}`,
                boxShadow: vault && seal > 0.4 ? `0 0 ${60 * seal}px -18px rgba(125,211,191,0.6)` : undefined,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 27 : 29, color: C.fg }}>{a.name}</div>
                <Pill color={a.tone} size={portrait ? 13 : 13} style={{ padding: "5px 12px", ...(vault ? { opacity: interpolate(seal, [0, 0.3], [0, 1], clamp), transform: `scale(${1.2 - 0.2 * seal})` } : {}) }}>
                  {vault && <Lock size={15} color={a.tone} />}
                  {a.tag}
                </Pill>
              </div>
              <div
                style={{
                  marginTop: portrait ? 14 : 24,
                  display: "grid",
                  gridTemplateColumns: portrait ? "1fr 1.5fr" : "1fr",
                  gridAutoFlow: portrait ? "column" : "row",
                  gridTemplateRows: portrait ? "1fr 1fr" : undefined,
                  columnGap: 30,
                  rowGap: portrait ? 10 : 16,
                }}
              >
                {(portrait ? [a.fields[0], a.fields[1], a.fields[2], a.fields[3]] : a.fields).map((fl, fi) => (
                  <div key={fl.k} style={{ ...rise(prog(f, a.at + 8 + fi * 4, 12), 8) }}>
                    <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: C.fg4 }}>{fl.k}</div>
                    <div style={{ fontFamily: MONO, fontSize: portrait ? 20 : 21, color: C.fg2, marginTop: 4, whiteSpace: "nowrap" }}>{fl.v}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </SceneWrap>
  );
};
