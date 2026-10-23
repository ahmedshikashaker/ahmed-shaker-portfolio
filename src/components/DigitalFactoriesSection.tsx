"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { DIGITAL_FACTORIES } from "@/data/portfolioData";

const BLUEPRINT_PHASES = [
  {
    code: "Phase 01",
    title: "Strategic Direction & Roadmap",
    subtitle: "Executive Alignment",
    spec: "Define which banking verticals move in-house, establish multi-year product sequencing, and align C-suite investment with measurable delivery milestones.",
  },
  {
    code: "Phase 02",
    title: "Polyglot Stack & DDD Core",
    subtitle: "Architectural Foundation",
    spec: "Standardize Native (Kotlin/Swift) & Flutter client architecture alongside Domain-Driven microservices (NestJS, Java EE, Kafka, RabbitMQ) wrapping legacy cores.",
  },
  {
    code: "Phase 03",
    title: "Chapters & Product Squads",
    subtitle: "Organizational Topology",
    spec: "Structure autonomous vertical squads (Retail, Corporate, PropTech, Wealth, BaaS) governed by horizontal engineering chapters that enforce code quality.",
  },
  {
    code: "Phase 04",
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
      className="relative py-24 lg:py-32 bg-[#11192c] border-b border-slate-200/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">
            02 · Signature Career Differentiator
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight leading-[1.15]">
            Building{" "}
            <span className="font-editorial italic font-normal text-[#dfc490]">
              Two Banking Digital Factories
            </span>{" "}
            from the Ground Up.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-[1.75]">
            At both <strong className="text-slate-100 font-semibold">Warba Bank</strong> and{" "}
            <strong className="text-slate-100 font-semibold">Kuwait International Bank (KIB)</strong>, I was one of the core leaders responsible for establishing their internal Digital Factories from scratch—defining strategic roadmaps, technology stacks, architectural standards, CI/CD governance, and engineering team structures.
          </p>
        </div>

        {/* 4-Stage Digital Factory Methodology */}
        <div className="mt-12">
          <div className="text-xs font-tech text-slate-400 mb-4">
            The 4-Stage Digital Factory Methodology
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {BLUEPRINT_PHASES.map((phase, idx) => {
              const isSelected = activePhase === idx;
              return (
                <button
                  key={phase.code}
                  onClick={() => setActivePhase(idx)}
                  className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#182338] border-[#d4b982]/50 shadow-lg shadow-slate-950/30"
                      : "bg-[#131c31]/60 border-slate-200/[0.07] hover:border-slate-200/[0.15]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-tech">
                      <span className="text-[#dfc490] font-medium">{phase.code}</span>
                      <span className="text-[11px] text-slate-400">{phase.subtitle}</span>
                    </div>
                    <h3 className="mt-2.5 text-base font-semibold text-slate-100">
                      {phase.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {phase.spec}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two Digital Factory Case Studies */}
        <div className="mt-16 space-y-12">
          {DIGITAL_FACTORIES.map((factory, index) => (
            <div
              key={factory.id}
              className="p-6 sm:p-10 rounded-3xl bg-[#131c31]/90 border border-slate-200/[0.09] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
            >
              {/* Left 5 Columns: Institutional Context */}
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182338] border border-[#d4b982]/30 text-xs font-tech text-[#dfc490]">
                  <span>Case Study 0{index + 1}</span>
                  <span>·</span>
                  <span>{factory.period}</span>
                </div>

                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
                    {factory.institution}
                  </h3>
                  <p className="text-sm font-medium text-[#dfc490] mt-1">
                    {factory.role} — {factory.factoryName}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-[1.75]">
                  {factory.executiveSummary}
                </p>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {factory.strategicContext}
                </p>

                <div className="p-4 rounded-xl bg-[#0f172a]/80 border border-slate-200/[0.07] text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-100 block mb-1">
                    Organizational Scope &amp; Attribution:
                  </strong>
                  {factory.organizationScope}
                </div>
              </div>

              {/* Right 7 Columns: Contributions, Stack & Products */}
              <div className="lg:col-span-7 space-y-8 lg:pl-6 lg:border-l lg:border-slate-200/[0.08]">
                {/* Direct Contributions */}
                <div>
                  <h4 className="text-xs font-tech uppercase tracking-wider text-[#dfc490] mb-3">
                    Direct Leadership &amp; Architectural Contributions
                  </h4>
                  <ul className="space-y-2.5">
                    {factory.myDirectContribution.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-200 leading-relaxed"
                      >
                        <span className="font-tech text-xs text-[#dfc490] mt-1 shrink-0">
                          0{i + 1}.
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technology Stack */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-200/[0.07]">
                    <div className="text-[11px] font-tech text-[#dfc490] mb-2">
                      Mobile &amp; Web
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {factory.technologyFoundation.mobileAndWeb.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-200/[0.07]">
                    <div className="text-[11px] font-tech text-[#5eead4] mb-2">
                      Backend &amp; Data
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {factory.technologyFoundation.backendAndData.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-200/[0.07]">
                    <div className="text-[11px] font-tech text-sky-300 mb-2">
                      DevOps &amp; Governance
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {factory.technologyFoundation.devopsAndGovernance.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Products Delivered */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-tech uppercase tracking-wider text-slate-400">
                      Key Products &amp; Capabilities ({factory.keyProductsDelivered.length})
                    </span>
                    <button
                      onClick={scrollToProducts}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#dfc490] hover:underline cursor-pointer"
                    >
                      <span>View in Product Showroom</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {factory.keyProductsDelivered.map((prod) => (
                      <div
                        key={prod.name}
                        onClick={scrollToProducts}
                        className="p-3.5 rounded-xl bg-[#182338]/70 hover:bg-[#1e2b45] border border-slate-200/[0.07] transition-colors cursor-pointer"
                      >
                        <div className="text-[11px] font-tech text-[#dfc490]">
                          {prod.category}
                        </div>
                        <div className="text-sm font-semibold text-slate-100 mt-0.5">
                          {prod.name}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-snug">
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
