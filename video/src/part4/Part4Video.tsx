import { buildSeriesVideo } from "../shared/buildSeriesVideo";
import { makeCta } from "../shared/Cta";
import { BoundedGraph, Failure, Loop, Timeout, TwoEngines, TypedDag } from "./Scenes";

// dur = ceil(narration seconds * 30) + 40
export const { duration: PART4_DURATION, Video: Part4Video } = buildSeriesVideo(
  [
    { id: "loop", dur: 379, C: Loop }, // 11.28 s
    { id: "failure", dur: 379, C: Failure }, // 11.28 s
    { id: "two-engines", dur: 369, C: TwoEngines }, // 10.96 s
    { id: "bounded-graph", dur: 360, C: BoundedGraph }, // 10.64 s
    { id: "typed-dag", dur: 357, C: TypedDag }, // 10.56 s
    { id: "timeout", dur: 350, C: Timeout }, // 10.32 s
    {
      id: "cta",
      dur: 235, // 6.48 s
      C: makeCta(4, "From Intent to\n*Controlled Execution*", "The handshake between AI reasoning and execution authority."),
    },
  ],
  4,
  "part4",
);
