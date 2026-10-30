"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { FileText } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { DIGITAL_FACTORIES, EXECUTIVE_METRICS, SELECTED_PRODUCTS } from "@/data/portfolioData";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";
import { KuwaitTime, PulseDot } from "@/components/ui/primitives";
import { CornerTicks } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { emit, openDossier, PORTFOLIO_EVENTS, scrollToSection } from "@/lib/events";
import { shortInstitution, shortProductName } from "@/lib/format";
import { useFinePointer } from "@/lib/hooks";
import { EASE_OUT, fadeUp } from "@/lib/motion";

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE_OUT, delay },
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const mastheadY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const mastheadOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);

  return (
    <section id="hero" ref={sectionRef} aria-labelledby="hero-title" className="relative isolate overflow-clip pt-28 sm:pt-32 lg:pt-36">
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_65%_at_62%_28%,#000_15%,transparent_72%)]"
      />
      <CadCrosshair targetRef={sectionRef} />

      <div className="shell relative">
        <motion.div {...enter(0.05)} className="eyebrow flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-fg-3">
          <span className="flex items-center gap-3">
            <span className="numeric whitespace-nowrap text-accent">§ 00</span>
            <span aria-hidden="true" className="hidden h-px w-8 bg-line-3 sm:block" />
            <span>Executive technology portfolio</span>
          </span>
          <span className="flex items-center gap-4">
            <span className="hidden md:inline">Kuwait City · 29.37° N, 47.97° E</span>
            <span className="inline-flex items-center gap-2">
              <PulseDot />
              <KuwaitTime />
              <span>AST · UTC+3</span>
            </span>
          </span>
        </motion.div>

        {/* The name stays visible on first paint (no entrance opacity) so crawlers weight the H1 fully. */}
        <motion.div style={{ y: mastheadY, opacity: mastheadOpacity }}>
          <h1 id="hero-title" className="mt-10 sm:mt-14">
            <span className="eyebrow block text-accent">Executive Manager — Head of Digital Technology · KIB</span>
            <span className="mt-5 flex flex-wrap items-center gap-x-[0.2em] font-display text-display-1 text-fg">
              <span>Ahmed</span> <PortraitPlate /> <span>Shaker</span>
            </span>
          </h1>
        </motion.div>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-x-12">
          <motion.div {...enter(0.4)} className="lg:col-span-7">
            <p className="font-display text-display-3 text-fg">
              Architecting <em className="text-accent">digital factories</em> &amp; scalable banking ecosystems.
            </p>
            <p className="mt-6 max-w-[40rem] text-lede text-fg-3 [&_strong]:font-medium [&_strong]:text-fg">
              I am <strong>Ahmed Shaker</strong>, a senior technology executive and digital transformation leader with over{" "}
              <strong>10 years</strong> of experience building regulated banking, WealthTech, EdTech, and healthcare platforms. I
              played a foundational role in establishing <span className="text-accent">two banking Digital Factories from scratch</span>
              —at <strong>Kuwait International Bank (KIB)</strong> and <strong>Warba Bank</strong>.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button magnetic size="lg" onClick={() => scrollToSection("digital-factories")} icon={<ArrowGlyph direction="down-right" />}>
                Explore the two factories
              </Button>
              <Button variant="secondary" size="lg" onClick={() => scrollToSection("products")} icon={<ArrowGlyph />}>
                Browse the platforms
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={openDossier}
                className="px-3"
                iconLeading={<FileText className="size-4 text-accent" strokeWidth={1.75} />}
              >
                Executive CV
              </Button>
            </div>
          </motion.div>

          <motion.aside {...enter(0.55)} aria-label="Current and previous roles" className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <RoleLedger />
          </motion.aside>
        </div>

        <MetricsLedger />
      </div>

      <AppMarquee />
    </section>
  );
}

function PortraitPlate() {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ clipPath: "inset(0% 50% 0% 50% round 999px)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0% round 999px)" }}
      transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.35 }}
      className="duotone relative inline-block h-[0.7em] w-[1.12em] shrink-0 translate-y-[0.03em] overflow-hidden rounded-full border border-line-2"
    >
      <Image
        src="/assets/profile/ahmed-shaker-portrait.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1280px) 190px, (min-width: 640px) 140px, 96px"
        className="scale-[1.06] object-cover object-[50%_24%]"
      />
    </motion.span>
  );
}

