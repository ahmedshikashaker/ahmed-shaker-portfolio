import { getAllPosts, SITE_URL } from "@/lib/blog";

export const dynamic = "force-static";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** RSS 2.0 feed: lets readers subscribe and lets Medium, Dev.to, LinkedIn newsletters, etc. import posts. */
export async function GET() {
  const posts = (await getAllPosts()).filter((p) => !p.draft);
  const lastBuild = posts[0]?.publishedDate ?? new Date().toISOString().slice(0, 10);

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${p.url}</link>
      <guid isPermaLink="true">${p.url}</guid>
      <pubDate>${new Date(`${p.publishedDate}T08:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.excerpt)}</description>
      <category>${esc(p.categoryLabel)}</category>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")}
      <dc:creator>Ahmed Shaker</dc:creator>
      <dc:language>${p.language}</dc:language>${
        p.coverImage ? `\n      <enclosure url="${SITE_URL}${p.coverImage}" type="image/${p.coverImage.split(".").pop() === "png" ? "png" : "jpeg"}" length="0" />` : ""
      }
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Ahmed Shaker — Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Digital banking, software architecture, and engineering leadership, by Ahmed Shaker.</description>
    <language>en</language>
    <lastBuildDate>${new Date(`${lastBuild}T08:00:00Z`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
