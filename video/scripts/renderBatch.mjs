import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const parts = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
console.log("Bundled once:", serveUrl);

for (const p of parts) {
  for (const [suffix, tag] of [
    ["LinkedIn", "linkedin"],
    ["Article", "article"],
  ]) {
    const id = `${p}-${suffix}`;
    const outputLocation = path.resolve(`out/vo-${p}-${tag}.mp4`);
    const t0 = Date.now();
    const composition = await selectComposition({ serveUrl, id });
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      crf: 16,
      audioBitrate: "192k",
      outputLocation,
    });
    console.log(`Rendered ${id} (${composition.durationInFrames} frames) in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${outputLocation}`);
  }
}
