// Renders the homepage launch film into the site: both cuts (16:9 for desktop, 4:5 for phones) as silent
// H.264 with no audio track, plus a JPEG poster for each, taken from the cold open's settled frame.
//   node scripts/home-render.mjs                 → both cuts and posters
//   ONLY=Portrait node scripts/home-render.mjs   → just one (suffix match on the id)
//   CRF=24 node scripts/home-render.mjs          → override the quality (lower = larger file)
import path from "node:path";
import { statSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderMedia, renderStill, selectComposition } from "@remotion/renderer";

/** Cold open, lineup turned round and the title settled: the poster frame (and the site's hero, as a film). */
const POSTER_FRAME = 172;

const CUTS = [
  { id: "Home-Showreel", video: "home-showreel.mp4", poster: "home-showreel-poster.jpg", crf: 23 },
  { id: "Home-Showreel-Portrait", video: "home-showreel-portrait.mp4", poster: "home-showreel-portrait-poster.jpg", crf: 23 },
].filter((cut) => !process.env.ONLY || cut.id.endsWith(process.env.ONLY));

const out = (file) => path.resolve("../public/videos", file);
const mb = (file) => (statSync(file).size / 1e6).toFixed(2);

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome");
try {
  for (const cut of CUTS) {
    const composition = await selectComposition({ serveUrl, id: cut.id, puppeteerInstance: browser });
    const crf = Number(process.env.CRF ?? cut.crf);
    await renderMedia({
      composition,
      serveUrl,
      puppeteerInstance: browser,
      codec: "h264",
      crf,
      x264Preset: "slow",
      jpegQuality: 92,
      muted: true,
      outputLocation: out(cut.video),
      onProgress: ({ progress }) => process.stdout.write(`\r${cut.id} ${Math.round(progress * 100)}%`),
    });
    process.stdout.write("\n");
    await renderStill({
      composition,
      serveUrl,
      puppeteerInstance: browser,
      frame: POSTER_FRAME,
      imageFormat: "jpeg",
      jpegQuality: 84,
      output: out(cut.poster),
    });
    console.log(`${cut.id}: ${cut.video} ${mb(out(cut.video))} MB (crf ${crf}), ${cut.poster} ${mb(out(cut.poster))} MB`);
  }
} finally {
  await browser.close({ silent: true });
}
