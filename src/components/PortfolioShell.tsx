"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExecutiveImpactSection from "@/components/ExecutiveImpactSection";
import DigitalFactoriesSection from "@/components/DigitalFactoriesSection";
import SelectedProductsSection from "@/components/SelectedProductsSection";
import ArchitectureStrategySection from "@/components/ArchitectureStrategySection";
import ExecutiveCaseStudiesSection from "@/components/ExecutiveCaseStudiesSection";
import ExperienceTimelineSection from "@/components/ExperienceTimelineSection";
import LeadershipPhilosophySection from "@/components/LeadershipPhilosophySection";
import ContactSection from "@/components/ContactSection";
import ExecutiveDossierModal from "@/components/ExecutiveDossierModal";

export default function PortfolioShell() {
  const [dossierOpen, setDossierOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#cbd5e1]">
      <Navbar onOpenDossier={() => setDossierOpen(true)} />
      <main>
        <HeroSection onOpenDossier={() => setDossierOpen(true)} />
        <ExecutiveImpactSection />
        <DigitalFactoriesSection />
        <SelectedProductsSection />
        <ArchitectureStrategySection />
        <ExecutiveCaseStudiesSection />
        <ExperienceTimelineSection />
        <LeadershipPhilosophySection />
      </main>
      <ContactSection onOpenDossier={() => setDossierOpen(true)} />
      <ExecutiveDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
      />
    </div>
  );
}
