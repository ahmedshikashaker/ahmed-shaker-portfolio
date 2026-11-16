import Link from "next/link";
import { ChevronLink } from "@/components/launch/primitives";

export default function NotFound() {
  return (
    <main id="main" className="tone-auto launch flex min-h-[100dvh] flex-col">
      <header className="mx-auto flex h-[3.25rem] w-full max-w-[76rem] items-center px-5 sm:px-8 lg:px-10">
        <Link href="/" className="font-head text-[19px] font-semibold tracking-[-0.025em] text-l-fg transition-opacity hover:opacity-70">
          Ahmed Shaker
        </Link>
      </header>
      <div className="mx-auto flex w-full max-w-[76rem] flex-1 flex-col justify-center px-5 pb-24 pt-10 sm:px-8 lg:px-10">
        <p className="t-kicker text-l-fg-3">Error 404</p>
        <h1 className="t-display mt-3 max-w-[12ch] text-l-fg">
          This page <span className="text-l-accent">isn’t here.</span>
        </h1>
        <p className="t-lede mt-6 max-w-[34ch] text-l-fg-3">The link may be outdated, or the page has moved. These are the best places to continue.</p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link href="/" className="l-btn">
            Back to the portfolio
          </Link>
          <ChevronLink href="/blog" className="text-[17px]">
            Read the blog
          </ChevronLink>
          <ChevronLink href="/#contact" className="text-[17px]">
            Contact Ahmed
          </ChevronLink>
        </div>
      </div>
    </main>
  );
}
