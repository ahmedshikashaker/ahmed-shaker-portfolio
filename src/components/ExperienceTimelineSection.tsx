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
      className="relative py-28 lg:py-40 bg-[#080807] text-[#F4F0E8] border-b border-[#F4F0E8]/[0.12]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-14 border-b border-[#F4F0E8]/[0.12]">
          <div className="lg:col-span-4">
            <span className="font-tech text-xs uppercase tracking-[0.2em] text-[#C8A464]">
              04 // CAREER CHRONICLE
            </span>
            <p className="mt-3 font-tech text-xs uppercase tracking-[0.14em] text-[#9A958B]">
              2016 — PRESENT · 10+ YEARS RECORD
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.04em] text-[#F4F0E8] leading-[0.96]">
              Executive &amp; Technical{" "}
              <span className="font-editorial italic font-normal normal-case text-bronze-foil">
                Progression.
              </span>
            </h2>

            {/* Filter Lens */}
            <div className="flex flex-wrap gap-2 pt-2">
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
                  className={`px-3.5 py-2 font-tech text-[11px] uppercase tracking-[0.12em] border transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-[#C8A464] text-[#080807] border-[#C8A464] font-semibold"
                      : "border-[#F4F0E8]/15 text-[#9A958B] hover:text-[#F4F0E8]"
                  }`}
                >
                  {cat === "ALL" ? "ALL DIMENSIONS" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Swiss Typographic Career Ledger */}
        <div className="divide-y divide-[#F4F0E8]/[0.12] border-b border-[#F4F0E8]/[0.12]">
          {CAREER_TIMELINE.map((milestone, index) => {
            const visibleAchievements =
              categoryFilter === "ALL"
                ? milestone.achievements
                : milestone.achievements.filter((a) => a.category === categoryFilter);

            return (
              <div
                key={milestone.id}
                className="py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left 4 Columns: Period, Role, Institution */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-3 font-tech text-xs text-[#C8A464]">
                    <span>0{index + 1}</span>
                    <span>/</span>
                    <span className="uppercase tracking-[0.14em]">
                      {milestone.period}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F4F0E8] tracking-tight">
                    {milestone.role}
                  </h3>

                  <div className="text-base font-bold text-[#C8A464]">
                    {milestone.organization}
                  </div>

                  <div className="font-tech text-xs text-[#9A958B]">
                    {milestone.location} · {milestone.organizationTag}
                  </div>

                  {milestone.isDigitalFactoryRole && (
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 font-tech text-[10px] uppercase tracking-[0.16em] bg-[#C8A464]/15 text-[#C8A464] border border-[#C8A464]/40">
                        DIGITAL FACTORY ARCHITECT ROLE
                      </span>
                    </div>
                  )}
                </div>

                {/* Right 8 Columns: Executive Mandate & Verified Deliverables */}
                <div className="lg:col-span-8 space-y-6 lg:pl-8 lg:border-l lg:border-[#F4F0E8]/[0.1]">
                  <p className="text-base sm:text-lg text-[#F4F0E8] font-medium leading-relaxed">
                    {milestone.executiveHeadline}
                  </p>

                  <div className="divide-y divide-[#F4F0E8]/[0.08] border-t border-b border-[#F4F0E8]/[0.08]">
                    {(visibleAchievements.length > 0
                      ? visibleAchievements
                      : milestone.achievements
                    ).map((ach, i) => (
                      <div
                        key={i}
                        className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline"
                      >
                        <span className="sm:col-span-3 font-tech text-[10px] uppercase tracking-[0.14em] text-[#C8A464]">
                          {ach.category}
                        </span>
                        <p className="sm:col-span-9 text-xs sm:text-sm text-[#D6D1C7] leading-relaxed">
                          {ach.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {milestone.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 font-tech text-[10px] uppercase tracking-wider bg-[#12110E] text-[#9A958B] border border-[#F4F0E8]/[0.08]"
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

        {/* Academic Credentials & Languages Ledger */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 border border-[#F4F0E8]/[0.12] divide-y lg:divide-y-0 lg:divide-x divide-[#F4F0E8]/[0.12] bg-[#0B0B09]">
          <div className="lg:col-span-8 p-6 sm:p-8">
            <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464]">
              ACADEMIC FOUNDATION // {EXECUTIVE_PROFILE.education.period}
            </div>
            <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-[#F4F0E8]">
              {EXECUTIVE_PROFILE.education.degree}
            </h3>
            <p className="mt-1 text-sm text-[#9A958B]">
              {EXECUTIVE_PROFILE.education.institution} — {EXECUTIVE_PROFILE.education.location}
            </p>
          </div>

          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-center space-y-3">
            <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464]">
              LANGUAGES //
            </div>
            {EXECUTIVE_PROFILE.languages.map((lang) => (
              <div
                key={lang.language}
                className="flex items-center justify-between text-xs border-b border-[#F4F0E8]/[0.08] pb-2 last:border-b-0 last:pb-0"
              >
                <span className="font-bold text-[#F4F0E8] uppercase font-tech">
                  {lang.language}
                </span>
                <span className="text-[#9A958B]">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
