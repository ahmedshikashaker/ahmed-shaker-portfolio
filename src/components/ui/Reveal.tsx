"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT, fadeUp } from "@/lib/motion";

const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

type Tag = "div" | "li" | "p" | "span" | "section" | "article" | "header" | "ul" | "ol" | "dl" | "figure";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: Tag;
}

/** Fades and lifts content in once, as it enters the viewport. */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: Tag;
}

/** Parent that reveals its <StaggerItem> children in sequence. */
export function Stagger({ children, className, delay = 0, stagger = 0.08, as = "div" }: StaggerProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
