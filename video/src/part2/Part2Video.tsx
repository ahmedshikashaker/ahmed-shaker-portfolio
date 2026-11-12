import { buildSeriesVideo } from "../shared/buildSeriesVideo";
import { makeCta } from "../shared/Cta";
import { CisoQuestion, FourFailures, FourRules, LiveBlock, PoisonedCsv, PromptsAreAdvice, TrustBoundaries } from "./Scenes";

export const { duration: PART2_DURATION, Video: Part2Video } = buildSeriesVideo(
  [
    { id: "ciso", dur: 186, C: CisoQuestion },
    { id: "poisoned-csv", dur: 276, C: PoisonedCsv },
    { id: "prompts-advice", dur: 186, C: PromptsAreAdvice },
    { id: "four-failures", dur: 330, C: FourFailures },
    { id: "boundaries", dur: 300, C: TrustBoundaries },
    { id: "live-block", dur: 288, C: LiveBlock },
    { id: "four-rules", dur: 210, C: FourRules },
    {
      id: "cta",
      dur: 246,
      C: makeCta(2, "The AI Trust\n*Problem*", "What actually breaks when AI agents meet production APIs—and how to contain it."),
    },
  ],
  2,
);
