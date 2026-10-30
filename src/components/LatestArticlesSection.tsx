import type { PostMeta } from "@/lib/blog";
import { ArrowGlyph, Button } from "./ui/Button";
import { Section, SectionHeader } from "./ui/SectionHeader";
import PostCard from "./blog/PostCard";

/** Home-page teaser of the newest articles. Hidden until the first article is published. */
export default function LatestArticlesSection({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <Section id="articles" labelledBy="articles-title" className="py-28 lg:py-40">
      <div className="shell">
        <SectionHeader
          index="08"
          label="Insights & articles"
          titleId="articles-title"
          title="Latest from the *blog.*"
          lede="Digital banking, software architecture, engineering leadership, and lessons from building two banking digital factories, in English and العربية."
          aside={
            <div className="mt-7">
              <Button href="/blog" variant="secondary" icon={<ArrowGlyph />}>
                All articles
              </Button>
            </div>
          }
        />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
