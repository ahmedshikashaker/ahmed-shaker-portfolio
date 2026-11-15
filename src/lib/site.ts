/** Single source of truth for the home page's section anchors (nav, mobile menu, scroll-spy, command palette). */
export const SECTIONS = [
  { id: "overview", label: "Overview", index: "01", hint: "Positioning & proof" },
  { id: "factories", label: "Digital Factories", index: "02", hint: "Two banks, one operating blueprint" },
  { id: "ecosystems", label: "Ecosystems", index: "03", hint: "Eight flagship platforms, one architecture" },
  { id: "track-record", label: "Track Record", index: "04", hint: "Five mandates, 2016 – present" },
  { id: "writing", label: "Writing", index: "05", hint: "Essay series, English & العربية" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const SECTION_IDS: SectionId[] = SECTIONS.map((section) => section.id);

/** The first section: scrolling to it means "back to top", so it leaves no hash in the URL. */
export const TOP_SECTION_ID: SectionId = "overview";

/** The footer. Reachable from the header button, never part of the five-section narrative. */
export const CONTACT_ID = "contact";

/** Anchors of the previous seven-section page, so links already shared keep landing on the right section. */
export const LEGACY_ANCHORS: Record<string, SectionId> = {
  hero: "overview",
  impact: "overview",
  "digital-factories": "factories",
  products: "ecosystems",
  architecture: "ecosystems",
  "case-studies": "ecosystems",
  experience: "track-record",
  leadership: "track-record",
  articles: "writing",
};

export interface PaletteIndex {
  platforms: { id: string; name: string; institution: string; iconPath?: string }[];
  briefs: { id: string; title: string; category: string; section: string }[];
  posts: { slug: string; title: string; language: "en" | "ar" }[];
  contact: { email: string; linkedin: string };
}
