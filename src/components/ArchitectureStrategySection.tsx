"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Layers,
  ShieldCheck,
  Server,
  Database,
  GitBranch,
  CheckCircle2,
  Terminal,
  ArrowRight,
  Lock,
} from "lucide-react";
import { ARCHITECTURE_LAYERS, SKILL_MATRIX } from "@/data/portfolioData";

const LAYER_ICONS = [Layers, ShieldCheck, Server, Database, GitBranch];

export default function ArchitectureStrategySection() {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);
  const currentLayer = ARCHITECTURE_LAYERS[selectedLayerIndex];

  return (
    <section
      id="architecture"
      className="relative py-28 lg:py-36 border-t border-white/[0.08] bg-[#05070b] bg-blueprint-dots"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5" />
            <span>Enterprise Banking Reference Architecture</span>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
            Technology Strategy &amp;{" "}
            <span className="font-[family-name:var(--font-serif)] italic font-normal text-gold-gradient">
              Architectural Governance.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Delivering eight concurrent banking platforms requires more than individual app craftsmanship—it demands a coherent enterprise reference architecture that unifies Mobile (Android, iOS, Flutter), Web, Domain-Driven Microservices (NestJS, Java EE, Kafka, RabbitMQ), and GitOps delivery (Kubernetes, Argo CD, Jenkins).
          </p>
        </div>

        {/* Interactive 5-Layer Banking Architecture Explorer */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Architectural Stack Diagram (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-[family-name:var(--font-mono)] text-slate-400 uppercase tracking-wider">
              <span>Interactive Reference Stack</span>
              <span className="text-amber-300">Click Layer to Inspect</span>
            </div>

            {ARCHITECTURE_LAYERS.map((layer, index) => {
              const Icon = LAYER_ICONS[index] || Layers;
              const isSelected = selectedLayerIndex === index;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerIndex(index)}
                  className={`group relative w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500/20 via-[#0d1424] to-[#0a0f1c] border-amber-400/60 shadow-[0_0_30px_rgba(212,175,55,0.18)]"
                      : "bg-[#090d16]/90 border-white/[0.08] hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-amber-300"
                            : "bg-white/[0.04] text-slate-300 border-white/[0.08] group-hover:text-amber-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest ${
                              isSelected ? "text-amber-300 font-bold" : "text-slate-400"
                            }`}
                          >
                            {layer.layerNumber}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                          {layer.name}
                        </h3>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected
                          ? "text-amber-300 translate-x-1"
                          : "text-slate-600 group-hover:text-slate-300"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Layer Architectural Deep-Dive (7 cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLayer.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25 }}
                className="h-full rounded-3xl p-6 sm:p-9 bg-[#0a0f1c]/95 border border-amber-400/30 border-glow-gold flex flex-col justify-between space-y-6"
              >
                <div className="space-y-6">
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-white/[0.08]">
                    <div>
                      <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-amber-300">
                        {currentLayer.layerNumber} // ARCHITECTURAL SPECIFICATION
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        {currentLayer.name}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-[family-name:var(--font-mono)] bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
                      <Lock className="w-3 h-3" />
                      Production Proven
                    </span>
                  </div>

                  {/* Executive Thesis */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/12 via-white/[0.02] to-transparent border border-amber-400/25">
                    <div className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-300 mb-1">
                      Executive Architectural Thesis
                    </div>
                    <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                      “{currentLayer.executiveThesis}”
                    </p>
                  </div>

                  {/* Detailed Narrative */}
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {currentLayer.description}
                  </p>

                  {/* Design Principles & Technologies Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07]">
                      <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-emerald-300 mb-3">
                        Core Design Principles
                      </div>
                      <ul className="space-y-2">
                        {currentLayer.designPrinciples.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-xs text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07]">
                      <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-300 mb-3">
                        Verified Technologies in Layer
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentLayer.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.05] text-slate-100 border border-white/[0.1]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banking Application Footnote */}
                <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-slate-300">
                    <strong className="text-amber-300 font-[family-name:var(--font-mono)] uppercase">
                      Applied Across:{" "}
                    </strong>
                    {currentLayer.bankingUseCase}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Full Executive Technology & Competency Matrix */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400">
                Complete Technical Repertoire
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Executive &amp; Engineering Capability Matrix
              </h3>
            </div>
            <p className="text-xs font-[family-name:var(--font-mono)] text-slate-400">
              Strictly verified from production banking &amp; enterprise delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SKILL_MATRIX.map((domain, idx) => (
              <div
                key={domain.category}
                className="p-6 rounded-2xl bg-[#090d16]/95 border border-white/[0.08] hover:border-amber-400/30 transition-colors"
              >
                <div className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400 mb-1">
                  DOMAIN 0{idx + 1}
                </div>
                <h4 className="text-base font-bold text-white mb-4">
                  {domain.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {domain.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.04] text-slate-200 border border-white/[0.07]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
