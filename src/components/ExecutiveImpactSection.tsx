"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const EXECUTIVE_PILLARS = [
  {
    index: "01",
    domain: "Institutional Capability",
    title: "Establishing Banking Digital Factories from Scratch",
    summary:
      "Transitioning financial institutions from outsourced vendor dependency to high-velocity, in-house product engineering organizations.",
    thesis:
      "A Digital Factory is more than an engineering team—it requires defining multi-year technology roadmaps, selecting cohesive polyglot stacks, structuring autonomous squads backed by technical chapters, and installing automated release governance from day one.",
    proof:
      "Key builder of two greenfield Digital Factories in Kuwait: Warba Bank’s “Al-Wateen” Digital Factory (2019–2022) and Kuwait International Bank’s Digital Factory (2022–Present).",
    scope: "Strategy · Roadmaps · Chapter Topology · Hiring Standards",
  },
  {
    index: "02",
    domain: "Portfolio Command",
    title: "Multi-Vertical Banking & Enterprise Product Delivery",
    summary:
      "Directing parallel roadmaps across Retail Banking, Corporate Treasury, PropTech, Shariah WealthTech, BNPL, EdTech, and Healthcare.",
    thesis:
      "As Head of Digital Technology at KIB, I direct cross-platform teams delivering eight interconnected product lines across Android, iOS, and Web—building on a career delivering large-scale EdTech (EduWave all versions), Healthcare (MedXJordan), Islamic platforms (Great Tafsirs, Al-Zakah), and dynamic WealthTech (Advicenode).",
    proof:
      "16+ flagship production platforms delivered or directed across KIB, Warba Bank, United Bank for Africa (UBA), ITG Solutions, and Advicenode.",
    scope: "Retail · Corporate · PropTech · WealthTech · BNPL · BaaS · EdTech",
  },
  {
    index: "03",
    domain: "Enterprise Architecture",
    title: "Polyglot Mobile, Web & Microservice Architecture",
    summary:
      "Uniting Native mobile precision (Kotlin/Swift) and Flutter velocity with Domain-Driven backend microservices (NestJS, Java EE, Kafka, RabbitMQ).",
    thesis:
      "Architectural leadership requires deep hands-on mastery. Having written and architected production systems across Kotlin, Java, Swift, Dart/Flutter, NestJS, and Java EE, I enforce clean Domain-Driven Design (DDD) boundaries, dependency injection (Hilt/Dagger), and event-driven choreography.",
    proof:
      "Built Warba Bank Mobile from scratch, developed Fayez & Fayez Admin (Flutter Web), migrated UBA Mobile Banking from Cordova to Flutter, restructured all versions of EduWave & MedXJordan, and govern KIB’s enterprise architecture.",
    scope: "DDD · SOLID · Kotlin · Swift · Flutter · NestJS · Kafka",
  },
  {
    index: "04",
    domain: "Release Governance & DevOps",
    title: "Cloud-Native GitOps, CI/CD & Banking Security",
    summary:
      "Embedding OWASP security, Test-Driven Development, Jenkins CI/CD, and Kubernetes / Argo CD GitOps into the delivery lifecycle.",
    thesis:
      "In regulated banking, release speed is only sustainable when compliance and quality gates are automated. I design branching governance and continuous delivery pipelines that turn multi-squad banking releases into repeatable, auditable routines.",
    proof:
      "Created the Jenkins CI/CD pipelines and Git release-management strategy for Warba Bank's mobile chapter, and govern Kubernetes + Argo CD GitOps delivery at KIB.",
    scope: "Kubernetes · Argo CD · Jenkins · OWASP · TDD",
  },
];

export default function ExecutiveImpactSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section
      id="impact"
      className="relative py-24 lg:py-32 bg-[#0f172a] border-b border-slate-200/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">
            01 · Executive Positioning &amp; Impact
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight leading-[1.15]">
            Where Executive Strategy Meets{" "}
            <span className="font-editorial italic font-normal text-[#dfc490]">
              Production Architecture.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-[1.75]">
            Transforming a financial institution requires operating at two altitudes simultaneously: defining technology strategy, roadmaps, and organizational structures at the executive level while governing architecture, microservices, and CI/CD pipelines at the engineering level.
          </p>
        </div>

        {/* Clean, Soothing Expandable Pillars */}
        <div className="mt-12 space-y-3">
          {EXECUTIVE_PILLARS.map((pillar, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={pillar.index}
                className={`rounded-2xl border transition-colors ${
                  isOpen
                    ? "bg-[#131c31] border-[#d4b982]/40"
                    : "bg-[#131c31]/50 border-slate-200/[0.08] hover:border-slate-200/[0.16]"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 sm:p-7 text-left flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-3 text-xs font-tech text-[#dfc490]">
                      <span>{pillar.index}</span>
                      <span>·</span>
                      <span>{pillar.domain}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-100">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {pillar.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                    <span className="text-xs font-tech text-slate-400">
                      {isOpen ? "Hide details" : "Read more"}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg bg-[#182338] border border-slate-200/10 flex items-center justify-center text-[#dfc490] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-7 sm:px-7 pt-2 border-t border-slate-200/[0.07] grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-5 rounded-xl bg-[#0f172a]/80 border border-slate-200/[0.06]">
                          <div className="text-xs font-tech text-[#dfc490] mb-2">
                            Executive &amp; Architectural Approach
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {pillar.thesis}
                          </p>
                        </div>
                        <div className="p-5 rounded-xl bg-[#0f172a]/80 border border-slate-200/[0.06] flex flex-col justify-between">
                          <div>
                            <div className="text-xs font-tech text-[#5eead4] mb-2">
                              Verified Career Evidence
                            </div>
                            <p className="text-sm text-slate-200 leading-relaxed">
                              {pillar.proof}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-200/[0.06] text-xs font-tech text-slate-400">
                            Scope: {pillar.scope}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
