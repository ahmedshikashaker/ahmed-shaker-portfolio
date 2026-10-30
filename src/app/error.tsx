"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { ArrowGlyph, Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="shell flex min-h-[80dvh] flex-col justify-center py-24">
      <div className="eyebrow flex items-center gap-3 text-fg-3">
        <span className="text-danger">Unexpected error</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-3" />
        <span>{error.digest ? `Reference ${error.digest}` : "Something went off-plan"}</span>
      </div>
      <h1 className="mt-6 max-w-2xl font-display text-display-2 text-fg">
        Something went <em className="text-accent">off-plan.</em>
      </h1>
      <p className="mt-5 max-w-lg text-lede text-fg-3">
        This part of the page couldn’t load. Trying again usually fixes it; if not, the rest of the portfolio is a click away.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={reset} iconLeading={<RotateCcw className="size-4" strokeWidth={1.75} />}>
          Try again
        </Button>
        <Button href="/" variant="secondary" icon={<ArrowGlyph />}>
          Back to the portfolio
        </Button>
      </div>
    </main>
  );
}
