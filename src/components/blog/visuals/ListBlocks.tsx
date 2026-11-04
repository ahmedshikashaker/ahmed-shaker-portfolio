"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionAfterMount } from "./useMotionReady";

/**
 * Wrappers that turn an ordinary Markdown list into a visual:
 * - Steps: a numbered path (styles: .steps-body in globals.css).
 * - CardGrid: a grid of cards, the bold lead of each item as its title (styles: .cardgrid-body).
 * Items fade up one after another the first time the list scrolls into view. The server renders them visible,
 * so the static and no-JS versions are complete; they're only hidden on the client while waiting off-screen.
 */

function RevealList({ className, style, children }: { className: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });
  const reduced = useReducedMotionAfterMount();
  const [state, setState] = useState<"shown" | "armed">("shown");

  useEffect(() => {
    if (reduced === false && !inView) setState("armed");
  }, [reduced, inView]);
  useEffect(() => {
    if (reduced === false && inView) {
      const id = window.setTimeout(() => setState("shown"), 40);
      return () => window.clearTimeout(id);
    }
  }, [reduced, inView]);

  return (
    <div ref={ref} className={`reveal-list ${className}`} data-reveal={state} style={style}>
      {children}
    </div>
  );
}

export function Steps({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="not-prose my-12 font-sans">
      {title && <p className="eyebrow mb-5 text-accent">{title}</p>}
      <RevealList className="steps-body">{children}</RevealList>
    </div>
  );
}

export function CardGrid({ title, label, children }: { title?: string; label?: string; children?: React.ReactNode }) {
  return (
    <div className="not-prose my-12 font-sans">
      {title && <p className="eyebrow mb-4 text-accent">{title}</p>}
      <RevealList className="cardgrid-body" style={label ? ({ "--card-label": JSON.stringify(label) } as React.CSSProperties) : undefined}>
        {children}
      </RevealList>
    </div>
  );
}
