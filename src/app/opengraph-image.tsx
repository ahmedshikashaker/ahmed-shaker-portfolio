import { ImageResponse } from "next/og";

export const alt = "Ahmed Shaker — Head of Digital Technology & Banking Digital Factory Architect";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(circle at 85% 20%, #11182a 0%, #0a0e17 75%)",
          color: "#f2ede3",
          border: "1px solid rgba(216, 187, 132, 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "rgba(216, 187, 132, 0.14)",
                border: "1.5px solid rgba(216, 187, 132, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d8bb84",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              AS
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 16, color: "#d8bb84", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Executive Technology Portfolio
              </span>
              <span style={{ fontSize: 14, color: "#8e919c" }}>
                Kuwait City, Kuwait · Digital Banking & Enterprise Architecture
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(94, 234, 212, 0.1)",
              border: "1px solid rgba(94, 234, 212, 0.35)",
              color: "#7dd3bf",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            2 Digital Factories · 16+ Production Platforms
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "980px" }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.03em" }}>
            Ahmed Shaker
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#d8bb84", lineHeight: 1.25 }}>
            Head of Digital Technology · Digital Banking Transformation Leader
          </div>
          <div style={{ fontSize: 22, color: "#c9c8c3", lineHeight: 1.45 }}>
            Architecting digital factories, multi-product banking ecosystems, and cloud-native engineering organizations at Kuwait International Bank (KIB), Warba Bank, Advicenode, and ITG Solutions.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(148, 163, 184, 0.16)",
            fontSize: 16,
            color: "#8e919c",
          }}
        >
          <span>Mobile (Android · iOS · Flutter) • Backend (NestJS · Java) • DevOps (K8s · Argo CD)</span>
          <span style={{ color: "#d8bb84" }}>www.ahmed-shaker.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
