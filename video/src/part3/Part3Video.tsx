import { buildSeriesVideo } from "../shared/buildSeriesVideo";
import { Hook, Silos, Thesis } from "./ActOne";
import { Normalize, Pipeline } from "./ActTwo";
import { Cta, Drift, Hub } from "./ActThree";

export const { duration: PART3_DURATION, Video: Part3Video } = buildSeriesVideo(
  [
    { id: "hook", dur: 150, C: Hook },
    { id: "silos", dur: 270, C: Silos },
    { id: "thesis", dur: 156, C: Thesis },
    { id: "normalize", dur: 390, C: Normalize },
    { id: "pipeline", dur: 360, C: Pipeline },
    { id: "drift", dur: 300, C: Drift },
    { id: "hub", dur: 216, C: Hub },
    { id: "cta", dur: 246, C: Cta },
  ],
  3,
  "part3",
);
