"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Clock, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EXECUTIVE_CASE_STUDIES, type ExecutiveCaseStudy } from "@/data/portfolioData";
import { ArrowGlyph } from "@/components/ui/Button";
import { Chip, spotlightMove } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Eyebrow, Section, SectionHeader } from "@/components/ui/SectionHeader";
import { PORTFOLIO_EVENTS, scrollToSection } from "@/lib/events";
import { pad2 } from "@/lib/format";
import { useEscape, useFocusTrap, useScrollLock, useWindowEvent } from "@/lib/hooks";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** The reader's resting frame inside the viewport. */
function readerFrame(): Box {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const pad = vw >= 1024 ? 32 : vw >= 640 ? 16 : 8;
  const width = Math.min(vw - pad * 2, 1152);
  return { top: pad, left: (vw - width) / 2, width, height: vh - pad * 2 };
}

/** clip-path that shows only `box` of a full-viewport sheet. */
function clipTo(box: Box) {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const right = Math.max(0, vw - box.left - box.width);
  const bottom = Math.max(0, vh - box.top - box.height);
  return `inset(${box.top}px ${right}px ${bottom}px ${box.left}px round 10px)`;
}

const SHEET_OPEN = { duration: 0.7, ease: EASE_OUT };
const SHEET_CLOSE = { duration: 0.5, ease: EASE_IN_OUT };

