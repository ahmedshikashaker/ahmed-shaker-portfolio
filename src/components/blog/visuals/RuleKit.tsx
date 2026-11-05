"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FileCheck2, Gauge, Search, Undo2 } from "lucide-react";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * "The new rules, assembled": the four pieces of the new rules (each from an earlier essay in the series) and the
 * cells of the gatekeeper's payoff table each one changes. The scores match GatekeeperMath ("old" → "new").
 * While in view, the pieces are highlighted in turn; hovering or focusing a piece highlights it.
 */

type CellId = "aw" | "ab" | "hw" | "hb";

const CELLS: Record<CellId, { row: string; col: string; from: number; to: number }> = {
  aw: { row: "Approve now", col: "It works", from: 0, to: 2 },
  ab: { row: "Approve now", col: "It breaks", from: -10, to: -2 },
  hw: { row: "Hold", col: "It works", from: 0, to: -1 },
  hb: { row: "Hold", col: "It breaks", from: -2, to: -3 },
};

const PIECES: { id: string; icon: typeof Gauge; name: string; what: string; from: string; href: string; cells: CellId[] }[] = [
  {
    id: "lead",
    icon: Gauge,
    name: "A shared lead-time objective",
    what: "Speed counts for the person who says yes, and holding shows on the chart everyone watches.",
    from: "Essay 3",
    href: "/blog/the-one-number-a-board-should-watch",
    cells: ["aw", "hw"],
  },
  {
    id: "small",
    icon: Undo2,
    name: "Small releases, automatic rollback",
    what: "Failure becomes small and short. Batching changes into one big release becomes the risky choice.",
    from: "Essays 1 and 2",
    href: "/blog/evidence-not-meetings",
    cells: ["ab", "hb"],
  },
  {
    id: "evidence",
    icon: FileCheck2,
    name: "Evidence by default",
    what: "Accountability moves from one person’s signature to a policy the risk team owns.",
    from: "Essay 2",
    href: "/blog/evidence-not-meetings",
    cells: ["ab"],
  },
  {
    id: "blameless",
    icon: Search,
    name: "Blameless incident reviews",
    what: "A failure starts an inquiry into what made it easy to miss, not a search for a name.",
    from: "This essay",
    href: "#what-happens-after-something-breaks",
    cells: ["ab"],
  },
];

const sign = (n: number) => (n > 0 ? `+${n}` : n === 0 ? "0" : `−${Math.abs(n)}`);

export default function RuleKit({ caption }: { caption?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotionAfterMount();
  const [auto, setAuto] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  // Cycle through the pieces while the figure is on screen (not with reduced motion, not while hovering).
  useEffect(() => {
    if (reduced !== false || !inView || hover !== null) return;
    setAuto((a) => (a === null ? 0 : a));
    const id = window.setInterval(() => setAuto((a) => ((a ?? -1) + 1) % PIECES.length), 2400);
    return () => window.clearInterval(id);
  }, [reduced, inView, hover]);

  const active = hover ?? auto;
  const lit = active === null ? null : new Set(PIECES[active].cells);

  return (
    <figure ref={ref} className="not-prose my-14 font-sans">
      <div className="grid gap-5 rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
        <div>
          <p className="eyebrow text-fg-4">The gatekeeper’s payoffs, old → new</p>
          <div className="mt-3 grid grid-cols-[4.6rem_minmax(0,1fr)_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-line text-[12px]" style={{ gap: 1 }}>
            <div className="bg-surface-2/60" />
            <div className="bg-surface-2/60 px-2.5 py-2 font-medium text-fg">It works</div>
            <div className="bg-surface-2/60 px-2.5 py-2 font-medium text-fg">It breaks</div>
            {(["Approve now", "Hold"] as const).map((row) => (
              <div key={row} className="contents">
                <div className="flex items-center bg-surface-2/60 px-2.5 py-3 font-medium leading-tight text-fg">{row}</div>
                {(Object.keys(CELLS) as CellId[])
                  .filter((k) => CELLS[k].row === row)
                  .map((k) => {
                    const c = CELLS[k];
                    const on = lit?.has(k);
                    return (
                      <div key={k} className={`px-2.5 py-3 transition-colors duration-300 ${on ? "bg-accent/[0.14]" : "bg-surface"}`}>
                        <span className="font-mono text-[12px] tabular-nums text-fg-4 line-through decoration-fg-4/70">{sign(c.from)}</span>
                        <span className="mx-1.5 text-fg-4">→</span>
                        <span className={`font-display text-[1.35rem] leading-none tabular-nums ${c.to > 0 ? "text-signal" : "text-danger"}`}>{sign(c.to)}</span>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-fg-3">
            Holding used to be free. Now it costs something, and approving no longer risks a career. Same people, same change; different arithmetic.
          </p>
        </div>

        <ul className="grid gap-2.5 sm:grid-cols-2">
          {PIECES.map((p, i) => {
            const Icon = p.icon;
            const on = active === i;
            return (
              <li
                key={p.id}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className={`flex flex-col rounded-xl border p-3.5 transition-colors duration-300 ${on ? "border-accent/60 bg-accent/[0.07]" : "border-line bg-bg-2/40"}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${on ? "border-accent text-accent" : "border-line-2 text-fg-3"}`}>
                    <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <p className="text-[13.5px] font-medium leading-snug text-fg">{p.name}</p>
                </div>
                <p className="mt-2 text-[12.5px] leading-snug text-fg-3">{p.what}</p>
                <a href={p.href} className="mt-auto pt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent hover:underline">
                  From {p.from} →
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="mx-auto mt-4 max-w-xl text-center text-[13px] leading-relaxed text-fg-3">
        {caption || "Each piece of the new rules comes from an earlier essay, and each fixes a cell in the gatekeeper’s arithmetic. Illustrative scores."}
      </figcaption>
    </figure>
  );
}
