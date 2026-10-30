"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { PORTFOLIO_EVENTS } from "@/lib/events";
import { useWindowEvent } from "@/lib/hooks";
import { EASE_OUT } from "@/lib/motion";
import { applyTheme, readTheme, type Theme } from "@/lib/theme";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => setTheme(readTheme()), []);
  useWindowEvent<Theme>(PORTFOLIO_EVENTS.themeChange, (next) => setTheme(next));

  const current = theme ?? "dark";
  const next: Theme = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        applyTheme(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={next === "light" ? "Switch to Paper (light) theme" : "Switch to Ink (dark) theme"}
      title={next === "light" ? "Paper theme" : "Ink theme"}
      className={cn(
        "relative grid size-9 cursor-pointer place-items-center rounded-full text-fg-3 transition-colors duration-200 hover:bg-surface-2 hover:text-fg",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ opacity: 0, rotate: -70, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.5 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
          className="grid place-items-center"
        >
          {current === "dark" ? <Sun className="size-[17px]" strokeWidth={1.75} /> : <Moon className="size-[17px]" strokeWidth={1.75} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
