import { getAllPosts, SITE_URL } from "@/lib/blog";
import { SERIES, seriesUrl } from "@/lib/series";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";

export const dynamic = "force-static";

/**
 * /llms.txt (llmstxt.org): a plain-Markdown map of the site for AI assistants and agents.
 * Google doesn't use it; ChatGPT, Claude, Perplexity and agent tools can read it without rendering pages.
 */
export async function GET() {
  const posts = (await getAllPosts()).filter((p) => !p.draft && !p.canonicalUrl);
  const bySlug = new Map(posts.map((p) => [p.slug, p]));

  const series = SERIES.map((s) => ({ s, published: s.parts.filter((part) => bySlug.has(part.slug)).length })).filter(
    ({ published }) => published > 0
  );
  const inSeries = new Set(SERIES.flatMap((s) => s.parts.map((p) => p.slug)));

  const line = (title: string, url: string, note: string) => `- [${title}](${url}): ${note}`;
  const postLine = (slug: string) => {
    const p = bySlug.get(slug);
    return p ? `  ${line(p.title, p.url, `${p.excerpt} (${p.publishedDate})`)}` : null;
  };

  const body = [
    "# Ahmed Shaker",
    "",
    `> ${EXECUTIVE_PROFILE.title} at Kuwait International Bank (KIB). Writes about digital transformation in banking, building banking digital factories, and governing enterprise AI.`,
    "",
    EXECUTIVE_PROFILE.shortBio,
    "",
    "## Series",
    "",
    ...series.flatMap(({ s, published }) => [
      line(s.title, seriesUrl(s.slug), `${s.description} ${published} of ${s.parts.length} parts published.`),
      ...s.parts.map((part) => postLine(part.slug)).filter((l): l is string => l !== null),
    ]),
    "",
    "The Governed Autonomy series is independent architecture research, not a description of any employer's systems.",
    "",
    ...(posts.some((p) => !inSeries.has(p.slug))
      ? ["## Other articles", "", ...posts.filter((p) => !inSeries.has(p.slug)).map((p) => line(p.title, p.url, `${p.excerpt} (${p.publishedDate})`)), ""]
      : []),
    "## About",
    "",
    line("Portfolio", SITE_URL, "career, the two banking digital factories, and the platforms delivered"),
    line("All articles", `${SITE_URL}/blog`, "the blog index"),
    line("RSS feed", `${SITE_URL}/blog/rss.xml`, "every article with its summary"),
    line("LinkedIn", EXECUTIVE_PROFILE.contact.linkedin, "professional profile"),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
