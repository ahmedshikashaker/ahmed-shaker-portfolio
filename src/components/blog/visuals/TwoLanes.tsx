"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * "Two lanes": the same bank, two ways of approving.
 * - Card payments flow through rules and fraud models one by one, in milliseconds; a few are sent to a person.
 * - Software changes queue at a weekly change board and are released together, as one large batch.
 * Every position is a pure function of time, so the server frame and the first client frame match exactly.
 * After hydration a requestAnimationFrame loop writes positions to the SVG directly, paused when off-screen.
 */

const W = 600;
const Y = 42;
const GATE_X = 330;
const POOL = 18;
const R_DOT = 7;
const r1 = (n: number) => Math.round(n * 10) / 10;
/** Dots fade over the last stretch of the track instead of sliding past the arrowhead. */
const fadeOut = (x: number) => Math.max(0, Math.min(1, (W - 24 - x) / 48));

/* ---------------------------------------------------------------- Lane A: card payments */

const A_EVERY = 0.42; // s between payments
const A_SPEED = 150; // units per second
const A_FLAG_EVERY = 9; // one in nine goes to a person
const A_TO_GATE = (GATE_X + 10) / A_SPEED;
const TRAY_Y = 92;

interface Dot {
  x: number;
  y: number;
  o: number;
  tone: "idle" | "ok" | "flag" | "wait";
}

function laneA(t: number): (Dot | null)[] {
  const out: (Dot | null)[] = new Array(POOL).fill(null);
  const maxAge = 6;
  const first = Math.max(0, Math.ceil((t - maxAge) / A_EVERY));
  const last = Math.floor(t / A_EVERY);
  for (let n = first; n <= last; n++) {
    const age = t - n * A_EVERY;
    const flagged = n % A_FLAG_EVERY === 4;
    let x = -10 + age * A_SPEED;
    let y = Y;
    let o = 1;
    let tone: Dot["tone"] = x > GATE_X ? "ok" : "idle";
    if (flagged && age > A_TO_GATE) {
      const b = age - A_TO_GATE;
      const e = Math.min(1, b / 0.7);
      const ease = 1 - (1 - e) * (1 - e);
      const slotX = 380 + (Math.floor(n / A_FLAG_EVERY) % 6) * 30;
      x = GATE_X + ease * (slotX - GATE_X);
      y = Y + ease * (TRAY_Y - Y);
      tone = "flag";
      o = b > 2.6 ? Math.max(0, 1 - (b - 2.6) / 0.5) : 1;
      if (b > 3.1) continue;
    } else if (x > W + 12) continue;
    else o = fadeOut(x);
    out[n % POOL] = { x: r1(x), y: r1(y), o: r1(o), tone };
  }
  return out;
}

const countA = (t: number) => {
  const passed = t < A_TO_GATE ? 0 : Math.floor((t - A_TO_GATE) / A_EVERY) + 1;
  const flagged = passed <= 4 ? 0 : Math.floor((passed - 5) / A_FLAG_EVERY) + 1;
  return { passed, flagged };
};

/* ---------------------------------------------------------------- Lane B: software changes */

const B_EVERY = 0.75;
const B_SPEED = 150;
const WEEK = 6; // s between change boards
const BOARD_AT = (k: number) => k * WEEK + 5; // release times
const B_TO_QUEUE = 2.2; // s from spawn to the queue, roughly
const QUEUE_HEAD = GATE_X - 14;
const SPACING = 16;
const OUT_SPEED = 190;

function batchOf(spawn: number) {
  // The first board that happens after this change reaches the queue.
  return Math.max(0, Math.ceil((spawn + B_TO_QUEUE - 5) / WEEK));
}

