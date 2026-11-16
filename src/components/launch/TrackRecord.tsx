"use client";

import { motion } from "framer-motion";
import { SECTION_COPY, TRACK_RECORD } from "@/data/portfolioData";
import { scrollToSection } from "@/lib/events";
import { CONTACT_ID } from "@/lib/site";
import { EASE, FadeUp, useReducedMotionSafe } from "./motion";
import { Band, ChevronLink, DossierLink, Emphasis, Heading, Wrap } from "./primitives";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FIRST_YEAR = 2016;
const LAST_YEAR = 2026;
const SPAN = (LAST_YEAR - FIRST_YEAR + 1) * 12;

/** "Jun 2022" → months since January of the first year; "Present" → the end of the axis. */
const toMonth = (value: string) => {
  const [month, year] = value.trim().split(" ");
  if (!year) return SPAN;
  return (Number(year) - FIRST_YEAR) * 12 + Math.max(0, MONTHS.indexOf(month));
};

const SHORT_NAME: Record<string, string> = {
  kib: "KIB",
  warba: "Warba Bank",
  "cit-global": "Cit Global · UBA",
  itg: "ITG Solutions",
  advicenode: "Advicenode",
};

const ROLES = TRACK_RECORD.map((role) => {
  const [from, to] = role.period.split("–");
  const start = toMonth(from);
  const end = toMonth(to);
  return { ...role, start, end, years: `${from.trim().split(" ")[1]}–${to.trim() === "Present" ? "Now" : to.trim().split(" ")[1]}` };
});

const TICKS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);

/** 04 · Track Record: ten years on one axis, then the five mandates in a line each. */
export default function TrackRecord() {
  const copy = SECTION_COPY.trackRecord;
  return (
    <Band id="track-record" tone="light" labelledBy="track-record-title">
      <Wrap className="py-[clamp(5rem,9vw,8rem)]">
        <Heading id="track-record-title" kicker={copy.eyebrow} title={<Emphasis text={copy.title} />} sub={copy.subtitle} />
        <Timeline />
        <ol className="mt-14 lg:mt-20">
          {ROLES.map((role, i) => (
            <FadeUp as="li" key={role.id} delay={i * 0.04} amount={0.3} className="grid gap-3 border-t border-l-line py-8 lg:grid-cols-12 lg:gap-10 lg:py-10">
              <div className="lg:col-span-5">
                <p className="t-small font-semibold text-l-fg-3">{role.period}</p>
                <h3 className="t-h3 mt-1.5 text-l-fg">{role.institution}</h3>
                <p className="t-small mt-1 text-l-fg-4">{role.location}</p>
              </div>
              <div className="lg:col-span-7">
                <p className="t-h4 text-l-fg">{role.title}</p>
                <p className="t-body mt-2 max-w-[58ch] text-l-fg-3">{role.mandate}</p>
              </div>
            </FadeUp>
          ))}
        </ol>
        <FadeUp className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-l-line pt-8">
          <DossierLink label="Open the executive CV" className="t-body" />
          <ChevronLink onClick={() => scrollToSection(CONTACT_ID)} className="t-body">
            Start a conversation
          </ChevronLink>
        </FadeUp>
      </Wrap>
    </Band>
  );
}

function Timeline() {
  const reduce = useReducedMotionSafe();
  return (
    <FadeUp className="mt-14 rounded-[32px] bg-l-card p-6 sm:p-10 lg:mt-20" amount={0.2}>
      <figure aria-label={`Career timeline, ${FIRST_YEAR} to present`}>
        <ol className="space-y-3 sm:space-y-4">
          {ROLES.map((role, i) => (
            <li key={role.id} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
              <span className="t-small truncate font-semibold text-l-fg">{SHORT_NAME[role.id] ?? role.institution}</span>
              <span className="relative block h-9 sm:h-10">
                <span aria-hidden="true" className="absolute inset-y-[44%] left-0 right-0 rounded-full bg-l-fg/[0.06]" />
                <motion.span
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.15 + i * 0.12 }}
                  className={`absolute inset-y-0 flex origin-left items-center justify-end overflow-hidden rounded-full px-3 ${role.end >= SPAN ? "bg-l-accent text-white" : "bg-l-fg text-l-bg"}`}
                  style={{
                    left: `${(role.start / SPAN) * 100}%`,
                    width: `${Math.max(((role.end - role.start) / SPAN) * 100, 7)}%`,
                  }}
                >
                  <span className="numeric whitespace-nowrap text-[13px] font-semibold max-sm:sr-only">{role.years}</span>
                </motion.span>
              </span>
            </li>
          ))}
        </ol>
        <div aria-hidden="true" className="mt-4 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
          <span />
          <span className="relative block h-5">
            {TICKS.map((year, i) => (
              <span
                key={year}
                className={`numeric absolute top-0 -translate-x-1/2 text-[11px] font-medium text-l-fg-4 sm:text-[12px] ${i % 2 === 1 ? "max-sm:hidden" : ""}`}
                style={{ left: `${((i * 12) / SPAN) * 100}%` }}
              >
                {year}
              </span>
            ))}
          </span>
        </div>
      </figure>
    </FadeUp>
  );
}
