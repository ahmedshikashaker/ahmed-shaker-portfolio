import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./SplitReveal";

/** Drafting registration cross, used where hairlines meet. */
export function RegMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="11" height="11" viewBox="0 0 11 11" className={cn("text-accent-deep", className)}>
      <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Four corner ticks that frame a block like a drawing sheet. */
export function CornerTicks({ className }: { className?: string }) {
  const tick = "absolute size-2.5 border-accent-deep/70";
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(tick, "left-0 top-0 border-l border-t")} />
      <span className={cn(tick, "right-0 top-0 border-r border-t")} />
      <span className={cn(tick, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(tick, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  marks?: boolean;
}

/** Page section with a full-bleed top hairline and registration marks at the content edges. */
export function Section({ id, children, className, labelledBy, marks = true }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-line" />
      {marks && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block">
          <div className="shell">
            <div className="relative">
              <RegMark className="absolute -left-[5.5px] -top-[5.5px]" />
              <RegMark className="absolute -right-[5.5px] -top-[5.5px]" />
            </div>
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

export function Eyebrow({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("eyebrow flex items-center gap-3 text-fg-3", className)}>
      {index && <span className="numeric text-accent">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-8 bg-line-3" />}
      <span>{children}</span>
    </div>
  );
}

interface SectionHeaderProps {
  index: string;
  label: string;
  /** Use *asterisks* to mark the emphasised (italic, accent) words. */
  title: string;
  titleId?: string;
  lede?: ReactNode;
  aside?: ReactNode;
  layout?: "split" | "stack";
  className?: string;
}

export function SectionHeader({ index, label, title, titleId, lede, aside, layout = "split", className }: SectionHeaderProps) {
  const split = layout === "split";
  return (
    <header className={cn("grid gap-8 lg:grid-cols-12 lg:gap-x-12", className)}>
      <div className={split ? "lg:col-span-7" : "lg:col-span-10"}>
        <Reveal y={10}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </Reveal>
        <h2 id={titleId} className="mt-6 font-display text-display-2 text-fg">
          <SplitReveal text={title} />
        </h2>
      </div>
      {(lede || aside) && (
        <Reveal delay={0.12} className={split ? "lg:col-span-5 lg:self-end" : "lg:col-span-8"}>
          {lede && <div className="text-lede text-fg-3 [&_strong]:font-medium [&_strong]:text-fg">{lede}</div>}
          {aside}
        </Reveal>
      )}
    </header>
  );
}
