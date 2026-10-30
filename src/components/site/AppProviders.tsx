"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import type { PaletteIndex } from "@/lib/site";
import { watchSystemTheme } from "@/lib/theme";
import CommandPalette from "./CommandPalette";

export function AppProviders({ children, paletteIndex }: { children: ReactNode; paletteIndex: PaletteIndex }) {
  useEffect(() => watchSystemTheme(), []);

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        {children}
        <CommandPalette index={paletteIndex} />
      </ToastProvider>
    </MotionConfig>
  );
}
