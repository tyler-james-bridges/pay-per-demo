import type { Settlement } from "@/lib/settlement";

type CommerceWorkflowProps = {
  price: string;
  settlement: Settlement | null;
};

const steps = [
  { title: "Prompt", detail: "Human intent" },
  { title: "402", detail: "Terms returned" },
  { title: "Pay", detail: "USDC on Base" },
  { title: "Access", detail: "Private join URL" },
] as const;

function formatTimestamp(value: string) {
  return `${value.slice(0, 16).replace("T", " ")} UTC`;
}

export function CommerceWorkflow({ price, settlement }: CommerceWorkflowProps) {
  return (
    <section
      className="mx-auto max-w-4xl px-4 pb-8"
      aria-labelledby="workflow-title"
    >
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 md:p-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-white/50 uppercase">
              Protocol flow
            </p>
            <h2
              id="workflow-title"
              className="mt-2 text-lg font-bold tracking-tight"
            >
              One prompt, one paid response.
            </h2>
          </div>
          <span className="shrink-0 rounded border border-green-500/20 bg-green-500/[0.06] px-2.5 py-1.5 text-[10px] text-green-400">
            x402 · Base
          </span>
        </header>

        <ol
          className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
          aria-label="x402 payment flow"
        >
          {steps.map((step, index) => (
            <li
              className="relative min-w-0 rounded-lg border border-white/10 bg-black/60 p-3"
              key={step.title}
            >
              <span className="text-[9px] tracking-wider text-white/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-2 block text-xs text-white/80">
                {step.title}
              </strong>
              <code className="mt-1 block text-[10px] leading-relaxed text-white/50">
                {step.title === "Pay" ? `${price} USDC · Base` : step.detail}
              </code>
              {index < steps.length - 1 ? (
                <span
                  className="absolute top-1/2 -right-2 z-10 hidden -translate-y-1/2 text-[10px] text-white/30 sm:block"
                  aria-hidden="true"
                >
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <footer className="mt-4 flex flex-col justify-between gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center">
          <div>
            <span className="flex items-center gap-2 text-[9px] tracking-wider text-white/50 uppercase">
              {settlement ? (
                <i
                  className="h-1.5 w-1.5 rounded-full bg-green-400"
                  aria-hidden="true"
                />
              ) : null}
              Latest real settlement
            </span>
            {settlement ? (
              <p className="mt-1.5 text-[10px] text-white/55">
                {settlement.amount} USDC confirmed on Base · block{" "}
                {settlement.blockNumber.toLocaleString("en-US")} ·{" "}
                {formatTimestamp(settlement.timestamp)}
              </p>
            ) : (
              <p className="mt-1.5 text-[10px] text-white/50">
                Settlement data is temporarily unavailable
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-[10px]">
            <a
              className="text-green-400 transition-colors hover:text-green-300"
              href="/activity"
            >
              View all transactions →
            </a>
            {settlement ? (
              <a
                className="text-white/40 transition-colors hover:text-white/70"
                href={`https://basescan.org/tx/${settlement.transactionHash}`}
                target="_blank"
                rel="noreferrer"
              >
                Latest proof ↗
              </a>
            ) : null}
          </div>
        </footer>
      </div>
    </section>
  );
}
