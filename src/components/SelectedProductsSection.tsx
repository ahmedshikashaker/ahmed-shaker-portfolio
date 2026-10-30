"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { EXECUTIVE_PROFILE, SELECTED_PRODUCTS, type BankingProduct, type ProductFactoryGroup } from "@/data/portfolioData";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CornerTicks, Section, SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { PORTFOLIO_EVENTS, prefersReducedMotion } from "@/lib/events";
import { pad2, shortInstitution, shortProductName } from "@/lib/format";
import { useFinePointer, useMediaQuery, useWindowEvent } from "@/lib/hooks";
import { EASE_OUT, SPRING } from "@/lib/motion";

type FilterCategory = "ALL" | ProductFactoryGroup;

const GROUPS: { id: ProductFactoryGroup; label: string }[] = [
  { id: "KIB Digital Factory", label: "KIB" },
  { id: "Warba Al-Wateen Factory", label: "Warba Bank" },
  { id: "ITG Solutions Ecosystem", label: "ITG Solutions" },
  { id: "Global Banking & FinTech", label: "UBA & Advicenode" },
];

const FILTERS: { value: FilterCategory; label: string; count: number }[] = [
  { value: "ALL", label: "All platforms", count: SELECTED_PRODUCTS.length },
  ...GROUPS.map((group) => ({
    value: group.id as FilterCategory,
    label: group.label,
    count: SELECTED_PRODUCTS.filter((p) => p.factoryTag === group.id).length,
  })),
];

function productsFor(filter: FilterCategory) {
  return filter === "ALL" ? SELECTED_PRODUCTS : SELECTED_PRODUCTS.filter((p) => p.factoryTag === filter);
}

