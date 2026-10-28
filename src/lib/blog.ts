import "server-only";
import { cache } from "react";
import Markdoc, { type Node, type Config, type RenderableTreeNode } from "@markdoc/markdoc";
import { createReader } from "@keystatic/core/reader";
import { fields } from "@keystatic/core";
import readingTime from "reading-time";
import keystaticConfig, { BLOG_CATEGORIES, contentComponents } from "../../keystatic.config";
import { localizedCategory } from "./blog-format";

export const SITE_URL = "https://www.ahmed-shaker.com";

const reader = createReader(process.cwd(), keystaticConfig);

/** Drafts are visible in local dev (and when BLOG_SHOW_DRAFTS=1), never on the live site. */
const SHOW_DRAFTS =
  process.env.NODE_ENV === "development" || process.env.BLOG_SHOW_DRAFTS === "1";

export type BlogLanguage = "en" | "ar";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  language: BlogLanguage;
  category: string;
  categoryLabel: string;
  tags: string[];
  publishedDate: string;
  displayDate: string;
  updatedDate: string | null;
  coverImage: string | null;
  coverAlt: string;
  featured: boolean;
  draft: boolean;
  seoTitle: string;
  canonicalUrl: string | null;
  readingMinutes: number;
  wordCount: number;
  url: string;
}

export interface Post extends PostMeta {
  renderable: RenderableTreeNode;
  toc: TocItem[];
}

export function categoryLabel(value: string): string {
  return BLOG_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/** URL-safe id from heading text; keeps Arabic and other Unicode letters. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function nodeText(node: Node): string {
  let text = "";
  for (const child of node.walk()) {
    if (child.type === "text" && typeof child.attributes.content === "string") {
      text += child.attributes.content;
    } else if (child.type === "code" && typeof child.attributes.content === "string") {
      text += child.attributes.content;
    }
  }
  return text.trim();
}

function documentText(node: Node): string {
  const parts: string[] = [];
  for (const child of node.walk()) {
    const content = child.attributes?.content;
    if (typeof content === "string" && (child.type === "text" || child.type === "code" || child.type === "fence")) {
      parts.push(content);
    }
    if (child.type === "tag" && child.tag === "pullquote" && typeof child.attributes.quote === "string") {
      parts.push(child.attributes.quote);
    }
  }
  return parts.join(" ");
}

function extractToc(node: Node): TocItem[] {
  const items: TocItem[] = [];
  for (const child of node.walk()) {
    if (child.type === "heading") {
      const level = child.attributes.level;
      if (level === 2 || level === 3) {
        const text = nodeText(child);
        if (text) items.push({ id: slugifyHeading(text), text, level });
      }
    }
  }
  return items;
}

/** Markdoc config: Keystatic's component tags + custom heading ids, code blocks, and links. */
const markdocConfig: Config = (() => {
  const base = fields.markdoc.createMarkdocConfig({
    components: contentComponents,
    render: {
      tags: { callout: "Callout", youtube: "YouTube", pullquote: "PullQuote" },
    },
  });
  return {
    ...base,
    nodes: {
      ...base.nodes,
      heading: {
        children: ["inline"],
        attributes: { level: { type: Number, required: true } },
        transform(node, config) {
          const children = node.transformChildren(config);
          const id = slugifyHeading(nodeText(node));
          return new Markdoc.Tag(`h${node.attributes.level}`, { id }, children);
        },
      },
      fence: {
        render: "CodeBlock",
        attributes: {
          content: { type: String },
          language: { type: String },
        },
      },
      link: {
        render: "SmartLink",
        children: ["strong", "em", "s", "code", "text", "tag"],
        attributes: {
          href: { type: String, required: true },
          title: { type: String },
        },
      },
      table: {
        transform(node, config) {
          const table = new Markdoc.Tag("table", {}, node.transformChildren(config));
          return new Markdoc.Tag("div", { className: "blog-table-wrap" }, [table]);
        },
      },
    },
  };
})();

type RawEntry = Awaited<ReturnType<typeof reader.collections.posts.all<[{ resolveLinkedFiles: true }]>>>[number];

function toMeta(slug: string, entry: RawEntry["entry"]): PostMeta {
  const text = documentText(entry.content.node);
  const stats = readingTime(text, { wordsPerMinute: entry.language === "ar" ? 180 : 220 });
  return {
    slug,
    title: entry.title,
    excerpt: entry.excerpt,
    language: (entry.language as BlogLanguage) ?? "en",
    category: entry.category,
    categoryLabel: localizedCategory(entry.category, categoryLabel(entry.category), (entry.language as BlogLanguage) ?? "en"),
    tags: (entry.tags ?? []).map((t) => t.trim()).filter(Boolean),
    publishedDate: entry.publishedDate,
    displayDate: formatDate(entry.publishedDate, (entry.language as BlogLanguage) ?? "en"),
    updatedDate: entry.updatedDate ?? null,
    coverImage: entry.coverImage ?? null,
    coverAlt: entry.coverAlt || entry.title,
    featured: entry.featured,
    draft: entry.draft,
    seoTitle: entry.seoTitle,
    canonicalUrl: entry.canonicalUrl ?? null,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    wordCount: stats.words,
    url: `${SITE_URL}/blog/${slug}`,
  };
}

const getRawEntries = cache(async () => {
  return reader.collections.posts.all({ resolveLinkedFiles: true });
});

/** All visible posts, newest first. */
export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  const entries = await getRawEntries();
  return entries
    .map(({ slug, entry }) => toMeta(slug, entry))
    .filter((p) => SHOW_DRAFTS || !p.draft)
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const entries = await getRawEntries();
  const found = entries.find((e) => e.slug === slug);
  if (!found) return null;
  const meta = toMeta(found.slug, found.entry);
  if (meta.draft && !SHOW_DRAFTS) return null;

  const node = found.entry.content.node;
  const errors = Markdoc.validate(node, markdocConfig).filter((e) => e.error.level === "critical");
  if (errors.length) {
    console.warn(`[blog] Markdoc validation issues in "${slug}":`, errors.map((e) => e.error.message));
  }
  const renderable = Markdoc.transform(node, markdocConfig);
  return { ...meta, renderable, toc: extractToc(node) };
});

/** Posts sharing tags/category with the given post, best matches first. */
export async function getRelatedPosts(post: PostMeta, limit = 3): Promise<PostMeta[]> {
  const all = await getAllPosts();
  const tagSet = new Set(post.tags.map((t) => t.toLowerCase()));
  return all
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score:
        p.tags.filter((t) => tagSet.has(t.toLowerCase())).length * 2 +
        (p.category === post.category ? 1 : 0) +
        (p.language === post.language ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.p.publishedDate.localeCompare(a.p.publishedDate))
    .slice(0, limit)
    .map(({ p }) => p);
}

export async function getAdjacentPosts(slug: string) {
  const all = await getAllPosts();
  const i = all.findIndex((p) => p.slug === slug);
  return {
    newer: i > 0 ? all[i - 1] : null,
    older: i >= 0 && i < all.length - 1 ? all[i + 1] : null,
  };
}

export function formatDate(iso: string, language: BlogLanguage = "en"): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(language === "ar" ? "ar-KW" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
