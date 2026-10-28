"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Clock, ArrowUpRight, PenLine } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import PostCard from "./PostCard";

type LangFilter = "all" | "en" | "ar";

export default function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<LangFilter>("all");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  // Allow deep links like /blog?tag=Kubernetes or /blog?category=architecture
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTag(params.get("tag"));
    setCategory(params.get("category"));
    const l = params.get("lang");
    if (l === "en" || l === "ar") setLang(l);
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    posts.forEach((p) => map.set(p.category, p.categoryLabel));
    return [...map.entries()];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (lang !== "all" && p.language !== lang) return false;
      if (category && p.category !== category) return false;
      if (tag && !p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      if (!q) return true;
      return [p.title, p.excerpt, p.categoryLabel, ...p.tags].join(" ").toLowerCase().includes(q);
    });
  }, [posts, query, lang, category, tag]);

  const hasFilters = Boolean(query || lang !== "all" || category || tag);
  const featured = !hasFilters ? posts.find((p) => p.featured) ?? posts[0] : null;
  const grid = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered;

  const clear = () => {
    setQuery("");
    setLang("all");
    setCategory(null);
    setTag(null);
    window.history.replaceState(null, "", "/blog");
  };

  if (posts.length === 0) {
    return (
      <div className="mt-14 rounded-3xl border border-dashed border-slate-200/15 bg-[#131c31]/60 p-12 text-center">
        <PenLine className="w-8 h-8 mx-auto text-[#dfc490]" />
        <h2 className="mt-4 text-xl font-semibold text-slate-100">The first articles are on their way</h2>
        <p className="mt-2 text-slate-400 max-w-md mx-auto">
          Insights on digital banking, architecture, and engineering leadership will be published here soon.
          Subscribe via RSS to get notified.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-10">
      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, topics, tags… / ابحث"
              className="w-full h-11 ps-10 pe-4 rounded-xl bg-[#131c31] border border-slate-200/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#d4b982]/60"
            />
          </label>
          <div className="inline-flex h-11 items-center rounded-xl bg-[#131c31] p-1 border border-slate-200/10 self-start sm:self-auto">
            {(
              [
                ["all", "All"],
                ["en", "English"],
                ["ar", "العربية"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setLang(value)}
                className={`h-full px-3.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  lang === value ? "bg-[#dfc490] text-slate-950 font-semibold" : "text-slate-300 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categories.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setCategory(category === value ? null : value)}
                className={`px-3 py-1.5 rounded-full text-[13px] border transition-colors cursor-pointer ${
                  category === value
                    ? "bg-[#dfc490]/15 border-[#dfc490]/60 text-[#dfc490]"
                    : "border-slate-200/10 text-slate-300 hover:border-slate-200/25"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span>
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
              {tag && (
                <>
                  {" "}tagged <span className="text-[#dfc490]">#{tag}</span>
                </>
              )}
            </span>
            <button onClick={clear} className="inline-flex items-center gap-1 text-[#dfc490] hover:underline cursor-pointer">
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Featured */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-slate-200/[0.09] hover:border-[#d4b982]/45 bg-[#131c31]/80 transition-colors"
        >
          <div className="relative min-h-[240px] bg-[#182338]">
            {featured.coverImage ? (
              <Image src={featured.coverImage} alt={featured.coverAlt} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
            ) : (
              <div className="absolute inset-0 soft-grid-bg bg-gradient-to-br from-[#1e2b45] via-[#131c31] to-[#0f172a] flex items-end p-8">
                <span className="font-editorial italic text-5xl text-[#dfc490]/80">{featured.categoryLabel}</span>
              </div>
            )}
          </div>
          <div className="p-7 sm:p-9 flex flex-col justify-center" dir={featured.language === "ar" ? "rtl" : "ltr"} lang={featured.language}>
            <div className="text-xs font-tech text-[#5eead4]">{featured.featured ? "Featured article" : "Latest article"}</div>
            <h2 className={`mt-3 text-2xl sm:text-3xl font-bold text-slate-50 leading-tight group-hover:text-[#dfc490] transition-colors ${featured.language === "ar" ? "font-arabic" : ""}`}>
              {featured.title}
            </h2>
            <p className={`mt-3 text-slate-300 leading-relaxed ${featured.language === "ar" ? "font-arabic" : ""}`}>{featured.excerpt}</p>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
              <span className="text-[#dfc490]">{featured.categoryLabel}</span>
              <span>{featured.displayDate}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {featured.readingMinutes} min
              </span>
              <ArrowUpRight className="ms-auto w-5 h-5 text-[#dfc490] rtl:-scale-x-100" />
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      {grid.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((post, i) => (
            <PostCard key={post.slug} post={post} priority={i < 3} />
          ))}
        </div>
      ) : (
        hasFilters && (
          <p className="text-center text-slate-400 py-10">No articles match your filters.</p>
        )
      )}
    </div>
  );
}
