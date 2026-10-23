"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowUpRight, Menu, X } from "lucide-react";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";

interface NavbarProps {
  onOpenDossier: () => void;
}

const NAV_LINKS = [
  { id: "impact", label: "Overview" },
  { id: "digital-factories", label: "Digital Factories" },
  { id: "products", label: "Products (16)" },
  { id: "architecture", label: "Architecture" },
  { id: "case-studies", label: "Case Studies" },
  { id: "experience", label: "Career" },
];

export default function Navbar({ onOpenDossier }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      const sectionIds = ["hero", ...NAV_LINKS.map((item) => item.id), "contact"];
      let current = "hero";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-200/[0.08] py-3 shadow-lg shadow-slate-950/40"
          : "bg-[#0f172a]/70 backdrop-blur-md border-b border-slate-200/[0.05] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: Clean Brand Identity */}
        <button
          onClick={() => scrollToSection("hero")}
          className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-[#182338] border border-[#d4b982]/40 flex items-center justify-center text-[#dfc490] font-tech text-xs font-semibold group-hover:border-[#d4b982] transition-colors">
            AS
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100 tracking-tight group-hover:text-[#dfc490] transition-colors">
              {EXECUTIVE_PROFILE.name}
            </div>
            <div className="text-[11px] text-slate-400">
              Head of Digital Technology · KIB
            </div>
          </div>
        </button>

        {/* Zone 2: Well-Spaced Centered Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-xl bg-[#131c31]/90 border border-slate-200/[0.07]"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="cleanNavIndicator"
                    className="absolute inset-0 rounded-lg bg-[#dfc490]"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Two Clear Executive Actions */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenDossier}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-200 bg-[#182338] hover:bg-[#1e2b45] border border-slate-200/[0.1] transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#dfc490]" />
            <span>CV / Dossier</span>
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-[#dfc490] hover:bg-[#e8d1a4] transition-colors cursor-pointer"
          >
            <span>Contact</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenDossier}
            className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-medium text-[#dfc490] bg-[#182338] border border-[#d4b982]/30"
          >
            CV
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-200 hover:bg-[#182338] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#131c31] border-b border-slate-200/[0.08] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#dfc490]/15 text-[#dfc490]"
                        : "text-slate-300 hover:bg-[#182338]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-3 mt-2 border-t border-slate-200/[0.08] grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDossier();
                  }}
                  className="py-2.5 rounded-lg text-xs font-medium text-slate-200 bg-[#182338] border border-slate-200/[0.1]"
                >
                  CV / Dossier
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-[#dfc490]"
                >
                  Contact
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
