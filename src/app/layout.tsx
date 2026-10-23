import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
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
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#080807",
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
    "BIN Sponsorship",
    "Banking as a Service",
    "Kuwait FinTech",
  ],
  authors: [{ name: "Ahmed Shaker", url: EXECUTIVE_PROFILE.contact.linkedin }],
  creator: "Ahmed Shaker",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Ahmed Shaker — Head of Digital Technology & Digital Factory Architect",
    description:
      "10+ years building and scaling regulated banking platforms across Mobile, Backend Microservices, and DevOps. Key leader in establishing the Digital Factories at Kuwait International Bank (KIB) and Warba Bank.",
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
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#080807] text-[#F4F0E8] font-[family-name:var(--font-sans)] antialiased selection:bg-[#C8A464]/30 selection:text-[#F4F0E8] overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Subtle Architectural Film Grain Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[60] opacity-[0.028] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
