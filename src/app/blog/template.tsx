"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/**
 * True once any blog page has hydrated in this tab. The first page a reader lands on is server-rendered
 * fully visible (no opacity:0 waiting for JavaScript, which delayed LCP by ~3 s on mobile and left
 * no-JS readers with a blank page); only later client-side moves get the entrance.
 */
let hydratedOnce = false;

/** Re-mounts on every blog navigation, giving index ↔ article moves a calm entrance. */
export default function BlogTemplate({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hydratedOnce);
  useEffect(() => {
    hydratedOnce = true;
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 18 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
