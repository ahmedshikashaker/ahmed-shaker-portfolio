"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Play, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BRIEFS } from "@/data/portfolioData";
import { cn } from "@/lib/cn";
import { openBrief, openDossier } from "@/lib/events";
import { useEscape, useFocusTrap, useMediaQuery, useScrollLock } from "@/lib/hooks";
import { EASE } from "./motion";

export type Tone = "light" | "mist" | "dark";

/**
 * One full-width band of the page in a single tone. The header reads `data-tone` to match its glass to the band
 * under it, and `data-theme` keeps any site component inside on the right palette.
 */
export function Band({
  id,
  tone,
  labelledBy,
  className,
  children,
  as = "section",
}: {
  id?: string;
  tone: Tone;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
  as?: "section" | "div" | "footer";
}) {
  const Component = as;
  return (
    <Component
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone}
      data-theme={tone === "dark" ? "dark" : "light"}
      className={cn(`tone-${tone}`, "launch relative", className)}
    >
      {children}
    </Component>
  );
}

/** The content column: Apple's comfortable reading width, wider for galleries. */
export function Wrap({ children, className, wide = false }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", wide ? "max-w-[90rem]" : "max-w-[76rem]", className)}>{children}</div>;
}

/** Section opener: a coloured kicker, one bold statement, one supporting line. */
export function Heading({
  kicker,
  title,
  sub,
  id,
  align = "left",
  className,
}: {
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header className={cn(align === "center" && "mx-auto text-center", className)}>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="t-kicker text-l-fg-3"
      >
        {kicker}
      </motion.p>
      <motion.h2
        id={id}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: EASE, delay: 0.06 }}
        className={cn("t-h1 mt-3 text-l-fg", align === "center" ? "mx-auto max-w-[18ch]" : "max-w-[18ch]")}
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE, delay: 0.14 }}
          className={cn("t-lede mt-5 max-w-[38ch] text-l-fg-3", align === "center" && "mx-auto")}
        >
          {sub}
        </motion.p>
      )}
    </header>
  );
}

/** Renders `*asterisk*` emphasis from the copy file in the accent colour. */
export function Emphasis({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className={cn("text-l-accent", className)}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Blue text link with a chevron, Apple style. */
export function ChevronLink({
  children,
  href,
  onClick,
  className,
  external = false,
  dialog = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
  dialog?: boolean;
}) {
  const body = (
    <>
      <span>{children}</span>
      <ChevronRight aria-hidden="true" className="size-[1em] translate-y-[0.04em]" strokeWidth={2.2} />
    </>
  );
  const classes = cn("l-link group", className);
  if (href) {
    return (
      <a href={href} className={classes} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {body}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes} aria-haspopup={dialog ? "dialog" : undefined}>
      {body}
    </button>
  );
}

/** Opens one of the long-form briefs in the reader. */
export function BriefLink({ brief, className, label }: { brief: keyof typeof BRIEFS; className?: string; label?: string }) {
  const entry = BRIEFS[brief];
  return (
    <ChevronLink onClick={() => openBrief(entry.id)} className={className} dialog>
      {label ?? entry.label}
    </ChevronLink>
  );
}

export function DossierLink({ className, label = "Executive CV" }: { className?: string; label?: string }) {
  return (
    <ChevronLink onClick={openDossier} className={className} dialog>
      {label}
    </ChevronLink>
  );
}

/* ------------------------------------------------------------------ The film */

/** The launch film, rendered with Remotion from video/src/home: a 16:9 cut and a 4:5 cut for phones. Silent. */
const FILM = {
  wide: { src: "/videos/home-showreel.mp4", poster: "/videos/home-showreel-poster.jpg" },
  tall: { src: "/videos/home-showreel-portrait.mp4", poster: "/videos/home-showreel-portrait-poster.jpg" },
};

/** "Watch the film": a pill that opens the film full screen. */
export function FilmButton({ className, label = "Watch the film" }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const phone = useMediaQuery("(max-width: 639px)");
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={cn("l-btn group", className)}>
        <span className="grid size-6 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-110">
          <Play aria-hidden="true" className="size-3 translate-x-[1px] fill-current" strokeWidth={0} />
        </span>
        {label}
      </button>
      <AnimatePresence>{open && <Theater key="theater" tall={phone} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function Theater({ tall, onClose }: { tall: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollLock(true);
  useFocusTrap(ref, true);
  useEscape(onClose, true);
  const film = tall ? FILM.tall : FILM.wide;

  return createPortal(
    <div className="tone-dark launch fixed inset-0 z-[95] bg-transparent print:hidden" data-theme="dark">
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ duration: 0.4 }}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="The film, silent"
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 p-4 sm:p-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
          transition={{ duration: 0.7, ease: EASE }}
          className={cn(
            "pointer-events-auto relative overflow-hidden rounded-[22px] bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10",
            tall ? "aspect-[4/5] w-[min(92vw,calc((100svh-9rem)*4/5))]" : "aspect-video w-[min(92vw,calc((100svh-9rem)*16/9))]"
          )}
        >
          <video src={film.src} poster={film.poster} autoPlay muted playsInline controls className="h-full w-full object-cover" />
        </motion.div>
        <motion.button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label="Close the film"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          className="pointer-events-auto grid size-11 cursor-pointer place-items-center rounded-full bg-white/12 text-white backdrop-blur-xl transition-colors hover:bg-white/20"
        >
          <X className="size-5" strokeWidth={2} />
        </motion.button>
      </div>
    </div>,
    document.body
  );
}
