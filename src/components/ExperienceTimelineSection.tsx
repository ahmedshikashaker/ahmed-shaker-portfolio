"use client";

import React, { useState } from "react";
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
      className="relative py-24 lg:py-32 bg-[#0f172a] border-b border-slate-200/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/[0.08]">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">
              05 · Career Progression (2016 – Present)
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight leading-[1.15]">
              Executive &amp; Technical{" "}
              <span className="font-editorial italic font-normal text-[#dfc490]">
                Chronicle.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-[1.75]">
              Over 10 years of progressive engineering and technology leadership across{" "}
              <strong className="text-slate-100">Kuwait International Bank (KIB)</strong>,{" "}
              <strong className="text-slate-100">Warba Bank</strong>,{" "}
              <strong className="text-slate-100">Cit Global (UBA)</strong>,{" "}
              <strong className="text-slate-100">ITG Solutions</strong>, and{" "}
              <strong className="text-slate-100">Advicenode</strong>.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 shrink-0">
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
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-[#dfc490] text-slate-950 border-[#dfc490] font-semibold"
                    : "bg-[#131c31] border-slate-200/[0.08] text-slate-300 hover:text-white"
                }`}
              >
                {cat === "ALL" ? "All Dimensions" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Career Milestones */}
        <div className="mt-10 space-y-6">
          {CAREER_TIMELINE.map((milestone, index) => {
            const visibleAchievements =
              categoryFilter === "ALL"
                ? milestone.achievements
                : milestone.achievements.filter((a) => a.category === categoryFilter);

            return (
              <div
                key={milestone.id}
                className="p-6 sm:p-9 rounded-3xl bg-[#131c31]/90 border border-slate-200/[0.09] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left 4 Columns: Role & Tenure */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-tech text-[#dfc490]">
                    <span>0{index + 1}</span>
                    <span>·</span>
                    <span>{milestone.period}</span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-50">
                    {milestone.role}
                  </h3>

                  <div className="text-base font-semibold text-[#dfc490]">
                    {milestone.organization}
                  </div>

                  <div className="text-xs text-slate-400">
                    {milestone.location} · {milestone.organizationTag}
                  </div>

                  {milestone.isDigitalFactoryRole && (
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-tech bg-[#182338] text-[#dfc490] border border-[#d4b982]/35">
                        Digital Factory Builder
                      </span>
                    </div>
                  )}
                </div>

                {/* Right 8 Columns: Scope & Deliverables */}
                <div className="lg:col-span-8 space-y-5 lg:pl-8 lg:border-l lg:border-slate-200/[0.08]">
                  <p className="text-base text-slate-100 font-medium leading-relaxed">
                    {milestone.executiveHeadline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {milestone.strategicScope}
                  </p>

                  <div className="space-y-3 pt-1">
                    {(visibleAchievements.length > 0
                      ? visibleAchievements
                      : milestone.achievements
                    ).map((ach, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-200/[0.06] space-y-1"
                      >
                        <span className="text-[11px] font-tech text-[#dfc490]">
                          {ach.category}
                        </span>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          {ach.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {milestone.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#182338] text-slate-300 border border-slate-200/[0.08]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Academic Credentials & Languages */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-[#131c31]/80 border border-slate-200/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-1">
            <div className="text-xs font-tech text-[#dfc490]">
              Academic Foundation · {EXECUTIVE_PROFILE.education.period}
            </div>
            <h3 className="text-xl font-bold text-slate-50">
              {EXECUTIVE_PROFILE.education.degree}
            </h3>
            <p className="text-sm text-slate-300">
              {EXECUTIVE_PROFILE.education.institution} — {EXECUTIVE_PROFILE.education.location}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
            {EXECUTIVE_PROFILE.languages.map((lang) => (
              <div
                key={lang.language}
                className="px-4 py-2.5 rounded-xl bg-[#0f172a]/80 border border-slate-200/[0.08]"
              >
                <div className="text-xs font-semibold text-slate-100">{lang.language}</div>
                <div className="text-[11px] text-slate-400">{lang.proficiency}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
