import Link from "next/link";
import { SERIES, getSeriesWithPosts, seriesPath } from "@/lib/series";
import { ArrowGlyph } from "@/components/ui/Button";

/** Blog index banners for active series: their title, their parts as a route, and a link to each series landing page. */
export default async function SeriesBanner() {
  const entries = (await Promise.all(SERIES.map((s) => getSeriesWithPosts(s.slug)))).filter(
    (d): d is NonNullable<typeof d> => d !== null && d.parts.length >= 1,
  );
  if (entries.length === 0) return null;

  return (
    <div className="mt-10 space-y-5">
      {entries.map(({ series, parts, allParts, minutes }) => {
        const isRoadmapSeries = allParts.length > parts.length;
        return (
          <Link
            key={series.slug}
            href={seriesPath(series.slug)}
            className="group grid gap-6 rounded-2xl border border-accent/35 bg-surface p-5 shadow-[var(--shadow-soft)] transition-colors hover:border-accent sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center"
          >
            <div>
              <p className="eyebrow text-accent">
                {isRoadmapSeries
                  ? `Flagship Series · Part ${parts.length} of ${allParts.length} Live · ${minutes} min`
                  : `Series · ${parts.length} parts · ${minutes} min`}
              </p>
              <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.1rem)] leading-tight text-fg transition-colors group-hover:text-accent">
                {series.title}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-3">{series.tagline}</p>
              {series.centralThesis && (
                <p className="mt-2.5 border-s-2 border-accent/50 ps-3 text-[12.5px] italic leading-relaxed text-fg-2">
                  “{series.centralThesis}”
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent">
                {isRoadmapSeries ? "Explore series & 8-part architectural roadmap" : "Read the series"}{" "}
                <ArrowGlyph direction="right" />
              </span>
            </div>
            <ol className="relative grid gap-2 sm:grid-cols-2">
              {allParts.map((p) => {
                const isLive = p.post !== null;
                return (
                  <li
                    key={p.slug}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                      isLive
                        ? "border-signal/45 bg-signal/[0.06]"
                        : "border-line bg-bg-2/40"
                    }`}
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full border font-display text-[0.95rem] ${
                        isLive
                          ? "border-signal bg-signal/15 text-signal"
                          : "border-accent/50 text-accent"
                      }`}
                    >
                      {p.n}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-1.5">
                        <span className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-fg-4">
                          {p.wall}
                        </span>
                        {isRoadmapSeries && (
                          <span
                            className={`shrink-0 rounded-full px-1.5 py-0.2 font-mono text-[8.5px] uppercase tracking-wider ${
                              isLive
                                ? "bg-signal/15 text-signal"
                                : "bg-accent/10 text-accent"
                            }`}
                          >
                            {isLive ? "Live" : "Soon"}
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-[12.5px] font-medium text-fg">{p.title}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </Link>
        );
      })}
    </div>
  );
}