function laneB(t: number): { dots: (Dot | null)[]; open: boolean; lastBatch: number } {
  const dots: (Dot | null)[] = new Array(POOL).fill(null);
  const maxAge = WEEK + 6;
  const first = Math.max(0, Math.ceil((t - maxAge) / B_EVERY));
  const last = Math.floor(t / B_EVERY);
  for (let n = first; n <= last; n++) {
    const spawn = n * B_EVERY;
    const k = batchOf(spawn);
    // Position in the queue: how many earlier changes share this batch.
    let j = 0;
    for (let m = n - 1; m >= 0 && batchOf(m * B_EVERY) === k; m--) j++;
    const qx = QUEUE_HEAD - j * SPACING;
    const release = BOARD_AT(k);
    let x: number;
    let tone: Dot["tone"];
    if (t < release) {
      const travel = -10 + (t - spawn) * B_SPEED;
      x = Math.min(travel, qx);
      tone = travel >= qx ? "wait" : "idle";
    } else {
      x = qx + (t - release) * OUT_SPEED;
      tone = "idle";
    }
    if (x > W + 12) continue;
    dots[n % POOL] = { x: r1(x), y: Y, o: r1(fadeOut(x)), tone };
  }
  const lastK = t < BOARD_AT(0) ? -1 : Math.floor((t - BOARD_AT(0)) / WEEK);
  const lastBatch = lastK < 0 ? 0 : countBatch(lastK);
  const open = lastK >= 0 && t - BOARD_AT(lastK) < 0.9;
  return { dots, open, lastBatch };
}

/** Changes released at board k: those spawned in the window that feeds it (constant work, however long the page is open). */
function countBatch(k: number) {
  const lo = Math.max(0, Math.floor((BOARD_AT(k - 1) - B_TO_QUEUE) / B_EVERY) - 1);
  const hi = Math.ceil((BOARD_AT(k) - B_TO_QUEUE) / B_EVERY) + 1;
  let c = 0;
  for (let n = lo; n <= hi; n++) if (batchOf(n * B_EVERY) === k) c++;
  return c;
}

const TONE_FILL: Record<Dot["tone"], string> = {
  idle: "var(--c-fg-3)",
  ok: "var(--c-signal)",
  flag: "var(--c-accent)",
  wait: "var(--c-danger)",
};

const T0 = 10.6; // deterministic first frame: payments flowing, a full queue just before Tuesday's board

