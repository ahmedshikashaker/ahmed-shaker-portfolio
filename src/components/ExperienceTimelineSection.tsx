"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { CAREER_TIMELINE, EXECUTIVE_PROFILE } from "@/data/portfolioData";

type AchievementFilter =
  | "ALL"
  | "Strategy & Leadership"
  | "Architecture & Engineering"
  | "Product Delivery"
  | "DevOps & Governance";

export default function ExperienceTimelineSection() {
  const [categoryFilter, setCategoryFilter] = useState<AchievementFilter>("ALL");

  return (
    <section
      id="experience"
      className="relative py-28 lg:py-36 border-t border-white/[0.08] bg-gradient-to-b from-[#05070b] via-[#080c15] to-[#05070b]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-white/[0.08]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">
              <Briefcase className="w-3.5 h-3.5" />
              <span>10+ Years Career Progression (2016 – Present)</span>
            </div>

            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              From Hands-On FinTech Architect to{" "}
              <span className="font-[family-name:var(--font-serif)] italic font-normal text-gold-gradient">
                Head of Digital Technology.
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Every chapter of my career has built progressively toward executive banking technology leadership—starting with dynamic robo-advisory platforms and large-scale enterprise systems, advancing through greenfield mobile chapter leadership at <strong className="text-white">Warba Bank</strong>, and culminating in leading the entire Digital Technology function at <strong className="text-white">Kuwait International Bank (KIB)</strong>.
            </p>
          </div>

          {/* Achievement Lens Filter */}
          <div className="flex flex-wrap gap-1.5 shrink-0">
            {(
              [
                "ALL",
                "Strategy & Leadership",
                "Architecture & Engineering",
                "Product Delivery",
                "DevOps & Governance",
              ] as AchievementFilter[]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-amber-400 text-slate-950"
                    : "bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.07]"
                }`}
              >
                {cat === "ALL" ? "All Dimensions" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Career Timeline */}
        <div className="mt-14 relative space-y-8 before:hidden lg:before:block before:absolute before:top-4 before:bottom-4 before:left-[235px] before:w-px before:bg-gradient-to-b before:from-amber-400/60 before:via-emerald-400/40 before:to-white/10">
          {CAREER_TIMELINE.map((milestone, index) => {
            const visibleAchievements =
              categoryFilter === "ALL"
                ? milestone.achievements
                : milestone.achievements.filter((a) => a.category === categoryFilter);

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start"
              >
                {/* Left Column: Tenure & Location (3 cols on lg) */}
                <div className="lg:col-span-3 lg:text-right lg:pr-8 pt-2">
                  <div className="inline-flex lg:flex lg:flex-col lg:items-end gap-2">
                    <span className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-wider text-amber-300">
                      {milestone.period}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center lg:justify-end gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {milestone.location}
                    </span>
                    {milestone.isDigitalFactoryRole && (
                      <span className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider bg-amber-400/15 text-amber-200 border border-amber-400/35">
                        <Building2 className="w-3 h-3" />
                        Digital Factory Builder
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline Node Dot on Desktop */}
                <div
                  aria-hidden="true"
                  className={`hidden lg:flex absolute left-[227px] top-3.5 w-4 h-4 rounded-full items-center justify-center ${
                    milestone.isDigitalFactoryRole
                      ? "bg-amber-400 ring-4 ring-amber-400/20"
                      : "bg-slate-700 ring-4 ring-[#05070b]"
                  }`}
                />

                {/* Right Column: Role Card (9 cols on lg) */}
                <div className="lg:col-span-9">
                  <div
                    className={`p-6 sm:p-8 rounded-2xl bg-[#0a0f1c]/95 border transition-all ${
                      milestone.isDigitalFactoryRole
                        ? "border-amber-400/35 hover:border-amber-400/60"
                        : "border-white/[0.08] hover:border-white/20"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/[0.07]">
                      <div>
                        <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-emerald-300">
                          {milestone.organizationTag}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                          {milestone.role}
                        </h3>
                        <div className="text-sm sm:text-base font-semibold text-amber-200 mt-0.5">
                          {milestone.organization}
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-[family-name:var(--font-mono)] text-slate-300">
                        {milestone.durationHighlight}
                      </span>
                    </div>

                    <p className="mt-4 text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                      {milestone.executiveHeadline}
                    </p>

                    {/* Achievements List */}
                    <div className="mt-5 space-y-2.5">
                      {(visibleAchievements.length > 0
                        ? visibleAchievements
                        : milestone.achievements
                      ).map((ach, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="inline-block text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-300/90">
                              {ach.category}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                              {ach.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Pills */}
                    <div className="mt-5 pt-4 border-t border-white/[0.07] flex flex-wrap gap-1.5">
                      {milestone.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-[family-name:var(--font-mono)] bg-white/[0.04] text-slate-300 border border-white/[0.07]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Academic Foundation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#090d16] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/35 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-300">
                Academic Foundation · {EXECUTIVE_PROFILE.education.period}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {EXECUTIVE_PROFILE.education.degree}
              </h3>
              <p className="text-sm text-slate-300 mt-0.5">
                {EXECUTIVE_PROFILE.education.institution} — {EXECUTIVE_PROFILE.education.location}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            {EXECUTIVE_PROFILE.languages.map((lang) => (
              <div
                key={lang.language}
                className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07]"
              >
                <div className="text-xs font-bold text-white">{lang.language}</div>
                <div className="text-[11px] text-slate-400">{lang.proficiency}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
