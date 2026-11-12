import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

/** Same palette as the website's dark theme (src/app/globals.css). */
export const C = {
  bg: "#0a0e17",
  bg2: "#0c111b",
  surface: "#11182a",
  surface2: "#161f33",
  surface3: "#1c273e",
  line: "rgba(232, 224, 207, 0.08)",
  line2: "rgba(232, 224, 207, 0.14)",
  line3: "rgba(232, 224, 207, 0.26)",
  fg: "#f2ede3",
  fg2: "#c9c8c3",
  fg3: "#969aa5",
  fg4: "#7d8290",
  accent: "#d8bb84",
  accent2: "#ebd3a6",
  accentDeep: "#9c7f4a",
  signal: "#7dd3bf",
  danger: "#f0907f",
  blue: "#8fb4ff",
};

const serif = loadSerif("normal", { weights: ["400", "500"], subsets: ["latin"] });
loadSerif("italic", { weights: ["400", "500"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const SERIF = serif.fontFamily;
export const SANS = sans.fontFamily;
export const MONO = mono.fontFamily;
