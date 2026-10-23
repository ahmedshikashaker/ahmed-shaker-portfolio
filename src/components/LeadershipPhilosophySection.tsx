"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  CheckCircle2,
  ShieldCheck,
  Quote,
} from "lucide-react";
import { LEADERSHIP_PRINCIPLES } from "@/data/portfolioData";

export default function LeadershipPhilosophySection() {
  return (
    <section
      id="leadership"
      className="relative py-28 lg:py-36 border-t border-white/[0.08] bg-[#05070b]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>Leadership &amp; Engineering Excellence</span>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
            How I Build Organizations That{" "}
            <span className="font-[family-name:var(--font-serif)] italic font-normal text-gold-gradient">
              Ship &amp; Scale.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Technology strategy is only as effective as the engineering culture and governance mechanisms that execute it. My leadership philosophy is forged from building real banking digital factories under regulatory scrutiny and competitive market timelines.
          </p>
        </div>

        {/* 4 Leadership Principles Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {LEADERSHIP_PRINCIPLES.map((principle, idx) => (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="p-7 sm:p-9 rounded-3xl bg-[#0a0f1c]/95 border border-white/[0.08] hover:border-amber-400/35 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-amber-400">
                    PRINCIPLE {principle.number}
                  </span>
                  <Quote className="w-5 h-5 text-amber-400/40" />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-amber-200/90 mt-1">
                    {principle.subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {principle.narrative}
                </p>

                {/* Verified Evidence Box */}
                <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-400/25">
                  <div className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-emerald-300 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Evidence from Career Record</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {principle.evidenceFromCareer}
                  </p>
                </div>
              </div>

              {/* Key Practices */}
              <div className="pt-4 border-t border-white/[0.07] space-y-2">
                {principle.keyPractices.map((practice) => (
                  <div key={practice} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{practice}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
