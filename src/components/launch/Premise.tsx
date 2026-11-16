"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Fragment, useRef, type ReactNode } from "react";
import { PLATFORM_REGISTRY, PROOF_METRICS, STORY } from "@/data/portfolioData";
import { cn } from "@/lib/cn";
import { CountUp, EASE, SCROLL_SPRING, useReducedMotionSafe } from "./motion";
import { Band, Wrap } from "./primitives";

interface Word {
  text: string;
  em: boolean;
  index: number;
}

/** The premise as words, numbered across all four lines, with `*asterisk*` accents kept. */
const LINES: Word[][] = (() => {
  let index = 0;
  return STORY.premise.map((line) =>
    line
      .split(/(\*[^*]+\*)/g)
      .filter(Boolean)
      .flatMap((part) => {
        const em = part.startsWith("*") && part.endsWith("*");
        return (em ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean).map((text) => ({ text, em, index: index++ }));
      })
  );
})();
const WORDS = LINES.reduce((total, line) => total + line.length, 0);

const ICONS = [...new Set(PLATFORM_REGISTRY.map((entry) => entry.iconPath).filter((path): path is string => Boolean(path)))];

/** 01 · Overview, the premise: why a bank builds its own factory, lit up word by word as it scrolls past. Then the proof. */
export default function Premise() {
  return (
    <Band tone="dark" labelledBy="premise-title" className="overflow-clip">
      <h2 id="premise-title" className="sr-only">
        Why a bank builds its own Digital Factory
      </h2>
      <Statement />
      <Proof />
    </Band>
  );
}

function Statement() {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.5"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <Wrap className="pb-[clamp(5rem,10vw,8rem)] pt-[clamp(7rem,15vw,12rem)]">
      <div ref={ref} className="space-y-[0.6em] font-head text-[clamp(2.1rem,5.1vw,4.6rem)] font-bold leading-[1.08] tracking-[-0.038em]">
        {LINES.map((line, i) => (
          <p key={i} className="max-w-[21ch]">
            {line.map((word, j) => (
              <Fragment key={word.index}>
                <LitWord word={word} progress={progress} reduce={reduce} />
                {j < line.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </Wrap>
  );
}

function LitWord({ word, progress, reduce }: { word: Word; progress: MotionValue<number>; reduce: boolean }) {
  const start = word.index / WORDS;
  const opacity = useTransform(progress, [start - 0.04, start + 1.4 / WORDS], [0.16, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className={word.em ? "text-l-accent" : "text-l-fg"}>
      {word.text}
    </motion.span>
  );
}

const METRIC = Object.fromEntries(PROOF_METRICS.map((metric) => [metric.id, metric]));

function Proof() {
  return (
    <Wrap className="pb-[clamp(5rem,9vw,8rem)]">
      <ul className="grid gap-4 sm:gap-5 lg:grid-cols-4 lg:grid-rows-[minmax(17rem,auto)_minmax(17rem,auto)]">
        <Tile id="platforms" to={16} suffix="+" className="lg:col-span-2 lg:row-span-2" delay={0}>
          <IconWall />
        </Tile>
        <Tile id="factories" to={2} className="lg:col-span-2" delay={0.08} />
        <Tile id="lines" to={8} suffix="+" delay={0.14} />
        <Tile id="lock-in" to={0} from={9} delay={0.2} />
      </ul>
    </Wrap>
  );
}

function Tile({
  id,
  to,
  from = 0,
  suffix,
  className,
  delay,
  children,
}: {
  id: string;
  to: number;
  from?: number;
  suffix?: string;
  className?: string;
  delay: number;
  children?: ReactNode;
}) {
  const metric = METRIC[id];
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EASE, delay }}
      className={cn("relative isolate flex min-h-[15rem] flex-col overflow-hidden rounded-[28px] bg-l-card p-7 sm:p-9", className)}
    >
      <CountUp to={to} from={from} suffix={suffix} className="t-num text-[clamp(4.25rem,7.4vw,7rem)] text-l-fg" />
      <span className="sr-only">: </span>
      <span className="t-h4 mt-4 max-w-[22ch] text-l-fg">{metric.label}</span>
      <span className="t-small mt-2 text-l-fg-3">{metric.detail}</span>
      {children}
    </motion.li>
  );
}

/** Every platform's real store icon, tilted back into the tile like a wall of apps. */
function IconWall() {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  return (
    <div ref={ref} aria-hidden="true" className="relative -mx-7 -mb-7 mt-8 h-[16rem] shrink-0 [perspective:1100px] sm:-mx-9 sm:-mb-9 lg:h-auto lg:min-h-[17rem] lg:flex-1">
      <span className="absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-l-card to-transparent" />
      <motion.div style={{ y: drift }} className="absolute left-1/2 top-[6%] w-[150%] -translate-x-1/2 [transform-style:preserve-3d]">
        <div className="grid grid-cols-6 gap-[clamp(0.75rem,1.6vw,1.25rem)] [transform:rotateX(38deg)_rotateZ(-14deg)] [transform-style:preserve-3d]">
          {[...ICONS, ...ICONS].map((icon, i) => (
            <span key={`${icon}-${i}`} className="relative block aspect-square overflow-hidden rounded-[23%] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
              <Image src={icon} alt="" fill sizes="96px" className="object-cover" />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
