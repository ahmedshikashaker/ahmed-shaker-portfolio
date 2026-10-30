"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ARCHITECTURE_LAYERS, SKILL_MATRIX, type ArchitectureLayer } from "@/data/portfolioData";
import { Chip } from "@/components/ui/primitives";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CornerTicks, Eyebrow, Section, SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";
import { EASE_OUT, SPRING } from "@/lib/motion";

const RAIL_LABELS: Record<string, string> = {
  "layer-client": "Client experience",
  "layer-security": "Security & identity",
  "layer-microservices": "Microservices mesh",
  "layer-data": "Polyglot data",
  "layer-devops": "DevOps & GitOps",
};

/** Short labels engraved on each isometric plate. */
const PLATE_LABELS: Record<string, string> = {
  "layer-client": "CLIENT EXPERIENCE",
  "layer-security": "SECURITY · IDENTITY",
  "layer-microservices": "MICROSERVICES MESH",
  "layer-data": "POLYGLOT DATA",
  "layer-devops": "DEVOPS · GITOPS",
};

// Isometric (2:1) plate geometry in SVG user units.
const VIEW_W = 520;
const VIEW_H = 560;
const CX = 260;
const HALF_W = 190;
const HALF_H = 95;
const THICK = 16;
const TOP = 104;
const GAP_COLLAPSED = 30;
const GAP_EXPLODED = 82;

