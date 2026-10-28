import Link from "next/link";
import Image from "next/image";
import { Rss, ArrowUpRight } from "lucide-react";

export default function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/85 backdrop-blur-xl border-b border-slate-200/[0.07]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#d4b982]/45">
            <Image src="/assets/profile/ahmed-shaker-portrait.jpg" alt="Ahmed Shaker" width={36} height={36} className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-100 group-hover:text-[#dfc490] transition-colors">Ahmed Shaker</div>
            <div className="text-[11px] text-slate-400">Insights & Articles</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 text-[13px]">
          <Link href="/" className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-slate-300 hover:text-white">
            Portfolio
          </Link>
          <Link href="/blog" className="px-3 py-1.5 rounded-lg text-slate-950 bg-[#dfc490] font-semibold">
            Blog
          </Link>
          <a
            href="/blog/rss.xml"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-[#dfc490]"
            title="Subscribe via RSS"
          >
            <Rss className="w-4 h-4" />
            <span className="hidden sm:inline">RSS</span>
          </a>
          <Link
            href="/#contact"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200/10 text-slate-200 hover:border-[#d4b982]/50"
          >
            Contact <ArrowUpRight className="w-3.5 h-3.5 text-[#dfc490]" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
