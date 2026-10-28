import React from "react";
import Markdoc, { type RenderableTreeNode } from "@markdoc/markdoc";
import { codeToHtml } from "shiki";
import { Info, Lightbulb, Sparkles, TriangleAlert } from "lucide-react";
import CopyCodeButton from "./CopyCodeButton";

/* ---------------------------------------------------------------- Code blocks */

async function CodeBlock({ content, language }: { content?: string; language?: string }) {
  const code = (content ?? "").replace(/\n$/, "");
  const lang = (language || "text").toLowerCase();
  let html: string;
  try {
    html = await codeToHtml(code, { lang, theme: "github-dark-dimmed" });
  } catch {
    html = await codeToHtml(code, { lang: "text", theme: "github-dark-dimmed" });
  }
  return (
    <div className="blog-code not-prose group relative my-7" dir="ltr">
      <div className="flex items-center justify-between px-4 py-2 rounded-t-xl bg-[#0b1222] border border-b-0 border-slate-200/10">
        <span className="font-tech text-[11px] uppercase tracking-wider text-slate-400">
          {lang === "text" ? "code" : lang}
        </span>
        <CopyCodeButton code={code} />
      </div>
      <div
        className="overflow-x-auto rounded-b-xl border border-slate-200/10 text-[13.5px] leading-relaxed [&_pre]:!bg-[#111a2e] [&_pre]:p-4 [&_pre]:m-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- Callouts */

const CALLOUT_STYLES = {
  note: { icon: Info, ring: "border-sky-400/30 bg-sky-400/[0.06]", accent: "text-sky-300", label: "Note" },
  tip: { icon: Lightbulb, ring: "border-teal-300/30 bg-teal-300/[0.06]", accent: "text-teal-300", label: "Tip" },
  insight: { icon: Sparkles, ring: "border-[#dfc490]/35 bg-[#dfc490]/[0.07]", accent: "text-[#dfc490]", label: "Key insight" },
  warning: { icon: TriangleAlert, ring: "border-amber-400/35 bg-amber-400/[0.07]", accent: "text-amber-300", label: "Warning" },
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
    <aside className={`not-prose my-7 rounded-2xl border ${style.ring} px-5 py-4`}>
      <div className={`flex items-center gap-2 text-sm font-semibold ${style.accent}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{title || style.label}</span>
      </div>
      <div className="mt-2 text-[15px] leading-relaxed text-slate-200 [&_p]:my-2 [&_a]:text-[#dfc490] [&_a]:underline [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5">
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
    <figure className="not-prose my-8">
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/10 bg-black" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={caption || "YouTube video"}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {caption && <figcaption className="mt-2 text-center text-sm text-slate-400">{caption}</figcaption>}
    </figure>
  );
}

/* ---------------------------------------------------------------- Pull quote */

function PullQuote({ quote, attribution }: { quote: string; attribution?: string }) {
  return (
    <figure className="not-prose my-10 border-s-2 border-[#dfc490] ps-6">
      <blockquote className="font-editorial italic text-2xl sm:text-[1.7rem] leading-snug text-slate-50">
        “{quote}”
      </blockquote>
      {attribution && <figcaption className="mt-3 text-sm text-[#dfc490]">— {attribution}</figcaption>}
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
