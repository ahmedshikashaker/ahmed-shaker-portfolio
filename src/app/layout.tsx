import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Arabic, Inter, Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import {
  ARCHIVE_PLATFORMS,
  BRIEFS,
  EXECUTIVE_CASE_STUDIES,
  EXECUTIVE_PROFILE,
  FLAGSHIP_PLATFORMS,
} from "@/data/portfolioData";
import { AppProviders } from "@/components/site/AppProviders";
import { getAllPosts } from "@/lib/blog";
import type { PaletteIndex } from "@/lib/site";
import { THEME_COLORS, themeInitScript } from "@/lib/theme";

// Display headings (bold statements, numbers) and text: the launch faces, site-wide.
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-launch-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-launch-text",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500"],
});

// Arabic posts. Not preloaded:
// English pages pay no cost.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
  width: "device-width",
  initialScale: 1,
};

const SITE_URL = "https://www.ahmed-shaker.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Ahmed Shaker | Head of Digital Technology at KIB & Digital Factory Architect",
    template: "%s | Ahmed Shaker",
  },
  // Search results show about 155 characters of a description.
  description:
    "Ahmed Shaker (أحمد شاكر), Head of Digital Technology at Kuwait International Bank (KIB). Key builder of two banking digital factories and 16+ platforms.",
  applicationName: "Ahmed Shaker Portfolio",
  // No canonical here: every page sets its own, and an inherited one would point stray pages at the home page.
  alternates: {
    types: {
      "application/rss+xml": [{ url: `${SITE_URL}/blog/rss.xml`, title: "Ahmed Shaker — Blog" }],
    },
  },
  authors: [
    { name: "Ahmed Shaker", url: SITE_URL },
    { name: "Ahmed Shaker", url: EXECUTIVE_PROFILE.contact.linkedin },
  ],
  creator: "Ahmed Shaker",
  publisher: "Ahmed Shaker",
  category: "Technology & Banking Leadership",
  openGraph: {
    type: "profile",
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: ["ar_KW"],
    firstName: "Ahmed",
    lastName: "Shaker",
    username: "ahmed-shaker",
    title:
      "Ahmed Shaker — Head of Digital Technology at KIB & Digital Factory Architect",
    description:
      "Official executive portfolio of Ahmed Shaker (أحمد شاكر). 10+ years building and scaling regulated banking Digital Factories and 16+ platforms at KIB, Warba Bank, UBA, Advicenode, and ITG.",
    siteName: "Ahmed Shaker",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Ahmed Shaker — Head of Digital Technology | Digital Banking Architect",
    description:
      "Architecting Digital Factories & production-grade banking ecosystems at Kuwait International Bank (KIB) and Warba Bank.",
  },
  // Indexing is the default, so only the preview allowances are stated. An explicit "index, follow"
  // here was inherited by the 404 page, which then carried both "noindex" and "index, follow".
  robots: {
    googleBot: {
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getAllPosts();
  const paletteIndex: PaletteIndex = {
    platforms: [...FLAGSHIP_PLATFORMS, ...ARCHIVE_PLATFORMS].map((p) => ({ id: p.id, name: p.name, institution: p.institution, iconPath: p.iconPath })),
    briefs: EXECUTIVE_CASE_STUDIES.map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      section: Object.values(BRIEFS).find((brief) => brief.id === c.id)?.section ?? "ecosystems",
    })),
    posts: posts.slice(0, 12).map((p) => ({ slug: p.slug, title: p.title, language: p.language })),
    contact: { email: EXECUTIVE_PROFILE.contact.email, linkedin: EXECUTIVE_PROFILE.contact.linkedin },
  };

  // Site-wide entities only: the Person every post's author points to, and the WebSite.
  // The ProfilePage and the platform list describe the home page, so they live there.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Ahmed Shaker",
        alternateName: [
          "Ahmed Mahmoud Nady Shaker",
          "أحمد شاكر",
          "Ahmed Shaker KIB",
        ],
        url: SITE_URL,
        image: `${SITE_URL}/assets/profile/ahmed-shaker-portrait.jpg`,
        jobTitle: EXECUTIVE_PROFILE.title,
        worksFor: {
          "@type": "BankOrCreditUnion",
          name: "Kuwait International Bank (KIB)",
          url: "https://www.kib.com.kw",
        },
        alumniOf: [
          {
            "@type": "CollegeOrUniversity",
            name: "Faculty of Computer and Information Sciences, Ain Shams University",
          },
          {
            "@type": "BankOrCreditUnion",
            name: "Warba Bank",
            url: "https://www.warbabank.com",
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kuwait City",
          addressCountry: "KW",
        },
        email: EXECUTIVE_PROFILE.contact.email,
        telephone: EXECUTIVE_PROFILE.contact.phone,
        sameAs: [
          EXECUTIVE_PROFILE.contact.linkedin,
          EXECUTIVE_PROFILE.contact.github,
          EXECUTIVE_PROFILE.contact.stackoverflow,
          SITE_URL,
        ],
        knowsAbout: [
          "Digital Banking Transformation",
          "Banking Digital Factory Architecture",
          "FinTech & BaaS BIN Sponsorship",
          "Android Architecture (Kotlin, Java)",
          "iOS & Flutter Multi-Platform Engineering",
          "Backend Microservices (NestJS, Java EE, Kafka, RabbitMQ)",
          "Cloud-Native DevOps (Kubernetes, Argo CD, Jenkins)",
        ],
        description: EXECUTIVE_PROFILE.shortBio,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Ahmed Shaker",
        alternateName: [
          "Ahmed Shaker Portfolio",
          "أحمد شاكر",
          "Ahmed Mahmoud Nady Shaker",
        ],
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${interTight.variable} ${inter.variable} ${plexMono.variable} ${plexArabic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* Extensions such as Grammarly stamp data-* attributes on <body> before React hydrates;
          this ignores attribute differences on <body> itself only, never its children. */}
      <body className="bg-bg font-sans text-fg-2 antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="skip-link no-print">
          Skip to content
        </a>
        <AppProviders paletteIndex={paletteIndex}>{children}</AppProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
