"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Printer, ArrowUpRight, Globe } from "lucide-react";
import {
  EXECUTIVE_PROFILE,
  CAREER_TIMELINE,
  DIGITAL_FACTORIES,
  ARABIC_EXECUTIVE_BRIEF,
} from "@/data/portfolioData";

interface ExecutiveDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    role: "Head of Digital Technology",
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

export default function ExecutiveDossierModal({
  isOpen,
  onClose,
}: ExecutiveDossierModalProps) {
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* =====================================================================
          1-PAGE BOARDROOM-GRADE A4 PRINTABLE CV (Rendered ONLY in @media print)
         ===================================================================== */}
      <div className="hidden print-only-cv" aria-hidden="true">
        {lang === "en" ? (
          <div className="w-full text-[#0f172a] font-sans" dir="ltr">
            {/* Editorial Header */}
            <div className="pb-4 border-b border-slate-300 flex items-start justify-between gap-6">
              <div>
                <div
                  className="font-editorial text-[34px] font-normal text-[#0f172a] leading-none tracking-tight"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {EXECUTIVE_PROFILE.name}
                </div>
                <div className="mt-1.5 text-[14px] font-medium text-slate-700">
                  Head of Digital Technology · Banking Digital Factory Architect
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Mobile (Android · iOS · Flutter) &bull; Backend (NestJS · Java) &bull; DevOps (Kubernetes · Argo CD · Jenkins)
                </div>

                {/* Contact & Verification Metadata */}
                <div className="mt-3 font-tech text-[9.5px] text-slate-600 space-y-0.5 leading-relaxed">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span>Kuwait City, Kuwait</span>
                    <span className="text-slate-300">/</span>
                    <span>{EXECUTIVE_PROFILE.contact.phone}</span>
                    <span className="text-slate-300">/</span>
                    <span>{EXECUTIVE_PROFILE.contact.email}</span>
                    <span className="text-slate-300">/</span>
                    <span className="font-semibold text-[#0f172a]">www.ahmed-shaker.com</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span>linkedin.com/in/ahmed-shaker-492413a2</span>
                    <span className="text-slate-300">/</span>
                    <span>{EXECUTIVE_PROFILE.contact.githubDisplay}</span>
                    <span className="text-slate-300">/</span>
                    <span>{EXECUTIVE_PROFILE.contact.stackoverflowDisplay}</span>
                  </div>
                </div>
              </div>

              {/* Crisp Executive Portrait */}
              <div className="w-[62px] h-[62px] rounded-xl overflow-hidden border border-slate-300 shrink-0">
                <img
                  src="/assets/profile/ahmed-shaker-portrait.jpg"
                  alt={EXECUTIVE_PROFILE.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Two-Column Editorial Resume Body */}
            <div className="pt-4 grid grid-cols-12 gap-6 items-start">
              {/* Left Column (4 cols): Core Skills, Platforms, Education, Languages */}
              <div className="col-span-4 pr-5 border-r border-slate-200 space-y-4">
                <div>
                  <h2 className="font-tech text-[9px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-2.5">
                    Core Skills
                  </h2>
                  <div className="space-y-2">
                    {CV_CORE_SKILLS.map((group) => (
                      <div key={group.category} className="leading-[1.35]">
                        <div className="text-[10px] font-bold text-[#0f172a]">
                          {group.category}
                        </div>
                        <div className="text-[9.5px] text-slate-600 mt-0.5">
                          {group.items}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h2 className="font-tech text-[9px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-2">
                    Key Platforms (16)
                  </h2>
                  <div className="space-y-1.5 text-[9.5px] leading-[1.35]">
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
                  <h2 className="font-tech text-[9px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-1.5">
                    Education
                  </h2>
                  <div className="text-[10px] font-bold text-[#0f172a] leading-snug">
                    B.Sc. Computer Science &amp; Information Technology
                  </div>
                  <div className="text-[9.5px] text-slate-600 mt-0.5 leading-snug">
                    Faculty of Computer and Information Sciences, Ain Shams University — Cairo, Egypt
                  </div>
                  <div className="font-tech text-[9px] text-slate-400 mt-1">
                    2012 – 2016
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h2 className="font-tech text-[9px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-1.5">
                    Languages
                  </h2>
                  <div className="space-y-1 text-[9.5px]">
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

              {/* Right Column (8 cols): Profile & Experience */}
              <div className="col-span-8 space-y-4">
                <div>
                  <h2 className="font-tech text-[9px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-1.5">
                    Profile
                  </h2>
                  <p className="text-[10.5px] text-slate-700 leading-[1.48]">
                    Digital transformation leader with <strong className="text-[#0f172a]">10+ years</strong> building and scaling banking and enterprise platforms across mobile, backend, and DevOps. Instrumental in establishing <strong className="text-[#0f172a]">two banking Digital Factories from scratch</strong> at <strong className="text-[#0f172a]">Kuwait International Bank (KIB)</strong> and <strong className="text-[#0f172a]">Warba Bank</strong>, delivering core retail and corporate mobile banking, real estate, wealth, remittance, BNPL, multi-tenant BaaS BIN sponsorship, and loyalty products from the ground up. Hands-on technical leader strong in architecture, team building, CI/CD automation, and microservices.
                  </p>
                </div>

                <div className="pt-1">
                  <h2 className="font-tech text-[9px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-2.5">
                    Experience
                  </h2>
                  <div className="space-y-3.5">
                    {CV_EXPERIENCE_PRINT.map((exp, idx) => (
                      <div key={idx} className="break-inside-avoid">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3
                            className="text-[12.5px] font-bold text-[#0f172a]"
                            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                          >
                            {exp.role}
                          </h3>
                          <span className="font-tech text-[9px] text-slate-400 shrink-0">
                            {exp.period}
                          </span>
                        </div>
                        <div className="text-[10px] font-medium text-slate-600 mt-0.5">
                          {exp.org}
                        </div>
                        <ul className="mt-1.5 space-y-1">
                          {exp.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="text-[9.8px] text-slate-700 leading-[1.42] flex items-start gap-2"
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
                <div className="text-[30px] font-bold text-[#0f172a] leading-tight">
                  {ARABIC_EXECUTIVE_BRIEF.name}
                </div>
                <div className="mt-1 text-[13px] font-semibold text-slate-700">
                  {ARABIC_EXECUTIVE_BRIEF.title}
                </div>
                <div className="mt-1 text-[10.5px] text-slate-500" dir="ltr">
                  Mobile (Android · iOS · Flutter) &bull; Backend (NestJS · Java) &bull; DevOps (Kubernetes · Argo CD · Jenkins)
                </div>
                <div className="mt-2.5 font-tech text-[9.5px] text-slate-600 flex flex-wrap items-center gap-x-2" dir="ltr">
                  <span>www.ahmed-shaker.com</span>
                  <span className="text-slate-300">/</span>
                  <span>{EXECUTIVE_PROFILE.contact.email}</span>
                  <span className="text-slate-300">/</span>
                  <span>{EXECUTIVE_PROFILE.contact.phone}</span>
                  <span className="text-slate-300">/</span>
                  <span>Kuwait City, Kuwait</span>
                </div>
              </div>
              <div className="w-[62px] h-[62px] rounded-xl overflow-hidden border border-slate-300 shrink-0">
                <img
                  src="/assets/profile/ahmed-shaker-portrait.jpg"
                  alt={ARABIC_EXECUTIVE_BRIEF.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div>
                <h2 className="text-[11px] font-bold text-slate-500 mb-1.5">
                  الملخص التنفيذي
                </h2>
                <p className="text-[11px] text-slate-800 leading-[1.7]">
                  {ARABIC_EXECUTIVE_BRIEF.summary}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {ARABIC_EXECUTIVE_BRIEF.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <div className="text-[10px] font-bold text-[#0f172a]">
                      {item.label}
                    </div>
                    <p className="mt-1 text-[9.5px] text-slate-700 leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-[11px] font-bold text-slate-500 mb-2">
                  المسيرة المهنية والقيادية (2016 – حتى الآن)
                </h2>
                <div className="space-y-3">
                  {ARABIC_EXECUTIVE_BRIEF.careerSummary.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-200 break-inside-avoid"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-[12px] font-bold text-[#0f172a]">
                          {item.role} — <span className="text-slate-600">{item.org}</span>
                        </h3>
                        <span className="font-tech text-[9.5px] text-slate-500">
                          {item.period}
                        </span>
                      </div>
                      <p className="mt-1 text-[10.5px] text-slate-700 leading-[1.65]">
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
          INTERACTIVE ON-SCREEN MODAL (Hidden during print via .no-print)
         ===================================================================== */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="no-print fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dossier-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#131c31] text-slate-100 border border-slate-200/15 shadow-2xl"
            >
              {/* Top Bar */}
              <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-200/10">
                <span
                  id="dossier-modal-title"
                  className="font-tech text-xs text-[#dfc490]"
                >
                  {lang === "en"
                    ? "Executive Curriculum Vitae · Ahmed Shaker (1-Page A4 Print-Ready)"
                    : "الملف التنفيذي والسيرة الذاتية · أحمد شاكر (جاهز للطباعة A4)"}
                </span>
                <div className="flex items-center gap-2.5">
                  {/* Language Switcher */}
                  <div className="inline-flex items-center rounded-lg bg-[#182338] p-0.5 border border-slate-200/10">
                    <button
                      onClick={() => setLang("en")}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        lang === "en"
                          ? "bg-[#dfc490] text-slate-950 font-semibold"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLang("ar")}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        lang === "ar"
                          ? "bg-[#dfc490] text-slate-950 font-semibold"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>العربية</span>
                    </button>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#dfc490] hover:bg-[#e8d1a4] text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{lang === "en" ? "Print / Save 1-Page PDF" : "طباعة / حفظ PDF"}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg bg-[#182338] text-slate-300 hover:text-white cursor-pointer"
                    aria-label="Close Executive Dossier"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              {lang === "en" ? (
                <div className="p-6 sm:p-10 space-y-8" dir="ltr">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/10">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#dfc490]/50 bg-[#182338] shrink-0">
                        <Image
                          src="/assets/profile/ahmed-shaker-portrait.jpg"
                          alt={EXECUTIVE_PROFILE.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-50">
                          {EXECUTIVE_PROFILE.name}
                        </h2>
                        <p className="mt-1 text-sm sm:text-base font-medium text-[#dfc490]">
                          {EXECUTIVE_PROFILE.title} · Digital Banking Transformation &amp; Architecture
                        </p>
                        <p className="mt-1 text-xs font-tech text-slate-400">
                          Mobile (Android · iOS · Flutter) • Backend (NestJS · Java) • DevOps (Kubernetes · Argo CD · Jenkins)
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1 md:text-right">
                      <div>{EXECUTIVE_PROFILE.location}</div>
                      <div>{EXECUTIVE_PROFILE.contact.phone}</div>
                      <div>{EXECUTIVE_PROFILE.contact.email}</div>
                      <div className="text-[#dfc490] font-tech">www.ahmed-shaker.com</div>
                    </div>
                  </div>

                  {/* Two-Column Executive Resume Layout on Screen */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Core Skills, Education, Languages, Profiles */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-200/10 space-y-3.5">
                        <div className="text-xs font-tech uppercase tracking-wider text-[#dfc490]">
                          Core Skills
                        </div>
                        {CV_CORE_SKILLS.map((group) => (
                          <div key={group.category} className="space-y-0.5">
                            <div className="text-xs font-semibold text-slate-100">
                              {group.category}
                            </div>
                            <div className="text-xs text-slate-400 leading-relaxed">
                              {group.items}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-200/10 text-xs space-y-1.5">
                        <div className="font-tech text-[#dfc490] uppercase tracking-wider">
                          Education
                        </div>
                        <div className="font-semibold text-sm text-slate-100">
                          {EXECUTIVE_PROFILE.education.degree}
                        </div>
                        <div className="text-slate-300 leading-relaxed">
                          {EXECUTIVE_PROFILE.education.institution} ({EXECUTIVE_PROFILE.education.period})
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-200/10 text-xs space-y-2">
                        <div className="font-tech text-[#dfc490] uppercase tracking-wider">
                          Languages
                        </div>
                        <div className="flex justify-between text-slate-200">
                          <span className="font-semibold">Arabic</span>
                          <span className="text-slate-400">Native / Bilingual</span>
                        </div>
                        <div className="flex justify-between text-slate-200">
                          <span className="font-semibold">English</span>
                          <span className="text-slate-400">Professional Working</span>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-200/10 text-xs space-y-2.5">
                        <div className="font-tech text-[#dfc490] uppercase tracking-wider">
                          Verified Profiles
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={EXECUTIVE_PROFILE.contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-200 hover:text-[#dfc490]"
                          >
                            <span>LinkedIn</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                          <a
                            href={EXECUTIVE_PROFILE.contact.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-200 hover:text-[#dfc490]"
                          >
                            <span>GitHub</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                          <a
                            href={EXECUTIVE_PROFILE.contact.stackoverflow}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-200 hover:text-[#dfc490]"
                          >
                            <span>Stack Overflow</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Profile, 2 Digital Factories, Experience */}
                    <div className="lg:col-span-8 space-y-6">
                      <div>
                        <h3 className="text-xs font-tech uppercase tracking-wider text-[#dfc490] mb-2">
                          Executive Profile
                        </h3>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                          {EXECUTIVE_PROFILE.shortBio} Hands-on technical leader strong in architecture, team building, CI/CD automation, and microservices.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xs font-tech uppercase tracking-wider text-[#dfc490] mb-3">
                          Key Differentiator: Two Digital Factories Built from Scratch
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {DIGITAL_FACTORIES.map((df) => (
                            <div
                              key={df.id}
                              className="p-4 rounded-2xl bg-[#0f172a]/70 border border-slate-200/10"
                            >
                              <div className="text-xs font-tech text-[#dfc490]">{df.period}</div>
                              <div className="text-base font-semibold text-slate-50 mt-0.5">
                                {df.institution} — {df.role}
                              </div>
                              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                                {df.executiveSummary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-tech uppercase tracking-wider text-[#dfc490] mb-3">
                          Career Progression (2016 – Present)
                        </h3>
                        <div className="space-y-4">
                          {CAREER_TIMELINE.map((role) => (
                            <div
                              key={role.id}
                              className="p-5 rounded-2xl bg-[#0f172a]/60 border border-slate-200/[0.08]"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h4 className="text-base font-bold text-slate-50">
                                  {role.role} — <span className="text-[#dfc490]">{role.organization}</span>
                                </h4>
                                <span className="text-xs font-tech text-slate-400">
                                  {role.period} · {role.location}
                                </span>
                              </div>
                              <ul className="mt-3 space-y-1.5">
                                {role.achievements.map((ach, i) => (
                                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                    <span className="text-[#dfc490]">•</span>
                                    <span>{ach.text}</span>
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
                /* Arabic Executive Brief (RTL) */
                <div className="p-6 sm:p-10 space-y-8 text-right" dir="rtl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/10">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#dfc490]/50 bg-[#182338] shrink-0">
                        <Image
                          src="/assets/profile/ahmed-shaker-portrait.jpg"
                          alt={ARABIC_EXECUTIVE_BRIEF.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-50">
                          {ARABIC_EXECUTIVE_BRIEF.name}
                        </h2>
                        <p className="mt-1.5 text-sm sm:text-base font-medium text-[#dfc490]">
                          {ARABIC_EXECUTIVE_BRIEF.title}
                        </p>
                        <p className="mt-1 text-xs font-tech text-slate-400" dir="ltr">
                          Mobile (Android · iOS · Flutter) • Backend (NestJS · Java) • DevOps (Kubernetes · Argo CD · Jenkins)
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1">
                      <div>{ARABIC_EXECUTIVE_BRIEF.location}</div>
                      <div dir="ltr">{EXECUTIVE_PROFILE.contact.phone}</div>
                      <div dir="ltr">{EXECUTIVE_PROFILE.contact.email}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-[#dfc490] mb-2">
                      الملخص التنفيذي
                    </h3>
                    <p className="text-sm sm:text-base text-slate-200 leading-[1.85]">
                      {ARABIC_EXECUTIVE_BRIEF.summary}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ARABIC_EXECUTIVE_BRIEF.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#0f172a]/80 border border-[#dfc490]/25"
                      >
                        <div className="text-xs font-semibold text-[#dfc490]">
                          {item.label}
                        </div>
                        <p className="mt-1.5 text-xs sm:text-sm text-slate-100 leading-relaxed">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Career Progression in Arabic */}
                  <div>
                    <h3 className="text-xs font-semibold text-[#dfc490] mb-3">
                      المسيرة المهنية والقيادية (2016 – حتى الآن)
                    </h3>
                    <div className="space-y-4">
                      {ARABIC_EXECUTIVE_BRIEF.careerSummary.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-[#0f172a]/60 border border-slate-200/[0.08]"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h4 className="text-base font-bold text-slate-50">
                              {item.role} —{" "}
                              <span className="text-[#dfc490]">{item.org}</span>
                            </h4>
                            <span className="text-xs font-tech text-slate-400">
                              {item.period}
                            </span>
                          </div>
                          <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-[1.8]">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
