"use client";

import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Updates the --mx/--my CSS variables read by the `.spotlight` hover glow. */
export function spotlightMove(event: PointerEvent<HTMLElement>) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  target.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-2 bg-surface px-1 font-mono text-[10px] font-medium text-fg-3",
        className
      )}
    >
      {children}
    </kbd>
  );
}

export function Chip({ children, className, tone = "default" }: { children: ReactNode; className?: string; tone?: "default" | "accent" | "signal" | "mono" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] leading-none",
        tone === "default" && "border-line-2 bg-surface/50 text-fg-2",
        tone === "accent" && "border-accent/35 bg-accent/[0.08] text-accent",
        tone === "signal" && "border-signal/35 bg-signal/[0.08] text-signal",
        tone === "mono" && "border-line-2 bg-surface/50 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Breathing status dot. */
export function PulseDot({ className, tone = "signal" }: { className?: string; tone?: "signal" | "accent" }) {
  return (
    <span aria-hidden="true" className={cn("relative inline-flex size-2", className)}>
      <span className={cn("absolute inset-0 rounded-full animate-pulse-ring", tone === "signal" ? "bg-signal" : "bg-accent")} />
      <span className={cn("relative inline-flex size-2 rounded-full", tone === "signal" ? "bg-signal" : "bg-accent")} />
    </span>
  );
}

const KUWAIT_TIME = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kuwait",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Live local time in Kuwait (client-only to avoid hydration mismatch). */
export function KuwaitTime({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <time className={cn("numeric", className)} dateTime={now?.toISOString()}>
      {now ? KUWAIT_TIME.format(now) : "--:--"}
    </time>
  );
}

/** Stacked-plates mark: the 5-layer reference architecture, reduced to a glyph. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className={cn("size-7 text-accent", className)}>
      <path d="M14 3.5 24.5 8.75 14 14 3.5 8.75Z" fill="currentColor" />
      <path d="M3.5 13.6 14 18.85 24.5 13.6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" opacity="0.7" />
      <path d="M3.5 18.6 14 23.85 24.5 18.6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}
