/** Single source of truth for the home page's section anchors (nav, mobile menu, command palette). */
export const SECTIONS = [
  { id: "impact", label: "Overview", short: "Overview", index: "01", hint: "Executive positioning & impact" },
  { id: "digital-factories", label: "Digital factories", short: "Factories", index: "02", hint: "Warba Bank & KIB, built from scratch" },
  { id: "products", label: "Platforms", short: "Platforms", index: "03", hint: "Production portfolio, with store links" },
  { id: "architecture", label: "Architecture", short: "Architecture", index: "04", hint: "5-layer banking reference architecture" },
  { id: "case-studies", label: "Case studies", short: "Case studies", index: "05", hint: "Boardroom-to-production briefings" },
  { id: "experience", label: "Career", short: "Career", index: "06", hint: "2016 – present" },
  { id: "leadership", label: "Leadership", short: "Leadership", index: "07", hint: "How I build organisations that ship" },
  { id: "contact", label: "Contact", short: "Contact", index: "", hint: "Initiate an executive conversation" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** Sections shown in the desktop navigation bar. */
export const NAV_SECTION_IDS: SectionId[] = ["impact", "digital-factories", "products", "architecture", "case-studies", "experience"];

export interface PaletteIndex {
  products: { id: string; name: string; institution: string; iconPath?: string }[];
  cases: { id: string; title: string; category: string }[];
  posts: { slug: string; title: string; language: "en" | "ar" }[];
  contact: { email: string; linkedin: string };
}
