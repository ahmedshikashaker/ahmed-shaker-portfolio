import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, CalendarDays, RefreshCw } from "lucide-react";
import {
  getAllPosts,
  getPost,
  getRelatedPosts,
  getAdjacentPosts,
  formatDate,
  SITE_URL,
} from "@/lib/blog";
import { renderMarkdoc } from "@/components/blog/MarkdocComponents";
import { readingLabel } from "@/lib/blog-format";
import ShareBar from "@/components/blog/ShareBar";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/blog/ReadingProgress";
import AuthorCard from "@/components/blog/AuthorCard";
import PostCard from "@/components/blog/PostCard";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

function shareImage(post: { slug: string; coverImage: string | null }) {
  return post.coverImage ? `${SITE_URL}${post.coverImage}` : `${SITE_URL}/og/blog/${post.slug}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const image = shareImage(post);
  return {
    title,
    description: post.excerpt,
    keywords: [...post.tags, post.categoryLabel, "Ahmed Shaker"],
    authors: [{ name: "Ahmed Shaker", url: SITE_URL }],
    alternates: { canonical: post.canonicalUrl || post.url },
    openGraph: {
      type: "article",
      url: post.url,
      title,
      description: post.excerpt,
      siteName: "Ahmed Shaker",
      locale: post.language === "ar" ? "ar_KW" : "en_US",
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate ?? post.publishedDate,
      authors: [SITE_URL],
      section: post.categoryLabel,
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.excerpt,
      images: [image],
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [related, { newer, older }] = await Promise.all([getRelatedPosts(post), getAdjacentPosts(post.slug)]);
  const isAr = post.language === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${post.url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [shareImage(post)],
    datePublished: post.publishedDate,
    dateModified: post.updatedDate ?? post.publishedDate,
    inLanguage: post.language,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingMinutes}M`,
    articleSection: post.categoryLabel,
    keywords: post.tags.join(", "),
    url: post.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": post.url },
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Ahmed Shaker",
      url: SITE_URL,
      jobTitle: "Executive Manager – Head of Digital Technology",
    },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/blog#blog` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: post.url },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <article lang={post.language} dir={dir} className={`print-article ${isAr ? "font-arabic" : ""}`}>
        <div className="shell grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] xl:gap-20">
          <div className="mx-auto w-full min-w-0 max-w-3xl lg:mx-0 lg:ms-auto">
            <header className="pt-32 text-start sm:pt-40 print:pt-0">
              <nav aria-label="Breadcrumb" className="eyebrow flex items-center gap-2 text-fg-4 print:hidden" dir="ltr">
                <Link href="/" className="transition-colors hover:text-fg">
                  Portfolio
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/blog" className="inline-flex items-center gap-1.5 transition-colors hover:text-fg">
                  <ArrowLeft className="size-3" /> Writing
                </Link>
              </nav>

              {post.draft && (
                <div className="mt-6 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-200 print:hidden" dir="ltr">
                  Draft: visible only in local development. Untick “Draft” in the editor to publish.
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]">
                <Link
                  href={`/blog?category=${post.category}`}
                  className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-medium text-accent transition-colors hover:border-accent"
                >
                  {post.categoryLabel}
                </Link>
                <span className="inline-flex items-center gap-1.5 text-fg-3">
                  <CalendarDays className="size-3.5" strokeWidth={1.75} />
                  <time dateTime={post.publishedDate}>{post.displayDate}</time>
                </span>
                <span className="inline-flex items-center gap-1.5 text-fg-3">
                  <Clock className="size-3.5" strokeWidth={1.75} />
                  {readingLabel(post.readingMinutes, post.language)}
                </span>
                {post.updatedDate && (
                  <span className="inline-flex items-center gap-1.5 text-fg-3">
                    <RefreshCw className="size-3.5" strokeWidth={1.75} />
                    {isAr ? "حُدّث " : "Updated "}
                    <time dateTime={post.updatedDate}>{formatDate(post.updatedDate, post.language)}</time>
                  </span>
                )}
              </div>

              <h1 className={`mt-6 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.06] tracking-[-0.025em] text-fg ${isAr ? "font-semibold leading-[1.3] tracking-normal" : "font-display"}`}>
                {post.title}
              </h1>
              <p className={`mt-6 text-[1.25rem] leading-relaxed text-fg-3 ${isAr ? "" : "font-display italic"}`}>{post.excerpt}</p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
                <div className="flex items-center gap-3">
                  <div className="duotone relative size-11 overflow-hidden rounded-full border border-line-2">
                    <Image src="/assets/profile/ahmed-shaker-portrait.jpg" alt="Ahmed Shaker" fill sizes="44px" className="object-cover object-[50%_24%]" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[14px] font-medium text-fg">{isAr ? "أحمد شاكر" : "Ahmed Shaker"}</div>
                    <div className="mt-0.5 text-[12px] text-fg-3">
                      {isAr ? "مدير تنفيذي – رئيس التكنولوجيا الرقمية، KIB" : "Executive Manager – Head of Digital Technology, KIB"}
                    </div>
                  </div>
                </div>
                <div className="print:hidden">
                  <ShareBar url={post.url} title={post.title} excerpt={post.excerpt} language={post.language} variant="icons" />
                </div>
              </div>
            </header>

            {post.coverImage && (
              <div className="mt-10">
                <div className="relative w-full overflow-hidden rounded-xl border border-line-2" style={{ aspectRatio: "1.9 / 1" }}>
                  <Image src={post.coverImage} alt={post.coverAlt} fill priority sizes="(min-width: 1024px) 768px, 100vw" className="object-cover" />
                </div>
              </div>
            )}

            <div id="article-body" className="mt-12">
              <div className={`blog-prose prose prose-lg max-w-none ${isAr ? "blog-prose-ar" : ""}`}>{renderMarkdoc(post.renderable)}</div>

              {post.tags.length > 0 && (
                <div className="mt-14 flex flex-wrap gap-2 print:hidden">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-line-2 px-3 py-1 text-[13px] text-fg-3 transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-10 border border-line-2 bg-surface/50 p-6 sm:p-8 print:hidden">
                <ShareBar url={post.url} title={post.title} excerpt={post.excerpt} language={post.language} variant="full" />
              </div>

              <div className="mt-8 print:hidden">
                <AuthorCard language={post.language} />
              </div>

              {(newer || older) && (
                <nav className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 print:hidden" dir="ltr" aria-label="More articles">
                  {older ? (
                    <Link href={`/blog/${older.slug}`} className="group bg-bg p-6 transition-colors hover:bg-surface">
                      <div className="eyebrow flex items-center gap-1.5 text-fg-4">
                        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" /> Previous
                      </div>
                      <div className="mt-2 font-display text-[1.2rem] leading-snug text-fg transition-colors group-hover:text-accent" dir={older.language === "ar" ? "rtl" : "ltr"}>
                        {older.title}
                      </div>
                    </Link>
                  ) : (
                    <span className="bg-bg" />
                  )}
                  {newer ? (
                    <Link href={`/blog/${newer.slug}`} className="group bg-bg p-6 text-end transition-colors hover:bg-surface">
                      <div className="eyebrow flex items-center justify-end gap-1.5 text-fg-4">
                        Next <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <div className="mt-2 font-display text-[1.2rem] leading-snug text-fg transition-colors group-hover:text-accent" dir={newer.language === "ar" ? "rtl" : "ltr"}>
                        {newer.title}
                      </div>
                    </Link>
                  ) : (
                    <span className="bg-bg" />
                  )}
                </nav>
              )}
            </div>
          </div>

          <aside className="hidden pt-40 lg:block print:hidden">
            <div className="sticky top-28 space-y-8">
              <TableOfContents items={post.toc} language={post.language} />
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="shell mt-28 print:hidden" aria-labelledby="related-title">
          <div className="flex items-end justify-between gap-6 border-t border-line pt-10">
            <h2 id="related-title" className="font-display text-display-3 text-fg">
              Keep <em className="text-accent">reading</em>
            </h2>
            <Link href="/blog" className="link-sweep text-[13.5px] text-fg-3 hover:text-fg">
              All articles
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
