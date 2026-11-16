/**
 * Homepage content for ahmed-shaker.com: every visible word on the home page lives here.
 *
 * Copy budgets (checked when the page is edited):
 *   section subtitle ≤ 18 words · blueprint bullet ≤ 12 · platform outcome ≤ 18 · ledger mandate ≤ 22.
 * Long-form reasoning belongs on /blog or in a brief (see EXECUTIVE_CASE_STUDIES), never in a section.
 */

/* ------------------------------------------------------------------ Identity */

export const EXECUTIVE_PROFILE = {
  name: "Ahmed Shaker",
  title: "Head of Digital Technology",
  shortBio:
    "Digital transformation leader with 10+ years building and scaling banking and enterprise platforms across mobile, backend, and DevOps. Instrumental in establishing the digital factories at Kuwait International Bank and Warba Bank, delivering core mobile banking, wealth, real estate, remittance, BNPL, and loyalty products from the ground up.",
  location: "Kuwait City, Kuwait",
  timezone: "AST (UTC+3)",
  contact: {
    email: "ahmed.shika.shaker@gmail.com",
    phone: "+965 9441 8109",
    phoneClean: "+96594418109",
    linkedin: "https://www.linkedin.com/in/ahmed-shaker-492413a2/",
    github: "https://github.com/ahmedmshaker",
    stackoverflow: "https://stackoverflow.com/users/3972906",
  },
  education: {
    degree: "B.Sc. in Computer Science & Information Technology",
    institution: "Faculty of Computer and Information Sciences, Ain Shams University",
    location: "Cairo, Egypt",
    period: "2012 – 2016",
  },
};

/* ------------------------------------------------------------------ Section headers */

export interface SectionCopy {
  eyebrow: string;
  /** *Asterisks* mark the emphasised words. */
  title: string;
  /** One sentence, 18 words at most. */
  subtitle: string;
}

export const SECTION_COPY = {
  factories: {
    eyebrow: "Digital Factories",
    title: "Two regulated banks, two factories *built from zero.*",
    subtitle:
      "Warba Bank’s Al-Wateen, then KIB: the same operating blueprint, scaled from one chapter to eight product lines.",
  },
  blueprint: {
    eyebrow: "Operating blueprint",
    title: "How the factory *runs.*",
    subtitle: "Select a node to see the rule it enforces.",
  },
  ecosystems: {
    eyebrow: "Ecosystems",
    title: "Eight flagship platforms, *one architecture.*",
    subtitle: "Regulated retail, corporate, PropTech, wealth, BNPL and BaaS products, in production on shared rails.",
  },
  stack: {
    eyebrow: "Reference architecture",
    title: "Fast edge, *steady core.*",
    subtitle: "Four layers let product squads move fast while the regulated core changes deliberately.",
  },
  trackRecord: {
    eyebrow: "Track Record",
    title: "Ten years, *five mandates.*",
    subtitle: "From platform engineer in Cairo to executive ownership of a bank’s digital technology function.",
  },
  writing: {
    eyebrow: "Writing",
    title: "The reasoning, *in long form.*",
    subtitle: "Two essay series and standalone articles on digital transformation and governed AI, published on the blog.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Initiate an *executive conversation.*",
    subtitle:
      "Open to boards, CEOs and executive-search partners on technology mandates, Digital Factories and banking transformation.",
  },
} satisfies Record<string, SectionCopy>;

/* ------------------------------------------------------------------ 01 Overview */

export const OVERVIEW = {
  role: "Executive Manager – Head of Digital Technology",
  institution: "Kuwait International Bank (KIB)",
  /** *Asterisks* mark the emphasised words. */
  positioning: "Regulated-banking *Digital Factory* architect.",
  /** The opening statement, one line per row. */
  headline: ["*Digital Factory*", "architect."],
  lede: "Executive Manager – Head of Digital Technology at Kuwait International Bank.",
  /** Two sentences at most. */
  thesis: [
    "I build regulated banking Digital Factories from zero and ship multi-line revenue ecosystems through them.",
    "The bank keeps sovereign ownership of its core digital IP, with no vendor lock-in.",
  ],
};

export interface ProofMetric {
  id: string;
  value: string;
  label: string;
  detail: string;
}

export const PROOF_METRICS: ProofMetric[] = [
  {
    id: "factories",
    value: "2",
    label: "Regulated banking Digital Factories built from zero",
    detail: "Warba Al-Wateen & KIB",
  },
  {
    id: "lines",
    value: "8+",
    label: "Concurrent retail, corporate, PropTech, wealth & BNPL lines",
    detail: "KIB Digital Factory",
  },
  {
    id: "platforms",
    value: "16+",
    label: "Production banking, BaaS & enterprise platforms delivered",
    detail: "Live on the App Store & Google Play",
  },
  {
    id: "lock-in",
    value: "0",
    label: "Core digital IP vendor lock-in",
    detail: "Architecture, pipelines & code owned in-house",
  },
];

/* ------------------------------------------------------------------ The home page as a film */

export const STORY = {
  /** The opening narration: one sentence per screen, 12 words at most. *Asterisks* mark the accent words. */
  premise: [
    "Banks in the region relied on vendors for their digital channels.",
    "Slow releases. Inconsistent apps. *Someone else’s IP.*",
    "The alternative is a *Digital Factory* the bank owns.",
    "I have helped build two. *From zero.*",
  ],
  /** The horizontal engineering chapters every squad draws on (from the blueprint's chapter rule). */
  chapters: ["Android", "iOS", "Flutter", "Web", "Backend", "DevOps"],
  /** One line under the archive's title in the platform gallery. */
  archiveLine: "From remittance and loyalty to national EdTech, healthcare and advisory automation.",
};

