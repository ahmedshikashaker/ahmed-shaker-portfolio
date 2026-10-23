"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";

interface NavbarProps {
  onOpenDossier: () => void;
}

const NAV_ITEMS = [
  { id: "digital-factories", index: "01", label: "Digital Factories" },
  { id: "products", index: "02", label: "Selected Works (11)" },
  { id: "architecture", index: "03", label: "Architecture" },
  { id: "experience", index: "04", label: "Chronicle" },
  { id: "leadership", index: "05", label: "Doctrine" },
  { id: "contact", index: "06", label: "Contact" },
];

export default function Navbar({ onOpenDossier }: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kuwaitTime, setKuwaitTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kuwait",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setKuwaitTime(formatter.format(new Date()));
      } catch {
        setKuwaitTime("AST UTC+3");
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["hero", "impact", ...NAV_ITEMS.map((item) => item.id)];
      let current = "hero";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080807]/90 backdrop-blur-md border-b border-[#F4F0E8]/[0.1]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Monogram & Identity */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => scrollToSection("hero")}
            className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 border border-[#C8A464]/60 text-[#C8A464] font-tech text-xs font-semibold tracking-tighter group-hover:bg-[#C8A464] group-hover:text-[#080807] transition-colors">
              AS
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#F4F0E8]">
                {EXECUTIVE_PROFILE.name}
              </span>
              <span className="text-[10px] font-tech text-[#9A958B] tracking-wider">
                HEAD OF DIGITAL TECHNOLOGY · KIB
              </span>
            </div>
          </button>

          {/* Live Coordinates & Clock */}
          <div className="hidden xl:flex items-center gap-2 pl-6 border-l border-[#F4F0E8]/[0.1] text-[11px] font-tech text-[#9A958B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A464] animate-pulse" />
            <span>KWI 29.37°N</span>
            <span className="text-[#F4F0E8]/30">/</span>
            <span className="text-[#F4F0E8] tabular-nums">{kuwaitTime || "UTC+3"}</span>
          </div>
        </div>

        {/* Center: Swiss Numbered Index Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center h-full"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative h-full px-4 flex items-center gap-1.5 text-xs tracking-wide transition-colors cursor-pointer border-l border-[#F4F0E8]/[0.06] last:border-r ${
                  isActive
                    ? "text-[#C8A464] font-semibold bg-[#F4F0E8]/[0.03]"
                    : "text-[#9A958B] hover:text-[#F4F0E8]"
                }`}
              >
                <span className="font-tech text-[10px] text-[#C8A464]/80">
                  {item.index}
                </span>
                <span className="uppercase tracking-[0.08em] text-[11px]">
                  {item.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="swissNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A464]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Executive Dossier & Direct Dialogue */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenDossier}
            className="px-3.5 py-2 text-[11px] font-tech uppercase tracking-[0.12em] text-[#F4F0E8] border border-[#F4F0E8]/20 hover:border-[#C8A464] hover:text-[#C8A464] transition-colors cursor-pointer"
          >
            Board Dossier [CV]
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-tech font-semibold uppercase tracking-[0.12em] bg-[#C8A464] text-[#080807] hover:bg-[#d8b77a] transition-colors cursor-pointer"
          >
            <span>Dialogue</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenDossier}
            className="sm:hidden px-2.5 py-1.5 text-[10px] font-tech uppercase tracking-wider border border-[#C8A464]/50 text-[#C8A464]"
          >
            Dossier
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F4F0E8] hover:text-[#C8A464] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Full-Width Editorial Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#080807] border-b border-[#F4F0E8]/15 overflow-hidden"
          >
            <div className="divide-y divide-[#F4F0E8]/10">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F4F0E8]/[0.03]"
                >
                  <span className="text-sm uppercase tracking-[0.12em] font-semibold text-[#F4F0E8]">
                    {item.label}
                  </span>
                  <span className="font-tech text-xs text-[#C8A464]">
                    /{item.index}
                  </span>
                </button>
              ))}
              <div className="p-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDossier();
                  }}
                  className="py-3 text-center text-xs font-tech uppercase tracking-widest border border-[#F4F0E8]/25 text-[#F4F0E8]"
                >
                  Board Dossier
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="py-3 text-center text-xs font-tech font-semibold uppercase tracking-widest bg-[#C8A464] text-[#080807]"
                >
                  Initiate Dialogue
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
