"use client";

import { animate, motion, useInView, useMotionValue, useScroll, useSpring, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/hooks";

/** Apple-like deceleration: quick to start, long soft landing. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Smooths wheel steps in scroll-linked motion without letting the picture lag the hand. */
export const SCROLL_SPRING = { stiffness: 180, damping: 32, mass: 0.35, restDelta: 0.0005 };

/** Reduced-motion preference that renders the same on the server and in the first client pass. */
export function useReducedMotionSafe() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** A value that never moves: what scroll-linked pieces read when motion is reduced. */
export function useStill(value: number) {
  return useMotionValue(value);
}

/** Fades and lifts its content once, as it comes into view. */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 36,
  as = "div",
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "p" | "li" | "header" | "figure" | "span";
  amount?: number;
}) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}

/**
 * A short pinned moment: the stage holds still on screen while the page scrolls `length` small-viewport heights,
 * and the picture plays against that scroll. With reduced motion it renders `still` in the normal flow instead.
 */
export function Pinned({
  length,
  children,
  still,
  className,
  stageClassName,
}: {
  length: number;
  children: (progress: MotionValue<number>) => ReactNode;
  still: ReactNode;
  className?: string;
  stageClassName?: string;
}) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  if (reduce) return <div className={cn("relative", className)}>{still}</div>;
  return (
    <div ref={ref} className={cn("relative", className)} style={{ height: `${length}svh` }}>
      <div className={cn("sticky top-0 h-svh overflow-clip", stageClassName)}>{children(progress)}</div>
    </div>
  );
}

/** Counts up to `to` the first time it is seen. Renders the final value on the server and with reduced motion. */
export function CountUp({ to, from = 0, suffix = "", duration = 1.6, className }: { to: number; from?: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotionSafe();
  const [value, setValue] = useState(to);
  const armed = useRef(false);

  // Arm on mount (the server already painted the final value), then play once in view. The reduced-motion
  // preference is only known after hydration, so it can arrive after arming: then show the final value.
  useEffect(() => {
    if (reduce) {
      setValue(to);
      return;
    }
    if (armed.current) return;
    armed.current = true;
    if (!inView) setValue(from);
  }, [reduce, inView, from, to]);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(from, to, { duration, ease: EASE, onUpdate: (latest) => setValue(Math.round(latest)) });
    return () => controls.stop();
  }, [inView, reduce, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
