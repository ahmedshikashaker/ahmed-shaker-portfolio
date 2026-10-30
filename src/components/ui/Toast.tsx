"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Info } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SPRING } from "@/lib/motion";

type Tone = "success" | "error" | "info";
type Notify = (message: string, tone?: Tone) => void;

interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}

const ToastContext = createContext<Notify>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = { success: Check, error: AlertCircle, info: Info } as const;

/** Bottom-centre feedback toasts, announced politely to screen readers. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const notify = useCallback<Notify>((message, tone = "success") => {
    const id = ++counter.current;
    setItems((list) => [...list.slice(-2), { id, message, tone }]);
    window.setTimeout(() => setItems((list) => list.filter((item) => item.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[130] flex flex-col items-center gap-2 px-4 print:hidden"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = ICONS[item.tone];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.18 } }}
                transition={SPRING}
                className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-line-2 bg-surface-2/95 py-2 pl-2 pr-4 text-[13px] text-fg shadow-float backdrop-blur-xl"
              >
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full",
                    item.tone === "error" ? "bg-danger/15 text-danger" : item.tone === "info" ? "bg-accent/15 text-accent" : "bg-signal/15 text-signal"
                  )}
                >
                  <Icon className="size-3.5" strokeWidth={2.25} />
                </span>
                {item.message}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
