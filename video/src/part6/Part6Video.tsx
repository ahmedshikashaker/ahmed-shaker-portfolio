import { buildSeriesVideo } from "../shared/buildSeriesVideo";
import { makeCta } from "../shared/Cta";
import { BlastRadius, Bindings, ConfirmEverything, Escalation, FourEyes, TwoFailures } from "./Scenes";

export const { duration: PART6_DURATION, Video: Part6Video } = buildSeriesVideo(
  [
    { id: "button", dur: 216, C: ConfirmEverything },
    { id: "two-failures", dur: 367, C: TwoFailures },
    { id: "tiers", dur: 307, C: BlastRadius },
    { id: "escalation", dur: 372, C: Escalation },
    { id: "bindings", dur: 357, C: Bindings },
    { id: "four-eyes", dur: 288, C: FourEyes },
    { id: "cta", dur: 237, C: makeCta(6, "Human-in-the-Loop\nIs *Not Enough*", "Risk-proportional governance from R0 to R4.") },
  ],
  6,
  "part6",
);
