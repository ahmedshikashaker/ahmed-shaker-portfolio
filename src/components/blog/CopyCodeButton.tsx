"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { copyText } from "@/lib/hooks";

export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const notify = useToast();
  return (
    <button
      type="button"
      onClick={async () => {
        const result = await copyText(code);
        if (result === "copied") {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } else {
          notify("Couldn't copy the code. Select it manually.", "error");
        }
      }}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 text-[11px] text-fg-3 transition-colors hover:bg-surface-2 hover:text-accent"
      aria-label={copied ? "Code copied" : "Copy code"}
    >
      {copied ? <Check className="size-3.5 text-signal" /> : <Copy className="size-3.5" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