export default function ExecutiveCaseStudiesSection() {
  // `origin` is the card's on-screen rectangle the reader grows out of; `current` is the briefing shown.
  const [reader, setReader] = useState<{ current: string; origin: Box | null } | null>(null);

  const open = useCallback((id: string) => {
    const card = document.querySelector<HTMLElement>(`[data-case-card="${id}"]`);
    const rect = card?.getBoundingClientRect();
    const visible = rect && rect.bottom > 0 && rect.top < window.innerHeight;
    setReader({ current: id, origin: visible ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null });
  }, []);
  const close = useCallback(() => setReader(null), []);

  useWindowEvent<string>(PORTFOLIO_EVENTS.openCase, (id) => {
    if (!EXECUTIVE_CASE_STUDIES.some((s) => s.id === id)) return;
    scrollToSection("case-studies");
    window.setTimeout(() => open(id), 450);
  });

  // Deep links from other pages: /?case=case-digital-factories#case-studies
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("case");
    if (id && EXECUTIVE_CASE_STUDIES.some((s) => s.id === id)) open(id);
  }, [open]);

  const study = EXECUTIVE_CASE_STUDIES.find((s) => s.id === reader?.current) ?? null;

  return (
    <Section id="case-studies" labelledBy="cases-title" className="py-28 lg:py-40">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Executive architectural briefings"
          titleId="cases-title"
          title="Boardroom-to-production *case studies.*"
          lede="Detailed technical and strategic deep-dives into how I establish digital banking factories, architect multi-vertical banking ecosystems, and engineer metadata-driven FinTech and national EdTech platforms."
        />

        <Stagger as="ul" className="mt-16 grid gap-5 lg:mt-24 lg:grid-cols-3" stagger={0.1}>
          {EXECUTIVE_CASE_STUDIES.map((s, i) => (
            <StaggerItem as="li" key={s.id} className="h-full">
              <CaseCard study={s} number={i + 1} onOpen={() => open(s.id)} />
            </StaggerItem>
          ))}
        </Stagger>

        <AnimatePresence>
          {reader && study && (
            <CaseReader
              key="reader"
              origin={reader.origin}
              study={study}
              onClose={close}
              onNavigate={(id) => setReader((r) => (r ? { ...r, current: id } : r))}
            />
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function CaseCard({ study, number, onOpen }: { study: ExecutiveCaseStudy; number: number; onOpen: () => void }) {
  return (
    <article
      data-case-card={study.id}
      onPointerMove={spotlightMove}
      className="spotlight group relative flex h-full min-h-[32rem] flex-col overflow-hidden rounded-[10px] border border-line-2 bg-surface/60 p-7 transition-colors duration-500 hover:border-line-3 sm:p-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-4 select-none font-display text-[17rem] leading-none text-transparent transition-[-webkit-text-stroke-color] duration-700 [-webkit-text-stroke:1px_var(--c-line-2)] group-hover:[-webkit-text-stroke-color:var(--c-accent-deep)]"
      >
        {number}
      </span>
      <div className="eyebrow relative flex items-center justify-between gap-3">
        <span className="text-accent">{study.index}</span>
        <span className="flex items-center gap-1.5 text-fg-4">
          <Clock className="size-3" strokeWidth={1.75} />
          {study.readTime}
        </span>
      </div>
      <div className="eyebrow relative mt-12 text-signal">{study.category}</div>
      <h3 className="relative mt-4 font-display text-[clamp(1.6rem,2.3vw,2rem)] leading-[1.14] text-fg">{study.title}</h3>
      <p className="relative mt-4 text-[14.5px] leading-relaxed text-fg-3">{study.subtitle}</p>
      <ul className="relative mt-6 flex flex-wrap gap-1.5">
        {study.institutions.map((institution) => (
          <li key={institution}>
            <Chip>
              <Building2 className="size-3 text-accent" strokeWidth={1.75} />
              {institution}
            </Chip>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onOpen}
        className="mt-auto flex cursor-pointer items-center justify-between gap-4 pt-10 text-left text-[14px] font-medium text-fg after:absolute after:inset-0 after:content-['']"
        aria-label={`Read the briefing: ${study.title}`}
      >
        <span className="link-sweep">Read the briefing</span>
        <span className="grid size-11 place-items-center rounded-full border border-line-2 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
          <ArrowGlyph />
        </span>
      </button>
    </article>
  );
}

function CaseReader({
  origin,
  study,
  onClose,
  onNavigate,
}: {
  origin: Box | null;
  study: ExecutiveCaseStudy;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState<Box>(readerFrame);
  useScrollLock(true);
  useFocusTrap(panelRef, true);
  useEscape(onClose, true);

  const index = EXECUTIVE_CASE_STUDIES.findIndex((s) => s.id === study.id);
  const prev = EXECUTIVE_CASE_STUDIES[(index - 1 + EXECUTIVE_CASE_STUDIES.length) % EXECUTIVE_CASE_STUDIES.length];
  const next = EXECUTIVE_CASE_STUDIES[(index + 1) % EXECUTIVE_CASE_STUDIES.length];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [study.id]);

  useEffect(() => {
    const onResize = () => setFrame(readerFrame());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const morph = Boolean(origin) && !reduce;
  const rest = clipTo(frame);
  const from = morph && origin ? clipTo(origin) : rest;

  // Rendered only on the client (after a click or a deep link), so it can portal immediately;
  // that keeps `scrollRef` attached before useScroll subscribes to it.
  return createPortal(
      <div className="fixed inset-0 z-[80] print:hidden">
        <motion.div
          className="absolute inset-0 bg-bg/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.05 } }}
          onClick={onClose}
        />
        {/* Full-viewport sheet, clipped from the card's rectangle out to the reader frame. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-surface"
          initial={{ clipPath: from, opacity: morph ? 1 : 0 }}
          animate={{ clipPath: rest, opacity: 1, transition: SHEET_OPEN }}
          exit={{ clipPath: from, opacity: morph ? 1 : 0, transition: { ...SHEET_CLOSE, delay: 0.08 } }}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-reader-title"
          className="absolute flex flex-col overflow-hidden rounded-[10px]"
          style={{ top: frame.top, left: frame.left, width: frame.width, height: frame.height }}
        >
            <motion.div
              className="flex min-h-0 flex-1 flex-col rounded-[10px] shadow-[inset_0_0_0_1px_var(--c-line-2)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: morph ? 0.32 : 0, duration: 0.35 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <header className="relative flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
                <div className="eyebrow flex min-w-0 items-center gap-3 text-fg-3">
                  <span className="shrink-0 text-accent">{study.index}</span>
                  <span className="hidden truncate text-signal sm:inline">{study.category}</span>
                  <span className="hidden items-center gap-1.5 text-fg-4 md:flex">
                    <Clock className="size-3" strokeWidth={1.75} /> {study.readTime}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onNavigate(prev.id)}
                    aria-label={`Previous briefing: ${prev.title}`}
                    className="grid size-9 cursor-pointer place-items-center rounded-full text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    <ArrowLeft className="size-4" strokeWidth={1.75} />
                  </button>
                  <span className="eyebrow numeric px-1 text-fg-4">
                    {pad2(index + 1)} / {pad2(EXECUTIVE_CASE_STUDIES.length)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(next.id)}
                    aria-label={`Next briefing: ${next.title}`}
                    className="grid size-9 cursor-pointer place-items-center rounded-full text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    <ArrowRight className="size-4" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    data-autofocus
                    aria-label="Close briefing"
                    className="ml-2 grid size-9 cursor-pointer place-items-center rounded-full border border-line-2 text-fg transition-colors hover:bg-surface-2"
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
                <motion.span aria-hidden="true" style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 -bottom-px h-px origin-left bg-accent" />
              </header>

              <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.article
                    key={study.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-16"
                  >
                    <ReaderBody study={study} />
                    <button
                      type="button"
                      onClick={() => onNavigate(next.id)}
                      className="group mt-16 flex w-full cursor-pointer items-center justify-between gap-6 border-t border-line pt-8 text-left"
                    >
                      <span>
                        <span className="eyebrow block text-fg-4">Next briefing</span>
                        <span className="mt-2 block font-display text-[1.6rem] leading-tight text-fg transition-colors group-hover:text-accent">
                          {next.title}
                        </span>
                      </span>
                      <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line-2 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                        <ArrowGlyph direction="right" />
                      </span>
                    </button>
                  </motion.article>
                </AnimatePresence>
              </div>
            </motion.div>
        </div>
      </div>,
    document.body
  );
}

function ReaderBody({ study }: { study: ExecutiveCaseStudy }) {
  return (
    <>
      <div className="eyebrow text-signal">{study.category}</div>
      <h2 id="case-reader-title" className="mt-5 font-display text-display-3 text-fg">
        {study.title}
      </h2>
      <p className="mt-5 text-lede text-fg-3">{study.subtitle}</p>
      <ul className="mt-6 flex flex-wrap gap-1.5">
        {study.institutions.map((institution) => (
          <li key={institution}>
            <Chip>
              <Building2 className="size-3 text-accent" strokeWidth={1.75} />
              {institution}
            </Chip>
          </li>
        ))}
      </ul>

      <div className="mt-12 border-l-2 border-accent pl-6">
        <div className="eyebrow text-accent">Executive summary</div>
        <p className="mt-4 font-display text-[1.35rem] leading-[1.55] text-fg">{study.executiveSummary}</p>
      </div>

      <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2">
        <div className="bg-surface p-6">
          <div className="eyebrow text-fg-4">The institutional challenge</div>
          <p className="mt-3 text-[15px] leading-[1.75] text-fg-2">{study.challenge}</p>
        </div>
        <div className="bg-surface p-6">
          <div className="eyebrow text-signal">The architectural thesis</div>
          <p className="mt-3 text-[15px] leading-[1.75] text-fg">{study.architecturalThesis}</p>
        </div>
      </div>

      <div className="mt-14">
        <Eyebrow>End-to-end architectural flow</Eyebrow>
        <ol className="mt-6 grid gap-2 sm:grid-cols-5">
          {study.architecturalFlow.map((step, i) => (
            <li key={step} className="relative flex flex-col border border-line bg-bg/40 p-4">
              <span className="numeric font-mono text-[11px] text-accent">{pad2(i + 1)}</span>
              <span className="mt-2 text-[13.5px] font-medium leading-snug text-fg">{step}</span>
              {i < study.architecturalFlow.length - 1 && (
                <span aria-hidden="true" className="absolute -right-[7px] top-1/2 z-10 hidden size-3 -translate-y-1/2 rotate-45 border-r border-t border-line-3 bg-surface sm:block" />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14">
        <Eyebrow>Execution blueprint &amp; engineering delivery</Eyebrow>
        <ol className="mt-6 border-t border-line">
          {study.executionPillars.map((pillar, i) => (
            <li key={pillar.heading} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[3rem_minmax(0,1fr)]">
              <span className="numeric font-display text-[1.5rem] leading-none text-accent">{pad2(i + 1)}</span>
              <div>
                <h3 className="text-[16px] font-medium text-fg">{pillar.heading}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.75] text-fg-3">{pillar.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 border border-signal/25 bg-signal/[0.04] p-6 sm:p-7">
        <div className="eyebrow text-signal">Verifiable institutional impact</div>
        <ul className="mt-5 space-y-3">
          {study.verifiedOutcomes.map((outcome) => (
            <li key={outcome} className="flex gap-3 text-[15px] leading-relaxed text-fg">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={1.75} />
              {outcome}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1 text-fg-4">Core stack</span>
        {study.technologies.map((tech) => (
          <Chip key={tech} tone="mono">
            {tech}
          </Chip>
        ))}
      </div>
    </>
  );
}