/** The platform that pictures each factory business line; null for internal tools with no public app. */
export const LINE_PLATFORM: Record<string, string | null> = {
  "Retail mobile banking": "warba-mobile",
  "Lifestyle & loyalty · Fayez": "warba-fayez",
  "Youth savings · Hassala Kids": "warba-hassala-kids",
  Retail: "kib-mobile",
  Corporate: "kib-corporate",
  "PropTech · Aqari": "kib-aqari",
  "Wealth · Invest": "kib-invest",
  "BNPL · BuyNow": "kib-buynow",
  "Remittance · WAGE": "kib-remittance-wage",
  "BaaS · BIN Sponsorship": "kib-bin-sponsorship",
  Backoffice: null,
};

/* ------------------------------------------------------------------ 02 Digital Factories */

export interface FactoryProof {
  id: "warba" | "kib";
  numeral: "I" | "II";
  institution: string;
  factoryName: string;
  role: string;
  period: string;
  location: string;
  mandate: string;
  linesUnlocked: string[];
}

/** Chronological: Factory I (Warba Bank) → Factory II (KIB). */
export const FACTORIES: FactoryProof[] = [
  {
    id: "warba",
    numeral: "I",
    institution: "Warba Bank",
    factoryName: "Al-Wateen Digital Factory",
    role: "Android Chapter Lead",
    period: "Mar 2019 – Jun 2022",
    location: "Kuwait City, Kuwait",
    mandate: "Build the flagship mobile bank in-house and institute the mobile chapter’s release governance.",
    linesUnlocked: ["Retail mobile banking", "Lifestyle & loyalty · Fayez", "Youth savings · Hassala Kids"],
  },
  {
    id: "kib",
    numeral: "II",
    institution: "Kuwait International Bank (KIB)",
    factoryName: "KIB Digital Factory",
    role: "Executive Manager – Head of Digital Technology",
    period: "Jun 2022 – Present",
    location: "Kuwait City, Kuwait",
    mandate:
      "Own the bank’s digital technology function across mobile, web and backend, under one release-governance model.",
    linesUnlocked: [
      "Retail",
      "Corporate",
      "PropTech · Aqari",
      "Wealth · Invest",
      "BNPL · BuyNow",
      "Remittance · WAGE",
      "BaaS · BIN Sponsorship",
      "Backoffice",
    ],
  },
];

export interface BlueprintNode {
  id: string;
  code: string;
  title: string;
  /** The single architectural rule this node enforces. */
  rule: string;
  /** Three bullets at most, 12 words each at most. */
  bullets: string[];
}

export const FACTORY_BLUEPRINT: BlueprintNode[] = [
  {
    id: "mandate",
    code: "01",
    title: "Boardroom Mandate & BaaS Revenue",
    rule: "Technology investment is justified by new revenue lines and customer segments, not by digitised forms.",
    bullets: [
      "BuyNow and Aqari acquire customers who hold no KIB account.",
      "BIN Sponsorship turns the banking licence into partner card-issuing rails.",
      "First bank in Kuwait certified Visa Ready for Fintech Enablement.",
    ],
  },
  {
    id: "squads",
    code: "02",
    title: "Autonomous Vertical Squads",
    rule: "Each product line owns its roadmap and ships on its own cadence, inside shared architectural standards.",
    bullets: [
      "Dedicated product, design, mobile, web and backend engineers per squad.",
      "Eight verticals in parallel: retail, corporate, Aqari, Invest, BuyNow, WAGE, BaaS, backoffice.",
      "Core intellectual property stays in-house, with zero vendor lock-in.",
    ],
  },
  {
    id: "chapters",
    code: "03",
    title: "Horizontal Engineering Chapters",
    rule: "Chapters own how software is built; squads own what gets built.",
    bullets: [
      "Android, iOS, Flutter, web, backend and DevOps chapters set the standards.",
      "Chapter leads enforce code quality, SOLID architecture and shared libraries.",
      "One hiring bar and one review gate across every squad.",
    ],
  },
  {
    id: "governance",
    code: "04",
    title: "Automated Release & Risk Governance",
    rule: "Compliance runs in the pipeline, so every release is auditable by default.",
    bullets: [
      "OWASP mobile and API checks verified on every pull request.",
      "Declarative GitOps promotion through Kubernetes and Argo CD.",
      "Automated build, test and signing for iOS, Android and microservices.",
    ],
  },
];

/* ------------------------------------------------------------------ 03 Ecosystems */

export interface PlatformRecord {
  id: string;
  /** Canonical public name, as listed on the stores and in the page's structured data. */
  name: string;
  category: string;
  tagline: string;
  platforms: string[];
  screenshots?: string[];
  iconPath?: string;
  /** Public store or site listing, where one exists. */
  listing?: { store: string; href: string };
}

/**
 * Every public listing, one entry per store app. Feeds the JSON-LD ItemList in app/layout.tsx and
 * supplies icons and store links to the cards below. EduWave's three editions are separate store
 * apps here but count as one platform on the page (8 flagships + 8 earlier platforms = 16).
 */
