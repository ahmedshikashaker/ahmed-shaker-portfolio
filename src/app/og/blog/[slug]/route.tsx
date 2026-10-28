import { ImageResponse } from "next/og";
import { getAllPosts, getPost, categoryLabel } from "@/lib/blog";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

/**
 * 1200×630 share preview for articles without a cover image.
 * Arabic titles are not drawn (the OG renderer cannot shape Arabic script),
 * so Arabic posts get a branded card; add a cover image to show a custom visual.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const isAr = post?.language === "ar";
  const title = post && !isAr ? post.title : "A new article by Ahmed Shaker";
  const fontSize = title.length > 90 ? 50 : title.length > 60 ? 58 : 66;

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
          background: "radial-gradient(circle at 88% 12%, #1e2b45 0%, #0f172a 70%)",
          color: "#f8fafc",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 44, background: "#dfc490", borderRadius: 4 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 26, fontWeight: 700 }}>Ahmed Shaker</span>
              <span style={{ fontSize: 17, color: "#94a3b8" }}>Executive Manager – Head of Digital Technology</span>
            </div>
          </div>
          <span
            style={{
              fontSize: 18,
              color: "#5eead4",
              border: "1px solid rgba(94,234,212,0.4)",
              borderRadius: 999,
              padding: "8px 18px",
            }}
          >
            {post ? categoryLabel(post.category) : "Blog"}
          </span>
        </div>

        <div style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em", maxWidth: 1040 }}>
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(148,163,184,0.18)",
            paddingTop: 24,
            fontSize: 20,
            color: "#94a3b8",
          }}
        >
          <span>{post ? `${post.readingMinutes} min read${isAr ? " · Arabic" : ""}` : ""}</span>
          <span style={{ color: "#dfc490" }}>ahmed-shaker.com/blog</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
