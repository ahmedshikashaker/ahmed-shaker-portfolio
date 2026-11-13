import { buildSeriesVideo } from "../shared/buildSeriesVideo";
import { makeCta } from "../shared/Cta";
import { BoardQuestion, BundlePromotion, KillSwitches, ReleaseGates, RolloutRings, Thesis } from "./Scenes";

// Base durations: ceil(narration seconds * 30) + 40.
export const { duration: PART8_DURATION, Video: Part8Video } = buildSeriesVideo(
  [
    { id: "question", dur: 283, C: BoardQuestion },
    { id: "rings", dur: 348, C: RolloutRings },
    { id: "gates", dur: 268, C: ReleaseGates },
    { id: "kill-switches", dur: 403, C: KillSwitches },
    { id: "promotion", dur: 242, C: BundlePromotion },
    { id: "thesis", dur: 328, C: Thesis },
    {
      id: "cta",
      dur: 266,
      C: makeCta(8, "Enterprise AI That\nCan Be *Trusted*", "The complete eight-part Governed Autonomy series."),
    },
  ],
  8,
  "part8",
);
