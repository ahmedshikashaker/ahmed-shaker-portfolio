import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { EXECUTIVE_PROFILE, SELECTED_PRODUCTS } from "@/data/portfolioData";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
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
    "Paytally",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      className={`${jakarta.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#0f172a] text-[#e2e8f0] font-[family-name:var(--font-sans)] antialiased selection:bg-[#d4b982]/25 selection:text-[#f8fafc] overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
