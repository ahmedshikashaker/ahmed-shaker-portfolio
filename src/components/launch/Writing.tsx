import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SECTION_COPY } from "@/data/portfolioData";
import type { BlogLanguage, PostMeta } from "@/lib/blog";
import { readingLabel } from "@/lib/blog-format";
import { cn } from "@/lib/cn";
import { getSeriesWithPosts, seriesPath } from "@/lib/series";
import { FadeUp } from "./motion";
import { Band, ChevronLink, Emphasis, Heading, Wrap } from "./primitives";

/** Series order on the home page: the transformation essays first, then the AI governance series. */
const SERIES_ORDER = ["digital-transformation", "governed-ai"];
const FEATURED_COUNT = 3;
/** Cover art: the governance series has real frames from its explainer films; the other gets its six walls as type. */
const POSTER: Record<string, string> = { "governed-ai": "/videos/governed-autonomy-part-1-poster.jpg" };

const LANGUAGE_NAME: Record<BlogLanguage, string> = { en: "English", ar: "عربي" };

/** 05 · Writing: the two essay series as covers, the featured articles, and the door to the blog. */
export default async function Writing({ posts }: { posts: PostMeta[] }) {
  const copy = SECTION_COPY.writing;
  const series = (await Promise.all(SERIES_ORDER.map((slug) => getSeriesWithPosts(slug)))).filter(
    (entry): entry is NonNullable<typeof entry> => entry !== null && entry.parts.length > 0
  );
  const published = posts.filter((post) => !post.draft);
  const featured = [...published.filter((post) => post.featured), ...published.filter((post) => !post.featured)].slice(0, FEATURED_COUNT);

  return (
    <Band id="writing" tone="mist" labelledBy="writing-title">
      <Wrap className="py-[clamp(5rem,9vw,8rem)]">
        <Heading id="writing-title" kicker={copy.eyebrow} title={<Emphasis text={copy.title} />} sub={copy.subtitle} />

        {series.length > 0 && (
          <ul className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-2">
            {series.map(({ series: entry, parts, allParts, minutes }, i) => {
              const languages = [...new Set(parts.map((part) => part.post.language))];
              const count = parts.length === allParts.length ? `${parts.length} essays` : `${parts.length} of ${allParts.length} essays`;
              const poster = POSTER[entry.slug];
              return (
                <FadeUp as="li" key={entry.slug} delay={i * 0.1} className="h-full">
                  <Link
                    href={seriesPath(entry.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-[32px] bg-l-card transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden">
                      {poster ? (
                        <Image
                          src={poster}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 600px, 100vw"
                          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                      ) : (
                        <WallArt walls={allParts.map((part) => part.wall)} />
                      )}
                    </span>
                    <span className="flex flex-1 flex-col p-7 sm:p-9">
                      <span className="t-small font-semibold text-l-fg-3">
                        Essay series · {count} · {readingLabel(minutes, "en").replace(" read", "")}
                        {languages.length > 1 && <> · {languages.map((language) => LANGUAGE_NAME[language]).join(" & ")}</>}
                      </span>
                      <span className="t-h3 mt-2 block text-l-fg">{entry.title}</span>
                      <span className="t-body mt-3 block text-l-fg-3">{entry.tagline}</span>
                      <span className="l-link t-body mt-auto pt-6">
                        Read the series
                        <ChevronRight aria-hidden="true" className="size-[1em] translate-y-[0.04em] transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.2} />
                      </span>
                    </span>
                  </Link>
                </FadeUp>
              );
            })}
          </ul>
        )}

        {featured.length > 0 && (
          <FadeUp className="mt-16 lg:mt-24">
            <h3 className="t-h3 text-l-fg">Featured articles</h3>
            <ul className="mt-6 divide-y divide-l-line overflow-hidden rounded-[28px] bg-l-card">
              {featured.map((post) => {
                const isAr = post.language === "ar";
                return (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="group flex items-center gap-5 px-6 py-6 transition-colors duration-300 hover:bg-l-card-2 sm:px-8 sm:py-7">
                      <span className="min-w-0 flex-1">
                        <span dir={isAr ? "rtl" : "ltr"} lang={post.language} className={cn("t-h4 block text-l-fg", isAr && "font-arabic")}>
                          {post.title}
                        </span>
                        <span className={cn("t-small mt-1.5 block text-l-fg-3", isAr && "font-arabic")} lang={post.language}>
                          {readingLabel(post.readingMinutes, post.language)}
                        </span>
                      </span>
                      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-l-fg-4 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:text-l-link" strokeWidth={2} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <ChevronLink href="/blog" className="t-body">
                Visit the blog
              </ChevronLink>
              <ChevronLink href="/blog/rss.xml" className="t-body">
                RSS feed
              </ChevronLink>
            </div>
          </FadeUp>
        )}
      </Wrap>
    </Band>
  );
}

/** The six walls a change meets on its way to customers, set as one block of type. */
function WallArt({ walls }: { walls: string[] }) {
  return (
    <span aria-hidden="true" className="absolute inset-0 flex flex-col justify-center overflow-hidden bg-[#1d1d1f] px-[8%]">
      <span className="relative flex flex-col transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
        {walls.map((wall, i) => (
          <span
            key={wall}
            className={`font-head text-[clamp(1.6rem,3.6vw,2.9rem)] font-bold leading-[1.02] tracking-[-0.04em] ${i === walls.length - 1 ? "text-[#2997ff]" : "text-white"}`}
          >
            {wall}.
          </span>
        ))}
      </span>
    </span>
  );
}
