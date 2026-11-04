"use client";

import { useEffect, useRef } from "react";

/**
 * "The approval loop": DORA's vicious cycle of heavyweight change approval, drawn as a loop, beside the two
 * findings that make it matter. A dot travels the loop and lights each step as it passes (CSS animation,
 * paused off-screen, off under reduced motion). Coordinates are rounded so server and client render identically.
 */

const SIZE = 400;
const C = SIZE / 2;
const R = 128;
const PERIOD_S = 10;

const STEPS = [
  ["Approval", "is slow"],
  ["Changes", "pile up"],
  ["Releases", "get bigger"],
  ["Failures", "hit harder"],
  ["More approval", "is added"],
] as const;

const r2 = (n: number) => Math.round(n * 100) / 100;
const polar = (deg: number, radius = R) => {
  const a = (deg * Math.PI) / 180;
  return [r2(C + radius * Math.cos(a)), r2(C + radius * Math.sin(a))] as const;
};

const NODE_DEG = STEPS.map((_, i) => -90 + i * (360 / STEPS.length));

// Arrowheads halfway between nodes, pointing clockwise along the circle.
const ARROWS = NODE_DEG.map((d) => {
  const mid = d + 180 / STEPS.length;
  const a = (mid * Math.PI) / 180;
  const [x, y] = polar(mid);
  const tx = -Math.sin(a); // clockwise tangent
  const ty = Math.cos(a);
  const nx = Math.cos(a);
  const ny = Math.sin(a);
  const tip = [r2(x + tx * 7), r2(y + ty * 7)];
  const b1 = [r2(x - tx * 5 + nx * 5.5), r2(y - ty * 5 + ny * 5.5)];
  const b2 = [r2(x - tx * 5 - nx * 5.5), r2(y - ty * 5 - ny * 5.5)];
  return `${tip.join(",")} ${b1.join(",")} ${b2.join(",")}`;
});

export default function ApprovalLoop({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);

  // Pause the CSS animation while the figure is off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.playing = e.isIntersecting ? "true" : "false";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className="approval-loop not-prose my-14 font-sans" data-playing="false" style={{ "--loop-period": `${PERIOD_S}s` } as React.CSSProperties}>
      <div className="grid items-center gap-6 overflow-hidden rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-7 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="mx-auto h-auto w-full max-w-[380px]"
          role="img"
          aria-label="A loop of five steps: approval is slow, so changes pile up, so releases get bigger, so failures hit harder, so more approval is added, which makes approval slower still."
        >
          <circle cx={C} cy={C} r={R} fill="none" style={{ stroke: "var(--c-line-3)" }} strokeWidth={1.25} strokeDasharray="2 6" strokeLinecap="round" />
          {ARROWS.map((pts, i) => (
            <polygon key={i} points={pts} style={{ fill: "var(--c-fg-4)" }} />
          ))}

          {/* The change travelling the loop */}
          <g className="loop-orbit">
            <circle cx={C} cy={C - R} r={13} style={{ fill: "var(--c-accent)", fillOpacity: 0.16 }} />
            <circle cx={C} cy={C - R} r={6} style={{ fill: "var(--c-accent)" }} />
          </g>

          {STEPS.map(([a, b], i) => {
            const [x, y] = polar(NODE_DEG[i]);
            const w = i === 4 ? 132 : 112;
            return (
              <g key={a} className="loop-node" style={{ animationDelay: `${r2((i / STEPS.length) * PERIOD_S - 0.5)}s` }}>
                <rect x={r2(x - w / 2)} y={y - 23} width={w} height={46} rx={23} className="loop-node-pill" />
                <text x={x} y={y - 3} textAnchor="middle" className="loop-node-text" style={{ fontSize: 13.5, fontWeight: 600 }}>
                  {a}
                </text>
                <text x={x} y={y + 13} textAnchor="middle" className="loop-node-sub" style={{ fontSize: 12.5 }}>
                  {b}
                </text>
              </g>
            );
          })}

          <text x={C} y={C - 14} textAnchor="middle" className="font-mono uppercase" style={{ fill: "var(--c-fg-4)", fontSize: 10.5, letterSpacing: "0.16em" }}>
            Each turn
          </text>
          <text x={C} y={C + 10} textAnchor="middle" style={{ fill: "var(--c-fg)", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 19 }}>
            slower,
          </text>
          <text x={C} y={C + 33} textAnchor="middle" style={{ fill: "var(--c-fg)", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 19 }}>
            and no safer
          </text>
        </svg>

        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line">
          <div className="bg-surface px-5 py-5">
            <p className="font-display text-[3.2rem] leading-none tabular-nums text-danger">2.6×</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-fg-2">
              more likely to be <strong className="font-semibold text-fg">low performers</strong> at software delivery, where organisations require approval from a
              change board or senior manager.
            </p>
          </div>
          <div className="bg-surface px-5 py-5">
            <p className="font-display text-[2.3rem] leading-none text-fg">No evidence</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-fg-2">that a more formal approval process lowers change failure rates.</p>
          </div>
          <p className="bg-surface px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">DORA · State of DevOps 2019</p>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "DORA calls this a vicious cycle. Heavier approval was meant to buy safety; it buys bigger, riskier releases instead."}
      </figcaption>
    </figure>
  );
}
