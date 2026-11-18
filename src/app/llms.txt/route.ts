import { getAllPosts, SITE_URL } from "@/lib/blog";
import { SERIES, seriesUrl } from "@/lib/series";
import {
  ARCHIVE_PLATFORMS,
  EXECUTIVE_CASE_STUDIES,
  EXECUTIVE_PROFILE,
  FACTORIES,
  FLAGSHIP_PLATFORMS,
  TRACK_RECORD,
} from "@/data/portfolioData";

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
    "# Ahmed Shaker (أحمد شاكر)",
    "",
    `> ${EXECUTIVE_PROFILE.title} at Kuwait International Bank (KIB). Writes about digital transformation in banking, building banking digital factories, and governing enterprise AI.`,
    "",
    EXECUTIVE_PROFILE.shortBio,
    "",
    "## Digital Factories Built from Zero",
    "",
    ...FACTORIES.map(
      (f) =>
        `- **${f.factoryName} (${f.institution}, ${f.period})** — ${f.role}: ${f.mandate} Lines delivered: ${f.linesUnlocked.join(", ")}.`
    ),
    "",
    "## Executive Case Studies",
    "",
    ...EXECUTIVE_CASE_STUDIES.map((c) => line(c.title, `${SITE_URL}/?brief=${c.id}`, c.subtitle)),
    "",
    "## Production Platforms Delivered",
    "",
    ...[...FLAGSHIP_PLATFORMS, ...ARCHIVE_PLATFORMS].map((p) =>
      line(
        `${p.name} (${p.institution})`,
        p.listing?.href ?? `${SITE_URL}/?platform=${p.id}#ecosystems`,
        `${p.domain} — ${p.outcome}`
      )
    ),
    "",
    "## Career Track Record",
    "",
    ...TRACK_RECORD.map((r) => `- **${r.title}**, ${r.institution} (${r.period}, ${r.location}): ${r.mandate}`),
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
    line("Executive CV", `${SITE_URL}/#cv`, "1-page A4 executive curriculum vitae in English and Arabic"),
    line("All articles", `${SITE_URL}/blog`, "the blog index"),
    line("RSS feed", `${SITE_URL}/blog/rss.xml`, "every article with its summary"),
    line("LinkedIn", EXECUTIVE_PROFILE.contact.linkedin, "professional profile"),
    line("GitHub", EXECUTIVE_PROFILE.contact.github, "code & repositories"),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
