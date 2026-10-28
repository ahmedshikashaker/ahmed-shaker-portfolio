import Link from "next/link";
import BlogHeader from "@/components/blog/BlogHeader";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
      <BlogHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-slate-200/[0.07] mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Ahmed Shaker · www.ahmed-shaker.com</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#dfc490]">Portfolio</Link>
            <Link href="/blog" className="hover:text-[#dfc490]">Blog</Link>
            <a href="/blog/rss.xml" className="hover:text-[#dfc490]">RSS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
