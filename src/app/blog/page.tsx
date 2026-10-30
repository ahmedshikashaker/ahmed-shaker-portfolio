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
    <main className="shell pt-32 sm:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="grid gap-8 border-b border-line pb-12 lg:grid-cols-12 lg:items-end lg:gap-x-12">
        <div className="lg:col-span-8">
          <div className="eyebrow flex items-center gap-3 text-fg-3">
            <span className="text-accent">Writing</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-3" />
            <span>Insights &amp; articles</span>
          </div>
          <h1 className="mt-6 font-display text-display-2 text-fg">
            Notes on building <em className="text-accent">digital banks</em>.
          </h1>
        </div>
        <p className="text-lede text-fg-3 lg:col-span-4">
          Digital banking, software architecture, engineering leadership, and lessons from building two banking digital factories, in
          English and <span className="font-arabic">العربية</span>.
        </p>
      </header>
      <BlogIndex posts={posts} />
    </main>
  );
}
