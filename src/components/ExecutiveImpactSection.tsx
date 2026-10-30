"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

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
  const baseId = useId();

  return (
    <Section id="impact" labelledBy="impact-title" className="py-28 lg:py-40">
      <div className="shell">
        <SectionHeader
          index="01"
          label="Executive positioning & impact"
          titleId="impact-title"
          title="Where executive strategy meets *production architecture.*"
          lede="Transforming a financial institution requires operating at two altitudes simultaneously: defining technology strategy, roadmaps, and organizational structures at the executive level while governing architecture, microservices, and CI/CD pipelines at the engineering level."
          aside={
            <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line text-[12.5px]">
              <div className="bg-bg p-4">
                <dt className="eyebrow text-accent">↑ Boardroom</dt>
                <dd className="mt-1.5 text-fg-3">Strategy, roadmaps, organisation design</dd>
              </div>
              <div className="bg-bg p-4">
                <dt className="eyebrow text-signal">↓ Production</dt>
                <dd className="mt-1.5 text-fg-3">Architecture, microservices, CI/CD</dd>
              </div>
            </dl>
          }
        />

        <Stagger as="ol" className="mt-16 border-t border-line lg:mt-24" stagger={0.07}>
          {EXECUTIVE_PILLARS.map((pillar, idx) => {
            const open = openIndex === idx;
            const panelId = `${baseId}-panel-${idx}`;
            const buttonId = `${baseId}-button-${idx}`;
            return (
              <StaggerItem as="li" key={pillar.index} className="border-b border-line">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? -1 : idx)}
                    className="group grid w-full cursor-pointer grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-start gap-x-4 py-8 text-left sm:grid-cols-[4.5rem_minmax(0,1fr)_2.75rem] lg:grid-cols-[5.5rem_minmax(0,1.15fr)_minmax(0,0.85fr)_2.75rem] lg:gap-x-10 lg:py-10"
                  >
                    <span
                      className={cn(
                        "numeric font-display text-[2rem] leading-none transition-colors duration-300 sm:text-[2.75rem]",
                        open ? "text-accent" : "text-fg-4 group-hover:text-fg-3"
                      )}
                    >
                      {pillar.index}
                    </span>
                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                      <span className="eyebrow block text-fg-3">{pillar.domain}</span>
                      <span className="mt-3 block font-display text-title text-fg lg:text-[2rem] lg:leading-[1.12]">{pillar.title}</span>
                      <span className="mt-3 block text-[14.5px] leading-relaxed text-fg-3 lg:hidden">{pillar.summary}</span>
                    </span>
                    <span className="hidden pt-7 text-[15px] leading-relaxed text-fg-3 lg:block">{pillar.summary}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative mt-1 grid size-11 place-items-center rounded-full border transition-colors duration-300",
                        open ? "border-accent/60 bg-accent/10 text-accent" : "border-line-2 text-fg-3 group-hover:border-line-3 group-hover:text-fg"
                      )}
                    >
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span
                        className={cn(
                          "absolute h-3.5 w-px bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          open && "rotate-90 scale-y-0"
                        )}
                      />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="panel"
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, transition: { height: { duration: 0.55, ease: EASE_OUT }, opacity: { duration: 0.4, delay: 0.1 } } }}
                      exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.4, ease: EASE_IN_OUT }, opacity: { duration: 0.2 } } }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 sm:pl-[calc(4.5rem+1rem)] lg:pl-[calc(5.5rem+2.5rem)] lg:pr-[calc(2.75rem+2.5rem)]">
                        <div className="relative grid gap-px border border-line bg-line md:grid-cols-2">
                          <div className="bg-bg p-6 sm:p-7">
                            <div className="eyebrow flex items-center gap-2 text-accent">
                              <span aria-hidden="true">↑</span> Boardroom altitude · Approach
                            </div>
                            <p className="mt-4 text-[15px] leading-[1.75] text-fg-2">{pillar.thesis}</p>
                          </div>
                          <div className="flex flex-col bg-bg p-6 sm:p-7">
                            <div className="eyebrow flex items-center gap-2 text-signal">
                              <span aria-hidden="true">↓</span> Production altitude · Evidence
                            </div>
                            <p className="mb-6 mt-4 text-[15px] leading-[1.75] text-fg">{pillar.proof}</p>
                            <p className="eyebrow mt-auto border-t border-line pt-4 text-[10px] leading-relaxed text-fg-3">
                              <span className="text-fg-4">Scope —</span> {pillar.scope}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