export const PLATFORM_REGISTRY: PlatformRecord[] = [
  {
    id: "kib-mobile",
    name: "KIB Mobile (KIB Retail)",
    category: "Core Retail Mobile Banking",
    tagline:
      "Reimagined flagship retail banking experience for everyday accounts, WAMD instant payments, cards, and Islamic financing.",
    platforms: ["Android", "iOS", "Flutter", "Microservices"],
    screenshots: [
      "/assets/apps/screenshots/kib-mobile-1.jpg",
      "/assets/apps/screenshots/kib-mobile-2.jpg",
    ],
    iconPath: "/assets/apps/icons/kib-mobile.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/kw/app/kib-mobile/id409840829" },
  },
  {
    id: "kib-corporate",
    name: "KIB Corporate",
    category: "Commercial & Corporate Treasury Banking",
    tagline:
      "Enterprise-grade mobile and web corporate banking with multi-tier approval workflows and real-time commercial liquidity control.",
    platforms: ["Android", "iOS", "Web", "Microservices"],
    screenshots: [
      "/assets/apps/screenshots/kib-corporate-1.png",
      "/assets/apps/screenshots/kib-corporate-2.png",
    ],
    iconPath: "/assets/apps/icons/kib-corporate.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/kw/app/kib-corporate/id6456405889" },
  },
  {
    id: "kib-aqari",
    name: "KIB Aqari",
    category: "PropTech & Real Estate Platform",
    tagline:
      "Kuwait’s one-stop digital real estate ecosystem for automated rent collection, property management, and QR-verified official appraisals.",
    platforms: ["Android", "iOS", "Web", "Microservices"],
    screenshots: [
      "/assets/apps/screenshots/kib-aqari-1.jpg",
      "/assets/apps/screenshots/kib-aqari-2.jpg",
    ],
    iconPath: "/assets/apps/icons/kib-aqari.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/kw/app/kib-aqari/id6447563934" },
  },
  {
    id: "kib-invest",
    name: "KIB Invest",
    category: "Shariah-Compliant WealthTech",
    tagline:
      "100% digital investment onboarding and Shariah-compliant fund portfolio management.",
    platforms: ["Android", "iOS", "Flutter", "Microservices"],
    screenshots: [
      "/assets/apps/screenshots/kib-invest-1.jpg",
      "/assets/apps/screenshots/kib-invest-2.jpg",
    ],
    iconPath: "/assets/apps/icons/kib-invest.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/kw/app/kib-invest/id6745544920" },
  },
  {
    id: "kib-buynow",
    name: "BuyNow by KIB",
    category: "Bank-Led Marketplace & 0% Profit Financing",
    tagline:
      "Kuwait’s first bank-led digital marketplace and postpay financing platform—accessible without salary transfer.",
    platforms: ["Android", "iOS", "Web", "Microservices"],
    screenshots: [
      "/assets/apps/screenshots/kib-buynow-1.jpg",
      "/assets/apps/screenshots/kib-buynow-2.jpg",
    ],
    iconPath: "/assets/apps/icons/kib-buynow.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/kw/app/buynow-by-kib/id6472891180" },
  },
  {
    id: "kib-remittance-wage",
    name: "KIB Remittance & WAGE by KIB",
    category: "Remittance & Financial Inclusion",
    tagline:
      "Streamlined digital account onboarding, wage management, and cross-border remittance.",
    platforms: ["Android", "iOS", "Flutter", "Microservices"],
    screenshots: [
      "/assets/apps/screenshots/kib-wage-1.jpg",
      "/assets/apps/screenshots/kib-wage-2.jpg",
    ],
    iconPath: "/assets/apps/icons/kib-wage.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/kw/app/wage-by-kib/id6608959158" },
  },
  {
    id: "kib-bin-sponsorship",
    name: "KIB BIN Sponsorship & Multi-Tenant BaaS (Al Muzaini Travel)",
    category: "Banking-as-a-Service (BaaS) & Multi-Tenant Card Issuing",
    tagline:
      "Multi-tenant Visa-Ready BIN Sponsorship platform powering white-label multi-currency prepaid card apps (such as Al Muzaini Travel) and enterprise Backoffice portals.",
    platforms: ["BaaS API", "Microservices", "Android", "iOS", "Web"],
    screenshots: [
      "/assets/apps/screenshots/kib-muzaini-1.png",
      "/assets/apps/screenshots/kib-muzaini-2.png",
      "/assets/apps/screenshots/kib-muzaini-3.png",
      "/assets/apps/screenshots/kib-muzaini-4.png",
      "/assets/apps/screenshots/kib-muzaini-5.png",
    ],
    iconPath: "/assets/apps/icons/kib-muzaini.png",
  },
  {
    id: "warba-mobile",
    name: "Warba Bank Mobile Banking",
    category: "Flagship Retail Mobile Banking",
    tagline:
      "Architected, built, and managed Warba Bank’s core mobile banking app from scratch within the Al-Wateen Digital Factory.",
    platforms: ["Android", "iOS"],
    screenshots: [
      "/assets/apps/screenshots/warba-mobile-1.jpg",
      "/assets/apps/screenshots/warba-mobile-2.jpg",
    ],
    iconPath: "/assets/apps/icons/warba-mobile.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/kw/app/warba-bank/id925349051" },
  },
  {
    id: "warba-fayez",
    name: "Fayez & Fayez Admin",
    category: "Gamified Fitness, Loyalty & Flutter Web Admin",
    tagline:
      "Gamified lifestyle, step-tracking, and sports prediction ecosystem with a custom Flutter Web administration suite.",
    platforms: ["Android", "iOS", "Flutter", "Web"],
    screenshots: [
      "/assets/apps/screenshots/warba-fayez-1.png",
      "/assets/apps/screenshots/warba-fayez-2.png",
    ],
    iconPath: "/assets/apps/icons/warba-fayez.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/kw/app/fayez/id1292165363" },
  },
  {
    id: "warba-hassala-kids",
    name: "Hassala Kids",
    category: "Youth Digital Savings & Financial Literacy",
    tagline:
      "End-to-end digital savings application designed to cultivate financial literacy for children and families.",
    platforms: ["Android", "Flutter"],
  },
  {
    id: "itg-eduwave-k12",
    name: "EduWave K-12 (All Roles & Editions)",
    category: "National & Enterprise K-12 e-Learning Platform",
    tagline:
      "Restructured and redeveloped the flagship EduWave K-12 mobile platform serving students, parents, and teachers across large-scale educational deployments.",
    platforms: ["Android", "Flutter", "iOS"],
    screenshots: [
      "/assets/apps/screenshots/itg-eduwave-k12-1.jpg",
      "/assets/apps/screenshots/itg-eduwave-k12-2.png",
    ],
    iconPath: "/assets/apps/icons/itg-eduwave-k12.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/us/app/eduwave-k-12/id838521887" },
  },
  {
    id: "itg-eduwave-he",
    name: "EduWave Higher-ED",
    category: "University & Higher Education Management Platform",
    tagline:
      "Restructured and redeveloped the EduWave Higher Education mobile application for university students, faculty, and academic administration.",
    platforms: ["Android", "Flutter", "iOS"],
    screenshots: [
      "/assets/apps/screenshots/itg-eduwave-he-1.png",
      "/assets/apps/screenshots/itg-eduwave-he-2.jpg",
    ],
    iconPath: "/assets/apps/icons/itg-eduwave-he.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/us/app/eduwave-higher-ed/id1467754037" },
  },
  {
    id: "itg-eduwave-ams",
    name: "EduWave AMS (Assessment Management System)",
    category: "Digital Examination & Assessment Platform",
    tagline:
      "Specialized mobile assessment, outcomes tracking, and academic evaluation edition within the EduWave ecosystem.",
    platforms: ["Android", "iOS"],
    screenshots: [
      "/assets/apps/screenshots/itg-eduwave-ams-1.png",
      "/assets/apps/screenshots/itg-eduwave-ams-2.png",
    ],
    iconPath: "/assets/apps/icons/itg-eduwave-ams.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/us/app/eduwave-ams/id1459509452" },
  },
  {
    id: "itg-medxjordan",
    name: "MedXJordan",
    category: "National Medical Tourism & Healthcare Platform",
    tagline:
      "Single-point digital healthcare and medical tourism ecosystem connecting international patients with Jordan’s hospitals, physicians, and medical providers.",
    platforms: ["Android", "iOS"],
    screenshots: [
      "/assets/apps/screenshots/itg-medxjordan-1.png",
      "/assets/apps/screenshots/itg-medxjordan-2.png",
    ],
    iconPath: "/assets/apps/icons/itg-medxjordan.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/us/app/medxjordan/id1293654588" },
  },
  {
    id: "itg-great-tafsirs",
    name: "Great Tafsirs (التفاسير العظيمة)",
    category: "Islamic Scholarly Reference & Audio Library",
    tagline:
      "Comprehensive Holy Qur'an commentary (Tafsir), recitation, and Islamic scholarly reference platform.",
    platforms: ["Android", "iOS"],
    screenshots: [
      "/assets/apps/screenshots/itg-great-tafsirs-1.png",
      "/assets/apps/screenshots/itg-great-tafsirs-2.png",
    ],
    iconPath: "/assets/apps/icons/itg-great-tafsirs.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/us/app/great-tafsirs-%D8%A7%D9%84%D8%AA%D9%81%D8%A7%D8%B3%D9%8A%D8%B1-%D8%A7%D9%84%D8%B9%D8%B8%D9%8A%D9%85%D8%A9/id720856179" },
  },
  {
    id: "itg-alzakah",
    name: "Al-Zakah & Waqfiyat Khair Al-Urdun (وقفية خير الأردن)",
    category: "Islamic Social Finance & Zakat Calculation",
    tagline:
      "Digital Zakat calculation, endowment (Waqf) management, and charitable distribution application.",
    platforms: ["Android", "iOS"],
    screenshots: [
      "/assets/apps/screenshots/itg-alzakah-1.png",
      "/assets/apps/screenshots/itg-alzakah-2.png",
    ],
    iconPath: "/assets/apps/icons/itg-alzakah.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/us/app/%D9%88%D9%82%D9%81%D9%8A%D8%A9-%D8%AE%D9%8A%D8%B1-%D8%A7%D9%84%D8%A3%D8%B1%D8%AF%D9%86/id1244506618" },
  },
  {
    id: "uba-mobile-banking",
    name: "UBA Mobile Banking (Cordova-to-Flutter Modernization)",
    category: "Cross-Platform Banking Modernization",
    tagline:
      "Architectural migration of United Bank for Africa's mobile banking platform from legacy Cordova to high-performance Flutter.",
    platforms: ["Flutter", "Android", "iOS"],
    screenshots: [
      "/assets/apps/screenshots/uba-mobile-1.jpg",
      "/assets/apps/screenshots/uba-mobile-2.jpg",
      "/assets/apps/screenshots/uba-mobile-3.jpg",
      "/assets/apps/screenshots/uba-mobile-4.jpg",
    ],
    iconPath: "/assets/apps/icons/uba-mobile.jpg",
    listing: { store: "App Store", href: "https://apps.apple.com/kw/app/uba-mobile-banking/id1000669926" },
  },
  {
    id: "advicenode-platform",
    name: "Advicenode — AI Robo-Advisor & Virtual Assistant Platform Generator",
    category: "AI Advisory Automation & Dynamic App Builder",
    tagline:
      "Engineered a dynamic advisory automation platform capable of generating AI virtual assistants, decision-support bots, and domain-specific robo-advisor applications in under 24 hours.",
    platforms: ["Android", "Web", "Microservices"],
    iconPath: "/assets/apps/icons/advicenode.png",
    listing: { store: "Advicenode Official Blog", href: "https://tumblr.advicenode.com/" },
  },
];

