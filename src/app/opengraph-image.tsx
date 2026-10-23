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
          background: "radial-gradient(circle at 85% 20%, #112233 0%, #05070b 70%)",
          color: "#f8fafc",
          border: "1px solid rgba(212, 175, 55, 0.35)",
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
                borderRadius: "12px",
                background: "rgba(212, 175, 55, 0.14)",
                border: "1.5px solid #d4af37",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f3e5ab",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              AS
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 16, color: "#d4af37", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Executive Technology Portfolio
              </span>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>
                Kuwait City, Kuwait · Digital Banking & Enterprise Architecture
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#6ee7b7",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            2 Banking Digital Factories Built from Scratch
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "980px" }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.03em" }}>
            Ahmed Shaker
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#e5c158", lineHeight: 1.25 }}>
            Head of Digital Technology · Digital Banking Transformation Leader
          </div>
          <div style={{ fontSize: 22, color: "#cbd5e1", lineHeight: 1.45 }}>
            Architecting digital factories, multi-product banking ecosystems, and cloud-native engineering organizations at Kuwait International Bank (KIB) & Warba Bank.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: 16,
            color: "#94a3b8",
          }}
        >
          <span>Mobile (Android · iOS · Flutter) • Backend (NestJS · Java) • DevOps (K8s · Argo CD)</span>
          <span style={{ color: "#f3e5ab" }}>10+ Years Executive & Technical Impact</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
