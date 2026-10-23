"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const EXECUTIVE_PILLARS = [
  {
    index: "01",
    domain: "INSTITUTIONAL CAPABILITY",
    title: "Digital Factory Establishment & Org Design",
    summary:
      "Transitioning financial institutions from outsourced vendor dependency to sovereign, in-house product engineering organizations.",
    thesis:
      "A Digital Factory is not a rebranded IT department. It requires establishing multi-year technology roadmaps, selecting cohesive polyglot stacks, structuring autonomous squads supported by specialized engineering chapters, and installing automated release governance from day one.",
    proof:
      "Key builder of two greenfield Digital Factories in Kuwait: Warba Bank’s “Al-Wateen” Digital Factory (2019–2022) and Kuwait International Bank’s Digital Factory (2022–Present).",
    metricsOrScope: "Strategy · Roadmaps · Chapter Topology · Hiring Standards",
  },
  {
    index: "02",
    domain: "PORTFOLIO COMMAND",
    title: "Simultaneous Multi-Vertical Banking Delivery",
    summary:
      "Directing parallel engineering roadmaps across Retail, Corporate Treasury, PropTech, Shariah WealthTech, BNPL Marketplaces, and Embedded Finance.",
    thesis:
      "Modern banks compete across specialized verticals rather than a single monolithic app. As Head of Digital Technology at KIB, I direct cross-platform teams delivering eight interconnected product lines across Android, iOS, and Web without duplicating foundational architecture.",
    proof:
      "Directing KIB Retail, KIB Corporate, KIB Aqari, KIB Invest, Paytally (BuyNow), Remittance (WAGE), Backoffice Suites, and Visa-Ready BIN Sponsorship (BaaS).",
    metricsOrScope: "8+ Regulated Product Lines · Android · iOS · Web",
  },
  {
    index: "03",
    domain: "ENTERPRISE ARCHITECTURE",
    title: "Polyglot Client & Event-Driven Microservice Architecture",
    summary:
      "Uniting Native mobile precision (Kotlin/Swift) and Flutter velocity with Domain-Driven backend microservices (NestJS, Java EE, Kafka, RabbitMQ).",
    thesis:
      "Architectural credibility requires knowing how systems behave in production. Having architected applications across Kotlin, Swift, Dart/Flutter, NestJS, and Java EE, I enforce clean Domain-Driven Design (DDD) boundaries, dependency injection (Hilt/Dagger), and asynchronous event choreography.",
    proof:
      "Built Warba Bank Mobile from scratch, developed Fayez & Fayez Admin (Flutter Web), migrated UBA Mobile Banking from Cordova to Flutter, and govern KIB’s enterprise architecture.",
    metricsOrScope: "DDD · SOLID · Kotlin · Swift · Flutter · NestJS · Kafka",
  },
  {
    index: "04",
    domain: "RELEASE GOVERNANCE & DEVOPS",
    title: "Cloud-Native GitOps, CI/CD & Banking Security",
    summary:
      "Embedding OWASP security, Test-Driven Development, Jenkins CI/CD, and Kubernetes / Argo CD GitOps into every commit.",
    thesis:
      "In regulated banking, release speed is only sustainable when compliance and quality gates are automated. I design branching governance and continuous delivery pipelines that turn multi-squad banking releases into repeatable, auditable routines.",
    proof:
      "Created the Jenkins CI/CD pipelines and Git release-management strategy for Warba Bank's mobile chapter, and govern Kubernetes + Argo CD GitOps delivery at KIB.",
    metricsOrScope: "Kubernetes · Argo CD · Jenkins · OWASP · TDD",
  },
];

