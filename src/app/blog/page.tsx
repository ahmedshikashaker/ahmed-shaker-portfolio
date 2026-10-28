import type { Metadata } from "next";
import { getAllPosts, SITE_URL } from "@/lib/blog";
import BlogIndex from "@/components/blog/BlogIndex";

export const metadata: Metadata = {
  title: "Blog — Digital Banking, Architecture & Engineering Leadership",
  description:
    "Articles by Ahmed Shaker (أحمد شاكر), Executive Manager – Head of Digital Technology at KIB, on digital banking, building digital factories, software architecture, mobile, DevOps, and engineering leadership.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Ahmed Shaker — Blog",
    description: "Insights on digital banking, architecture, and engineering leadership.",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: "Ahmed Shaker — Blog",
    inLanguage: ["en", "ar"],
    author: { "@id": `${SITE_URL}/#person` },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: p.url,
      datePublished: p.publishedDate,
      inLanguage: p.language,
    })),
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl">
        <div className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">Insights & Articles</div>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-slate-50 tracking-tight leading-[1.1]">
          Notes on building{" "}
          <span className="font-editorial italic font-normal text-champagne-gradient">digital banks</span>.
        </h1>
        <p className="mt-4 text-lg text-slate-300 leading-relaxed">
          Digital banking, software architecture, engineering leadership, and lessons from building two banking
          digital factories, in English and العربية.
        </p>
      </div>
      <BlogIndex posts={posts} />
    </main>
  );
}
