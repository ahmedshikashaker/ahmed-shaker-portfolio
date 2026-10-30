"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import type { PaletteIndex } from "@/lib/site";
import CommandPalette from "./CommandPalette";

export function AppProviders({ children, paletteIndex }: { children: ReactNode; paletteIndex: PaletteIndex }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        {children}
        <CommandPalette index={paletteIndex} />
      </ToastProvider>
    </MotionConfig>
  );
}
