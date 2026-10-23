"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";

interface ContactSectionProps {
  onOpenDossier: () => void;
}

const DIALOGUE_TOPICS = [
  {
    id: "executive-role",
    code: "01",
    label: "CTO / VP / Head of Technology Mandate",
    subject: "Executive Technology Leadership Inquiry — Ahmed Shaker",
    template:
      "Hello Ahmed,\n\nI reviewed your executive portfolio and your track record establishing the Digital Factories at Kuwait International Bank (KIB) and Warba Bank. I would like to schedule a confidential conversation regarding an executive technology leadership mandate.",
  },
  {
    id: "digital-factory",
    code: "02",
    label: "Establishing a Banking Digital Factory",
    subject: "Digital Factory & Banking Transformation Advisory — Ahmed Shaker",
    template:
      "Hello Ahmed,\n\nWe are exploring establishing or scaling an in-house Digital Factory and would value discussing your experience architecting the technology roadmaps, stacks, and engineering teams at KIB and Warba Bank.",
  },
  {
    id: "architecture-baas",
    code: "03",
    label: "Enterprise Architecture & BaaS Strategy",
    subject: "Digital Banking Architecture & Platform Strategy — Ahmed Shaker",
    template:
      "Hello Ahmed,\n\nI would love to connect regarding digital banking platform architecture, cross-platform mobile/web delivery, and embedded finance / BIN Sponsorship ecosystems.",
  },
];

