"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, PenLine, Rss, Search, X } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { readingLabel } from "@/lib/blog-format";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/primitives";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import PostCard, { GeneratedCover } from "./PostCard";

type LangFilter = "all" | "en" | "ar";

export default function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<LangFilter>("all");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Deep links like /blog?tag=Kubernetes, /blog?category=architecture or /blog?lang=ar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTag(params.get("tag"));
    setCategory(params.get("category"));
    const l = params.get("lang");
    if (l === "en" || l === "ar") setLang(l);
    setReady(true);
  }, []);

  // Keep the URL shareable as filters change.
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (category) params.set("category", category);
    if (lang !== "all") params.set("lang", lang);
    const search = params.toString();
    window.history.replaceState(null, "", search ? `/blog?${search}` : "/blog");
  }, [tag, category, lang, ready]);

  // "/" focuses search, like most documentation sites.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
  const featured = !hasFilters ? (posts.find((p) => p.featured) ?? posts[0]) : null;
  const grid = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered;

  const clear = () => {
    setQuery("");
    setLang("all");
    setCategory(null);
    setTag(null);
  };

  if (posts.length === 0) {
    return (
      <div className="relative mt-14 overflow-hidden border border-dashed border-line-3 bg-surface/40 px-6 py-16 text-center sm:px-12">
        <div aria-hidden="true" className="blueprint-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000,transparent)]" />
        <div className="relative">
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
            <PenLine className="size-6" strokeWidth={1.5} />
          </span>
          <h2 className="mt-6 font-display text-[1.9rem] text-fg">The first articles are on their way</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-fg-3">
            Insights on digital banking, architecture, and engineering leadership will be published here soon. Subscribe via RSS to get
            notified.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/blog/rss.xml" iconLeading={<Rss className="size-4" strokeWidth={1.75} />}>
              Subscribe via RSS
            </Button>
            <Button href="/" variant="secondary" icon={<ArrowGlyph />}>
              Explore the portfolio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-12">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="group relative flex-1">
            <span className="sr-only">Search articles</span>
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-fg-4 transition-colors group-focus-within:text-accent" strokeWidth={1.75} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Escape" && setQuery("")}
              placeholder="Search articles, topics, tags… / ابحث"
              className="h-12 w-full rounded-full border border-line-2 bg-surface/60 pe-24 ps-11 text-[15px] text-fg outline-none transition-colors placeholder:text-fg-4 focus:border-accent/60 [&::-webkit-search-cancel-button]:hidden"
            />
            <span className="absolute end-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="grid size-8 cursor-pointer place-items-center rounded-full text-fg-3 transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <X className="size-4" strokeWidth={1.75} />
                </button>
              ) : (
                <Kbd className="me-2.5 hidden sm:inline-flex">/</Kbd>
              )}
            </span>
          </label>
          <SegmentedControl
            label="Filter by language"
            value={lang}
            onChange={setLang}
            options={[
              { value: "all", label: "All" },
              { value: "en", label: "English" },
              { value: "ar", label: <span className="font-arabic">العربية</span> },
            ]}
          />
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map(([value, label]) => {
              const selected = category === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCategory(selected ? null : value)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-200",
                    selected ? "border-accent/60 bg-accent/10 text-accent" : "border-line-2 text-fg-3 hover:border-line-3 hover:text-fg"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence initial={false}>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-3 text-[13.5px] text-fg-3" aria-live="polite">
                <span>
                  <span className="numeric text-fg">{filtered.length}</span> {filtered.length === 1 ? "article" : "articles"}
                </span>
                {tag && (
                  <button
                    type="button"
                    onClick={() => setTag(null)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[12.5px] text-accent"
                    aria-label={`Remove tag filter ${tag}`}
                  >
                    #{tag} <X className="size-3" />
                  </button>
                )}
                <button type="button" onClick={clear} className="link-sweep cursor-pointer text-accent">
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {featured && <FeaturedPost post={featured} />}

      {grid.length > 0 ? (
        <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {grid.map((post, i) => (
              <motion.li
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                <PostCard post={post} priority={i < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        hasFilters && (
          <div className="border border-dashed border-line-3 px-6 py-14 text-center">
            <p className="font-display text-[1.5rem] text-fg">No articles match these filters</p>
            <p className="mt-2 text-[14px] text-fg-3">Try a broader search, another language, or clear the filters.</p>
            <div className="mt-6">
              <Button variant="secondary" onClick={clear}>
                Clear all filters
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function FeaturedPost({ post }: { post: PostMeta }) {
  const isAr = post.language === "ar";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden border border-line-2 bg-surface/50 transition-colors duration-500 hover:border-line-3 lg:grid-cols-12"
    >
      <div className="relative min-h-[260px] overflow-hidden border-b border-line lg:col-span-7 lg:min-h-[380px] lg:border-b-0 lg:border-r">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            priority
            sizes="(min-width: 1024px) 760px, 100vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <GeneratedCover post={post} large />
        )}
      </div>
      <div className="flex flex-col p-7 sm:p-10 lg:col-span-5" dir={isAr ? "rtl" : "ltr"} lang={post.language}>
        <div className="eyebrow text-signal">{post.featured ? "Featured article" : "Latest article"}</div>
        <h2 className={cn("mt-4 text-[clamp(1.75rem,2.6vw,2.4rem)] leading-[1.12] text-fg transition-colors group-hover:text-accent", isAr ? "font-arabic font-semibold" : "font-display")}>
          {post.title}
        </h2>
        <p className={cn("mt-4 text-[15px] leading-relaxed text-fg-3", isAr && "font-arabic")}>{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-4 pt-8 text-[13px] text-fg-4">
          <span className="text-accent">{post.categoryLabel}</span>
          <span className="numeric">{post.displayDate}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" strokeWidth={1.75} />
            {readingLabel(post.readingMinutes, post.language)}
          </span>
          <ArrowGlyph className="ms-auto size-5 text-accent rtl:-scale-x-100" />
        </div>
      </div>
    </Link>
  );
}
