"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ARCHITECTURE_STACK,
  ARCHIVE_PLATFORMS,
  FLAGSHIP_FILTERS,
  FLAGSHIP_PLATFORMS,
  SECTION_COPY,
  STORY,
  type FlagshipGroup,
  type FlagshipPlatform,
  type PlatformCard,
} from "@/data/portfolioData";
import { SlideOver } from "@/components/ui/SlideOver";
import { cn } from "@/lib/cn";
import { PORTFOLIO_EVENTS, prefersReducedMotion } from "@/lib/events";
import { useWindowEvent } from "@/lib/hooks";
import { EASE, FadeUp, SCROLL_SPRING, useReducedMotionSafe } from "./motion";
import { Band, BriefLink, ChevronLink, Emphasis, Heading, Wrap } from "./primitives";

/** Each flagship belongs to one stretch of the gallery; Warba and UBA are core banking too, but read as regional scale. */
const segmentOf = (platform: FlagshipPlatform): FlagshipGroup => (platform.groups.includes("regional") ? "regional" : platform.groups[0]);
const SEGMENTS = FLAGSHIP_FILTERS.flatMap((filter) => {
  if (filter.value === "all") return [];
  const group = filter.value;
  const first = FLAGSHIP_PLATFORMS.findIndex((platform) => segmentOf(platform) === group);
  return first >= 0 ? [{ value: group, label: filter.label, first }] : [];
});

/** Ids from older links: EduWave's three editions are one platform on the page now. */
const LEGACY_PLATFORM_IDS: Record<string, string> = { "itg-eduwave-he": "itg-eduwave-k12", "itg-eduwave-ams": "itg-eduwave-k12" };
const resolveId = (id: string | null | undefined) => (id && Object.hasOwn(LEGACY_PLATFORM_IDS, id) ? LEGACY_PLATFORM_IDS[id] : id);

/** 03 · Ecosystems: the eight flagships in a cover-flow of their real store art, the archive, and the stack underneath. */
export default function Ecosystems() {
  const copy = SECTION_COPY.ecosystems;
  return (
    <Band id="ecosystems" tone="dark" labelledBy="ecosystems-title" className="overflow-clip">
      <Wrap className="pt-[clamp(5rem,9vw,8rem)]">
        <Heading id="ecosystems-title" kicker={copy.eyebrow} title={<Emphasis text={copy.title} />} sub={copy.subtitle} align="center" />
      </Wrap>
      <Gallery />
      <Stack />
    </Band>
  );
}

/* ------------------------------------------------------------------ Cover flow */

