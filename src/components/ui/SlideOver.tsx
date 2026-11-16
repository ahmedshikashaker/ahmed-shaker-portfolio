"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useEscape, useFocusTrap, useScrollLock } from "@/lib/hooks";
import { EASE_IN_OUT } from "@/lib/motion";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  /** id of the element inside the panel that names the dialog. */
  labelledBy: string;
  closeLabel: string;
  /** Leading content of the top bar (what is being read). */
  header?: ReactNode;
  /** Controls shown before the close button. */
  actions?: ReactNode;
  /** Fills the area under the top bar; the content owns its own scrolling. */
  children: ReactNode;
}

/**
 * Reader sheet that springs in from the inline-end edge, in the home page's launch style (it follows the site's
 * light or dark theme). Modal: page scroll is locked, focus is trapped inside and returned to the trigger on close,
 * and Escape or a backdrop click closes it.
 */
export function SlideOver({ open, onClose, labelledBy, closeLabel, header, actions, children }: SlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(open);
  useFocusTrap(panelRef, open);
  useEscape(onClose, open);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] print:hidden">
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ x: "105%" }}
            animate={{ x: "0%" }}
            exit={{ x: "105%", transition: { duration: 0.4, ease: EASE_IN_OUT } }}
            transition={{ type: "spring", stiffness: 240, damping: 34, mass: 0.9 }}
            className="tone-auto absolute inset-y-0 end-0 flex w-full max-w-[46rem] flex-col overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.55)] sm:inset-y-3 sm:end-3 sm:rounded-[28px]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-l-line py-3 pe-4 ps-5 sm:pe-5 sm:ps-9">
              <div className="min-w-0">{header}</div>
              <div className="flex shrink-0 items-center gap-1">
                {actions}
                <button
                  type="button"
                  onClick={onClose}
                  data-autofocus
                  aria-label={closeLabel}
                  className="ms-2 grid size-9 cursor-pointer place-items-center rounded-full bg-l-card text-l-fg transition-colors duration-150 hover:bg-l-card-2"
                >
                  <X className="size-4" strokeWidth={2.2} />
                </button>
              </div>
            </div>
            <div className="relative min-h-0 flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