export default function ArchitectureStrategySection() {
  const [selected, setSelected] = useState(0);
  const layer = ARCHITECTURE_LAYERS[selected];
  const tabsId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = ARCHITECTURE_LAYERS.length;

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
    const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : (index + (forward ? 1 : -1) + count) % count;
    refs.current[next]?.focus();
    setSelected(next);
  };

  return (
    <Section id="architecture" labelledBy="architecture-title" className="py-28 lg:py-40">
      <div className="shell">
        <SectionHeader
          index="04"
          label="Enterprise architecture & technology strategy"
          titleId="architecture-title"
          title="A 5-layer banking *reference architecture.*"
          lede="A banking Digital Factory succeeds when its underlying architecture decouples rapid product innovation from legacy core banking constraints. Select any layer to explore how I govern Mobile, Web, Domain-Driven Microservices, and GitOps delivery."
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <div className="relative grid gap-8 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center lg:sticky lg:top-24">
              <div role="tablist" aria-orientation="vertical" aria-label="Architecture layers" className="order-2 flex flex-col sm:order-1">
                {ARCHITECTURE_LAYERS.map((item, index) => {
                  const isSelected = index === selected;
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        refs.current[index] = el;
                      }}
                      id={`${tabsId}-tab-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-controls={`${tabsId}-panel`}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setSelected(index)}
                      onKeyDown={(event) => onKeyDown(event, index)}
                      className={cn(
                        "group relative flex cursor-pointer items-baseline gap-3 border-l py-3 pl-4 text-left transition-colors duration-300",
                        isSelected ? "border-accent" : "border-line-2 hover:border-line-3"
                      )}
                    >
                      {isSelected && <motion.span layoutId="layer-rail" transition={SPRING} className="absolute -left-px top-0 h-full w-px bg-accent" />}
                      <span className={cn("eyebrow numeric text-[10px]", isSelected ? "text-accent" : "text-fg-4")}>L{index + 1}</span>
                      <span className={cn("text-[13.5px] leading-snug transition-colors", isSelected ? "text-fg" : "text-fg-3 group-hover:text-fg-2")}>
                        {RAIL_LABELS[item.id] ?? item.name}
                      </span>
                    </button>
                  );
                })}
                <p className="eyebrow mt-5 hidden whitespace-nowrap pl-4 text-[9.5px] text-fg-4 sm:block">Click a plate · ↑ ↓</p>
              </div>
              <div className="order-1 sm:order-2">
                <IsometricStack selected={selected} onSelect={setSelected} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${selected}`} className="relative border border-line-2 bg-surface/40">
              <CornerTicks className="-inset-px" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.16 } }}
                >
                  <LayerSpec layer={layer} index={selected} count={count} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-28 lg:mt-36">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <Reveal y={10}>
              <Eyebrow index="04 · B">Technical repertoire</Eyebrow>
              <h3 className="mt-5 font-display text-display-3 text-fg">
                Specification sheet<span className="text-accent">.</span>
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-[14px] leading-relaxed text-fg-3">
                Four domains, written and run in production, from executive architecture down to the delivery pipeline.
              </p>
            </Reveal>
          </div>
          <Stagger className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {SKILL_MATRIX.map((group, idx) => (
              <StaggerItem key={group.category} className="bg-bg p-6">
                <div className="eyebrow numeric text-[10px] text-accent">Domain {pad2(idx + 1)}</div>
                <h4 className="mt-3 min-h-[2.6em] font-display text-[1.25rem] leading-tight text-fg">{group.category}</h4>
                <ul className="mt-5 border-t border-line">
                  {group.items.map((item) => (
                    <li key={item} className="group flex items-center justify-between gap-3 border-b border-line py-2.5 text-[13px] text-fg-2 transition-colors hover:text-fg">
                      <span>{item}</span>
                      <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 border border-accent-deep transition-colors group-hover:bg-accent" />
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}

function LayerSpec({ layer, index, count }: { layer: ArchitectureLayer; index: number; count: number }) {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="eyebrow flex flex-wrap items-center gap-3 text-fg-3">
        <span className="numeric text-accent">
          L{index + 1} / L{count}
        </span>
        <span aria-hidden="true" className="h-px w-6 bg-line-3" />
        {layer.layerNumber} · Architectural specification
      </div>
      <h3 className="mt-5 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.1] text-fg">{layer.name}</h3>

      <blockquote className="mt-7 border-l-2 border-accent pl-5">
        <p className="font-display text-[1.3rem] italic leading-[1.5] text-fg">“{layer.executiveThesis}”</p>
        <footer className="eyebrow mt-3 text-[10px] text-fg-4">Executive thesis</footer>
      </blockquote>

      <p className="mt-7 text-[15px] leading-[1.75] text-fg-2">{layer.description}</p>

      <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-2">
        <div className="bg-bg p-5">
          <div className="eyebrow text-[10px] text-signal">Core design principles</div>
          <ol className="mt-4 space-y-2.5">
            {layer.designPrinciples.map((principle, i) => (
              <li key={principle} className="flex gap-3 text-[13.5px] leading-snug text-fg-2">
                <span className="numeric font-mono text-[11px] text-accent">{pad2(i + 1)}</span>
                {principle}
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-bg p-5">
          <div className="eyebrow text-[10px] text-accent">Standardised technologies</div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {layer.technologies.map((tech) => (
              <Chip key={tech} className="text-[11.5px]">
                {tech}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-7 border-t border-line pt-5 text-[13.5px] leading-relaxed text-fg-3">
        <span className="eyebrow mr-2 text-[10px] text-accent">Production deployment</span>
        {layer.bankingUseCase}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ Isometric exploded stack */

function IsometricStack({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 55%"] });
  const scrollGap = useTransform(scrollYProgress, [0, 1], [GAP_COLLAPSED, GAP_EXPLODED]);
  const smoothGap = useSpring(scrollGap, { stiffness: 120, damping: 24 });
  const gap = reduce ? scrollGap : smoothGap;
  const count = ARCHITECTURE_LAYERS.length;

  // Dashed drafting lines tying the plate corners together, lengthening as the stack explodes.
  const columnEnd = useTransform(() => TOP + (count - 1) * (reduce ? GAP_EXPLODED : gap.get()) + THICK);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[30rem]">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-auto w-full overflow-visible" role="img" aria-label="Exploded isometric view of the five architecture layers">
        <defs>
          <linearGradient id="plate-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--c-accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--c-accent)" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {[CX - HALF_W, CX + HALF_W, CX].map((x, i) => (
          <motion.line
            key={x}
            x1={x}
            x2={x}
            y1={TOP + (i === 2 ? HALF_H : 0)}
            y2={columnEnd}
            stroke="var(--c-line-3)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}

        {ARCHITECTURE_LAYERS.map((layer, i) => ({ layer, i }))
          .reverse()
          .map(({ layer, i }) => (
            <Plate
              key={layer.id}
              index={i}
              label={PLATE_LABELS[layer.id] ?? layer.name}
              gap={gap}
              exploded={Boolean(reduce)}
              selected={i === selected}
              onSelect={() => onSelect(i)}
            />
          ))}
      </svg>
    </div>
  );
}

function Plate({
  index,
  label,
  gap,
  exploded,
  selected,
  onSelect,
}: {
  index: number;
  label: string;
  gap: MotionValue<number>;
  exploded: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const liftTarget = selected ? -18 : hovered ? -8 : 0;
  const lift = useSpring(liftTarget, { stiffness: 260, damping: 26 });
  useEffect(() => lift.set(liftTarget), [lift, liftTarget]);
  const y = useTransform(() => index * (exploded ? GAP_EXPLODED : gap.get()) + lift.get());

  const cy = TOP;
  const L = [CX - HALF_W, cy];
  const T = [CX, cy - HALF_H];
  const R = [CX + HALF_W, cy];
  const B = [CX, cy + HALF_H];
  const top = `M${L} L${T} L${R} L${B} Z`;
  const left = `M${L} L${B} L${B[0]},${B[1] + THICK} L${L[0]},${L[1] + THICK} Z`;
  const right = `M${B} L${R} L${R[0]},${R[1] + THICK} L${B[0]},${B[1] + THICK} Z`;

  // Grid lines across the top face: p(u, v) = L + u·(T − L) + v·(B − L)
  const point = (u: number, v: number) => [L[0] + u * HALF_W + v * HALF_W, L[1] - u * HALF_H + v * HALF_H];
  const grid: string[] = [];
  for (const f of [0.25, 0.5, 0.75]) {
    const a0 = point(f, 0);
    const a1 = point(f, 1);
    const b0 = point(0, f);
    const b1 = point(1, f);
    grid.push(`M${a0} L${a1}`, `M${b0} L${b1}`);
  }
  const labelAt = point(0.08, 0.66);

  return (
    <motion.g
      style={{ y }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onSelect}
      className="cursor-pointer"
      aria-hidden="true"
    >
      <path d={left} fill="var(--plate-left)" stroke="var(--c-line-2)" strokeWidth="1" strokeLinejoin="round" />
      <path d={right} fill="var(--plate-right)" stroke="var(--c-line-2)" strokeWidth="1" strokeLinejoin="round" />
      <path
        d={top}
        fill={selected ? "url(#plate-glow)" : "var(--plate-face)"}
        stroke={selected ? "var(--c-accent)" : hovered ? "var(--c-line-3)" : "var(--c-line-2)"}
        strokeWidth={selected ? 1.25 : 1}
        strokeLinejoin="round"
        style={{ transition: "stroke 0.3s ease" }}
      />
      <path d={grid.join(" ")} stroke={selected ? "var(--c-accent)" : "var(--c-line)"} strokeOpacity={selected ? 0.35 : 1} strokeWidth="1" fill="none" />
      <text
        transform={`matrix(0.894 -0.447 0.894 0.447 ${labelAt[0]} ${labelAt[1]})`}
        fill={selected ? "var(--c-accent)" : "var(--c-fg-3)"}
        fontFamily="var(--font-plex-mono), monospace"
        fontSize="10"
        letterSpacing="1.6"
        style={{ transition: "fill 0.3s ease" }}
      >
        {`L${index + 1} · ${label}`}
      </text>
      {selected && (
        <circle cx={CX} cy={cy} r="4" fill="var(--c-accent)">
          <animate attributeName="r" values="3;7;3" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.35;1" dur="2.4s" repeatCount="indefinite" />
        </circle>
      )}
    </motion.g>
  );
}
