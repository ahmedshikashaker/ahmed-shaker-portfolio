import React from "react";
import { C, MONO, SANS } from "../theme";
import { useLayout } from "../primitives";

/** The nine governance gates — same names as the Execution Journey lab in the articles. */
export const GATES = [
  { name: "Identity", sub: "server-derived principal" },
  { name: "Capability filter", sub: "policy allow-set first" },
  { name: "Retrieval", sub: "brokered, scoped evidence" },
  { name: "Plan", sub: "typed action DAG" },
  { name: "Validate", sub: "graph + node authorization" },
  { name: "Confirm", sub: "hash-bound approval" },
  { name: "Reauthorize", sub: "signed single-use grant" },
  { name: "Execute", sub: "idempotent dispatch" },
  { name: "Audit", sub: "hash-chained record" },
];

export type GateState = "idle" | "pass" | "active" | "block" | "skip";

const tone = (s: GateState) =>
  s === "pass" ? C.signal : s === "active" ? C.accent : s === "block" ? C.danger : C.line3;

/**
 * Nine-gate execution track. Horizontal in 16:9, vertical in 4:5.
 * `fill` = how far the progress rail has travelled (0 → 8, in gate units).
 */
export const GateTrack: React.FC<{
  top: number;
  states: GateState[];
  fill: number;
  fillColor?: string;
  notes?: (string | null)[];
}> = ({ top, states, fill, fillColor = C.signal, notes = [] }) => {
  const { portrait, width, pad } = useLayout();
  const W = width - pad * 2;

  if (portrait) {
    const rowH = 68;
    return (
      <div style={{ position: "absolute", left: pad, top, width: W }}>
        <div style={{ position: "absolute", left: 21, top: 22, width: 2, height: rowH * 8, background: C.line2 }} />
        <div style={{ position: "absolute", left: 21, top: 22, width: 2, height: rowH * Math.max(0, Math.min(8, fill)), background: fillColor }} />
        {GATES.map((g, i) => {
          const s = states[i];
          const t = tone(s);
          const filled = s === "active" || s === "block";
          return (
            <div
              key={g.name}
              style={{ position: "absolute", top: i * rowH, left: 0, display: "flex", alignItems: "center", gap: 20, opacity: s === "skip" ? 0.3 : 1 }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 99,
                  border: `2px solid ${t}`,
                  background: filled ? t : C.bg2,
                  color: filled ? C.bg : s === "idle" ? C.fg4 : t,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontSize: 19,
                  boxShadow: filled ? `0 0 28px ${t}` : "none",
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: s === "idle" ? C.fg3 : C.fg, width: 250 }}>{g.name}</div>
              <div style={{ fontFamily: MONO, fontSize: 17, color: notes[i] ? C.danger : s === "idle" ? C.fg4 : C.fg3 }}>{notes[i] ?? g.sub}</div>
            </div>
          );
        })}
      </div>
    );
  }

  const colW = W / 9;
  return (
    <div style={{ position: "absolute", left: pad, top, width: W, height: 200 }}>
      <div style={{ position: "absolute", left: colW / 2, top: 22, width: colW * 8, height: 2, background: C.line2 }} />
      <div style={{ position: "absolute", left: colW / 2, top: 22, width: colW * Math.max(0, Math.min(8, fill)), height: 2, background: fillColor }} />
      {GATES.map((g, i) => {
        const s = states[i];
        const t = tone(s);
        const filled = s === "active" || s === "block";
        return (
          <div key={g.name} style={{ position: "absolute", left: i * colW, width: colW, textAlign: "center", opacity: s === "skip" ? 0.3 : 1 }}>
            <div
              style={{
                margin: "0 auto",
                width: 46,
                height: 46,
                borderRadius: 99,
                border: `2px solid ${t}`,
                background: filled ? t : C.bg2,
                color: filled ? C.bg : s === "idle" ? C.fg4 : t,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontSize: 19,
                boxShadow: filled ? `0 0 30px ${t}` : "none",
              }}
            >
              {i + 1}
            </div>
            <div style={{ marginTop: 16, fontFamily: SANS, fontWeight: 600, fontSize: 23, color: s === "idle" ? C.fg3 : C.fg }}>{g.name}</div>
            <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 14.5, lineHeight: 1.35, color: notes[i] ? C.danger : C.fg4, padding: "0 8px" }}>
              {notes[i] ?? g.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
};
