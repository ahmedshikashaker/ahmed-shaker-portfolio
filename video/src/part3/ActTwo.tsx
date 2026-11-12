import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
import { DrawPath, Eyebrow, Headline, Particles, Pt, SceneWrap, card, clamp, pathD, prog, rise, useLayout } from "../primitives";

/* ------------------------------------------------------------------ 4. Normalize: 3 protocols → 1 contract */

const SOURCES = [
  { proto: "OpenAPI 3.x", sub: "REST endpoint", code: "POST /v2/leave-requests", short: "POST /v2/leave", color: C.blue },
  { proto: "MCP Server", sub: "Streamable HTTP tool", code: "tools/call · create_leave", short: "create_leave()", color: C.signal },
  { proto: "Native Adapter", sub: "Curated SDK", code: "hrms.leave.submit()", short: "leave.submit()", color: C.accent2 },
];

const ROWS: { k: string; v: string; note?: string; tone?: string; lock?: boolean }[] = [
  { k: "riskTier", v: "R2 · user confirmation", tone: C.accent },
  { k: "contextInjectedFields", v: "employeeId, tenantId", note: "never shown to the model" },
  { k: "idempotencyKey", v: "required" },
  { k: "resultPolicy", v: "redact PII before the LLM" },
  { k: "connectorContractHash", v: "sha256:9f3a…c41e", note: "pinned · any drift is quarantined", tone: C.signal, lock: true },
];

