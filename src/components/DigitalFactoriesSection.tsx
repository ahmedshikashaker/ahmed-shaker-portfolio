"use client";

import React, { useState } from "react";
import { ArrowUpRight, Layers, ShieldCheck, Cpu } from "lucide-react";
import {
  DIGITAL_FACTORIES,
  DIGITAL_FACTORY_TOPOLOGY,
} from "@/data/portfolioData";

export default function DigitalFactoriesSection() {
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const activeNode = DIGITAL_FACTORY_TOPOLOGY[activeNodeIndex];

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

        {/* Interactive 5-Stage End-to-End Digital Factory Operating Topology */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#131c31]/90 border border-slate-200/[0.09] shadow-xl shadow-slate-950/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-tech uppercase tracking-wider text-[#5eead4]">
                <Layers className="w-3.5 h-3.5" />
                <span>Interactive End-to-End Digital Factory Topology</span>
              </div>
              <h3 className="mt-1 text-lg sm:text-xl font-display font-semibold text-slate-100">
                Select any architectural stage to inspect how I structured and governed it at KIB &amp; Warba Bank
              </h3>
            </div>
            <span className="text-xs font-tech text-slate-400 shrink-0">
              Stage {activeNodeIndex + 1} of {DIGITAL_FACTORY_TOPOLOGY.length}
            </span>
          </div>

          {/* 5 Connected Stage Selector Nodes */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
            {DIGITAL_FACTORY_TOPOLOGY.map((node, idx) => {
              const isSelected = activeNodeIndex === idx;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeIndex(idx)}
                  className={`relative p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#182338] border-[#dfc490]/55 shadow-md shadow-slate-950/40"
                      : "bg-[#0f172a]/70 border-slate-200/[0.07] hover:border-slate-200/[0.18]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-tech">
                      <span
                        className={
                          isSelected ? "text-[#dfc490] font-semibold" : "text-slate-400"
                        }
                      >
                        {node.stageCode}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? "bg-[#5eead4]" : "bg-slate-600"
                        }`}
                      />
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-100 leading-snug">
                      {node.title}
                    </div>
                  </div>
                  <div className="mt-2.5 text-[11px] text-slate-400 leading-snug">
                    {node.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Live Inspection Panel */}
          <div className="mt-6 p-6 rounded-2xl bg-[#0f172a]/90 border border-slate-200/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182338] border border-[#dfc490]/30 text-xs font-tech text-[#dfc490]">
                <span>{activeNode.stageCode}</span>
                <span>·</span>
                <span>{activeNode.subtitle}</span>
              </div>
              <h4 className="text-xl font-display font-bold text-slate-50">
                {activeNode.title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeNode.architecturalRole}
              </p>

              {/* Key Standards */}
              <div className="pt-2">
                <div className="text-[11px] font-tech uppercase tracking-wider text-slate-400 mb-2">
                  Core Engineering Standards Enforced
                </div>
                <ul className="space-y-2">
                  {activeNode.keyStandards.map((std, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5eead4] shrink-0 mt-0.5" />
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 lg:pl-6 lg:border-l lg:border-slate-200/[0.08]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#131c31] border border-[#dfc490]/25">
                  <div className="text-[11px] font-tech uppercase tracking-wider text-[#dfc490] mb-1.5">
                    KIB Digital Factory Implementation
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {activeNode.kibImplementation}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#131c31] border border-[#5eead4]/25">
                  <div className="text-[11px] font-tech uppercase tracking-wider text-[#5eead4] mb-1.5">
                    Warba Bank “Al-Wateen” Implementation
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {activeNode.warbaImplementation}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-tech text-slate-400 mr-1">
                  <Cpu className="w-3.5 h-3.5 text-[#dfc490]" />
                  <span>Stage Stack:</span>
                </span>
                {activeNode.stackBadges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-1 rounded-lg bg-[#182338] border border-slate-200/[0.08] text-xs font-tech text-slate-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Two Digital Factory Institutional Comparison Cards */}
        <div className="mt-16 space-y-12">
          {DIGITAL_FACTORIES.map((factory, index) => (
            <div
              key={factory.id}
              className="p-6 sm:p-10 rounded-3xl bg-[#131c31]/90 border border-slate-200/[0.09] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
            >
              {/* Left 5 Columns: Institutional Context */}
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182338] border border-[#d4b982]/30 text-xs font-tech text-[#dfc490]">
                  <span>Digital Factory 0{index + 1}</span>
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
