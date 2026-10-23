"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, FileText } from "lucide-react";
import {
  EXECUTIVE_PROFILE,
  EXECUTIVE_METRICS,
  SELECTED_PRODUCTS,
} from "@/data/portfolioData";
import ArchitecturalCanvas from "./ArchitecturalCanvas";

interface HeroSectionProps {
  onOpenDossier: () => void;
}

export default function HeroSection({ onOpenDossier }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const featuredApps = SELECTED_PRODUCTS.filter((p) => p.iconPath);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-16 flex flex-col justify-between bg-[#0f172a] soft-grid-bg border-b border-slate-200/[0.08] overflow-hidden"
    >
      <ArchitecturalCanvas />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-14 pb-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 7 Columns: Comfortable, Refined Executive Narrative */}
          <div className="lg:col-span-7 space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#182338]/90 border border-[#d4b982]/30"
            >
              <span className="w-2 h-2 rounded-full bg-[#5eead4]" />
              <span className="text-xs font-medium text-[#dfc490]">
                Head of Digital Technology · Kuwait International Bank (KIB)
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.06 }}
              className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-50 tracking-tight leading-[1.14]"
            >
              Architecting{" "}
              <span className="font-editorial italic font-normal text-champagne-gradient">
                Digital Factories
              </span>{" "}
              &amp; Scalable Banking Ecosystems.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="text-base sm:text-lg text-slate-300 leading-[1.75] max-w-2xl"
            >
              I am <strong className="text-slate-100 font-semibold">Ahmed Shaker</strong>, a senior technology executive and digital transformation leader with over <strong className="text-slate-100 font-semibold">10 years</strong> of experience building regulated banking, WealthTech, EdTech, and healthcare platforms. I played a foundational role in establishing{" "}
              <span className="text-[#dfc490] font-medium">
                two banking Digital Factories from scratch
              </span>
              —at <strong className="text-slate-100 font-semibold">Kuwait International Bank (KIB)</strong> and{" "}
              <strong className="text-slate-100 font-semibold">Warba Bank</strong>.
            </motion.p>

            {/* Balanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <button
                onClick={() => scrollTo("digital-factories")}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-950 bg-[#dfc490] hover:bg-[#e8d1a4] transition-colors cursor-pointer"
              >
                <span>Explore the Two Digital Factories</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo("products")}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-slate-100 bg-[#182338] hover:bg-[#1e2b45] border border-slate-200/[0.1] transition-colors cursor-pointer"
              >
                <span>View 16 Delivered Platforms</span>
                <ArrowUpRight className="w-4 h-4 text-[#dfc490]" />
              </button>

              <button
                onClick={onOpenDossier}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-300 hover:text-[#dfc490] transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#dfc490]" />
                <span>Executive CV</span>
              </button>
            </motion.div>
          </div>

          {/* Right 5 Columns: Calm, Structured Executive Dossier Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Executive Portrait & Identity Card */}
            <div className="p-5 rounded-2xl bg-[#131c31]/95 border border-[#d4b982]/30 flex items-center gap-4 shadow-xl shadow-slate-950/30">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#dfc490]/50 bg-[#182338] shrink-0">
                <Image
                  src="/assets/profile/ahmed-shaker-portrait.jpg"
                  alt={EXECUTIVE_PROFILE.name}
                  width={80}
                  height={80}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-slate-50 truncate">
                    {EXECUTIVE_PROFILE.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#5eead4] shrink-0" title="Active Executive" />
                </div>
                <p className="text-xs font-medium text-[#dfc490] mt-0.5">
                  Head of Digital Technology · KIB
                </p>
                <p className="text-[11px] font-tech text-slate-400 mt-1">
                  Kuwait · 2 Digital Factories Built · 16+ Platforms
                </p>
                <div className="flex items-center gap-3 mt-2.5 text-xs">
                  <a
                    href={EXECUTIVE_PROFILE.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-200 hover:text-[#dfc490] font-medium transition-colors"
                  >
                    <span>LinkedIn Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#dfc490]" />
                  </a>
                  <span className="text-slate-600">·</span>
                  <button
                    onClick={onOpenDossier}
                    className="text-slate-300 hover:text-[#dfc490] font-medium transition-colors cursor-pointer"
                  >
                    Executive Dossier
                  </button>
                </div>
              </div>
            </div>

            {/* Factory II Summary Card */}
            <div
              onClick={() => scrollTo("digital-factories")}
              className="group p-6 rounded-2xl bg-[#131c31]/90 border border-slate-200/[0.09] hover:border-[#d4b982]/45 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-tech text-[#dfc490]">
                <span>Digital Factory II · Jun 2022 – Present</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h2 className="mt-2 text-lg font-semibold text-slate-100">
                Kuwait International Bank (KIB)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Head of Digital Technology
              </p>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Leading mobile, web, and backend delivery across 8 ecosystems: KIB Retail, Corporate, Aqari, Invest, Paytally, Remittance (WAGE), Backoffice &amp; BIN Sponsorship.
              </p>
            </div>

            {/* Factory I Summary Card */}
            <div
              onClick={() => scrollTo("digital-factories")}
              className="group p-6 rounded-2xl bg-[#131c31]/90 border border-slate-200/[0.09] hover:border-[#d4b982]/45 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-tech text-[#5eead4]">
                <span>Digital Factory I · Mar 2019 – Jun 2022</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h2 className="mt-2 text-lg font-semibold text-slate-100">
                Warba Bank · “Al-Wateen” Digital Factory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Android Chapter Lead
              </p>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Built the core Warba Bank mobile app from scratch, created Jenkins CI/CD &amp; Git governance, and delivered Fayez, Fayez Admin (Flutter Web) &amp; Hassala Kids.
              </p>
            </div>

            {/* Verified Production App Icons Bar */}
            <div className="p-5 rounded-2xl bg-[#131c31]/70 border border-slate-200/[0.07]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span>Published App Store &amp; Play Store Platforms</span>
                <button
                  onClick={() => scrollTo("products")}
                  className="text-[#dfc490] hover:underline font-medium cursor-pointer"
                >
                  Inspect All 16 →
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {featuredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => scrollTo("products")}
                    title={`${app.name} (${app.institution})`}
                    className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200/15 hover:border-[#dfc490] transition-transform hover:scale-105 cursor-pointer"
                  >
                    {app.iconPath && (
                      <Image
                        src={app.iconPath}
                        alt={app.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom 4-Column Executive Highlights Bar */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXECUTIVE_METRICS.map((metric) => (
            <div
              key={metric.id}
              className="p-5 rounded-2xl bg-[#131c31]/80 border border-slate-200/[0.08]"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#dfc490] tracking-tight">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-slate-100 mt-1.5">
                {metric.label}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {metric.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
