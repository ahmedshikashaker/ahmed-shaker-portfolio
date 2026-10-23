"use client";

import React from "react";
import { LEADERSHIP_PRINCIPLES } from "@/data/portfolioData";

export default function LeadershipPhilosophySection() {
  return (
    <section
      id="leadership"
      className="relative py-24 lg:py-32 bg-[#11192c] border-b border-slate-200/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">
            06 · Leadership &amp; Engineering Excellence
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight leading-[1.15]">
            How I Build Organizations{" "}
            <span className="font-editorial italic font-normal text-[#dfc490]">
              That Ship &amp; Scale.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-[1.75]">
            Sustainable digital transformation requires aligning executive banking strategy with disciplined software engineering practices. These four principles guide how I structure teams, select technology, and govern delivery.
          </p>
        </div>

        {/* 2x2 Principles Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {LEADERSHIP_PRINCIPLES.map((principle) => (
            <div
              key={principle.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#131c31] border border-slate-200/[0.09] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-tech text-[#dfc490]">
                    Principle {principle.number}
                  </span>
                  <span className="text-xs text-slate-400">
                    {principle.subtitle}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-50">
                  {principle.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-[1.75]">
                  {principle.narrative}
                </p>

                <div className="p-4 rounded-xl bg-[#0f172a]/70 border-l-2 border-[#dfc490]">
                  <div className="text-xs font-tech text-[#dfc490] mb-1">
                    Verified Career Evidence
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {principle.evidenceFromCareer}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/[0.08] space-y-1.5">
                {principle.keyPractices.map((practice, i) => (
                  <div
                    key={practice}
                    className="flex items-center gap-2.5 text-xs text-slate-300"
                  >
                    <span className="font-tech text-[#dfc490]">0{i + 1}.</span>
                    <span>{practice}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
