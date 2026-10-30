"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { DIGITAL_FACTORIES, DIGITAL_FACTORY_TOPOLOGY, type DigitalFactoryCaseStudy } from "@/data/portfolioData";
import { ArrowGlyph } from "@/components/ui/Button";
import { Chip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { CornerTicks, Eyebrow, Section, SectionHeader } from "@/components/ui/SectionHeader";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { cn } from "@/lib/cn";
import { emit, PORTFOLIO_EVENTS, scrollToSection } from "@/lib/events";
import { pad2 } from "@/lib/format";
import { useWindowEvent } from "@/lib/hooks";
import { EASE_OUT, SPRING, swap } from "@/lib/motion";

type FactoryId = DigitalFactoryCaseStudy["id"];

/** Chronological order: Factory I (Warba) → Factory II (KIB). */
const ORDER: { id: FactoryId; roman: string; tone: "signal" | "accent" }[] = [
  { id: "warba", roman: "I", tone: "signal" },
  { id: "kib", roman: "II", tone: "accent" },
];

/** Factory "key products" that also have a page in the platform showroom. */
const SHOWROOM_LINKS: Record<string, string> = {
  "KIB Mobile (Retail)": "kib-mobile",
  "KIB Corporate": "kib-corporate",
  "KIB Aqari": "kib-aqari",
  "KIB Invest": "kib-invest",
  "BuyNow by KIB": "kib-buynow",
  "Remittance & WAGE by KIB": "kib-remittance-wage",
  "BIN Sponsorship & BaaS": "kib-bin-sponsorship",
  "Warba Bank Mobile App": "warba-mobile",
  "Fayez & Fayez Admin": "warba-fayez",
  "Hassala Kids": "warba-hassala-kids",
};

export default function DigitalFactoriesSection() {
  const [factoryId, setFactoryId] = useState<FactoryId>("kib");
  useWindowEvent<string>(PORTFOLIO_EVENTS.selectFactory, (id) => {
    if (id === "kib" || id === "warba") setFactoryId(id);
  });
  const factory = DIGITAL_FACTORIES.find((f) => f.id === factoryId) ?? DIGITAL_FACTORIES[0];
  const tone = ORDER.find((o) => o.id === factory.id)?.tone ?? "accent";

  return (
    <Section id="digital-factories" labelledBy="factories-title" className="py-28 lg:py-40">
      <div className="shell">
        <SectionHeader
          index="02"
          label="Signature career differentiator"
          titleId="factories-title"
          title="Building *two banking digital factories* from the ground up."
          lede={
            <>
              At both <strong>Warba Bank</strong> and <strong>Kuwait International Bank (KIB)</strong>, I was one of the core leaders
              responsible for establishing their internal Digital Factories from scratch—defining strategic roadmaps, technology stacks,
              architectural standards, CI/CD governance, and engineering team structures.
            </>
          }
        />

        <Reveal className="mt-16 lg:mt-24">
          <FactorySelector value={factoryId} onChange={setFactoryId} />
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={factory.id} variants={swap} initial="initial" animate="animate" exit="exit">
            <FactoryDossier factory={factory} tone={tone} />
          </motion.div>
        </AnimatePresence>

        <OperatingModel />
      </div>
    </Section>
  );
}

function FactorySelector({ value, onChange }: { value: FactoryId; onChange: (id: FactoryId) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const next = (index + 1) % ORDER.length;
    refs.current[next]?.focus();
    onChange(ORDER[next].id);
  };

  const selectedIndex = ORDER.findIndex((o) => o.id === value);

  return (
    <div>
      <div role="radiogroup" aria-label="Choose a digital factory to inspect" className="grid gap-px border border-line bg-line md:grid-cols-2">
        {ORDER.map((entry, index) => {
          const f = DIGITAL_FACTORIES.find((x) => x.id === entry.id);
          if (!f) return null;
          const selected = entry.id === value;
          return (
            <button
              key={entry.id}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(entry.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className="group relative flex min-h-[20rem] cursor-pointer flex-col overflow-hidden bg-bg p-7 text-left outline-offset-[-3px] sm:p-9 lg:min-h-[25rem] lg:p-11"
            >
              {selected && <motion.span layoutId="factory-plate" transition={SPRING} className="absolute inset-0 bg-surface" />}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -right-4 -top-16 select-none font-display text-[12rem] leading-none text-transparent transition-[-webkit-text-stroke-color] duration-500 [-webkit-text-stroke-width:1px] lg:text-[15.5rem]",
                  selected
                    ? entry.tone === "accent"
                      ? "[-webkit-text-stroke-color:var(--c-accent-deep)]"
                      : "[-webkit-text-stroke-color:color-mix(in_oklab,var(--c-signal)_55%,transparent)]"
                    : "[-webkit-text-stroke-color:var(--c-line-2)]"
                )}
              >
                {entry.roman}
              </span>
              <span className="eyebrow relative flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={entry.tone === "accent" ? "text-accent" : "text-signal"}>Digital factory {entry.roman}</span>
                <span className="text-fg-4">· {f.period}</span>
              </span>
              <span className="relative mt-auto block pt-20 font-display text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.04] text-fg">
                {f.institution}
              </span>
              <span className="relative mt-2 block text-[14px] text-fg-3">
                {f.role} · {f.location}
              </span>
              <span
                className={cn(
                  "relative mt-7 inline-flex items-center gap-2 text-[13px] transition-colors",
                  selected ? "text-fg" : "text-fg-3 group-hover:text-fg"
                )}
              >
                {selected ? "Now inspecting" : "Inspect this factory"}
                <ArrowGlyph direction="down-right" className="size-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Career progression axis: Factory I → Factory II */}
      <div aria-hidden="true" className="relative mt-5 grid grid-cols-2">
        <div className="absolute inset-x-0 top-[5px] h-px bg-line-2" />
        <motion.div
          className="absolute top-[4px] h-[3px] w-1/2 bg-accent"
          initial={false}
          animate={{ x: selectedIndex === 0 ? "0%" : "100%" }}
          transition={SPRING}
          style={{ left: 0 }}
        />
        {["Mar 2019", "Jun 2022", "Present"].map((label, i) => (
          <span
            key={label}
            className={cn("eyebrow numeric absolute top-4 text-[10px] text-fg-4", i === 0 && "left-0", i === 1 && "left-1/2 -translate-x-1/2", i === 2 && "right-0")}
          >
            {label}
          </span>
        ))}
        {[0, 50, 100].map((pct) => (
          <span key={pct} className="absolute top-0 size-[11px] -translate-x-1/2 rounded-full border border-line-3 bg-bg" style={{ left: `${pct}%` }} />
        ))}
        <span className="eyebrow col-span-2 mt-12 text-center text-[10px] text-fg-4">Android Chapter Lead → Head of Digital Technology</span>
      </div>
    </div>
  );
}

function FactoryDossier({ factory, tone }: { factory: DigitalFactoryCaseStudy; tone: "accent" | "signal" }) {
  const stacks = [
    { label: "Mobile & Web", items: factory.technologyFoundation.mobileAndWeb },
    { label: "Backend & Data", items: factory.technologyFoundation.backendAndData },
    { label: "DevOps & Governance", items: factory.technologyFoundation.devopsAndGovernance },
  ];

  return (
    <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-5">
        <Eyebrow>{factory.factoryName}</Eyebrow>
        <p className="mt-6 font-display text-[1.6rem] leading-[1.35] text-fg">{factory.executiveSummary}</p>
        <p className="mt-6 text-[15px] leading-[1.75] text-fg-3">{factory.strategicContext}</p>

        <div className="relative mt-8 border border-line-2 bg-surface/50 p-6">
          <CornerTicks className="-inset-px" />
          <div className={cn("eyebrow", tone === "accent" ? "text-accent" : "text-signal")}>Architectural mandate</div>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-fg-2">{factory.architecturalMandate}</p>
          <div className="eyebrow mt-6 text-fg-4">Organisational scope &amp; attribution</div>
          <p className="mt-2 text-[13.5px] leading-[1.7] text-fg-3">{factory.organizationScope}</p>
        </div>
      </div>

      <div className="lg:col-span-7">
        <h3 className="eyebrow text-fg-3">Direct leadership &amp; architectural contributions</h3>
        <ol className="mt-5 border-t border-line">
          {factory.myDirectContribution.map((item, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-line py-4">
              <span className={cn("numeric font-mono text-[12px] leading-[1.7]", tone === "accent" ? "text-accent" : "text-signal")}>{pad2(i + 1)}</span>
              <span className="text-[15px] leading-[1.7] text-fg-2">{item}</span>
            </li>
          ))}
        </ol>

        <h3 className="eyebrow mt-12 text-fg-3">Technology foundation</h3>
        <div className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-3">
          {stacks.map((stack) => (
            <div key={stack.label} className="bg-bg p-5">
              <div className="eyebrow text-[10px] text-fg-4">{stack.label}</div>
              <ul className="mt-3 space-y-2">
                {stack.items.map((item) => (
                  <li key={item} className="flex gap-2 text-[13px] leading-snug text-fg-2">
                    <span aria-hidden="true" className={cn("mt-[7px] size-1 shrink-0 rounded-full", tone === "accent" ? "bg-accent" : "bg-signal")} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <h3 className="eyebrow text-fg-3">
            Key products &amp; capabilities <span className="numeric text-fg-4">({factory.keyProductsDelivered.length})</span>
          </h3>
          <button
            type="button"
            onClick={() => scrollToSection("products")}
            className="link-sweep inline-flex cursor-pointer items-center gap-1.5 text-[13px] text-accent"
          >
            Open the showroom <ArrowGlyph className="size-3.5" />
          </button>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {factory.keyProductsDelivered.map((product) => {
            const productId = SHOWROOM_LINKS[product.name];
            return (
              <li key={product.name}>
                <button
                  type="button"
                  onClick={() => (productId ? emit(PORTFOLIO_EVENTS.selectProduct, productId) : scrollToSection("products"))}
                  className="group flex h-full w-full cursor-pointer flex-col border border-line bg-surface/40 p-4 text-left transition-[border-color,background-color] duration-300 hover:border-line-3 hover:bg-surface-2/70"
                >
                  <span className="eyebrow text-[10px] text-fg-4">{product.category}</span>
                  <span className="mt-2 flex items-start justify-between gap-3">
                    <span className="text-[15px] font-medium text-fg">{product.name}</span>
                    <ArrowGlyph className="mt-0.5 size-3.5 text-fg-4 group-hover:text-accent" />
                  </span>
                  <span className="mt-1.5 text-[13px] leading-snug text-fg-3">{product.summary}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function OperatingModel() {
  const [active, setActive] = useState(0);
  const tabsId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const node = DIGITAL_FACTORY_TOPOLOGY[active];
  const count = DIGITAL_FACTORY_TOPOLOGY.length;

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : (index + (forward ? 1 : -1) + count) % count;
    refs.current[next]?.focus();
    setActive(next);
  };

  return (
    <div className="mt-28 lg:mt-40">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
        <div className="lg:col-span-8">
          <Reveal y={10}>
            <Eyebrow index="02 · B">Factory operating model</Eyebrow>
          </Reveal>
          <h3 className="mt-6 font-display text-display-3 text-fg">
            <SplitReveal text="The factory, end to end, *stage by stage.*" />
          </h3>
        </div>
        <Reveal delay={0.1} className="lg:col-span-4">
          <p className="text-[15px] leading-relaxed text-fg-3">
            Select any architectural stage to inspect how I structured and governed it at KIB &amp; Warba Bank.
          </p>
        </Reveal>
      </div>

      <Reveal className="relative mt-12">
        <div role="tablist" aria-label="Digital factory stages" className="relative grid gap-2 md:grid-cols-5 md:gap-0">
          {/* Pipeline rail with a travelling packet */}
          <div aria-hidden="true" className="pointer-events-none absolute left-[10%] right-[10%] top-[36px] hidden h-px overflow-hidden bg-line-2 md:block">
            <span className="absolute inset-y-0 left-0 w-full animate-travel">
              <span className="absolute right-0 top-0 h-px w-24 bg-gradient-to-r from-transparent to-accent" />
              <span className="absolute -right-[3px] -top-[2px] size-[5px] rounded-full bg-accent shadow-[0_0_10px_2px_var(--c-accent)]" />
            </span>
          </div>
          {DIGITAL_FACTORY_TOPOLOGY.map((stage, index) => {
            const selected = index === active;
            return (
              <button
                key={stage.id}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                id={`${tabsId}-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${tabsId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  "group relative flex cursor-pointer items-start gap-4 border px-4 py-4 text-left transition-colors duration-300 md:flex-col md:items-center md:border-0 md:px-3 md:pb-5 md:pt-3 md:text-center",
                  selected ? "border-accent/40 bg-surface/60 md:bg-transparent" : "border-line"
                )}
              >
                <span className="relative grid size-12 shrink-0 place-items-center">
                  {selected && <motion.span layoutId="stage-halo" transition={SPRING} className="absolute inset-0 rounded-full border border-accent/50 bg-accent/10" />}
                  <span
                    className={cn(
                      "relative size-3 rounded-full border transition-colors duration-300",
                      selected ? "border-accent bg-accent" : "border-line-3 bg-bg group-hover:border-fg-3"
                    )}
                  />
                </span>
                <span className="min-w-0 md:mt-2">
                  <span className={cn("eyebrow block text-[10px]", selected ? "text-accent" : "text-fg-4")}>{stage.stageCode}</span>
                  <span className={cn("mt-1.5 block font-display text-[1.12rem] leading-snug transition-colors", selected ? "text-fg" : "text-fg-2 group-hover:text-fg")}>
                    {stage.title}
                  </span>
                  <span className="mt-1 block text-[12px] leading-snug text-fg-4">{stage.subtitle}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${active}`} className="relative mt-8 border border-line-2 bg-surface/40">
        <CornerTicks className="-inset-px" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
            className="grid lg:grid-cols-12"
          >
            <div className="p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <div className="eyebrow flex items-start gap-3 text-fg-3">
                <span className="numeric shrink-0 whitespace-nowrap text-accent">
                  {pad2(active + 1)} / {pad2(count)}
                </span>
                <span aria-hidden="true" className="mt-[7px] h-px w-6 shrink-0 bg-line-3" />
                <span>{node.subtitle}</span>
              </div>
              <h4 className="mt-5 font-display text-[1.9rem] leading-tight text-fg">{node.title}</h4>
              <p className="mt-4 text-[15px] leading-[1.75] text-fg-2">{node.architecturalRole}</p>
              <div className="eyebrow mt-8 text-[10px] text-fg-4">Core engineering standards enforced</div>
              <ul className="mt-3 space-y-3">
                {node.keyStandards.map((standard) => (
                  <li key={standard} className="flex gap-3 text-[14px] leading-relaxed text-fg-2">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={1.75} />
                    {standard}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line p-6 sm:p-8 lg:col-span-7 lg:border-l lg:border-t-0 lg:p-10">
              <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
                <div className="bg-bg p-5">
                  <div className="eyebrow text-[10px] text-accent">KIB · Digital Factory II</div>
                  <p className="mt-3 text-[14px] leading-[1.7] text-fg-2">{node.kibImplementation}</p>
                </div>
                <div className="bg-bg p-5">
                  <div className="eyebrow text-[10px] text-signal">Warba · “Al-Wateen” Factory I</div>
                  <p className="mt-3 text-[14px] leading-[1.7] text-fg-2">{node.warbaImplementation}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="eyebrow mr-1 text-[10px] text-fg-4">Stage stack</span>
                {node.stackBadges.map((badge) => (
                  <Chip key={badge} tone="mono">
                    {badge}
                  </Chip>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
                <button
                  type="button"
                  onClick={() => setActive((active - 1 + count) % count)}
                  className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-fg-3 transition-colors hover:text-fg"
                >
                  <span aria-hidden="true">←</span> Previous stage
                </button>
                <button
                  type="button"
                  onClick={() => setActive((active + 1) % count)}
                  className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-fg-3 transition-colors hover:text-fg"
                >
                  Next stage <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
