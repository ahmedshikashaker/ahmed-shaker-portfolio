"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Layers,
  Cpu,
  GitBranch,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Columns,
  Terminal,
  Boxes,
  Compass,
} from "lucide-react";
import { DIGITAL_FACTORIES, DigitalFactoryCaseStudy } from "@/data/portfolioData";

const FACTORY_BLUEPRINT_STAGES = [
  {
    step: "STAGE 01",
    title: "Strategic Direction & Multi-Year Roadmap",
    summary: "Aligning executive banking objectives with an actionable, phased product and platform roadmap.",
    detail:
      "Before writing a line of code, a Digital Factory requires a clear mandate: which banking verticals will be built in-house, how core banking dependencies will be abstracted, and how product releases will sequence across retail, corporate, wealth, and embedded finance.",
  },
  {
    step: "STAGE 02",
    title: "Technology Stack & Architectural Foundations",
    summary: "Selecting durable, high-velocity stacks across Mobile, Web, and Backend Microservices.",
    detail:
      "Establishing when to leverage Native Android (Kotlin) and iOS (Swift) versus Flutter (Mobile & Web), and architecting Domain-Driven backend microservices (NestJS, Java EE, Kafka, RabbitMQ) with strict anti-corruption layers over legacy SOAP/REST banking cores.",
  },
  {
    step: "STAGE 03",
    title: "Engineering Capabilities & Chapter Topology",
    summary: "Structuring cross-functional delivery squads backed by deep technical chapters.",
    detail:
      "Hiring, mentoring, and organizing engineers into autonomous product squads (Retail, Corporate, PropTech, Wealth, BaaS) while maintaining unified code quality, DI patterns (Hilt/Dagger), SOLID, DDD, and TDD through dedicated engineering chapters.",
  },
  {
    step: "STAGE 04",
    title: "CI/CD Automation, GitOps & Release Governance",
    summary: "Building the automated delivery spine so compliance and velocity reinforce each other.",
    detail:
      "Codifying Git branching strategies, automated Jenkins build/test pipelines, OWASP security gates, and Kubernetes + Argo CD GitOps continuous delivery—turning complex multi-app banking releases into predictable routines.",
  },
];

type ViewMode = "kib" | "warba" | "compare";

