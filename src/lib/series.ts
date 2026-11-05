import { getAllPosts, SITE_URL, type PostMeta } from "./blog";
import { AUTO_HOURS, MANUAL_HOURS, fmtDuration } from "@/components/blog/visuals/pipelineModel";
import { C27_TOTAL } from "@/components/blog/visuals/measureModel";
import { C28_LIVE, C28_READY_DAY } from "@/components/blog/visuals/coreModel";
import { LEAD_END, LEAD_START } from "@/components/blog/visuals/yearModel";

/**
 * Article series. A series is an ordered list of posts (by slug) with the extra framing a landing page needs.
 * Headline numbers are imported from the same models the articles use, so the landing page always agrees with them.
 */

export interface SeriesPart {
  slug: string;
  /** The wall this part takes down, in a word or two. */
  wall: string;
  /** The part's headline number: optional "before", the figure, and what it measures. */
  stat: { before?: string; value: string; label: string };
  /** One line for a board, from the part's own "What I'd tell a board" card. */
  boardLine: string;
}

export interface Series {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  parts: SeriesPart[];
}

const days = (d: number) => `${Math.round(d)} days`;
const c28Weeks = `${((C28_LIVE.coupled - C28_READY_DAY) / 5).toFixed(1).replace(/\.0$/, "")} weeks`;

export const SERIES: Series[] = [
  {
    slug: "digital-transformation",
    title: "Digital Transformation, From the Inside",
    tagline: "Six essays on what actually slows a bank down, and what a board can do about it.",
    description:
      "A six-part series on digital transformation in banking, told through one small change and the five walls it meets on its way to customers: the boundary, approvals, measurement, incentives and the core, then the first year that ties them together.",
    parts: [
      {
        slug: "the-factory-is-the-easy-part",
        wall: "The boundary",
        stat: { value: "4×", label: "the wait, when the teams around the factory go from 80% to 95% busy" },
        boardLine: "The factory is the easy part. Fund the boundary as seriously as the factory.",
      },
      {
        slug: "evidence-not-meetings",
        wall: "Approvals",
        stat: { before: fmtDuration(MANUAL_HOURS), value: fmtDuration(AUTO_HOURS), label: "change 27 from finished to live, once controls become evidence" },
        boardLine: "Ask for evidence, not attendance. Approval meetings are not control.",
      },
      {
        slug: "the-one-number-a-board-should-watch",
        wall: "Measurement",
        stat: { value: days(C27_TOTAL), label: "change 27 from idea to customer, behind a board pack of green tiles" },
        boardLine: "Watch one number: lead time from approved idea to customer, reported as a promise.",
      },
      {
        slug: "fear-is-rational",
        wall: "Incentives",
        stat: { value: "94%", label: "of troubles belong to the system, not the people in it (Deming)" },
        boardLine: "Look at the payoffs before the people. You can't bribe your way past blame.",
      },
      {
        slug: "fast-edge-steady-core",
        wall: "The core",
        stat: { before: c28Weeks, value: `${C28_LIVE.decoupled - C28_READY_DAY} day`, label: "change 28 from ready to live, once it stops waiting for the core" },
        boardLine: "The core isn't the problem; the wiring is. Let the core be slow on purpose.",
      },
      {
        slug: "year-one",
        wall: "Time",
        stat: { before: days(LEAD_START), value: `${LEAD_END.toFixed(1)} days`, label: "change 27 in month 1 and month 12, after getting worse first" },
        boardLine: "Expect a J, not a line, and don't cut the boundary at month four.",
      },
    ],
  },
];

export const seriesPath = (slug: string) => `/blog/series/${slug}`;
export const seriesUrl = (slug: string) => `${SITE_URL}${seriesPath(slug)}`;

export function getSeries(slug: string): Series | null {
  return SERIES.find((s) => s.slug === slug) ?? null;
}

/** The series a post belongs to, and its position (1-based). */
export function seriesForPost(postSlug: string): { series: Series; part: number; total: number } | null {
  for (const s of SERIES) {
    const i = s.parts.findIndex((p) => p.slug === postSlug);
    if (i >= 0) return { series: s, part: i + 1, total: s.parts.length };
  }
  return null;
}

/** A series with each part's post metadata; parts whose post isn't visible (e.g. a draft in production) are left out. */
export async function getSeriesWithPosts(slug: string) {
  const series = getSeries(slug);
  if (!series) return null;
  const posts = await getAllPosts();
  const bySlug = new Map(posts.map((p) => [p.slug, p] as const));
  const parts = series.parts
    .map((part, i) => ({ ...part, n: i + 1, post: bySlug.get(part.slug) ?? null }))
    .filter((p): p is SeriesPart & { n: number; post: PostMeta } => p.post !== null);
  const minutes = parts.reduce((a, p) => a + p.post.readingMinutes, 0);
  return { series, parts, minutes };
}