function Gallery() {
  const reduce = useReducedMotionSafe();
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { scrollX } = useScroll({ container: scrollerRef });
  const [slot, setSlot] = useState(0);
  const [active, setActive] = useState(0);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [flagged, setFlagged] = useState<string | null>(null);
  const flagTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const first = scroller?.firstElementChild as HTMLElement | null;
    if (!scroller || !first) return;
    const measure = () => {
      const width = first.offsetWidth;
      setSlot(width);
      setActive(Math.min(FLAGSHIP_PLATFORMS.length - 1, Math.max(0, Math.round(scroller.scrollLeft / (width || 1)))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollX, "change", (x) => {
    if (slot) setActive(Math.min(FLAGSHIP_PLATFORMS.length - 1, Math.max(0, Math.round(x / slot))));
  });

  const goTo = useCallback(
    (index: number, instant = false) => {
      const scroller = scrollerRef.current;
      if (!scroller || !slot) return;
      const target = Math.min(FLAGSHIP_PLATFORMS.length - 1, Math.max(0, index));
      scroller.scrollTo({ left: target * slot, behavior: instant || prefersReducedMotion() ? "auto" : "smooth" });
    },
    [slot]
  );

  /** Brings one platform forward: a flagship into the middle of the gallery, or an earlier one marked in the archive. */
  const show = useCallback(
    (rawId: string | null | undefined, instant = false) => {
      const id = resolveId(rawId);
      if (!id) return;
      const index = FLAGSHIP_PLATFORMS.findIndex((platform) => platform.id === id);
      if (index >= 0) {
        galleryRef.current?.scrollIntoView({ block: "center", behavior: instant || prefersReducedMotion() ? "auto" : "smooth" });
        goTo(index, instant);
        return;
      }
      if (!ARCHIVE_PLATFORMS.some((platform) => platform.id === id)) return;
      setArchiveOpen(true);
      setFlagged(id);
      window.clearTimeout(flagTimer.current);
      flagTimer.current = window.setTimeout(() => setFlagged(null), 3200);
    },
    [goTo]
  );

  useWindowEvent<string>(PORTFOLIO_EVENTS.selectPlatform, (id) => show(id));

  // Deep links from other pages: /?platform=kib-corporate#ecosystems (`product` is the older parameter name).
  // Once, as soon as the gallery has measured itself; a page that has just loaded jumps rather than glides.
  const deepLinked = useRef(false);
  const showRef = useRef(show);
  useEffect(() => {
    showRef.current = show;
  }, [show]);
  const deepLinkTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!slot || deepLinked.current) return;
    deepLinked.current = true;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("platform") ?? params.get("product");
    if (id) deepLinkTimer.current = window.setTimeout(() => showRef.current(id, true), 300);
  }, [slot]);

  useEffect(
    () => () => {
      window.clearTimeout(flagTimer.current);
      window.clearTimeout(deepLinkTimer.current);
    },
    []
  );

  const current = FLAGSHIP_PLATFORMS[active];
  const segment = segmentOf(current);

  return (
    <div className="pt-12 lg:pt-16">
      <FadeUp className="flex justify-center px-5">
        <div role="group" aria-label="Jump to a group of flagship platforms" className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-l-card p-1">
          {SEGMENTS.map((entry) => (
            <button
              key={entry.value}
              type="button"
              onClick={() => goTo(entry.first)}
              aria-pressed={segment === entry.value}
              className={cn(
                "relative h-9 cursor-pointer whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-colors duration-300",
                segment === entry.value ? "text-l-bg" : "text-l-fg-3 hover:text-l-fg"
              )}
            >
              {segment === entry.value && (
                <motion.span layoutId="segment-pill" transition={{ type: "spring", stiffness: 380, damping: 34 }} className="absolute inset-0 rounded-full bg-l-fg" />
              )}
              <span className="relative">{entry.label}</span>
            </button>
          ))}
        </div>
      </FadeUp>

      <div
        ref={galleryRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Flagship platforms"
        className="relative isolate mt-10 lg:mt-14"
        style={{ ["--slot" as string]: "clamp(7.5rem, 15vw, 13rem)", ["--card" as string]: "clamp(12.5rem, 21vw, 18.5rem)" }}
      >
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-[calc(var(--card)*0.5)] pt-6"
          style={{ paddingInline: "calc(50% - var(--slot) / 2)" }}
        >
          {FLAGSHIP_PLATFORMS.map((platform, i) => (
            <CoverCard key={platform.id} platform={platform} index={i} scrollX={scrollX} slot={slot} active={i === active} reduce={reduce} onSelect={() => goTo(i)} />
          ))}
        </div>
      </div>

      <Wrap className="-mt-[calc(clamp(12.5rem,21vw,18.5rem)*0.2)]">
        <div className="relative grid">
          {FLAGSHIP_PLATFORMS.map((platform, i) => (
            <PlatformDetails key={platform.id} platform={platform} index={i} active={i === active} />
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Paddle label="Previous platform" disabled={active === 0} onClick={() => goTo(active - 1)}>
            <ChevronLeft className="size-5" strokeWidth={2.2} />
          </Paddle>
          <div aria-hidden="true" className="flex items-center gap-2 px-2">
            {FLAGSHIP_PLATFORMS.map((platform, i) => (
              <span key={platform.id} className={cn("h-2 rounded-full transition-all duration-500", i === active ? "w-6 bg-l-fg" : "w-2 bg-l-fg-4/60")} />
            ))}
          </div>
          <Paddle label="Next platform" disabled={active === FLAGSHIP_PLATFORMS.length - 1} onClick={() => goTo(active + 1)}>
            <ChevronRight className="size-5" strokeWidth={2.2} />
          </Paddle>
        </div>

        <ArchiveTeaser onOpen={() => setArchiveOpen(true)} />
      </Wrap>
      <ArchiveDrawer open={archiveOpen} flagged={flagged} onClose={() => setArchiveOpen(false)} />
    </div>
  );
}

function CoverCard({
  platform,
  index,
  scrollX,
  slot,
  active,
  reduce,
  onSelect,
}: {
  platform: FlagshipPlatform;
  index: number;
  scrollX: MotionValue<number>;
  slot: number;
  active: boolean;
  reduce: boolean;
  onSelect: () => void;
}) {
  // Distance from the middle of the gallery, in slots: 0 faces you, ±1 and beyond turn in towards the middle.
  const distance = (x: number) => (slot ? index - x / slot : index);
  const transform = useTransform(scrollX, (x) => {
    const d = distance(x);
    const near = Math.max(-1, Math.min(1, d));
    const far = Math.max(0, Math.abs(d) - 1);
    if (reduce) return `translateX(${near * 18}%) scale(${1 - Math.min(1, Math.abs(d)) * 0.16})`;
    return `perspective(1100px) translateX(${near * 22}%) translateZ(${-Math.abs(near) * 230 - far * 40}px) rotateY(${-near * 58}deg)`;
  });
  const zIndex = useTransform(scrollX, (x) => 100 - Math.round(Math.abs(distance(x)) * 10));
  const shot = platform.screenshots[0];

  return (
    <div className="relative h-[calc(var(--card)*2)] w-[var(--slot)] shrink-0 snap-center">
      <motion.button
        type="button"
        onClick={onSelect}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) onSelect();
        }}
        aria-label={`${platform.name}, ${platform.domain}`}
        aria-current={active ? "true" : undefined}
        style={{ transform, zIndex }}
        className="absolute left-1/2 top-0 h-full w-[var(--card)] -translate-x-1/2 cursor-pointer rounded-[24px] outline-offset-4 [-webkit-box-reflect:below_10px_linear-gradient(transparent_74%,rgba(255,255,255,0.16))]"
      >
        <span className="relative block size-full overflow-hidden rounded-[24px] bg-l-card shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
          {shot && <Image src={shot} alt="" fill sizes="(min-width: 1024px) 300px, 210px" className="object-cover" />}
          <span className={cn("absolute inset-0 bg-black transition-opacity duration-500", active ? "opacity-0" : "opacity-35")} />
        </span>
      </motion.button>
    </div>
  );
}

