import React from "react";
import Markdoc, { type RenderableTreeNode } from "@markdoc/markdoc";
import { codeToHtml } from "shiki";
import { Info, Lightbulb, Sparkles, TriangleAlert } from "lucide-react";
import CopyCodeButton from "./CopyCodeButton";

/* ---------------------------------------------------------------- Code blocks */

// Both themes are emitted as CSS variables; globals.css picks one per site theme.
const SHIKI_THEMES = { dark: "github-dark-dimmed", light: "github-light" } as const;

async function CodeBlock({ content, language }: { content?: string; language?: string }) {
  const code = (content ?? "").replace(/\n$/, "");
  const lang = (language || "text").toLowerCase();
  let html: string;
  try {
    html = await codeToHtml(code, { lang, themes: SHIKI_THEMES, defaultColor: false });
  } catch {
    html = await codeToHtml(code, { lang: "text", themes: SHIKI_THEMES, defaultColor: false });
  }
  return (
    <div className="blog-code not-prose group relative my-8 overflow-hidden rounded-xl border border-line-2 bg-surface" dir="ltr">
      <div className="flex items-center justify-between border-b border-line bg-bg-2/70 px-4 py-2">
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-line-3" />
            <span className="size-2.5 rounded-full bg-line-3" />
            <span className="size-2.5 rounded-full bg-line-3" />
          </span>
          <span className="eyebrow text-[10px] text-fg-4">{lang === "text" ? "code" : lang}</span>
        </span>
        <CopyCodeButton code={code} />
      </div>
      <div
        className="overflow-x-auto font-mono text-[13.5px] leading-relaxed [&_pre]:m-0 [&_pre]:p-5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- Callouts */

const CALLOUT_STYLES = {
  note: { icon: Info, ring: "border-sky-400/30 bg-sky-400/[0.06]", accent: "text-sky-500 dark:text-sky-300", label: "Note" },
  tip: { icon: Lightbulb, ring: "border-signal/35 bg-signal/[0.06]", accent: "text-signal", label: "Tip" },
  insight: { icon: Sparkles, ring: "border-accent/40 bg-accent/[0.07]", accent: "text-accent", label: "Key insight" },
  warning: { icon: TriangleAlert, ring: "border-amber-500/40 bg-amber-400/[0.08]", accent: "text-amber-600 dark:text-amber-300", label: "Warning" },
} as const;

function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: keyof typeof CALLOUT_STYLES;
  title?: string;
  children?: React.ReactNode;
}) {
  const style = CALLOUT_STYLES[tone] ?? CALLOUT_STYLES.note;
  const Icon = style.icon;
  return (
    <aside className={`not-prose my-8 rounded-xl border ${style.ring} px-5 py-4 font-sans`}>
      <div className={`flex items-center gap-2 text-[13px] font-semibold ${style.accent}`}>
        <Icon className="size-4 shrink-0" strokeWidth={1.75} />
        <span>{title || style.label}</span>
      </div>
      <div className="mt-2 text-[15px] leading-relaxed text-fg-2 [&_a]:text-accent [&_a]:underline [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:my-2 [&_ul]:list-disc [&_ul]:ps-5">
        {children}
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------------- YouTube */

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.pathname.startsWith("/shorts/") || u.pathname.startsWith("/embed/")) {
      return u.pathname.split("/")[2] || null;
    }
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

function YouTube({ url, caption }: { url: string; caption?: string }) {
  const id = youtubeId(url);
  if (!id) return null;
  return (
    <figure className="not-prose my-10">
      <div className="relative w-full overflow-hidden rounded-xl border border-line-2 bg-black" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={caption || "YouTube video"}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {caption && <figcaption className="mt-3 text-center font-sans text-[13px] text-fg-3">{caption}</figcaption>}
    </figure>
  );
}

/* ---------------------------------------------------------------- Pull quote */

function PullQuote({ quote, attribution }: { quote: string; attribution?: string }) {
  return (
    <figure className="not-prose relative my-12 border-y border-line-2 py-8">
      <span aria-hidden="true" className="absolute -top-5 start-0 bg-bg pe-3 font-display text-[3.5rem] leading-none text-accent">
        “
      </span>
      <blockquote className="font-display text-[clamp(1.6rem,3vw,2.1rem)] italic leading-snug text-fg">{quote}</blockquote>
      {attribution && <figcaption className="eyebrow mt-4 text-accent">— {attribution}</figcaption>}
    </figure>
  );
}

/* ---------------------------------------------------------------- Links */

function SmartLink({ href, title, children }: { href: string; title?: string; children?: React.ReactNode }) {
  const external = /^https?:\/\//.test(href) && !href.startsWith("https://www.ahmed-shaker.com");
  return (
    <a
      href={href}
      title={title}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function renderMarkdoc(renderable: RenderableTreeNode) {
  return Markdoc.renderers.react(renderable, React, {
    components: { CodeBlock, Callout, YouTube, PullQuote, SmartLink },
  });
}
