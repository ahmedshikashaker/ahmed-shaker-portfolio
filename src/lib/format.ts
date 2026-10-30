/** Compact display labels derived from the portfolio data (the data itself stays untouched). */

const INSTITUTION_SHORT: Record<string, string> = {
  "Kuwait International Bank (KIB)": "KIB",
  "Warba Bank": "Warba Bank",
  "United Bank for Africa (Cit Global)": "UBA",
  "ITG Solutions (Integrated Technology Group)": "ITG Solutions",
  Advicenode: "Advicenode",
};

export function shortInstitution(name: string) {
  return INSTITUTION_SHORT[name] ?? name;
}

/** "UBA Mobile Banking (Cordova-to-Flutter Modernization)" → "UBA Mobile Banking". */
export function shortProductName(name: string) {
  return name
    .split(" — ")[0]
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function pad2(value: number) {
  return String(value).padStart(2, "0");
}
