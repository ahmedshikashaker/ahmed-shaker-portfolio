// Finishing pass for narrated renders: two-pass EBU R128 loudness normalisation + fast-start.
//   LinkedIn files → -14 LUFS (social-platform standard), article files → -16 LUFS (web standard).
//   node scripts/finish.mjs Part1 Part2 Part3
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";

const parts = process.argv.slice(2);
const run = (args) => execFileSync("ffmpeg", ["-hide_banner", "-y", ...args], { stdio: ["ignore", "pipe", "pipe"] });

const normalize = (src, dst, I, TP) => {
  // pass 1: measure (ffmpeg prints the stats on stderr)
  const res = spawnSync("ffmpeg", ["-hide_banner", "-i", src, "-vn", "-af", `loudnorm=I=${I}:TP=${TP}:LRA=11:print_format=json`, "-f", "null", "-"]).stderr;
  const json = JSON.parse(String(res).match(/\{[^{}]*"target_offset"[^{}]*\}/)[0]);
  const filter =
    `loudnorm=I=${I}:TP=${TP}:LRA=11:measured_I=${json.input_i}:measured_TP=${json.input_tp}` +
    `:measured_LRA=${json.input_lra}:measured_thresh=${json.input_thresh}:offset=${json.target_offset}:linear=true`;
  // pass 2: apply, keep the video stream untouched
  run(["-i", src, "-c:v", "copy", "-af", filter, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", dst]);
  return json.input_i;
};

for (const p of parts) {
  const n = p.replace("Part", "");
  const li = normalize(`out/vo-${p}-linkedin.mp4`, `out/governed-autonomy-part-${n}-linkedin.mp4`, -14, -1.5);
  const ar = normalize(`out/vo-${p}-article.mp4`, path.resolve(`../public/videos/governed-autonomy-part-${n}.mp4`), -16, -1.5);
  console.log(`${p}: linkedin ${li} → -14 LUFS · article ${ar} → -16 LUFS`);
}