export type FlagshipGroup = "core" | "beyond" | "regional";

export const FLAGSHIP_FILTERS: { value: "all" | FlagshipGroup; label: string }[] = [
  { value: "all", label: "All flagships" },
  { value: "core", label: "Core banking" },
  { value: "beyond", label: "Beyond banking & BaaS" },
  { value: "regional", label: "Regional scale" },
];

export interface PlatformCard {
  /** Id of the PLATFORM_REGISTRY entry that supplies the icon and store link. */
  id: string;
  name: string;
  institution: string;
  domain: string;
  /** One sentence, 18 words at most. */
  outcome: string;
  iconPath?: string;
  listing?: { store: string; href: string };
  /** Delivery surfaces (Android, iOS, Web…) and official store screenshots, from the registry. */
  platforms: string[];
  screenshots: string[];
}

export interface FlagshipPlatform extends PlatformCard {
  groups: FlagshipGroup[];
  /** One word set huge behind the platform's poster. */
  mark: string;
  /** Double-width tile in the unfiltered bento layout. */
  wide?: boolean;
}

type RegistryFields = "iconPath" | "listing" | "platforms" | "screenshots";

function card<T extends Omit<PlatformCard, RegistryFields>>(entry: T): T & Pick<PlatformCard, RegistryFields> {
  const record = PLATFORM_REGISTRY.find((platform) => platform.id === entry.id);
  return {
    ...entry,
    iconPath: record?.iconPath,
    listing: record?.listing,
    platforms: record?.platforms ?? [],
    screenshots: record?.screenshots ?? [],
  };
}

