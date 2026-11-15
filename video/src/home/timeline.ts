/**
 * The launch film's edit decision list (30 fps). Beats alternate light and dark; each one enters over the
 * previous beat either with a full-frame colour wipe (a band of the next tone rising from the bottom of the
 * frame, like scrolling the home page into its next section) or with a crossfade.
 */
export const FPS = 30;

export type Enter = "cut" | "wipe" | "fade";

export const T = {
  open: { from: 0, dur: 196, enter: "cut" },
  premise: { from: 178, dur: 300, enter: "wipe" },
  factories: { from: 460, dur: 214, enter: "wipe" },
  eight: { from: 652, dur: 262, enter: "fade" },
  stack: { from: 896, dur: 186, enter: "wipe" },
  proof: { from: 1064, dur: 176, enter: "wipe" },
  end: { from: 1222, dur: 114, enter: "fade" },
} as const satisfies Record<string, { from: number; dur: number; enter: Enter }>;

/** Length of the entry transitions, in frames. */
export const WIPE = 20;
export const FADE = 20;

export const TOTAL = T.end.from + T.end.dur;
