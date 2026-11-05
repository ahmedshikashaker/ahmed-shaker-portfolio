"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * "Two Clocks": a fast inner dial (the factory) and a slow outer dial (the rest of the bank).
 * Work items are built on the inner dial, then wait at three handoff gates on the outer dial.
 *
 * The simulation is deterministic (fixed time step, no randomness), so the server-rendered frame and the
 * first client frame are identical. After hydration a requestAnimationFrame loop mutates the SVG directly
 * (no React re-render per frame). Reduced motion: no loop; each scroll step shows a frozen snapshot.
 */

type Variant = "intro" | "sync";
type Stage = 0 | 1 | 2 | 3; // 3 = clocks in sync (closing)

const SIZE = 560;
const C = SIZE / 2;
const R_IN = 92;
const R_OUT = 186;
const POOL = 140;
const MAX_VISIBLE_QUEUE = 14;
const MAX_QUEUE_OBJECTS = 40;
const DT = 1 / 30;

const GATES = [
  { label: "Integration", angle: -Math.PI / 2 },
  { label: "Risk & compliance", angle: Math.PI / 6 },
  { label: "Go-to-market", angle: (5 * Math.PI) / 6 },
] as const;

const PARAMS: Record<Stage, { spawnEvery: number; innerPeriod: number; outerPeriod: number; releaseEvery: number }> = {
  0: { spawnEvery: 1.5, innerPeriod: 3.2, outerPeriod: 48, releaseEvery: 4.2 },
  1: { spawnEvery: 1.5, innerPeriod: 3.2, outerPeriod: 48, releaseEvery: 6.5 },
  2: { spawnEvery: 0.5, innerPeriod: 1.5, outerPeriod: 48, releaseEvery: 6.5 },
  3: { spawnEvery: 0.42, innerPeriod: 2.4, outerPeriod: 7.2, releaseEvery: 1.15 },
};

type Phase = "build" | "travel" | "queue" | "ship";
interface Item {
  phase: Phase;
  p: number; // progress 0..1 within phase (build/travel/ship)
  a0: number; // spawn angle
  gate: number;
  dk: number; // displayed queue index (eased)
  fx: number; // travel start
  fy: number;
}

interface Sim {
  t: number;
  innerAngle: number;
  outerAngle: number;
  spawnClock: number;
  releaseClock: number[];
  nextGate: number;
  items: Item[]; // build / travel / ship
  queues: Item[][];
  overflow: number[];
  shipped: number;
}

function newSim(): Sim {
  return {
    t: 0,
    innerAngle: -Math.PI / 2,
    outerAngle: -Math.PI / 2,
    spawnClock: 0,
    releaseClock: [0.6, 2.0, 3.4],
    nextGate: 0,
    items: [],
    queues: [[], [], []],
    overflow: [0, 0, 0],
    shipped: 0,
  };
}

// Rounded to 0.01: Node (server) and the browser can differ in the last digit of sin/cos, which would make
// the server-rendered SVG attributes disagree with the client's during hydration.
const r2 = (n: number) => Math.round(n * 100) / 100;
const polar = (r: number, a: number) => [r2(C + r * Math.cos(a)), r2(C + r * Math.sin(a))] as const;
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

function queuePos(gate: number, k: number) {
  return polar(R_OUT - 12, GATES[gate].angle - (k + 1) * 0.074);
}

