# Ahmed Shaker — Executive Technology Portfolio

World-class executive technology portfolio for **Ahmed Shaker** (*Head of Digital Technology at Kuwait International Bank (KIB)* and former *Android Chapter Lead at Warba Bank*).

Positioned for C-level executives, banking boards, CTO/VP Engineering recruiters, and digital transformation leaders, this site highlights Ahmed's career-defining achievement of **building two banking Digital Factories from scratch** (at **Warba Bank** and **Kuwait International Bank**) and directing 8+ regulated digital banking ecosystems across Mobile (Android, iOS, Flutter), Web, Backend Microservices (NestJS, Java EE, Kafka, RabbitMQ), and Cloud-Native DevOps (Kubernetes, Argo CD, Jenkins).

---

## Architecture & Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) with React 19 & TypeScript
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) with the "Sovereign Blueprint" token system in `src/app/globals.css`: semantic colour tokens (`bg`, `surface`, `fg`, `accent`, `signal`, `line`) for two themes, **Ink** (dark, default) and **Paper** (light), plus a display type scale (`text-display-1…3`, `text-title`, `text-lede`). Toggle with the sun/moon button or the command palette; the choice is stored in `localStorage`.
- **Typography**: Newsreader (display serif, optical sizes), IBM Plex Sans (UI and body), IBM Plex Mono (annotations), IBM Plex Sans Arabic (Arabic), loaded through `next/font`
- **Animations & Micro-Interactions**: [Framer Motion](https://www.framer.com/motion/). Shared motion tokens live in `src/lib/motion.ts`; `MotionConfig reducedMotion="user"` plus CSS fallbacks honour `prefers-reduced-motion`
- **UI primitives**: `src/components/ui/` (reveal and split-text animation, buttons, segmented control, count-up, marquee, toasts, theme toggle); site chrome (header, mobile menu, ⌘K command palette) in `src/components/site/`
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
