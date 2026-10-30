import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** CSS-only infinite ticker. Pauses on hover/focus; becomes a scrollable row with reduced motion. */
export function Marquee({ children, duration = 60, className }: { children: ReactNode; duration?: number; className?: string }) {
  return (
    <div className={cn("marquee mask-fade-x no-scrollbar relative flex overflow-hidden", className)}>
      <div className="marquee-track flex w-max shrink-0 animate-marquee" style={{ "--marquee-duration": `${duration}s` } as CSSProperties}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
