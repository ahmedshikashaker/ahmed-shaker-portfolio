import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { readingLabel } from "@/lib/blog-format";

export default function PostCard({ post, priority = false }: { post: PostMeta; priority?: boolean }) {
  const isAr = post.language === "ar";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-[#131c31]/80 border border-slate-200/[0.08] hover:border-[#d4b982]/45 transition-colors"
    >
      <div className="relative w-full overflow-hidden bg-[#182338]" style={{ aspectRatio: "1.9 / 1" }}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 soft-grid-bg flex items-end p-5 bg-gradient-to-br from-[#182338] via-[#131c31] to-[#0f172a]">
            <span className="font-editorial italic text-3xl text-[#dfc490]/80 leading-none" dir={isAr ? "rtl" : "ltr"}>
              {post.categoryLabel}
            </span>
          </div>
        )}
        {post.draft && (
          <span className="absolute top-3 start-3 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[11px] font-bold">
            DRAFT
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5" dir={isAr ? "rtl" : "ltr"} lang={post.language}>
        <div className="flex items-center gap-2 text-[11px] font-tech text-[#dfc490]">
          <span>{post.categoryLabel}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{post.displayDate}</span>
        </div>
        <h3 className={`mt-2 text-lg font-semibold text-slate-50 leading-snug group-hover:text-[#dfc490] transition-colors ${isAr ? "font-arabic" : ""}`}>
          {post.title}
        </h3>
        <p className={`mt-2 text-sm text-slate-400 leading-relaxed line-clamp-3 ${isAr ? "font-arabic" : ""}`}>{post.excerpt}</p>
        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {readingLabel(post.readingMinutes, post.language)}
          </span>
          <ArrowUpRight className="w-4 h-4 text-[#dfc490] opacity-0 group-hover:opacity-100 transition-opacity rtl:-scale-x-100" />
        </div>
      </div>
    </Link>
  );
}
