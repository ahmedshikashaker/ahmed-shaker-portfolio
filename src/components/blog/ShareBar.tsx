"use client";

import { useEffect, useState } from "react";
import { FaLinkedinIn, FaXTwitter, FaWhatsapp, FaFacebookF, FaTelegram } from "react-icons/fa6";
import { Mail, Link2, Check, Share2 } from "lucide-react";

interface ShareBarProps {
  url: string;
  title: string;
  excerpt: string;
  language: "en" | "ar";
  /** "full" shows labelled buttons; "icons" is a compact icon row. */
  variant?: "full" | "icons";
}

const T = {
  en: { share: "Share this article", copy: "Copy link", copied: "Link copied", more: "More", email: "Email" },
  ar: { share: "شارك هذا المقال", copy: "نسخ الرابط", copied: "تم نسخ الرابط", more: "المزيد", email: "البريد" },
};

export default function ShareBar({ url, title, excerpt, language, variant = "full" }: ShareBarProps) {
  const t = T[language];
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
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: excerpt, url });
    } catch {
      /* user cancelled */
    }
  };

  const btn =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/10 bg-[#182338] text-slate-200 hover:text-white hover:border-transparent transition-colors cursor-pointer";

  return (
    <div className={variant === "full" ? "space-y-3" : ""}>
      {variant === "full" && <div className="text-xs font-tech uppercase tracking-wider text-[#dfc490]">{t.share}</div>}
      <div className="flex flex-wrap items-center gap-2">
        {targets.map(({ name, icon: Icon, href, color }) => (
          <a
            key={name}
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={`Share on ${name}`}
            title={name}
            className={`${btn} ${color} ${variant === "full" ? "h-10 px-3.5 text-sm" : "h-9 w-9"}`}
          >
            <Icon className="w-4 h-4" />
            {variant === "full" && <span>{name}</span>}
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label={t.copy}
          title={t.copy}
          className={`${btn} hover:bg-[#dfc490] hover:!text-slate-950 ${variant === "full" ? "h-10 px-3.5 text-sm" : "h-9 w-9"}`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          {variant === "full" && <span>{copied ? t.copied : t.copy}</span>}
        </button>
        {canNativeShare && (
          <button
            type="button"
            onClick={nativeShare}
            aria-label={t.more}
            title={t.more}
            className={`${btn} hover:bg-slate-600 ${variant === "full" ? "h-10 px-3.5 text-sm" : "h-9 w-9"}`}
          >
            <Share2 className="w-4 h-4" />
            {variant === "full" && <span>{t.more}</span>}
          </button>
        )}
      </div>
    </div>
  );
}
