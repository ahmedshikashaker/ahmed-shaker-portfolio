"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export default function TableOfContents({ items, language }: { items: TocItem[]; language: "en" | "ar" }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label={language === "ar" ? "محتويات المقال" : "Table of contents"}>
      <div className="text-xs font-tech uppercase tracking-wider text-[#dfc490] mb-3">
        {language === "ar" ? "في هذا المقال" : "On this page"}
      </div>
      <ul className="space-y-1.5 border-s border-slate-200/10">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block -ms-px border-s py-0.5 text-[13px] leading-snug transition-colors ${
                item.level === 3 ? "ps-6" : "ps-3"
              } ${
                active === item.id
                  ? "border-[#dfc490] text-[#dfc490] font-medium"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
