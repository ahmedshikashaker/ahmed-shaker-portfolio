"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Copy,
  Check,
  FileText,
  Building2,
  ExternalLink,
  Send,
} from "lucide-react";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";

interface ContactSectionProps {
  onOpenDossier: () => void;
}

const DIALOGUE_TOPICS = [
  {
    id: "executive-role",
    label: "CTO / VP / Head of Technology Mandate",
    subject: "Executive Technology Leadership Inquiry — Ahmed Shaker",
    template:
      "Hello Ahmed,\n\nI reviewed your executive portfolio and your track record establishing the Digital Factories at Kuwait International Bank (KIB) and Warba Bank. I would like to schedule a confidential conversation regarding an executive technology leadership mandate.",
  },
  {
    id: "digital-factory",
    label: "Establishing a Banking Digital Factory",
    subject: "Digital Factory & Banking Transformation Advisory — Ahmed Shaker",
    template:
      "Hello Ahmed,\n\nWe are exploring establishing or scaling an in-house Digital Factory and would value discussing your experience architecting the technology roadmaps, stacks, and engineering teams at KIB and Warba Bank.",
  },
  {
    id: "architecture-baas",
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
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 border-t border-white/[0.08] bg-gradient-to-b from-[#05070b] via-[#090e1a] to-[#040609] overflow-hidden"
    >
      {/* Ambient Gold Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-amber-500/[0.07] blur-[150px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Executive Call to Action & Verified Channels (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-200 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Connections &amp; Advisory</span>
              </div>

              <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.08]">
                Initiate an{" "}
                <span className="font-[family-name:var(--font-serif)] italic font-normal text-gold-gradient">
                  Executive Dialogue.
                </span>
              </h2>

              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Available for conversations with Chief Executive Officers, Boards, Financial Institutions, and Executive Search Partners regarding <strong className="text-white">Chief Technology Officer / Head of Digital Technology mandates</strong>, <strong className="text-white">establishing Digital Factories</strong>, and <strong className="text-white">large-scale banking transformation</strong>.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Card */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/[0.09] hover:border-amber-400/40 transition-all flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-amber-300">
                    Direct Executive Email
                  </span>
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <a
                    href={`mailto:${EXECUTIVE_PROFILE.contact.email}`}
                    className="text-sm sm:text-base font-bold text-white hover:text-amber-200 break-all"
                  >
                    {EXECUTIVE_PROFILE.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() =>
                      copyToClipboard(EXECUTIVE_PROFILE.contact.email, "email")
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
                  >
                    {copiedField === "email" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied to clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Phone & Location Card */}
              <div className="p-5 rounded-2xl bg-[#0b101d] border border-white/[0.09] hover:border-emerald-400/40 transition-all flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-emerald-300">
                    Direct Line · Kuwait City
                  </span>
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <a
                    href={`tel:${EXECUTIVE_PROFILE.contact.phoneClean}`}
                    className="text-base sm:text-lg font-bold text-white hover:text-emerald-200"
                  >
                    {EXECUTIVE_PROFILE.contact.phone}
                  </a>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {EXECUTIVE_PROFILE.location} ({EXECUTIVE_PROFILE.timezone})
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() =>
                      copyToClipboard(EXECUTIVE_PROFILE.contact.phone, "phone")
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
                  >
                    {copiedField === "phone" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Phone copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copy Number</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Verified Professional Profiles */}
            <div className="pt-2">
              <div className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-slate-400 mb-3">
                Verified Professional &amp; Technical Profiles
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={EXECUTIVE_PROFILE.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] hover:border-amber-400/40 transition-all"
                >
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </a>

                <a
                  href={EXECUTIVE_PROFILE.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] hover:border-amber-400/40 transition-all"
                >
                  <span>GitHub (@ahmedmshaker)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </a>

                <a
                  href={EXECUTIVE_PROFILE.contact.stackoverflow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] hover:border-amber-400/40 transition-all"
                >
                  <span>Stack Overflow</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </a>

                <button
                  onClick={onOpenDossier}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-400/15 hover:bg-amber-400/25 text-amber-200 border border-amber-400/35 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Printable CV Dossier</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Executive Briefing Launcher (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0f1d] border border-amber-400/30 border-glow-gold space-y-5">
              <div>
                <span className="text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-amber-300">
                  Direct Executive Dispatch
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Select a Conversation Topic
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a focus area below to pre-configure a direct executive email inquiry.
                </p>
              </div>

              <div className="space-y-2">
                {DIALOGUE_TOPICS.map((topic) => {
                  const isSelected = selectedTopic.id === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-400/15 text-amber-200 border-amber-400/50"
                          : "bg-white/[0.03] text-slate-300 border-white/[0.07] hover:border-white/20"
                      }`}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-[#060911] border border-white/[0.07] space-y-2">
                <div className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-slate-400">
                  Subject: {selectedTopic.subject}
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedTopic.template}
                </p>
              </div>

              <a
                href={mailtoHref}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(212,175,55,0.25)]"
              >
                <Send className="w-4 h-4" />
                <span>Launch Executive Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Colophon */}
        <div className="mt-20 pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">{EXECUTIVE_PROFILE.name}</span>
            <span>·</span>
            <span>Head of Digital Technology, Kuwait International Bank (KIB)</span>
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[11px]">
            Engineered with Next.js, TypeScript, Tailwind CSS &amp; Framer Motion · Kuwait City
          </div>
        </div>
      </div>
    </footer>
  );
}