export const FLAGSHIP_PLATFORMS: FlagshipPlatform[] = [
  card({
    id: "kib-mobile",
    mark: "Retail",
    name: "KIB Mobile",
    institution: "KIB",
    domain: "Retail banking super-app",
    outcome: "KIB’s flagship retail app: accounts, WAMD instant payments, cards and Islamic financing in one channel.",
    groups: ["core"],
    wide: true,
  }),
  card({
    id: "kib-corporate",
    mark: "Corporate",
    name: "KIB Corporate",
    institution: "KIB",
    domain: "Corporate & treasury banking",
    outcome: "Maker-checker approvals and real-time liquidity control for corporate treasuries, on mobile and web.",
    groups: ["core"],
  }),
  card({
    id: "kib-aqari",
    mark: "Aqari",
    name: "KIB Aqari",
    institution: "KIB",
    domain: "PropTech & real estate",
    outcome: "Automated rent collection, property management and QR-verified bank appraisals in one real-estate platform.",
    groups: ["beyond"],
  }),
  card({
    id: "kib-invest",
    mark: "Invest",
    name: "KIB Invest",
    institution: "KIB",
    domain: "Shariah WealthTech",
    outcome:
      "Fully digital investment onboarding with PACI Mobile ID and e-signature, plus Shariah-compliant fund management.",
    groups: ["beyond"],
  }),
  card({
    id: "kib-buynow",
    mark: "BuyNow",
    name: "BuyNow by KIB",
    institution: "KIB",
    domain: "BNPL & merchant marketplace",
    outcome: "Kuwait’s first bank-led marketplace with 0% profit Islamic financing, open without a salary transfer.",
    groups: ["beyond"],
  }),
  card({
    id: "kib-bin-sponsorship",
    mark: "BaaS",
    name: "BIN Sponsorship · Al Muzaini Travel",
    institution: "KIB",
    domain: "BaaS & partner card issuing",
    outcome:
      "Multi-tenant card-issuing rails that let partners such as Al Muzaini launch multi-currency Visa prepaid cards.",
    groups: ["beyond"],
    wide: true,
  }),
  card({
    id: "warba-mobile",
    mark: "Warba",
    name: "Warba Bank Mobile",
    institution: "Warba Bank",
    domain: "Al-Wateen flagship retail banking",
    outcome: "Warba’s core retail app, architected and built in-house from a blank slate inside Al-Wateen.",
    groups: ["core", "regional"],
    wide: true,
  }),
  card({
    id: "uba-mobile-banking",
    mark: "UBA",
    name: "UBA Mobile Banking",
    institution: "UBA · Cit Global",
    domain: "Pan-African retail banking",
    outcome: "Pan-African mobile banking re-architected from Cordova to Flutter for performance and maintainability.",
    groups: ["core", "regional"],
    wide: true,
  }),
];

/** Earlier enterprise and national platforms, collapsed by default on the page. */
export const ARCHIVE_PLATFORMS: PlatformCard[] = [
  card({
    id: "kib-remittance-wage",
    name: "WAGE by KIB",
    institution: "KIB",
    domain: "Remittance & financial inclusion",
    outcome: "Digital onboarding, wage accounts and cross-border remittance for underserved segments.",
  }),
  card({
    id: "warba-fayez",
    name: "Fayez",
    institution: "Warba Bank",
    domain: "Lifestyle & loyalty",
    outcome: "Gamified fitness and prediction rewards, run from a Flutter Web admin portal.",
  }),
  card({
    id: "warba-hassala-kids",
    name: "Hassala Kids",
    institution: "Warba Bank",
    domain: "Youth savings",
    outcome: "A digital money box that teaches children to save toward goals.",
  }),
  card({
    id: "itg-eduwave-k12",
    name: "EduWave · K-12, Higher-ED & AMS",
    institution: "ITG Solutions",
    domain: "National EdTech",
    outcome: "Three learning-platform editions restructured on one shared mobile core.",
  }),
  card({
    id: "itg-medxjordan",
    name: "MedXJordan",
    institution: "ITG Solutions",
    domain: "Medical tourism",
    outcome: "Jordan’s medical-tourism gateway, re-architected for patients and providers.",
  }),
  card({
    id: "itg-great-tafsirs",
    name: "Great Tafsirs",
    institution: "ITG Solutions",
    domain: "Islamic scholarly reference",
    outcome: "Qur’anic commentary and recitation library with offline indexing.",
  }),
  card({
    id: "itg-alzakah",
    name: "Al-Zakah",
    institution: "ITG Solutions",
    domain: "Islamic social finance",
    outcome: "Rule-based Zakat calculation with endowment contributions.",
  }),
  card({
    id: "advicenode-platform",
    name: "Advicenode",
    institution: "Advicenode",
    domain: "Advisory automation",
    outcome: "An engine that generated robo-advisor apps from decision trees in under 24 hours.",
  }),
];

export interface StackLayer {
  id: string;
  code: string;
  name: string;
  /** Short label for the diagram's rail and plates. */
  short: string;
  /** One sentence: the mechanism this layer provides. */
  mechanism: string;
  tags: string[];
}

/** Top of the stack changes fastest; the bottom changes deliberately. */
export const ARCHITECTURE_STACK: StackLayer[] = [
  {
    id: "experience",
    code: "01",
    name: "Multi-Channel Experience & Design Systems",
    short: "Experience",
    mechanism: "Unified design tokens and resilient client apps across every customer channel.",
    tags: ["Native iOS", "Native Android", "Flutter", "Web"],
  },
  {
    id: "domain",
    code: "02",
    name: "Domain & Event Choreography",
    short: "Domain & events",
    mechanism: "DDD-bounded microservices and asynchronous event streaming, so squads deploy independently.",
    tags: ["Java", "NestJS", "Kafka", "RabbitMQ"],
  },
  {
    id: "platform",
    code: "03",
    name: "Cloud-Native Platform & GitOps Governance",
    short: "Platform & GitOps",
    mechanism: "Automated CI/CD, policy-as-code and zero-downtime orchestration on one delivery spine.",
    tags: ["Kubernetes", "Argo CD", "DevSecOps Gates"],
  },
  {
    id: "core",
    code: "04",
    name: "Regulated Core & BaaS Boundary",
    short: "Core & BaaS",
    mechanism: "Anti-corruption decoupling protects core banking ledgers while exposing partner and BaaS rails.",
    tags: ["Core Isolation", "BIN Sponsorship", "Open APIs"],
  },
];

