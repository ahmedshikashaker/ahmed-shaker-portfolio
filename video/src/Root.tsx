import React from "react";
import { Composition } from "remotion";
import { PART1_DURATION, Part1Video } from "./part1/Part1Video";
import { PART2_DURATION, Part2Video } from "./part2/Part2Video";
import { PART3_DURATION, Part3Video } from "./part3/Part3Video";
import { PART4_DURATION, Part4Video } from "./part4/Part4Video";
import { PART5_DURATION, Part5Video } from "./part5/Part5Video";
import { PART6_DURATION, Part6Video } from "./part6/Part6Video";
import { PART7_DURATION, Part7Video } from "./part7/Part7Video";
import { PART8_DURATION, Part8Video } from "./part8/Part8Video";
import { HOME_SHOWREEL_DURATION, HomeShowreel } from "./home/HomeShowreel";

const VIDEOS = [
  { id: "Part1", component: Part1Video, duration: PART1_DURATION },
  { id: "Part2", component: Part2Video, duration: PART2_DURATION },
  { id: "Part3", component: Part3Video, duration: PART3_DURATION },
  { id: "Part4", component: Part4Video, duration: PART4_DURATION },
  { id: "Part5", component: Part5Video, duration: PART5_DURATION },
  { id: "Part6", component: Part6Video, duration: PART6_DURATION },
  { id: "Part7", component: Part7Video, duration: PART7_DURATION },
  { id: "Part8", component: Part8Video, duration: PART8_DURATION },
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
    {/* Homepage launch film (video/src/home): silent, 16:9 for desktop and 4:5 for phones. Render with scripts/home-render.mjs. */}
    <Composition id="Home-Showreel" component={HomeShowreel} durationInFrames={HOME_SHOWREEL_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="Home-Showreel-Portrait" component={HomeShowreel} durationInFrames={HOME_SHOWREEL_DURATION} fps={30} width={1080} height={1350} />
  </>
);
