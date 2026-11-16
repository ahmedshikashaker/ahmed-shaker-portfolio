import { loadFont as loadDisplay } from "@remotion/google-fonts/InterTight";
import { loadFont as loadText } from "@remotion/google-fonts/Inter";

/**
 * The launch film's own system, matching the home page's "Launch" block in src/app/globals.css:
 * Inter Tight for display sizes, Inter for text, flat scenes that alternate between light and dark tones,
 * and one solid accent colour (--l-accent) for at most one phrase per beat. No gradients: the only shading
 * left is the phones' own material. (The blog-series films keep the dark drafting look in src/theme.ts.)
 */

const display = loadDisplay("normal", { weights: ["600", "700"], subsets: ["latin"] });
const text = loadText("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const DISPLAY = display.fontFamily;
export const TEXT = text.fontFamily;

export type Tone = "light" | "mist" | "dark";

export type Palette = {
  bg: string;
  card: string;
  fg: string;
  fg2: string;
  fg3: string;
  line: string;
  link: string;
  /** --l-accent: the one phrase per beat that carries the idea. */
  accent: string;
};

const LIGHT: Palette = {
  bg: "#ffffff",
  card: "#f5f5f7",
  fg: "#1d1d1f",
  fg2: "#424245",
  fg3: "#6e6e73",
  line: "rgba(0, 0, 0, 0.1)",
  link: "#0066cc",
  accent: "#0071e3",
};

export const TONES: Record<Tone, Palette> = {
  light: LIGHT,
  mist: { ...LIGHT, bg: "#f5f5f7", card: "#ffffff" },
  dark: {
    bg: "#000000",
    card: "#161617",
    fg: "#f5f5f7",
    fg2: "#d2d2d7",
    fg3: "#86868b",
    line: "rgba(255, 255, 255, 0.14)",
    link: "#2997ff",
    accent: "#2997ff",
  },
};

/**
 * Type scale (globals.css .t-display / .t-h1 / .t-kicker / .t-num): bold display cut, tight tracking
 * that loosens as the size drops.
 */
export const TYPE = {
  display: { fontFamily: DISPLAY, fontWeight: 700, lineHeight: 0.97, letterSpacing: "-0.048em" },
  h1: { fontFamily: DISPLAY, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.042em" },
  h2: { fontFamily: DISPLAY, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.035em" },
  h3: { fontFamily: DISPLAY, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.026em" },
  kicker: { fontFamily: DISPLAY, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.014em" },
  lede: { fontFamily: DISPLAY, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.02em" },
  num: { fontFamily: DISPLAY, fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.055em", fontVariantNumeric: "lining-nums tabular-nums" },
  text: { fontFamily: TEXT, fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.011em" },
} as const;
