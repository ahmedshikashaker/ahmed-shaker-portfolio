"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SPRING } from "@/lib/motion";

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  count?: number;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
}

/** Radio-group style switcher with a sliding pill; arrow keys move and select. */
export function SegmentedControl<T extends string>({ options, value, onChange, label, size = "md", className }: SegmentedControlProps<T>) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const count = options.length;
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? count - 1 : (index + (forward ? 1 : -1) + count) % count;
    refs.current[next]?.focus();
    onChange(options[next].value);
  };

  return (
    <LayoutGroup id={id}>
      <motion.div
        layoutScroll
        role="radiogroup"
        aria-label={label}
        className={cn(
          "no-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-line bg-surface/60 p-1 backdrop-blur-sm",
          className
        )}
      >
        {options.map((option, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={option.value}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "relative shrink-0 cursor-pointer rounded-full font-medium outline-offset-2 transition-colors duration-200",
                size === "sm" ? "h-8 px-3 text-[12.5px]" : "h-9 px-4 text-[13px]",
                selected ? "text-[var(--c-btn-fg)]" : "text-fg-3 hover:text-fg"
              )}
            >
              {selected && (
                <motion.span layoutId="segment-pill" className="absolute inset-0 rounded-full bg-[var(--c-btn-bg)]" transition={SPRING} />
              )}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {option.label}
                {option.count !== undefined && (
                  <span className={cn("numeric text-[11px]", selected ? "opacity-70" : "text-fg-4")}>{option.count}</span>
                )}
              </span>
            </button>
          );
        })}
      </motion.div>
    </LayoutGroup>
  );
}
