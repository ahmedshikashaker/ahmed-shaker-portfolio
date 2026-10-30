"use client";

import { useEffect, useState } from "react";
import { FaLinkedinIn, FaXTwitter, FaWhatsapp, FaFacebookF, FaTelegram } from "react-icons/fa6";
import { Mail, Link2, Check, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { copyText } from "@/lib/hooks";

interface ShareBarProps {
  url: string;
  title: string;
  excerpt: string;
  language: "en" | "ar";
  /** "full" shows labelled buttons; "icons" is a compact icon row. */
  variant?: "full" | "icons";
}

const T = {
  en: { share: "Share this article", copy: "Copy link", copied: "Link copied", failed: "Couldn't copy the link", more: "More", email: "Email" },
  ar: { share: "شارك هذا المقال", copy: "نسخ الرابط", copied: "تم نسخ الرابط", failed: "تعذّر نسخ الرابط", more: "المزيد", email: "البريد" },
};

export default function ShareBar({ url, title, excerpt, language, variant = "full" }: ShareBarProps) {
  const t = T[language];
  const notify = useToast();
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const u = encodeURIComponent(url);
  const ttl = encodeURIComponent(title);
  const msg = encodeURIComponent(`${title}\n\n${url}`);

  const targets = [
    { name: "LinkedIn", icon: FaLinkedinIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, color: "hover:bg-[#0a66c2]" },
    { name: "X", icon: FaXTwitter, href: `https://twitter.com/intent/tweet?text=${ttl}&url=${u}`, color: "hover:bg-black" },
    { name: "WhatsApp", icon: FaWhatsapp, href: `https://wa.me/?text=${msg}`, color: "hover:bg-[#25d366]" },
    { name: "Facebook", icon: FaFacebookF, href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, color: "hover:bg-[#1877f2]" },
    { name: "Telegram", icon: FaTelegram, href: `https://t.me/share/url?url=${u}&text=${ttl}`, color: "hover:bg-[#229ed9]" },
    {
      name: t.email,
      icon: Mail,
      href: `mailto:?subject=${ttl}&body=${encodeURIComponent(`${excerpt}\n\n${url}`)}`,
      color: "hover:bg-slate-600",
    },
  ];

  const copy = async () => {
    const result = await copyText(url);
    if (result === "copied") {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
    notify(result === "copied" ? t.copied : t.failed, result === "copied" ? "success" : "error");
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: excerpt, url });
    } catch {
      /* user cancelled */
    }
  };

  const btn =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-line-2 bg-surface/60 text-fg-2 transition-[background-color,color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-transparent hover:text-white";
  const size = variant === "full" ? "h-10 px-4 text-[13px]" : "size-9";

  return (
    <div className={variant === "full" ? "space-y-4" : ""}>
      {variant === "full" && <div className="eyebrow text-fg-3">{t.share}</div>}
      <div className="flex flex-wrap items-center gap-2">
        {targets.map(({ name, icon: Icon, href, color }) => (
          <a
            key={name}
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={`Share on ${name}`}
            title={name}
            className={cn(btn, color, size)}
          >
            <Icon className="size-[15px]" />
            {variant === "full" && <span>{name}</span>}
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label={t.copy}
          title={t.copy}
          className={cn(btn, "hover:!text-on-accent hover:bg-accent", size)}
        >
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
          {variant === "full" && <span>{copied ? t.copied : t.copy}</span>}
        </button>
        {canNativeShare && (
          <button type="button" onClick={nativeShare} aria-label={t.more} title={t.more} className={cn(btn, "hover:bg-slate-600", size)}>
            <Share2 className="size-4" />
            {variant === "full" && <span>{t.more}</span>}
          </button>
        )}
      </div>
    </div>
  );
}
