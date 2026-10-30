import Image from "next/image";
import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { Mail } from "lucide-react";
import { EXECUTIVE_PROFILE } from "@/data/portfolioData";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { CornerTicks } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

export default function AuthorCard({ language }: { language: "en" | "ar" }) {
  const isAr = language === "ar";
  return (
    <section
      className="not-prose relative flex flex-col items-start gap-6 border border-line-2 bg-surface/50 p-6 sm:flex-row sm:p-8"
      dir={isAr ? "rtl" : "ltr"}
      aria-label={isAr ? "عن الكاتب" : "About the author"}
    >
      <CornerTicks className="-inset-px" />
      <div className="duotone relative size-20 shrink-0 overflow-hidden rounded-full border border-line-2">
        <Image src="/assets/profile/ahmed-shaker-portrait.jpg" alt="Ahmed Shaker" fill sizes="80px" className="object-cover object-[50%_24%]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="eyebrow text-accent">{isAr ? "عن الكاتب" : "About the author"}</div>
        <div className={cn("mt-2 text-[1.6rem] leading-tight text-fg", isAr ? "font-arabic font-semibold" : "font-display")}>
          {isAr ? "أحمد شاكر" : "Ahmed Shaker"}
        </div>
        <p className={cn("mt-2 text-[14.5px] leading-relaxed text-fg-3", isAr && "font-arabic")}>
          {isAr
            ? "مدير تنفيذي – رئيس التكنولوجيا الرقمية في البنك الدولي الكويتي (KIB). ساهم في تأسيس مصنعين رقميين مصرفيين من الصفر."
            : "Executive Manager – Head of Digital Technology at Kuwait International Bank (KIB). Helped build two banking digital factories from scratch."}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button href="/" size="sm" icon={<ArrowGlyph className="size-3.5 rtl:-scale-x-100" />}>
            {isAr ? "الملف المهني" : "View portfolio"}
          </Button>
          <Button href={EXECUTIVE_PROFILE.contact.linkedin} target="_blank" rel="noopener noreferrer" size="sm" variant="secondary" iconLeading={<FaLinkedinIn className="size-3.5" />}>
            LinkedIn
          </Button>
          <Button href={EXECUTIVE_PROFILE.contact.github} target="_blank" rel="noopener noreferrer" size="sm" variant="secondary" iconLeading={<FaGithub className="size-3.5" />}>
            GitHub
          </Button>
          <Button href={`mailto:${EXECUTIVE_PROFILE.contact.email}`} size="sm" variant="secondary" iconLeading={<Mail className="size-3.5" strokeWidth={1.75} />}>
            {isAr ? "راسلني" : "Email"}
          </Button>
        </div>
      </div>
    </section>
  );
}
