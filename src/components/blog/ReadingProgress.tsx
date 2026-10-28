"use client";

import { useEffect, useState } from "react";

/** Thin champagne bar at the top of the viewport showing how far the reader has scrolled. */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("article-body");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? (scrolled / total) * 100 : 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[3px] bg-transparent" aria-hidden="true">
      <div className="h-full bg-gradient-to-r from-[#5eead4] to-[#dfc490] transition-[width] duration-100" style={{ width: `${progress}%` }} />
    </div>
  );
}
