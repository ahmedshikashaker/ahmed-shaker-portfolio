/** Formatting helpers shared by server and client blog components. */

const CATEGORY_AR: Record<string, string> = {
  "digital-banking": "الخدمات المصرفية الرقمية",
  architecture: "هندسة البرمجيات",
  "engineering-leadership": "القيادة الهندسية",
  mobile: "تطبيقات الهواتف",
  "devops-cloud": "DevOps والسحابة",
  fintech: "التكنولوجيا المالية والمدفوعات",
  "digital-transformation": "التحول الرقمي",
  insights: "رؤى ومسيرة مهنية",
};

export function localizedCategory(value: string, englishLabel: string, language: "en" | "ar"): string {
  return language === "ar" ? CATEGORY_AR[value] ?? englishLabel : englishLabel;
}

/** "5 min read" / Arabic with correct number agreement (دقيقة / دقيقتان / دقائق). */
export function readingLabel(minutes: number, language: "en" | "ar"): string {
  if (language !== "ar") return `${minutes} min read`;
  if (minutes <= 1) return "دقيقة قراءة";
  if (minutes === 2) return "دقيقتان قراءة";
  if (minutes <= 10) return `${minutes} دقائق قراءة`;
  return `${minutes} دقيقة قراءة`;
}
