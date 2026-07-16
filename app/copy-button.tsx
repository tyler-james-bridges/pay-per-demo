"use client";

import { useEffect, useRef, useState } from "react";

type CopyButtonProps = {
  label: string;
  value: string;
  variant?: "primary" | "secondary" | "quiet";
};

function fallbackCopy(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Clipboard access is unavailable");
}

async function copyWithFallback(value: string) {
  if (!navigator.clipboard?.writeText) {
    fallbackCopy(value);
    return;
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      navigator.clipboard.writeText(value),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("Clipboard request timed out")),
          600,
        );
      }),
    ]);
  } catch {
    fallbackCopy(value);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export function CopyButton({
  label,
  value,
  variant = "primary",
}: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyValue() {
    try {
      await copyWithFallback(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 1_800);
  }

  const buttonLabel =
    status === "copied" ? "Copied" : status === "error" ? "Copy failed" : label;

  return (
    <button
      className="copy-button"
      data-variant={variant}
      type="button"
      onClick={copyValue}
      aria-live="polite"
    >
      {buttonLabel}
    </button>
  );
}
