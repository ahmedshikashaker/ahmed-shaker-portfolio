/**
 * Every word and fact shown in the homepage launch film.
 *
 * Copied verbatim from src/data/portfolioData.ts (the site's single source of truth) so the Remotion
 * bundle stays self-contained. When that file changes, update the strings here to match; do not add
 * facts, numbers, dates or product names that are not in it. *Asterisks* mark the accent phrase, exactly
 * as the site's copy marks it; a beat shows at most one in the accent colour.
 */

export const NAME = "Ahmed Shaker"; // EXECUTIVE_PROFILE.name
export const SITE = "ahmed-shaker.com";

/** OVERVIEW.headline (one row per line), .role, .institution without the "(KIB)" suffix (as in .lede). */
export const HEADLINE = ["*Digital Factory*", "architect."];
export const ROLE = "Executive Manager – Head of Digital Technology";
export const BANK = "Kuwait International Bank";

/** STORY.premise: one sentence per screen. */
export const PREMISE = [
  "Banks in the region relied on vendors for their digital channels.",
  "Slow releases. Inconsistent apps. *Someone else’s IP.*",
  "The alternative is a *Digital Factory* the bank owns.",
  "I have helped build two. *From zero.*",
];

/* ------------------------------------------------------------------ apps */

/** Store icons copied from public/assets/apps/icons into video/public/home (PLATFORM_REGISTRY.iconPath). */
export const ICON = {
  kibMobile: "home/kib-mobile.jpg",
  kibCorporate: "home/kib-corporate.jpg",
  kibAqari: "home/kib-aqari.jpg",
  kibInvest: "home/kib-invest.jpg",
  kibBuyNow: "home/kib-buynow.jpg",
  kibWage: "home/kib-wage.jpg",
  kibMuzaini: "home/kib-muzaini.png",
  warbaMobile: "home/warba-mobile.jpg",
  warbaFayez: "home/warba-fayez.jpg",
} as const;

/** FLAGSHIP_PLATFORMS entries the film pictures (name, institution, domain, icon, store screenshots). */
export const APPS = {
  kibMobile: {
    name: "KIB Mobile",
    maker: "KIB · Retail banking super-app",
    icon: ICON.kibMobile,
    shots: ["home/shots/kib-mobile-1.jpg", "home/shots/kib-mobile-2.jpg"],
  },
  kibCorporate: { name: "KIB Corporate", icon: ICON.kibCorporate },
  kibAqari: { name: "KIB Aqari", icon: ICON.kibAqari },
  kibInvest: { name: "KIB Invest", icon: ICON.kibInvest },
  kibBuyNow: { name: "BuyNow by KIB", icon: ICON.kibBuyNow },
  warbaMobile: { name: "Warba Bank Mobile", icon: ICON.warbaMobile },
} as const;

/* ------------------------------------------------------------------ factories */

/**
 * A business line: FACTORIES[n].linesUnlocked, pictured by its LINE_PLATFORM icon. `short` is the one
 * word under the icon on a home screen: the platform's FLAGSHIP_PLATFORMS `mark` where it has one,
 * otherwise the line's own product or category word. Lines with no public app have no icon.
 */
export type Line = { label: string; short: string; icon?: string };

export type Factory = {
  numeral: "I" | "II";
  /** FLAGSHIP_PLATFORMS[].institution: the bank's short name. */
  bank: string;
  factoryName: string;
  period: string;
  lines: Line[];
  /** The flagship app the factory's phone opens. */
  app: { name: string; icon: string };
};

export const FACTORIES: [Factory, Factory] = [
  {
    numeral: "I",
    bank: "Warba Bank",
    factoryName: "Al-Wateen Digital Factory",
    period: "Mar 2019 – Jun 2022",
    lines: [
      { label: "Retail mobile banking", short: "Warba", icon: ICON.warbaMobile },
      { label: "Lifestyle & loyalty · Fayez", short: "Fayez", icon: ICON.warbaFayez },
      // Hassala Kids has no store icon in PLATFORM_REGISTRY: the film shows a neutral tile.
      { label: "Youth savings · Hassala Kids", short: "Hassala Kids" },
    ],
    app: APPS.warbaMobile,
  },
  {
    numeral: "II",
    bank: "KIB",
    factoryName: "KIB Digital Factory",
    period: "Jun 2022 – Present",
    lines: [
      { label: "Retail", short: "Retail", icon: ICON.kibMobile },
      { label: "Corporate", short: "Corporate", icon: ICON.kibCorporate },
      { label: "PropTech · Aqari", short: "Aqari", icon: ICON.kibAqari },
      { label: "Wealth · Invest", short: "Invest", icon: ICON.kibInvest },
      { label: "BNPL · BuyNow", short: "BuyNow", icon: ICON.kibBuyNow },
      { label: "Remittance · WAGE", short: "WAGE", icon: ICON.kibWage },
      { label: "BaaS · BIN Sponsorship", short: "BaaS", icon: ICON.kibMuzaini },
      // Backoffice is internal (LINE_PLATFORM: null): a neutral glyph tile, never an invented logo.
      { label: "Backoffice", short: "Backoffice" },
    ],
    app: APPS.kibMobile,
  },
];

/** "…to eight product lines" (SECTION_COPY.factories.subtitle). */
export const linesCaption = (n: number) => `${n} product lines`;

/** Beat 4's statement: the KIB factory's eight lines (PROOF_METRICS "8+", FACTORIES[1]), one factory. */
export const EIGHT = "Eight product lines. *One factory.*";

/** Splits "PropTech · Aqari" into its category and the product that carries it. */
export const splitLine = (label: string): [string, string | undefined] => {
  const [a, b] = label.split(" · ");
  return [a, b];
};

/* ------------------------------------------------------------------ architecture */

/** SECTION_COPY.stack.title */
export const STACK_TITLE = "Fast edge, *steady core.*";

/** ARCHITECTURE_STACK, top (changes fastest) to bottom (changes deliberately): short name + tags. */
export const STACK: { short: string; tags: string[] }[] = [
  { short: "Experience", tags: ["Native iOS", "Native Android", "Flutter", "Web"] },
  { short: "Domain & events", tags: ["Java", "NestJS", "Kafka", "RabbitMQ"] },
  { short: "Platform & GitOps", tags: ["Kubernetes", "Argo CD", "DevSecOps Gates"] },
  { short: "Core & BaaS", tags: ["Core Isolation", "BIN Sponsorship", "Open APIs"] },
];

/* ------------------------------------------------------------------ proof */

/** PROOF_METRICS: value + label. */
export const PROOF: { value: string; label: string }[] = [
  { value: "2", label: "Regulated banking Digital Factories built from zero" },
  { value: "8+", label: "Concurrent retail, corporate, PropTech, wealth & BNPL lines" },
  { value: "16+", label: "Production banking, BaaS & enterprise platforms delivered" },
  { value: "0", label: "Core digital IP vendor lock-in" },
];

/* ------------------------------------------------------------------ text helpers */

export type Seg = { text: string; ink: boolean };

/** "a *b c* d" → [{a}, {b c, ink}, {d}]. */
export const segments = (text: string): Seg[] =>
  text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) => (part.startsWith("*") && part.endsWith("*") ? { text: part.slice(1, -1), ink: true } : { text: part, ink: false }));
