"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/** Re-mounts on every blog navigation, giving index ↔ article moves a calm entrance. */
export default function BlogTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE_OUT }}>
      {children}
    </motion.div>
  );
}
