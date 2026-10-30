"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FileText, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { BrandMark, Kbd } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";
import { emit, openDossier, PORTFOLIO_EVENTS, scrollToSection } from "@/lib/events";
import { useActiveSection, useEscape, useFocusTrap, useScrollLock } from "@/lib/hooks";
import { EASE_IN_OUT, EASE_OUT, SPRING } from "@/lib/motion";
import { NAV_SECTION_IDS, SECTIONS } from "@/lib/site";

const NAV_LINKS = SECTIONS.filter((section) => NAV_SECTION_IDS.includes(section.id));
const MENU_LINKS = SECTIONS;

interface SiteHeaderProps {
  variant?: "home" | "blog";
}

export default function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const isHome = variant === "home";
  const active = useActiveSection(isHome ? NAV_SECTION_IDS : []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shortcut, setShortcut] = useState("⌘K");
  const { scrollY, scrollYProgress } = useScroll();

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.userAgent)) setShortcut("Ctrl K");
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    if (y < 420 || previous - y > 6) setHidden(false);
    else if (y - previous > 6) setHidden(true);
  });

  const go = useCallback(
    (id: string) => {
      setMenuOpen(false);
      if (isHome) requestAnimationFrame(() => scrollToSection(id));
      else window.location.assign(`/#${id}`);
    },
    [isHome]
  );

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent print:hidden"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? "-130%" : "0%", opacity: 1 }}
        transition={{ ...SPRING, opacity: { duration: 0.6, ease: EASE_OUT } }}
        onFocusCapture={() => setHidden(false)}
        className="fixed inset-x-0 top-0 z-50 print:hidden"
      >
        <div className="shell pt-3 sm:pt-4">
          <div
            className={cn(
              "flex h-14 items-center justify-between gap-3 rounded-full border pl-2.5 pr-1.5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
              scrolled || !isHome
                ? "border-line-2 bg-bg/75 shadow-float backdrop-blur-xl"
                : "border-transparent bg-transparent"
            )}
          >
            <Link
              href="/"
              onClick={(event) => {
                if (!isHome) return;
                event.preventDefault();
                scrollToSection("hero");
              }}
              className="group flex min-w-0 items-center gap-2.5 rounded-full py-1 pr-2"
              aria-label="Ahmed Shaker, back to top"
            >
              <BrandMark className="size-7 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5" />
              <span className="flex min-w-0 flex-col leading-none">
                <span className="truncate font-display text-[17px] text-fg">Ahmed Shaker</span>
                <span className="eyebrow mt-1 hidden truncate text-[9.5px] tracking-[0.16em] text-fg-3 sm:block">
                  Head of Digital Technology · KIB
                </span>
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden xl:block">
              <ul className="flex items-center">
                {NAV_LINKS.map((link) => {
                  const current = isHome && active === link.id;
                  return (
                    <li key={link.id}>
                      <a
                        href={isHome ? `#${link.id}` : `/#${link.id}`}
                        onClick={(event) => {
                          if (!isHome) return;
                          event.preventDefault();
                          go(link.id);
                        }}
                        aria-current={current ? "location" : undefined}
                        className={cn(
                          "relative block rounded-full px-3.5 py-2 text-[13px] transition-colors duration-200",
                          current ? "text-fg" : "text-fg-3 hover:text-fg"
                        )}
                      >
                        {current && (
                          <motion.span layoutId="nav-active" transition={SPRING} className="absolute inset-0 rounded-full border border-line-2 bg-surface-2" />
                        )}
                        <span className="relative">{link.short}</span>
                      </a>
                    </li>
                  );
                })}
                <li>
                  <Link
                    href="/blog"
                    aria-current={!isHome ? "page" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-[13px] transition-colors duration-200",
                      !isHome ? "text-fg" : "text-fg-3 hover:text-fg"
                    )}
                  >
                    {!isHome && <span className="absolute inset-0 rounded-full border border-line-2 bg-surface-2" />}
                    <span className="relative">Writing</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => emit(PORTFOLIO_EVENTS.openPalette)}
                className="hidden h-9 cursor-pointer items-center gap-2 rounded-full border border-line px-3 text-[12.5px] text-fg-3 transition-colors hover:border-line-2 hover:text-fg md:inline-flex"
                aria-label="Search and jump to anything"
              >
                <Search className="size-3.5" strokeWidth={1.75} />
                <span className="hidden 2xl:inline">Jump to</span>
                <Kbd className="h-[18px] text-[9.5px]">{shortcut}</Kbd>
              </button>
              <button
                type="button"
                onClick={() => emit(PORTFOLIO_EVENTS.openPalette)}
                className="grid size-9 cursor-pointer place-items-center rounded-full text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg md:hidden"
                aria-label="Search and jump to anything"
              >
                <Search className="size-[17px]" strokeWidth={1.75} />
              </button>
              <ThemeToggle />
              <Button
                variant="secondary"
                size="sm"
                onClick={openDossier}
                className="hidden sm:inline-flex"
                iconLeading={<FileText className="size-3.5 text-accent" strokeWidth={1.75} />}
              >
                CV
              </Button>
              <Button variant="primary" size="sm" onClick={() => go("contact")} className="hidden lg:inline-flex" icon={<ArrowGlyph className="size-3.5" />}>
                Contact
              </Button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                aria-label="Open menu"
                className="grid size-10 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 xl:hidden"
              >
                <span aria-hidden="true" className="flex w-[18px] flex-col gap-[5px]">
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-2/3 self-end bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={go} isHome={isHome} active={active} />
    </>
  );
}

