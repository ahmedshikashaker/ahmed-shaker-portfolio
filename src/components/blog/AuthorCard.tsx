import Link from "next/link";
import Image from "next/image";
import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { Mail, ArrowUpRight } from "lucide-react";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";

export default function AuthorCard({ language }: { language: "en" | "ar" }) {
  const isAr = language === "ar";
  return (
    <section
      className="not-prose rounded-2xl border border-slate-200/[0.09] bg-[#131c31]/80 p-6 flex flex-col sm:flex-row gap-5 items-start"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#dfc490]/50 shrink-0">
        <Image src="/assets/profile/ahmed-shaker-portrait.jpg" alt="Ahmed Shaker" width={64} height={64} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-tech uppercase tracking-wider text-[#dfc490]">{isAr ? "عن الكاتب" : "About the author"}</div>
        <div className={`mt-1 text-lg font-semibold text-slate-50 ${isAr ? "font-arabic" : ""}`}>{isAr ? "أحمد شاكر" : "Ahmed Shaker"}</div>
        <p className={`text-sm text-slate-300 ${isAr ? "font-arabic" : ""}`}>
          {isAr
            ? "مدير تنفيذي – رئيس التكنولوجيا الرقمية في البنك الدولي الكويتي (KIB). ساهم في تأسيس مصنعين رقميين مصرفيين من الصفر."
            : "Executive Manager – Head of Digital Technology at Kuwait International Bank (KIB). Helped build two banking digital factories from scratch."}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#dfc490] text-slate-950 font-semibold">
            {isAr ? "الملف المهني" : "View portfolio"} <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
          </Link>
          <a href={EXECUTIVE_PROFILE.contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/10 text-slate-200 hover:border-[#0a66c2]">
            <FaLinkedinIn className="w-3.5 h-3.5" /> LinkedIn
          </a>
          <a href={EXECUTIVE_PROFILE.contact.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/10 text-slate-200 hover:border-slate-400">
            <FaGithub className="w-3.5 h-3.5" /> GitHub
          </a>
          <a href={`mailto:${EXECUTIVE_PROFILE.contact.email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/10 text-slate-200 hover:border-slate-400">
            <Mail className="w-3.5 h-3.5" /> {isAr ? "راسلني" : "Email"}
          </a>
        </div>
      </div>
    </section>
  );
}
