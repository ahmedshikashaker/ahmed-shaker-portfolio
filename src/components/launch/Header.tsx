"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { emit, openDossier, PORTFOLIO_EVENTS, prefersReducedMotion, scrollToSection } from "@/lib/events";
import { useActiveSection, useEscape, useFocusTrap, useMediaQuery, useScrollLock } from "@/lib/hooks";
import { CONTACT_ID, LEGACY_ANCHORS, SECTION_IDS, SECTIONS, TOP_SECTION_ID, type SectionId } from "@/lib/site";
import { EASE } from "./motion";

const BAR = 52;

/** The tone of the band under the bar, so the glass reads light over light bands and dark over dark ones. */
function useToneUnderBar() {
  const [tone, setTone] = useState<"light" | "dark">("light");
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const line = BAR / 2;
      for (const band of document.querySelectorAll<HTMLElement>("[data-tone]")) {
        const rect = band.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) {
          setTone(band.dataset.tone === "dark" ? "dark" : "light");
          return;
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return tone;
}

/** The home page's bar: Apple-style glass, the five sections, search, CV and a Contact pill. */
export default function Header() {
  const active = useActiveSection(SECTION_IDS);
  const tone = useToneUnderBar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shortcut, setShortcut] = useState("⌘K");

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.userAgent)) setShortcut("Ctrl K");
  }, []);

  // Links shared before the page was reorganised still land on the matching section. With reduced motion the
  // pinned scenes collapse into plain layouts after hydration, so a section link is scrolled to once more.
  useEffect(() => {
    let frame = 0;
    const redirect = (initial: boolean) => {
      const hash = window.location.hash.slice(1);
      const legacy = Object.hasOwn(LEGACY_ANCHORS, hash) ? LEGACY_ANCHORS[hash] : null;
      const resettle = initial && prefersReducedMotion() && (SECTION_IDS.includes(hash as SectionId) || hash === CONTACT_ID) ? hash : null;
      const target = legacy ?? resettle;
      if (!target) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => scrollToSection(target));
      });
    };
    const onHashChange = () => redirect(false);
    redirect(true);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  // The full-screen menu only exists below the bar's breakpoint; close it if the viewport grows past it.
  const wide = useMediaQuery("(min-width: 1024px)");
  useEffect(() => {
    if (wide) setMenuOpen(false);
  }, [wide]);

  const go = useCallback((id: string) => {
    setMenuOpen(false);
    requestAnimationFrame(() => scrollToSection(id));
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -BAR }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        data-theme={tone}
        className={cn(
          `tone-${tone} launch fixed inset-x-0 top-0 z-50 h-[3.25rem] bg-transparent print:hidden`,
          "before:absolute before:inset-0 before:-z-10 before:border-b before:border-l-line before:bg-[var(--l-glass)] before:backdrop-blur-xl before:backdrop-saturate-[1.8] before:transition-colors before:duration-500"
        )}
      >
        <div className="mx-auto flex h-full max-w-[76rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(TOP_SECTION_ID);
            }}
            className="font-head text-[19px] font-semibold tracking-[-0.025em] text-l-fg transition-opacity hover:opacity-70"
            aria-label="Ahmed Shaker, back to top"
          >
            Ahmed Shaker
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {SECTIONS.map((link) => {
                const current = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        go(link.id);
                      }}
                      aria-current={current ? "location" : undefined}
                      className={cn(
                        "relative block rounded-full px-3 py-1.5 text-[13px] transition-colors duration-200",
                        current ? "text-l-fg" : "text-l-fg-3 hover:text-l-fg"
                      )}
                    >
                      {current && <motion.span layoutId="launch-nav" transition={{ type: "spring", stiffness: 380, damping: 34 }} className="absolute inset-0 rounded-full bg-l-fg/[0.07]" />}
                      <span className="relative">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => emit(PORTFOLIO_EVENTS.openPalette)}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-l-fg-2 transition-colors hover:bg-l-fg/[0.07] hover:text-l-fg"
              aria-label={`Search and jump to anything (${shortcut})`}
            >
              <Search className="size-[17px]" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={openDossier}
              aria-haspopup="dialog"
              className="hidden h-9 cursor-pointer items-center rounded-full px-3 text-[13px] text-l-fg-2 transition-colors hover:bg-l-fg/[0.07] hover:text-l-fg sm:inline-flex"
            >
              CV
            </button>
            <button type="button" onClick={() => go(CONTACT_ID)} className="l-btn l-btn-sm hidden h-8 px-3.5 text-[13px] lg:inline-flex">
              Contact
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="launch-menu"
              aria-label="Open menu"
              className="grid size-9 cursor-pointer place-items-center rounded-full text-l-fg transition-colors hover:bg-l-fg/[0.07] lg:hidden"
            >
              <span aria-hidden="true" className="flex w-[17px] flex-col gap-[5px]">
                <span className="h-[1.5px] w-full rounded-full bg-current" />
                <span className="h-[1.5px] w-full rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <Menu open={menuOpen} tone={tone} active={active} onClose={() => setMenuOpen(false)} onNavigate={go} />
    </>
  );
}

function Menu({
  open,
  tone,
  active,
  onClose,
  onNavigate,
}: {
  open: boolean;
  tone: "light" | "dark";
  active: string | null;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(open);
  useFocusTrap(panelRef, open);
  useEscape(onClose, open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="launch-menu"
          id="launch-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-theme={tone}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.3 }}
          className={cn(`tone-${tone} launch fixed inset-0 z-[70] overflow-y-auto print:hidden lg:hidden`)}
        >
          <div className="mx-auto flex min-h-full max-w-[76rem] flex-col px-5 pb-10 sm:px-8">
            <div className="flex h-[3.25rem] items-center justify-between">
              <span className="font-head text-[19px] font-semibold tracking-[-0.025em] text-l-fg">Ahmed Shaker</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                data-autofocus
                className="grid size-9 cursor-pointer place-items-center rounded-full text-l-fg transition-colors hover:bg-l-fg/[0.07]"
              >
                <span aria-hidden="true" className="relative block size-[15px]">
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-full rotate-45 rounded-full bg-current" />
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-full -rotate-45 rounded-full bg-current" />
                </span>
              </button>
            </div>
            <nav aria-label="Sections" className="mt-8">
              <ul className="space-y-1">
                {SECTIONS.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.06 + i * 0.04, duration: 0.6, ease: EASE } }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onNavigate(link.id);
                      }}
                      aria-current={active === link.id ? "location" : undefined}
                      className={cn(
                        "block py-2 font-head text-[clamp(2rem,9vw,2.75rem)] font-bold leading-tight tracking-[-0.035em] transition-colors",
                        active === link.id ? "text-l-accent" : "text-l-fg hover:text-l-fg-3"
                      )}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
              className="mt-auto flex flex-wrap items-center gap-3 pt-12"
            >
              <button type="button" onClick={() => onNavigate(CONTACT_ID)} className="l-btn">
                Contact
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openDossier();
                }}
                className="l-btn l-btn-plain"
              >
                Executive CV
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
