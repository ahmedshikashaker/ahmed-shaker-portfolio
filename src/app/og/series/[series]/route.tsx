import { ImageResponse } from "next/og";
import { SERIES, getSeriesWithPosts } from "@/lib/series";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return SERIES.map((s) => ({ series: s.slug }));
}

/** 1200×630 share preview for a series landing page: the title and its parts, in order. */
export async function GET(_req: Request, { params }: { params: Promise<{ series: string }> }) {
  const { series: slug } = await params;
  const data = await getSeriesWithPosts(slug);
  const title = data?.series.title ?? "A series by Ahmed Shaker";
  const parts = data?.parts ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          background: "radial-gradient(circle at 88% 12%, #161f33 0%, #0a0e17 70%)",
          color: "#f2ede3",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 44, background: "#d8bb84", borderRadius: 4 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 26, fontWeight: 700 }}>Ahmed Shaker</span>
              <span style={{ fontSize: 17, color: "#8e919c" }}>Executive Manager – Head of Digital Technology</span>
            </div>
          </div>
          <span style={{ fontSize: 18, color: "#d8bb84", border: "1px solid rgba(216,187,132,0.45)", borderRadius: 999, padding: "8px 18px" }}>
            A series in {parts.length || 6} parts
          </span>
        </div>

        <div style={{ display: "flex", fontSize: 60, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 1040 }}>{title}</div>

        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 28, rowGap: 12 }}>
          {parts.map((p) => (
            <div key={p.slug} style={{ display: "flex", alignItems: "center", gap: 12, width: 500 }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  border: "1.5px solid #d8bb84",
                  color: "#d8bb84",
                  fontSize: 18,
                }}
              >
                {p.n}
              </span>
              <span style={{ fontSize: 23, color: "#d6d3cc" }}>{p.post.title}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(148,163,184,0.18)",
            paddingTop: 20,
            fontSize: 20,
            color: "#8e919c",
          }}
        >
          <span>{data ? `${data.minutes} min in all` : ""}</span>
          <span style={{ color: "#d8bb84" }}>ahmed-shaker.com/blog</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
