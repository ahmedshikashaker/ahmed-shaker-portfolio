"use client";

import { useEffect, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Whether the reader prefers reduced motion, but only after mount: `null` during server render and the first
 * client render, so both produce the same static frame and hydration never mismatches.
 */
export function useReducedMotionAfterMount(): boolean | null {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? Boolean(prefersReduced) : null;
}

/**
 * A step counter for visuals that build up in stages when they scroll into view.
 * Returns `steps` (the finished drawing) on the server, with reduced motion, and once played; after mount it
 * rewinds to 0 while off-screen, then counts up one step every `everyMs` when the reader arrives.
 */
export function useStepsOnView(ref: React.RefObject<HTMLElement | null>, steps: number, everyMs = 700, amount = 0.45): number {
  const inView = useInView(ref as React.RefObject<Element>, { amount, once: true });
  const reduced = useReducedMotionAfterMount();
  const [step, setStep] = useState(steps);

  useEffect(() => {
    if (reduced === false && !inView) setStep(0);
  }, [reduced, inView]);

  useEffect(() => {
    if (reduced !== false || !inView) return;
    let n = 0;
    setStep(0);
    const id = window.setInterval(() => {
      n += 1;
      setStep(n);
      if (n >= steps) window.clearInterval(id);
    }, everyMs);
    return () => window.clearInterval(id);
  }, [reduced, inView, steps, everyMs]);

  return step;
}
