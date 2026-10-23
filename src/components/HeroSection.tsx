"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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
      className="relative min-h-screen pt-16 flex flex-col justify-between bg-[#080807] swiss-grid-dark border-b border-[#F4F0E8]/[0.12] overflow-hidden"
    >
      {/* Interactive Geometric Topology Canvas */}
      <ArchitecturalCanvas />

      {/* Top Architectural Sub-Header Bar */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-4 border-b border-[#F4F0E8]/[0.08] grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-tech uppercase tracking-[0.14em] text-[#9A958B]">
        <div className="flex items-center gap-2">
          <span className="text-[#C8A464]">MANDATE //</span>
          <span className="text-[#F4F0E8]">DIGITAL BANKING TRANSFORMATION &amp; ARCHITECTURE</span>
        </div>
        <div className="hidden md:flex items-center justify-center gap-2">
          <span className="text-[#C8A464]">SIGNATURE //</span>
          <span className="text-[#F4F0E8]">02 BANKING DIGITAL FACTORIES BUILT FROM ZERO</span>
        </div>
        <div className="hidden md:flex items-center justify-end gap-2">
          <span className="text-[#C8A464]">JURISDICTION //</span>
          <span className="text-[#F4F0E8]">KUWAIT · GCC · MENA</span>
        </div>
      </div>

      {/* Main Monumental Editorial Stage */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-12 lg:py-20 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
          {/* Left 8 Columns: Monumental Kinetic Typography */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3"
            >
              <span className="w-8 h-[1px] bg-[#C8A464]" />
              <span className="font-tech text-xs uppercase tracking-[0.2em] text-[#C8A464]">
                Ahmed Shaker — Head of Digital Technology at KIB
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-extrabold uppercase text-[#F4F0E8] tracking-[-0.04em] leading-[0.94] text-[clamp(2.65rem,6.6vw,6.4rem)]"
            >
              <span className="block">Architecting</span>
              <span className="block font-editorial italic font-normal normal-case text-bronze-foil tracking-[-0.01em] py-1">
                Digital Factories
              </span>
              <span className="block">&amp; Sovereign Banking</span>
              <span className="block">Ecosystems.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 max-w-2xl space-y-6"
            >
              <p className="text-base sm:text-xl text-[#D6D1C7] leading-[1.6] font-normal">
                Technology executive and enterprise architect with{" "}
                <span className="text-[#F4F0E8] font-semibold">10+ years</span> building regulated banking platforms across Mobile, Backend Microservices, and Cloud-Native DevOps. Instrumental in establishing{" "}
                <span className="text-[#C8A464] border-b border-[#C8A464]/50 pb-0.5">
                  two in-house Digital Factories from scratch
                </span>{" "}
                at <span className="text-[#F4F0E8] font-semibold">Kuwait International Bank (KIB)</span> and{" "}
                <span className="text-[#F4F0E8] font-semibold">Warba Bank</span>.
              </p>

              {/* Editorial Action Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollTo("digital-factories")}
                  className="group inline-flex items-center gap-4 px-7 py-4 bg-[#F4F0E8] text-[#080807] hover:bg-[#C8A464] transition-colors duration-300 cursor-pointer"
                >
                  <span className="font-tech text-xs font-semibold uppercase tracking-[0.16em]">
                    01 / Examine The Two Digital Factories
                  </span>
                  <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => scrollTo("products")}
                  className="group inline-flex items-center gap-3 px-6 py-4 border border-[#F4F0E8]/25 text-[#F4F0E8] hover:border-[#C8A464] hover:text-[#C8A464] transition-colors duration-300 cursor-pointer"
                >
                  <span className="font-tech text-xs uppercase tracking-[0.16em]">
                    02 / Production Showroom (11)
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenDossier}
                  className="px-4 py-4 font-tech text-xs uppercase tracking-[0.16em] text-[#9A958B] hover:text-[#F4F0E8] underline underline-offset-8 decoration-[#C8A464]/50 cursor-pointer"
                >
                  Board Dossier [PDF]
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right 4 Columns: Architectural Dossier Ledger */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 border-l border-[#F4F0E8]/[0.14] pl-0 lg:pl-8 space-y-6"
          >
            {/* Factory II Ledger Entry */}
            <div
              onClick={() => scrollTo("digital-factories")}
              className="group p-5 border border-[#F4F0E8]/[0.12] bg-[#0D0D0B]/90 hover:border-[#C8A464]/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] font-tech uppercase tracking-[0.16em] text-[#C8A464]">
                <span>FACTORY II · JUN 2022 — PRESENT</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h2 className="mt-2 text-lg font-bold text-[#F4F0E8] tracking-tight">
                Kuwait International Bank (KIB)
              </h2>
              <p className="text-xs font-tech text-[#9A958B] mt-0.5">
                Head of Digital Technology
              </p>
              <p className="mt-3 text-xs text-[#D6D1C7] leading-relaxed">
                Owning mobile, web, and backend delivery across 8 ecosystems: Retail, Corporate, Aqari, Invest, Paytally, Remittance, Backoffice &amp; BIN Sponsorship.
              </p>
            </div>

            {/* Factory I Ledger Entry */}
            <div
              onClick={() => scrollTo("digital-factories")}
              className="group p-5 border border-[#F4F0E8]/[0.12] bg-[#0D0D0B]/90 hover:border-[#C8A464]/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] font-tech uppercase tracking-[0.16em] text-[#9A958B] group-hover:text-[#C8A464]">
                <span>FACTORY I · MAR 2019 — JUN 2022</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h2 className="mt-2 text-lg font-bold text-[#F4F0E8] tracking-tight">
                Warba Bank · “Al-Wateen” Factory
              </h2>
              <p className="text-xs font-tech text-[#9A958B] mt-0.5">
                Android Chapter Lead
              </p>
              <p className="mt-3 text-xs text-[#D6D1C7] leading-relaxed">
                Built core mobile banking from scratch, established Jenkins CI/CD &amp; Git governance, and delivered Fayez, Fayez Admin (Flutter Web) &amp; Hassala Kids.
              </p>
            </div>

            {/* Live Production App Icon Roster */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[10px] font-tech uppercase tracking-[0.16em] text-[#9A958B] mb-3">
                <span>VERIFIED MARKET ASSETS (APP STORE / PLAY)</span>
                <button
                  onClick={() => scrollTo("products")}
                  className="text-[#C8A464] hover:underline cursor-pointer"
                >
                  VIEW ALL →
                </button>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {featuredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => scrollTo("products")}
                    title={`${app.name} — ${app.institution}`}
                    className="relative w-10 h-10 overflow-hidden border border-[#F4F0E8]/20 hover:border-[#C8A464] transition-all grayscale-[25%] hover:grayscale-0 hover:scale-105 cursor-pointer"
                  >
                    {app.iconPath && (
                      <Image
                        src={app.iconPath}
                        alt={app.name}
                        width={40}
                        height={40}
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

      {/* Bottom Exposed 4-Cell Swiss Ledger */}
      <div className="relative z-10 border-t border-[#F4F0E8]/[0.12] bg-[#080807]/95">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F4F0E8]/[0.1]">
          {EXECUTIVE_METRICS.map((metric, idx) => (
            <div key={metric.id} className="p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-tech uppercase tracking-[0.18em] text-[#9A958B]">
                <span>INDEX // 0{idx + 1}</span>
                <span className="text-[#C8A464]">VERIFIED</span>
              </div>
              <div className="my-4 font-display text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] text-[#F4F0E8]">
                {metric.value}
              </div>
              <div>
                <div className="text-sm font-bold text-[#F4F0E8] tracking-tight">
                  {metric.label}
                </div>
                <p className="text-xs text-[#9A958B] mt-1 leading-relaxed">
                  {metric.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