function RoleLedger() {
  const kib = DIGITAL_FACTORIES.find((f) => f.id === "kib");
  const warba = DIGITAL_FACTORIES.find((f) => f.id === "warba");
  const rows = [
    kib && { key: "kib", label: "Now", plate: "Factory II", factory: kib, org: "Kuwait International Bank (KIB)", tone: "text-accent" },
    warba && { key: "warba", label: "Previously", plate: "Factory I", factory: warba, org: "Warba Bank · “Al-Wateen”", tone: "text-signal" },
  ].filter(Boolean) as { key: string; label: string; plate: string; factory: (typeof DIGITAL_FACTORIES)[number]; org: string; tone: string }[];

  return (
    <div className="relative border border-line-2 bg-surface/50 backdrop-blur-sm">
      <CornerTicks className="-inset-px" />
      {rows.map((row) => (
        <button
          key={row.key}
          type="button"
          onClick={() => {
            emit(PORTFOLIO_EVENTS.selectFactory, row.key);
            scrollToSection("digital-factories");
          }}
          className="group block w-full cursor-pointer border-b border-line p-5 text-left transition-colors duration-300 last:border-b-0 hover:bg-surface-2/70"
        >
          <span className="eyebrow flex items-center justify-between gap-3">
            <span className={row.tone}>{row.label}</span>
            <span className="text-fg-4">{row.plate}</span>
          </span>
          <span className="mt-3 flex items-start justify-between gap-3">
            <span className="font-display text-[1.45rem] leading-tight text-fg">{row.factory.role}</span>
            <ArrowGlyph className="mt-1.5 text-fg-4 transition-colors group-hover:text-accent" />
          </span>
          <span className="mt-1.5 block text-[13.5px] text-fg-3">{row.org}</span>
          <span className="eyebrow numeric mt-2 block text-[10px] text-fg-4">{row.factory.period}</span>
        </button>
      ))}
    </div>
  );
}

function MetricsLedger() {
  return (
    <motion.dl
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.75 } } }}
      className="mt-16 grid grid-cols-2 border-t border-line lg:mt-20 lg:grid-cols-4"
    >
      {EXECUTIVE_METRICS.map((metric, i) => {
        const parts = metric.value.match(/^(\d+\+?)\s*(.*)$/);
        return (
          <motion.div
            key={metric.id}
            variants={fadeUp}
            className={cn(
              "flex flex-col-reverse justify-end gap-4 border-line py-7",
              i % 2 === 0 ? "pr-5" : "border-l pl-5",
              i >= 2 && "border-t lg:border-t-0",
              i > 0 && "lg:border-l lg:pl-7",
              "lg:pr-6"
            )}
            title={metric.verificationNote}
          >
            <dt>
              <span className="block text-[14px] font-medium leading-snug text-fg">{metric.label}</span>
              <span className="mt-1.5 block text-[12.5px] leading-relaxed text-fg-3">{metric.sublabel}</span>
            </dt>
            <dd className="flex items-baseline gap-2 font-display text-[clamp(2.75rem,5.2vw,4.6rem)] leading-none text-fg">
              {parts ? (
                <>
                  <CountUp value={parts[1]} delay={0.85 + i * 0.09} />
                  {parts[2] && <span className="text-[0.36em] italic text-accent">{parts[2]}</span>}
                </>
              ) : (
                metric.value
              )}
            </dd>
          </motion.div>
        );
      })}
    </motion.dl>
  );
}

function AppMarquee() {
  const apps = SELECTED_PRODUCTS.filter((p) => p.iconPath);
  return (
    <motion.div {...enter(1.1)} className="mt-14 border-y border-line bg-bg-2/50 lg:mt-16">
      <div className="shell flex items-center gap-8 py-4">
        <span className="eyebrow hidden shrink-0 text-fg-3 md:block">
          Shipped to the
          <br />
          App Store &amp; Google Play
        </span>
        <Marquee duration={80} className="min-w-0 flex-1">
          {apps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => emit(PORTFOLIO_EVENTS.selectProduct, app.id)}
              className="group mr-9 flex shrink-0 cursor-pointer items-center gap-3 rounded-full py-1 pr-2 text-left"
              aria-label={`${app.name}, ${app.institution}. Open in the platform showroom`}
            >
              <span className="relative size-9 shrink-0 overflow-hidden rounded-[10px] border border-line-2 transition-transform duration-300 group-hover:-translate-y-0.5">
                <Image src={app.iconPath as string} alt="" fill sizes="36px" className="object-cover" />
              </span>
              <span className="whitespace-nowrap">
                <span className="block text-[13.5px] text-fg-2 transition-colors group-hover:text-fg">{shortProductName(app.name)}</span>
                <span className="eyebrow block text-[9.5px] text-fg-4">{shortInstitution(app.institution)}</span>
              </span>
            </button>
          ))}
        </Marquee>
      </div>
    </motion.div>
  );
}

/** Drafting-table crosshair that tracks the pointer across the hero with live coordinates. */
function CadCrosshair({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 700, damping: 50, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 700, damping: 50, mass: 0.35 });

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !fine || reduce) return;
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      x.set(px);
      y.set(py);
      if (labelRef.current) {
        labelRef.current.textContent = `X ${String(Math.round(px)).padStart(4, "0")}   Y ${String(Math.round(py)).padStart(4, "0")}`;
      }
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, reduce, targetRef, x, y]);

  if (!fine || reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-[5] hidden lg:block"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div className="absolute inset-y-0 left-0 w-px bg-accent/20" style={{ x: springX }} />
      <motion.div className="absolute inset-x-0 top-0 h-px bg-accent/20" style={{ y: springY }} />
      <motion.div className="absolute left-0 top-0" style={{ x: springX, y: springY }}>
        <span className="absolute -left-[7px] -top-[7px] size-[14px] rounded-full border border-accent/60" />
        <span className="absolute -left-px -top-px size-[3px] rounded-full bg-accent" />
        <span ref={labelRef} className="absolute left-4 top-3 whitespace-pre font-mono text-[10px] tracking-[0.14em] text-accent/80" />
      </motion.div>
    </motion.div>
  );
}
