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
      <main className="min-h-screen flex items-center justify-center p-6 bg-bg text-fg-2">
        <div className="max-w-lg rounded-xl border border-line-2 bg-surface p-8 space-y-3">
          <h1 className="font-display text-2xl text-fg">Blog editor: one-time setup needed</h1>
          <p className="text-sm text-fg-3 leading-relaxed">
            The online editor saves articles to GitHub, so it needs a GitHub App connected first.
            Follow the “Enable the online editor” steps in <code className="text-accent">BLOGGING.md</code>{" "}
            in the repository. Until then, you can write articles locally by running{" "}
            <code className="text-accent">npm run dev</code> and opening{" "}
            <code className="text-accent">localhost:3000/keystatic</code>.
          </p>
        </div>
      </main>
    );
  }
  return <KeystaticApp />;
}