/* ------------------------------------------------------------------ 04 Track Record */

export interface LedgerRow {
  id: string;
  period: string;
  institution: string;
  location: string;
  title: string;
  /** One sentence, 22 words at most. */
  mandate: string;
}

export const TRACK_RECORD: LedgerRow[] = [
  {
    id: "kib",
    period: "Jun 2022 – Present",
    institution: "Kuwait International Bank (KIB)",
    location: "Kuwait City, Kuwait",
    title: "Executive Manager – Head of Digital Technology",
    mandate:
      "Leads KIB’s digital technology function and Digital Factory, owning mobile, web and backend delivery across eight-plus retail, corporate and BaaS lines.",
  },
  {
    id: "warba",
    period: "Mar 2019 – Jun 2022",
    institution: "Warba Bank",
    location: "Kuwait City, Kuwait",
    title: "Android Chapter Lead",
    mandate:
      "Built Warba’s flagship mobile bank from scratch and instituted the mobile chapter’s release governance inside the Al-Wateen Digital Factory.",
  },
  {
    id: "cit-global",
    period: "Jan 2020 – Jan 2021",
    institution: "Cit Global · United Bank for Africa (UBA)",
    location: "Cairo, Egypt · Remote, part-time",
    title: "Mobile Consultant — Android & Flutter",
    mandate:
      "Defined the Flutter target architecture and led UBA Mobile Banking’s migration off Cordova while mentoring the in-house team.",
  },
  {
    id: "itg",
    period: "Nov 2017 – Mar 2019",
    institution: "ITG Solutions",
    location: "Amman / Cairo",
    title: "Senior Mobile Developer · Acting Android Lead",
    mandate:
      "Led the Android and Flutter teams restructuring national-scale EduWave, MedXJordan and Islamic-content platforms on shared, reusable mobile frameworks.",
  },
  {
    id: "advicenode",
    period: "Oct 2016 – Oct 2017",
    institution: "Advicenode",
    location: "Cairo, Egypt",
    title: "Software Engineer",
    mandate:
      "Engineered the core engine that generated robo-advisor and virtual-assistant applications from configurable decision trees in under 24 hours.",
  },
];

/* ------------------------------------------------------------------ Briefs (slide-over reader) */

export interface ExecutiveCaseStudy {
  id: string;
  index: string;
  category: string;
  title: string;
  subtitle: string;
  readTime: string;
  institutions: string[];
  executiveSummary: string;
  challenge: string;
  architecturalThesis: string;
  executionPillars: {
    heading: string;
    detail: string;
  }[];
  architecturalFlow: string[];
  verifiedOutcomes: string[];
  technologies: string[];
}

/** Where each brief is opened from on the home page. */
export const BRIEFS = {
  factory: { id: "case-digital-factories", section: "factories", label: "Read 4-min factory brief" },
  ecosystem: { id: "case-multi-vertical-ecosystem", section: "ecosystems", label: "Ecosystem architecture brief · 4 min" },
  platform: { id: "case-schema-driven-platforms", section: "ecosystems", label: "Platform engineering brief · 3 min" },
} as const;

