"use client";

import React from "react";
import { LEADERSHIP_PRINCIPLES } from "@/data/portfolioData";

export default function LeadershipPhilosophySection() {
  return (
    <section
      id="leadership"
      className="relative py-28 lg:py-40 bg-[#F2EFE9] text-[#0B0B0A] swiss-grid-ivory border-b border-[#0B0B0A]/15"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Monograph Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b-2 border-[#0B0B0A]">
          <div className="lg:col-span-4">
            <span className="font-tech text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6B2F]">
              05 // LEADERSHIP DOCTRINE
            </span>
            <p className="mt-3 font-tech text-xs uppercase tracking-[0.14em] text-[#4A4843]">
              ENGINEERING EXCELLENCE &amp; GOVERNANCE
            </p>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.04em] text-[#0B0B0A] leading-[0.96]">
              How I Build Organizations{" "}
              <span className="font-editorial italic font-normal normal-case text-[#8C6B2F]">
                That Ship &amp; Endure.
              </span>
            </h2>
            <p className="text-base sm:text-xl text-[#2B2A27] max-w-3xl leading-relaxed">
              Sustainable digital transformation is an organizational design problem as much as a software architecture problem. These four principles govern how I structure teams, select technology, and align delivery with executive banking objectives.
            </p>
          </div>
        </div>

        {/* 2x2 Swiss Editorial Monograph Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-x border-[#0B0B0A]/20 divide-y lg:divide-y-0 lg:divide-x divide-[#0B0B0A]/20 bg-[#EAE5DC]">
          {LEADERSHIP_PRINCIPLES.map((principle, idx) => (
            <div
              key={principle.id}
              className={`p-8 sm:p-12 flex flex-col justify-between space-y-8 ${
                idx >= 2 ? "lg:border-t lg:border-[#0B0B0A]/20" : ""
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#0B0B0A]/15 pb-4">
                  <span className="font-display text-4xl font-extrabold text-[#8C6B2F]">
                    {principle.number}
                  </span>
                  <span className="font-tech text-[10px] uppercase tracking-[0.16em] text-[#4A4843]">
                    EXECUTIVE PRINCIPLE
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B0B0A] tracking-tight">
                    {principle.title}
                  </h3>
                  <p className="mt-1 font-tech text-xs uppercase tracking-[0.1em] text-[#8C6B2F]">
                    {principle.subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#2B2A27] leading-relaxed">
                  {principle.narrative}
                </p>

                <div className="p-5 bg-[#F2EFE9] border-l-4 border-[#0B0B0A]">
                  <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#8C6B2F] mb-1.5">
                    INSTITUTIONAL EVIDENCE //
                  </div>
                  <p className="text-xs sm:text-sm text-[#0B0B0A] font-medium leading-relaxed">
                    {principle.evidenceFromCareer}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0B0B0A]/15 space-y-2">
                {principle.keyPractices.map((practice, i) => (
                  <div
                    key={practice}
                    className="flex items-center gap-3 text-xs font-semibold text-[#0B0B0A]"
                  >
                    <span className="font-tech text-[#8C6B2F]">0{i + 1}</span>
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
