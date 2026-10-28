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

      <article lang={post.language} dir={dir} className={isAr ? "font-arabic" : ""}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_220px] gap-12">
        <div className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0 lg:ms-auto">
        {/* Header */}
        <header className="pt-12 sm:pt-16 text-start">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#dfc490]" dir="ltr">
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>

          {post.draft && (
            <div className="mt-6 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm text-amber-200" dir="ltr">
              Draft: visible only in local development. Untick “Draft” in the editor to publish.
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
            <Link href={`/blog?category=${post.category}`} className="font-medium text-[#dfc490] hover:underline">
              {post.categoryLabel}
            </Link>
            <span className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <CalendarDays className="w-3.5 h-3.5" />
              <time dateTime={post.publishedDate}>{post.displayDate}</time>
            </span>
            <span className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {readingLabel(post.readingMinutes, post.language)}
            </span>
            {post.updatedDate && (
              <>
                <span className="text-slate-600">·</span>
                <span className="inline-flex items-center gap-1.5 text-slate-400">
                  <RefreshCw className="w-3.5 h-3.5" />
                  {isAr ? "حُدّث " : "Updated "}
                  <time dateTime={post.updatedDate}>{formatDate(post.updatedDate, post.language)}</time>
                </span>
              </>
            )}
          </div>

          <h1 className={`mt-4 text-3xl sm:text-[2.6rem] font-bold text-slate-50 tracking-tight leading-[1.18] ${isAr ? "" : "font-display"}`}>
            {post.title}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-300 leading-relaxed">{post.excerpt}</p>

          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap border-y border-slate-200/[0.07] py-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#dfc490]/50">
                <Image src="/assets/profile/ahmed-shaker-portrait.jpg" alt="Ahmed Shaker" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-100">{isAr ? "أحمد شاكر" : "Ahmed Shaker"}</div>
                <div className="text-xs text-slate-400">
                  {isAr ? "مدير تنفيذي – رئيس التكنولوجيا الرقمية، KIB" : "Executive Manager – Head of Digital Technology, KIB"}
                </div>
              </div>
            </div>
            <ShareBar url={post.url} title={post.title} excerpt={post.excerpt} language={post.language} variant="icons" />
          </div>
        </header>

        {/* Cover */}
        {post.coverImage && (
          <div className="mt-10">
            <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200/[0.08]" style={{ aspectRatio: "1.9 / 1" }}>
              <Image src={post.coverImage} alt={post.coverAlt} fill priority sizes="(min-width: 1024px) 768px, 100vw" className="object-cover" />
            </div>
          </div>
        )}

        {/* Body */}
          <div id="article-body" className="mt-12">
            <div className={`blog-prose prose prose-invert prose-lg max-w-none ${isAr ? "blog-prose-ar" : ""}`}>
              {renderMarkdoc(post.renderable)}
            </div>

            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full border border-slate-200/10 text-[13px] text-slate-300 hover:border-[#d4b982]/50 hover:text-[#dfc490]"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-slate-200/[0.09] bg-[#131c31]/70 p-6">
              <ShareBar url={post.url} title={post.title} excerpt={post.excerpt} language={post.language} variant="full" />
            </div>

            <div className="mt-8">
              <AuthorCard language={post.language} />
            </div>

            {(newer || older) && (
              <nav className="mt-10 grid sm:grid-cols-2 gap-4" dir="ltr" aria-label="More articles">
                {older ? (
                  <Link href={`/blog/${older.slug}`} className="group rounded-2xl border border-slate-200/[0.08] p-5 hover:border-[#d4b982]/45">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500"><ArrowLeft className="w-3.5 h-3.5" /> Previous</div>
                    <div className="mt-1.5 font-semibold text-slate-100 group-hover:text-[#dfc490]" dir={older.language === "ar" ? "rtl" : "ltr"}>{older.title}</div>
                  </Link>
                ) : <span />}
                {newer && (
                  <Link href={`/blog/${newer.slug}`} className="group rounded-2xl border border-slate-200/[0.08] p-5 text-end hover:border-[#d4b982]/45">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500">Next <ArrowRight className="w-3.5 h-3.5" /></div>
                    <div className="mt-1.5 font-semibold text-slate-100 group-hover:text-[#dfc490]" dir={newer.language === "ar" ? "rtl" : "ltr"}>{newer.title}</div>
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>

          <aside className="hidden lg:block pt-16">
            <div className="sticky top-24 space-y-8">
              <TableOfContents items={post.toc} language={post.language} />
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
          <h2 className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">Keep reading</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
