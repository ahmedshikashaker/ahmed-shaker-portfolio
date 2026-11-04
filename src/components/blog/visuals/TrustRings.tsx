"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * "Rings of trust": a release widens from the team to everyone. Issues surface (and are fixed) in the inner
 * rings, while the cost of a problem is still small. Conceptual: no data, no numbers.
 */

const RINGS = [
  { label: "Team", who: "The squad and its stakeholders", learn: "Does it work end to end?" },
  { label: "Staff", who: "Colleagues across the bank", learn: "Does it hold up with real people, devices and accounts?" },
  { label: "Early customers", who: "A small group who opted in", learn: "Does it solve the problem? What did we miss?" },
  { label: "Everyone", who: "All customers", learn: "Scale, with the surprises already behind you." },
] as const;

const SIZE = 440;
const C = SIZE / 2;
const RADII = [52, 104, 156, 208];

// Issues found in each ring (ring index, angle in degrees). Most surface early; none reach "Everyone".
const ISSUES: { ring: number; deg: number }[] = [
  { ring: 0, deg: 210 },
  { ring: 0, deg: 330 },
  { ring: 1, deg: 140 },
  { ring: 1, deg: 25 },
  { ring: 1, deg: 310 },
  { ring: 2, deg: 75 },
];

const CYCLE = RINGS.length + 2; // 0..3 rings, then hold, then reset
const STEP_MS = 1500;

export default function TrustRings({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = mounted ? prefersReduced : null;
  const [stepIdx, setStepIdx] = useState<number>(RINGS.length); // SSR / no-JS: fully drawn

  useEffect(() => {
    if (reduced || !inView) return;
    setStepIdx(0);
    const id = window.setInterval(() => setStepIdx((s) => (s + 1) % CYCLE), STEP_MS);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const reached = reduced ? RINGS.length - 1 : Math.min(stepIdx, RINGS.length - 1);
  const isComplete = reduced || stepIdx >= RINGS.length - 1;

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="grid items-center gap-8 rounded-2xl border border-line-2 bg-surface p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label="Four concentric rings: team, staff, early customers, everyone. A release spreads outward ring by ring; issues appear and are fixed in the inner rings before reaching everyone.">
          {RINGS.map((r, i) => {
            const lit = i <= reached;
            return (
              <g key={r.label}>
                <circle
                  cx={C}
                  cy={C}
                  r={RADII[i]}
                  style={{
                    fill: lit ? "var(--c-accent)" : "transparent",
                    fillOpacity: lit ? 0.06 + (RINGS.length - i) * 0.015 : 0,
                    stroke: lit ? "var(--c-accent)" : "var(--c-line-3)",
                    strokeOpacity: lit ? 0.75 : 1,
                    transition: "fill-opacity 0.7s ease, stroke 0.7s ease",
                  }}
                  strokeWidth={lit ? 1.5 : 1}
                  strokeDasharray={lit ? undefined : "3 5"}
                />
                <text
                  x={C}
                  y={C - RADII[i] + (i === 0 ? 30 : 18)}
                  textAnchor="middle"
                  className="font-mono uppercase"
                  style={{
                    fill: lit ? "var(--c-accent)" : "var(--c-fg-4)",
                    fontSize: 10.5,
                    letterSpacing: "0.16em",
                    transition: "fill 0.7s ease",
                  }}
                >
                  {r.label}
                </text>
              </g>
            );
          })}
          {/* The release at the centre */}
          <circle cx={C} cy={C} r={7} style={{ fill: "var(--c-accent)" }} />
          {/* Issues */}
          {ISSUES.map((iss, k) => {
            const rad = (iss.deg * Math.PI) / 180;
            const r = RADII[iss.ring] - 22;
            const x = C + r * Math.cos(rad);
            const y = C + r * Math.sin(rad);
            const visible = iss.ring <= reached;
            const fixed = isComplete || iss.ring < reached;
            return (
              <g key={k} style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}>
                <circle
                  cx={x}
                  cy={y}
                  r={7}
                  style={{
                    fill: "var(--c-bg)",
                    stroke: fixed ? "var(--c-signal)" : "var(--c-danger)",
                    transition: "stroke 0.5s ease",
                  }}
                  strokeWidth={1.5}
                />
                {fixed ? (
                  <path d={`M ${x - 3} ${y} l 2.2 2.4 l 4 -4.6`} fill="none" style={{ stroke: "var(--c-signal)" }} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d={`M ${x - 2.6} ${y - 2.6} l 5.2 5.2 M ${x + 2.6} ${y - 2.6} l -5.2 5.2`} style={{ stroke: "var(--c-danger)" }} strokeWidth={1.6} strokeLinecap="round" />
                )}
              </g>
            );
          })}
        </svg>

        <ol className="space-y-1.5">
          {RINGS.map((r, i) => {
            const active = i === reached;
            const lit = i <= reached;
            return (
              <li
                key={r.label}
                className={`rounded-xl border px-4 py-3 transition-colors duration-500 ${
                  active ? "border-accent/50 bg-accent/[0.07]" : "border-transparent"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className={`font-mono text-[11px] tabular-nums ${lit ? "text-accent" : "text-fg-4"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className={`text-[14.5px] font-medium ${lit ? "text-fg" : "text-fg-3"}`}>
                      {r.label} <span className="font-normal text-fg-4">· {r.who}</span>
                    </p>
                    <p className="mt-0.5 font-display text-[1.02rem] italic leading-snug text-fg-2">{r.learn}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Each ring finds what the previous one couldn't, while a problem is still cheap. Conceptual illustration."}
      </figcaption>
    </figure>
  );
}
