"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LEADERSHIP_PRINCIPLES, type LeadershipPrinciple } from "@/data/portfolioData";
import { CornerTicks, Section, SectionHeader } from "@/components/ui/SectionHeader";
import { pad2 } from "@/lib/format";
import { useMediaQuery } from "@/lib/hooks";
import { EASE_OUT } from "@/lib/motion";

export default function LeadershipPhilosophySection() {
  // Stacking deck only where every card fits on screen; otherwise a calm vertical list.
  const stack = useMediaQuery("(min-width: 1024px) and (min-height: 700px)");
  const total = LEADERSHIP_PRINCIPLES.length;

  return (
    <Section id="leadership" labelledBy="leadership-title" className="py-28 lg:py-40">
      <div className="shell">
        <SectionHeader
          index="07"
          label="Leadership & engineering excellence"
          titleId="leadership-title"
          title="How I build organizations *that ship & scale.*"
          lede="Sustainable digital transformation requires aligning executive banking strategy with disciplined software engineering practices. These four principles guide how I structure teams, select technology, and govern delivery."
        />
        <div className="mt-16 space-y-6 lg:mt-24 lg:space-y-[14vh]">
          {LEADERSHIP_PRINCIPLES.map((principle, index) => (
            <PrincipleCard key={principle.id} principle={principle} index={index} total={total} stack={stack} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function PrincipleCard({ principle, index, total, stack }: { principle: LeadershipPrinciple; index: number; total: number; stack: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const last = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, last || reduce ? 1 : 0.9]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, last ? 0 : 0.55]);

  return (
    <div ref={ref} className={stack ? "sticky" : undefined} style={stack ? { top: `calc(6.5rem + ${index * 1.4}rem)` } : undefined}>
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        style={stack ? { scale } : undefined}
        className="relative origin-top overflow-hidden border border-line-2 bg-surface shadow-float"
      >
        <CornerTicks className="-inset-px" />
        <div className="grid lg:min-h-[27rem] lg:grid-cols-12">
          <div className="relative flex flex-col border-b border-line p-7 sm:p-9 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-11">
            <div className="eyebrow flex items-center justify-between gap-3">
              <span className="text-accent">Principle {principle.number}</span>
              <span className="numeric text-fg-4">
                {pad2(index + 1)} / {pad2(total)}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none mt-6 select-none font-display text-[7rem] leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--c-accent-deep)] lg:mt-auto lg:text-[10rem]"
            >
              {pad2(index + 1)}
            </span>
            <div className="eyebrow mt-6 text-fg-3">{principle.subtitle}</div>
            <h3 className="mt-3 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.1] text-fg">{principle.title}</h3>
          </div>
          <div className="flex flex-col p-7 sm:p-9 lg:col-span-7 lg:p-11">
            <p className="text-[16px] leading-[1.8] text-fg-2">{principle.narrative}</p>
            <div className="mt-7 border-l-2 border-signal/60 bg-signal/[0.05] px-5 py-4">
              <div className="eyebrow text-[10px] text-signal">Verified career evidence</div>
              <p className="mt-2 text-[14px] leading-relaxed text-fg">{principle.evidenceFromCareer}</p>
            </div>
            <ul className="mt-7 grid gap-x-6 gap-y-2.5 border-t border-line pt-6 sm:grid-cols-2 lg:mt-auto">
              {principle.keyPractices.map((practice, i) => (
                <li key={practice} className="flex gap-3 text-[13.5px] leading-snug text-fg-2">
                  <span className="numeric font-mono text-[11px] text-accent">{pad2(i + 1)}</span>
                  {practice}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {stack && <motion.span aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-bg" />}
      </motion.article>
    </div>
  );
}
