"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DIGITAL_FACTORIES } from "@/data/portfolioData";

const BLUEPRINT_PHASES = [
  {
    code: "PHASE I",
    title: "Mandate & Multi-Year Roadmap",
    subtitle: "Executive Alignment",
    spec: "Define which banking verticals move in-house, establish multi-year product sequencing, and align C-suite investment with measurable delivery milestones.",
  },
  {
    code: "PHASE II",
    title: "Polyglot Stack & DDD Core",
    subtitle: "Architectural Foundation",
    spec: "Standardize Native (Kotlin/Swift) & Flutter client architecture alongside Domain-Driven microservices (NestJS, Java EE, Kafka, RabbitMQ) wrapping legacy cores.",
  },
  {
    code: "PHASE III",
    title: "Chapters & Product Squads",
    subtitle: "Organizational Topology",
    spec: "Structure autonomous vertical squads (Retail, Corporate, PropTech, Wealth, BaaS) governed by horizontal engineering chapters that enforce code quality.",
  },
  {
    code: "PHASE IV",
    title: "CI/CD & GitOps Release Spine",
    subtitle: "Continuous Delivery",
    spec: "Automate build, test, security (OWASP), and release promotion via Jenkins, Kubernetes, and Argo CD so regulatory compliance and release speed scale together.",
  },
];

