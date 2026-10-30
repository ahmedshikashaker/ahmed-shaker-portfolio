"use client";

import { AnimatePresence, motion, useInView, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { CAREER_TIMELINE, EXECUTIVE_PROFILE, type CareerMilestone } from "@/data/portfolioData";
import { Chip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";

type Category = CareerMilestone["achievements"][number]["category"];
type AchievementFilter = "ALL" | Category;

const FILTERS: { value: AchievementFilter; label: string }[] = [
  { value: "ALL", label: "All dimensions" },
  { value: "Strategy & Leadership", label: "Strategy & leadership" },
  { value: "Architecture & Engineering", label: "Architecture" },
  { value: "Product Delivery", label: "Product delivery" },
  { value: "DevOps & Governance", label: "DevOps & governance" },
];

const CATEGORY_TONE: Record<Category, string> = {
  "Strategy & Leadership": "bg-accent",
  "Architecture & Engineering": "bg-signal",
  "Product Delivery": "bg-fg-2",
  "DevOps & Governance": "bg-accent-deep",
};

export default function ExperienceTimelineSection() {
  const [filter, setFilter] = useState<AchievementFilter>("ALL");
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 55%"] });
  const spine = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <Section id="experience" labelledBy="experience-title" className="py-28 lg:py-40">
      <div className="shell">
        <SectionHeader
          index="06"
          label="Career progression · 2016 – present"
          titleId="experience-title"
          title="Executive & technical *chronicle.*"
          lede={
            <>
              Over 10 years of progressive engineering and technology leadership across <strong>Kuwait International Bank (KIB)</strong>,{" "}
              <strong>Warba Bank</strong>, <strong>Cit Global (UBA)</strong>, <strong>ITG Solutions</strong>, and <strong>Advicenode</strong>.
            </>
          }
        />

        <Reveal className="mt-14 lg:mt-20">
          <SegmentedControl label="Filter achievements by dimension" options={FILTERS} value={filter} onChange={setFilter} size="sm" />
        </Reveal>

        <ol ref={listRef} className="relative mt-14 lg:mt-16">
          <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-line-2 lg:left-[17rem]" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: spine }}
            className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-accent lg:left-[17rem]"
          />
          {CAREER_TIMELINE.map((milestone, index) => (
            <Milestone key={milestone.id} milestone={milestone} index={index} filter={filter} />
          ))}
        </ol>

        <Reveal className="mt-20 grid gap-px border border-line bg-line lg:grid-cols-12">
          <div className="bg-bg p-6 sm:p-8 lg:col-span-8">
            <div className="eyebrow text-accent">Academic foundation · {EXECUTIVE_PROFILE.education.period}</div>
            <h3 className="mt-3 font-display text-[1.6rem] leading-tight text-fg">{EXECUTIVE_PROFILE.education.degree}</h3>
            <p className="mt-2 text-[14.5px] text-fg-3">
              {EXECUTIVE_PROFILE.education.institution} — {EXECUTIVE_PROFILE.education.location}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-line lg:col-span-4">
            {EXECUTIVE_PROFILE.languages.map((lang) => (
              <div key={lang.language} className="bg-bg p-6 sm:p-8">
                <div className="eyebrow text-fg-4">Language</div>
                <div className="mt-3 font-display text-[1.35rem] text-fg">{lang.language}</div>
                <div className="mt-1 text-[12.5px] leading-snug text-fg-3">{lang.proficiency}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Milestone({ milestone, index, filter }: { milestone: CareerMilestone; index: number; filter: AchievementFilter }) {
  const ref = useRef<HTMLLIElement>(null);
  const reached = useInView(ref, { margin: "0px 0px -45% 0px", once: true });
  const visible = filter === "ALL" ? milestone.achievements : milestone.achievements.filter((a) => a.category === filter);

  return (
    <li ref={ref} className="relative grid gap-6 pb-20 pl-10 last:pb-0 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-x-16 lg:pl-0">
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[7px] top-1.5 grid size-[15px] -translate-x-1/2 place-items-center rounded-full border bg-bg transition-colors duration-500 lg:left-[17rem]",
          reached ? "border-accent" : "border-line-3"
        )}
      >
        <span className={cn("size-[7px] rounded-full transition-all duration-500", reached ? "scale-100 bg-accent" : "scale-50 bg-line-3")} />
      </span>

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
        className="lg:text-right"
      >
        <div className="eyebrow numeric text-accent">Role {pad2(index + 1)}</div>
        <div className="mt-3 font-display text-[1.45rem] leading-tight text-fg">{milestone.period}</div>
        <div className="mt-2 text-[13px] leading-snug text-fg-3">{milestone.location}</div>
        <div className="mt-1 text-[12.5px] leading-snug text-fg-4">{milestone.organizationTag}</div>
        {milestone.isDigitalFactoryRole && (
          <div className="mt-4">
            <Chip tone="accent">Digital factory builder</Chip>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.08 }}
        className="min-w-0"
      >
        <h3 className="font-display text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.08] text-fg">{milestone.role}</h3>
        <div className="mt-2 text-[15px] font-medium text-accent">{milestone.organization}</div>
        <div className="eyebrow mt-2 text-[10px] text-fg-4">{milestone.durationHighlight}</div>

        <p className="mt-6 max-w-3xl text-[16.5px] leading-[1.7] text-fg">{milestone.executiveHeadline}</p>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-[1.75] text-fg-3">{milestone.strategicScope}</p>

        <ul className="mt-7 border-t border-line">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((achievement) => (
              <motion.li
                key={achievement.text}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="grid gap-2 border-b border-line py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6"
              >
                <span className="eyebrow flex items-start gap-2 pt-0.5 text-[10px] text-fg-3">
                  <span aria-hidden="true" className={cn("mt-[4px] size-1.5 shrink-0 rounded-full", CATEGORY_TONE[achievement.category])} />
                  {achievement.category}
                </span>
                <span className="text-[14.5px] leading-[1.7] text-fg-2">{achievement.text}</span>
              </motion.li>
            ))}
            {visible.length === 0 && (
              <motion.li
                key="empty"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="border-b border-line py-4 text-[14px] italic text-fg-4"
              >
                No “{FILTERS.find((f) => f.value === filter)?.label.toLowerCase()}” highlights are recorded for this role.
              </motion.li>
            )}
          </AnimatePresence>
        </ul>

        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
          {milestone.technologies.map((tech) => (
            <li key={tech}>
              <Chip tone="mono">{tech}</Chip>
            </li>
          ))}
        </ul>
      </motion.div>
    </li>
  );
}
