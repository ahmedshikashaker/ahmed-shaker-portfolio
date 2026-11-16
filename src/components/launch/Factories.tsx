"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Landmark, Layers, LayoutDashboard, Plus, ShieldCheck, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FACTORIES,
  FACTORY_BLUEPRINT,
  FLAGSHIP_PLATFORMS,
  LINE_PLATFORM,
  PLATFORM_REGISTRY,
  SECTION_COPY,
} from "@/data/portfolioData";
import { cn } from "@/lib/cn";
import { EASE, FadeUp, Pinned, SCROLL_SPRING, useReducedMotionSafe, useStill } from "./motion";
import { ListingScreen, PHONE, Phone3D, StatusBar } from "./Phone3D";
import { Band, BriefLink, Emphasis, Heading, Wrap } from "./primitives";

const [WARBA, KIB] = FACTORIES;

interface Line {
  name: string;
  short: string;
  icon?: string;
}

const lineOf = (name: string): Line => {
  const id = LINE_PLATFORM[name];
  return {
    name,
    short: name.includes("·") ? name.split("·")[1].trim() : name,
    icon: id ? PLATFORM_REGISTRY.find((entry) => entry.id === id)?.iconPath : undefined,
  };
};

const KIB_LINES = KIB.linesUnlocked.map(lineOf);
const WARBA_LINES = WARBA.linesUnlocked.map(lineOf);

/** 02 · Digital Factories: the first factory, the second at full scale, and the blueprint both run on. */
export default function Factories() {
  const copy = SECTION_COPY.factories;
  return (
    <Band id="factories" tone="mist" labelledBy="factories-title">
      <Wrap className="pt-[clamp(5rem,9vw,8rem)]">
        <Heading id="factories-title" kicker={copy.eyebrow} title={<Emphasis text={copy.title} />} sub={copy.subtitle} />
        <FactoryOne />
      </Wrap>
      <FactoryTwo />
      <Blueprint />
    </Band>
  );
}

/* ------------------------------------------------------------------ Factory I */

