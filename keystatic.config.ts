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
  twoclocks: block({
    label: "Visual · Two Clocks",
    description: "Animated factory clock vs. bank clock. 'Intro' is a 3-step scroll story; 'In sync' is a closing illustration.",
    schema: {
      variant: fields.select({
        label: "Variant",
        options: [
          { label: "Intro (scroll story)", value: "intro" },
          { label: "In sync (closing)", value: "sync" },
        ],
        defaultValue: "intro",
      }),
      step1: fields.text({ label: "Step 1 text (optional)", multiline: true }),
      step2: fields.text({ label: "Step 2 text (optional)", multiline: true }),
      step3: fields.text({ label: "Step 3 text (optional)", multiline: true }),
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  queuelab: block({
    label: "Interactive · Queue Lab",
    description: "Explorable queueing model: factory output vs. boundary capacity, lead time, and Little's Law.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  trustrings: block({
    label: "Visual · Rings of Trust",
    description: "Animated staged release: team → staff → early customers → everyone.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  pipelinegates: block({
    label: "Interactive · Pipeline Gates",
    description: "A change moving through six control gates; switch each between manual queue and automated evidence.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  coveragegrid: block({
    label: "Visual · Coverage Grid",
    description: "A sample checked by people vs. every change checked by the pipeline (100 releases).",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  changejourney: block({
    label: "Visual · Change Journey",
    description: "One change travelling from finished to live, drawn to scale. 'Today' shows the waits and the 2-minute meeting; 'Second time' shows the automated route on the same scale, zoomed in.",
    schema: {
      variant: fields.select({
        label: "Variant",
        options: [
          { label: "Today (manual gates)", value: "before" },
          { label: "Second time (automated)", value: "after" },
        ],
        defaultValue: "before",
      }),
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  approvalloop: block({
    label: "Visual · Approval Loop",
    description: "The vicious cycle of heavyweight change approval, beside DORA's two findings (2.6× and no evidence of fewer failures).",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  twolanes: block({
    label: "Visual · Two Lanes",
    description: "Card payments checked one by one in milliseconds vs. software changes queuing for a weekly change board.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  controlcards: block({
    label: "Interactive · Control Cards",
    description: "The six questions every approval must answer, answered in a meeting or by the pipeline (with evidence).",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  meetingagenda: block({
    label: "Visual · Meeting Agenda",
    description: "The change board on one time scale: 40 changes in 90 minutes vs. 3 decisions in 60.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  watermelon: block({
    label: "Visual · Watermelon dashboard",
    description: "The board pack (all green) vs. what customers lived (red), for the same quarter.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  clockstart: block({
    label: "Visual · Where the clock starts",
    description: "Change 27 from decision to customer, to scale, with three honest lead-time numbers.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  gamingcards: block({
    label: "Interactive · Make it a target",
    description: "Pick a metric as a target and see how it gets gamed (Goodhart's law).",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  leadtimechart: block({
    label: "Interactive · Lead-time histogram",
    description: "One quarter's lead times; a slider turns a percentile into a promise.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  flowlab: block({
    label: "Interactive · Flow Lab",
    description: "26 weeks of cumulative flow: start everything vs. limit work in progress vs. fund the boundary.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  steps: wrapper({
    label: "Steps (numbered path)",
    description: "Put a numbered list inside. Each item's bold opening becomes the step's title.",
    schema: {
      title: fields.text({ label: "Small heading above (optional)" }),
    },
  }),
  cardgrid: wrapper({
    label: "Card grid",
    description: "Put a bulleted list inside. Each item becomes a card; its bold opening becomes the card's title.",
    schema: {
      title: fields.text({ label: "Small heading above (optional)" }),
      label: fields.text({ label: "Label on every card (optional)" }),
    },
  }),
  fourchairs: block({
    label: "Visual · Four Chairs",
    description: "Change 27's 45 days seen from the product owner, security reviewer, operations and contact-centre lead. 'Old rules' shows what each is measured on and the rule that flips it; 'New rules' shows what each does now.",
    schema: {
      variant: fields.select({
        label: "Variant",
        options: [
          { label: "Old rules (tabs)", value: "before" },
          { label: "New rules (closing)", value: "after" },
        ],
        defaultValue: "before",
      }),
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  answerup: block({
    label: "Visual · Lost on the Way Up",
    description: "The board's question about change 27 travels down; the precise answer comes back up, vaguer at each level, as 'resistance to change'.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  statgrid: block({
    label: "Visual · Stat Grid (100 squares)",
    description: "One share drawn as 100 squares, with a big number, two labels and a source.",
    schema: {
      value: fields.integer({ label: "Highlighted squares (out of 100)", defaultValue: 50 }),
      label: fields.text({ label: "Label for the highlighted squares" }),
      restLabel: fields.text({ label: "Label for the rest" }),
      title: fields.text({ label: "Small heading (optional)" }),
      source: fields.text({ label: "Source (optional)" }),
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  hopereward: block({
    label: "Visual · Hope vs. Reward",
    description: "Kerr's folly as a balance: what the bank hopes for vs. what it actually rewards.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  rulekit: block({
    label: "Visual · The New Rules, Assembled",
    description: "The four pieces of the new rules, where each comes from in the series, and which payoff cell each one changes.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  gatekeepermath: block({
    label: "Interactive · Gatekeeper's Arithmetic",
    description: "Personal payoff of approving now vs. holding for the committee under old rules, old rules + a speed target, and new rules, with a risk slider and loss aversion.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  messengertest: block({
    label: "Interactive · Messenger Test",
    description: "Four moments handled by Westrum's pathological, bureaucratic and generative cultures, and what people learn from each.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  lookcloser: block({
    label: "Interactive · Look Closer",
    description: "The 'culture problem' diagnoses a board hears, each opened to the rule underneath and the rewrite that fixes it.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  releasecalendar: block({
    label: "Visual · Release Calendar (change 28)",
    description: "One quarter of working days: weekly edge releases, one core release. Change 28 waits for the core (coupled) or ships next day (decoupled).",
    schema: {
      variant: fields.select({
        label: "Variant",
        options: [
          { label: "Coupled to the core", value: "coupled" },
          { label: "Decoupled (closing)", value: "decoupled" },
        ],
        defaultValue: "coupled",
      }),
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  couplingmap: block({
    label: "Interactive · Coupling Map",
    description: "Pick a change and an architecture (point to point vs. edge layer): systems touched, teams, release trains, lead time.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  twospeeds: block({
    label: "Visual · Two Speeds (core vs. edge)",
    description: "What belongs in the core (the bank's memory) and at the edge (the bank's voice), joined by contracts.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  bigbangcurve: block({
    label: "Visual · Big Bang vs. Strangler",
    description: "Value delivered and customers exposed over 36 months, with the TSB 2018 migration as a sourced example.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  stranglerfig: block({
    label: "Interactive · Strangler Fig",
    description: "Quarter by quarter, capabilities move from the core to the edge; the ledger stays. Plays once, then scrubbable.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  yearlanes: block({
    label: "Visual · Year One Lanes",
    description: "The first twelve months: what the board pack showed vs. what was being built underneath, month by month.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  jcurve: block({
    label: "Visual · The J-Curve",
    description: "Customer-visible value in year one: what boards expect vs. the usual dip and rise, with DORA 2018 and Brynjolfsson et al. notes.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  changeyear: block({
    label: "Interactive · Change 27's Year",
    description: "Change 27's lead time month by month through year one (waiting, gates, the factory's afternoon), plus change 28's strip.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  quarterquestions: block({
    label: "Visual · One Question a Quarter",
    description: "Four quarters of year one: the question to ask, a good answer, and the warning sign.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  yearscoreboard: block({
    label: "Visual · Year One, Scored",
    description: "The series' numbers at month 1 and month 12, side by side, each linked to its essay.",
    schema: {
      caption: fields.text({ label: "Caption (optional)" }),
    },
  }),
  boardcard: wrapper({
    label: "Board card",
    description: "A shareable summary card. Put a numbered list inside.",
    schema: {
      title: fields.text({ label: "Title" }),
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
