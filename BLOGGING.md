# Blogging guide

Your blog lives at **https://www.ahmed-shaker.com/blog**. Articles are written in a visual editor (Keystatic) and stored as files in this repository under `content/posts/`, with images in `public/images/blog/`.

---

## Write and publish an article

### Option A: on your computer (works right now)

1. In the project folder run `npm run dev`.
2. Open **http://localhost:3000/keystatic** → **Articles** → **Add**.
3. Write the article, fill in the fields (see the checklist below), and click **Create** / **Save**.
4. Preview it at `http://localhost:3000/blog/<slug>` (drafts show here with a yellow "Draft" banner).
5. Publish: untick **Draft**, save, then commit and push:
   ```bash
   git add content public/images/blog
   git commit -m "New article: <title>"
   git push
   ```
   Vercel redeploys automatically, and the article is live in about 1–2 minutes.

### Option B: online editor at www.ahmed-shaker.com/keystatic (one-time setup below)

Sign in with GitHub, write, click **Save**. Keystatic commits the article to GitHub and Vercel publishes it automatically, with no terminal needed. Works from any computer.

---

## Enable the online editor (one-time, ~5 minutes)

1. On your computer run:
   ```bash
   NEXT_PUBLIC_KEYSTATIC_STORAGE=github npm run dev
   ```
2. Open **http://localhost:3000/keystatic**. Keystatic shows a setup screen: enter an app name (e.g. `ahmed-shaker-blog`) and click **Create GitHub App**.
3. GitHub opens: confirm creating the app, then **install it on the `ahmed-shaker-portfolio` repository only**.
4. Keystatic writes four values into a local `.env` file (never committed):
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
5. In **Vercel → your project → Settings → Environment Variables**, add those same four variables (Production), then **Redeploy**.
6. In the GitHub App settings, add this callback URL next to the localhost one:
   `https://www.ahmed-shaker.com/api/keystatic/github/oauth/callback`
7. Visit **https://www.ahmed-shaker.com/keystatic** → **Sign in with GitHub**. Done.

Only GitHub accounts with write access to the repository can save, so nobody else can publish.

---

## Publishing checklist

| Field | Tip |
| --- | --- |
| **Title** | Clear and specific. The URL slug is generated from it; don't change the slug after sharing. |
| **Summary** | 1–2 sentences. Shown on LinkedIn/WhatsApp/X previews and in Google results. |
| **Language** | English or العربية. Arabic articles display right-to-left automatically. |
| **Category & Tags** | One category, 3–5 tags. Tags become filters on the blog page. |
| **Cover image** | 1600×840 recommended. Used as the share preview image. Without one, a branded preview image is generated automatically (English titles only). |
| **Draft** | Ticked = hidden from the live site. Untick to publish. |
| **SEO title** | Optional; under 60 characters. |
| **Canonical URL** | Leave empty unless the article was first published elsewhere. |

Editor extras: headings (auto table of contents), code blocks with syntax highlighting, tables, images, **Callout box**, **Pull quote**, and **YouTube video** blocks (use the **+** / insert menu).

---

## Share it everywhere

- **Share buttons** on every article: LinkedIn, X, WhatsApp, Facebook, Telegram, Email, Copy link, and your phone's native share sheet.
- **Rich previews**: every article has Open Graph/Twitter metadata, so links unfurl with title, summary and image.
- **RSS feed**: `https://www.ahmed-shaker.com/blog/rss.xml`. Use it to:
  - **Medium**: *Import a story* → paste the article URL (Medium keeps the canonical link to your site).
  - **Dev.to / Hashnode**: Settings → *Publishing from RSS* → paste the feed URL (posts import as drafts with the canonical URL set to your site).
  - **LinkedIn**: post the article link with 2–3 lines of commentary (better reach than a bare link), or republish it as a LinkedIn Article with a line "Originally published at ahmed-shaker.com".
- **Google**: new articles are added to `sitemap.xml` automatically. For faster indexing, use *URL Inspection → Request indexing* in Google Search Console.

---

## Files

- `keystatic.config.ts`: editor fields, categories, and custom blocks
- `content/posts/*.mdoc`: articles (`writing-guide` and `arabic-sample` are private draft examples)
- `src/lib/blog.ts`: reading posts, reading time, table of contents
- `src/app/blog/`: blog pages and RSS feed · `src/app/og/blog/`: generated share images
