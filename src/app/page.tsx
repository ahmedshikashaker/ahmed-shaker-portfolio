import React from "react";
import Header from "@/components/launch/Header";
import Hero from "@/components/launch/Hero";
import Premise from "@/components/launch/Premise";
import Factories from "@/components/launch/Factories";
import Ecosystems from "@/components/launch/Ecosystems";
import TrackRecord from "@/components/launch/TrackRecord";
import Writing from "@/components/launch/Writing";
import Contact from "@/components/launch/Contact";
import { LAUNCH_FONT_CSS } from "@/components/launch/fonts";
import BriefDrawer from "@/components/BriefDrawer";
import ExecutiveDossierModal from "@/components/ExecutiveDossierModal";
import {
  EXECUTIVE_PROFILE,
  ARABIC_EXECUTIVE_BRIEF,
} from "@/data/portfolioData";
import { getAllPosts } from "@/lib/blog";

/**
 * The home page as a product launch, in bands that alternate light and dark:
 * Overview → Digital Factories → Ecosystems → Track Record → Writing, then contact.
 */
export default async function HomePage() {
  const posts = await getAllPosts();
  return (
    <>
      {/* The launch faces, and a page canvas that matches the bands at both ends of an overscroll. */}
      <style>{`${LAUNCH_FONT_CSS}html{scroll-padding-top:3.25rem;background-color:#fff}`}</style>
      <div className="no-print relative isolate">
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          <div id="overview">
            <Hero />
            <Premise />
          </div>
          <Factories />
          <Ecosystems />
          <TrackRecord />
          <Writing posts={posts} />
        </main>
        <Contact />
      </div>
      <BriefDrawer />
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
