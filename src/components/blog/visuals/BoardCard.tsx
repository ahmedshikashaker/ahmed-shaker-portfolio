"use client";

import { useRef, useState } from "react";
import { Check, Copy, Linkedin } from "lucide-react";

/** A typeset, shareable summary card ("What I'd tell a board"). Children are the article's own list. */
export default function BoardCard({ title, children }: { title?: string; children?: React.ReactNode }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const items = Array.from(bodyRef.current?.querySelectorAll("li") ?? []).map((li, i) => `${i + 1}. ${li.innerText.trim()}`);
    const text = [title, "", ...items, "", typeof window !== "undefined" ? window.location.href.split("#")[0] : ""].filter((l) => l !== undefined).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: ignore */
    }
  }

  function share() {
    const url = encodeURIComponent(window.location.href.split("#")[0]);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  }

  return (
    <aside className="not-prose relative my-14 overflow-hidden rounded-2xl border border-accent/35 bg-surface font-sans shadow-[var(--shadow-float)]" aria-label={title || "Summary for the board"}>
      <div aria-hidden="true" className="pointer-events-none absolute -end-24 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative px-6 pt-6 sm:px-8 sm:pt-8">
        <p className="eyebrow text-accent">For the board</p>
        {title && <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight text-fg">{title}</h3>}
      </div>
      <div
        ref={bodyRef}
        className="board-card-body relative px-6 pb-2 pt-5 sm:px-8"
      >
        {children}
      </div>
      <div className="relative flex flex-wrap items-center gap-2 border-t border-line px-6 py-4 sm:px-8">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-3.5 py-1.5 text-[12.5px] text-fg-2 transition-colors hover:border-line-3 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {copied ? <Check className="size-3.5 text-signal" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy as text"}
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-3.5 py-1.5 text-[12.5px] text-fg-2 transition-colors hover:border-line-3 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Linkedin className="size-3.5" aria-hidden="true" /> Share on LinkedIn
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied to clipboard" : ""}
        </span>
      </div>
    </aside>
  );
}
