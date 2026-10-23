"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  Building2,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Globe,
  FileText,
} from "lucide-react";
import {
  EXECUTIVE_PROFILE,
  EXECUTIVE_METRICS,
  SELECTED_PRODUCTS,
} from "@/data/portfolioData";

interface HeroSectionProps {
  onOpenDossier: () => void;
}

type BlueprintTab = "overview" | "kib-factory" | "warba-factory";

export default function HeroSection({ onOpenDossier }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<BlueprintTab>("overview");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const kibAppsWithIcons = SELECTED_PRODUCTS.filter(
    (p) => p.factoryTag === "KIB Digital Factory" && p.iconPath
  );
  const warbaAppsWithIcons = SELECTED_PRODUCTS.filter(
    (p) => p.factoryTag === "Warba Al-Wateen Factory" && p.iconPath
  );

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-architectural-grid"
    >
      {/* Ambient Sovereign Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 w-[680px] h-[680px] rounded-full bg-amber-500/[0.08] blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-32 w-[560px] h-[560px] rounded-full bg-emerald-500/[0.07] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#05070b]/40 to-[#05070b]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Executive Positioning Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Status & Institutional Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-amber-400/30 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-amber-200 font-semibold">
                Head of Digital Technology · Kuwait International Bank (KIB)
              </span>
            </motion.div>

            {/* Kinetic Executive Headline */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl xl:text-[3.65rem] font-extrabold tracking-tight text-white leading-[1.08]">
                Architecting{" "}
                <span className="font-[family-name:var(--font-serif)] italic font-normal text-gold-gradient pr-1">
                  Digital Factories
                </span>{" "}
                &amp; Platforms That Power Modern Banking.
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
                I am <strong className="text-white font-semibold">Ahmed Shaker</strong>—a senior technology executive and digital banking architect who has established{" "}
                <span className="text-amber-200 font-medium underline decoration-amber-400/40 underline-offset-4">
                  two banking digital factories from scratch
                </span>{" "}
                at <strong className="text-white font-medium">Kuwait International Bank (KIB)</strong> and{" "}
                <strong className="text-white font-medium">Warba Bank</strong>, turning ambitious institutional strategies into production-grade ecosystems across Mobile, Backend Microservices, and Cloud-Native DevOps.
              </p>
            </motion.div>

            {/* Key Differentiator Callout Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
            >
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/30 transition-colors">
                <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] text-amber-300 uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Digital Factories</span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-snug">
                  Defined strategy, roadmaps, tech stacks &amp; engineering orgs at <strong className="text-white">KIB</strong> &amp; <strong className="text-white">Warba Bank</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-400/30 transition-colors">
                <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] text-emerald-300 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Full-Spectrum Stack</span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-snug">
                  Android (Kotlin), iOS (Swift), Flutter, NestJS, Java EE, Kafka, RabbitMQ, K8s &amp; Argo CD.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-sky-400/30 transition-colors">
                <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] text-sky-300 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Multi-Product Scale</span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-snug">
                  Directing <strong className="text-white">8+ banking verticals</strong>: Retail, Corporate, Aqari, Invest, Paytally, WAGE &amp; BaaS.
                </p>
              </div>
            </motion.div>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <button
                onClick={() => scrollTo("digital-factories")}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:brightness-110 transition-all shadow-[0_0_35px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Explore the Two Digital Factories</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollTo("products")}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-amber-400/40 transition-all cursor-pointer"
              >
                <span>Selected Banking Products</span>
                <ArrowUpRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={onOpenDossier}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-slate-300 hover:text-amber-200 bg-transparent hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>View Executive Dossier</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: Interactive Digital Factory Command Matrix (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl bg-[#0a0f1a]/90 border border-amber-400/30 border-glow-gold overflow-hidden backdrop-blur-xl">
              {/* Top Command Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400/80" />
                  <span className="ml-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-slate-300">
                    Executive Command Blueprint
                  </span>
                </div>
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  VERIFIED RECORD
                </span>
              </div>

              {/* Interactive Blueprint Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1 p-2 bg-[#060911] border-b border-white/[0.07]">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-amber-400/20 text-amber-200 border border-amber-400/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  Executive Mandate
                </button>
                <button
                  onClick={() => setActiveTab("kib-factory")}
                  className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activeTab === "kib-factory"
                      ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  KIB Factory (02)
                </button>
                <button
                  onClick={() => setActiveTab("warba-factory")}
                  className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activeTab === "warba-factory"
                      ? "bg-amber-500/20 text-amber-200 border border-amber-400/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  Warba Factory (01)
                </button>
              </div>

              {/* Dynamic Blueprint Panel Content */}
              <div className="p-5 sm:p-6 min-h-[395px] flex flex-col justify-between">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400">
                          Executive Architecture Profile
                        </span>
                        <h2 className="text-lg font-bold text-white mt-0.5">
                          Strategy to Production Banking Delivery
                        </h2>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-right">
                        <div className="text-xs font-bold text-amber-300">2016 — Present</div>
                        <div className="text-[10px] text-slate-400">Kuwait &amp; MENA</div>
                      </div>
                    </div>

                    {/* Three Interlocking Executive Layers */}
                    <div className="space-y-2.5">
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/12 via-white/[0.02] to-transparent border border-amber-400/25">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                          <span>01 · Digital Factory Strategy &amp; Org Design</span>
                          <span className="font-[family-name:var(--font-mono)] text-[10px] text-amber-300">
                            C-Level &amp; VP Alignment
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          Establishing greenfield engineering organizations, multi-year technology roadmaps, squad/chapter topologies, and release governance.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/12 via-white/[0.02] to-transparent border border-emerald-400/25">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-200">
                          <span>02 · Polyglot Client &amp; Microservice Architecture</span>
                          <span className="font-[family-name:var(--font-mono)] text-[10px] text-emerald-300">
                            DDD · SOLID · OWASP
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          Native Android (Kotlin) &amp; iOS (Swift), Flutter (Mobile/Web), and event-driven backends (NestJS, Java EE, Kafka, RabbitMQ).
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-500/12 via-white/[0.02] to-transparent border border-sky-400/25">
                        <div className="flex items-center justify-between text-xs font-bold text-sky-200">
                          <span>03 · Cloud-Native DevOps &amp; GitOps Delivery</span>
                          <span className="font-[family-name:var(--font-mono)] text-[10px] text-sky-300">
                            K8s · Argo CD · Jenkins
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          End-to-end CI/CD automation, Kubernetes container orchestration, and declarative Argo CD release pipelines.
                        </p>
                      </div>
                    </div>

                    {/* App Icons Strip */}
                    <div className="pt-2 border-t border-white/[0.08]">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2.5">
                        <span>Verified Production Ecosystems Delivered / Directed:</span>
                        <button
                          onClick={() => scrollTo("products")}
                          className="text-amber-300 hover:underline font-medium cursor-pointer"
                        >
                          Inspect All 11 →
                        </button>
                      </div>
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                        {[...kibAppsWithIcons, ...warbaAppsWithIcons].map((app) => (
                          <button
                            key={app.id}
                            onClick={() => scrollTo("products")}
                            title={`${app.name} (${app.institution})`}
                            className="group relative shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-white/15 hover:border-amber-400 transition-all hover:scale-105 cursor-pointer"
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
                )}

                {activeTab === "kib-factory" && (
                  <motion.div
                    key="kib-factory"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-emerald-400">
                          Jun 2022 – Present · Kuwait City
                        </span>
                        <h3 className="text-lg font-bold text-white">
                          Kuwait International Bank (KIB)
                        </h3>
                        <p className="text-xs text-emerald-200 font-medium">
                          Role: Head of Digital Technology
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-[family-name:var(--font-mono)] bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                        8+ Product Lines
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Co-established KIB’s Digital Factory from the ground up. Directing cross-platform squads across Android, iOS, Flutter, Web, and NestJS/Java microservices.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "KIB Retail (Mobile)",
                        "KIB Corporate",
                        "KIB Aqari (PropTech)",
                        "KIB Invest (Wealth)",
                        "Paytally (BuyNow BNPL)",
                        "Remittance & WAGE",
                        "BIN Sponsorship (BaaS)",
                        "Backoffice Portals",
                      ].map((prod) => (
                        <div
                          key={prod}
                          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.07] text-xs text-slate-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{prod}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
                      <span className="text-[11px] font-[family-name:var(--font-mono)] text-slate-400">
                        Stack: Kotlin · Swift · Flutter · NestJS · K8s · Argo CD
                      </span>
                      <button
                        onClick={() => scrollTo("digital-factories")}
                        className="text-xs font-semibold text-emerald-300 hover:underline cursor-pointer"
                      >
                        Full Case Study →
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "warba-factory" && (
                  <motion.div
                    key="warba-factory"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-400">
                          Mar 2019 – Jun 2022 · Kuwait City
                        </span>
                        <h3 className="text-lg font-bold text-white">
                          Warba Bank · “Al-Wateen” Factory
                        </h3>
                        <p className="text-xs text-amber-200 font-medium">
                          Role: Android Chapter Lead
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-[family-name:var(--font-mono)] bg-amber-500/15 text-amber-300 border border-amber-400/30">
                        Built From Scratch
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Instrumental in establishing Warba Bank’s pioneering Digital Factory—architecting the core mobile banking app from zero, automating Jenkins CI/CD, and shipping lifestyle &amp; youth banking products.
                    </p>

                    <div className="space-y-2">
                      {[
                        {
                          title: "Warba Bank Mobile Banking App",
                          desc: "Built and managed from scratch — architecture, delivery & production support.",
                        },
                        {
                          title: "Fayez & Fayez Admin (Flutter Web)",
                          desc: "Gamified fitness, step-tracking & sports prediction loyalty ecosystem.",
                        },
                        {
                          title: "Hassala Kids (End-to-End Delivery)",
                          desc: "Digital savings & financial literacy application built for children.",
                        },
                        {
                          title: "Mobile Chapter CI/CD & Git Governance",
                          desc: "Jenkins pipelines, branching models & release engineering standards.",
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.07]"
                        >
                          <div className="text-xs font-semibold text-white">{item.title}</div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
                      <span className="text-[11px] font-[family-name:var(--font-mono)] text-slate-400">
                        Stack: Kotlin · Java · Flutter Web · Hilt/Dagger · Jenkins
                      </span>
                      <button
                        onClick={() => scrollTo("digital-factories")}
                        className="text-xs font-semibold text-amber-300 hover:underline cursor-pointer"
                      >
                        Full Case Study →
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Verified Executive Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.32 }}
          className="mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {EXECUTIVE_METRICS.map((metric, idx) => (
            <div
              key={metric.id}
              className="group relative p-6 rounded-2xl bg-[#0a0f1a]/80 border border-white/[0.08] hover:border-amber-400/35 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-slate-400">
                  0{idx + 1} // VERIFIED SCOPE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 group-hover:scale-150 transition-transform" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gold-gradient">
                {metric.value}
              </div>
              <div className="text-sm font-bold text-white mt-2">
                {metric.label}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {metric.sublabel}
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] font-[family-name:var(--font-mono)] text-emerald-400/90">
                ✓ {metric.verificationNote}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
