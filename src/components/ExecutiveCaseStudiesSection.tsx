"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  X,
  CheckCircle2,
  Clock,
  Building2,
  Cpu,
} from "lucide-react";
import {
  EXECUTIVE_CASE_STUDIES,
  ExecutiveCaseStudy,
} from "@/data/portfolioData";

export default function ExecutiveCaseStudiesSection() {
  const [selectedStudy, setSelectedStudy] =
    useState<ExecutiveCaseStudy | null>(null);

  return (
    <section
      id="case-studies"
      className="relative py-24 lg:py-32 bg-[#0f172a] border-b border-slate-200/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-slate-200/[0.08]">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-tech uppercase tracking-widest text-[#dfc490]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>05 · Executive Architectural Briefings</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight leading-[1.15]">
              Boardroom-to-Production{" "}
              <span className="font-editorial italic font-normal text-[#dfc490]">
                Architectural Case Studies.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-[1.75]">
              Detailed technical and strategic deep-dives into how I establish digital banking factories, architect multi-vertical banking ecosystems, and engineer metadata-driven FinTech and national EdTech platforms.
            </p>
          </div>
          <div className="text-xs font-tech text-slate-400">
            Select any briefing to open the full architectural dossier
          </div>
        </div>

        {/* 3 Case Study Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {EXECUTIVE_CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              onClick={() => setSelectedStudy(study)}
              className="group p-6 sm:p-8 rounded-3xl bg-[#131c31]/90 hover:bg-[#182338] border border-slate-200/[0.09] hover:border-[#dfc490]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg shadow-slate-950/25"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#0f172a] border border-[#dfc490]/30 text-[11px] font-tech text-[#dfc490]">
                    {study.index}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-tech text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-[#5eead4]" />
                    {study.readTime}
                  </span>
                </div>

                <div className="text-xs font-tech text-[#5eead4]">
                  {study.category}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-50 group-hover:text-[#dfc490] transition-colors leading-snug">
                  {study.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {study.subtitle}
                </p>

                {/* Institutions */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {study.institutions.map((inst) => (
                    <span
                      key={inst}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0f172a]/80 border border-slate-200/[0.07] text-[11px] font-medium text-slate-300"
                    >
                      <Building2 className="w-3 h-3 text-[#dfc490]" />
                      {inst}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200/[0.08] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#dfc490] group-hover:underline">
                  Read Executive Case Study
                </span>
                <span className="w-8 h-8 rounded-full bg-[#0f172a] border border-slate-200/[0.1] group-hover:border-[#dfc490]/50 flex items-center justify-center text-slate-200 group-hover:text-[#dfc490] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Case Study Reader Modal */}
      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedStudy(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#131c31] border border-slate-200/[0.14] shadow-2xl p-6 sm:p-10 text-slate-100"
            >
              {/* Sticky Top Bar */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-200/[0.09]">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-tech">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#182338] border border-[#dfc490]/35 text-[#dfc490]">
                      {selectedStudy.index}
                    </span>
                    <span className="text-[#5eead4]">
                      {selectedStudy.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400">
                      {selectedStudy.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 leading-tight">
                    {selectedStudy.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedStudy(null)}
                  className="p-2 rounded-xl bg-[#182338] hover:bg-slate-800 border border-slate-200/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Close case study"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="mt-6 space-y-8">
                {/* Executive Summary */}
                <div className="p-5 rounded-2xl bg-[#182338]/90 border border-[#dfc490]/25">
                  <div className="text-xs font-tech uppercase tracking-wider text-[#dfc490] mb-2">
                    Executive Summary
                  </div>
                  <p className="text-sm sm:text-base text-slate-200 leading-[1.75]">
                    {selectedStudy.executiveSummary}
                  </p>
                </div>

                {/* Challenge & Architectural Thesis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-200/[0.08]">
                    <div className="text-xs font-tech uppercase tracking-wider text-slate-400 mb-2">
                      The Institutional Challenge
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedStudy.challenge}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-[#5eead4]/25">
                    <div className="text-xs font-tech uppercase tracking-wider text-[#5eead4] mb-2">
                      The Architectural Thesis
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {selectedStudy.architecturalThesis}
                    </p>
                  </div>
                </div>

                {/* Architectural Pipeline Flow */}
                <div>
                  <div className="text-xs font-tech uppercase tracking-wider text-slate-400 mb-3">
                    End-to-End Architectural Flow
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                    {selectedStudy.architecturalFlow.map((step, idx) => (
                      <div
                        key={step}
                        className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-200/[0.08] flex flex-col justify-between"
                      >
                        <span className="text-[10px] font-tech text-[#dfc490]">
                          0{idx + 1}
                        </span>
                        <span className="mt-1 text-xs font-semibold text-slate-100 leading-snug">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Pillars */}
                <div>
                  <div className="text-xs font-tech uppercase tracking-wider text-[#dfc490] mb-3">
                    Execution Blueprint &amp; Engineering Delivery
                  </div>
                  <div className="space-y-3">
                    {selectedStudy.executionPillars.map((pillar, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-200/[0.08]"
                      >
                        <h4 className="text-base font-semibold text-slate-100">
                          {pillar.heading}
                        </h4>
                        <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                          {pillar.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Outcomes */}
                <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-200/[0.08]">
                  <div className="text-xs font-tech uppercase tracking-wider text-[#5eead4] mb-3">
                    Verifiable Institutional Impact
                  </div>
                  <ul className="space-y-2.5">
                    {selectedStudy.verifiedOutcomes.map((outcome, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-slate-200 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#5eead4] shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-tech text-slate-400 mr-1">
                    <Cpu className="w-3.5 h-3.5 text-[#dfc490]" />
                    <span>Core Stack:</span>
                  </span>
                  {selectedStudy.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-[#182338] border border-slate-200/[0.08] text-xs font-tech text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
