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
      className="relative py-28 lg:py-40 bg-[#080807] text-[#F4F0E8] border-b border-[#F4F0E8]/[0.12]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-[#F4F0E8]/[0.12]">
          <div className="lg:col-span-4">
            <span className="font-tech text-xs uppercase tracking-[0.2em] text-[#C8A464]">
              03 // ENTERPRISE ARCHITECTURE
            </span>
            <p className="mt-3 font-tech text-xs uppercase tracking-[0.14em] text-[#9A958B]">
              5-LAYER DIGITAL BANKING REFERENCE BLUEPRINT
            </p>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.04em] text-[#F4F0E8] leading-[0.96]">
              Technology Strategy &amp;{" "}
              <span className="font-editorial italic font-normal normal-case text-bronze-foil">
                System Topology.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#9A958B] max-w-3xl leading-relaxed">
              A banking Digital Factory succeeds when its underlying architecture decouples rapid product innovation from legacy core banking constraints. Below is the 5-layer enterprise reference architecture I govern across Mobile, Web, Domain-Driven Microservices, and GitOps infrastructure.
            </p>
          </div>
        </div>

        {/* Interactive 5-Layer Blueprint Schematic */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 border border-[#F4F0E8]/[0.14] bg-[#0B0B09]">
          {/* Left 5 Columns: Architectural Stack Selector */}
          <div className="lg:col-span-5 divide-y divide-[#F4F0E8]/[0.1] border-b lg:border-b-0 lg:border-r border-[#F4F0E8]/[0.14]">
            <div className="px-6 py-4 bg-[#10100E] flex items-center justify-between font-tech text-[10px] uppercase tracking-[0.18em] text-[#9A958B]">
              <span>SYSTEM TOPOLOGY STACK</span>
              <span className="text-[#C8A464]">SELECT LAYER [01–05]</span>
            </div>

            {ARCHITECTURE_LAYERS.map((layer, index) => {
              const isSelected = selectedLayerIndex === index;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerIndex(index)}
                  className={`w-full p-6 sm:p-7 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#171612] border-l-4 border-l-[#C8A464]"
                      : "hover:bg-[#F4F0E8]/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between font-tech text-xs">
                    <span className={isSelected ? "text-[#C8A464] font-bold" : "text-[#9A958B]"}>
                      {layer.layerNumber}
                    </span>
                    <span className="text-[10px] text-[#9A958B]">
                      {layer.technologies.slice(0, 3).join(" · ")}
                    </span>
                  </div>
                  <h3
                    className={`mt-2 font-display text-lg sm:text-xl font-bold tracking-tight ${
                      isSelected ? "text-[#F4F0E8]" : "text-[#D6D1C7]"
                    }`}
                  >
                    {layer.name}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Right 7 Columns: Selected Layer Specification Sheet */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#0D0D0B]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLayer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b border-[#F4F0E8]/[0.1]">
                  <div className="font-tech text-xs uppercase tracking-[0.2em] text-[#C8A464]">
                    {currentLayer.layerNumber} // ARCHITECTURAL SPECIFICATION
                  </div>
                  <h3 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold text-[#F4F0E8] tracking-tight">
                    {currentLayer.name}
                  </h3>
                </div>

                {/* Executive Thesis Quote */}
                <div className="p-6 bg-[#13120F] border-l-2 border-[#C8A464]">
                  <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464] mb-2">
                    ARCHITECTURAL THESIS
                  </div>
                  <p className="font-editorial italic text-xl sm:text-2xl text-[#F4F0E8] leading-snug">
                    “{currentLayer.executiveThesis}”
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#D6D1C7] leading-relaxed">
                  {currentLayer.description}
                </p>

                {/* Two-Column Spec Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 border border-[#F4F0E8]/[0.1] bg-[#090908]">
                    <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464] mb-3">
                      ARCHITECTURAL INVARIANTS
                    </div>
                    <ul className="space-y-2.5 text-xs text-[#D6D1C7]">
                      {currentLayer.designPrinciples.map((p, i) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="font-tech text-[#C8A464]">0{i + 1}.</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 border border-[#F4F0E8]/[0.1] bg-[#090908]">
                    <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464] mb-3">
                      STANDARDIZED TECHNOLOGIES
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentLayer.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 font-tech text-[11px] bg-[#141310] text-[#F4F0E8] border border-[#F4F0E8]/[0.12]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#F4F0E8]/[0.1] font-tech text-xs text-[#9A958B]">
                  <span className="text-[#C8A464] uppercase">PRODUCTION DEPLOYMENT: </span>
                  {currentLayer.bankingUseCase}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Complete Technical Repertoire — 4-Column Swiss Ledger */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#F4F0E8]/[0.12]">
            <div>
              <span className="font-tech text-xs uppercase tracking-[0.18em] text-[#C8A464]">
                VERIFIED TECHNICAL INDEX //
              </span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#F4F0E8]">
                Full-Spectrum Engineering Repertoire
              </h3>
            </div>
            <span className="font-tech text-xs text-[#9A958B]">
              LANGUAGES · MOBILE · BACKEND · DEVOPS · PRACTICES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-x border-[#F4F0E8]/[0.12] divide-y sm:divide-y-0 sm:divide-x divide-[#F4F0E8]/[0.12]">
            {SKILL_MATRIX.map((group, idx) => (
              <div key={group.category} className="p-6 sm:p-8 bg-[#0A0A08]">
                <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464]">
                  DOMAIN // 0{idx + 1}
                </div>
                <h4 className="mt-2 font-display text-lg font-bold text-[#F4F0E8] pb-4 border-b border-[#F4F0E8]/[0.1]">
                  {group.category}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-xs sm:text-sm text-[#D6D1C7] flex items-center justify-between"
                    >
                      <span>{item}</span>
                      <span className="w-1 h-1 bg-[#C8A464]" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
