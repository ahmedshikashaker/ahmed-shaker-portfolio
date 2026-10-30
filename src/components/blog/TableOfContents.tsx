"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { SPRING } from "@/lib/motion";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export default function TableOfContents({ items, language }: { items: TocItem[]; language: "en" | "ar" }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  // The active heading is the last one above a reading line near the top of the viewport.
  // Computed per frame on scroll, so fast scrolling can never skip a section.
  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = Math.min(160, window.innerHeight * 0.25);
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label={language === "ar" ? "محتويات المقال" : "Table of contents"}>
      <div className="eyebrow mb-4 text-fg-3">{language === "ar" ? "في هذا المقال" : "On this page"}</div>
      <ul className="relative space-y-0.5 border-s border-line-2">
        {items.map((item) => {
          const current = active === item.id;
          return (
            <li key={item.id} className="relative">
              {current && <motion.span layoutId="toc-active" transition={SPRING} className="absolute -start-px inset-y-0 w-px bg-accent" />}
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "block py-1.5 text-[13px] leading-snug transition-colors duration-200",
                  item.level === 3 ? "ps-7" : "ps-4",
                  current ? "text-fg" : "text-fg-4 hover:text-fg-2"
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
