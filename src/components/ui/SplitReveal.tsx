"use client";

import { motion, type Variants } from "framer-motion";
import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";

type Segment = { text: string; em: boolean };

/** "Building *two factories* today" → plain / emphasised segments. */
export function parseEmphasis(input: string): Segment[] {
  return input
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*")
        ? { text: part.slice(1, -1), em: true }
        : { text: part, em: false }
    );
}

const word: Variants = {
  hidden: { y: "108%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE_OUT } },
};

interface SplitRevealProps {
  text: string;
  className?: string;
  emClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
}

/**
 * Masked word-by-word reveal for headings. Words stay real text (selectable, indexable);
 * `*emphasis*` segments render as italic accent words.
 */
export function SplitReveal({ text, className, emClassName, delay = 0, stagger = 0.045, immediate = false }: SplitRevealProps) {
  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } };

  return (
    <motion.span
      className={cn("block", className)}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...trigger}
    >
      {parseEmphasis(text).map((segment, si) => (
        <Fragment key={si}>
          {segment.text.split(/(\s+)/).map((token, ti) => {
            if (!token) return null;
            if (/^\s+$/.test(token)) return <Fragment key={ti}> </Fragment>;
            const Word = segment.em ? motion.em : motion.span;
            return (
              <span key={ti} className="-mb-[0.14em] -mr-[0.06em] inline-block overflow-hidden pr-[0.06em] pb-[0.14em] align-bottom">
                <Word variants={word} className={cn("inline-block", segment.em && cn("italic text-accent", emClassName))}>
                  {token}
                </Word>
              </span>
            );
          })}
        </Fragment>
      ))}
    </motion.span>
  );
}
