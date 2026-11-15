import { Inter, Inter_Tight } from "next/font/google";

/**
 * The home page's two faces, loaded on the home page only so blog pages download nothing new:
 * Inter Tight for display sizes (bold statements, numbers) and Inter for text.
 */
export const launchDisplay = Inter_Tight({ subsets: ["latin"], display: "swap" });
export const launchText = Inter({ subsets: ["latin"], display: "swap" });

/**
 * Exposes both faces as root variables, so dialogs and drawers that open outside the page tree
 * (the brief reader, the archive) can use them too. Rendered by the home page only.
 */
export const LAUNCH_FONT_CSS = `:root{--font-launch-display:${launchDisplay.style.fontFamily};--font-launch-text:${launchText.style.fontFamily}}`;