export default function DigitalFactoriesSection() {
  const [activePhase, setActivePhase] = useState<number>(0);

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="digital-factories"
      className="relative py-28 lg:py-40 bg-[#F2EFE9] text-[#0B0B0A] swiss-grid-ivory border-b border-[#0B0B0A]/15"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Monograph Chapter Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b-2 border-[#0B0B0A]">
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <span className="font-tech text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6B2F]">
                01 // SIGNATURE DIFFERENTIATOR
              </span>
              <div className="mt-4 font-display text-7xl sm:text-8xl font-extrabold tracking-[-0.05em] text-[#0B0B0A] leading-none">
                02
              </div>
              <p className="mt-2 font-tech text-xs uppercase tracking-[0.14em] text-[#4A4843]">
                BANKING DIGITAL FACTORIES ESTABLISHED FROM SCRATCH
              </p>
            </div>

            <div className="hidden lg:block pt-8 border-t border-[#0B0B0A]/15 text-xs font-tech text-[#4A4843] space-y-1">
              <div>INSTITUTION I: WARBA BANK (“AL-WATEEN”) · 2019–2022</div>
              <div>INSTITUTION II: KUWAIT INTERNATIONAL BANK (KIB) · 2022–PRESENT</div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold uppercase tracking-[-0.04em] text-[#0B0B0A] leading-[0.96]">
              Architecting{" "}
              <span className="font-editorial italic font-normal normal-case text-[#8C6B2F]">
                Two Banking Digital Factories
              </span>{" "}
              From A Blank Slate.
            </h2>

            <p className="text-base sm:text-xl text-[#2B2A27] leading-[1.6] max-w-3xl">
              Establishing an internal Digital Factory inside a regulated bank requires far more than writing software. As one of the core leaders who built the Digital Factories at both <strong className="font-bold text-[#0B0B0A]">Warba Bank</strong> and <strong className="font-bold text-[#0B0B0A]">Kuwait International Bank (KIB)</strong>, I helped define the strategic direction, multi-year technology roadmaps, architectural standards, CI/CD pipelines, and engineering team structures that enabled both institutions to build and scale flagship banking products in-house.
            </p>
          </div>
        </div>

        {/* Part A: The 4-Phase Digital Factory Blueprint Bar */}
        <div className="py-14 border-b border-[#0B0B0A]/20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-tech text-[11px] uppercase tracking-[0.18em] text-[#8C6B2F]">
                SYSTEM METHODOLOGY //
              </span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0B0B0A]">
                The 4-Stage Digital Factory Architecture
              </h3>
            </div>
            <span className="font-tech text-xs text-[#4A4843]">
              [INTERACTIVE SPECIFICATION — SELECT STAGE]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 border border-[#0B0B0A]/20 divide-y md:divide-y-0 md:divide-x divide-[#0B0B0A]/20 bg-[#EAE5DC]">
            {BLUEPRINT_PHASES.map((phase, idx) => {
              const isSelected = activePhase === idx;
              return (
                <button
                  key={phase.code}
                  onClick={() => setActivePhase(idx)}
                  className={`p-6 sm:p-7 text-left transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#0B0B0A] text-[#F2EFE9]"
                      : "hover:bg-[#E2DDD2] text-[#0B0B0A]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between font-tech text-xs">
                      <span className={isSelected ? "text-[#C8A464]" : "text-[#8C6B2F]"}>
                        {phase.code}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest opacity-60">
                        {phase.subtitle}
                      </span>
                    </div>
                    <h4 className="mt-4 font-display text-xl font-bold tracking-tight">
                      {phase.title}
                    </h4>
                  </div>

                  <p
                    className={`mt-4 text-xs leading-relaxed ${
                      isSelected ? "text-[#D6D1C7]" : "text-[#4A4843]"
                    }`}
                  >
                    {phase.spec}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Part B: Two Monumental Split-Screen Monograph Case Studies */}
        <div className="divide-y-2 divide-[#0B0B0A]">
          {DIGITAL_FACTORIES.map((factory, index) => (
            <div
              key={factory.id}
              className="py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              {/* Left 5 Columns: Sticky Institutional Specification Sheet */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                <div className="flex items-center gap-3 font-tech text-xs uppercase tracking-[0.18em] text-[#8C6B2F]">
                  <span>MONOGRAPH 0{index + 1}</span>
                  <span>—</span>
                  <span>{factory.period}</span>
                </div>

                <h3 className="font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-[#0B0B0A] leading-[1.02]">
                  {factory.institution}
                </h3>

                <div className="p-5 bg-[#E6E1D6] border-l-4 border-[#0B0B0A] space-y-2">
                  <div className="font-tech text-[11px] uppercase tracking-[0.14em] text-[#4A4843]">
                    EXECUTIVE ROLE &amp; MANDATE
                  </div>
                  <div className="text-lg font-bold text-[#0B0B0A]">
                    {factory.role}
                  </div>
                  <div className="text-xs font-tech text-[#8C6B2F]">
                    {factory.factoryName}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#2B2A27] leading-relaxed">
                  {factory.executiveSummary}
                </p>

                <p className="text-xs sm:text-sm text-[#4A4843] leading-relaxed">
                  {factory.strategicContext}
                </p>

                {/* Attribution Box */}
                <div className="p-4 border border-[#0B0B0A]/20 bg-[#F2EFE9] text-xs text-[#2B2A27] leading-relaxed">
                  <strong className="font-tech uppercase tracking-wider block text-[#0B0B0A] mb-1">
                    ORGANIZATIONAL ATTRIBUTION //
                  </strong>
                  {factory.organizationScope}
                </div>
              </div>

              {/* Right 7 Columns: Engineering & Architectural Ledger */}
              <div className="lg:col-span-7 space-y-10 lg:pl-8 lg:border-l lg:border-[#0B0B0A]/15">
                {/* 1. Direct Executive & Architectural Contributions */}
                <div>
                  <div className="font-tech text-xs uppercase tracking-[0.18em] text-[#8C6B2F] pb-3 border-b border-[#0B0B0A]/20">
                    01 // DIRECT STRATEGIC &amp; ARCHITECTURAL CONTRIBUTIONS
                  </div>
                  <div className="divide-y divide-[#0B0B0A]/15">
                    {factory.myDirectContribution.map((item, i) => (
                      <div
                        key={i}
                        className="py-4 grid grid-cols-12 gap-4 items-baseline"
                      >
                        <span className="col-span-2 sm:col-span-1 font-tech text-xs font-bold text-[#8C6B2F]">
                          0{i + 1}.
                        </span>
                        <p className="col-span-10 sm:col-span-11 text-sm sm:text-base text-[#0B0B0A] font-medium leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Architectural Pillars Table */}
                <div>
                  <div className="font-tech text-xs uppercase tracking-[0.18em] text-[#8C6B2F] pb-3 border-b border-[#0B0B0A]/20">
                    02 // FOUR FOUNDATIONAL PILLARS ESTABLISHED
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {factory.pillars.map((pillar) => (
                      <div
                        key={pillar.title}
                        className="p-5 bg-[#E6E1D6] border border-[#0B0B0A]/15 flex flex-col justify-between"
                      >
                        <div>
                          <div className="font-tech text-[10px] uppercase tracking-[0.14em] text-[#8C6B2F]">
                            {pillar.subtitle}
                          </div>
                          <h4 className="mt-1 font-display text-base font-bold text-[#0B0B0A]">
                            {pillar.title}
                          </h4>
                          <p className="mt-2 text-xs text-[#2B2A27] leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#0B0B0A]/15 space-y-1">
                          {pillar.outcomes.map((out, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] font-medium text-[#0B0B0A] flex items-start gap-2"
                            >
                              <span className="font-tech text-[#8C6B2F]">→</span>
                              <span>{out}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Standardized Technology Stack Ledger */}
                <div>
                  <div className="font-tech text-xs uppercase tracking-[0.18em] text-[#8C6B2F] pb-3 border-b border-[#0B0B0A]/20">
                    03 // FACTORY TECHNOLOGY STACK &amp; GOVERNANCE
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 border border-[#0B0B0A]/20 divide-y sm:divide-y-0 sm:divide-x divide-[#0B0B0A]/20 bg-[#EAE5DC]">
                    <div className="p-4">
                      <div className="font-tech text-[10px] uppercase tracking-widest text-[#8C6B2F] mb-2">
                        CLIENT CHANNELS
                      </div>
                      <ul className="space-y-1.5 text-xs font-medium text-[#0B0B0A]">
                        {factory.technologyFoundation.mobileAndWeb.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4">
                      <div className="font-tech text-[10px] uppercase tracking-widest text-[#8C6B2F] mb-2">
                        BACKEND &amp; EVENT MESH
                      </div>
                      <ul className="space-y-1.5 text-xs font-medium text-[#0B0B0A]">
                        {factory.technologyFoundation.backendAndData.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4">
                      <div className="font-tech text-[10px] uppercase tracking-widest text-[#8C6B2F] mb-2">
                        DEVOPS &amp; GOVERNANCE
                      </div>
                      <ul className="space-y-1.5 text-xs font-medium text-[#0B0B0A]">
                        {factory.technologyFoundation.devopsAndGovernance.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 4. Portfolio of Products Delivered */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#0B0B0A]/20">
                    <span className="font-tech text-xs uppercase tracking-[0.18em] text-[#8C6B2F]">
                      04 // ECOSYSTEM OF PRODUCTS DELIVERED ({factory.keyProductsDelivered.length})
                    </span>
                    <button
                      onClick={scrollToProducts}
                      className="inline-flex items-center gap-1 font-tech text-xs font-semibold uppercase tracking-wider text-[#0B0B0A] hover:text-[#8C6B2F] cursor-pointer"
                    >
                      <span>Inspect in Showroom</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {factory.keyProductsDelivered.map((prod) => (
                      <div
                        key={prod.name}
                        onClick={scrollToProducts}
                        className="p-4 border border-[#0B0B0A]/15 bg-[#F2EFE9] hover:bg-[#0B0B0A] hover:text-[#F2EFE9] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between font-tech text-[10px] uppercase tracking-widest text-[#8C6B2F] group-hover:text-[#C8A464]">
                          <span>{prod.category}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </div>
                        <div className="mt-1 text-sm font-bold">{prod.name}</div>
                        <p className="mt-1 text-xs opacity-80 leading-snug">
                          {prod.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