export default function ExecutiveImpactSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section
      id="impact"
      className="relative py-28 lg:py-36 bg-[#080807] border-b border-[#F4F0E8]/[0.12]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Editorial Asymmetric Split Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-[#F4F0E8]/[0.12]">
          <div className="lg:col-span-4">
            <div className="font-tech text-xs uppercase tracking-[0.2em] text-[#C8A464]">
              00 // EXECUTIVE POSITIONING
            </div>
            <p className="mt-3 text-xs font-tech uppercase tracking-[0.12em] text-[#9A958B]">
              BRIDGING C-SUITE STRATEGY &amp; PRODUCTION CODE
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.035em] text-[#F4F0E8] leading-[1.06]">
              Most executives understand strategy OR code.{" "}
              <span className="font-editorial italic font-normal text-[#C8A464]">
                Transforming a bank requires mastering both.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#9A958B] max-w-3xl leading-relaxed">
              My career has been defined by a single discipline: taking ambitious financial institutions from strategic intent to high-velocity, in-house product delivery—without sacrificing architectural rigor, security, or operational resilience.
            </p>
          </div>
        </div>

        {/* Interactive Swiss Architectural Ledger (Accordion Rows) */}
        <div className="divide-y divide-[#F4F0E8]/[0.12] border-b border-[#F4F0E8]/[0.12]">
          {EXECUTIVE_PILLARS.map((pillar, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={pillar.index} className="group">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full py-8 sm:py-10 text-left grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline hover:bg-[#F4F0E8]/[0.015] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="lg:col-span-2 flex items-center gap-4">
                    <span className="font-tech text-sm text-[#C8A464]">
                      /{pillar.index}
                    </span>
                    <span className="font-tech text-[11px] uppercase tracking-[0.14em] text-[#9A958B]">
                      {pillar.domain}
                    </span>
                  </div>

                  <div className="lg:col-span-6">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F0E8] group-hover:text-[#C8A464] transition-colors tracking-tight">
                      {pillar.title}
                    </h3>
                  </div>

                  <div className="lg:col-span-3">
                    <p className="text-xs sm:text-sm text-[#9A958B] leading-relaxed">
                      {pillar.summary}
                    </p>
                  </div>

                  <div className="lg:col-span-1 flex justify-end">
                    <span className="w-8 h-8 border border-[#F4F0E8]/20 flex items-center justify-center text-[#C8A464]">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 pt-2 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-2" />
                        <div className="lg:col-span-5 p-6 bg-[#10100E] border-l-2 border-[#C8A464]">
                          <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464] mb-2">
                            ARCHITECTURAL &amp; EXECUTIVE THESIS
                          </div>
                          <p className="text-sm text-[#D6D1C7] leading-relaxed">
                            {pillar.thesis}
                          </p>
                        </div>
                        <div className="lg:col-span-5 p-6 bg-[#10100E] border border-[#F4F0E8]/[0.08] flex flex-col justify-between">
                          <div>
                            <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#9A958B] mb-2">
                              VERIFIED CAREER EVIDENCE
                            </div>
                            <p className="text-sm text-[#F4F0E8] leading-relaxed">
                              {pillar.proof}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#F4F0E8]/[0.08] font-tech text-[11px] text-[#C8A464]">
                            SCOPE: {pillar.metricsOrScope}
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

        {/* Attribution Charter Strip */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 border border-[#F4F0E8]/[0.12] bg-[#0D0D0B]">
          <div className="lg:col-span-4">
            <span className="font-tech text-[11px] uppercase tracking-[0.18em] text-[#C8A464]">
              ATTRIBUTION PROTOCOL //
            </span>
            <h3 className="mt-2 text-lg font-bold text-[#F4F0E8]">
              Strict Distinction Between Executive Direction &amp; Direct Authorship
            </h3>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#9A958B] leading-relaxed">
            <div className="border-l border-[#C8A464]/50 pl-4">
              <strong className="text-[#F4F0E8] font-tech uppercase tracking-wider block mb-1">
                [A] Executive Function Ownership (KIB · 2022–Present)
              </strong>
              As Head of Digital Technology, I own the digital technology function, define enterprise architecture and release governance, and direct the cross-platform engineering squads that build and evolve KIB’s 8+ digital banking product lines.
            </div>
            <div className="border-l border-[#F4F0E8]/30 pl-4">
              <strong className="text-[#F4F0E8] font-tech uppercase tracking-wider block mb-1">
                [B] Hands-On Architecture &amp; Chapter Lead (2016–2022)
              </strong>
              At Warba Bank, Cit Global (UBA), ITG Solutions, and Advicenode, I personally architected and engineered core applications from scratch (Warba Mobile, Fayez, Fayez Admin, Hassala Kids, UBA Flutter migration) while leading mobile chapters and CI/CD automation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