export const Normalize: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { portrait, width, pad } = useLayout();

  // Geometry (absolute, full-frame coordinates)
  const src = portrait
    ? SOURCES.map((_, i) => {
        const w = (width - pad * 2 - 40) / 3;
        return { x: pad + i * (w + 20), y: 420, w, h: 186 };
      })
    : SOURCES.map((_, i) => ({ x: pad, y: 384 + i * 172, w: 580, h: 156 }));
  const contract = portrait ? { x: pad, y: 688, w: width - pad * 2, h: 508 } : { x: width - pad - 800, y: 384, w: 800, h: 498 };
  const paths: [Pt, Pt, Pt, Pt][] = src.map((s) => {
    if (portrait) {
      const p0 = { x: s.x + s.w / 2, y: s.y + s.h };
      const p3 = { x: contract.x + contract.w / 2, y: contract.y };
      return [p0, { x: p0.x, y: p0.y + 60 }, { x: p3.x, y: p3.y - 50 }, p3];
    }
    const p0 = { x: s.x + s.w, y: s.y + s.h / 2 };
    const p3 = { x: contract.x, y: contract.y + contract.h / 2 };
    return [p0, { x: p0.x + 170, y: p0.y }, { x: p3.x - 170, y: p3.y }, p3];
  });

  const cP = prog(f, 112, 24);

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: pad, right: pad, top: portrait ? 150 : 132 }}>
          <Eyebrow start={2}>One contract · every protocol</Eyebrow>
          <div style={{ marginTop: 22 }}>
            <Headline start={8} size={portrait ? 74 : 66} lineHeight={1.08} text={"Three protocols in.\n*One* governed contract out."} />
          </div>
        </div>

        <svg width={width} height={2000} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {paths.map((pts, i) => (
            <React.Fragment key={i}>
              <DrawPath d={pathD(...pts)} p={prog(f, 78 + i * 8, 34)} color={SOURCES[i].color} width={2.5} opacity={0.55} />
              <Particles pts={pts} frame={f} start={110 + i * 6} color={SOURCES[i].color} period={52} />
            </React.Fragment>
          ))}
        </svg>

        {SOURCES.map((s, i) => {
          const g = src[i];
          const p = prog(f, 40 + i * 12, 20);
          return (
            <div
              key={s.proto}
              style={{
                ...card(),
                ...rise(p, 22),
                position: "absolute",
                left: g.x,
                top: g.y,
                width: g.w,
                height: g.h,
                padding: portrait ? "22px 22px" : "20px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderTop: `3px solid ${s.color}`,
              }}
            >
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: portrait ? 28 : 32, color: C.fg }}>{s.proto}</div>
                <div style={{ fontFamily: MONO, fontSize: portrait ? 16 : 17, color: C.fg4, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                  {s.sub}
                </div>
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: portrait ? 16.5 : 21,
                  color: s.color,
                  background: "rgba(10, 14, 23, 0.7)",
                  border: `1px solid ${C.line}`,
                  borderRadius: 10,
                  padding: portrait ? "8px 10px" : "8px 14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {portrait ? s.short : s.code}
              </div>
            </div>
          );
        })}

        <div
          style={{
            ...card(C.accent),
            position: "absolute",
            left: contract.x,
            top: contract.y,
            width: contract.w,
            height: contract.h,
            opacity: cP,
            transform: `scale(${0.94 + 0.06 * cP})`,
            padding: portrait ? "30px 34px" : "34px 40px",
            boxShadow: `0 0 ${90 * cP}px -20px rgba(216, 187, 132, 0.45), 0 30px 80px -34px rgba(0,0,0,0.75)`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: MONO, fontSize: portrait ? 18 : 18, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent }}>
              Canonical Capability Contract
            </div>
            <div style={{ fontFamily: MONO, fontSize: 16, color: C.fg4, letterSpacing: "0.1em" }}>IMMUTABLE · VERSIONED</div>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: portrait ? 50 : 52, color: C.fg, marginTop: 14, letterSpacing: "-0.01em" }}>
            leave.request.create<span style={{ color: C.accent }}>@v5</span>
          </div>
          <div style={{ height: 1, background: C.line2, margin: portrait ? "18px 0 8px" : "20px 0 10px" }} />
          {ROWS.map((r, i) => {
            const p = prog(f, 142 + i * 26, 18);
            return (
              <div
                key={r.k}
                style={{
                  ...rise(p, 12),
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 20,
                  padding: portrait ? "12px 0" : "13px 0",
                  borderBottom: i < ROWS.length - 1 ? `1px solid ${C.line}` : "none",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: portrait ? 19 : 20, color: C.fg4 }}>{r.k}</span>
                <span style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: MONO, fontSize: portrait ? 22 : 23, color: r.tone ?? C.fg }}>{r.v}</span>
                  {r.note && (
                    <span style={{ display: "block", fontFamily: SANS, fontSize: portrait ? 17 : 17, color: r.lock ? C.signal : C.danger, marginTop: 2 }}>
                      {r.note}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: portrait ? 1226 : 930,
            fontFamily: SANS,
            fontSize: portrait ? 30 : 32,
            color: C.fg2,
            textAlign: portrait ? "left" : "center",
            ...rise(prog(f, 292, 22)),
          }}
        >
          The model plans against the <span style={{ color: C.accent }}>contract</span>—never against raw endpoints.
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

/* ------------------------------------------------------------------ 5. Certification pipeline */

const STAGES = [
  { name: "Registered", sub: "manifest · egress · secretRef" },
  { name: "Discovering", sub: "parse OpenAPI · tools/list" },
  { name: "Quarantined", sub: "every operation locked at R4", tone: C.danger },
  { name: "Reviewed", sub: "risk · fields · redaction set" },
  { name: "Certified", sub: "schema + contract hash pinned" },
  { name: "Published", sub: "bound to an assistant profile", tone: C.signal },
];
const COUNTS: [number, string][] = [
  [0, "operations visible to the AI"],
  [140, "operations discovered"],
  [0, "visible to the AI · all locked at R4"],
  [18, "approved by domain owners"],
  [12, "contracts certified"],
  [12, "governed capabilities live"],
];
const STAGE_START = 46;
const STAGE_STEP = 42;

export const Pipeline: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { portrait, width, pad } = useLayout();
  const raw = (f - STAGE_START) / STAGE_STEP;
  const active = Math.max(-1, Math.min(5, Math.floor(raw)));
  const within = active >= 0 ? prog(f, STAGE_START + active * STAGE_STEP, 22) : 0;
  const prev = active > 0 ? COUNTS[active - 1][0] : 0;
  const count = active >= 0 ? Math.round(interpolate(within, [0, 1], [prev, COUNTS[active][0]])) : 0;
  const label = active >= 0 ? COUNTS[active][1] : COUNTS[0][1];

  // Dot matrix: 140 operations
  const cols = portrait ? 10 : 14;
  const dot = portrait ? 22 : 22;
  const gap = portrait ? 11 : 12;
  const dotColor = (i: number) => {
    if (active < 1) return { c: C.line2, glow: 0, o: 0 };
    const appear = prog(f, STAGE_START + STAGE_STEP + (i % 37) * 0.6, 14);
    if (active === 1) return { c: C.fg3, glow: 0, o: appear };
    if (active === 2) return { c: C.danger, glow: 0, o: 1 };
    const reviewed = i % 8 === 3 && i < 144; // 18 of 140
    const certified = reviewed && i % 24 !== 3; // 12 of the 18
    if (active === 3) return { c: reviewed ? C.accent : "rgba(240,144,127,0.35)", glow: reviewed ? 12 : 0, o: 1 };
    if (active === 4) return { c: certified ? C.accent2 : reviewed ? "rgba(216,187,132,0.3)" : "rgba(240,144,127,0.18)", glow: certified ? 14 : 0, o: 1 };
    return { c: certified ? C.signal : "rgba(232,224,207,0.08)", glow: certified ? 18 : 0, o: 1 };
  };

  const track = portrait
    ? { left: pad, top: 412, rowH: 84 }
    : { left: pad, top: 400, rowH: 0 };
  const nodeW = (width - pad * 2) / 6;

  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: pad, right: pad, top: portrait ? 150 : 132 }}>
          <Eyebrow start={2}>Discover broadly · publish narrowly</Eyebrow>
          <div style={{ marginTop: 22 }}>
            <Headline start={8} size={portrait ? 76 : 70} lineHeight={1.08} text={"Nothing reaches production\n*by default.*"} />
          </div>
        </div>

        {/* Stage track */}
        {portrait ? (
          <div style={{ position: "absolute", left: track.left, top: track.top, width: 540 }}>
            <div style={{ position: "absolute", left: 21, top: 22, width: 2, height: track.rowH * 5, background: C.line2 }} />
            <div
              style={{
                position: "absolute",
                left: 21,
                top: 22,
                width: 2,
                height: track.rowH * Math.max(0, Math.min(5, raw)),
                background: C.accent,
              }}
            />
            {STAGES.map((s, i) => {
              const on = i <= active;
              const cur = i === active;
              const tone = s.tone ?? C.accent;
              return (
                <div key={s.name} style={{ position: "absolute", top: i * track.rowH, left: 0, display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 99,
                      border: `2px solid ${on ? tone : C.line3}`,
                      background: cur ? tone : C.bg2,
                      color: cur ? C.bg : on ? tone : C.fg4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: MONO,
                      fontSize: 19,
                      boxShadow: cur ? `0 0 28px ${tone}` : "none",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ opacity: on ? 1 : 0.45 }}>
                    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 29, color: on ? C.fg : C.fg3 }}>{s.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 16, color: on && s.tone ? s.tone : C.fg4, marginTop: 2 }}>{s.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ position: "absolute", left: pad, top: track.top, width: width - pad * 2, height: 160 }}>
            <div style={{ position: "absolute", left: nodeW / 2, top: 22, width: nodeW * 5, height: 2, background: C.line2 }} />
            <div
              style={{ position: "absolute", left: nodeW / 2, top: 22, width: nodeW * Math.max(0, Math.min(5, raw)), height: 2, background: C.accent }}
            />
            {STAGES.map((s, i) => {
              const on = i <= active;
              const cur = i === active;
              const tone = s.tone ?? C.accent;
              return (
                <div key={s.name} style={{ position: "absolute", left: i * nodeW, width: nodeW, top: 0, textAlign: "center" }}>
                  <div
                    style={{
                      margin: "0 auto",
                      width: 46,
                      height: 46,
                      borderRadius: 99,
                      border: `2px solid ${on ? tone : C.line3}`,
                      background: cur ? tone : C.bg2,
                      color: cur ? C.bg : on ? tone : C.fg4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: MONO,
                      fontSize: 19,
                      boxShadow: cur ? `0 0 30px ${tone}` : "none",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ opacity: on ? 1 : 0.45, marginTop: 16 }}>
                    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: on ? C.fg : C.fg3 }}>{s.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 15.5, color: on && s.tone ? s.tone : C.fg4, marginTop: 4, padding: "0 10px" }}>{s.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dot matrix of 140 operations */}
        <div
          style={{
            position: "absolute",
            ...(portrait ? { right: pad, top: 418 } : { right: pad + 40, top: 620 }),
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${dot}px)`,
            gap,
            opacity: prog(f, STAGE_START + STAGE_STEP - 10, 16),
          }}
        >
          {Array.from({ length: 140 }).map((_, i) => {
            const d = dotColor(i);
            return (
              <span
                key={i}
                style={{
                  width: dot,
                  height: dot,
                  borderRadius: 6,
                  background: d.c,
                  opacity: d.o,
                  boxShadow: d.glow ? `0 0 ${d.glow}px ${d.c}` : "none",
                }}
              />
            );
          })}
        </div>

        {/* Counter */}
        <div style={{ position: "absolute", ...(portrait ? { left: pad, top: 960 } : { left: pad, top: 640 }) }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: portrait ? 190 : 200,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: active === 5 ? C.signal : active === 2 ? C.danger : C.fg,
            }}
          >
            {count}
          </div>
          <div style={{ fontFamily: SANS, fontSize: portrait ? 32 : 32, color: C.fg2, marginTop: 14, maxWidth: portrait ? 900 : 780 }}>{label}</div>
          <div style={{ fontFamily: MONO, fontSize: 16, color: C.fg4, marginTop: 14, letterSpacing: "0.08em" }}>
            Illustrative onboarding of one 140-operation connector
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
