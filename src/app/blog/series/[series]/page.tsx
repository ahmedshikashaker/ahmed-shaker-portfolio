import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Compass, Layers } from "lucide-react";
import { SITE_URL } from "@/lib/blog";
import { SERIES, getSeriesWithPosts, seriesUrl } from "@/lib/series";
import { ArrowGlyph } from "@/components/ui/Button";
import ShareBar from "@/components/blog/ShareBar";
import BoardCard from "@/components/blog/visuals/BoardCard";
import SeriesMap from "@/components/blog/SeriesMap";
import ComingSoonSeriesModal, {
  ComingSoonPartTrigger,
  type ComingSoonPartPayload,
} from "@/components/blog/ComingSoonSeriesModal";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERIES.map((s) => ({ series: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ series: string }> }): Promise<Metadata> {
  const { series: slug } = await params;
  const data = await getSeriesWithPosts(slug);
  if (!data) return {};
  const { series, allParts } = data;
  const title = `${series.title}: a series in ${allParts.length} parts`;
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
  const { series, parts, allParts, minutes } = data;
  const first = parts[0];
  const url = seriesUrl(series.slug);
  const dates = parts.map((p) => p.post.publishedDate).sort();
  const since = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${dates[0]}T00:00:00Z`));
  const hasRoadmapParts = allParts.length > parts.length;

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
      numberOfItems: allParts.length,
      itemListElement: allParts.map((p) => ({
        "@type": "ListItem",
        position: p.n,
        url: p.post ? p.post.url : `${url}#part-${p.n}`,
        name: p.title,
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
          <div className="eyebrow flex flex-wrap items-center gap-3 text-fg-3">
            <span className="text-accent">A series in {allParts.length} parts</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-3" />
            <span>{series.eyebrowLabel ?? "Digital transformation"}</span>
            {series.slug === "governed-ai" && (
              <>
                <span aria-hidden="true" className="h-px w-8 bg-line-3" />
                <span className="rounded-full border border-line-2 bg-surface px-2.5 py-0.5 font-mono text-[10px] text-fg-2">
                  Independent Architecture Research
                </span>
              </>
            )}
          </div>
          <h1 className="mt-6 font-display text-display-2 text-fg">
            {series.title.split(", ")[0]}, <em className="text-accent">{series.title.split(", ").slice(1).join(", ")}</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lede text-fg-3">{series.tagline}</p>
          {series.centralThesis && (
            <blockquote className="mt-6 max-w-2xl rounded-xl border border-accent/35 bg-accent/[0.06] px-4 py-3.5 text-[14px] leading-relaxed text-fg-2">
              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Core Architectural Thesis</span>
              <span className="mt-1 block font-display text-[1.15rem] italic text-fg">“{series.centralThesis}”</span>
            </blockquote>
          )}
        </div>
        <div className="space-y-5 lg:col-span-4">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-fg-3">
            <li className="inline-flex items-center gap-1.5">
              <Layers className="size-3.5" strokeWidth={1.75} aria-hidden="true" />{" "}
              {hasRoadmapParts ? `${parts.length} of ${allParts.length} published` : `${allParts.length} essays`}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> {minutes} min published
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
        <SeriesMap
          seriesSlug={series.slug}
          parts={allParts.map((p) => ({
            n: p.n,
            wall: p.wall,
            title: p.title,
            href: p.post ? `/blog/${p.slug}` : `#part-${p.n}`,
            published: p.post !== null,
            comingSoonPayload:
              p.post === null
                ? {
                    n: p.n,
                    total: allParts.length,
                    seriesTitle: series.title,
                    seriesSlug: series.slug,
                    firstPublishedSlug: first.slug,
                    firstPublishedTitle: first.title,
                    wall: p.wall,
                    title: p.title,
                    excerpt: p.excerpt,
                    objective: p.objective,
                    keyConcepts: p.keyConcepts,
                    stat: p.stat,
                    boardLine: p.boardLine,
                  }
                : undefined,
          }))}
        />
      </section>

      {/* The essays & editorial roadmap */}
      <section className="mt-16" aria-labelledby="essays-title">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
          <h2 id="essays-title" className="font-display text-display-3 text-fg">
            {hasRoadmapParts ? (
              <>
                Essays &amp; <em className="text-accent">editorial roadmap</em>
              </>
            ) : (
              <>
                The <em className="text-accent">essays</em>
              </>
            )}
          </h2>
          <p className="hidden text-[13px] text-fg-3 sm:block">
            {hasRoadmapParts
              ? "Each installment builds one layer of the governed execution stack."
              : "Read in order, or start with the wall you’re facing."}
          </p>
        </div>
        <ol className="mt-8 grid gap-5 md:grid-cols-2">
          {allParts.map((p) => {
            if (p.post) {
              return (
                <li key={p.slug} id={`part-${p.n}`}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-signal/45 bg-surface p-5 shadow-[var(--shadow-soft)] transition-colors hover:border-signal sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-full border border-signal bg-signal/15 font-display text-[1.15rem] text-signal">
                          {p.n}
                        </span>
                        <span className="eyebrow text-fg-3">{p.wall}</span>
                      </span>
                      <span className="inline-flex items-center gap-2 text-[12px] text-fg-4">
                        {hasRoadmapParts && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-signal/40 bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
                            <CheckCircle2 className="size-3" /> Published
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> {p.post.readingMinutes} min
                        </span>
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-[1.6rem] leading-tight text-fg transition-colors group-hover:text-accent">
                      {p.post.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-fg-3">{p.post.excerpt}</p>

                    {p.objective && (
                      <div className="mt-4 rounded-xl border border-line bg-bg-2/35 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-fg-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-accent">Objective: </span>
                        {p.objective}
                      </div>
                    )}

                    {p.keyConcepts && p.keyConcepts.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.keyConcepts.map((c) => (
                          <span
                            key={c}
                            className="rounded-md border border-line-2 bg-bg px-2 py-0.5 font-mono text-[10.5px] text-fg-3"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 rounded-xl border border-line bg-bg-2/40 px-4 py-3">
                      <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        {p.stat.before && (
                          <>
                            <span className="font-mono text-[12.5px] tabular-nums text-fg-4 line-through decoration-danger/60">
                              {p.stat.before}
                            </span>
                            <span className="text-fg-4" aria-hidden="true">
                              →
                            </span>
                          </>
                        )}
                        <span className="font-display text-[1.7rem] leading-none tabular-nums text-signal">{p.stat.value}</span>
                      </p>
                      <p className="mt-1.5 text-[12px] leading-snug text-fg-3">{p.stat.label}</p>
                    </div>

                    {p.connectionToNext && (
                      <p className="mt-4 flex items-start gap-2 border-t border-line pt-3 text-[12px] text-fg-3">
                        <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-accent" />
                        <span>
                          <strong className="text-fg-2">Bridge to Part {p.n + 1}:</strong> {p.connectionToNext}
                        </span>
                      </p>
                    )}

                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium text-accent">
                      Read part {p.n} <ArrowGlyph direction="right" />
                    </span>
                  </Link>
                </li>
              );
            }

            // Upcoming roadmap part card (interactive Coming Soon dialog trigger)
            const comingSoonPayload: ComingSoonPartPayload = {
              n: p.n,
              total: allParts.length,
              seriesTitle: series.title,
              seriesSlug: series.slug,
              firstPublishedSlug: first.slug,
              firstPublishedTitle: first.title,
              wall: p.wall,
              title: p.title,
              excerpt: p.excerpt,
              objective: p.objective,
              keyConcepts: p.keyConcepts,
              stat: p.stat,
              boardLine: p.boardLine,
            };

            return (
              <li key={p.slug} id={`part-${p.n}`}>
                <ComingSoonPartTrigger
                  part={comingSoonPayload}
                  className="group flex h-full w-full flex-col rounded-2xl border border-line-2 bg-surface/80 p-5 text-left shadow-[var(--shadow-soft)] transition-colors hover:border-accent/60 hover:bg-surface sm:p-6"
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-9 items-center justify-center rounded-full border border-accent/50 font-display text-[1.15rem] text-accent">
                        {p.n}
                      </span>
                      <span className="eyebrow text-fg-4">{p.wall}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                      <Compass className="size-3" /> Coming Soon · Part {p.n}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-[1.55rem] leading-tight text-fg transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-fg-3">{p.excerpt}</p>

                  {p.objective && (
                    <div className="mt-4 w-full rounded-xl border border-line bg-bg-2/35 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-fg-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-accent">Editorial Objective: </span>
                      {p.objective}
                    </div>
                  )}

                  {p.keyConcepts && p.keyConcepts.length > 0 && (
                    <div className="mt-3 w-full">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-fg-4">Key Architectural Concepts</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {p.keyConcepts.map((c) => (
                          <span
                            key={c}
                            className="rounded-md border border-line-2 bg-bg px-2 py-0.5 font-mono text-[10.5px] text-fg-3"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 w-full rounded-xl border border-line bg-bg-2/40 px-4 py-3">
                    <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      {p.stat.before && (
                        <>
                          <span className="font-mono text-[12.5px] tabular-nums text-fg-4 line-through decoration-danger/60">
                            {p.stat.before}
                          </span>
                          <span className="text-fg-4" aria-hidden="true">
                            →
                          </span>
                        </>
                      )}
                      <span className="font-display text-[1.6rem] leading-none tabular-nums text-accent">{p.stat.value}</span>
                    </p>
                    <p className="mt-1.5 text-[12px] leading-snug text-fg-3">{p.stat.label}</p>
                  </div>

                  {p.connectionToNext && (
                    <p className="mt-4 flex w-full items-start gap-2 border-t border-line pt-3 text-[12px] text-fg-3">
                      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-accent" />
                      <span>
                        <strong className="text-fg-2">
                          {p.n < allParts.length ? `Connection to Part ${p.n + 1}:` : "Series Capstone:"}
                        </strong>{" "}
                        {p.connectionToNext}
                      </span>
                    </p>
                  )}

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium text-accent">
                    Coming soon · Click for preview <ArrowGlyph direction="right" />
                  </span>
                </ComingSoonPartTrigger>
              </li>
            );
          })}
        </ol>
      </section>

      <ComingSoonSeriesModal />

      {/* The series for a board */}
      <section className="mx-auto mt-10 max-w-3xl" aria-label="The series for an executive board">
        <BoardCard title={series.boardCardTitle ?? "Six things to tell a board about digital transformation"}>
          <ol>
            {allParts.map((p) => (
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
