import Link from "next/link";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <main id="main" className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_20%,transparent_75%)]"
      />
      <header className="shell flex h-20 items-center">
        <Link href="/" className="group flex items-center gap-2.5">
          <BrandMark />
          <span className="font-display text-[17px] text-fg transition-colors group-hover:text-accent">Ahmed Shaker</span>
        </Link>
      </header>
      <div className="shell flex flex-1 flex-col justify-center pb-24 pt-10">
        <div className="eyebrow flex items-center gap-3 text-fg-3">
          <span className="text-accent">Error 404</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-3" />
          <span>Off the blueprint</span>
        </div>
        <div
          aria-hidden="true"
          className="mt-8 select-none font-display text-[clamp(6rem,24vw,19rem)] leading-[0.95] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--c-accent-deep)]"
        >
          404
        </div>
        <h1 className="mt-8 max-w-2xl font-display text-display-3 text-fg">
          This page isn’t on the <em className="text-accent">blueprint.</em>
        </h1>
        <p className="mt-4 max-w-lg text-lede text-fg-3">
          The link may be outdated, or the page has moved. These are the best places to continue.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/" icon={<ArrowGlyph />}>
            Back to the portfolio
          </Button>
          <Button href="/blog" variant="secondary">
            Read the writing
          </Button>
          <Button href="/#contact" variant="ghost">
            Contact Ahmed
          </Button>
        </div>
      </div>
    </main>
  );
}
