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
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
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
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#131c31] text-slate-100 border border-slate-200/15 shadow-2xl"
          >
            {/* Top Bar */}
            <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-200/10">
              <span
                id="dossier-modal-title"
                className="font-tech text-xs text-[#dfc490]"
              >
                {lang === "en"
                  ? "Executive Curriculum Vitae · Ahmed Shaker"
                  : "الملف التنفيذي والسيرة الذاتية · أحمد شاكر"}
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#dfc490] text-slate-950 text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === "en" ? "Print / Save PDF" : "طباعة / PDF"}</span>
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
                  </div>
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#0f172a]/60 border border-slate-200/[0.08] text-xs space-y-1.5">
                    <div className="font-tech text-[#dfc490] uppercase">Education</div>
                    <div className="font-semibold text-sm text-slate-100">
                      {EXECUTIVE_PROFILE.education.degree}
                    </div>
                    <div className="text-slate-300">
                      {EXECUTIVE_PROFILE.education.institution} ({EXECUTIVE_PROFILE.education.period})
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0f172a]/60 border border-slate-200/[0.08] text-xs space-y-2">
                    <div className="font-tech text-[#dfc490] uppercase">Verified Profiles</div>
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
  );
}
