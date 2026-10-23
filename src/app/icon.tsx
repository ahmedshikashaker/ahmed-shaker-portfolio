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
          background: "linear-gradient(135deg, #05070b 0%, #0f172a 100%)",
          border: "2px solid #d4af37",
          borderRadius: "14px",
          color: "#f3e5ab",
          fontSize: 28,
          fontWeight: 800,
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
