import { buildSeriesVideo } from "../shared/buildSeriesVideo";
import { makeCta } from "../shared/Cta";
import { CopyPaste, Maturity, NineGates, Pilot, Principle, RiskTiers, ThreeRequests } from "./Scenes";

export const { duration: PART1_DURATION, Video: Part1Video } = buildSeriesVideo(
  [
    { id: "pilot", dur: 186, C: Pilot },
    { id: "copy-paste", dur: 246, C: CopyPaste },
    { id: "maturity", dur: 264, C: Maturity },
    { id: "principle", dur: 276, C: Principle },
    { id: "nine-gates", dur: 330, C: NineGates },
    { id: "three-requests", dur: 300, C: ThreeRequests },
    { id: "risk", dur: 228, C: RiskTiers },
    {
      id: "cta",
      dur: 246,
      C: makeCta(1, "Beyond the\n*Chatbot*", "Why enterprise AI must evolve from knowledge to governed action."),
    },
  ],
  1,
  "part1",
);
