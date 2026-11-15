import type { Transition, Variants } from "framer-motion";

/** Motion tokens. No overshoot anywhere: this is a banking audience, so motion stays calm and decisive. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Critically damped spring (damping ratio ≈ 1) for interactive, interruptible motion. */
export const SPRING: Transition = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 };

/** Content swap inside a reader: the old content leaves faster than the new arrives. */
export const crossfade: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE_IN_OUT } },
};
