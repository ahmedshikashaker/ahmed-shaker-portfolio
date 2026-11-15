import { TOP_SECTION_ID } from "./site";

/**
 * Tiny window-event bus so distant parts of the page (nav, command palette, section buttons)
 * can drive the overlays and interactive sections without prop drilling.
 */
export const PORTFOLIO_EVENTS = {
  openDossier: "as:open-dossier",
  openPalette: "as:open-palette",
  openBrief: "as:open-brief",
  selectPlatform: "as:select-platform",
  themeChange: "as:theme-change",
} as const;

export function emit(name: string, detail?: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scrolls to a section on this page, or navigates home to it from other pages. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    window.location.assign(`/#${id}`);
    return;
  }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  const url = id === TOP_SECTION_ID ? window.location.pathname + window.location.search : `#${id}`;
  window.history.replaceState(null, "", url);
}

export function openDossier() {
  if (window.location.pathname !== "/") {
    window.location.assign("/#cv");
    return;
  }
  emit(PORTFOLIO_EVENTS.openDossier);
}

export function openBrief(id: string) {
  emit(PORTFOLIO_EVENTS.openBrief, id);
}