/** Long-form case studies, read in the slide-over drawer rather than in the page flow. */
export const EXECUTIVE_CASE_STUDIES: ExecutiveCaseStudy[] = [
  {
    id: "case-digital-factories",
    index: "CASE STUDY 01",
    category: "Organizational & Platform Transformation",
    title: "Building Two Regulated Banking Digital Factories from Scratch",
    subtitle:
      "How Warba Bank ('Al-Wateen') and Kuwait International Bank (KIB) transitioned from vendor dependency to in-house, multi-product engineering sovereignty.",
    readTime: "4 min executive brief",
    institutions: ["Kuwait International Bank (KIB)", "Warba Bank"],
    executiveSummary:
      "Establishing a Digital Factory inside a regulated bank requires far more than hiring developers. It demands simultaneously designing the organizational squad matrix, defining a 5-year technology roadmap, standardizing modular client/microservice architectures, and automating release governance so multiple product lines can ship in parallel without compromising security.",
    challenge:
      "Traditional banks in the region historically relied on fragmented external vendors to build digital channels. This created slow release cycles, inconsistent UX across apps, brittle point-to-point core banking integrations, and zero internal ownership of strategic intellectual property.",
    architecturalThesis:
      "Treat the Digital Factory itself as a platform product: establish horizontal engineering chapters (Android, iOS, Flutter, Web, Backend, DevOps) that supply standardized architectures, CI/CD pipelines, and security primitives to autonomous vertical product squads.",
    executionPillars: [
      {
        heading: "Phase I — Foundational Blueprint at Warba Bank ('Al-Wateen')",
        detail:
          "As Android Chapter Lead, built the flagship Warba Bank mobile app from scratch using modular Kotlin/Java and Dagger/Hilt DI, established Jenkins CI/CD automation and Git release governance, and personally delivered innovative non-traditional banking apps including Fayez (gamified fitness & loyalty), Fayez Admin (Flutter Web), and Hassala Kids.",
      },
      {
        heading: "Phase II — Enterprise Multi-Vertical Scale at KIB",
        detail:
          "As Head of Digital Technology, co-architected KIB's Digital Factory from the ground up—expanding scope across mobile (Android, iOS, Flutter), Web, and backend microservices (NestJS, Java EE, Kafka, RabbitMQ) deployed via Kubernetes and Argo CD.",
      },
      {
        heading: "Phase III — Institutionalized Release & Security Governance",
        detail:
          "Embedded OWASP security standards, Domain-Driven Design (DDD), Test-Driven Development (TDD), and declarative GitOps into the daily engineering workflow—enabling 8+ concurrent product lines to ship reliably.",
      },
    ],
    architecturalFlow: [
      "Chapter Standards & Hiring Bar",
      "Modular SDKs & Design Tokens",
      "NestJS / Java DDD Microservices",
      "Jenkins + Argo CD / K8s GitOps",
      "8+ Live Banking Product Lines",
    ],
    verifiedOutcomes: [
      "Two operational Digital Factories established from zero in Kuwait's regulated Islamic banking sector.",
      "Scaled KIB's Digital Factory to concurrently power Retail, Corporate, Aqari (PropTech), Invest (WealthTech), BuyNow (BNPL), WAGE (Remittance), Backoffice, and BIN Sponsorship.",
      "Eliminated single-vendor bottlenecks by institutionalizing in-house architecture, CI/CD automation, and code ownership.",
    ],
    technologies: [
      "Kotlin",
      "Swift",
      "Flutter",
      "NestJS",
      "Java EE",
      "Kafka",
      "Kubernetes",
      "Argo CD",
      "Jenkins",
      "DDD",
    ],
  },
  {
    id: "case-multi-vertical-ecosystem",
    index: "CASE STUDY 02",
    category: "Enterprise Ecosystem Architecture",
    title: "Architecting Beyond Retail: PropTech, WealthTech, BNPL & BIN Sponsorship",
    subtitle:
      "Designing a decoupled microservice and multi-client architecture at KIB that turns a traditional bank into a multi-vertical digital ecosystem.",
    readTime: "4 min executive brief",
    institutions: ["Kuwait International Bank (KIB)"],
    executiveSummary:
      "Modern banking growth comes from embedding financial services into specialized customer journeys—real estate management, Shariah-compliant investments, 0%-profit merchant marketplaces, corporate treasury, and BaaS card issuing for external fintechs.",
    challenge:
      "Attempting to cram corporate maker-checker approvals, real estate appraisal verification, investment fund subscriptions, and consumer BNPL marketplaces into a single monolithic app creates cognitive overload for users and release gridlock for engineering teams.",
    architecturalThesis:
      "Combine a flagship Retail Super-App with specialized vertical companion platforms—all powered by a shared, event-driven microservice backbone (NestJS, Java EE, Kafka, RabbitMQ) and unified identity/security primitives.",
    executionPillars: [
      {
        heading: "Specialized Vertical Client Architecture",
        detail:
          "Directed dedicated product experiences tailored to each customer segment: KIB Mobile (Retail), KIB Corporate (multi-tier commercial approvals), KIB Aqari (automated rent collection & QR-verified property appraisals), KIB Invest (100% digital PACI onboarding & fund management), BuyNow by KIB (0%-profit marketplace), and WAGE.",
      },
      {
        heading: "Event-Driven Microservices & Polyglot Persistence",
        detail:
          "Decoupled vertical apps from legacy core banking systems using Domain-Driven Design (DDD), NestJS and Java EE microservices, Apache Kafka / RabbitMQ event choreography, and hybrid SQL + MongoDB data stores.",
      },
      {
        heading: "Visa-Ready BIN Sponsorship & BaaS Enablement",
        detail:
          "Extended the Digital Factory's API and microservice perimeter externally—enabling fintechs and exchange partners to issue and manage multi-currency prepaid cards backed by KIB's banking infrastructure.",
      },
    ],
    architecturalFlow: [
      "6 Public Mobile & Web Apps",
      "OWASP & PACI Identity Layer",
      "NestJS & Java EE BFF Mesh",
      "Kafka & RabbitMQ Event Bus",
      "Core Banking & Visa BaaS Rails",
    ],
    verifiedOutcomes: [
      "Delivered Kuwait's first bank-led 0%-profit consumer marketplace (BuyNow by KIB) accessible without salary transfer.",
      "Launched KIB Aqari and KIB Invest with 100% digital onboarding, PACI Mobile ID integration, and cryptographic QR appraisal verification.",
      "Powered KIB's milestone as the first bank in Kuwait to achieve Visa Ready for Fintech Enablement certification.",
    ],
    technologies: [
      "NestJS",
      "Java EE",
      "Apache Kafka",
      "RabbitMQ",
      "MongoDB",
      "Flutter",
      "Android / iOS",
      "PACI eKYC",
      "Visa BaaS APIs",
    ],
  },
  {
    id: "case-schema-driven-platforms",
    index: "CASE STUDY 03",
    category: "Platform Engineering & Core Frameworks",
    title: "Schema-Driven FinTech & National-Scale EdTech / Healthcare Re-Architecture",
    subtitle:
      "Engineering dynamic robo-advisor application generators at Advicenode and restructuring national-scale platforms (EduWave, MedXJordan, Great Tafsirs) at ITG Solutions.",
    readTime: "3 min executive brief",
    institutions: ["Advicenode", "ITG Solutions", "Cit Global (UBA)"],
    executiveSummary:
      "Before leading banking digital factories in Kuwait, my engineering foundation was forged by building metadata-driven application generators and re-architecting massive multi-edition platforms across FinTech, national education, medical tourism, and pan-African banking.",
    challenge:
      "Whether generating white-label robo-advisors for wealth managers at Advicenode or supporting millions of students across K-12, Higher-ED, and Assessment platforms at ITG Solutions, bespoke one-off client codebases fail to scale.",
    architecturalThesis:
      "Abstract volatile domain rules, questionnaires, and multi-tenant branding into high-speed JSON/XML schemas and reusable core frameworks—allowing client applications to render complex workflows dynamically at 60fps.",
    executionPillars: [
      {
        heading: "Advicenode — AI Robo-Advisor & Virtual Assistant Platform Generator",
        detail:
          "Engineered the core platform engine that ingested configurable decision trees, advisory workflows, and third-party web service integrations to dynamically generate robo-advisor and virtual assistant applications (including SuggestCar, the first automated car advisor) across Android and Web in under 24 hours.",
      },
      {
        heading: "ITG Solutions — Complete EduWave Suite, MedXJordan, Great Tafsirs & Al-Zakah",
        detail:
          "As Senior Mobile Developer & Acting Android Lead, restructured and redeveloped EduWave (K-12, Higher-ED, AMS) and MedXJordan with a modernized UX and shared Kotlin/Java frameworks, while engineering Great Tafsirs (التفاسير العظيمة) and the Al-Zakah calculation & endowment platform.",
      },
      {
        heading: "Cit Global — UBA Cordova-to-Flutter Banking Migration",
        detail:
          "Re-architected United Bank for Africa's mobile banking app from legacy Apache Cordova to Flutter, building real-time push notifications and Personal Finance Management (PFM) while mentoring the internal engineering team.",
      },
    ],
    architecturalFlow: [
      "JSON / XML (SAX/DOM) Schemas",
      "Reusable Core SDKs (Kotlin/Flutter)",
      "Dynamic Decision-Tree Interpreter",
      "Offline-Capable Local Indexing",
      "Multi-Edition Production Apps",
    ],
    verifiedOutcomes: [
      "Enabled rapid white-label robo-advisor application generation at Advicenode without custom client code rebuilds.",
      "Successfully restructured and shipped 6 major platforms at ITG Solutions (EduWave K-12, EduWave Higher-ED, EduWave AMS, MedXJordan, Great Tafsirs, Al-Zakah).",
      "Replaced legacy hybrid WebView bottlenecks with native-speed Flutter architecture for UBA Mobile Banking.",
    ],
    technologies: [
      "Java",
      "Kotlin",
      "Flutter",
      "JSON Schema Engine",
      "XML (SAX, DOM)",
      "REST & SOAP",
      "Clean Architecture",
    ],
  },
];

