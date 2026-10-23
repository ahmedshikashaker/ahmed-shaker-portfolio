"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ARCHITECTURE_LAYERS, SKILL_MATRIX } from "@/data/portfolioData";

export default function ArchitectureStrategySection() {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);
  const currentLayer = ARCHITECTURE_LAYERS[selectedLayerIndex];

  return (
    <section
      id="architecture"
      className="relative py-24 lg:py-32 bg-[#11192c] border-b border-slate-200/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">
            04 · Enterprise Architecture &amp; Technology Strategy
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight leading-[1.15]">
            5-Layer Banking Reference{" "}
            <span className="font-editorial italic font-normal text-[#dfc490]">
              Architecture.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-[1.75]">
            A banking Digital Factory succeeds when its underlying architecture decouples rapid product innovation from legacy core banking constraints. Select any layer below to explore how I govern Mobile, Web, Domain-Driven Microservices, and GitOps delivery.
          </p>
        </div>

        {/* Interactive 5-Layer Architecture Explorer */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Columns: Stack Selector */}
          <div className="lg:col-span-5 rounded-2xl bg-[#131c31] border border-slate-200/[0.09] divide-y divide-slate-200/[0.07] overflow-hidden">
            {ARCHITECTURE_LAYERS.map((layer, index) => {
              const isSelected = selectedLayerIndex === index;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerIndex(index)}
                  className={`w-full p-5 sm:p-6 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1c2942] border-l-4 border-l-[#dfc490]"
                      : "hover:bg-[#182338]/70"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-tech">
                    <span className={isSelected ? "text-[#dfc490] font-semibold" : "text-slate-400"}>
                      {layer.layerNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {layer.technologies.slice(0, 2).join(" · ")}
                    </span>
                  </div>
                  <h3
                    className={`mt-1.5 text-base sm:text-lg font-semibold ${
                      isSelected ? "text-slate-50" : "text-slate-200"
                    }`}
                  >
                    {layer.name}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Right 7 Columns: Selected Layer Specification */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLayer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-9 rounded-3xl bg-[#131c31] border border-slate-200/[0.1] space-y-6"
              >
                <div className="pb-5 border-b border-slate-200/[0.08]">
                  <div className="text-xs font-tech text-[#dfc490]">
                    {currentLayer.layerNumber} · Architectural Specification
                  </div>
                  <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
                    {currentLayer.name}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f172a]/70 border-l-2 border-[#dfc490]">
                  <div className="text-xs font-tech text-[#dfc490] mb-1.5">
                    Executive Thesis
                  </div>
                  <p className="font-editorial italic text-lg sm:text-xl text-slate-100 leading-relaxed">
                    “{currentLayer.executiveThesis}”
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-[1.75]">
                  {currentLayer.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  <div className="p-5 rounded-2xl bg-[#0f172a]/60 border border-slate-200/[0.07]">
                    <div className="text-xs font-tech text-[#5eead4] mb-3">
                      Core Design Principles
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {currentLayer.designPrinciples.map((p, i) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="font-tech text-[#dfc490]">0{i + 1}.</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f172a]/60 border border-slate-200/[0.07]">
                    <div className="text-xs font-tech text-[#dfc490] mb-3">
                      Standardized Technologies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentLayer.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-xs bg-[#182338] text-slate-200 border border-slate-200/[0.09]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/[0.08] text-xs text-slate-400">
                  <strong className="text-[#dfc490]">Production Deployment: </strong>
                  {currentLayer.bankingUseCase}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Technical Repertoire Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SKILL_MATRIX.map((group, idx) => (
            <div
              key={group.category}
              className="p-6 rounded-2xl bg-[#131c31]/80 border border-slate-200/[0.08]"
            >
              <div className="text-xs font-tech text-[#dfc490]">
                Domain 0{idx + 1}
              </div>
              <h4 className="mt-1.5 text-base font-semibold text-slate-100 pb-3 border-b border-slate-200/[0.08]">
                {group.category}
              </h4>
              <ul className="mt-3.5 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs sm:text-sm text-slate-300 flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#dfc490]/60" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
