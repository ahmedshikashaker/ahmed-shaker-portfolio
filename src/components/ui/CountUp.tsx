"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";

/**
 * Counts the first number in `value` up from zero when scrolled into view ("02", "16+", "10+").
 * The final value is server-rendered, so crawlers and no-JS readers always see the real figure.
 */
export function CountUp({ value, className, duration = 1.8, delay = 0 }: { value: string; className?: string; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();

  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const numeric = Boolean(match);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = match ? parseInt(digits, 10) : 0;
  const pad = digits.length > 1 && digits.startsWith("0") ? digits.length : 0;

  const count = useMotionValue(target);
  const text = useTransform(() => {
    const rounded = String(Math.round(count.get()));
    return prefix + (pad ? rounded.padStart(pad, "0") : rounded) + suffix;
  });

  useEffect(() => {
    if (!numeric || reduce) return;
    if (!inView) {
      count.set(0);
      return;
    }
    const controls = animate(count, target, { duration, delay, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, reduce, numeric, target, duration, delay, count]);

  if (!numeric) return <span className={className}>{value}</span>;

  return (
    <motion.span ref={ref} className={cn("numeric", className)}>
      {text}
    </motion.span>
  );
}
