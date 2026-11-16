// QA stills for the homepage showreel: bundles once, renders the same frames for both
// orientations at half scale into out/stills/.
//   node scripts/home-stills.mjs 40 90 300          → both compositions
//   ONLY=Portrait node scripts/home-stills.mjs 40   → just one (substring match on the id)
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";

const frames = process.argv.slice(2).map(Number);
if (!frames.length) {
  console.error("usage: node scripts/home-stills.mjs <frame> [frame…]");
  process.exit(1);
}
const ids = ["Home-Showreel", "Home-Showreel-Portrait"].filter((id) => !process.env.ONLY || id.endsWith(process.env.ONLY));
const scale = Number(process.env.SCALE ?? 0.5);

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome");
try {
  for (const id of ids) {
    const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
    const queue = [...frames];
    const worker = async () => {
      while (queue.length) {
        const frame = queue.shift();
        const output = path.resolve(`out/stills/${id}-${String(frame).padStart(4, "0")}.png`);
        await renderStill({ composition, serveUrl, output, frame, scale, puppeteerInstance: browser });
        console.log("rendered", path.relative(process.cwd(), output));
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
  }
} finally {
  await browser.close({ silent: true });
}