/* ------------------------------------------------------------------ Arabic executive brief (CV dossier, SEO summary) */

export const ARABIC_EXECUTIVE_BRIEF = {
  name: "أحمد شاكر",
  title: "رئيس التكنولوجيا الرقمية (Head of Digital Technology) · مهندس ومؤسس المصانع الرقمية المصرفية",
  location: "مدينة الكويت، دولة الكويت",
  summary:
    "قائد تنفيذي في التحول الرقمي المصرفي بخبرة تتجاوز 10 سنوات في بناء المصانع الرقمية (Digital Factories) للبنوك الخاضعة للرقابة من الصفر. أسهم بدور رئيسي في تأسيس مصنعين رقميين في القطاع المصرفي الكويتي: مصنع «الوتين» الرقمي في بنك وربة، والمصنع الرقمي في البنك الدولي الكويتي (KIB)، ويقود اليوم هندسة قنوات الهواتف والويب والخدمات الخلفية، مع احتفاظ البنك بملكية أصوله الرقمية الأساسية دون ارتهان لأي مورّد.",
  highlights: [
    {
      label: "تأسيس المصانع الرقمية (Digital Factories)",
      value: "بناء مصنعين رقميين من الصفر في بنك وربة والبنك الدولي الكويتي (KIB)",
    },
    {
      label: "النطاق التنفيذي في KIB",
      value: "قيادة التكنولوجيا الرقمية لأكثر من 8 منظومات ومنتجات مصرفية (الأفراد، الشركات، عقاري، استثمار، BuyNow، WAGE، ورعاية BIN)",
    },
    {
      label: "المنصات والتطبيقات المنشورة",
      value: "أكثر من 16 منصة وتطبيقاً إنتاجياً في قطاعات البنوك، التكنولوجيا المالية (Advicenode)، التعليم (EduWave)، والصحة (MedXJordan)",
    },
  ],
  /** One sentence per role, mirroring TRACK_RECORD. */
  careerSummary: [
    {
      role: "مدير تنفيذي – رئيس التكنولوجيا الرقمية",
      org: "البنك الدولي الكويتي (KIB)",
      period: "يونيو 2022 – حتى الآن",
      desc: "قيادة وظيفة التكنولوجيا الرقمية والمصنع الرقمي في البنك، بمسؤولية كاملة عن قنوات الهواتف والويب والخدمات الخلفية عبر أكثر من ثمانية خطوط أعمال للأفراد والشركات والخدمات المصرفية كخدمة (BaaS).",
    },
    {
      role: "قائد فصل هندسة أندرويد (Android Chapter Lead)",
      org: "بنك وربة — مصنع «الوتين» الرقمي",
      period: "مارس 2019 – يونيو 2022",
      desc: "بناء تطبيق بنك وربة الرئيسي من الصفر، وإرساء حوكمة الإصدارات لفريق تطبيقات الهواتف ضمن مصنع «الوتين» الرقمي.",
    },
    {
      role: "مستشار تطبيقات الهواتف الذكية (Android & Flutter)",
      org: "Cit Global — بنك أفريقيا المتحد (UBA)",
      period: "يناير 2020 – يناير 2021",
      desc: "تحديد المعمارية المستهدفة على Flutter وقيادة انتقال تطبيق UBA المصرفي من Cordova، مع تأهيل الفريق الهندسي الداخلي.",
    },
    {
      role: "مطور أول تطبيقات الهواتف وقائد فريق أندرويد بالإنابة",
      org: "مجموعة التكنولوجيا المتكاملة (ITG Solutions)",
      period: "نوفمبر 2017 – مارس 2019",
      desc: "قيادة فريقَي Android و Flutter في إعادة هيكلة منصات وطنية، منها EduWave و MedXJordan ومنصات المحتوى الإسلامي، على أطر برمجية مشتركة قابلة لإعادة الاستخدام.",
    },
    {
      role: "مهندس برمجيات (Software Engineer)",
      org: "Advicenode",
      period: "أكتوبر 2016 – أكتوبر 2017",
      desc: "هندسة المحرك الأساسي الذي يولّد تطبيقات المستشار الآلي والمساعدات الافتراضية من أشجار قرار قابلة للتهيئة في أقل من 24 ساعة.",
    },
  ],
};
