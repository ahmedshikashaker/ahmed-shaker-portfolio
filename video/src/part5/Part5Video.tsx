import { buildSeriesVideo } from "../shared/buildSeriesVideo";
import { makeCta } from "../shared/Cta";
import { Deputy, Intersection, Perimeter, Pillars, SevenStages, Tamper } from "./Scenes";

// dur = ceil(narration seconds * 30) + 40
export const { duration: PART5_DURATION, Video: Part5Video } = buildSeriesVideo(
  [
    { id: "perimeter", dur: 249, C: Perimeter }, // 6.96 s
    { id: "deputy", dur: 458, C: Deputy }, // 13.92 s
    { id: "intersection", dur: 340, C: Intersection }, // 10.00 s
    { id: "seven-stages", dur: 283, C: SevenStages }, // 8.08 s
    { id: "pillars", dur: 355, C: Pillars }, // 10.48 s
    { id: "tamper", dur: 340, C: Tamper }, // 10.00 s
    {
      id: "cta",
      dur: 247, // 6.88 s
      C: makeCta(5, "Least Privilege\nfor *AI Agents*", "Continuous authorization and single-use cryptographic grants."),
    },
  ],
  5,
  "part5",
);
