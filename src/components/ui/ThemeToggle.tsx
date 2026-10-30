"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { PORTFOLIO_EVENTS } from "@/lib/events";
import { useWindowEvent } from "@/lib/hooks";
import { applyTheme, readTheme, type Theme } from "@/lib/theme";

export function ThemeToggle({ className }: { className?: string }) {
  // Only the accessible label needs React state; the icon is driven by [data-theme] in CSS,
  // which the head script sets before first paint, so it is right even before hydration.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => setTheme(readTheme()), []);
  useWindowEvent<Theme>(PORTFOLIO_EVENTS.themeChange, (next) => setTheme(next));

  const label =
    theme === null ? "Switch colour theme" : theme === "dark" ? "Switch to Paper (light) theme" : "Switch to Ink (dark) theme";

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        applyTheme(readTheme() === "dark" ? "light" : "dark", { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-9 cursor-pointer place-items-center rounded-full text-fg-3 transition-colors duration-200 hover:bg-surface-2 hover:text-fg",
        className
      )}
    >
      <span aria-hidden="true" className="relative grid size-[17px] place-items-center">
        <Sun
          strokeWidth={1.75}
          className="absolute size-[17px] transition-[opacity,rotate,scale] duration-300 ease-out dark:rotate-0 dark:scale-100 dark:opacity-100 light:-rotate-90 light:scale-50 light:opacity-0"
        />
        <Moon
          strokeWidth={1.75}
          className="absolute size-[17px] transition-[opacity,rotate,scale] duration-300 ease-out light:rotate-0 light:scale-100 light:opacity-100 dark:rotate-90 dark:scale-50 dark:opacity-0"
        />
      </span>
    </button>
  );
}
