import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Four corner ticks that frame a block like a drawing sheet. */
export function CornerTicks({ className }: { className?: string }) {
  const tick = "absolute size-2.5 border-accent-deep/70";
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(tick, "left-0 top-0 border-l border-t")} />
      <span className={cn(tick, "right-0 top-0 border-r border-t")} />
      <span className={cn(tick, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(tick, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}

export function Eyebrow({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("eyebrow flex items-center gap-3 text-fg-3", className)}>
      {index && <span className="numeric text-accent">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-8 bg-line-3" />}
      <span>{children}</span>
    </div>
  );
}
