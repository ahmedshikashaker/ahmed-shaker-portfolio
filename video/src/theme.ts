import { loadFont as loadDisplay } from "@remotion/google-fonts/InterTight";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

/**
 * Same Apple-style launch palette & type system as the current website's light theme
 * (src/app/globals.css [data-theme="light"] and video/src/home/theme.ts).
 */
export const C = {
  bg: "#ffffff",
  bg2: "#f5f5f7",
  surface: "#f5f5f7",
  surface2: "#e8e8ed",
  surface3: "#d9d9de",
  line: "rgba(0, 0, 0, 0.08)",
  line2: "rgba(0, 0, 0, 0.13)",
  line3: "rgba(0, 0, 0, 0.24)",
  fg: "#1d1d1f",
  fg2: "#424245",
  fg3: "#6e6e73",
  fg4: "#86868b",
  accent: "#0071e3",
  accent2: "#0058b0",
  accentDeep: "#66a3f0",
  signal: "#248a3d",
  danger: "#d70015",
  blue: "#5856d6",
};

const display = loadDisplay("normal", { weights: ["600", "700"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const SERIF = display.fontFamily;
export const SANS = sans.fontFamily;
export const MONO = mono.fontFamily;
