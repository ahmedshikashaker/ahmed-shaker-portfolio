import React from "react";
import { Composition } from "remotion";
import { PART1_DURATION, Part1Video } from "./part1/Part1Video";
import { PART2_DURATION, Part2Video } from "./part2/Part2Video";
import { PART3_DURATION, Part3Video } from "./part3/Part3Video";

const VIDEOS = [
  { id: "Part1", component: Part1Video, duration: PART1_DURATION },
  { id: "Part2", component: Part2Video, duration: PART2_DURATION },
  { id: "Part3", component: Part3Video, duration: PART3_DURATION },
];

export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((v) => (
      <React.Fragment key={v.id}>
        {/* 4:5 vertical — the best-performing aspect ratio in the LinkedIn feed */}
        <Composition id={`${v.id}-LinkedIn`} component={v.component} durationInFrames={v.duration} fps={30} width={1080} height={1350} />
        {/* 16:9 — embedded inside the article */}
        <Composition id={`${v.id}-Article`} component={v.component} durationInFrames={v.duration} fps={30} width={1920} height={1080} />
      </React.Fragment>
    ))}
  </>
);