export default function TwoLanes({ caption }: { caption?: string }) {
  const reduced = useReducedMotionAfterMount();
  const figRef = useRef<HTMLElement>(null);
  const aRefs = useRef<(SVGCircleElement | null)[]>([]);
  const bRefs = useRef<(SVGCircleElement | null)[]>([]);
  const gateRef = useRef<SVGRectElement>(null);
  const tuesdayRef = useRef<HTMLSpanElement>(null);
  const checkedRef = useRef<HTMLSpanElement>(null);
  const flaggedRef = useRef<HTMLSpanElement>(null);
  const batchRef = useRef<HTMLSpanElement>(null);

  const a0 = useMemo(() => laneA(T0), []);
  const b0 = useMemo(() => laneB(T0), []);
  const c0 = useMemo(() => countA(T0), []);

  useEffect(() => {
    if (reduced !== false) return;
    let t = T0;
    let last = performance.now();
    let raf = 0;
    let visible = false;
    const toneA: (string | null)[] = new Array(POOL).fill(null);
    const toneB: (string | null)[] = new Array(POOL).fill(null);

    const paint = (refs: (SVGCircleElement | null)[], dots: (Dot | null)[], tones: (string | null)[]) => {
      for (let i = 0; i < POOL; i++) {
        const el = refs[i];
        if (!el) continue;
        const d = dots[i];
        if (!d) {
          if (el.getAttribute("opacity") !== "0") el.setAttribute("opacity", "0");
          continue;
        }
        el.setAttribute("cx", String(d.x));
        el.setAttribute("cy", String(d.y));
        el.setAttribute("opacity", String(d.o));
        if (tones[i] !== d.tone) {
          el.style.fill = TONE_FILL[d.tone];
          tones[i] = d.tone;
        }
      }
    };

    const tick = (now: number) => {
      if (!visible) return;
      t += Math.min(0.1, (now - last) / 1000);
      last = now;
      paint(aRefs.current, laneA(t), toneA);
      const b = laneB(t);
      paint(bRefs.current, b.dots, toneB);
      if (gateRef.current) gateRef.current.style.fill = b.open ? "var(--c-signal)" : "var(--c-danger)";
      if (tuesdayRef.current) tuesdayRef.current.dataset.on = b.open ? "true" : "false";
      const c = countA(t);
      if (checkedRef.current) checkedRef.current.textContent = String(c.passed);
      if (flaggedRef.current) flaggedRef.current.textContent = String(c.flagged);
      if (batchRef.current) batchRef.current.textContent = String(b.lastBatch);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    });
    if (figRef.current) io.observe(figRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced]);

  const dotsSvg = (dots: (Dot | null)[], refs: React.MutableRefObject<(SVGCircleElement | null)[]>) =>
    dots.map((d, i) => (
      <circle
        key={i}
        ref={(el) => {
          refs.current[i] = el;
        }}
        r={R_DOT}
        cx={d ? d.x : -20}
        cy={d ? d.y : Y}
        opacity={d ? d.o : 0}
        style={{ fill: d ? TONE_FILL[d.tone] : TONE_FILL.idle }}
      />
    ));

  const track = (
    <>
      <line x1={8} y1={Y} x2={W - 8} y2={Y} style={{ stroke: "var(--c-line-2)" }} strokeWidth={2} strokeLinecap="round" />
      <path d={`M ${W - 20} ${Y - 6} l 8 6 l -8 6`} fill="none" style={{ stroke: "var(--c-line-3)" }} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );

  return (
    <figure ref={figRef} className="not-prose my-14 font-sans">
      <div className="overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-[var(--shadow-soft)]">
        {/* Lane A */}
        <div className="px-5 pb-4 pt-5 sm:px-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-[15px] font-medium text-fg">Card payments</p>
            <p className="text-[12.5px] text-fg-3">checked one by one, in milliseconds, every decision logged</p>
          </div>
          <div className="relative mt-7" dir="ltr">
            <svg viewBox={`0 0 ${W} 110`} className="block h-auto w-full" aria-hidden="true">
              {track}
              <rect x={GATE_X - 4} y={Y - 26} width={8} height={52} rx={4} style={{ fill: "var(--c-signal)" }} />
              <rect x={364} y={TRAY_Y - 16} width={200} height={32} rx={16} style={{ fill: "var(--c-accent)", fillOpacity: 0.08, stroke: "var(--c-accent)", strokeOpacity: 0.35 }} strokeDasharray="3 4" />
              {dotsSvg(a0, aRefs)}
            </svg>
            <span className="absolute bottom-[calc(100%+2px)] -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-signal" style={{ left: `${(GATE_X / W) * 100}%` }}>
              Rules + fraud models
            </span>
            <span className="absolute bottom-[10%] end-[41%] whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-accent max-sm:hidden" dir="ltr">
              A person decides →
            </span>
          </div>
          <p className="mt-1 text-[12px] text-fg-3">
            Checked: <span ref={checkedRef} className="font-mono tabular-nums text-fg-2">{c0.passed}</span> · sent to a person:{" "}
            <span ref={flaggedRef} className="font-mono tabular-nums text-accent">{c0.flagged}</span>
          </p>
        </div>

        {/* Lane B */}
        <div className="border-t border-line px-5 pb-5 pt-5 sm:px-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-[15px] font-medium text-fg">Software changes</p>
            <p className="text-[12.5px] text-fg-3">wait for the weekly change board, then go out together</p>
          </div>
          <div className="relative mt-7" dir="ltr">
            <svg viewBox={`0 0 ${W} 72`} className="block h-auto w-full" aria-hidden="true">
              {track}
              <rect ref={gateRef} x={GATE_X - 4} y={Y - 26} width={8} height={52} rx={4} style={{ fill: b0.open ? "var(--c-signal)" : "var(--c-danger)" }} />
              {dotsSvg(b0.dots, bRefs)}
            </svg>
            <span className="absolute bottom-[calc(100%+2px)] -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-danger" style={{ left: `${(GATE_X / W) * 100}%` }}>
              Weekly change board
            </span>
            <span
              ref={tuesdayRef}
              data-on={b0.open ? "true" : "false"}
              className="absolute -bottom-1 -translate-x-1/2 rounded-full bg-signal px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-on-accent opacity-0 transition-opacity duration-200 data-[on=true]:opacity-100"
              style={{ left: `${(GATE_X / W) * 100}%` }}
            >
              Tuesday
            </span>
          </div>
          <p className="mt-2 text-[12px] text-fg-3">
            Released together at the last board: <span ref={batchRef} className="font-mono tabular-nums text-danger">{b0.lastBatch}</span> changes
          </p>
        </div>

        <p className="sr-only">
          Card payments pass through automated rules and fraud models one at a time, and roughly one in nine is sent to a person to decide. Software changes
          stop and queue at a weekly change board, and every Tuesday the whole queue is released at once, as one large batch.
        </p>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Same bank, two ways of approving. Conceptual illustration."}
      </figcaption>
    </figure>
  );
}
