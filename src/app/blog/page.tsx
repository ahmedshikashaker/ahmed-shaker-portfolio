import type { Metadata } from "next";
import { getAllPosts, SITE_URL } from "@/lib/blog";
import BlogIndex from "@/components/blog/BlogIndex";
import SeriesBanner from "@/components/blog/SeriesBanner";

export const metadata: Metadata = {
  title: "Blog — Digital Banking, Architecture & AI Governance",
  description:
    "Articles by Ahmed Shaker (أحمد شاكر) on digital banking, building digital factories, software architecture, AI governance and engineering leadership.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    locale: "en_US",
    siteName: "Ahmed Shaker",
    title: "Ahmed Shaker — Blog",
    description: "Digital banking, digital factories, software architecture, AI governance and engineering leadership.",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Ahmed Shaker — Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Shaker — Blog",
    description: "Digital banking, digital factories, software architecture, AI governance and engineering leadership.",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Ahmed Shaker — Blog" }],
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog#blog`,
        url: `${SITE_URL}/blog`,
        name: "Ahmed Shaker — Blog",
        description:
          "Articles by Ahmed Shaker on digital banking, building digital factories, software architecture, AI governance and engineering leadership.",
        inLanguage: ["en", "ar"],
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        blogPost: posts.slice(0, 20).map((p) => ({
          "@type": "BlogPosting",
          "@id": `${p.url}#article`,
          headline: p.title,
          description: p.excerpt,
          url: p.url,
          datePublished: p.publishedDate,
          dateModified: p.updatedDate ?? p.publishedDate,
          inLanguage: p.language,
          author: { "@id": `${SITE_URL}/#person` },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        ],
      },
    ],
  };

  return (
    <div className="shell pt-32 sm:pt-40">
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
      <SeriesBanner />
      <BlogIndex posts={posts} />
    </div>
  );
}
