import { config, collection, fields } from "@keystatic/core";
import { wrapper, block } from "@keystatic/core/content-components";

/**
 * Keystatic CMS configuration for the blog.
 *
 * Storage mode:
 * - GitHub mode is enabled once the GitHub App env vars exist (NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG etc.).
 *   Then www.ahmed-shaker.com/keystatic asks you to sign in with GitHub, and every "Save" commits the
 *   article to the repo, which triggers a Vercel redeploy.
 * - Otherwise local mode: edits are saved straight to the files in /content (used when running `npm run dev`).
 *   This fallback also keeps production builds working before the GitHub App is set up.
 * - One-time setup: run `NEXT_PUBLIC_KEYSTATIC_STORAGE=github npm run dev`, open /keystatic, and follow the
 *   wizard to create the GitHub App (it writes the env vars to .env).
 */
const useGitHub = Boolean(
  process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG || process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github"
);

export const BLOG_CATEGORIES = [
  { label: "Digital Banking", value: "digital-banking" },
  { label: "Architecture", value: "architecture" },
  { label: "Engineering Leadership", value: "engineering-leadership" },
  { label: "Mobile Engineering", value: "mobile" },
  { label: "DevOps & Cloud", value: "devops-cloud" },
  { label: "FinTech & Payments", value: "fintech" },
  { label: "Digital Transformation", value: "digital-transformation" },
  { label: "Career & Insights", value: "insights" },
] as const;

/** Rich blocks available inside the article editor (rendered by src/components/blog/MarkdocComponents.tsx). */
export const contentComponents = {
  callout: wrapper({
    label: "Callout box",
    description: "Highlighted note, tip, warning, or key insight.",
    schema: {
      tone: fields.select({
        label: "Style",
        options: [
          { label: "Note", value: "note" },
          { label: "Tip", value: "tip" },
          { label: "Key insight", value: "insight" },
          { label: "Warning", value: "warning" },
        ],
        defaultValue: "note",
      }),
      title: fields.text({ label: "Title (optional)" }),
    },
  }),
  youtube: block({
    label: "YouTube video",
    description: "Embed a YouTube video by pasting its link.",
    schema: {
      url: fields.url({ label: "YouTube URL", validation: { isRequired: true } }),
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  pullquote: block({
    label: "Pull quote",
    description: "A large, highlighted quote that stands out from the text.",
    schema: {
      quote: fields.text({ label: "Quote", multiline: true, validation: { isRequired: true } }),
      attribution: fields.text({ label: "Attribution (optional)" }),
    },
  }),
};

export default config({
  storage: useGitHub
    ? {
        kind: "github",
        repo: { owner: "ahmedshikashaker", name: "ahmed-shaker-portfolio" },
      }
    : { kind: "local" },
  ui: {
    brand: { name: "Ahmed Shaker · Blog" },
  },
  collections: {
    posts: collection({
      label: "Articles",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "publishedDate"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { length: { min: 5, max: 120 } } },
          slug: {
            label: "URL slug",
            description: "The article's web address: ahmed-shaker.com/blog/<slug>. Keep it short; don't change it after sharing.",
          },
        }),
        excerpt: fields.text({
          label: "Summary",
          description: "1–2 sentences. Shown on article cards, in Google results, and when shared on LinkedIn/WhatsApp/X.",
          multiline: true,
          validation: { length: { min: 20, max: 300 } },
        }),
        language: fields.select({
          label: "Language",
          options: [
            { label: "English", value: "en" },
            { label: "العربية (Arabic, right-to-left)", value: "ar" },
          ],
          defaultValue: "en",
        }),
        category: fields.select({
          label: "Category",
          options: [...BLOG_CATEGORIES],
          defaultValue: "digital-banking",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value || "New tag",
        }),
        publishedDate: fields.date({
          label: "Published date",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({ label: "Last updated (optional)" }),
        coverImage: fields.image({
          label: "Cover image",
          description: "Recommended 1600×840 (1.9:1). Also used as the preview image when the article is shared.",
          directory: "public/images/blog/covers",
          publicPath: "/images/blog/covers/",
        }),
        coverAlt: fields.text({ label: "Cover image description (for accessibility & SEO)" }),
        featured: fields.checkbox({
          label: "Featured",
          description: "Pin this article at the top of the blog page.",
          defaultValue: false,
        }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Drafts are hidden from the live website (they still show in local development).",
          defaultValue: false,
        }),
        seoTitle: fields.text({
          label: "SEO title (optional)",
          description: "Overrides the title in Google results and share previews. Aim for under 60 characters.",
        }),
        canonicalUrl: fields.url({
          label: "Canonical URL (optional)",
          description: "Only if this article was first published elsewhere (e.g. Medium). Leave empty so Google credits your website.",
        }),
        content: fields.markdoc({
          label: "Article",
          options: {
            image: {
              directory: "public/images/blog/content",
              publicPath: "/images/blog/content/",
            },
          },
          components: contentComponents,
        }),
      },
    }),
  },
});
