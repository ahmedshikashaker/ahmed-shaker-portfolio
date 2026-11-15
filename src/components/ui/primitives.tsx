"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-2 bg-surface px-1 font-mono text-[10px] font-medium text-fg-3",
        className
      )}
    >
      {children}
    </kbd>
  );
}

const KUWAIT_TIME = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kuwait",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Live local time in Kuwait (client-only to avoid hydration mismatch). */
export function KuwaitTime({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <time className={cn("numeric", className)} dateTime={now?.toISOString()}>
      {now ? KUWAIT_TIME.format(now) : "--:--"}
    </time>
  );
}
