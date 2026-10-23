"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Printer,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Building2,
  GraduationCap,
  Award,
  Globe2,
} from "lucide-react";
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0b101b] border border-amber-400/30 shadow-[0_25px_90px_rgba(0,0,0,0.85)] text-slate-100"
          >
            {/* Top Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0b101b]/95 backdrop-blur-xl border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span
                  id="dossier-modal-title"
                  className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-amber-300"
                >
                  Executive Curriculum Vitae & Board Dossier
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400/15 text-amber-200 border border-amber-400/30 hover:bg-amber-400/25 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-white/[0.05] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Executive Dossier"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Header Identity */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {EXECUTIVE_PROFILE.name}
                  </h2>
                  <p className="text-lg font-semibold text-amber-300 mt-1">
                    {EXECUTIVE_PROFILE.title} · Digital Banking Transformation & Enterprise Architecture
                  </p>
                  <p className="text-xs font-[family-name:var(--font-mono)] text-slate-400 mt-1.5">
                    Mobile (Android · iOS · Flutter) • Backend (NestJS · Java) • DevOps (Kubernetes · Argo CD · Jenkins)
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{EXECUTIVE_PROFILE.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <a href={`tel:${EXECUTIVE_PROFILE.contact.phoneClean}`} className="hover:text-amber-300">
                      {EXECUTIVE_PROFILE.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <a href={`mailto:${EXECUTIVE_PROFILE.contact.email}`} className="hover:text-amber-300">
                      {EXECUTIVE_PROFILE.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Executive Profile Summary */}
              <div>
                <h3 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400 mb-2">
                  Executive Profile
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {EXECUTIVE_PROFILE.shortBio} Hands-on technical leader strong in enterprise architecture, cross-functional team building, CI/CD & GitOps automation, and domain-driven microservices.
                </p>
              </div>

              {/* Signature Differentiator: Two Digital Factories */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 via-white/[0.02] to-emerald-500/10 border border-amber-400/25">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-3">
                  <Building2 className="w-4 h-4" />
                  <span>Key Executive Differentiator: Two Digital Factories Built from Scratch</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DIGITAL_FACTORIES.map((df) => (
                    <div key={df.id} className="p-4 rounded-lg bg-[#070a12]/90 border border-white/[0.07]">
                      <div className="text-xs font-semibold text-amber-200">{df.institution}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{df.role} ({df.period})</div>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{df.executiveSummary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Experience */}
              <div>
                <h3 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400 mb-4">
                  Career Progression & Leadership Record
                </h3>
                <div className="space-y-5">
                  {CAREER_TIMELINE.map((role) => (
                    <div
                      key={role.id}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.07]"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <h4 className="text-base font-bold text-white">{role.role}</h4>
                          <p className="text-xs font-medium text-amber-300">
                            {role.organization} · <span className="text-slate-400">{role.location}</span>
                          </p>
                        </div>
                        <span className="text-xs font-[family-name:var(--font-mono)] text-slate-400">
                          {role.period}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {role.achievements.map((ach, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{ach.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Technical & Architectural Competencies */}
              <div>
                <h3 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400 mb-3">
                  Core Technical & Architectural Competencies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SKILL_MATRIX.map((group) => (
                    <div key={group.category} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-xs font-semibold text-white mb-2">{group.category}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded text-[11px] bg-white/[0.05] text-slate-300 border border-white/[0.06]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-400 mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Education</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {EXECUTIVE_PROFILE.education.degree}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {EXECUTIVE_PROFILE.education.institution} — {EXECUTIVE_PROFILE.education.location}
                  </div>
                  <div className="text-xs font-[family-name:var(--font-mono)] text-slate-400 mt-1">
                    {EXECUTIVE_PROFILE.education.period}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-400 mb-2">
                    <Globe2 className="w-4 h-4" />
                    <span>Languages & Verified Profiles</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300 mb-3">
                    {EXECUTIVE_PROFILE.languages.map((l) => (
                      <div key={l.language} className="flex justify-between">
                        <span className="font-semibold text-white">{l.language}:</span>
                        <span>{l.proficiency}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-white/[0.06] text-xs">
                    <a
                      href={EXECUTIVE_PROFILE.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-300 hover:underline"
                    >
                      LinkedIn <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={EXECUTIVE_PROFILE.contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-300 hover:underline"
                    >
                      GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={EXECUTIVE_PROFILE.contact.stackoverflow}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-300 hover:underline"
                    >
                      Stack Overflow <ExternalLink className="w-3 h-3" />
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