function step(sim: Sim, stage: Stage, dt: number) {
  const P = PARAMS[stage];
  sim.t += dt;
  sim.innerAngle += (2 * Math.PI * dt) / P.innerPeriod;
  sim.outerAngle += (2 * Math.PI * dt) / P.outerPeriod;

  // Spawn new work on the inner dial.
  sim.spawnClock += dt;
  while (sim.spawnClock >= P.spawnEvery) {
    sim.spawnClock -= P.spawnEvery;
    sim.items.push({ phase: "build", p: 0, a0: sim.innerAngle, gate: 0, dk: 0, fx: 0, fy: 0 });
  }

  // Advance items.
  const buildTime = P.innerPeriod * 0.85;
  for (const it of sim.items) {
    if (it.phase === "build") {
      it.p += dt / buildTime;
      if (it.p >= 1) {
        const [x, y] = polar(R_IN, it.a0 + 2 * Math.PI * 0.85);
        it.phase = "travel";
        it.p = 0;
        it.fx = x;
        it.fy = y;
        it.gate = sim.nextGate;
        sim.nextGate = (sim.nextGate + 1) % GATES.length;
      }
    } else if (it.phase === "travel") {
      it.p += dt / 0.9;
      if (it.p >= 1) {
        const q = sim.queues[it.gate];
        if (q.length >= MAX_QUEUE_OBJECTS) {
          sim.overflow[it.gate] += 1;
          it.phase = "ship";
          it.p = 2; // discard (not rendered)
        } else {
          it.phase = "queue";
          it.dk = q.length;
          q.push(it);
        }
      }
    } else if (it.phase === "ship") {
      it.p += dt / 1.6;
    }
  }
  sim.items = sim.items.filter((it) => it.phase !== "queue" && !(it.phase === "ship" && it.p >= 1));

  // Gates release work at the slow clock's pace.
  for (let g = 0; g < GATES.length; g++) {
    sim.releaseClock[g] += dt;
    const q = sim.queues[g];
    if (sim.releaseClock[g] >= P.releaseEvery) {
      if (q.length > 0) {
        sim.releaseClock[g] = 0;
        const head = q.shift()!;
        head.phase = "ship";
        head.p = 0;
        sim.items.push(head);
        sim.shipped += 1;
        if (sim.overflow[g] > 0) {
          sim.overflow[g] -= 1;
          q.push({ phase: "queue", p: 0, a0: 0, gate: g, dk: q.length + 1, fx: 0, fy: 0 });
        }
      } else {
        sim.releaseClock[g] = P.releaseEvery; // ready the moment work arrives
      }
    }
    q.forEach((it, k) => {
      it.dk += (k - it.dk) * Math.min(1, dt * 7);
    });
  }
}

function simulate(stage: Stage, seconds: number): Sim {
  const sim = newSim();
  const n = Math.round(seconds / DT);
  for (let i = 0; i < n; i++) step(sim, stage, DT);
  return sim;
}

interface Dot {
  x: number;
  y: number;
  o: number;
  tone: "accent" | "fg" | "signal";
}

function frame(sim: Sim): Dot[] {
  const dots: Dot[] = [];
  for (const it of sim.items) {
    if (it.phase === "build") {
      const [x, y] = polar(R_IN, it.a0 + 2 * Math.PI * 0.85 * it.p);
      dots.push({ x, y, o: Math.min(1, it.p * 6), tone: "accent" });
    } else if (it.phase === "travel") {
      const q = sim.queues[it.gate];
      const [tx, ty] = queuePos(it.gate, Math.min(q.length, MAX_VISIBLE_QUEUE - 1));
      const e = ease(Math.min(1, it.p));
      dots.push({ x: it.fx + (tx - it.fx) * e, y: it.fy + (ty - it.fy) * e, o: 1, tone: "accent" });
    } else if (it.phase === "ship" && it.p < 1) {
      const a = GATES[it.gate].angle + it.p * 0.55;
      const [x, y] = polar(R_OUT + 8 + it.p * 50, a);
      dots.push({ x, y, o: 1 - it.p, tone: "signal" });
    }
  }
  sim.queues.forEach((q, g) => {
    q.forEach((it, k) => {
      if (k >= MAX_VISIBLE_QUEUE) return;
      const [x, y] = queuePos(g, it.dk);
      dots.push({ x, y, o: k > MAX_VISIBLE_QUEUE - 4 ? 0.35 + 0.2 * (MAX_VISIBLE_QUEUE - k) : 1, tone: "fg" });
    });
  });
  return dots.slice(0, POOL);
}

function counts(sim: Sim) {
  const inFactory = sim.items.filter((i) => i.phase === "build" || i.phase === "travel").length;
  const waiting = sim.queues.reduce((n, q) => n + q.length, 0) + sim.overflow.reduce((a, b) => a + b, 0);
  return { inFactory, waiting, shipped: sim.shipped };
}

const TONE_FILL: Record<Dot["tone"], string> = {
  accent: "var(--c-accent)",
  fg: "var(--c-fg-3)",
  signal: "var(--c-signal)",
};