function PlatformDetails({ platform, index, active }: { platform: FlagshipPlatform; index: number; active: boolean }) {
  return (
    <article
      id={`platform-${platform.id}`}
      aria-labelledby={`platform-${platform.id}-name`}
      aria-hidden={!active}
      inert={!active}
      className={cn(
        "col-start-1 row-start-1 mx-auto max-w-[44rem] text-center transition-[opacity,transform] duration-500",
        active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
      style={{ transitionTimingFunction: `cubic-bezier(${EASE.join(",")})` }}
    >
      <p className="t-small font-semibold text-l-fg-3">
        <span className="sr-only">Flagship {index + 1} of {FLAGSHIP_PLATFORMS.length}: </span>
        {platform.institution} · {platform.domain}
      </p>
      <h3 id={`platform-${platform.id}-name`} className="t-h2 mt-2 text-l-fg">
        {platform.name}
      </h3>
      <p className="t-body mx-auto mt-4 max-w-[46ch] text-l-fg-3">{platform.outcome}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {platform.listing && (
          <ChevronLink href={platform.listing.href} external className="t-body">
            View on the {platform.listing.store}
          </ChevronLink>
        )}
        <span className="t-small text-l-fg-4">{platform.platforms.join(" · ")}</span>
      </div>
    </article>
  );
}

function Paddle({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 cursor-pointer place-items-center rounded-full bg-l-card text-l-fg transition-[background-color,opacity] duration-200 hover:bg-l-card-2 disabled:cursor-default disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function ArchiveTeaser({ onOpen }: { onOpen: () => void }) {
  return (
    <FadeUp className="mx-auto mt-20 flex max-w-[52rem] flex-col items-center gap-6 rounded-[28px] bg-l-card px-6 py-10 text-center sm:px-10 lg:mt-28">
      <ul aria-hidden="true" className="flex -space-x-3">
        {ARCHIVE_PLATFORMS.map((platform, i) => (
          <li key={platform.id} className="relative size-12 overflow-hidden rounded-[13px] shadow-[0_8px_18px_-8px_rgba(0,0,0,0.8)] ring-2 ring-l-card sm:size-14 sm:rounded-[15px]" style={{ zIndex: 20 - i }}>
            {platform.iconPath ? (
              <Image src={platform.iconPath} alt="" fill sizes="56px" className="object-cover" />
            ) : (
              <span className="grid size-full place-items-center bg-[#636366] font-head text-[18px] font-bold text-white">{platform.name.slice(0, 1)}</span>
            )}
          </li>
        ))}
      </ul>
      <div>
        <h3 className="t-h3 text-l-fg">And {ARCHIVE_PLATFORMS.length} more platforms.</h3>
        <p className="t-body mx-auto mt-2 max-w-[40ch] text-l-fg-3">{STORY.archiveLine}</p>
      </div>
      <ChevronLink onClick={onOpen} dialog className="t-body">
        Open the archive
      </ChevronLink>
    </FadeUp>
  );
}

function ArchiveDrawer({ open, flagged, onClose }: { open: boolean; flagged: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!open || !flagged) return;
    const timer = window.setTimeout(() => document.getElementById(`archive-${flagged}`)?.scrollIntoView({ block: "center", behavior: "smooth" }), 450);
    return () => window.clearTimeout(timer);
  }, [open, flagged]);

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      labelledBy="archive-drawer-title"
      closeLabel="Close the archive"
      header={<span className="t-small font-semibold text-l-fg-3">Platform archive</span>}
    >
      <div className="h-full overflow-y-auto overscroll-contain px-5 pb-14 pt-10 sm:px-10">
        <h2 id="archive-drawer-title" className="t-h2 text-l-fg">
          {ARCHIVE_PLATFORMS.length} more platforms.
        </h2>
        <p className="t-body mt-3 text-l-fg-3">{STORY.archiveLine}</p>
        <ul className="mt-8 space-y-2">
          {ARCHIVE_PLATFORMS.map((platform) => (
            <li key={platform.id}>
              <ArchiveRow platform={platform} flagged={flagged === platform.id} />
            </li>
          ))}
        </ul>
      </div>
    </SlideOver>
  );
}

function ArchiveRow({ platform, flagged }: { platform: PlatformCard; flagged: boolean }) {
  const body = (
    <>
      <span className="relative block size-12 shrink-0 overflow-hidden rounded-[13px] shadow-[0_6px_14px_-8px_rgba(0,0,0,0.5)]">
        {platform.iconPath ? (
          <Image src={platform.iconPath} alt="" fill sizes="48px" className="object-cover" />
        ) : (
          <span aria-hidden="true" className="grid size-full place-items-center bg-[#636366] font-head text-[18px] font-bold text-white">
            {platform.name.slice(0, 1)}
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="t-h4 block text-l-fg">{platform.name}</span>
        <span className="t-small mt-0.5 block font-medium text-l-fg-3">
          {platform.institution} · {platform.domain}
        </span>
        <span className="t-small mt-2 block text-l-fg-3">{platform.outcome}</span>
      </span>
      {platform.listing && <ChevronRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-l-fg-4 transition-colors group-hover:text-l-link" strokeWidth={2} />}
    </>
  );
  const className = cn("group flex items-start gap-4 rounded-[20px] p-4 transition-colors duration-500", flagged ? "bg-[#0071e3]/12" : "bg-l-card", platform.listing && "hover:bg-l-card-2");
  return platform.listing ? (
    <a id={`archive-${platform.id}`} href={platform.listing.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
      <span className="sr-only">. Opens the {platform.listing.store} listing in a new tab.</span>
    </a>
  ) : (
    <div id={`archive-${platform.id}`} className={className}>
      {body}
    </div>
  );
}

/* ------------------------------------------------------------------ Fast edge, steady core */

function Stack() {
  const copy = SECTION_COPY.stack;
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.55"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const explode = useTransform(progress, (p) => (reduce ? 1 : Math.min(1, Math.max(0, (p - 0.15) / 0.85))));
  const spin = useTransform(progress, (p) => (reduce ? -40 : -52 + p * 14));
  const [focus, setFocus] = useState<number | null>(null);
  // While the stack crosses the middle of the screen, each layer takes the accent in turn, customer edge first.
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start 0.6", "end 0.4"] });
  const [step, setStep] = useState<number | null>(null);
  useMotionValueEvent(pass, "change", (p) => setStep(p <= 0 || p >= 1 ? null : Math.min(ARCHITECTURE_STACK.length - 1, Math.floor(p * ARCHITECTURE_STACK.length))));
  const lit = focus ?? step;

  return (
    <Wrap className="pb-[clamp(5rem,9vw,8rem)] pt-[clamp(5rem,9vw,8rem)]">
      <div ref={ref} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Heading kicker={copy.eyebrow} title={<Emphasis text={copy.title} />} sub={copy.subtitle} />
          <ol className="mt-10 space-y-2">
            {ARCHITECTURE_STACK.map((layer, i) => (
              <li key={layer.id}>
                <div
                  onPointerEnter={() => setFocus(i)}
                  onPointerLeave={() => setFocus(null)}
                  className={cn("rounded-[20px] p-4 transition-colors duration-300 sm:p-5", lit === i ? "bg-l-card-2" : "bg-l-card")}
                >
                  <p className="flex items-center gap-3">
                    <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full transition-colors duration-300", lit === i ? "bg-l-accent" : "bg-l-fg-4")} />
                    <span className="t-h4 text-l-fg">{layer.name}</span>
                  </p>
                  <p className="t-small mt-2 pl-[1.375rem] text-l-fg-3">{layer.mechanism}</p>
                  <p className="t-small mt-2 pl-[1.375rem] font-medium text-l-fg-4">{layer.tags.join(" · ")}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col items-start gap-3">
            <BriefLink brief="ecosystem" className="t-body" />
            <BriefLink brief="platform" className="t-body" />
          </div>
        </div>

        <div aria-hidden="true" className="relative order-first h-[min(30rem,92vw)] [perspective:1800px] lg:order-none lg:col-span-7 lg:h-[40rem]">
          <motion.div
            style={{ rotateX: 58, rotateZ: spin }}
            className="absolute left-1/2 top-1/2 aspect-square w-[min(68vw,22rem)] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] lg:w-[min(30vw,26rem)]"
          >
            {ARCHITECTURE_STACK.map((layer, i) => (
              <Plate key={layer.id} index={i} label={layer.short} explode={explode} lit={lit === i} dimmed={focus !== null && focus !== i} />
            ))}
          </motion.div>
        </div>
      </div>
    </Wrap>
  );
}

function Plate({ index, label, explode, lit, dimmed }: { index: number; label: string; explode: MotionValue<number>; lit: boolean; dimmed: boolean }) {
  const count = ARCHITECTURE_STACK.length;
  // Centred on the stack: the customer edge rises to the top, the core sinks to the bottom; the lit layer lifts a little.
  const z = useTransform(explode, (value) => ((count - 1) / 2 - index) * (8 + value * 92) + (lit ? 22 : 0));
  return (
    <motion.div style={{ z }} className={cn("absolute inset-0 rounded-[18%] transition-opacity duration-300", dimmed ? "opacity-50" : "opacity-100")}>
      <span
        className={cn(
          "absolute inset-0 rounded-[18%] border-[1.5px] transition-colors duration-300",
          lit ? "border-l-accent bg-[rgba(16,42,82,0.94)]" : "border-white/35 bg-[rgba(44,44,46,0.9)]"
        )}
      />
      <span className="absolute inset-[9%] rounded-[12%] opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16.66%_16.66%]" />
      <span className={cn("absolute bottom-[9%] left-[10%] font-head text-[clamp(0.7rem,1.25vw,1.05rem)] font-semibold tracking-[-0.01em] transition-colors duration-300", lit ? "text-white" : "text-white/85")}>
        {label}
      </span>
      <span className={cn("absolute left-1/2 top-1/2 size-[6%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300", lit ? "bg-l-accent" : "bg-white/70")} />
    </motion.div>
  );
}
