import React from "react";
import SiteHeader from "@/components/site/SiteHeader";
import HeroSection from "@/components/HeroSection";
import ExecutiveImpactSection from "@/components/ExecutiveImpactSection";
import DigitalFactoriesSection from "@/components/DigitalFactoriesSection";
import SelectedProductsSection from "@/components/SelectedProductsSection";
import ArchitectureStrategySection from "@/components/ArchitectureStrategySection";
import ExecutiveCaseStudiesSection from "@/components/ExecutiveCaseStudiesSection";
import ExperienceTimelineSection from "@/components/ExperienceTimelineSection";
import LeadershipPhilosophySection from "@/components/LeadershipPhilosophySection";
import LatestArticlesSection from "@/components/LatestArticlesSection";
import ContactSection from "@/components/ContactSection";
import ExecutiveDossierModal from "@/components/ExecutiveDossierModal";
import {
  EXECUTIVE_PROFILE,
  ARABIC_EXECUTIVE_BRIEF,
} from "@/data/portfolioData";
import { getAllPosts } from "@/lib/blog";

export default async function HomePage() {
  const latestPosts = (await getAllPosts()).slice(0, 3);
  const hasArticles = latestPosts.length > 0;
  return (
    <>
      <div className="no-print">
        <SiteHeader variant="home" />
        <main id="main" tabIndex={-1} className="outline-none">
          <HeroSection />
          <ExecutiveImpactSection />
          <DigitalFactoriesSection />
          <SelectedProductsSection />
          <ArchitectureStrategySection />
          <ExecutiveCaseStudiesSection />
          <ExperienceTimelineSection />
          <LeadershipPhilosophySection />
          <LatestArticlesSection posts={latestPosts} />
        </main>
        <ContactSection index={hasArticles ? "09" : "08"} />
      </div>
      <ExecutiveDossierModal />
      {/* Server-rendered bilingual identity anchor for search engine crawlers */}
      <aside className="sr-only" aria-label="Executive SEO Summary">
        <h2>
          {EXECUTIVE_PROFILE.name} (Ahmed Mahmoud Nady Shaker ·{" "}
          {ARABIC_EXECUTIVE_BRIEF.name}) — {EXECUTIVE_PROFILE.title} at Kuwait
          International Bank (KIB)
        </h2>
        <p>{EXECUTIVE_PROFILE.shortBio}</p>
        <p lang="ar" dir="rtl">
          {ARABIC_EXECUTIVE_BRIEF.name} — {ARABIC_EXECUTIVE_BRIEF.title}.{" "}
          {ARABIC_EXECUTIVE_BRIEF.summary}
        </p>
      </aside>
    </>
  );
}
