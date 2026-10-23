"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, ArrowUpRight } from "lucide-react";
import {
  EXECUTIVE_PROFILE,
  CAREER_TIMELINE,
  SKILL_MATRIX,
  DIGITAL_FACTORIES,
} from "@/data/portfolioData";

interface ExecutiveDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExecutiveDossierModal({
  isOpen,
  onClose,
}: ExecutiveDossierModalProps) {
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
          className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F2EFE9] text-[#0B0B0A] border-2 border-[#0B0B0A] shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
          >
            {/* Top Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#080807] text-[#F4F0E8] border-b border-[#F4F0E8]/15">
              <span
                id="dossier-modal-title"
                className="font-tech text-xs uppercase tracking-[0.18em] text-[#C8A464]"
              >
                BOARD DOSSIER &amp; CURRICULUM VITAE // AHMED SHAKER
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A464] text-[#080807] font-tech text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#9A958B] hover:text-[#F4F0E8] cursor-pointer"
                  aria-label="Close Executive Dossier"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Monograph Body */}
            <div className="p-6 sm:p-12 space-y-10">
              {/* Identity Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-2 border-[#0B0B0A]">
                <div>
                  <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.04em] text-[#0B0B0A]">
                    {EXECUTIVE_PROFILE.name}
                  </h2>
                  <p className="mt-1 text-lg font-bold text-[#8C6B2F]">
                    {EXECUTIVE_PROFILE.title} · Digital Banking Transformation &amp; Architecture
                  </p>
                  <p className="mt-1 font-tech text-xs text-[#4A4843]">
                    Mobile (Android · iOS · Flutter) • Backend (NestJS · Java) • DevOps (Kubernetes · Argo CD · Jenkins)
                  </p>
                </div>
                <div className="font-tech text-xs text-[#2B2A27] space-y-1 md:text-right">
                  <div>{EXECUTIVE_PROFILE.location}</div>
                  <div>{EXECUTIVE_PROFILE.contact.phone}</div>
                  <div>{EXECUTIVE_PROFILE.contact.email}</div>
                </div>
              </div>

              {/* Profile Statement */}
              <div>
                <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#8C6B2F] mb-2">
                  01 // EXECUTIVE SUMMARY
                </div>
                <p className="text-sm sm:text-base text-[#0B0B0A] leading-relaxed">
                  {EXECUTIVE_PROFILE.shortBio} Hands-on technical leader strong in architecture, team building, CI/CD automation, and microservices.
                </p>
              </div>

              {/* Two Digital Factories Summary */}
              <div>
                <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#8C6B2F] mb-3">
                  02 // KEY DIFFERENTIATOR: TWO DIGITAL FACTORIES BUILT FROM SCRATCH
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 border border-[#0B0B0A]/25 divide-y md:divide-y-0 md:divide-x divide-[#0B0B0A]/25 bg-[#EAE5DC]">
                  {DIGITAL_FACTORIES.map((df) => (
                    <div key={df.id} className="p-5">
                      <div className="font-tech text-[10px] uppercase tracking-wider text-[#8C6B2F]">
                        {df.period}
                      </div>
                      <div className="text-base font-bold text-[#0B0B0A] mt-0.5">
                        {df.institution} — {df.role}
                      </div>
                      <p className="mt-2 text-xs text-[#2B2A27] leading-relaxed">
                        {df.executiveSummary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Record */}
              <div>
                <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#8C6B2F] mb-3">
                  03 // CAREER RECORD (2016 — PRESENT)
                </div>
                <div className="divide-y divide-[#0B0B0A]/20 border-t border-b border-[#0B0B0A]/20">
                  {CAREER_TIMELINE.map((role) => (
                    <div key={role.id} className="py-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-display text-lg font-bold text-[#0B0B0A]">
                          {role.role} — <span className="text-[#8C6B2F]">{role.organization}</span>
                        </h4>
                        <span className="font-tech text-xs text-[#4A4843]">
                          {role.period} · {role.location}
                        </span>
                      </div>
                      <ul className="mt-2.5 space-y-1.5">
                        {role.achievements.map((ach, i) => (
                          <li key={i} className="text-xs text-[#2B2A27] flex items-start gap-2">
                            <span className="font-tech text-[#8C6B2F]">—</span>
                            <span>{ach.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#8C6B2F] mb-2">
                    04 // EDUCATION &amp; LANGUAGES
                  </div>
                  <div className="p-4 border border-[#0B0B0A]/20 bg-[#EAE5DC] space-y-2 text-xs">
                    <div className="font-bold text-sm text-[#0B0B0A]">
                      {EXECUTIVE_PROFILE.education.degree}
                    </div>
                    <div>
                      {EXECUTIVE_PROFILE.education.institution} ({EXECUTIVE_PROFILE.education.period})
                    </div>
                    <div className="pt-2 border-t border-[#0B0B0A]/15">
                      <strong>Languages:</strong> Arabic (Native / Bilingual) · English (Professional Working Proficiency)
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#8C6B2F] mb-2">
                    05 // VERIFIED PROFILES
                  </div>
                  <div className="p-4 border border-[#0B0B0A]/20 bg-[#EAE5DC] space-y-2 text-xs font-tech">
                    <a
                      href={EXECUTIVE_PROFILE.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between hover:text-[#8C6B2F]"
                    >
                      <span>LINKEDIN: {EXECUTIVE_PROFILE.contact.linkedinDisplay}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={EXECUTIVE_PROFILE.contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between hover:text-[#8C6B2F]"
                    >
                      <span>GITHUB: {EXECUTIVE_PROFILE.contact.githubDisplay}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={EXECUTIVE_PROFILE.contact.stackoverflow}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between hover:text-[#8C6B2F]"
                    >
                      <span>STACKOVERFLOW: {EXECUTIVE_PROFILE.contact.stackoverflowDisplay}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
