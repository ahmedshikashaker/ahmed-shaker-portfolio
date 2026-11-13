import { buildSeriesVideo } from "../shared/buildSeriesVideo";
import { makeCta } from "../shared/Cta";
import { AuditorQuestion, Correlation, EvidenceRequest, HashChain, LogsAreNotProof, Projection } from "./Scenes";

export const { duration: PART7_DURATION, Video: Part7Video } = buildSeriesVideo(
  [
    { id: "auditor", dur: 307, C: AuditorQuestion },
    { id: "evidence", dur: 333, C: EvidenceRequest },
    { id: "logs", dur: 228, C: LogsAreNotProof },
    { id: "correlation", dur: 280, C: Correlation },
    { id: "hash-chain", dur: 309, C: HashChain },
    { id: "projection", dur: 261, C: Projection },
    {
      id: "cta",
      dur: 242,
      C: makeCta(7, "Making Every AI\nAction *Traceable*", "Hash-chained audit, correlation and compliance proof."),
    },
  ],
  7,
  "part7",
);