export default function SelectedProductsSection() {
  const [filter, setFilter] = useState<FilterCategory>("ALL");
  const [selectedId, setSelectedId] = useState<string>(SELECTED_PRODUCTS[0].id);
  const stageRef = useRef<HTMLDivElement>(null);

  const products = useMemo(() => productsFor(filter), [filter]);
  const active: BankingProduct = products.find((p) => p.id === selectedId) ?? products[0] ?? SELECTED_PRODUCTS[0];
  const position = products.findIndex((p) => p.id === active.id);

  const select = (id: string, reveal = false) => {
    const product = SELECTED_PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    if (filter !== "ALL" && product.factoryTag !== filter) setFilter("ALL");
    setSelectedId(id);
    if (reveal) {
      requestAnimationFrame(() =>
        stageRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" })
      );
    }
  };

  useWindowEvent<string>(PORTFOLIO_EVENTS.selectProduct, (id) => select(id, true));

  // Deep links from other pages: /?product=kib-corporate#products
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("product");
    if (id && SELECTED_PRODUCTS.some((p) => p.id === id)) setSelectedId(id);
  }, []);

  const onFilterChange = (next: FilterCategory) => {
    setFilter(next);
    const list = productsFor(next);
    if (!list.some((p) => p.id === selectedId) && list[0]) setSelectedId(list[0].id);
  };

  const step = (delta: number) => {
    if (products.length === 0) return;
    const next = products[(position + delta + products.length) % products.length];
    setSelectedId(next.id);
  };

  return (
    <Section id="products" labelledBy="products-title" className="py-28 lg:py-40">
      <div className="shell">
        <SectionHeader
          index="03"
          label={`Production portfolio · ${SELECTED_PRODUCTS.length} platforms`}
          titleId="products-title"
          title="Selected banking, EdTech & *enterprise platforms.*"
          lede={
            <>
              Explore the production platforms delivered across <strong>Kuwait International Bank (KIB)</strong>, <strong>Warba Bank</strong>,{" "}
              <strong>ITG Solutions</strong> (EduWave K-12, Higher-ED, AMS, MedXJordan, Great Tafsirs, Al-Zakah),{" "}
              <strong>United Bank for Africa (UBA)</strong>, and <strong>Advicenode</strong>.
            </>
          }
          aside={
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                { href: EXECUTIVE_PROFILE.contact.kibAppStoreDeveloper, label: "KIB on the App Store" },
                { href: EXECUTIVE_PROFILE.contact.kibPlayStoreDeveloper, label: "KIB on Google Play" },
                { href: EXECUTIVE_PROFILE.contact.itgPlayStoreDeveloper, label: "ITG on Google Play" },
              ].map((link) => (
                <Button key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm" icon={<ArrowGlyph className="size-3.5 text-accent" />}>
                  {link.label}
                </Button>
              ))}
            </div>
          }
        />

        <Reveal className="mt-16 flex flex-col items-start gap-6 lg:mt-20">
          <SegmentedControl label="Filter platforms by institution" options={FILTERS} value={filter} onChange={onFilterChange} />
        </Reveal>

        <Reveal delay={0.05}>
          <Dock products={products} grouped={filter === "ALL"} activeId={active.id} onSelect={(id) => select(id)} />
        </Reveal>

        <div ref={stageRef} id="products-stage" className="relative mt-6 scroll-mt-28 border border-line-2 bg-surface/40">
          <CornerTicks className="-inset-px" />
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-7">
            <span className="eyebrow numeric text-fg-3">
              Platform <span className="text-accent">{pad2(position + 1)}</span> / {pad2(products.length)}
              <span className="ml-3 hidden text-fg-4 sm:inline">· {active.factoryTag}</span>
            </span>
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous platform"
                className="grid size-9 cursor-pointer place-items-center rounded-full text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next platform"
                className="grid size-9 cursor-pointer place-items-center rounded-full text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <ChevronRight className="size-4" />
              </button>
            </span>
          </div>

          <div className="grid lg:grid-cols-12">
            <div className="relative overflow-clip border-b border-line lg:col-span-5 lg:border-b-0 lg:border-r">
              <div className="lg:sticky lg:top-20">
                <DeviceStage key={active.id} product={active} />
              </div>
            </div>
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.16 } }}
                >
                  <ProductDossier product={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ Dock */

function Dock({ products, grouped, activeId, onSelect }: { products: BankingProduct[]; grouped: boolean; activeId: string; onSelect: (id: string) => void }) {
  const mouseX = useMotionValue(Infinity);
  const fine = useFinePointer();
  const wide = useMediaQuery("(min-width: 1280px)");
  const reduce = useReducedMotion();
  const magnify = fine && wide && !reduce;
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the selected icon visible when the dock scrolls horizontally (tablet / mobile).
  useEffect(() => {
    if (magnify) return;
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-product="${activeId}"]`);
    if (!list || !item) return;
    const left = item.offsetLeft - list.clientWidth / 2 + item.clientWidth / 2;
    list.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [activeId, magnify]);

  return (
    <div className="relative mt-8">
      <ul
        ref={listRef}
        aria-label="Platforms"
        onMouseMove={(event) => magnify && mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "no-scrollbar flex h-[112px] items-end gap-2.5 overflow-x-auto px-1 pb-5",
          magnify ? "justify-center overflow-visible" : "mask-fade-x snap-x snap-mandatory"
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {products.flatMap((product, i) => {
            const items = [];
            if (grouped && i > 0 && products[i - 1].factoryTag !== product.factoryTag) {
              items.push(
                <motion.li
                  key={`sep-${product.id}`}
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mx-1.5 mb-2 h-12 w-px shrink-0 self-end bg-line-2"
                />
              );
            }
            items.push(
              <motion.li
                key={product.id}
                data-product={product.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="relative shrink-0 snap-center"
              >
                <DockIcon product={product} mouseX={mouseX} magnify={magnify} selected={product.id === activeId} onSelect={onSelect} />
              </motion.li>
            );
            return items;
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function DockIcon({
  product,
  mouseX,
  magnify,
  selected,
  onSelect,
}: {
  product: BankingProduct;
  mouseX: MotionValue<number>;
  magnify: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(() => {
    const x = mouseX.get();
    const el = ref.current;
    if (!el || !Number.isFinite(x)) return 1000;
    const rect = el.getBoundingClientRect();
    return x - (rect.left + rect.width / 2);
  });
  const target = useTransform(distance, [-160, 0, 160], [54, 80, 54]);
  const size = useSpring(target, { mass: 0.12, stiffness: 190, damping: 15 });

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onSelect(product.id)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-pressed={selected}
      aria-label={`${product.name} · ${product.institution}`}
      className="relative block cursor-pointer rounded-[14px] outline-offset-4"
    >
      <motion.span
        style={magnify ? { width: size, height: size } : undefined}
        className={cn(
          "relative block size-[52px] overflow-hidden rounded-[14px] border transition-[border-color,box-shadow] duration-300",
          selected ? "border-accent shadow-[0_0_0_3px_color-mix(in_oklab,var(--c-accent)_25%,transparent)]" : "border-line-2"
        )}
      >
        {product.iconPath ? (
          <Image src={product.iconPath} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center bg-surface-2 font-display text-[18px] italic text-accent">
            {product.name.slice(0, 2)}
          </span>
        )}
      </motion.span>
      {selected && <motion.span layoutId="dock-active" transition={SPRING} className="absolute -bottom-3 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />}
      <AnimatePresence>
        {hovered && magnify && (
          <motion.span
            initial={{ opacity: 0, y: 6, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute -top-10 left-1/2 z-10 whitespace-nowrap rounded-full border border-line-2 bg-surface-2 px-3 py-1 text-[12px] text-fg shadow-soft"
          >
            {shortProductName(product.name)}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ------------------------------------------------------------------ Device stage */

function DeviceStage({ product }: { product: BankingProduct }) {
  const shots = product.screenshots ?? [];
  const pageSize = 2;
  const maxStart = Math.max(0, shots.length - pageSize);
  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState(1);
  const fine = useFinePointer();
  const reduce = useReducedMotion();

  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  const go = (next: number) => {
    const clamped = Math.min(maxStart, Math.max(0, next));
    if (clamped === start) return;
    setDirection(clamped > start ? 1 : -1);
    setStart(clamped);
  };

  const visible = shots.slice(start, start + pageSize);

  return (
    <div
      className="relative flex min-h-[30rem] flex-col justify-between px-6 py-8 sm:px-10 lg:h-[min(46rem,calc(100vh-6rem))] lg:min-h-[34rem]"
      onPointerMove={(event) => {
        if (!fine || reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 10);
        rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 8);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <div aria-hidden="true" className="blueprint-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000,transparent_75%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative flex flex-1 items-center justify-center" style={{ perspective: 1200 }}>
        {shots.length > 0 ? (
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={start}
              custom={direction}
              variants={{
                enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
                center: { opacity: 1, x: 0 },
                exit: (dir: number) => ({ opacity: 0, x: dir * -48 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: EASE_OUT }}
              drag={shots.length > pageSize ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(start + 1);
                else if (info.offset.x > 60) go(start - 1);
              }}
              style={{ rotateX, rotateY }}
              className="grid w-full max-w-[25rem] cursor-grab grid-cols-2 gap-4 active:cursor-grabbing sm:gap-6"
            >
              {visible.map((shot, i) => (
                <Phone
                  key={shot}
                  src={shot}
                  alt={`${product.name}, screen ${start + i + 1} of ${shots.length}`}
                  className={i === 0 ? "-rotate-[2.5deg]" : "translate-y-8 rotate-[2.5deg]"}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div style={{ rotateX, rotateY }} className="w-full max-w-[13rem]">
            <div className="relative aspect-[9/19.2] w-full rounded-[2.2rem] border border-line-3 bg-[#05070c] p-[7px] shadow-float">
              <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[1.8rem] bg-surface px-5 text-center">
                {product.iconPath ? (
                  <span className="relative size-20 overflow-hidden rounded-[20px] border border-line-2">
                    <Image src={product.iconPath} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                ) : (
                  <span className="grid size-20 place-items-center rounded-[20px] border border-accent/40 bg-accent/10 font-display text-[28px] italic text-accent">
                    {product.name.slice(0, 2)}
                  </span>
                )}
                <span className="font-display text-[15px] italic leading-snug text-fg-2">“{product.tagline}”</span>
              </div>
              <span aria-hidden="true" className="absolute left-1/2 top-[13px] h-[15px] w-[32%] -translate-x-1/2 rounded-full bg-black/85" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative mt-10 flex items-center justify-between gap-3">
        <span className="eyebrow text-[10px] text-fg-4">
          {shots.length > 0 ? `Official production interface · ${shots.length} screens` : "Platform overview"}
        </span>
        {shots.length > pageSize && (
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => go(start - 1)}
              disabled={start === 0}
              aria-label="Previous screens"
              className="grid size-8 cursor-pointer place-items-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-line-3 hover:text-fg disabled:cursor-default disabled:opacity-35"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            {Array.from({ length: maxStart + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show screens ${i + 1} and ${i + 2}`}
                aria-current={i === start}
                className="grid h-8 w-5 cursor-pointer place-items-center"
              >
                <span className={cn("h-1 rounded-full transition-all duration-300", i === start ? "w-4 bg-accent" : "w-1 bg-line-3")} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => go(start + 1)}
              disabled={start >= maxStart}
              aria-label="Next screens"
              className="grid size-8 cursor-pointer place-items-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-line-3 hover:text-fg disabled:cursor-default disabled:opacity-35"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

function Phone({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[9/19.2] w-full rounded-[2rem] border border-line-3 bg-[#05070c] p-[6px] shadow-float", className)}>
      <div className="relative h-full w-full overflow-hidden rounded-[1.65rem] bg-surface">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 200px, 42vw" className="pointer-events-none select-none object-cover object-top" draggable={false} />
      </div>
      <span aria-hidden="true" className="absolute left-1/2 top-[11px] h-[13px] w-[30%] -translate-x-1/2 rounded-full bg-black/85" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(118deg,rgba(255,255,255,0.10),transparent_32%)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ Dossier */

function ProductDossier({ product }: { product: BankingProduct }) {
  const links = [
    product.appStoreUrl && { href: product.appStoreUrl, label: "App Store", primary: true },
    product.playStoreUrl && { href: product.playStoreUrl, label: "Google Play", primary: !product.appStoreUrl },
    product.secondaryPlayStoreUrl && { href: product.secondaryPlayStoreUrl, label: "Google Play (2)", primary: false },
    product.websiteUrl && { href: product.websiteUrl, label: product.websiteLabel || "Official site", primary: false },
  ].filter(Boolean) as { href: string; label: string; primary: boolean }[];

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="flex items-start gap-5">
        {product.iconPath ? (
          <span className="relative size-16 shrink-0 overflow-hidden rounded-[18px] border border-line-2 shadow-soft">
            <Image src={product.iconPath} alt="" fill sizes="64px" className="object-cover" />
          </span>
        ) : (
          <span className="grid size-16 shrink-0 place-items-center rounded-[18px] border border-accent/40 bg-accent/10 font-display text-[22px] italic text-accent">
            {product.name.slice(0, 2)}
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="accent">{product.attributionBadge}</Chip>
            <span className="eyebrow text-[10px] text-fg-4">{shortInstitution(product.institution)}</span>
          </div>
          <h3 className="mt-3 font-display text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.08] text-fg">{product.name}</h3>
          <p className="mt-1.5 text-[13.5px] text-fg-3">
            {product.institution} — {product.category}
          </p>
        </div>
      </div>

      <p className="mt-6 font-display text-[1.2rem] italic leading-relaxed text-fg-2">{product.tagline}</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {product.platforms.map((platform) => (
          <Chip key={platform} tone="mono">
            {platform}
          </Chip>
        ))}
      </div>

      {links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {links.map((link) => (
            <Button
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variant={link.primary ? "primary" : "secondary"}
              size="sm"
              icon={<ArrowGlyph className="size-3.5" />}
            >
              {link.label}
            </Button>
          ))}
        </div>
      )}

      <dl className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2">
        <Facet n="01" label="Purpose & experience">
          {product.purposeAndExperience}
        </Facet>
        <Facet n="02" label="Problem addressed">
          {product.problemAddressed}
        </Facet>
        <Facet n="03" label="My role & contribution" highlight>
          <span className="text-fg">{product.myRoleAndContribution}</span>
          <span className="mt-3 block border-l-2 border-accent/40 pl-3 text-[12.5px] leading-relaxed text-fg-3">
            {product.organizationalDistinction}
          </span>
        </Facet>
        <Facet n="04" label="Architecture & stack">
          <span className="flex flex-wrap gap-1.5">
            {product.architectureAndTech.map((tech) => (
              <Chip key={tech} className="text-[11.5px]">
                {tech}
              </Chip>
            ))}
          </span>
        </Facet>
      </dl>

      <p className="mt-6 flex gap-3 text-[13.5px] leading-relaxed text-fg-2">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={1.75} />
        {product.verifiableImpact}
      </p>
    </div>
  );
}

function Facet({ n, label, highlight = false, children }: { n: string; label: string; highlight?: boolean; children: ReactNode }) {
  return (
    <div className={cn("bg-bg p-5", highlight && "bg-surface")}>
      <dt className={cn("eyebrow flex items-center gap-2 text-[10px]", highlight ? "text-accent" : "text-fg-4")}>
        <span className="numeric">{n}</span>
        <span aria-hidden="true" className="h-px w-4 bg-current opacity-50" />
        {label}
      </dt>
      <dd className="mt-3 text-[13.5px] leading-[1.7] text-fg-2">{children}</dd>
    </div>
  );
}
