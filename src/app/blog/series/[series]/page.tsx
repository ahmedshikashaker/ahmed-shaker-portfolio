import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Layers } from "lucide-react";
import { SITE_URL } from "@/lib/blog";
import { SERIES, getSeriesWithPosts, seriesUrl } from "@/lib/series";
import { ArrowGlyph } from "@/components/ui/Button";
import ShareBar from "@/components/blog/ShareBar";
import BoardCard from "@/components/blog/visuals/BoardCard";
import SeriesMap from "@/components/blog/SeriesMap";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERIES.map((s) => ({ series: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ series: string }> }): Promise<Metadata> {
  const { series: slug } = await params;
  const data = await getSeriesWithPosts(slug);
  if (!data) return {};
  const { series } = data;
  const title = `${series.title}: a series in ${data.parts.length} parts`;
  const image = `${SITE_URL}/og/series/${series.slug}`;
  return {
    title,
    description: series.description,
    alternates: { canonical: seriesUrl(series.slug) },
    openGraph: {
      type: "website",
      url: seriesUrl(series.slug),
      title,
      description: series.tagline,
      siteName: "Ahmed Shaker",
      images: [{ url: image, width: 1200, height: 630, alt: series.title }],
    },
    twitter: { card: "summary_large_image", title, description: series.tagline, images: [image] },
  };
}

const primaryBtn =
  "group inline-flex h-11 items-center gap-2 rounded-full bg-[var(--c-btn-bg)] px-5 text-sm font-medium text-[var(--c-btn-fg)] shadow-soft transition-colors hover:bg-[var(--c-btn-bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const secondaryBtn =
  "inline-flex h-11 items-center gap-2 rounded-full border border-line-2 bg-surface/70 px-5 text-sm font-medium text-fg transition-colors hover:border-line-3 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default async function SeriesPage({ params }: { params: Promise<{ series: string }> }) {
  const { series: slug } = await params;
  const data = await getSeriesWithPosts(slug);
  if (!data || data.parts.length === 0) notFound();
  const { series, parts, minutes } = data;
  const first = parts[0];
  const url = seriesUrl(series.slug);
  const dates = parts.map((p) => p.post.publishedDate).sort();
  const since = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${dates[0]}T00:00:00Z`));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#series`,
    url,
    name: series.title,
    description: series.description,
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/blog#blog` },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: parts.length,
      itemListElement: parts.map((p) => ({
        "@type": "ListItem",
        position: p.n,
        url: p.post.url,
        name: p.post.title,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: series.title, item: url },
    ],
  };

  return (
    <main className="shell pt-32 sm:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav aria-label="Breadcrumb" className="eyebrow flex items-center gap-2 text-fg-4">
        <Link href="/" className="transition-colors hover:text-fg">
          Portfolio
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="inline-flex items-center gap-1.5 transition-colors hover:text-fg">
          <ArrowLeft className="size-3" /> Writing
        </Link>
      </nav>

      {/* Hero */}
      <header className="mt-8 grid gap-8 border-b border-line pb-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
        <div className="lg:col-span-8">
          <div className="eyebrow flex items-center gap-3 text-fg-3">
            <span className="text-accent">A series in {parts.length} parts</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-3" />
            <span>Digital transformation</span>
          </div>
          <h1 className="mt-6 font-display text-display-2 text-fg">
            {series.title.split(", ")[0]}, <em className="text-accent">{series.title.split(", ").slice(1).join(", ")}</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lede text-fg-3">{series.tagline}</p>
        </div>
        <div className="space-y-5 lg:col-span-4">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-fg-3">
            <li className="inline-flex items-center gap-1.5">
              <Layers className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> {parts.length} essays
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> {minutes} min in all
            </li>
            <li className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> Since {since}
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/blog/${first.slug}`} className={primaryBtn}>
              Start with part 1 <ArrowGlyph direction="right" />
            </Link>
          </div>
          <ShareBar url={url} title={series.title} excerpt={series.tagline} language="en" variant="icons" />
        </div>
      </header>

      {/* The route */}
      <section className="mt-12" aria-label="The series as one route">
        <SeriesMap parts={parts.map((p) => ({ n: p.n, wall: p.wall, title: p.post.title, href: `/blog/${p.slug}` }))} />
      </section>

      {/* The six essays */}
      <section className="mt-16" aria-labelledby="essays-title">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
          <h2 id="essays-title" className="font-display text-display-3 text-fg">
            The <em className="text-accent">essays</em>
          </h2>
          <p className="hidden text-[13px] text-fg-3 sm:block">Read in order, or start with the wall you’re facing.</p>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {parts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line-2 bg-surface p-5 shadow-[var(--shadow-soft)] transition-colors hover:border-accent/50 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-full border border-accent/50 font-display text-[1.15rem] text-accent">{p.n}</span>
                    <span className="eyebrow text-fg-4">{p.wall}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-fg-4">
                    <Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> {p.post.readingMinutes} min
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[1.6rem] leading-tight text-fg transition-colors group-hover:text-accent">{p.post.title}</h3>
                <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-fg-3">{p.post.excerpt}</p>

                <div className="mt-5 rounded-xl border border-line bg-bg-2/40 px-4 py-3">
                  <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    {p.stat.before && (
                      <>
                        <span className="font-mono text-[12.5px] tabular-nums text-fg-4 line-through decoration-danger/60">{p.stat.before}</span>
                        <span className="text-fg-4" aria-hidden="true">
                          →
                        </span>
                      </>
                    )}
                    <span className="font-display text-[1.7rem] leading-none tabular-nums text-signal">{p.stat.value}</span>
                  </p>
                  <p className="mt-1.5 text-[12px] leading-snug text-fg-3">{p.stat.label}</p>
                </div>

                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium text-accent">
                  Read part {p.n} <ArrowGlyph direction="right" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* The series for a board */}
      <section className="mx-auto mt-6 max-w-3xl" aria-label="The series in six lines">
        <BoardCard title="Six things to tell a board about digital transformation">
          <ol>
            {parts.map((p) => (
              <li key={p.slug}>
                <p>
                  <strong>{p.wall}.</strong> {p.boardLine}
                </p>
              </li>
            ))}
          </ol>
        </BoardCard>
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-line pt-10 text-center">
        <Link href={`/blog/${first.slug}`} className={primaryBtn}>
          Start with part 1: {first.post.title} <ArrowGlyph direction="right" />
        </Link>
        <Link href="/blog" className={secondaryBtn}>
          All articles
        </Link>
      </section>
    </main>
  );
}
