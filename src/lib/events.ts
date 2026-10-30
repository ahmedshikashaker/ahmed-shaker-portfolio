/**
 * Tiny window-event bus so distant parts of the page (nav, command palette, hero, footer)
 * can drive interactive sections without prop drilling.
 */
export const PORTFOLIO_EVENTS = {
  openDossier: "as:open-dossier",
  openPalette: "as:open-palette",
  selectProduct: "as:select-product",
  selectFactory: "as:select-factory",
  openCase: "as:open-case",
  themeChange: "as:theme-change",
} as const;

export function emit(name: string, detail?: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Smooth-scrolls to a section on this page, or navigates home to it from other pages. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    window.location.assign(`/#${id}`);
    return;
  }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  if (id !== "hero") window.history.replaceState(null, "", `#${id}`);
  else window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

export function openDossier() {
  if (window.location.pathname !== "/") {
    window.location.assign("/#cv");
    return;
  }
  emit(PORTFOLIO_EVENTS.openDossier);
}
