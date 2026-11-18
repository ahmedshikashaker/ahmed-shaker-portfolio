import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/** 180×180 Apple Touch Icon matching the stacked-plates brand mark. */
export default function AppleIcon() {
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
          border: "5px solid rgba(216, 187, 132, 0.45)",
          borderRadius: "40px",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 28 28" fill="none">
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
