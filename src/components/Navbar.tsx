"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Layers,
  Smartphone,
  Briefcase,
  Cpu,
  ShieldCheck,
  Mail,
  FileText,
  Menu,
  X,
  ArrowUpRight,
  Globe,
} from "lucide-react";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";

interface NavbarProps {
  onOpenDossier: () => void;
}

const NAV_ITEMS = [
  { id: "impact", label: "Executive Impact", icon: ShieldCheck },
  { id: "digital-factories", label: "2 Digital Factories", icon: Building2, highlight: true },
  { id: "products", label: "Banking Products", icon: Smartphone },
  { id: "architecture", label: "Architecture & Stack", icon: Cpu },
  { id: "experience", label: "Career Timeline", icon: Briefcase },
  { id: "leadership", label: "Leadership", icon: Layers },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function Navbar({ onOpenDossier }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kuwaitTime, setKuwaitTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kuwait",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setKuwaitTime(formatter.format(new Date()));
      } catch {
        setKuwaitTime("UTC+3");
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);

      const sectionIds = ["hero", ...NAV_ITEMS.map((item) => item.id)];
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
          ? "py-3 bg-[#05070b]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
          : "py-5 bg-gradient-to-b from-[#05070b]/90 via-[#05070b]/50 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <button
          onClick={() => scrollToSection("hero")}
          className="group flex items-center gap-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded-xl"
          aria-label="Ahmed Shaker — Return to top"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-500/5 to-emerald-500/15 border border-amber-400/40 group-hover:border-amber-300 transition-colors">
            <span className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-tight text-amber-200">
              AS
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#05070b]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-sm sm:text-base group-hover:text-amber-200 transition-colors">
                {EXECUTIVE_PROFILE.name}
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                <Globe className="w-2.5 h-2.5 text-amber-400" />
                KWI {kuwaitTime && `· ${kuwaitTime}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Head of Digital Technology · KIB
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.07] backdrop-blur-md"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? "text-slate-950 font-semibold"
                    : item.highlight
                    ? "text-amber-200/90 hover:text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Executive Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenDossier}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-amber-400/40 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Executive Dossier</span>
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:brightness-110 transition-all shadow-[0_0_25px_rgba(212,175,55,0.25)] cursor-pointer"
          >
            <span>Initiate Dialogue</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenDossier}
            className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-200 bg-amber-500/10 border border-amber-400/30"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CV</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-200 hover:text-white focus:outline-none"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#080c14]/98 backdrop-blur-2xl border-b border-white/[0.1] px-4 pt-3 pb-6 mt-3"
          >
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-400/15 text-amber-200 border border-amber-400/30"
                        : "text-slate-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-amber-400" />
                      {item.label}
                    </span>
                    {item.highlight && (
                      <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                        Signature
                      </span>
                    )}
                  </button>
                );
              })}
              <div className="pt-3 mt-2 border-t border-white/[0.08] grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDossier();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.06] border border-white/[0.12]"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  Executive Dossier
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-950 bg-amber-300"
                >
                  Initiate Dialogue
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
