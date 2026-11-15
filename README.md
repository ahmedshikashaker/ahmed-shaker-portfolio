# Ahmed Shaker — Executive Technology Portfolio

World-class executive technology portfolio for **Ahmed Shaker** (*Head of Digital Technology at Kuwait International Bank (KIB)* and former *Android Chapter Lead at Warba Bank*).

Positioned for C-level executives, banking boards, CTO/VP Engineering recruiters, and digital transformation leaders, this site highlights Ahmed's career-defining achievement of **building two banking Digital Factories from scratch** (at **Warba Bank** and **Kuwait International Bank**) and directing 8+ regulated digital banking ecosystems across Mobile (Android, iOS, Flutter), Web, Backend Microservices (NestJS, Java EE, Kafka, RabbitMQ), and Cloud-Native DevOps (Kubernetes, Argo CD, Jenkins).

---

## Architecture & Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) with React 19 & TypeScript
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) with the "Sovereign Blueprint" token system in `src/app/globals.css`: semantic colour tokens (`bg`, `surface`, `fg`, `accent`, `signal`, `line`) for two themes, **Ink** (dark) and **Paper** (light), plus a display type scale (`text-display-1…3`, `text-title`, `text-lede`). The site follows the device's light/dark setting by default, including live changes. The sun/moon button or the command palette overrides it (stored in `localStorage`); picking the theme the device already uses goes back to following the device.
- **Typography**: Newsreader (display serif, optical sizes), IBM Plex Sans (UI and body), IBM Plex Mono (annotations), IBM Plex Sans Arabic (Arabic), loaded through `next/font`. The home page uses Inter Tight and Inter instead (see Home page)
- **Animations & Micro-Interactions**: [Framer Motion](https://www.framer.com/motion/). Shared motion tokens live in `src/lib/motion.ts`; `MotionConfig reducedMotion="user"` plus CSS fallbacks honour `prefers-reduced-motion`
- **UI primitives**: `src/components/ui/` (slide-over reader, buttons, segmented control, toasts, theme toggle); blog chrome (header, mobile menu) and the ⌘K command palette in `src/components/site/`
- **Home page**: an Apple-style product launch in bands that alternate light and dark (Overview, Digital Factories, Ecosystems, Track Record, Writing, then contact; anchors in `src/lib/site.ts`). It has its own system, scoped to the home page so the blog keeps its look: Inter Tight and Inter loaded only there (`src/components/launch/fonts.ts`), tone classes and a bold sans type scale in the "Launch" block of `src/app/globals.css`. Phones are real CSS 3D (`src/components/launch/Phone3D.tsx`: glass front and back, a faceted metal band, side buttons) and turn with the scroll: the hero lineup turns round, Factory II lifts its eight apps off the screen into a ring (the page's one short pinned scene), and the eight flagships sit in a cover-flow of their store art. Motion is Framer Motion; under `prefers-reduced-motion` every piece renders in its final, still state. Every visible word lives in `src/data/portfolioData.ts`; long-form case studies open in the slide-over reader (`src/components/BriefDrawer.tsx`). The silent launch film is rendered with Remotion from `video/src/home/` into `public/videos/`
- **Iconography**: [Lucide React](https://lucide.dev/)
- **SEO & Metadata**: Dynamic OpenGraph image generation (`src/app/opengraph-image.tsx`), custom monogram icon (`src/app/icon.tsx`), JSON-LD `Person` structured data, `sitemap.xml`, and `robots.txt`
- **Assets**: Locally cached, high-resolution official App Store icons and screenshots in `public/assets/apps/`

---

## Local Development & Verification

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run type-checking
npm run typecheck

# Build production bundle
npm run build

# Start local development or production server
npm run dev
# or
npm run start
```

---

## Deploying to Vercel

This repository is pre-configured with [`vercel.json`](./vercel.json) for zero-configuration deployment on Vercel.

### Option 1: Deploy via Git Integration (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket:
   ```bash
   git remote add origin https://github.com/ahmedmshaker/ahmed-shaker-portfolio.git
   git push -u origin master
   ```
2. Log in to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel will automatically detect **Next.js** and apply the settings from `vercel.json` (`npm run build` and `npm install --legacy-peer-deps`).
4. Click **Deploy**. No secret environment variables are required.
5. **(Optional) Custom Domain**: Navigate to **Project Settings → Domains** in the Vercel dashboard and add your custom domain (e.g., `ahmedshaker.com`).

### Option 2: Deploy Directly via Vercel CLI
```bash
npx vercel login
npx vercel --prod
```