function FactoryOne() {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const turn = useTransform(progress, [0, 1], reduce ? [-14, -14] : [-48, 22]);
  const tilt = useTransform(progress, [0, 1], reduce ? [4, 4] : [10, -4]);
  const warba = FLAGSHIP_PLATFORMS.find((entry) => entry.id === "warba-mobile");

  return (
    <FadeUp className="mt-14 lg:mt-20" amount={0.15}>
      <article ref={ref} aria-labelledby="factory-one" className="relative grid overflow-hidden rounded-[32px] bg-l-card lg:grid-cols-2">
        <div className="relative z-10 p-8 sm:p-12 lg:py-16 lg:pl-16 lg:pr-4">
          <p className="t-small font-semibold text-l-fg-3">Factory I · {WARBA.period.replace(" – ", "–")}</p>
          <h3 id="factory-one" className="t-h2 mt-3 text-l-fg">
            {WARBA.institution}
          </h3>
          <p className="t-lede mt-1 text-l-fg-3">{WARBA.factoryName}</p>
          <p className="t-body mt-6 max-w-[34ch] text-l-fg-3">
            <span className="font-semibold text-l-fg">{WARBA.role}.</span> {WARBA.mandate}
          </p>
          <ul className="mt-8 space-y-3">
            {WARBA_LINES.map((line) => (
              <li key={line.name} className="flex items-center gap-3.5">
                <AppTile icon={line.icon} name={line.name} className="size-11 rounded-[11px] text-[20px]" />
                <span className="t-body font-medium text-l-fg">{line.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden="true" className="relative h-[24rem] [perspective:1600px] sm:h-[28rem] lg:h-auto">
          <div className="absolute left-1/2 top-[10%] -translate-x-1/2 [transform-style:preserve-3d] lg:top-[14%]">
            {warba && (
              <Phone3D
                width="clamp(11rem, 19vw, 16rem)"
                finish="silver"
                rotateY={turn}
                rotateX={tilt}
                screen={<ListingScreen icon={warba.iconPath} name={warba.name} maker={`${warba.institution} · Al-Wateen`} shots={warba.screenshots} />}
              />
            )}
          </div>
        </div>
      </article>
    </FadeUp>
  );
}

function AppTile({ icon, name, className }: { icon?: string; name: string; className?: string }) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden shadow-[0_6px_14px_-8px_rgba(0,0,0,0.5)]", className)}>
      {icon ? (
        <Image src={icon} alt="" fill sizes="64px" className="object-cover" />
      ) : name === "Backoffice" ? (
        <span className="grid size-full place-items-center bg-[#636366] text-white">
          <LayoutDashboard className="size-1/2" strokeWidth={1.75} />
        </span>
      ) : (
        <span className="grid size-full place-items-center bg-[#ff9500] font-head text-[1.1em] font-bold text-white">
          {name.split("·").pop()?.trim().slice(0, 1)}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ Factory II: one phone, eight lines */

/** Home-screen grid, in phone widths from the phone's top-left corner (the screen sits PHONE.bezel inside it). */
const ICON = 0.168;
const GRID = KIB_LINES.map((_, i) => ({
  x: PHONE.bezel + 0.94 * (0.14 + 0.24 * (i % 4)),
  y: PHONE.bezel + (i < 4 ? 1.0 : 1.3),
}));
const CENTER = { x: 0.5, y: PHONE.height / 2 };

const TURN_END = 0.36;
const FLY_START = 0.42;
const FLY_STEP = 0.032;
const FLY_LENGTH = 0.2;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t: number) => {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

function FactoryTwo() {
  const still = useStill(1);
  return (
    <Pinned
      length={215}
      still={
        <div className="h-[min(100svh,58rem)] min-h-[44rem]">
          <TurnStage progress={still} />
        </div>
      }
    >
      {(progress) => <TurnStage progress={progress} />}
    </Pinned>
  );
}

function TurnStage({ progress }: { progress: MotionValue<number> }) {
  const visualRef = useRef<HTMLDivElement>(null);
  const phoneBoxRef = useRef<HTMLDivElement>(null);
  // How far the ring may reach sideways, in phone widths, so it never leaves the column.
  const [reach, setReach] = useState({ a: 1.36, labels: true });

  useEffect(() => {
    const visual = visualRef.current;
    const box = phoneBoxRef.current;
    if (!visual || !box) return;
    const measure = () => {
      const width = box.offsetWidth || 1;
      const half = visual.offsetWidth / 2;
      const a = Math.min(1.36, Math.max(0.8, (half - 0.2 * width) / width));
      setReach({ a, labels: a >= 1.2 });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(visual);
    return () => observer.disconnect();
  }, []);

  const rotateY = useTransform(progress, (p) => 180 * (1 - easeInOut(p / TURN_END)) - 10 * easeInOut((p - TURN_END) / (1 - TURN_END)));
  const rotateX = useTransform(progress, (p) => 14 * (1 - easeInOut(p / TURN_END)) + 4 * easeInOut((p - TURN_END) / (1 - TURN_END)));
  const scale = useTransform(progress, (p) => 0.88 + 0.12 * easeOut(p / TURN_END));

  return (
    <div className="mx-auto grid h-full max-w-[90rem] grid-rows-[auto_minmax(0,1fr)] gap-2 px-5 pb-6 pt-[calc(3.25rem+1.5rem)] sm:px-8 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-8 lg:px-10 lg:pb-0 lg:pt-12">
      <FadeUp className="lg:col-span-5 lg:pl-4" amount={0.4}>
        <p className="t-small font-semibold text-l-fg-3">Factory II · {KIB.period.replace(" – ", "–")}</p>
        <h3 className="t-h2 mt-2 text-l-fg">
          <span className="text-l-accent">Eight product lines.</span> One factory.
        </h3>
        <p className="t-body mt-4 max-w-[34ch] text-l-fg-3 max-lg:hidden">
          <span className="font-semibold text-l-fg">{KIB.factoryName}.</span> {KIB.mandate}
        </p>
        <p className="t-small mt-3 font-semibold text-l-fg lg:mt-6">{KIB.role}</p>
      </FadeUp>

      <div ref={visualRef} className="relative min-h-0 lg:col-span-7 lg:h-full">
        <div className="absolute inset-0 grid place-items-center [perspective:1700px]">
          <motion.div ref={phoneBoxRef} style={{ scale }} className="[transform-style:preserve-3d]">
            <Phone3D width="clamp(9rem, min(17vw, 28svh), 15.5rem)" finish="midnight" rotateY={rotateY} rotateX={rotateX} screen={<HomeScreen />}>
              {KIB_LINES.map((line, i) => (
                <FlyingApp key={line.name} line={line} index={i} progress={progress} reach={reach.a} labels={reach.labels} />
              ))}
            </Phone3D>
          </motion.div>
        </div>
        <ul className="sr-only">
          {KIB_LINES.map((line) => (
            <li key={line.name}>{line.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const u = (k: number) => `calc(var(--w) * ${Number(k.toFixed(5))})`;

function HomeScreen() {
  return (
    <span className="absolute inset-0 block" aria-hidden="true">
      <span className="absolute inset-0 bg-[#13203f]" />
      <StatusBar />
      <span
        className="absolute flex flex-col justify-between overflow-hidden text-white"
        style={{
          left: u(0.06),
          right: u(0.06),
          top: u(0.21),
          height: u(0.6),
          borderRadius: u(0.07),
          padding: u(0.06),
          background: "rgba(255,255,255,0.14)",
          boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.3)",
        }}
      >
        <span className="font-head font-semibold opacity-80" style={{ fontSize: u(0.042) }}>
          {KIB.factoryName}
        </span>
        <span className="flex items-end justify-between">
          <span className="font-head font-bold leading-none tracking-[-0.05em]" style={{ fontSize: u(0.3) }}>
            {KIB_LINES.length}
          </span>
          <span className="pb-[0.4em] text-right font-text font-medium leading-tight opacity-85" style={{ fontSize: u(0.042) }}>
            product lines,
            <br />
            one factory
          </span>
        </span>
      </span>
      <span className="absolute inset-x-0 flex justify-center" style={{ bottom: u(0.16), gap: u(0.025) }}>
        {[0, 1, 2].map((dot) => (
          <span key={dot} className={cn("block rounded-full", dot === 0 ? "bg-white" : "bg-white/40")} style={{ width: u(0.016), height: u(0.016) }} />
        ))}
      </span>
    </span>
  );
}

/**
 * One line's app: drawn on the home screen at first, then lifted off the glass and flown out to its place in a ring
 * around the phone. It lives in the phone's own 3D space, so it turns with the phone and hides when the back faces you.
 */
function FlyingApp({ line, index, progress, reach, labels }: { line: Line; index: number; progress: MotionValue<number>; reach: number; labels: boolean }) {
  const from = GRID[index];
  const angle = (-90 + index * 45) * (Math.PI / 180);
  const to = { x: CENTER.x + reach * Math.cos(angle), y: CENTER.y + 1.3 * Math.sin(angle) };
  const start = FLY_START + index * FLY_STEP;
  const t = useTransform(progress, (p) => easeInOut((p - start) / FLY_LENGTH));
  const transform = useTransform(t, (v) => {
    const x = from.x + (to.x - from.x) * v;
    const y = from.y + (to.y - from.y) * v;
    const z = PHONE.depth / 2 + 0.004 + Math.sin(Math.PI * v) * 0.5 + v * 0.24;
    const s = 1 + v * 0.38;
    return `translate3d(${u(x)}, ${u(y)}, ${u(z)}) scale(${s.toFixed(4)})`;
  });
  const homeLabel = useTransform(t, [0, 0.15], [1, 0]);
  const ringLabel = useTransform(t, [0.75, 1], [0, 1]);

  return (
    <motion.span
      aria-hidden="true"
      className="absolute left-0 top-0 block [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
      style={{ width: u(ICON), height: u(ICON), marginLeft: u(-ICON / 2), marginTop: u(-ICON / 2), transform }}
    >
      <AppTile icon={line.icon} name={line.name} className="size-full rounded-[23%]" />
      <motion.span
        className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap font-text font-medium text-white"
        style={{ opacity: homeLabel, fontSize: u(0.032), marginTop: u(0.018) }}
      >
        {line.short}
      </motion.span>
      {labels && (
        <motion.span
          className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap font-head font-semibold tracking-[-0.01em] text-l-fg"
          style={{ opacity: ringLabel, fontSize: u(0.052), marginTop: u(0.03) }}
        >
          {line.name}
        </motion.span>
      )}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ Blueprint */

const NODE_ICONS = { mandate: Landmark, squads: Users, chapters: Layers, governance: ShieldCheck } as const;

function Blueprint() {
  const copy = SECTION_COPY.blueprint;
  return (
    <Wrap className="pb-[clamp(5rem,9vw,8rem)] pt-[clamp(4rem,8vw,7rem)]">
      <Heading kicker={copy.eyebrow} title={<Emphasis text={copy.title} />} />
      <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-16 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0">
        {FACTORY_BLUEPRINT.map((node, i) => (
          <FadeUp as="li" key={node.id} delay={i * 0.07} className="w-[82vw] max-w-[22rem] shrink-0 snap-center lg:w-auto lg:max-w-none">
            <FlipCard node={node} />
          </FadeUp>
        ))}
      </ul>
      <FadeUp className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
        <BriefLink brief="factory" className="t-body" />
      </FadeUp>
    </Wrap>
  );
}

function FlipCard({ node }: { node: (typeof FACTORY_BLUEPRINT)[number] }) {
  const [open, setOpen] = useState(false);
  const Icon = NODE_ICONS[node.id as keyof typeof NODE_ICONS] ?? Layers;
  const backId = `node-${node.id}-detail`;
  return (
    <div className="relative h-[25rem] [perspective:1400px] sm:h-[27rem]">
      <motion.div
        className="relative size-full [transform-style:preserve-3d]"
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.9 }}
      >
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] bg-l-card p-7 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] sm:p-8" aria-hidden={open}>
          <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-l-fg text-l-bg">
            <Icon className="size-6" strokeWidth={1.9} />
          </span>
          <h3 className="mt-auto font-head text-[clamp(1.35rem,1.7vw,1.65rem)] font-bold leading-[1.12] tracking-[-0.024em] text-l-fg">{node.title}</h3>
          <p className="t-body mt-3 pr-8 text-l-fg-3">{node.rule}</p>
        </div>
        <div
          id={backId}
          aria-hidden={!open}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] bg-l-fg p-7 text-l-bg [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8"
        >
          <p className="t-small font-semibold opacity-70">{node.title}</p>
          <ul className="mt-5 space-y-3.5 pb-12">
            {node.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-[15px] font-medium leading-[1.42] tracking-[-0.01em]">
                <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-l-bg/55" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={backId}
        aria-label={open ? `Hide details: ${node.title}` : `Show details: ${node.title}`}
        className={cn(
          "absolute bottom-6 right-6 grid size-10 cursor-pointer place-items-center rounded-full transition-colors duration-300 sm:bottom-7 sm:right-7",
          open ? "bg-l-bg/15 text-l-bg hover:bg-l-bg/25" : "bg-l-fg/[0.07] text-l-fg hover:bg-l-fg/[0.12]"
        )}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span key={open ? "close" : "open"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: open ? 45 : 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
            <Plus className="size-5" strokeWidth={2.2} />
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
