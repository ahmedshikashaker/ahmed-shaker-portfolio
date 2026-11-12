import React from "react";
import { Composition } from "remotion";
import { PART3_DURATION, Part3Video } from "./part3/Part3Video";

export const RemotionRoot: React.FC = () => (
  <>
    {/* 4:5 vertical — the best-performing aspect ratio in the LinkedIn feed */}
    <Composition id="Part3-LinkedIn" component={Part3Video} durationInFrames={PART3_DURATION} fps={30} width={1080} height={1350} />
    {/* 16:9 — embedded inside the article */}
    <Composition id="Part3-Article" component={Part3Video} durationInFrames={PART3_DURATION} fps={30} width={1920} height={1080} />
  </>
);
