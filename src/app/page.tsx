import React from "react";
import type { Metadata } from "next";
import Header from "@/components/launch/Header";
import Hero from "@/components/launch/Hero";
import Premise from "@/components/launch/Premise";
import Factories from "@/components/launch/Factories";
import Ecosystems from "@/components/launch/Ecosystems";
import TrackRecord from "@/components/launch/TrackRecord";
import Writing from "@/components/launch/Writing";
import Contact from "@/components/launch/Contact";
import BriefDrawer from "@/components/BriefDrawer";
import ExecutiveDossierModal from "@/components/ExecutiveDossierModal";
import { PLATFORM_REGISTRY } from "@/data/portfolioData";
import { getAllPosts, SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": [{ url: `${SITE_URL}/blog/rss.xml`, title: "Ahmed Shaker — Blog" }],
    },
  },
};

/** The profile page itself and the platforms it presents; the Person node comes from the root layout. */
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: "Ahmed Shaker — Head of Digital Technology & Banking Digital Factory Architect",
      description:
        "Official executive technology portfolio of Ahmed Shaker (أحمد شاكر), Head of Digital Technology at Kuwait International Bank (KIB) and former Android Chapter Lead at Warba Bank.",
      inLanguage: ["en", "ar"],
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#platforms`,
      name: "Production Platforms Delivered & Directed by Ahmed Shaker",
      numberOfItems: PLATFORM_REGISTRY.length,
      itemListElement: PLATFORM_REGISTRY.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "SoftwareApplication",
          name: p.name,
          applicationCategory: p.category,
          operatingSystem: p.platforms.join(", "),
          description: p.tagline,
          author: { "@id": `${SITE_URL}/#person` },
        },
      })),
    },
  ],
};

/**
 * The home page as a product launch, in bands that alternate light and dark:
 * Overview → Digital Factories → Ecosystems → Track Record → Writing, then contact.
 */
export default async function HomePage() {
  const posts = await getAllPosts();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      {/* Anchors land just under the slim header, and an overscroll at the top matches the white opening band. */}
      <style>{"html{scroll-padding-top:3.25rem;background-color:#fff}"}</style>
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
    </>
  );
}