export default function ContactSection({ onOpenDossier }: ContactSectionProps) {
  const [selectedTopic, setSelectedTopic] = useState(DIALOGUE_TOPICS[0]);
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(null);

  const copyToClipboard = (value: string, field: "email" | "phone") => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const mailtoHref = `mailto:${EXECUTIVE_PROFILE.contact.email}?subject=${encodeURIComponent(
    selectedTopic.subject
  )}&body=${encodeURIComponent(selectedTopic.template)}`;

  return (
    <footer
      id="contact"
      className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 bg-[#080807] text-[#F4F0E8] swiss-grid-dark"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Monumental Closing Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-[#F4F0E8]/[0.14]">
          <div className="lg:col-span-4">
            <span className="font-tech text-xs uppercase tracking-[0.2em] text-[#C8A464]">
              06 // EXECUTIVE DIALOGUE
            </span>
            <p className="mt-3 font-tech text-xs uppercase tracking-[0.14em] text-[#9A958B]">
              KUWAIT CITY · GCC · GLOBAL MANDATES
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-[-0.04em] text-[#F4F0E8] leading-[0.94]">
              Initiate An{" "}
              <span className="font-editorial italic font-normal normal-case text-bronze-foil">
                Executive Conversation.
              </span>
            </h2>
            <p className="text-base sm:text-xl text-[#9A958B] max-w-3xl leading-relaxed">
              Available for confidential discussions with Chief Executive Officers, Boards, Financial Institutions, and Executive Search Partners regarding <strong className="text-[#F4F0E8]">Chief Technology Officer / Head of Digital Technology mandates</strong>, <strong className="text-[#F4F0E8]">building Digital Factories</strong>, and <strong className="text-[#F4F0E8]">digital banking transformation</strong>.
            </p>
          </div>
        </div>

        {/* Main Contact & Dispatch Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#F4F0E8]/[0.14]">
          {/* Left 6 Columns: Direct Coordinates & Profiles */}
          <div className="lg:col-span-6 py-12 lg:pr-12 lg:border-r border-[#F4F0E8]/[0.14] flex flex-col justify-between space-y-10">
            <div className="space-y-8">
              {/* Direct Email */}
              <div className="pb-8 border-b border-[#F4F0E8]/[0.1]">
                <div className="flex items-center justify-between font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464]">
                  <span>DIRECT ELECTRONIC MAIL //</span>
                  <button
                    onClick={() =>
                      copyToClipboard(EXECUTIVE_PROFILE.contact.email, "email")
                    }
                    className="inline-flex items-center gap-1.5 text-[#9A958B] hover:text-[#F4F0E8] cursor-pointer"
                  >
                    {copiedField === "email" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C8A464]" />
                        <span className="text-[#C8A464]">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY ADDRESS</span>
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={`mailto:${EXECUTIVE_PROFILE.contact.email}`}
                  className="mt-3 block font-display text-2xl sm:text-3xl font-bold text-[#F4F0E8] hover:text-[#C8A464] transition-colors break-all"
                >
                  {EXECUTIVE_PROFILE.contact.email}
                </a>
              </div>

              {/* Direct Telephone */}
              <div className="pb-8 border-b border-[#F4F0E8]/[0.1]">
                <div className="flex items-center justify-between font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464]">
                  <span>DIRECT TELEPHONE (KUWAIT) //</span>
                  <button
                    onClick={() =>
                      copyToClipboard(EXECUTIVE_PROFILE.contact.phone, "phone")
                    }
                    className="inline-flex items-center gap-1.5 text-[#9A958B] hover:text-[#F4F0E8] cursor-pointer"
                  >
                    {copiedField === "phone" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C8A464]" />
                        <span className="text-[#C8A464]">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY NUMBER</span>
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={`tel:${EXECUTIVE_PROFILE.contact.phoneClean}`}
                  className="mt-3 block font-display text-2xl sm:text-3xl font-bold text-[#F4F0E8] hover:text-[#C8A464] transition-colors"
                >
                  {EXECUTIVE_PROFILE.contact.phone}
                </a>
                <p className="mt-1 font-tech text-xs text-[#9A958B]">
                  {EXECUTIVE_PROFILE.location} · {EXECUTIVE_PROFILE.timezone}
                </p>
              </div>
            </div>

            {/* Verified External Links Grid */}
            <div>
              <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#9A958B] mb-4">
                VERIFIED PROFESSIONAL CHANNELS &amp; DOSSIER
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#F4F0E8]/[0.14] divide-y sm:divide-y-0 sm:divide-x divide-[#F4F0E8]/[0.14]">
                <a
                  href={EXECUTIVE_PROFILE.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 flex items-center justify-between font-tech text-xs uppercase tracking-wider text-[#F4F0E8] hover:bg-[#C8A464] hover:text-[#080807] transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={EXECUTIVE_PROFILE.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 flex items-center justify-between font-tech text-xs uppercase tracking-wider text-[#F4F0E8] hover:bg-[#C8A464] hover:text-[#080807] transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={EXECUTIVE_PROFILE.contact.stackoverflow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 flex items-center justify-between font-tech text-xs uppercase tracking-wider text-[#F4F0E8] hover:bg-[#C8A464] hover:text-[#080807] transition-colors"
                >
                  <span>StackOverflow</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={onOpenDossier}
                  className="p-4 flex items-center justify-between font-tech text-xs font-semibold uppercase tracking-wider text-[#C8A464] hover:bg-[#C8A464] hover:text-[#080807] transition-colors cursor-pointer"
                >
                  <span>Print CV</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right 6 Columns: Interactive Executive Dispatch Composer */}
          <div className="lg:col-span-6 py-12 lg:pl-12 flex flex-col justify-between space-y-6">
            <div>
              <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A464]">
                EXECUTIVE BRIEFING DISPATCH //
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#F4F0E8]">
                Select Mandate Subject
              </h3>
            </div>

            <div className="divide-y divide-[#F4F0E8]/[0.1] border border-[#F4F0E8]/[0.14]">
              {DIALOGUE_TOPICS.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full p-4 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#171612] text-[#C8A464] border-l-4 border-l-[#C8A464]"
                        : "bg-[#0B0B09] text-[#D6D1C7] hover:bg-[#12110E]"
                    }`}
                  >
                    <span className="font-tech text-xs uppercase tracking-wider">
                      {topic.code} / {topic.label}
                    </span>
                    <span className="font-tech text-xs">→</span>
                  </button>
                );
              })}
            </div>

            <div className="p-6 bg-[#0D0D0B] border border-[#F4F0E8]/[0.12] space-y-3">
              <div className="font-tech text-[10px] uppercase tracking-[0.16em] text-[#9A958B]">
                SUBJECT: {selectedTopic.subject}
              </div>
              <p className="text-xs sm:text-sm text-[#D6D1C7] whitespace-pre-line leading-relaxed">
                {selectedTopic.template}
              </p>
            </div>

            <a
              href={mailtoHref}
              className="w-full py-4 px-6 bg-[#F4F0E8] text-[#080807] hover:bg-[#C8A464] font-tech text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-between transition-colors"
            >
              <span>TRANSMIT EXECUTIVE INQUIRY VIA EMAIL CLIENT</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Architectural Colophon */}
        <div className="pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-tech text-[11px] uppercase tracking-[0.14em] text-[#9A958B]">
          <div>
            © {new Date().getFullYear()} {EXECUTIVE_PROFILE.name} — HEAD OF DIGITAL TECHNOLOGY, KIB
          </div>
          <div>
            KUWAIT CITY, KUWAIT · ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
}
