import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BANK, NAME, ROLE, SITE } from "./content";
import { Stage, rise, span, useFrameInfo } from "./kit";
import { TONES, TYPE } from "./theme";

/** 7 · End card (dark): the name, the role, the address. */
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { portrait } = useFrameInfo();
  const pal = TONES.dark;
  return (
    <Stage tone="dark" dur={dur} push={0.025}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", paddingLeft: 64, paddingRight: 64 }}>
        <div style={{ ...TYPE.display, fontSize: portrait ? 136 : 168, color: pal.fg, ...rise(span(f, 14, 46), 0, 0.3, 6) }}>{NAME}</div>
        <div style={{ ...TYPE.lede, fontSize: portrait ? 38 : 40, color: pal.fg3, marginTop: portrait ? 34 : 30, ...rise(span(f, 22, 52), 0, 0.5, 4) }}>
          {portrait ? (
            <>
              {ROLE}
              <br />
              {BANK}
            </>
          ) : (
            `${ROLE}, ${BANK}`
          )}
        </div>
        <div style={{ ...TYPE.lede, fontSize: portrait ? 40 : 38, color: pal.link, marginTop: portrait ? 64 : 56, ...rise(span(f, 34, 64), 0, 0.5, 4) }}>{SITE}</div>
      </AbsoluteFill>
    </Stage>
  );
};
