"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { EXECUTIVE_PROFILE, SECTION_COPY } from "@/data/portfolioData";
import { KuwaitTime } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { openDossier, scrollToSection } from "@/lib/events";
import { copyText } from "@/lib/hooks";
import { CONTACT_ID, TOP_SECTION_ID } from "@/lib/site";
import { FadeUp } from "./motion";
import { Band, ChevronLink, Emphasis, Heading, Wrap } from "./primitives";

const TOPICS = [
  {
    id: "executive-role",
    label: "An executive technology mandate",
    subject: "Executive Technology Leadership Inquiry — Ahmed Shaker",
    template:
      "Hello Ahmed,\n\nI reviewed your executive portfolio and your track record establishing the Digital Factories at Kuwait International Bank (KIB) and Warba Bank. I would like to schedule a confidential conversation regarding an executive technology leadership mandate.",
  },
  {
    id: "digital-factory",
    label: "Building a banking Digital Factory",
    subject: "Digital Factory & Banking Transformation Advisory — Ahmed Shaker",
    template:
      "Hello Ahmed,\n\nWe are exploring establishing or scaling an in-house Digital Factory and would value discussing your experience architecting the technology roadmaps, stacks, and engineering teams at KIB and Warba Bank.",
  },
  {
    id: "architecture-baas",
    label: "Architecture & BaaS strategy",
    subject: "Digital Banking Architecture & Platform Strategy — Ahmed Shaker",
    template:
      "Hello Ahmed,\n\nI would love to connect regarding digital banking platform architecture, cross-platform mobile/web delivery, and embedded finance / BIN Sponsorship ecosystems.",
  },
];

/** The close: one place to start a conversation, then the footer. */
export default function Contact() {
  const copy = SECTION_COPY.contact;
  const notify = useToast();
  const [topicId, setTopicId] = useState(TOPICS[0].id);
  const topic = TOPICS.find((entry) => entry.id === topicId) ?? TOPICS[0];
  const { email, phone, phoneClean, linkedin, github, stackoverflow } = EXECUTIVE_PROFILE.contact;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(topic.subject)}&body=${encodeURIComponent(topic.template)}`;

  const copyValue = async (value: string, label: string) => {
    const result = await copyText(value);
    notify(result === "copied" ? `${label} copied` : "Couldn't copy automatically. Please select the text.", result === "copied" ? "success" : "error");
  };

  return (
    <Band as="footer" id={CONTACT_ID} tone="dark" labelledBy="contact-title" className="overflow-clip">
      <Wrap className="relative pt-[clamp(5rem,9vw,8rem)]">
        <Heading id="contact-title" kicker={copy.eyebrow} title={<Emphasis text={copy.title} />} sub={copy.subtitle} align="center" />

        <FadeUp className="mx-auto mt-12 max-w-[46rem] lg:mt-16">
          <div role="radiogroup" aria-label="Conversation topic" className="flex flex-wrap justify-center gap-2">
            {TOPICS.map((entry) => {
              const selected = entry.id === topic.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTopicId(entry.id)}
                  className={cn(
                    "relative h-10 cursor-pointer rounded-full px-4 text-[14px] font-medium transition-colors duration-300",
                    selected ? "text-l-bg" : "bg-l-card text-l-fg-2 hover:bg-l-card-2"
                  )}
                >
                  {selected && <motion.span layoutId="topic-pill" transition={{ type: "spring", stiffness: 380, damping: 34 }} className="absolute inset-0 rounded-full bg-l-fg" />}
                  <span className="relative">{entry.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={mailto} className="l-btn">
              Compose the email
            </a>
            <button type="button" onClick={() => copyValue(`Subject: ${topic.subject}\n\n${topic.template}`, "Message")} className="l-btn l-btn-plain">
              <Copy aria-hidden="true" className="size-4" strokeWidth={2} />
              Copy the message
            </button>
          </div>
        </FadeUp>

        <FadeUp className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-24">
          <ContactCard label="Email" onCopy={() => copyValue(email, "Email address")} copyLabel="Copy email address">
            <a href={`mailto:${email}`} className="t-h4 break-all text-l-fg transition-colors hover:text-l-link">
              {email}
            </a>
          </ContactCard>
          <ContactCard
            label={
              <>
                Phone · <KuwaitTime /> in Kuwait City
              </>
            }
            onCopy={() => copyValue(phone, "Phone number")}
            copyLabel="Copy phone number"
          >
            <a href={`tel:${phoneClean}`} className="t-h4 numeric text-l-fg transition-colors hover:text-l-link">
              {phone}
            </a>
          </ContactCard>
        </FadeUp>

        <FadeUp className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <ChevronLink href={linkedin} external className="t-body">
            LinkedIn
          </ChevronLink>
          <ChevronLink href={github} external className="t-body">
            GitHub
          </ChevronLink>
          <ChevronLink href={stackoverflow} external className="t-body">
            Stack Overflow
          </ChevronLink>
          <ChevronLink onClick={openDossier} dialog className="t-body">
            Executive CV
          </ChevronLink>
        </FadeUp>

        <div className="mt-24 flex flex-col gap-6 border-t border-l-line py-8 text-[13px] text-l-fg-3 lg:mt-32 lg:flex-row lg:items-center lg:justify-between">
          <span>
            © {new Date().getFullYear()} {EXECUTIVE_PROFILE.name} · Executive Manager, Head of Digital Technology, KIB
          </span>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <li>
                <Link href="/blog" className="transition-colors hover:text-l-fg">
                  Writing
                </Link>
              </li>
              <li>
                <a href="/blog/rss.xml" className="transition-colors hover:text-l-fg">
                  RSS
                </a>
              </li>
              <li>
                <button type="button" onClick={openDossier} className="cursor-pointer transition-colors hover:text-l-fg">
                  Executive CV
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection(TOP_SECTION_ID)}
                  className="group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-l-card px-3.5 text-l-fg-2 transition-colors hover:bg-l-card-2 hover:text-l-fg"
                >
                  Back to top
                  <ArrowUp aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={2} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </Wrap>
      <div aria-hidden="true" className="relative select-none overflow-hidden">
        <div className="mx-auto max-w-[90rem] translate-y-[22%] whitespace-nowrap px-5 text-center font-head text-[clamp(3.5rem,15.5vw,14rem)] font-bold leading-[0.8] tracking-[-0.06em] text-l-card-2">
          {EXECUTIVE_PROFILE.name}
        </div>
      </div>
    </Band>
  );
}

function ContactCard({ label, onCopy, copyLabel, children }: { label: ReactNode; onCopy: () => void; copyLabel: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[24px] bg-l-card p-6 sm:p-7">
      <div className="min-w-0">
        <p className="t-small font-medium text-l-fg-3">{label}</p>
        <div className="mt-1.5">{children}</div>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copyLabel}
        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-l-card-2 text-l-fg-2 transition-colors hover:text-l-fg"
      >
        <Copy className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}
