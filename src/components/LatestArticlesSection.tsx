import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import PostCard from "./blog/PostCard";

/** Home-page teaser of the newest articles. Hidden until the first article is published. */
export default function LatestArticlesSection({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <section id="articles" className="relative py-24 bg-[#0f172a] border-b border-slate-200/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-tech uppercase tracking-widest text-[#dfc490]">Insights & Articles</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight">
              Latest from the{" "}
              <span className="font-editorial italic font-normal text-[#dfc490]">blog</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-[#dfc490] hover:bg-[#e8d1a4] transition-colors"
          >
            All articles <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
