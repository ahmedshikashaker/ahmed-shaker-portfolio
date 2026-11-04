"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

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
