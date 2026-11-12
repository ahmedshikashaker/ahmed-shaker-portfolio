// Renders preview stills of key frames for visual QA (bundles once, renders many).
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [, , compId = "Part3-LinkedIn", ...framesArg] = process.argv;
const frames = framesArg.length ? framesArg.map(Number) : [130, 400, 560, 946, 1116, 1306, 1606, 1826, 2072];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: compId });
for (const frame of frames) {
  const output = path.resolve(`out/stills/${compId}-${String(frame).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, output, frame, scale: 0.5 });
  console.log("rendered", output);
}
