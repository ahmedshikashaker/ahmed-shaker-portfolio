"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Compass, Sparkles, X } from "lucide-react";
import { useEscape, useFocusTrap, useScrollLock, useWindowEvent } from "@/lib/hooks";
import { EASE_OUT } from "@/lib/motion";

export const SERIES_COMING_SOON_EVENT = "series:coming-soon";

export interface ComingSoonPartPayload {
  n: number;
  total: number;
  seriesTitle: string;
  seriesSlug: string;
  firstPublishedSlug?: string;
  firstPublishedTitle?: string;
  wall: string;
  title: string;
  excerpt: string;
  objective?: string;
  keyConcepts?: string[];
  stat?: { before?: string; value: string; label: string };
  boardLine?: string;
}

export function openComingSoonPart(payload: ComingSoonPartPayload) {
  if (typeof window === "undefined") return;
  try {
    track("series_coming_soon_click", {
      series: payload.seriesSlug,
      part: payload.n,
      wall: payload.wall,
      title: payload.title,
    });
  } catch {
    // Ignore analytics errors if blocked by client extensions
  }
  window.dispatchEvent(new CustomEvent<ComingSoonPartPayload>(SERIES_COMING_SOON_EVENT, { detail: payload }));
}

export function ComingSoonPartTrigger({
  part,
  className,
  children,
  ariaLabel,
}: {
  part: ComingSoonPartPayload;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openComingSoonPart(part)}
      aria-label={ariaLabel ?? `${part.title} — Coming Soon`}
      className={className}
    >
      {children}
    </button>
  );
}

export default function ComingSoonSeriesModal() {
  const [activePart, setActivePart] = useState<ComingSoonPartPayload | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = activePart !== null;

  const close = useCallback(() => setActivePart(null), []);

  useWindowEvent<ComingSoonPartPayload>(SERIES_COMING_SOON_EVENT, (detail) => {
    setActivePart(detail);
  });

  useScrollLock(isOpen);
  useFocusTrap(dialogRef, isOpen);
  useEscape(close, isOpen);

  return (
    <AnimatePresence>
      {activePart && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-dialog-title"
          dir="ltr"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 bg-bg/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Dialog Box */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.26, ease: EASE_OUT }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-accent/45 bg-surface shadow-2xl"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between gap-3 border-b border-line bg-bg-2/60 px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/45 bg-accent/15 px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-accent">
                  <Clock className="size-3" /> Coming Soon · Part {activePart.n} of {activePart.total}
                </span>
                <span className="rounded-full border border-line-2 bg-surface px-2.5 py-0.5 font-mono text-[10.5px] text-fg-3">
                  {activePart.wall}
                </span>
              </div>
              <button
                type="button"
                data-autofocus
                onClick={close}
                aria-label="Close dialog"
                className="inline-flex size-8 items-center justify-center rounded-full border border-line-2 bg-bg text-fg-3 transition-colors hover:border-accent hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {/* Coming soon announcement */}
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-accent/35 bg-accent/[0.08] px-4 py-3 text-[13px] leading-relaxed text-fg-2">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                <div>
                  <span className="font-semibold text-fg">This article is coming soon.</span> Part {activePart.n} of{" "}
                  <em>{activePart.seriesTitle}</em> is scheduled for upcoming release. Here is a preview of what this
                  installment covers:
                </div>
              </div>

              <h2
                id="coming-soon-dialog-title"
                className="font-display text-[1.6rem] leading-tight text-fg sm:text-[1.85rem]"
              >
                {activePart.title}
              </h2>

              <p className="mt-2.5 text-[14.5px] leading-relaxed text-fg-3">{activePart.excerpt}</p>

              {activePart.objective && (
                <div className="mt-4 rounded-xl border border-line bg-bg-2/40 px-4 py-3 text-[13px] leading-relaxed text-fg-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                    Editorial Objective:{" "}
                  </span>
                  {activePart.objective}
                </div>
              )}

              {activePart.stat && (
                <div className="mt-4 rounded-xl border border-line-2 bg-bg px-4 py-3">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    {activePart.stat.before && (
                      <>
                        <span className="font-mono text-[12px] text-fg-4 line-through decoration-danger/60">
                          {activePart.stat.before}
                        </span>
                        <span className="text-fg-4" aria-hidden="true">
                          →
                        </span>
                      </>
                    )}
                    <span className="font-display text-[1.55rem] leading-none text-accent">
                      {activePart.stat.value}
                    </span>
                    <span className="text-[12.5px] text-fg-3">{activePart.stat.label}</span>
                  </div>
                </div>
              )}

              {activePart.keyConcepts && activePart.keyConcepts.length > 0 && (
                <div className="mt-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-fg-4">
                    Key Architectural Concepts in Part {activePart.n}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {activePart.keyConcepts.map((concept) => (
                      <li
                        key={concept}
                        className="flex items-start gap-2 rounded-lg border border-line bg-bg/60 px-3 py-2 text-[12.5px] text-fg-2"
                      >
                        <Compass className="mt-0.5 size-3.5 shrink-0 text-accent" />
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activePart.boardLine && (
                <div className="mt-4 rounded-xl border border-line bg-bg-2/35 px-4 py-3 text-[12.5px] italic text-fg-2">
                  <span className="not-italic font-mono text-[10px] uppercase tracking-wider text-fg-4">
                    Executive Takeaway:{" "}
                  </span>
                  “{activePart.boardLine}”
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-bg-2/50 px-5 py-3.5 sm:px-6">
              <span className="font-mono text-[11px] text-fg-4">
                Part 1 is live now · Parts 2–8 releasing progressively
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {activePart.firstPublishedSlug && (
                  <Link
                    href={`/blog/${activePart.firstPublishedSlug}`}
                    onClick={close}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--c-btn-bg)] px-4 text-[12.5px] font-medium text-[var(--c-btn-fg)] transition-colors hover:bg-[var(--c-btn-bg-hover)]"
                  >
                    Read Part 1 Now <ArrowRight className="size-3.5" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-9 items-center rounded-full border border-line-2 bg-surface px-4 text-[12.5px] font-medium text-fg-2 transition-colors hover:border-line-3 hover:text-fg"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
