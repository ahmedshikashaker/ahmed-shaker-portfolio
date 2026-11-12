// Generates ElevenLabs narration for every scene, then records each clip's duration.
// Re-runs only regenerate lines whose text (or voice settings) changed.
//   node scripts/voiceover.mjs            → all parts
//   node scripts/voiceover.mjs part2      → one part
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".");
const script = JSON.parse(fs.readFileSync(path.join(root, "src/voiceover/script.json"), "utf8"));
const manifestPath = path.join(root, "src/voiceover/manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const only = process.argv[2];
const v = script.voice;

const duration = (file) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());

for (const [part, lines] of Object.entries(script.parts)) {
  if (only && only !== part) continue;
  manifest[part] ??= {};
  const dir = path.join(root, "public/vo", part);
  fs.mkdirSync(dir, { recursive: true });
  lines.forEach((line, i) => {
    const file = path.join(dir, `${line.id}.mp3`);
    const hash = createHash("sha1").update(JSON.stringify([line.text, v])).digest("hex").slice(0, 12);
    const prev = manifest[part][line.id];
    if (prev?.hash === hash && fs.existsSync(file)) {
      console.log(`= ${part}/${line.id} (cached, ${prev.seconds.toFixed(2)}s)`);
      return;
    }
    const args = [
      "text-to-speech", "convert",
      "--voice-id", v.id,
      "--model-id", v.model,
      "--voice-settings.stability", String(v.stability),
      "--voice-settings.similarity-boost", String(v.similarity),
      "--text", line.text,
      "--output", file,
    ];
    if (lines[i - 1]) args.push("--previous-text", lines[i - 1].text);
    if (lines[i + 1]) args.push("--next-text", lines[i + 1].text);
    execFileSync("elevenlabs", args, { stdio: ["ignore", "ignore", "inherit"] });
    const seconds = duration(file);
    manifest[part][line.id] = { hash, seconds, chars: line.text.length };
    console.log(`+ ${part}/${line.id} ${seconds.toFixed(2)}s (${line.text.length} chars)`);
  });
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).flatMap((p) => Object.values(p)).reduce((a, x) => a + x.chars, 0);
console.log(`manifest written · ${total} characters across all lines`);
