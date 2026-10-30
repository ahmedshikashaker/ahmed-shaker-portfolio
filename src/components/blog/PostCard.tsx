import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { readingLabel } from "@/lib/blog-format";
import { ArrowGlyph } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Deterministic 0–1 value from a slug, so generated covers differ per article but never change. */
function seed(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return (hash % 1000) / 1000;
}

/** Blueprint-style cover used when an article has no cover image. */
export function GeneratedCover({ post, large = false }: { post: PostMeta; large?: boolean }) {
  const s = seed(post.slug);
  const isAr = post.language === "ar";
  return (
    <div className="blueprint-grid absolute inset-0 overflow-hidden bg-surface-2">
      <svg aria-hidden="true" viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {[0, 1, 2].map((i) => {
          const cx = 250 + s * 90 - i * 6;
          const cy = 70 + i * 26;
          return (
            <path
              key={i}
              d={`M${cx - 90},${cy} L${cx},${cy - 45} L${cx + 90},${cy} L${cx},${cy + 45} Z`}
              fill={i === 0 ? "var(--c-accent)" : "none"}
              fillOpacity={i === 0 ? 0.12 : 0}
              stroke="var(--c-accent-deep)"
              strokeOpacity={0.7 - i * 0.18}
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <span
        className={cn(
          "absolute bottom-5 start-5 max-w-[80%] font-display italic leading-[0.95] text-fg/85",
          large ? "text-[clamp(2.5rem,5vw,3.75rem)]" : "text-[1.9rem]",
          isAr && "font-arabic not-italic"
        )}
        dir={isAr ? "rtl" : "ltr"}
      >
        {post.categoryLabel}
      </span>
    </div>
  );
}

export default function PostCard({ post, priority = false }: { post: PostMeta; priority?: boolean }) {
  const isAr = post.language === "ar";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-line-2 bg-surface/50 transition-[border-color,background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-line-3 hover:bg-surface"
    >
      <div className="relative w-full overflow-hidden border-b border-line" style={{ aspectRatio: "1.9 / 1" }}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <GeneratedCover post={post} />
        )}
        {post.draft && (
          <span className="absolute start-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wide text-slate-950">
            DRAFT
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6" dir={isAr ? "rtl" : "ltr"} lang={post.language}>
        <div className="eyebrow flex items-center gap-2 text-[10px]">
          <span className="text-accent">{post.categoryLabel}</span>
          <span className="text-fg-4">·</span>
          <span className="numeric text-fg-4">{post.displayDate}</span>
        </div>
        <h3 className={cn("mt-3 text-[1.35rem] leading-snug text-fg transition-colors group-hover:text-accent", isAr ? "font-arabic font-semibold" : "font-display")}>
          {post.title}
        </h3>
        <p className={cn("mt-3 line-clamp-3 text-[14px] leading-relaxed text-fg-3", isAr && "font-arabic")}>{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-6 text-[12px] text-fg-4">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" strokeWidth={1.75} />
            {readingLabel(post.readingMinutes, post.language)}
          </span>
          <ArrowGlyph className="size-4 text-accent rtl:-scale-x-100" />
        </div>
      </div>
    </Link>
  );
}