export default function DigitalFactoriesSection() {
  const [viewMode, setViewMode] = useState<ViewMode>("kib");
  const [activeStage, setActiveStage] = useState<number>(0);

  const selectedFactory: DigitalFactoryCaseStudy | undefined =
    viewMode === "compare"
      ? undefined
      : DIGITAL_FACTORIES.find((f) => f.id === viewMode);

  return (
    <section
      id="digital-factories"
      className="relative py-28 lg:py-36 border-t border-white/[0.08] bg-[#05070b] overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-amber-500/[0.06] blur-[160px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Signature Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/[0.08]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-200 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Signature Career Differentiator</span>
            </div>

            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.08]">
              Architecting{" "}
              <span className="font-[family-name:var(--font-serif)] italic font-normal text-gold-gradient">
                Two Banking Digital Factories
              </span>{" "}
              from the Ground Up.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Few technology leaders have had the opportunity to establish a banking digital factory from a blank slate—fewer still have done it <strong className="text-white">twice</strong>. At both <strong className="text-white">Warba Bank</strong> and <strong className="text-white">Kuwait International Bank (KIB)</strong>, I played a foundational role in defining the strategic direction, technology stacks, architectural standards, CI/CD governance, and engineering structures required to turn banks into software-driven institutions.
            </p>
          </div>

          {/* Interactive View Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#0b101c] border border-white/[0.1] shrink-0">
            <button
              onClick={() => setViewMode("kib")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "kib"
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Factory II · KIB (2022–Present)
            </button>
            <button
              onClick={() => setViewMode("warba")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "warba"
                  ? "bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Factory I · Warba Bank (2019–2022)
            </button>
            <button
              onClick={() => setViewMode("compare")}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "compare"
                  ? "bg-white/15 text-white border border-white/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Compare Both</span>
            </button>
          </div>
        </div>

        {/* Interactive 4-Stage Digital Factory Methodology Blueprint */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#090d16] border border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400">
                The Executive Blueprint
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                How I Establish &amp; Scale a Banking Digital Factory from Zero
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Select a stage to inspect the methodology
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {FACTORY_BLUEPRINT_STAGES.map((stage, idx) => {
              const isSelected = activeStage === idx;
              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveStage(idx)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-br from-amber-500/15 via-white/[0.03] to-transparent border-amber-400/50 shadow-[0_0_25px_rgba(212,175,55,0.12)]"
                      : "bg-white/[0.02] border-white/[0.07] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-[family-name:var(--font-mono)]">
                    <span className={isSelected ? "text-amber-300 font-bold" : "text-slate-400"}>
                      {stage.step}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? "text-amber-300 translate-x-0.5" : "text-slate-600"
                      }`}
                    />
                  </div>
                  <div className="text-sm font-bold text-white mt-2">{stage.title}</div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{stage.summary}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-4 sm:p-5 rounded-xl bg-[#05070b] border border-amber-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-[family-name:var(--font-mono)] text-amber-300 uppercase">
                {FACTORY_BLUEPRINT_STAGES[activeStage].step} — {FACTORY_BLUEPRINT_STAGES[activeStage].title}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {FACTORY_BLUEPRINT_STAGES[activeStage].detail}
              </p>
            </div>
          </div>
        </div>

        {/* Main Case Study or Side-by-Side Comparison View */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            {viewMode !== "compare" && selectedFactory && (
              <motion.div
                key={selectedFactory.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className={`rounded-3xl p-6 sm:p-10 lg:p-12 bg-[#0a0f1a]/95 border ${
                  selectedFactory.accentColor === "emerald"
                    ? "border-emerald-400/35 border-glow-emerald"
                    : "border-amber-400/35 border-glow-gold"
                }`}
              >
                {/* Case Study Top Banner */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest bg-white/[0.05] text-amber-300 border border-white/[0.1]">
                      <span>{selectedFactory.badgeText}</span>
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {selectedFactory.institution}
                    </h3>
                    <p className="text-base sm:text-lg font-medium text-amber-200">
                      {selectedFactory.factoryName}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 shrink-0">
                    <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                      <div className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-slate-400">
                        My Executive Role
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {selectedFactory.role}
                      </div>
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                      <div className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-slate-400">
                        Tenure &amp; Location
                      </div>
                      <div className="text-sm font-bold text-amber-300 mt-0.5">
                        {selectedFactory.period} · {selectedFactory.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategic Narrative & Direct Contributions */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400 mb-2">
                        Executive Summary &amp; Strategic Context
                      </h4>
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                        {selectedFactory.executiveSummary}
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed mt-3">
                        {selectedFactory.strategicContext}
                      </p>
                    </div>

                    <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                      <h4 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-emerald-400 mb-3">
                        My Direct Leadership &amp; Architectural Contributions
                      </h4>
                      <ul className="space-y-3">
                        {selectedFactory.myDirectContribution.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 pt-4 border-t border-white/[0.07] text-xs text-slate-400">
                        <strong className="text-slate-200">Organizational Attribution: </strong>
                        {selectedFactory.organizationScope}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Technology Foundation Matrix */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-5 rounded-2xl bg-[#060911] border border-white/[0.08] space-y-4">
                      <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-300">
                        <Cpu className="w-4 h-4" />
                        <span>Factory Technology Stack &amp; Standards</span>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-white mb-2">
                          Mobile &amp; Web Engineering
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedFactory.technologyFoundation.mobileAndWeb.map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded-md text-xs bg-amber-500/10 text-amber-200 border border-amber-400/25"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-white mb-2">
                          Backend, Messaging &amp; Data
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedFactory.technologyFoundation.backendAndData.map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded-md text-xs bg-emerald-500/10 text-emerald-200 border border-emerald-400/25"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-white mb-2">
                          DevOps, Cloud &amp; Release Governance
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedFactory.technologyFoundation.devopsAndGovernance.map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded-md text-xs bg-sky-500/10 text-sky-200 border border-sky-400/25"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Products Delivered Grid */}
                    <div className="p-5 rounded-2xl bg-[#060911] border border-white/[0.08]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-slate-300">
                          Key Products &amp; Capabilities Delivered
                        </span>
                        <span className="text-xs font-bold text-amber-300">
                          {selectedFactory.keyProductsDelivered.length} Ecosystems
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedFactory.keyProductsDelivered.map((prod) => (
                          <div
                            key={prod.name}
                            className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                          >
                            <div className="text-[10px] font-[family-name:var(--font-mono)] text-amber-300 uppercase">
                              {prod.category}
                            </div>
                            <div className="text-xs font-bold text-white mt-0.5">
                              {prod.name}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                              {prod.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Strategic Pillars of the Factory */}
                <div className="mt-10 pt-8 border-t border-white/[0.08]">
                  <h4 className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400 mb-5">
                    Four Architectural &amp; Operational Pillars Established at {selectedFactory.institution}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedFactory.pillars.map((pillar) => (
                      <div
                        key={pillar.title}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex flex-col justify-between"
                      >
                        <div>
                          <div className="text-xs font-[family-name:var(--font-mono)] text-amber-300">
                            {pillar.subtitle}
                          </div>
                          <h5 className="text-base font-bold text-white mt-1">
                            {pillar.title}
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
                          {pillar.outcomes.map((out, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span>{out}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Side-by-Side Comparison View */}
            {viewMode === "compare" && (
              <motion.div
                key="compare"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {DIGITAL_FACTORIES.map((factory) => (
                  <div
                    key={factory.id}
                    className={`rounded-3xl p-6 sm:p-8 bg-[#0a0f1a]/95 border ${
                      factory.accentColor === "emerald"
                        ? "border-emerald-400/35"
                        : "border-amber-400/35"
                    } flex flex-col justify-between space-y-6`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-300">
                          {factory.badgeText}
                        </span>
                        <span className="text-xs font-[family-name:var(--font-mono)] text-slate-400">
                          {factory.period}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl font-extrabold text-white">
                          {factory.institution}
                        </h3>
                        <p className="text-sm font-semibold text-emerald-300 mt-0.5">
                          {factory.role}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {factory.executiveSummary}
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-300">
                          Key Contributions
                        </div>
                        {factory.myDirectContribution.map((c, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {factory.keyProductsDelivered.length} Flagship Capabilities
                      </span>
                      <button
                        onClick={() => setViewMode(factory.id)}
                        className="text-xs font-bold text-amber-300 hover:underline cursor-pointer"
                      >
                        Open Full {factory.institution} Deep-Dive →
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
