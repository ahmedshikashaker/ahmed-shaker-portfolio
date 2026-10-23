"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Cpu,
  GitBranch,
  Layers,
  ShieldCheck,
  Compass,
  Users,
  Workflow,
  CheckCircle2,
} from "lucide-react";

const IMPACT_DOMAINS = [
  {
    id: "digital-factory-creation",
    badge: "PILLAR 01 · INSTITUTIONAL TRANSFORMATION",
    title: "Establishing Banking Digital Factories from Scratch",
    description:
      "I help banks transition from slow, vendor-dependent IT procurement models into high-velocity internal engineering organizations—defining the strategic direction, multi-year technology roadmaps, hiring blueprints, and delivery structures required to ship digital products sustainably.",
    highlights: [
      "Key builder of two pioneering Digital Factories in Kuwait: Warba Bank (“Al-Wateen”) and Kuwait International Bank (KIB).",
      "Aligned C-suite banking ambitions with pragmatic, phased engineering execution.",
      "Created repeatable product-incubation engines capable of launching new banking verticals in-house.",
    ],
    icon: Building2,
    accent: "from-amber-500/20 to-amber-500/5 border-amber-400/30 text-amber-300",
  },
  {
    id: "multi-platform-ownership",
    badge: "PILLAR 02 · MULTI-PRODUCT DELIVERY",
    title: "Full-Ecosystem Command Across Retail, Corporate & BaaS",
    description:
      "At KIB, I own the digital technology function across mobile, web, and backend delivery—directing cross-platform teams across eight concurrent product ecosystems serving individuals, SMEs, large corporates, real estate investors, and external fintech partners.",
    highlights: [
      "Retail & Wealth: KIB Mobile (Retail), KIB Invest (Shariah WealthTech), Warba Bank Mobile, Hassala Kids.",
      "Corporate & PropTech: KIB Corporate (multi-level commercial approvals) and KIB Aqari (automated rent & QR appraisals).",
      "Embedded Finance & Marketplaces: Paytally (BuyNow 0% financing), Remittance/WAGE, and Visa-Ready BIN Sponsorship (BaaS).",
    ],
    icon: Layers,
    accent: "from-emerald-500/20 to-emerald-500/5 border-emerald-400/30 text-emerald-300",
  },
  {
    id: "enterprise-architecture",
    badge: "PILLAR 03 · ENTERPRISE & APPLICATION ARCHITECTURE",
    title: "Polyglot Technical Depth: Mobile, Web & Event-Driven Backends",
    description:
      "My executive leadership is anchored in deep hands-on architectural mastery. I define architecture standards across Native Android (Kotlin), Native iOS (Swift), and Flutter (Mobile & Web), paired with Domain-Driven microservices in NestJS and Java EE.",
    highlights: [
      "Pragmatic governance across Native (Kotlin/Swift) and Cross-Platform (Flutter) codebases.",
      "Event-driven microservice architectures leveraging Apache Kafka, RabbitMQ, MongoDB, and relational stores.",
      "Proven legacy modernization record—including migrating UBA Mobile Banking from Cordova to Flutter.",
    ],
    icon: Cpu,
    accent: "from-sky-500/20 to-sky-500/5 border-sky-400/30 text-sky-300",
  },
  {
    id: "devops-release-governance",
    badge: "PILLAR 04 · DEVOPS & RELEASE GOVERNANCE",
    title: "Automated CI/CD, GitOps & Banking-Grade Security",
    description:
      "High velocity in regulated banking requires uncompromising engineering discipline. I establish automated build, test, and deployment pipelines alongside strict release governance so teams ship frequently with confidence.",
    highlights: [
      "Cloud-native deployment orchestration with Kubernetes (K8s) and Argo CD GitOps.",
      "Designed and built Jenkins CI/CD pipelines and Git branching/release strategies from the ground up.",
      "Enforced SOLID, Domain-Driven Design (DDD), Test-Driven Development (TDD), and OWASP security standards.",
    ],
    icon: GitBranch,
    accent: "from-purple-500/20 to-purple-500/5 border-purple-400/30 text-purple-300",
  },
];

export default function ExecutiveImpactSection() {
  return (
    <section
      id="impact"
      className="relative py-24 lg:py-32 border-t border-white/[0.06] bg-gradient-to-b from-[#05070b] via-[#080c14] to-[#05070b]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>Executive Positioning &amp; Impact</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
            Where Boardroom Strategy Meets{" "}
            <span className="font-[family-name:var(--font-serif)] italic font-normal text-gold-gradient">
              Production Engineering.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            True digital banking transformation requires leaders who can operate at two altitudes simultaneously: defining institutional technology strategy and organizational topology at the executive level, while governing architecture, microservices, and CI/CD pipelines at the code level.
          </p>
        </div>

        {/* 4 Impact Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {IMPACT_DOMAINS.map((domain, idx) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative p-7 sm:p-8 rounded-2xl bg-[#0a0f1b]/90 border border-white/[0.08] hover:border-amber-400/35 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-amber-300/90">
                      {domain.badge}
                    </span>
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${domain.accent} border flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                    {domain.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/[0.07] space-y-2.5">
                  {domain.highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Transparent Attribution & Integrity Charter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0c1322] via-[#0a0f1c] to-[#0c1322] border border-white/[0.09] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Executive Attribution &amp; Verification Standard</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Clear Distinction Between Executive Direction, Hands-On Authorship &amp; Squad Delivery
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enterprise banking platforms are built by high-performing organizations. Throughout this portfolio, every case study explicitly distinguishes between products I <strong className="text-white">personally architected and coded from scratch</strong> (such as Warba Bank Mobile, Fayez, Fayez Admin, Hassala Kids, and UBA Flutter migration) and multi-platform ecosystems where I <strong className="text-white">own the digital technology function, define enterprise architecture, and direct cross-platform engineering teams</strong> (such as KIB’s 8+ digital product lines).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
            <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-amber-400/25">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Users className="w-4 h-4" />
                <span>Executive Direction (KIB)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Head of Digital Technology · Owning Mobile, Web &amp; Backend squads + Architecture Governance
              </p>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-emerald-400/25">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Workflow className="w-4 h-4" />
                <span>Hands-On &amp; Chapter Lead</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Warba Bank, Cit Global (UBA), ITG &amp; Advicenode · Greenfield Architecture &amp; CI/CD
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
