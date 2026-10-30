"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUp, Copy, FileText } from "lucide-react";
import { useState } from "react";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { KuwaitTime, PulseDot } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { CornerTicks, Eyebrow, RegMark } from "@/components/ui/SectionHeader";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { openDossier, scrollToSection } from "@/lib/events";
import { copyText } from "@/lib/hooks";
import { EASE_OUT, SPRING } from "@/lib/motion";

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

interface ContactSectionProps {
  index?: string;
}

export default function ContactSection({ index = "08" }: ContactSectionProps) {
  const notify = useToast();
  const [topicId, setTopicId] = useState(DIALOGUE_TOPICS[0].id);
  const topic = DIALOGUE_TOPICS.find((t) => t.id === topicId) ?? DIALOGUE_TOPICS[0];
  const { email, phone, phoneClean, linkedin, github, stackoverflow } = EXECUTIVE_PROFILE.contact;

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(topic.subject)}&body=${encodeURIComponent(topic.template)}`;

  const copy = async (value: string, label: string) => {
    const result = await copyText(value);
    notify(result === "copied" ? `${label} copied` : "Couldn't copy automatically. Please select the text.", result === "copied" ? "success" : "error");
  };

  return (
    <footer id="contact" aria-labelledby="contact-title" className="relative overflow-clip pb-8 pt-28 lg:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-line" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block">
        <div className="shell">
          <div className="relative">
            <RegMark className="absolute -left-[5.5px] -top-[5.5px]" />
            <RegMark className="absolute -right-[5.5px] -top-[5.5px]" />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="site-glow pointer-events-none absolute inset-0 -z-10 rotate-180 opacity-70" />

      <div className="shell">
        <Reveal y={10}>
          <Eyebrow index={index}>Executive connections</Eyebrow>
        </Reveal>
        <h2 id="contact-title" className="mt-7 max-w-[14ch] font-display text-[clamp(3rem,8.4vw,8rem)] leading-[0.96] tracking-[-0.035em] text-fg">
          <SplitReveal text="Initiate an *executive conversation.*" stagger={0.06} />
        </h2>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="max-w-xl text-lede text-fg-3 [&_strong]:font-medium [&_strong]:text-fg">
                Available for discussions with Chief Executive Officers, Boards, Financial Institutions, and Executive Search Partners regarding{" "}
                <strong>CTO / Head of Digital Technology mandates</strong>, <strong>establishing Digital Factories</strong>, and{" "}
                <strong>large-scale banking transformation</strong>.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <dl className="mt-10 border-t border-line">
                <div className="border-b border-line py-6">
                  <dt className="eyebrow text-fg-4">Direct email</dt>
                  <dd className="mt-3 flex items-center justify-between gap-4">
                    <a
                      href={`mailto:${email}`}
                      className="link-sweep min-w-0 font-display text-[clamp(1.3rem,2.1vw,1.85rem)] leading-tight text-fg transition-colors [overflow-wrap:anywhere] hover:text-accent"
                    >
                      {email}
                    </a>
                    <CopyButton onClick={() => copy(email, "Email address")} label="Copy email address" />
                  </dd>
                </div>
                <div className="border-b border-line py-6">
                  <dt className="eyebrow text-fg-4">Direct line · Kuwait</dt>
                  <dd className="mt-3 flex items-center justify-between gap-4">
                    <span className="min-w-0">
                      <a
                        href={`tel:${phoneClean}`}
                        className="link-sweep numeric font-display text-[clamp(1.3rem,2.1vw,1.85rem)] leading-tight text-fg transition-colors hover:text-accent"
                      >
                        {phone}
                      </a>
                      <span className="mt-1.5 flex items-center gap-2 text-[12.5px] text-fg-3">
                        <PulseDot />
                        <span>
                          <KuwaitTime /> in {EXECUTIVE_PROFILE.location} · {EXECUTIVE_PROFILE.timezone}
                        </span>
                      </span>
                    </span>
                    <CopyButton onClick={() => copy(phone, "Phone number")} label="Copy phone number" />
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.12} className="mt-8 flex flex-wrap gap-2">
              {[
                { href: linkedin, label: "LinkedIn" },
                { href: github, label: "GitHub · @ahmedmshaker" },
                { href: stackoverflow, label: "Stack Overflow" },
              ].map((link) => (
                <Button key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm" icon={<ArrowGlyph className="size-3.5 text-accent" />}>
                  {link.label}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={openDossier} iconLeading={<FileText className="size-3.5" strokeWidth={1.75} />}>
                Printable CV dossier
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="relative border border-line-2 bg-surface/60">
              <CornerTicks className="-inset-px" />
              <div className="border-b border-line p-6 sm:p-8">
                <div className="eyebrow text-accent">Direct inquiry composer</div>
                <h3 className="mt-3 font-display text-[1.6rem] leading-tight text-fg">Choose a conversation topic</h3>
                <LayoutGroup id="contact-topics">
                  <div role="radiogroup" aria-label="Conversation topic" className="mt-6 space-y-1.5">
                    {DIALOGUE_TOPICS.map((t) => {
                      const selected = t.id === topic.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setTopicId(t.id)}
                          className={cn(
                            "relative flex w-full cursor-pointer items-center gap-4 rounded-[6px] px-4 py-3.5 text-left text-[14px] transition-colors duration-200",
                            selected ? "text-fg" : "text-fg-3 hover:text-fg"
                          )}
                        >
                          {selected && <motion.span layoutId="topic-active" transition={SPRING} className="absolute inset-0 rounded-[6px] border border-accent/40 bg-accent/[0.07]" />}
                          <span className={cn("numeric relative font-mono text-[11px]", selected ? "text-accent" : "text-fg-4")}>{t.code}</span>
                          <span className="relative">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </LayoutGroup>
              </div>

              <div className="p-6 sm:p-8">
                <div className="relative -rotate-[0.6deg] overflow-hidden rounded-[4px] bg-[var(--c-letter)] p-6 text-[var(--c-letter-fg)] shadow-float ring-1 ring-[var(--c-letter-rule)]">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-accent/70" />
                  <div className="border-b border-[var(--c-letter-rule)] pb-3 font-mono text-[10.5px] leading-relaxed text-[var(--c-letter-muted)]">
                    <div>To: {email}</div>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div key={topic.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        Subject: {topic.subject}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={topic.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
                      exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                      className="mt-4 whitespace-pre-line font-display text-[15.5px] leading-[1.65]"
                    >
                      {topic.template}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href={mailtoHref} magnetic size="lg" icon={<ArrowGlyph />}>
                    Compose executive email
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => copy(`Subject: ${topic.subject}\n\n${topic.template}`, "Message")}
                    iconLeading={<Copy className="size-4" strokeWidth={1.75} />}
                  >
                    Copy message
                  </Button>
                </div>
                <p className="mt-4 text-[12px] leading-relaxed text-fg-4">No mail app on this device? Copy the message and send it from any inbox.</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t border-line pt-8 text-[12.5px] text-fg-3 lg:flex-row lg:items-center lg:justify-between">
          <span>© {new Date().getFullYear()} {EXECUTIVE_PROFILE.name} — Executive Manager, Head of Digital Technology, KIB</span>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <li>
                <Link href="/blog" className="link-sweep transition-colors hover:text-fg">
                  Writing
                </Link>
              </li>
              <li>
                <a href="/blog/rss.xml" className="link-sweep transition-colors hover:text-fg">
                  RSS
                </a>
              </li>
              <li>
                <button type="button" onClick={openDossier} className="link-sweep cursor-pointer transition-colors hover:text-fg">
                  Executive CV
                </button>
              </li>
              <li>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="link-sweep transition-colors hover:text-fg">
                  LinkedIn
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("hero")}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-2 px-3.5 py-1.5 text-fg-2 transition-colors hover:border-line-3 hover:text-fg"
                >
                  Back to top
                  <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.75} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div aria-hidden="true" className="mt-14 select-none overflow-hidden">
        <div className="shell">
          <div className="translate-y-[18%] whitespace-nowrap font-display text-[clamp(3rem,13.2vw,12.5rem)] leading-[0.8] tracking-[-0.045em] text-transparent [-webkit-text-stroke:1px_var(--c-line-3)]">
            Ahmed Shaker
          </div>
        </div>
      </div>
    </footer>
  );
}

function CopyButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line-2 px-3.5 text-[12.5px] text-fg-3 transition-colors hover:border-line-3 hover:text-fg"
    >
      <Copy className="size-3.5" strokeWidth={1.75} />
      Copy
    </button>
  );
}