function SiteMenu({
  open,
  onClose,
  onNavigate,
  isHome,
  active,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  isHome: boolean;
  active: string | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(open);
  useFocusTrap(panelRef, open);
  useEscape(onClose, open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="site-menu"
          id="site-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.45, ease: EASE_IN_OUT, delay: 0.05 } }}
          transition={{ duration: 0.6, ease: EASE_IN_OUT }}
          className="fixed inset-0 z-[70] overflow-y-auto bg-bg print:hidden xl:hidden"
        >
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60 mask-fade-b" aria-hidden="true" />
          <div className="shell relative flex min-h-full flex-col pb-8 pt-3 sm:pt-4">
            <div className="flex h-14 items-center justify-between pl-2.5 pr-1.5">
              <span className="flex items-center gap-2.5">
                <BrandMark className="size-7" />
                <span className="font-display text-[17px] text-fg">Ahmed Shaker</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                data-autofocus
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-line-2 text-fg transition-colors hover:bg-surface-2"
              >
                <span aria-hidden="true" className="relative block size-[14px]">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <nav aria-label="Sections" className="mt-8">
              <ol>
                {MENU_LINKS.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.18 + i * 0.045, duration: 0.7, ease: EASE_OUT } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    <a
                      href={isHome ? `#${link.id}` : `/#${link.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onNavigate(link.id);
                      }}
                      className="group flex items-baseline gap-4 border-b border-line py-3.5"
                    >
                      <span className="eyebrow numeric w-6 shrink-0 text-accent">{link.index || "·"}</span>
                      <span
                        className={cn(
                          "font-display text-[clamp(1.85rem,7vw,2.75rem)] leading-none transition-colors",
                          isHome && active === link.id ? "text-accent" : "text-fg group-hover:text-accent"
                        )}
                      >
                        {link.label}
                      </span>
                      <span className="ml-auto hidden text-[12px] text-fg-4 sm:block">{link.hint}</span>
                      <ArrowGlyph className="ml-3 size-4 self-center text-fg-3" />
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.18 + MENU_LINKS.length * 0.045, duration: 0.7, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <Link href="/blog" onClick={onClose} className="group flex items-baseline gap-4 border-b border-line py-3.5">
                    <span className="eyebrow w-6 shrink-0 text-accent">·</span>
                    <span className="font-display text-[clamp(1.85rem,7vw,2.75rem)] leading-none text-fg transition-colors group-hover:text-accent">
                      Writing
                    </span>
                    <span className="ml-auto hidden text-[12px] text-fg-4 sm:block">Articles in English & العربية</span>
                    <ArrowGlyph className="ml-3 size-4 self-center text-fg-3" />
                  </Link>
                </motion.li>
              </ol>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.6 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="mt-auto flex flex-wrap items-center gap-3 pt-10"
            >
              <Button
                variant="secondary"
                onClick={() => {
                  onClose();
                  openDossier();
                }}
                iconLeading={<FileText className="size-4 text-accent" strokeWidth={1.75} />}
              >
                Executive CV
              </Button>
              <Button variant="primary" onClick={() => onNavigate("contact")} icon={<ArrowGlyph />}>
                Contact
              </Button>
              <span className="ml-auto flex items-center gap-2 text-[12px] text-fg-3">
                Theme <ThemeToggle className="border border-line" />
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
