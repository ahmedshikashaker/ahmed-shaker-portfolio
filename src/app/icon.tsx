import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #0f172a 0%, #182338 100%)",
          border: "2px solid rgba(223, 196, 144, 0.55)",
          borderRadius: "16px",
          color: "#dfc490",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        AS
      </div>
    ),
    {
      ...size,
    }
  );
}
