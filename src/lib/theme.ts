import { PORTFOLIO_EVENTS } from "./events";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "as-theme";
export const THEME_COLORS: Record<Theme, string> = { dark: "#0a0e17", light: "#f3efe6" };

const SYSTEM_DARK = "(prefers-color-scheme: dark)";

/**
 * Runs in <head> before first paint so the theme never flashes. An explicit choice (stored only
 * when it differs from the device) wins; otherwise the device's light/dark setting is used.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark')t=window.matchMedia('${SYSTEM_DARK}').matches?'dark':'light';var d=document.documentElement;d.setAttribute('data-theme',t);d.style.colorScheme=t;}catch(e){}})();`;

export function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function systemTheme(): Theme {
  return window.matchMedia(SYSTEM_DARK).matches ? "dark" : "light";
}

/** True when the visitor has overridden the device setting. */
export function hasThemeOverride(): boolean {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark";
  } catch {
    return false;
  }
}

/** Browser-chrome colour: per-scheme metas while following the device, the chosen colour otherwise. */
function syncThemeColor(theme: Theme, followSystem: boolean) {
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const media = meta.getAttribute("media") ?? "";
    const scheme: Theme = followSystem && media.includes("light") ? "light" : followSystem && media.includes("dark") ? "dark" : theme;
    meta.setAttribute("content", THEME_COLORS[scheme]);
  });
}

function commit(next: Theme, followSystem: boolean) {
  const root = document.documentElement;
  root.setAttribute("data-theme", next);
  root.style.colorScheme = next;
  try {
    if (followSystem) localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* storage unavailable (private mode): theme still applies for this visit */
  }
  syncThemeColor(next, followSystem);
  window.dispatchEvent(new CustomEvent(PORTFOLIO_EVENTS.themeChange, { detail: next }));
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/**
 * Applies a theme the visitor picked. Picking the theme the device already uses removes the
 * override, so the site goes back to following the device. When supported, the change is
 * revealed with a circular wipe from `origin`.
 */
export function applyTheme(next: Theme, origin?: { x: number; y: number }) {
  const update = () => commit(next, next === systemTheme());

  const doc = document as ViewTransitionDocument;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) {
    update();
    return;
  }

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 32;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = doc.startViewTransition(update);
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 680, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    })
    .catch(() => {});
}

/**
 * Follows the device setting live (e.g. automatic dark mode at sunset) unless the visitor has an
 * override. Returns the cleanup function.
 */
export function watchSystemTheme() {
  const query = window.matchMedia(SYSTEM_DARK);
  const onChange = () => {
    if (!hasThemeOverride()) commit(query.matches ? "dark" : "light", true);
  };
  syncThemeColor(readTheme(), !hasThemeOverride());
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
