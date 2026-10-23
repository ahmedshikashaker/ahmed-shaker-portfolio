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
      className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[#0f172a]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 6 Columns: Direct Coordinates */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">
                07 · Executive Connections
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 tracking-tight leading-[1.15]">
                Initiate an{" "}
                <span className="font-editorial italic font-normal text-[#dfc490]">
                  Executive Conversation.
                </span>
              </h2>
              <p className="text-base text-slate-300 leading-[1.75]">
                Available for discussions with Chief Executive Officers, Boards, Financial Institutions, and Executive Search Partners regarding{" "}
                <strong className="text-slate-100">CTO / Head of Digital Technology mandates</strong>,{" "}
                <strong className="text-slate-100">establishing Digital Factories</strong>, and{" "}
                <strong className="text-slate-100">large-scale banking transformation</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Card */}
              <div className="p-5 rounded-2xl bg-[#131c31] border border-slate-200/[0.09] space-y-3">
                <div className="flex items-center justify-between text-xs font-tech text-[#dfc490]">
                  <span>Direct Email</span>
                  <button
                    onClick={() =>
                      copyToClipboard(EXECUTIVE_PROFILE.contact.email, "email")
                    }
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3.5 h-3.5 text-[#5eead4]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedField === "email" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <a
                  href={`mailto:${EXECUTIVE_PROFILE.contact.email}`}
                  className="block text-sm sm:text-base font-semibold text-slate-100 hover:text-[#dfc490] break-all"
                >
                  {EXECUTIVE_PROFILE.contact.email}
                </a>
              </div>

              {/* Phone Card */}
              <div className="p-5 rounded-2xl bg-[#131c31] border border-slate-200/[0.09] space-y-3">
                <div className="flex items-center justify-between text-xs font-tech text-[#5eead4]">
                  <span>Direct Line · Kuwait</span>
                  <button
                    onClick={() =>
                      copyToClipboard(EXECUTIVE_PROFILE.contact.phone, "phone")
                    }
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-3.5 h-3.5 text-[#5eead4]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedField === "phone" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <a
                  href={`tel:${EXECUTIVE_PROFILE.contact.phoneClean}`}
                  className="block text-base font-semibold text-slate-100 hover:text-[#dfc490]"
                >
                  {EXECUTIVE_PROFILE.contact.phone}
                </a>
                <p className="text-xs text-slate-400">
                  {EXECUTIVE_PROFILE.location} ({EXECUTIVE_PROFILE.timezone})
                </p>
              </div>
            </div>

            {/* Verified Profiles */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <a
                href={EXECUTIVE_PROFILE.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#131c31] hover:bg-[#182338] text-slate-200 border border-slate-200/[0.09] transition-colors"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#dfc490]" />
              </a>
              <a
                href={EXECUTIVE_PROFILE.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#131c31] hover:bg-[#182338] text-slate-200 border border-slate-200/[0.09] transition-colors"
              >
                <span>GitHub (@ahmedmshaker)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#dfc490]" />
              </a>
              <a
                href={EXECUTIVE_PROFILE.contact.stackoverflow}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#131c31] hover:bg-[#182338] text-slate-200 border border-slate-200/[0.09] transition-colors"
              >
                <span>Stack Overflow</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#dfc490]" />
              </a>
              <button
                onClick={onOpenDossier}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#182338] hover:bg-[#1e2b45] text-[#dfc490] border border-[#d4b982]/30 transition-colors cursor-pointer"
              >
                <span>Printable CV Dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right 6 Columns: Inquiry Composer */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#131c31] border border-slate-200/[0.1] space-y-5">
            <div>
              <div className="text-xs font-tech text-[#dfc490]">
                Direct Inquiry Composer
              </div>
              <h3 className="mt-1 text-xl font-bold text-slate-100">
                Select Conversation Topic
              </h3>
            </div>

            <div className="space-y-2">
              {DIALOGUE_TOPICS.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full px-4 py-3 rounded-xl text-left text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#1c2942] text-[#dfc490] border-[#d4b982]/45 font-semibold"
                        : "bg-[#0f172a]/60 text-slate-300 border-slate-200/[0.07] hover:bg-[#182338]"
                    }`}
                  >
                    {topic.code} · {topic.label}
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a]/80 border border-slate-200/[0.07] space-y-2">
              <div className="text-[11px] font-tech text-slate-400">
                Subject: {selectedTopic.subject}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {selectedTopic.template}
              </p>
            </div>

            <a
              href={mailtoHref}
              className="w-full py-3.5 px-6 rounded-xl bg-[#dfc490] text-slate-950 hover:bg-[#e8d1a4] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Compose Executive Email</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {EXECUTIVE_PROFILE.name} — Head of Digital Technology, KIB
          </div>
          <div>Kuwait City, Kuwait</div>
        </div>
      </div>
    </footer>
  );
}
