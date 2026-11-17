"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { FLAGSHIP_PLATFORMS, OVERVIEW, EXECUTIVE_PROFILE } from "@/data/portfolioData";
import { useFinePointer, useMediaQuery } from "@/lib/hooks";
import { EASE, SCROLL_SPRING, useReducedMotionSafe } from "./motion";
import { Phone3D, ListingScreen, SplashScreen, type Finish } from "./Phone3D";
import { BriefLink, Emphasis, FilmButton } from "./primitives";

const platform = (id: string) => {
  const found = FLAGSHIP_PLATFORMS.find((entry) => entry.id === id);
  if (!found) throw new Error(`Unknown flagship: ${id}`);
  return found;
};

/**
 * The lineup: KIB Mobile faces you; four more lines of the same factory stand behind it with their backs turned,
 * like a colour lineup, and turn round one by one as the page scrolls. Positions are in phone widths.
 */
const LINEUP: { id: string; slot: number; finish: Finish; x: number; y: number; z: number; turn: number }[] = [
  { id: "kib-invest", slot: -2, finish: "blue", x: -1.8, y: 0.17, z: -0.66, turn: 40 },
  { id: "kib-corporate", slot: -1, finish: "silver", x: -1.0, y: 0.06, z: -0.24, turn: 26 },
  { id: "kib-mobile", slot: 0, finish: "midnight", x: 0, y: 0, z: 0.16, turn: 0 },
  { id: "kib-aqari", slot: 1, finish: "natural", x: 1.0, y: 0.06, z: -0.24, turn: -26 },
  { id: "kib-buynow", slot: 2, finish: "midnight", x: 1.8, y: 0.17, z: -0.66, turn: -40 },
];

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/** 01 · Overview, the opening shot: who, in one bold line, over a lineup of phones that turn in as the page loads. */
export default function Hero() {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      data-tone="light"
      data-theme="light"
      className="tone-light launch relative isolate overflow-clip"
    >
      <div className="mx-auto max-w-[76rem] px-5 pt-[calc(3.25rem+clamp(2rem,6.5svh,4.5rem))] text-center sm:px-8">
        <h1 id="hero-title" className="t-kicker l-rise text-l-fg">
          {EXECUTIVE_PROFILE.name}
        </h1>
        <p className="t-display l-rise mx-auto mt-3 text-l-fg sm:mt-4" style={{ ["--delay" as string]: "80ms", ["--rise" as string]: "28px" }}>
          {OVERVIEW.headline.map((line, i) => (
            <span key={line} className="block">
              <Emphasis text={line} />
              {i < OVERVIEW.headline.length - 1 ? " " : null}
            </span>
          ))}
        </p>
        <p className="t-lede l-rise mx-auto mt-5 max-w-[30ch] text-l-fg-3 sm:mt-6" style={{ ["--delay" as string]: "200ms" }}>
          {OVERVIEW.lede}
        </p>
        <div className="l-rise mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4" style={{ ["--delay" as string]: "300ms" }}>
          <FilmButton />
          <BriefLink brief="factory" className="text-[17px]" />
        </div>
      </div>

      <Lineup progress={progress} reduce={reduce} />
    </section>
  );
}

function Lineup({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const wide = useMediaQuery("(min-width: 768px)");
  const fine = useFinePointer();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const px = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const py = useSpring(pointerY, { stiffness: 60, damping: 18 });

  // Leaving the opening shot, the lineup leans back a little and drifts up; the pointer steers it gently.
  const tilt = useTransform([progress, py], ([p, y]: number[]) => (reduce ? 0 : p * 10 + y * -3));
  const pan = useTransform(px, (x) => (reduce ? 0 : x * 6));
  const rise = useTransform(progress, (p) => (reduce ? 0 : p * -80));

  const phones = wide ? LINEUP : LINEUP.filter((entry) => Math.abs(entry.slot) < 2);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto mt-10 h-[calc(var(--lw)*1.62)] w-full sm:mt-14"
      style={{ ["--lw" as string]: "clamp(9.75rem, 18vw, 17.5rem)", perspective: "1700px", perspectiveOrigin: "50% 15%" }}
      onPointerMove={(event) => {
        if (!fine || reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
        pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <motion.div className="absolute inset-x-0 top-0 [transform-style:preserve-3d]" style={{ rotateX: tilt, rotateY: pan, y: rise }}>
        {phones.map((entry) => (
          <LineupPhone key={entry.id} entry={entry} progress={progress} reduce={reduce} />
        ))}
      </motion.div>
    </div>
  );
}

function LineupPhone({ entry, progress, reduce }: { entry: (typeof LINEUP)[number]; progress: MotionValue<number>; reduce: boolean }) {
  const app = platform(entry.id);
  const front = entry.slot === 0;
  const side = Math.abs(entry.slot);
  // Backs first; each side phone turns round over its own stretch of the scroll, inner ones first.
  const start = 0.02 + (side - 1) * 0.09;
  const turn = useTransform(progress, (p) => {
    if (front || reduce) return entry.turn;
    const back = 1 - smooth((p - start) / 0.3);
    return entry.turn + (entry.slot < 0 ? -180 : 180) * back;
  });
  const spread = useTransform(progress, (p) => `${reduce ? 0 : entry.slot * p * 16}%`);
  const delay = 0.3 + side * 0.13;

  return (
    <div
      className="absolute left-1/2 top-0 [transform-style:preserve-3d]"
      style={{
        marginLeft: "calc(var(--lw) * -0.5)",
        transform: `translate3d(calc(var(--lw) * ${entry.x}), calc(var(--lw) * ${entry.y}), calc(var(--lw) * ${entry.z}))`,
      }}
    >
      <motion.div
        className="relative [transform-style:preserve-3d]"
        initial={reduce ? false : { y: "118%", rotateY: front ? 180 : entry.slot < 0 ? 70 : -70 }}
        animate={{ y: "0%", rotateY: 0 }}
        transition={{
          y: { duration: 1.4, ease: EASE, delay },
          rotateY: { duration: front ? 2.2 : 1.8, ease: EASE, delay: delay + 0.05 },
        }}
        style={{ x: spread }}
      >
        <Phone3D
          width="var(--lw)"
          finish={entry.finish}
          rotateY={turn}
          screen={
            front ? (
              <ListingScreen icon={app.iconPath} name={app.name} maker={`${app.institution} · ${app.domain}`} shots={app.screenshots} priority />
            ) : (
              app.iconPath && <SplashScreen icon={app.iconPath} name={app.name} priority />
            )
          }
        />
      </motion.div>
    </div>
  );
}
