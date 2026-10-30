"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Copy,
  CornerDownLeft,
  FileText,
  Hash,
  Linkedin,
  Mail,
  MoonStar,
  PenLine,
  Rss,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Kbd } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { emit, openDossier, PORTFOLIO_EVENTS, scrollToSection } from "@/lib/events";
import { copyText, useEscape, useFocusTrap, useScrollLock, useWindowEvent } from "@/lib/hooks";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { SECTIONS, type PaletteIndex } from "@/lib/site";
import { applyTheme, readTheme } from "@/lib/theme";

type Group = "Sections" | "Platforms" | "Case studies" | "Writing" | "Actions";
const GROUP_ORDER: Group[] = ["Sections", "Platforms", "Case studies", "Writing", "Actions"];

interface Command {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  perform: () => void;
}

function score(command: Command, query: string) {
  const label = command.label.toLowerCase();
  if (label.startsWith(query)) return 4;
  if (label.split(/[\s(—–-]+/).some((word) => word.startsWith(query))) return 3;
  if (label.includes(query)) return 2;
  const extra = `${command.hint ?? ""} ${command.keywords ?? ""}`.toLowerCase();
  return extra.includes(query) ? 1 : 0;
}

const iconBox = "grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-bg/60 text-fg-3";

export default function CommandPalette({ index }: { index: PaletteIndex }) {
  const pathname = usePathname();
  const router = useRouter();
  const notify = useToast();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const disabled = pathname?.startsWith("/keystatic") ?? false;
  const isHome = pathname === "/";

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (disabled) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [disabled]);

  useWindowEvent(PORTFOLIO_EVENTS.openPalette, () => {
    if (!disabled) setOpen(true);
  });
  useScrollLock(open);
  useFocusTrap(panelRef, open);
  useEscape(close, open);

  const commands = useMemo<Command[]>(() => {
    const goSection = (id: string) => (isHome ? scrollToSection(id) : router.push(`/#${id}`));
    const list: Command[] = [];

    for (const section of SECTIONS) {
      list.push({
        id: `section-${section.id}`,
        group: "Sections",
        label: section.label,
        hint: section.hint,
        icon: (
          <span className={cn(iconBox, "font-mono text-[10.5px] text-accent")}>
            {section.index || <Hash className="size-3.5" />}
          </span>
        ),
        perform: () => goSection(section.id),
      });
    }

    for (const product of index.products) {
      list.push({
        id: `product-${product.id}`,
        group: "Platforms",
        label: product.name,
        hint: product.institution,
        keywords: "app platform product",
        icon: product.iconPath ? (
          <span className="relative block size-8 shrink-0 overflow-hidden rounded-lg border border-line">
            <Image src={product.iconPath} alt="" fill sizes="32px" className="object-cover" />
          </span>
        ) : (
          <span className={cn(iconBox, "font-mono text-[9px] uppercase text-accent")}>{product.name.slice(0, 2)}</span>
        ),
        perform: () =>
          isHome ? emit(PORTFOLIO_EVENTS.selectProduct, product.id) : router.push(`/?product=${product.id}#products`),
      });
    }

    for (const study of index.cases) {
      list.push({
        id: `case-${study.id}`,
        group: "Case studies",
        label: study.title,
        hint: study.category,
        keywords: "briefing case study",
        icon: (
          <span className={iconBox}>
            <BookOpen className="size-3.5" strokeWidth={1.75} />
          </span>
        ),
        perform: () => (isHome ? emit(PORTFOLIO_EVENTS.openCase, study.id) : router.push(`/?case=${study.id}#case-studies`)),
      });
    }

    for (const post of index.posts) {
      list.push({
        id: `post-${post.slug}`,
        group: "Writing",
        label: post.title,
        hint: post.language === "ar" ? "مقال بالعربية" : "Article",
        keywords: "blog article writing",
        icon: (
          <span className={iconBox}>
            <PenLine className="size-3.5" strokeWidth={1.75} />
          </span>
        ),
        perform: () => router.push(`/blog/${post.slug}`),
      });
    }

    list.push(
      {
        id: "action-cv",
        group: "Actions",
        label: "Open the executive CV",
        hint: "Printable 1-page A4 · English & العربية",
        keywords: "resume dossier print pdf",
        icon: (
          <span className={iconBox}>
            <FileText className="size-3.5 text-accent" strokeWidth={1.75} />
          </span>
        ),
        perform: openDossier,
      },
      {
        id: "action-copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: index.contact.email,
        keywords: "contact mail",
        icon: (
          <span className={iconBox}>
            <Copy className="size-3.5" strokeWidth={1.75} />
          </span>
        ),
        perform: async () => {
          const result = await copyText(index.contact.email);
          notify(result === "copied" ? "Email address copied" : "Couldn't copy. Select the address manually.", result === "copied" ? "success" : "error");
        },
      },
      {
        id: "action-email",
        group: "Actions",
        label: "Write an email",
        hint: "Opens your mail app",
        keywords: "contact mail compose",
        icon: (
          <span className={iconBox}>
            <Mail className="size-3.5" strokeWidth={1.75} />
          </span>
        ),
        perform: () => window.location.assign(`mailto:${index.contact.email}`),
      },
      {
        id: "action-linkedin",
        group: "Actions",
        label: "Open LinkedIn profile",
        keywords: "social profile",
        icon: (
          <span className={iconBox}>
            <Linkedin className="size-3.5" strokeWidth={1.75} />
          </span>
        ),
        perform: () => window.open(index.contact.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "action-theme",
        group: "Actions",
        label: "Switch colour theme",
        hint: "Ink (dark) ↔ Paper (light)",
        keywords: "dark light mode appearance",
        icon: (
          <span className={iconBox}>
            <MoonStar className="size-3.5" strokeWidth={1.75} />
          </span>
        ),
        perform: () => applyTheme(readTheme() === "dark" ? "light" : "dark"),
      },
      {
        id: "action-blog",
        group: "Actions",
        label: "Browse all articles",
        keywords: "blog writing",
        icon: (
          <span className={iconBox}>
            <PenLine className="size-3.5" strokeWidth={1.75} />
          </span>
        ),
        perform: () => router.push("/blog"),
      },
      {
        id: "action-rss",
        group: "Actions",
        label: "Subscribe via RSS",
        keywords: "feed",
        icon: (
          <span className={iconBox}>
            <Rss className="size-3.5" strokeWidth={1.75} />
          </span>
        ),
        perform: () => window.open("/blog/rss.xml", "_blank", "noopener"),
      }
    );

    return list;
  }, [index, isHome, router, notify]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands
      .map((command) => ({ command, rank: score(command, q) }))
      .filter((entry) => entry.rank > 0)
      .sort((a, b) => GROUP_ORDER.indexOf(a.command.group) - GROUP_ORDER.indexOf(b.command.group) || b.rank - a.rank)
      .map((entry) => entry.command);
  }, [commands, query]);

  const groups = useMemo(() => {
    let flat = 0;
    return GROUP_ORDER.map((group) => ({
      group,
      items: results.filter((command) => command.group === group).map((command) => ({ command, flat: flat++ })),
    })).filter((entry) => entry.items.length > 0);
  }, [results]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-flat="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const run = (command: Command | undefined) => {
    if (!command) return;
    close();
    window.setTimeout(command.perform, 60);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[activeIndex]);
    }
  };

  if (disabled) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="palette" className="fixed inset-0 z-[110] print:hidden" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search and jump"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985, transition: { duration: 0.15 } }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="relative mx-auto mt-[9vh] flex max-h-[80vh] w-[min(660px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-float"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-accent" strokeWidth={1.75} />
              <input
                data-autofocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Jump to a section, platform, case study…"
                aria-label="Search the portfolio"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-results"
                aria-activedescendant={results.length ? `palette-item-${activeIndex}` : undefined}
                autoComplete="off"
                spellCheck={false}
                className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-4"
              />
              <Kbd>Esc</Kbd>
            </div>

            <motion.div layoutScroll ref={listRef} id="palette-results" role="listbox" className="flex-1 overflow-y-auto overscroll-contain p-2">
              {groups.map(({ group, items }) => (
                <div key={group} role="group" aria-label={group}>
                  <div className="eyebrow px-3 pb-1.5 pt-3 text-fg-4">{group}</div>
                  {items.map(({ command, flat }) => {
                    const selected = flat === activeIndex;
                    return (
                      <div
                        key={command.id}
                        id={`palette-item-${flat}`}
                        data-flat={flat}
                        role="option"
                        aria-selected={selected}
                        onMouseMove={() => setActiveIndex(flat)}
                        onClick={() => run(command)}
                        className="relative flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2"
                      >
                        {selected && (
                          <motion.span layoutId="palette-active" transition={SPRING} className="absolute inset-0 rounded-xl border border-line bg-surface-2" />
                        )}
                        <span className="relative flex shrink-0">{command.icon}</span>
                        <span className="relative min-w-0 flex-1">
                          <span className={cn("block truncate text-[14px]", selected ? "text-fg" : "text-fg-2")}>{command.label}</span>
                          {command.hint && <span className="block truncate text-[12px] text-fg-3">{command.hint}</span>}
                        </span>
                        <CornerDownLeft className={cn("relative size-3.5 shrink-0 text-fg-3 transition-opacity", selected ? "opacity-100" : "opacity-0")} />
                      </div>
                    );
                  })}
                </div>
              ))}

              {results.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-[15px] text-fg">No matches for “{query}”</p>
                  <p className="mt-1.5 text-[13px] text-fg-3">Try “KIB”, “Warba”, “Kubernetes” or “CV”.</p>
                </div>
              )}
            </motion.div>

            <div className="hidden items-center justify-between gap-4 border-t border-line px-4 py-2.5 text-[11.5px] text-fg-4 sm:flex">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                <span className="ml-1">navigate</span>
                <Kbd className="ml-3">↵</Kbd>
                <span className="ml-1">open</span>
              </span>
              <span>{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
