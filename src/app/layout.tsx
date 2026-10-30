import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Newsreader } from "next/font/google";
import "./globals.css";
import { EXECUTIVE_CASE_STUDIES, EXECUTIVE_PROFILE, SELECTED_PRODUCTS } from "@/data/portfolioData";
import { AppProviders } from "@/components/site/AppProviders";
import { SiteCanvas } from "@/components/site/SiteCanvas";
import { getAllPosts } from "@/lib/blog";
import type { PaletteIndex } from "@/lib/site";
import { THEME_COLORS, themeInitScript } from "@/lib/theme";

// Display serif with an optical-size axis: sharper contrast at headline sizes, calmer at text sizes.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500"],
});

// Same superfamily as the Latin UI face, so Arabic and English share one voice. Not preloaded:
// English pages pay no cost.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const viewport: Viewport = {
  themeColor: THEME_COLORS.dark,
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
  description:
    "Official portfolio of Ahmed Shaker (أحمد شاكر), Head of Digital Technology at Kuwait International Bank (KIB) and former Android Chapter Lead at Warba Bank. Key builder of two banking Digital Factories from scratch and 16+ enterprise platforms across Mobile, Backend Microservices, and Cloud-Native DevOps.",
  applicationName: "Ahmed Shaker Portfolio",
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": [{ url: `${SITE_URL}/blog/rss.xml`, title: "Ahmed Shaker — Blog" }],
    },
  },
  keywords: [
    "Ahmed Shaker",
    "Ahmed Mahmoud Nady Shaker",
    "أحمد شاكر",
    "Ahmed Shaker KIB",
    "Ahmed Shaker Kuwait",
    "Ahmed Shaker Warba Bank",
    "Head of Digital Technology",
    "Kuwait International Bank",
    "KIB Digital Factory",
    "Warba Bank",
    "Al-Wateen Digital Factory",
    "Digital Banking Executive",
    "Digital Transformation Leader",
    "Banking Technology Architect",
    "KIB Mobile",
    "KIB Corporate",
    "KIB Aqari",
    "KIB Invest",
    "BuyNow by KIB",
    "WAGE by KIB",
    "Al Muzaini BIN Sponsorship",
    "UBA Mobile Banking",
    "EduWave",
    "MedXJordan",
    "Great Tafsirs",
    "Advicenode",
  ],
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
    siteName: "Ahmed Shaker (www.ahmed-shaker.com)",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Ahmed Shaker — Head of Digital Technology | Digital Banking Architect",
    description:
      "Architecting Digital Factories & production-grade banking ecosystems at Kuwait International Bank (KIB) and Warba Bank.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
    products: SELECTED_PRODUCTS.map((p) => ({ id: p.id, name: p.name, institution: p.institution, iconPath: p.iconPath })),
    cases: EXECUTIVE_CASE_STUDIES.map((c) => ({ id: c.id, title: c.title, category: c.category })),
    posts: posts.slice(0, 12).map((p) => ({ slug: p.slug, title: p.title, language: p.language })),
    contact: { email: EXECUTIVE_PROFILE.contact.email, linkedin: EXECUTIVE_PROFILE.contact.linkedin },
  };

  const jsonLd = {
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
        mainEntity: {
          "@id": `${SITE_URL}/#person`,
        },
      },
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
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#platforms`,
        name: "Production Platforms Delivered & Directed by Ahmed Shaker",
        numberOfItems: SELECTED_PRODUCTS.length,
        itemListElement: SELECTED_PRODUCTS.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "SoftwareApplication",
            name: p.name,
            applicationCategory: p.category,
            operatingSystem: p.platforms.join(", "),
            description: p.tagline,
            author: {
              "@id": `${SITE_URL}/#person`,
            },
          },
        })),
      },
    ],
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable} ${plexArabic.variable}`}
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
        <SiteCanvas />
        <AppProviders paletteIndex={paletteIndex}>{children}</AppProviders>
      </body>
    </html>
  );
}
