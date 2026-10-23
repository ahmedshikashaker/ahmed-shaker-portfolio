import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmedshaker.exec.tech"),
  title: {
    default: "Ahmed Shaker — Head of Digital Technology & Banking Digital Factory Architect",
    template: "%s | Ahmed Shaker",
  },
  description:
    "Executive portfolio of Ahmed Shaker, Head of Digital Technology at Kuwait International Bank (KIB) and former Android Chapter Lead at Warba Bank. Architect of two pioneering banking Digital Factories across Mobile, Backend Microservices, and Cloud-Native DevOps.",
  keywords: [
    "Ahmed Shaker",
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
    "EduWave",
    "MedXJordan",
    "Great Tafsirs",
    "Advicenode",
  ],
  authors: [{ name: "Ahmed Shaker", url: EXECUTIVE_PROFILE.contact.linkedin }],
  creator: "Ahmed Shaker",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Ahmed Shaker — Head of Digital Technology & Digital Factory Architect",
    description:
      "10+ years building and scaling regulated banking and enterprise platforms across Mobile, Backend Microservices, and DevOps.",
    siteName: "Ahmed Shaker · Executive Technology Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Shaker — Head of Digital Technology | Digital Banking Architect",
    description:
      "Architecting Digital Factories & production-grade banking ecosystems at Kuwait International Bank (KIB) and Warba Bank.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: EXECUTIVE_PROFILE.name,
    jobTitle: EXECUTIVE_PROFILE.title,
    worksFor: {
      "@type": "Organization",
      name: "Kuwait International Bank (KIB)",
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Faculty of Computer and Information Sciences, Ain Shams University",
      },
      {
        "@type": "Organization",
        name: "Warba Bank",
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
    ],
    description: EXECUTIVE_PROFILE.positioningSubheadline,
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
