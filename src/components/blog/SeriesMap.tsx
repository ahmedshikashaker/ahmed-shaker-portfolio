"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, BrickWall, CalendarRange, DoorOpen, Factory, Users } from "lucide-react";
import { useStepsOnView } from "./visuals/useMotionReady";

/**
 * "Five walls": the series as one route. Change 27 leaves the factory and meets five walls on its way to the
 * customer, one per essay; each wall opens as the change passes. The sixth essay is the year underneath, which
 * puts all five on one calendar. Plays once when scrolled into view; the server render is the finished route.
 */

export interface MapPart {
  n: number;
  wall: string;
  title: string;
  href: string;
}

export default function SeriesMap({ parts }: { parts: MapPart[] }) {
  const walls = parts.slice(0, 5);
  const year = parts[5];
  const ref = useRef<HTMLDivElement>(null);
  const steps = walls.length + 1; // through each wall, then to the customer
  const step = useStepsOnView(ref, steps, 650, 0.35);

  const arrow = (i: number) => (
    <span key={`a${i}`} aria-hidden="true" className={`flex items-center justify-center transition-colors duration-500 ${step > i ? "text-accent" : "text-fg-4"}`}>
      <ArrowRight className="hidden size-4 lg:block" strokeWidth={1.75} />
      <ArrowDown className="size-4 lg:hidden" strokeWidth={1.75} />
    </span>
  );

  const token = (
    <span className="absolute -top-2.5 end-2 rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-on-accent shadow-[var(--shadow-soft)]">
      27
    </span>
  );

  return (
    <div ref={ref} className="rounded-2xl border border-line-2 bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="eyebrow text-fg-4">One change, five walls, one year</p>
        <p className="text-[12.5px] text-fg-3">Change 27 is a one-line fix. Each essay takes down one wall between it and a customer.</p>
      </div>

      <ol className="mt-5 grid gap-2 lg:grid-cols-[minmax(0,0.8fr)_1rem_repeat(5,minmax(0,1fr)_1rem)_minmax(0,0.8fr)] lg:items-stretch">
        {/* Start */}
        <li className={`relative flex items-center gap-3 rounded-xl border px-3 py-3 lg:flex-col lg:justify-center lg:text-center ${step === 0 ? "border-accent bg-accent/[0.08]" : "border-line bg-bg-2/40"}`}>
          {step === 0 && token}
          <Factory className="size-5 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden="true" />
          <span className="text-[12.5px] font-medium leading-tight text-fg-2">Finished in the factory</span>
        </li>
        {arrow(0)}

        {walls.map((w, i) => {
          const open = step > i;
          const here = step === i + 1 && step < steps;
          return [
            <li key={w.n} className="relative">
              <Link
                href={w.href}
                className={`flex h-full items-center gap-3 rounded-xl border px-3 py-3 transition-colors duration-500 lg:flex-col lg:items-start lg:gap-2 ${
                  open ? "border-signal/45 bg-signal/[0.07] hover:border-signal" : "border-danger/45 bg-danger/[0.07] hover:border-danger"
                }`}
              >
                {here && token}
                {open ? (
                  <DoorOpen className="size-5 shrink-0 text-signal" strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <BrickWall className="size-5 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
                )}
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-fg-4">Part {w.n}</span>
                  <span className="block text-[13px] font-semibold leading-tight text-fg">{w.wall}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-fg-3">{w.title}</span>
                </span>
                <span className="sr-only">{open ? " (wall taken down)" : " (wall)"}</span>
              </Link>
            </li>,
            arrow(i + 1),
          ];
        })}

        {/* Customer */}
        <li
          className={`relative flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors duration-500 lg:flex-col lg:justify-center lg:text-center ${
            step >= steps ? "border-accent bg-accent/[0.08]" : "border-line bg-bg-2/40"
          }`}
        >
          {step >= steps && token}
          <Users className="size-5 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden="true" />
          <span className="text-[12.5px] font-medium leading-tight text-fg-2">In customers’ hands</span>
        </li>
      </ol>

      {year && (
        <Link
          href={year.href}
          className="group mt-4 block rounded-xl border border-accent/35 bg-accent/[0.05] px-4 py-3 transition-colors hover:border-accent"
        >
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2.5">
              <CalendarRange className="size-4 text-accent" strokeWidth={1.75} aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-4">Part {year.n}</span>
              <span className="text-[13px] font-semibold text-fg">{year.title}</span>
            </span>
            <span className="text-[12px] text-fg-3">All five walls on one calendar: the first twelve months, as a board lives them</span>
          </span>
          <span className="mt-2.5 grid grid-cols-12 gap-[3px]" aria-hidden="true">
            {Array.from({ length: 12 }, (_, m) => (
              <span
                key={m}
                className={`h-2 rounded-full transition-colors duration-500 ${step >= steps ? (m >= 2 && m <= 4 ? "bg-danger/50" : "bg-accent/60") : "bg-line-2"}`}
                style={{ transitionDelay: step >= steps ? `${m * 40}ms` : "0ms" }}
              />
            ))}
          </span>
        </Link>
      )}
    </div>
  );
}
