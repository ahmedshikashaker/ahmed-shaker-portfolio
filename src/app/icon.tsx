import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

/** Stacked-plates mark (the 5-layer reference architecture as a glyph), matching the site header. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0e17",
          border: "2px solid rgba(216, 187, 132, 0.45)",
          borderRadius: "16px",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 28 28" fill="none">
          <path d="M14 3.5 24.5 8.75 14 14 3.5 8.75Z" fill="#d8bb84" />
          <path d="M3.5 13.6 14 18.85 24.5 13.6" stroke="#d8bb84" strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.75" />
          <path d="M3.5 18.6 14 23.85 24.5 18.6" stroke="#d8bb84" strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.45" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
