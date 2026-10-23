import React from "react";
import PortfolioShell from "@/components/PortfolioShell";
import {
  EXECUTIVE_PROFILE,
  ARABIC_EXECUTIVE_BRIEF,
} from "@/data/portfolioData";

export default function HomePage() {
  return (
    <>
      <PortfolioShell />
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