const DEFAULT_STEPS = [
  "Inside the factory, the clock ticks every two weeks. Work is shaped, built, tested and finished in short cycles.",
  "Outside it, the clock of a regulated bank ticks monthly, quarterly, by committee. Every finished change has to pass through it.",
  "Speed up the inner clock and the outer one doesn't move. Work doesn't reach customers sooner. It waits.",
];

export default function TwoClocks({
  variant = "intro",
  caption,
  step1,
  step2,
  step3,
}: {
  variant?: Variant;
  caption?: string;
  step1?: string;
  step2?: string;
  step3?: string;
}) {
  // Only trust the media query after mount, so the first client render matches the server HTML.
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = mounted ? prefersReduced : null;
  const isIntro = variant !== "sync";
  const steps = [step1 || DEFAULT_STEPS[0], step2 || DEFAULT_STEPS[1], step3 || DEFAULT_STEPS[2]];
  const initialStage: Stage = isIntro ? 0 : 3;

  const [stage, setStage] = useState<Stage>(initialStage);
  const stageRef = useRef<Stage>(initialStage);
  stageRef.current = stage;

  // Deterministic first frame (identical on server and client).
  const initial = useMemo(() => simulate(initialStage, 14), [initialStage]);
  const initialDots = useMemo(() => frame(initial), [initial]);
  const initialCounts = useMemo(() => counts(initial), [initial]);

  // Reduced motion: frozen snapshot per stage.
  const staticSim = useMemo(() => (reduced ? simulate(stage, stage === 2 ? 22 : 18) : null), [reduced, stage]);
  const shownDots = staticSim ? frame(staticSim) : initialDots;
  const shownCounts = staticSim ? counts(staticSim) : initialCounts;
  const shownInner = staticSim ? staticSim.innerAngle : initial.innerAngle;
  const shownOuter = staticSim ? staticSim.outerAngle : initial.outerAngle;

  const figRef = useRef<HTMLElement>(null);
  const circles = useRef<(SVGCircleElement | null)[]>([]);
  const innerHand = useRef<SVGLineElement>(null);
  const outerHand = useRef<SVGLineElement>(null);
  const cIn = useRef<HTMLElement>(null);
  const cWait = useRef<HTMLElement>(null);
  const cShip = useRef<HTMLElement>(null);
  const gateRefs = useRef<(SVGGElement | null)[]>([]);

  // Animation loop.
  useEffect(() => {
    if (reduced !== false) return; // null (unknown) or true: no loop
    const sim = simulate(initialStage, 14);
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let visible = true;
    let lastCountUpdate = 0;
    const lastTone: (string | null)[] = new Array(POOL).fill(null);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    if (figRef.current) io.observe(figRef.current);

    function render(now: number) {
      const dots = frame(sim);
      for (let i = 0; i < POOL; i++) {
        const el = circles.current[i];
        if (!el) continue;
        const d = dots[i];
        if (!d) {
          if (el.getAttribute("opacity") !== "0") el.setAttribute("opacity", "0");
          continue;
        }
        el.setAttribute("cx", d.x.toFixed(1));
        el.setAttribute("cy", d.y.toFixed(1));
        el.setAttribute("opacity", d.o.toFixed(2));
        if (lastTone[i] !== d.tone) {
          el.style.fill = TONE_FILL[d.tone];
          lastTone[i] = d.tone;
        }
      }
      const [ix, iy] = polar(R_IN - 14, sim.innerAngle);
      innerHand.current?.setAttribute("x2", ix.toFixed(1));
      innerHand.current?.setAttribute("y2", iy.toFixed(1));
      const [ox, oy] = polar(R_OUT - 26, sim.outerAngle);
      outerHand.current?.setAttribute("x2", ox.toFixed(1));
      outerHand.current?.setAttribute("y2", oy.toFixed(1));

      if (now - lastCountUpdate > 200) {
        lastCountUpdate = now;
        const c = counts(sim);
        if (cIn.current) cIn.current.textContent = String(c.inFactory);
        if (cWait.current) cWait.current.textContent = String(c.waiting);
        if (cShip.current) cShip.current.textContent = String(c.shipped);
        sim.queues.forEach((q, g) => {
          const el = gateRefs.current[g];
          if (el) el.dataset.busy = q.length + sim.overflow[g] > 6 ? "true" : "false";
        });
      }
    }

    function tick(now: number) {
      if (!visible) return;
      acc += Math.min(0.1, (now - last) / 1000);
      last = now;
      while (acc >= DT) {
        step(sim, stageRef.current, DT);
        acc -= DT;
      }
      render(now);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced, initialStage]);

  // Scroll steps drive the stage (intro variant).
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!isIntro) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.step);
            setStage(i as Stage);
          }
        }
      },
      { rootMargin: window.matchMedia("(min-width: 64rem)").matches ? "-45% 0px -45% 0px" : "-72% 0px -6% 0px" }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [isIntro]);

  const [ix0, iy0] = polar(R_IN - 14, shownInner);
  const [ox0, oy0] = polar(R_OUT - 26, shownOuter);
  const ticks = Array.from({ length: 60 }, (_, i) => i);

  const graphic = (
    <div className={`relative mx-auto flex w-full flex-col ${isIntro ? "max-w-[min(640px,56svh)] lg:max-w-[min(680px,74svh)]" : "max-w-[680px]"}`}>
      <svg
        viewBox={`-56 0 ${SIZE + 112} ${SIZE}`}
        className="h-auto w-full"
        role="img"
        aria-label={
          isIntro
            ? "Two concentric clocks. The inner clock, the factory, spins fast and produces work. The outer clock, the rest of the bank, turns slowly; finished work waits at three handoff points: integration, risk and compliance, and go-to-market."
            : "The same two clocks, now meshing: work flows through the three handoff points without piling up."
        }
      >
        {/* Faint blueprint grid circle */}
        <circle cx={C} cy={C} r={R_OUT + 58} fill="none" style={{ stroke: "var(--c-line)" }} strokeDasharray="2 6" />
        {/* Outer dial */}
        <circle cx={C} cy={C} r={R_OUT} fill="none" style={{ stroke: "var(--c-line-3)" }} strokeWidth={1.25} />
        {ticks.map((i) => {
          const a = (i / 60) * Math.PI * 2;
          const [x1, y1] = polar(R_OUT - (i % 5 === 0 ? 9 : 4), a);
          const [x2, y2] = polar(R_OUT, a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: "var(--c-line-3)" }} strokeWidth={1} />;
        })}
        {/* Inner dial */}
        <circle cx={C} cy={C} r={R_IN} fill="none" style={{ stroke: "var(--c-accent)" }} strokeOpacity={0.55} strokeWidth={1.25} />
        <circle cx={C} cy={C} r={R_IN - 30} fill="none" style={{ stroke: "var(--c-line-2)" }} />

        {/* Gates */}
        {GATES.map((g, i) => {
          const [gx, gy] = polar(R_OUT, g.angle);
          const [lx, ly] = polar(R_OUT + 36, g.angle);
          const anchor = Math.abs(Math.cos(g.angle)) < 0.2 ? "middle" : Math.cos(g.angle) > 0 ? "start" : "end";
          return (
            <g
              key={g.label}
              ref={(el) => { gateRefs.current[i] = el; }}
              className="tc-gate"
              data-busy={staticSim && staticSim.queues[i].length + staticSim.overflow[i] > 6 ? "true" : "false"}
              suppressHydrationWarning
            >
              <circle cx={gx} cy={gy} r={9} className="tc-gate-ring" strokeWidth={1.5} />
              <line
                x1={polar(R_OUT - 6, g.angle)[0]}
                y1={polar(R_OUT - 6, g.angle)[1]}
                x2={polar(R_OUT + 6, g.angle)[0]}
                y2={polar(R_OUT + 6, g.angle)[1]}
                style={{ stroke: "var(--c-fg-2)" }}
                strokeWidth={1.5}
              />
              <text
                x={lx}
                y={ly + (Math.sin(g.angle) < -0.5 ? -4 : 10)}
                textAnchor={anchor}
                className="font-mono uppercase"
                style={{ fill: "var(--c-fg-3)", fontSize: 14, letterSpacing: "0.12em" }}
              >
                {g.label.split(" & ").map((part, j, arr) => (
                  <tspan key={part} x={lx} dy={j === 0 ? 0 : 17}>
                    {part}
                    {j < arr.length - 1 ? " &" : ""}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {/* Hands */}
        <line ref={outerHand} suppressHydrationWarning x1={C} y1={C} x2={ox0} y2={oy0} style={{ stroke: "var(--c-fg-3)" }} strokeWidth={1.5} strokeLinecap="round" />
        <line ref={innerHand} suppressHydrationWarning x1={C} y1={C} x2={ix0} y2={iy0} style={{ stroke: "var(--c-accent)" }} strokeWidth={2.25} strokeLinecap="round" />
        <circle cx={C} cy={C} r={4} style={{ fill: "var(--c-accent)" }} />

        {/* Center labels */}
        <text x={C} y={C + 50} textAnchor="middle" className="font-mono uppercase" style={{ fill: "var(--c-accent)", fontSize: 10.5, letterSpacing: "0.18em" }}>
          Factory
        </text>

        {/* Work items */}
        {Array.from({ length: POOL }, (_, i) => {
          const d = shownDots[i];
          return (
            <circle
              key={i}
              ref={(el) => { circles.current[i] = el; }}
              suppressHydrationWarning
              r={4.2}
              cx={d ? d.x.toFixed(1) : C}
              cy={d ? d.y.toFixed(1) : C}
              opacity={d ? d.o.toFixed(2) : 0}
              style={{ fill: d ? TONE_FILL[d.tone] : TONE_FILL.accent }}
            />
          );
        })}
      </svg>

      <dl className={`grid grid-cols-3 ${isIntro ? "order-first mb-3 lg:order-none lg:mb-0 lg:mt-4" : "mt-4"} mx-auto w-full max-w-[560px] gap-px overflow-hidden rounded-xl border border-line bg-line font-sans`}>
        {[
          { label: "In the factory", ref: cIn, value: shownCounts.inFactory, tone: "text-accent" },
          { label: "Waiting at the boundary", ref: cWait, value: shownCounts.waiting, tone: "text-fg" },
          { label: "Reached customers", ref: cShip, value: shownCounts.shipped, tone: "text-signal" },
        ].map((c) => (
          <div key={c.label} className="bg-bg/90 px-3 py-3 text-center">
            <dt className="eyebrow text-[9.5px] text-fg-4">{c.label}</dt>
            <dd className={`mt-1 font-display text-2xl tabular-nums ${c.tone}`}>
              <span ref={c.ref}>{c.value}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );

  if (!isIntro) {
    return (
      <figure ref={figRef} className="not-prose my-14">
        {graphic}
        <figcaption className="mx-auto mt-4 max-w-xl text-center font-sans text-[13px] leading-relaxed text-fg-3">
          {caption || "Same factory, same boundary. With evidence flowing and slack at the handoffs, the clocks mesh."}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      ref={figRef}
      className="not-prose relative my-16 lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-8"
      aria-label="Two clocks: a scroll story in three steps"
    >
      <div className="sticky top-16 z-0 flex h-[64svh] items-start justify-center pt-2 lg:order-2 lg:items-center lg:pt-0 lg:self-start lg:top-[4.5rem] lg:h-[calc(100svh-5.5rem)]">
        {graphic}
      </div>
      <div className="relative z-10 pb-[18svh] lg:order-1 lg:py-[22svh]">
        {steps.map((text, i) => (
          <div
            key={i}
            className={`flex ${i < steps.length - 1 ? "mb-[64svh] lg:mb-0" : ""} lg:min-h-[78svh] lg:items-center`}
          >
            <div
              ref={(el) => { stepRefs.current[i] = el; }}
              data-step={i}
              className={`relative mx-auto w-full max-w-md rounded-2xl border bg-bg/90 p-5 shadow-[var(--shadow-soft)] backdrop-blur-md transition-[border-color,opacity] duration-500 lg:p-6 ${
                stage === i ? "border-accent/50 opacity-100" : "border-line-2 lg:opacity-45"
              }`}
            >
              <p className="eyebrow text-accent">
                {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </p>
              <p className="mt-3 font-display text-[1.2rem] leading-snug text-fg lg:text-[1.28rem]">{text}</p>
            </div>
          </div>
        ))}
      </div>
      {caption && <figcaption className="mt-4 text-center font-sans text-[13px] text-fg-3 lg:col-span-2">{caption}</figcaption>}
    </figure>
  );
}
