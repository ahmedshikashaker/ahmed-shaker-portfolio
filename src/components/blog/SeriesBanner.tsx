import Link from "next/link";
import { SERIES, getSeriesWithPosts, seriesPath } from "@/lib/series";
import { ArrowGlyph } from "@/components/ui/Button";

/** Blog index banner for the newest series: its title, its parts as a small route, and a link to the landing page. */
export default async function SeriesBanner() {
  const data = await getSeriesWithPosts(SERIES[0].slug);
  if (!data || data.parts.length < 2) return null;
  const { series, parts, minutes } = data;

  return (
    <Link
      href={seriesPath(series.slug)}
      className="group mt-10 grid gap-6 rounded-2xl border border-accent/35 bg-surface p-5 shadow-[var(--shadow-soft)] transition-colors hover:border-accent sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center"
    >
      <div>
        <p className="eyebrow text-accent">
          Series · {parts.length} parts · {minutes} min
        </p>
        <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.1rem)] leading-tight text-fg transition-colors group-hover:text-accent">{series.title}</p>
        <p className="mt-2 text-[14px] leading-relaxed text-fg-3">{series.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent">
          Read the series <ArrowGlyph direction="right" />
        </span>
      </div>
      <ol className="relative grid gap-2 sm:grid-cols-2">
        {parts.map((p) => (
          <li key={p.slug} className="flex items-center gap-3 rounded-xl border border-line bg-bg-2/40 px-3 py-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/50 font-display text-[0.95rem] text-accent">{p.n}</span>
            <span className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-fg-4">{p.wall}</span>
              <span className="block truncate text-[13px] font-medium text-fg">{p.post.title}</span>
            </span>
          </li>
        ))}
      </ol>
    </Link>
  );
}
