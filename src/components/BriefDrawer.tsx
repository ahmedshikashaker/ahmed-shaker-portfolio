"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EXECUTIVE_CASE_STUDIES, type ExecutiveCaseStudy } from "@/data/portfolioData";
import { SlideOver } from "@/components/ui/SlideOver";
import { PORTFOLIO_EVENTS } from "@/lib/events";
import { useWindowEvent } from "@/lib/hooks";
import { crossfade } from "@/lib/motion";

const TITLE_ID = "brief-title";
const COUNT = EXECUTIVE_CASE_STUDIES.length;

const isBrief = (id: string | null | undefined): id is string => EXECUTIVE_CASE_STUDIES.some((study) => study.id === id);

/**
 * The one reader for every case study. Mounted once per page; opened by the home page's brief links, the command
 * palette, or a deep link (/?brief=case-digital-factories).
 */
export default function BriefDrawer() {
  const [open, setOpen] = useState(false);
  // The last brief stays rendered while the panel slides out.
  const [briefId, setBriefId] = useState(EXECUTIVE_CASE_STUDIES[0].id);

  const show = useCallback((id: string | null | undefined) => {
    if (!isBrief(id)) return;
    setBriefId(id);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useWindowEvent<string>(PORTFOLIO_EVENTS.openBrief, show);

  useEffect(() => {
    // `case` is the parameter name the previous page used; links already shared keep working.
    const params = new URLSearchParams(window.location.search);
    show(params.get("brief") ?? params.get("case"));
  }, [show]);

  const index = Math.max(0, EXECUTIVE_CASE_STUDIES.findIndex((study) => study.id === briefId));
  const study = EXECUTIVE_CASE_STUDIES[index];
  const previous = EXECUTIVE_CASE_STUDIES[(index - 1 + COUNT) % COUNT];
  const next = EXECUTIVE_CASE_STUDIES[(index + 1) % COUNT];

  const arrow =
    "grid size-9 cursor-pointer place-items-center rounded-full text-l-fg-3 transition-colors duration-150 hover:bg-l-card hover:text-l-fg";

  return (
    <SlideOver
      open={open}
      onClose={close}
      labelledBy={TITLE_ID}
      closeLabel="Close brief"
      header={
        <p className="t-small flex min-w-0 items-center gap-2 font-semibold text-l-fg">
          <span className="shrink-0">Case study {index + 1}</span>
          <span className="hidden truncate font-normal text-l-fg-3 sm:inline">· {study.readTime}</span>
        </p>
      }
      actions={
        <>
          <button type="button" onClick={() => setBriefId(previous.id)} aria-label={`Previous brief: ${previous.title}`} className={arrow}>
            <ArrowLeft className="size-4" strokeWidth={2} />
          </button>
          <span className="numeric px-1 text-[13px] font-medium text-l-fg-3" aria-hidden="true">
            {index + 1} of {COUNT}
          </span>
          <button type="button" onClick={() => setBriefId(next.id)} aria-label={`Next brief: ${next.title}`} className={arrow}>
            <ArrowRight className="size-4" strokeWidth={2} />
          </button>
        </>
      }
    >
      <BriefReader study={study} next={next} onNavigate={setBriefId} />
    </SlideOver>
  );
}

function BriefReader({ study, next, onNavigate }: { study: ExecutiveCaseStudy; next: ExecutiveCaseStudy; onNavigate: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // "Next brief" lives inside the article it replaces; hand focus to the new title when it mounts.
  const focusNextTitle = useRef(false);
  const titleRef = useCallback((title: HTMLHeadingElement | null) => {
    if (!title || !focusNextTitle.current) return;
    focusNextTitle.current = false;
    title.focus({ preventScroll: true });
  }, []);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [study.id]);

  return (
    <>
      <motion.span aria-hidden="true" style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left bg-l-accent" />
      <div ref={scrollRef} className="relative h-full overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={study.id}
            variants={crossfade}
            initial="initial"
            animate="animate"
            exit="exit"
            className="px-5 pb-14 pt-9 sm:px-9 sm:pt-11"
          >
            <BriefBody study={study} titleRef={titleRef} />
            <button
              type="button"
              onClick={() => {
                focusNextTitle.current = true;
                onNavigate(next.id);
              }}
              className="group mt-12 flex w-full cursor-pointer items-center justify-between gap-6 rounded-[22px] bg-l-card p-6 text-start transition-colors duration-200 hover:bg-l-card-2"
            >
              <span>
                <span className="t-small block font-semibold text-l-fg-3">Next brief</span>
                <span className="t-h4 mt-1.5 block text-l-fg">{next.title}</span>
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#0071e3] text-white transition-transform duration-200 group-hover:translate-x-0.5">
                <ChevronRight className="size-5" strokeWidth={2.2} />
              </span>
            </button>
          </motion.article>
        </AnimatePresence>
      </div>
    </>
  );
}

function BriefBody({ study, titleRef }: { study: ExecutiveCaseStudy; titleRef: (title: HTMLHeadingElement | null) => void }) {
  return (
    <>
      <p className="t-small font-semibold text-l-accent">{study.category}</p>
      <h2 id={TITLE_ID} ref={titleRef} tabIndex={-1} className="t-h2 mt-3 text-l-fg outline-none">
        {study.title}
      </h2>
      <p className="t-body mt-4 text-l-fg-3">{study.subtitle}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {study.institutions.map((institution) => (
          <li key={institution} className="inline-flex h-8 items-center rounded-full bg-l-card px-3.5 text-[13px] font-medium text-l-fg-2">
            {institution}
          </li>
        ))}
      </ul>

      <p className="t-lede mt-10 text-l-fg">{study.executiveSummary}</p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[22px] bg-l-card p-6">
          <h3 className="t-small font-semibold text-l-fg-3">The challenge</h3>
          <p className="t-small mt-2.5 leading-relaxed text-l-fg-2">{study.challenge}</p>
        </div>
        <div className="rounded-[22px] bg-l-card p-6">
          <h3 className="t-small font-semibold text-l-accent">The architectural thesis</h3>
          <p className="t-small mt-2.5 leading-relaxed text-l-fg">{study.architecturalThesis}</p>
        </div>
      </div>

      <h3 className="t-h4 mt-12 text-l-fg">End-to-end flow</h3>
      <ol className="mt-4 space-y-2">
        {study.architecturalFlow.map((step, i) => (
          <li key={step} className="flex items-center gap-4 rounded-[16px] bg-l-card px-4 py-3">
            <span className="t-num w-7 shrink-0 text-[1.35rem] text-l-accent">{i + 1}</span>
            <span className="text-[15px] font-medium text-l-fg">{step}</span>
          </li>
        ))}
      </ol>

      <h3 className="t-h4 mt-12 text-l-fg">How it was delivered</h3>
      <ol className="mt-4 divide-y divide-l-line border-y border-l-line">
        {study.executionPillars.map((pillar) => (
          <li key={pillar.heading} className="py-5">
            <h4 className="text-[16px] font-semibold tracking-[-0.012em] text-l-fg">{pillar.heading}</h4>
            <p className="t-small mt-2 leading-relaxed text-l-fg-3">{pillar.detail}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-[22px] bg-l-card p-6 sm:p-7">
        <h3 className="t-h4 text-l-fg">Verified outcomes</h3>
        <ul className="mt-4 space-y-3">
          {study.verifiedOutcomes.map((outcome) => (
            <li key={outcome} className="flex gap-3 text-[15px] leading-relaxed text-l-fg-2">
              <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#0071e3] text-white">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {outcome}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="t-small font-semibold text-l-fg-3">Core stack</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {study.technologies.map((tech) => (
            <li key={tech} className="inline-flex h-8 items-center rounded-full bg-l-card px-3.5 text-[13px] font-medium text-l-fg-2">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
