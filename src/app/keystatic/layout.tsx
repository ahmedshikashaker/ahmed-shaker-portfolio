import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Blog Editor",
  robots: { index: false, follow: false },
};

const githubConfigured = Boolean(
  process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG || process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github"
);

export default function KeystaticLayout() {
  // On the live site the editor needs GitHub sign-in; until that's configured, show setup guidance
  // instead of an editor that can't save.
  if (process.env.NODE_ENV === "production" && !githubConfigured) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a] text-slate-200">
        <div className="max-w-lg rounded-2xl border border-slate-200/10 bg-[#131c31] p-8 space-y-3">
          <h1 className="text-xl font-semibold text-slate-50">Blog editor: one-time setup needed</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            The online editor saves articles to GitHub, so it needs a GitHub App connected first.
            Follow the “Enable the online editor” steps in <code className="text-[#dfc490]">BLOGGING.md</code>{" "}
            in the repository. Until then, you can write articles locally by running{" "}
            <code className="text-[#dfc490]">npm run dev</code> and opening{" "}
            <code className="text-[#dfc490]">localhost:3000/keystatic</code>.
          </p>
        </div>
      </main>
    );
  }
  return <KeystaticApp />;
}
