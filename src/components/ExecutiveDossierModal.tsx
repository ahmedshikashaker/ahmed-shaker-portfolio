"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, ArrowUpRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { PORTFOLIO_EVENTS } from "@/lib/events";
import { useEscape, useFocusTrap, useScrollLock, useWindowEvent } from "@/lib/hooks";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import {
  EXECUTIVE_PROFILE,
  CAREER_TIMELINE,
  DIGITAL_FACTORIES,
  ARABIC_EXECUTIVE_BRIEF,
} from "@/data/portfolioData";


const CV_CORE_SKILLS = [
  {
    category: "Languages",
    items: "Kotlin, Java, Swift, Dart, C++, JavaScript / TypeScript",
  },
  {
    category: "Mobile",
    items: "Android (Native), iOS (Native), Flutter, Hilt, Dagger",
  },
  {
    category: "Backend",
    items: "NestJS, Node.js, Java EE, REST & SOAP, RabbitMQ, Kafka",
  },
  {
    category: "Data",
    items: "MongoDB, relational databases, JSON, XML (SAX, DOM)",
  },
  {
    category: "DevOps & Cloud",
    items: "Jenkins, Kubernetes, Argo CD, CI/CD, microservices",
  },
  {
    category: "Practices",
    items: "SOLID, DDD, TDD, OWASP, Agile, design patterns",
  },
  {
    category: "Tools",
    items: "Git, GitLab, Bitbucket, Jira, Confluence",
  },
];

const CV_EXPERIENCE_PRINT = [
  {
    role: "Executive Manager – Head of Digital Technology",
    org: "Kuwait International Bank (KIB) · Kuwait",
    period: "Jun 2022 – Present",
    bullets: [
      "Lead the bank’s digital technology function and internal Digital Factory, owning mobile, web, and backend delivery across retail and corporate banking products.",
      "Direct cross-platform teams delivering KIB Retail, Aqari, Corporate, Invest, Remittance (WAGE), BuyNow, Backoffice, and multi-tenant BIN Sponsorship (Al Muzaini) across Android, iOS & Web.",
      "Define enterprise architecture standards, engineering practices, and Kubernetes + Argo CD release governance across native and Flutter codebases.",
    ],
  },
  {
    role: "Android Chapter Lead",
    org: "Warba Bank · “Al-Wateen” Digital Factory · Kuwait",
    period: "Mar 2019 – Jun 2022",
    bullets: [
      "Core builder of Warba Bank’s “Al-Wateen” Digital Factory; built and managed the flagship Warba Bank mobile banking app from scratch — architecture, delivery, and ongoing support.",
      "Created automated CI/CD pipelines in Jenkins and defined Git branching and release-management strategies for the mobile chapter.",
      "Developed Fayez (fitness & loyalty) and Fayez Admin (Flutter Web), and delivered Hassala Kids, a digital savings app for children, end to end.",
    ],
  },
  {
    role: "Mobile Consultant — Android & Flutter",
    org: "Cit Global (UBA Mobile Banking) · Cairo, Egypt · Part-time",
    period: "Jan 2020 – Jan 2021",
    bullets: [
      "Re-architected and migrated UBA Mobile Banking (United Bank for Africa) from Cordova to Flutter, improving performance and maintainability.",
      "Added push notifications and a Personal Finance Management (PFM) feature; defined the app architecture and mentored the engineering team.",
    ],
  },
  {
    role: "Senior Mobile Developer",
    org: "ITG Solutions · Acting Android Lead",
    period: "Nov 2017 – Mar 2019",
    bullets: [
      "Restructured and redeveloped all versions of EduWave (Higher Education, K-12, EMIS/AMS), the MedXJordan medical app, Great Tafsirs, and Al-Zakah — improving performance and redesigning UX.",
      "Led the Android and Flutter teams; built and maintained high-performance, reusable Kotlin and Java codebases.",
    ],
  },
  {
    role: "Software Engineer",
    org: "Advicenode",
    period: "Oct 2016 – Oct 2017",
    bullets: [
      "Built the Advicenode dynamic wealth-management platform that programmatically generated cross-platform robo-advisor applications across Web, iOS, and Android.",
    ],
  },
];

const swapProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function ExecutiveDossierModal() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = useCallback(() => {
    setIsOpen(false);
    if (window.location.hash === "#cv") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);
  const [lang, setLang] = useState<"en" | "ar">("en");

  useWindowEvent(PORTFOLIO_EVENTS.openDossier, () => setIsOpen(true));
  useEffect(() => {
    if (window.location.hash === "#cv") setIsOpen(true);
  }, []);

  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(isOpen);
  useFocusTrap(panelRef, isOpen);
  useEscape(onClose, isOpen);

  return (
    <>
      {/* =====================================================================
          1-PAGE BOARDROOM-GRADE A4 PRINTABLE CV (Rendered ONLY in @media print)
         ===================================================================== */}
      <div className="hidden print-only-cv" aria-hidden="true">
        {lang === "en" ? (
          <div className="w-full text-[#0f172a] font-sans" dir="ltr">
            {/* Editorial Header */}
            <div className="pb-3 border-b border-slate-300 flex items-start justify-between gap-6">
              <div>
                <div
                  className="font-editorial text-[36px] font-normal text-[#0f172a] leading-none tracking-tight"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {EXECUTIVE_PROFILE.name}
                </div>
                <div className="mt-1.5 text-[15.5px] font-medium text-slate-700">
                  Executive Manager – Head of Digital Technology
                </div>
                <div className="mt-1 text-[12.5px] text-slate-500">
                  Mobile (Android · iOS · Flutter) &bull; Backend (NestJS · Java) &bull; DevOps (Kubernetes · Argo CD · Jenkins)
                </div>

                {/* Contact & Verification Metadata */}
                <div className="mt-3 font-tech text-[11px] text-slate-600 space-y-0.5 leading-relaxed">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span>Kuwait City, Kuwait</span>
                    <span className="text-slate-300">/</span>
                    <span>{EXECUTIVE_PROFILE.contact.phone}</span>
                    <span className="text-slate-300">/</span>
                    <a href={`mailto:${EXECUTIVE_PROFILE.contact.email}`} className="text-slate-600">
                      {EXECUTIVE_PROFILE.contact.email}
                    </a>
                  </div>
                  {/* Profile links shown as clickable words (hyperlinks are preserved in the saved PDF) */}
                  <div className="flex flex-wrap items-center gap-x-2">
                    <a href="https://www.ahmed-shaker.com" className="font-semibold text-[#0f172a] underline decoration-slate-300 underline-offset-2">
                      www.ahmed-shaker.com
                    </a>
                    <span className="text-slate-300">/</span>
                    <a href={EXECUTIVE_PROFILE.contact.linkedin} className="font-semibold text-[#0f172a] underline decoration-slate-300 underline-offset-2">
                      LinkedIn
                    </a>
                    <span className="text-slate-300">/</span>
                    <a href={EXECUTIVE_PROFILE.contact.github} className="font-semibold text-[#0f172a] underline decoration-slate-300 underline-offset-2">
                      GitHub
                    </a>
                    <span className="text-slate-300">/</span>
                    <a href={EXECUTIVE_PROFILE.contact.stackoverflow} className="font-semibold text-[#0f172a] underline decoration-slate-300 underline-offset-2">
                      Stack Overflow
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Column Editorial Resume Body */}
            <div className="pt-3 grid grid-cols-[29%_1fr] gap-5 items-start">
              {/* Left Column: Core Skills, Platforms, Education, Languages */}
              <div className="pr-4 border-r border-slate-200 space-y-4">
                <div>
                  <h2 className="font-tech text-[10.5px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-2.5">
                    Core Skills
                  </h2>
                  <div className="space-y-2">
                    {CV_CORE_SKILLS.map((group) => (
                      <div key={group.category} className="leading-[1.35]">
                        <div className="text-[11.5px] font-bold text-[#0f172a]">
                          {group.category}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {group.items}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h2 className="font-tech text-[10.5px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-2">
                    Key Platforms (16)
                  </h2>
                  <div className="space-y-1.5 text-[11px] leading-[1.35]">
                    <div>
                      <span className="font-bold text-[#0f172a]">KIB Factory: </span>
                      <span className="text-slate-600">
                        KIB Mobile, Corporate, Aqari, Invest, BuyNow, WAGE, BIN Sponsorship (Al Muzaini)
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-[#0f172a]">Warba Factory: </span>
                      <span className="text-slate-600">
                        Warba Mobile, Fayez, Fayez Admin, Hassala Kids
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-[#0f172a]">Global &amp; ITG: </span>
                      <span className="text-slate-600">
                        UBA Mobile Banking, Advicenode, EduWave (K-12, Higher-ED, AMS), MedXJordan, Great Tafsirs, Al-Zakah
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h2 className="font-tech text-[10.5px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-1.5">
                    Education
                  </h2>
                  <div className="text-[11.5px] font-bold text-[#0f172a] leading-snug">
                    B.Sc. Computer Science &amp; Information Technology
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    Faculty of Computer and Information Sciences, Ain Shams University — Cairo, Egypt
                  </div>
                  <div className="font-tech text-[10.5px] text-slate-400 mt-1">
                    2012 – 2016
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h2 className="font-tech text-[10.5px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-1.5">
                    Languages
                  </h2>
                  <div className="space-y-1 text-[11px]">
                    <div>
                      <span className="font-bold text-[#0f172a]">Arabic: </span>
                      <span className="text-slate-600">Native / Bilingual</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#0f172a]">English: </span>
                      <span className="text-slate-600">Professional Working Proficiency</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Profile & Experience */}
              <div className="space-y-3">
                <div>
                  <h2 className="font-tech text-[10.5px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-1.5">
                    Profile
                  </h2>
                  <p className="text-[12px] text-slate-700 leading-[1.48]">
                    Digital transformation leader with <strong className="text-[#0f172a]">10+ years</strong> building and scaling banking and enterprise platforms across mobile, backend, and DevOps. Instrumental in establishing <strong className="text-[#0f172a]">two banking Digital Factories from scratch</strong> at <strong className="text-[#0f172a]">Kuwait International Bank (KIB)</strong> and <strong className="text-[#0f172a]">Warba Bank</strong>, delivering core retail and corporate mobile banking, real estate, wealth, remittance, BNPL, multi-tenant BaaS BIN sponsorship, and loyalty products from the ground up. Hands-on technical leader strong in architecture, team building, CI/CD automation, and microservices.
                  </p>
                </div>

                <div className="pt-1">
                  <h2 className="font-tech text-[10.5px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-2.5">
                    Experience
                  </h2>
                  <div className="space-y-2.5">
                    {CV_EXPERIENCE_PRINT.map((exp, idx) => (
                      <div key={idx} className="break-inside-avoid">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3
                            className="text-[14px] font-bold text-[#0f172a]"
                            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                          >
                            {exp.role}
                          </h3>
                          <span className="font-tech text-[10.5px] text-slate-400 shrink-0">
                            {exp.period}
                          </span>
                        </div>
                        <div className="text-[11.5px] font-medium text-slate-600 mt-0.5">
                          {exp.org}
                        </div>
                        <ul className="mt-1.5 space-y-1">
                          {exp.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="text-[11.5px] text-slate-700 leading-[1.42] flex items-start gap-2"
                            >
                              <span className="text-slate-400 mt-[1px]">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Arabic 1-Page Printable Executive CV (RTL) */
          <div className="w-full text-[#0f172a] font-sans text-right" dir="rtl">
            <div className="pb-4 border-b border-slate-300 flex items-start justify-between gap-6">
              <div>
                <div className="text-[32px] font-bold text-[#0f172a] leading-tight">
                  {ARABIC_EXECUTIVE_BRIEF.name}
                </div>
                <div className="mt-1 text-[14.5px] font-semibold text-slate-700">
                  مدير تنفيذي – رئيس التكنولوجيا الرقمية (Executive Manager – Head of Digital Technology)
                </div>
                <div className="mt-1 text-[12px] text-slate-500" dir="ltr">
                  Mobile (Android · iOS · Flutter) &bull; Backend (NestJS · Java) &bull; DevOps (Kubernetes · Argo CD · Jenkins)
                </div>
                <div className="mt-2.5 font-tech text-[11px] text-slate-600 flex flex-wrap items-center gap-x-2" dir="ltr">
                  <span>www.ahmed-shaker.com</span>
                  <span className="text-slate-300">/</span>
                  <span>{EXECUTIVE_PROFILE.contact.email}</span>
                  <span className="text-slate-300">/</span>
                  <span>{EXECUTIVE_PROFILE.contact.phone}</span>
                  <span className="text-slate-300">/</span>
                  <span>Kuwait City, Kuwait</span>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div>
                <h2 className="text-[12.5px] font-bold text-slate-500 mb-1.5">
                  الملخص التنفيذي
                </h2>
                <p className="text-[12.5px] text-slate-800 leading-[1.7]">
                  {ARABIC_EXECUTIVE_BRIEF.summary}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {ARABIC_EXECUTIVE_BRIEF.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <div className="text-[11.5px] font-bold text-[#0f172a]">
                      {item.label}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-700 leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-[12.5px] font-bold text-slate-500 mb-2">
                  المسيرة المهنية والقيادية (2016 – حتى الآن)
                </h2>
                <div className="space-y-3">
                  {ARABIC_EXECUTIVE_BRIEF.careerSummary.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-200 break-inside-avoid"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-[13.5px] font-bold text-[#0f172a]">
                          {item.role} — <span className="text-slate-600">{item.org}</span>
                        </h3>
                        <span className="font-tech text-[11px] text-slate-500">
                          {item.period}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-slate-700 leading-[1.65]">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          INTERACTIVE ON-SCREEN DOSSIER (Hidden during print via .no-print)
         ===================================================================== */}
      <AnimatePresence>
        {isOpen && (
          <div className="no-print fixed inset-0 z-[90]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.05 } }}
              onClick={onClose}
              className="absolute inset-0 bg-bg/75 backdrop-blur-md"
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dossier-modal-title"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%", transition: { duration: 0.4, ease: EASE_IN_OUT } }}
              transition={{ type: "spring", stiffness: 240, damping: 34, mass: 0.9 }}
              className="absolute inset-y-0 right-0 flex w-full max-w-[64rem] flex-col border-l border-line-2 bg-surface shadow-float"
            >
              {/* Top bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-8">
                <div className="min-w-0">
                  <div className="eyebrow text-accent">{lang === "en" ? "Executive dossier" : "الملف التنفيذي"}</div>
                  <span id="dossier-modal-title" className="mt-1 block truncate text-[13px] text-fg-3">
                    {lang === "en"
                      ? "Curriculum vitae · 1-page A4, print-ready"
                      : "السيرة الذاتية · صفحة A4 واحدة جاهزة للطباعة"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <SegmentedControl
                    label="CV language"
                    size="sm"
                    value={lang}
                    onChange={setLang}
                    options={[
                      { value: "en", label: "English" },
                      { value: "ar", label: <span className="font-arabic">العربية</span> },
                    ]}
                  />
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className={buttonClasses({ size: "sm" })}
                  >
                    <Printer className="size-3.5" strokeWidth={1.75} />
                    <span className="hidden sm:inline">{lang === "en" ? "Print / Save PDF" : "طباعة / حفظ PDF"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    data-autofocus
                    aria-label="Close executive dossier"
                    className="grid size-9 cursor-pointer place-items-center rounded-full border border-line-2 text-fg transition-colors hover:bg-surface-2"
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <AnimatePresence mode="wait" initial={false}>
                  {lang === "en" ? (
                    <motion.div key="en" {...swapProps} className="space-y-10 p-6 sm:p-10" dir="ltr">
                      <header className="grid gap-6 border-b border-line pb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                        <div>
                          <h2 className="font-display text-[clamp(2.25rem,4vw,3.25rem)] leading-none text-fg">{EXECUTIVE_PROFILE.name}</h2>
                          <p className="mt-3 text-[15px] font-medium text-accent">
                            Executive Manager – Head of Digital Technology · Digital Banking Transformation &amp; Architecture
                          </p>
                          <p className="eyebrow mt-2 text-[10px] leading-relaxed text-fg-4">
                            Mobile (Android · iOS · Flutter) • Backend (NestJS · Java) • DevOps (Kubernetes · Argo CD · Jenkins)
                          </p>
                        </div>
                        <dl className="space-y-1 text-[12.5px] text-fg-3 md:text-right">
                          <dd>{EXECUTIVE_PROFILE.location}</dd>
                          <dd className="numeric">{EXECUTIVE_PROFILE.contact.phone}</dd>
                          <dd>{EXECUTIVE_PROFILE.contact.email}</dd>
                          <dd className="font-mono text-accent">www.ahmed-shaker.com</dd>
                        </dl>
                      </header>

                      <div className="grid gap-10 lg:grid-cols-12">
                        <aside className="space-y-8 lg:col-span-4">
                          <div>
                            <div className="eyebrow text-accent">Core skills</div>
                            <dl className="mt-4 space-y-3.5 border-t border-line pt-4">
                              {CV_CORE_SKILLS.map((group) => (
                                <div key={group.category}>
                                  <dt className="text-[13px] font-medium text-fg">{group.category}</dt>
                                  <dd className="mt-0.5 text-[12.5px] leading-relaxed text-fg-3">{group.items}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                          <div>
                            <div className="eyebrow text-accent">Education</div>
                            <div className="mt-4 border-t border-line pt-4">
                              <div className="text-[14px] font-medium text-fg">{EXECUTIVE_PROFILE.education.degree}</div>
                              <div className="mt-1 text-[12.5px] leading-relaxed text-fg-3">
                                {EXECUTIVE_PROFILE.education.institution} ({EXECUTIVE_PROFILE.education.period})
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="eyebrow text-accent">Languages</div>
                            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
                              <div className="flex justify-between gap-3">
                                <dt className="text-fg">Arabic</dt>
                                <dd className="text-fg-3">Native / Bilingual</dd>
                              </div>
                              <div className="flex justify-between gap-3">
                                <dt className="text-fg">English</dt>
                                <dd className="text-fg-3">Professional Working</dd>
                              </div>
                            </dl>
                          </div>
                          <div>
                            <div className="eyebrow text-accent">Verified profiles</div>
                            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-[13px]">
                              {[
                                { href: EXECUTIVE_PROFILE.contact.linkedin, label: "LinkedIn" },
                                { href: EXECUTIVE_PROFILE.contact.github, label: "GitHub" },
                                { href: EXECUTIVE_PROFILE.contact.stackoverflow, label: "Stack Overflow" },
                              ].map((link) => (
                                <a
                                  key={link.href}
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-fg-2 transition-colors hover:text-accent"
                                >
                                  {link.label}
                                  <ArrowUpRight className="size-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </aside>

                        <div className="space-y-10 lg:col-span-8">
                          <div>
                            <div className="eyebrow text-accent">Executive profile</div>
                            <p className="mt-4 font-display text-[1.25rem] leading-[1.55] text-fg">
                              {EXECUTIVE_PROFILE.shortBio} Hands-on technical leader strong in architecture, team building, CI/CD automation, and microservices.
                            </p>
                          </div>

                          <div>
                            <div className="eyebrow text-accent">Key differentiator · Two digital factories built from scratch</div>
                            <div className="mt-4 grid gap-px border border-line bg-line md:grid-cols-2">
                              {DIGITAL_FACTORIES.map((df) => (
                                <div key={df.id} className="bg-surface p-5">
                                  <div className="eyebrow numeric text-[10px] text-fg-4">{df.period}</div>
                                  <div className="mt-2 text-[15px] font-medium text-fg">
                                    {df.institution} — {df.role}
                                  </div>
                                  <p className="mt-2 text-[12.5px] leading-relaxed text-fg-3">{df.executiveSummary}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="eyebrow text-accent">Career progression · 2016 – present</div>
                            <ol className="mt-4 border-t border-line">
                              {CAREER_TIMELINE.map((role) => (
                                <li key={role.id} className="border-b border-line py-5">
                                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h4 className="font-display text-[1.2rem] text-fg">
                                      {role.role} — <span className="text-accent">{role.organization}</span>
                                    </h4>
                                    <span className="eyebrow numeric text-[10px] text-fg-4">
                                      {role.period} · {role.location}
                                    </span>
                                  </div>
                                  <ul className="mt-3 space-y-1.5">
                                    {role.achievements.map((ach, i) => (
                                      <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-fg-2">
                                        <span aria-hidden="true" className="mt-[8px] size-1 shrink-0 rounded-full bg-accent" />
                                        {ach.text}
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="ar" {...swapProps} className="font-arabic space-y-10 p-6 text-right sm:p-10" dir="rtl" lang="ar">
                      <header className="grid gap-6 border-b border-line pb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                        <div>
                          <h2 className="text-[clamp(2rem,3.6vw,2.75rem)] font-bold leading-tight text-fg">{ARABIC_EXECUTIVE_BRIEF.name}</h2>
                          <p className="mt-3 text-[15px] font-medium leading-relaxed text-accent">{ARABIC_EXECUTIVE_BRIEF.title}</p>
                          <p className="eyebrow mt-2 text-[10px] leading-relaxed text-fg-4" dir="ltr">
                            Mobile (Android · iOS · Flutter) • Backend (NestJS · Java) • DevOps (Kubernetes · Argo CD · Jenkins)
                          </p>
                        </div>
                        <dl className="space-y-1 text-[12.5px] text-fg-3">
                          <dd>{ARABIC_EXECUTIVE_BRIEF.location}</dd>
                          <dd dir="ltr" className="numeric">
                            {EXECUTIVE_PROFILE.contact.phone}
                          </dd>
                          <dd dir="ltr">{EXECUTIVE_PROFILE.contact.email}</dd>
                        </dl>
                      </header>

                      <div>
                        <div className="text-[12px] font-semibold text-accent">الملخص التنفيذي</div>
                        <p className="mt-4 text-[16px] leading-[1.95] text-fg">{ARABIC_EXECUTIVE_BRIEF.summary}</p>
                      </div>

                      <div className="grid gap-px border border-line bg-line md:grid-cols-3">
                        {ARABIC_EXECUTIVE_BRIEF.highlights.map((item, idx) => (
                          <div key={idx} className="bg-surface p-5">
                            <div className="text-[12.5px] font-semibold text-accent">{item.label}</div>
                            <p className="mt-2 text-[13.5px] leading-relaxed text-fg-2">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="text-[12px] font-semibold text-accent">المسيرة المهنية والقيادية (2016 – حتى الآن)</div>
                        <ol className="mt-4 border-t border-line">
                          {ARABIC_EXECUTIVE_BRIEF.careerSummary.map((item, idx) => (
                            <li key={idx} className="border-b border-line py-5">
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h4 className="text-[16px] font-bold text-fg">
                                  {item.role} — <span className="text-accent">{item.org}</span>
                                </h4>
                                <span className="text-[12px] text-fg-4">{item.period}</span>
                              </div>
                              <p className="mt-2.5 text-[14px] leading-[1.9] text-fg-2">{item.desc}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
