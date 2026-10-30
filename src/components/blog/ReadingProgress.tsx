"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/** Champagne bar at the top of the viewport tracking progress through #article-body. */
export default function ReadingProgress() {
  const { scrollY } = useScroll();
  const [range, setRange] = useState<[number, number]>([0, 1]);

  useEffect(() => {
    const measure = () => {
      const el = document.getElementById("article-body");
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3;
      const end = top + el.offsetHeight - window.innerHeight * 0.7;
      setRange([top, Math.max(end, top + 1)]);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const progress = useTransform(scrollY, range, [0, 1]);
  const scaleX = useSpring(progress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[61] h-[3px] origin-left bg-gradient-to-r from-signal via-accent to-accent print:hidden"
      style={{ scaleX }}
    />
  );
}
