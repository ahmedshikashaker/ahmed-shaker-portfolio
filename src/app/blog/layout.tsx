import Link from "next/link";
import Header from "@/components/launch/Header";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="print:hidden">
        <Header variant="blog" />
      </div>
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <footer className="mt-28 border-t border-line print:hidden">
        <div className="shell flex flex-col gap-6 py-10 text-[13px] text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="group">
            <span className="block font-display text-[17px] font-semibold text-fg transition-colors group-hover:text-accent">Ahmed Shaker</span>
            <span className="block text-[12px] text-fg-4">© {new Date().getFullYear()} · www.ahmed-shaker.com</span>
          </Link>
          <nav aria-label="Blog footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <li>
                <Link href="/" className="transition-colors hover:text-fg">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-fg">
                  All articles
                </Link>
              </li>
              <li>
                <a href="/blog/rss.xml" className="transition-colors hover:text-fg">
                  RSS feed
                </a>
              </li>
              <li>
                <Link href="/#contact" className="transition-colors hover:text-fg">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
