"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { Settlement } from "@/lib/settlement";

type CommerceWorkflowProps = {
  endpoint: string;
  price: string;
  settlement: Settlement | null;
};

const steps = [
  { title: "Discover", detail: "OpenAPI + llms.txt", state: "free" },
  { title: "Request", detail: "GET /api/demo", state: "request" },
  { title: "Challenge", detail: "402 · payment terms", state: "402" },
  { title: "Settle", detail: "USDC on Base", state: "paid" },
  { title: "Fulfill", detail: "200 · admission", state: "done" },
] as const;

function shorten(value: string) {
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function formatTimestamp(value: string) {
  return `${value.slice(0, 16).replace("T", " ")} UTC`;
}

export function CommerceWorkflow({
  endpoint,
  price,
  settlement,
}: CommerceWorkflowProps) {
  const [run, setRun] = useState(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setHasEnteredView(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasEnteredView(true);
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-5xl px-4 pb-16"
      aria-labelledby="workflow-title"
    >
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-wider text-white/50 uppercase">
              Live commerce trace
            </p>
            <h2
              id="workflow-title"
              className="mt-3 text-2xl font-bold tracking-tight"
            >
              One intent. Five protocol steps.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
              A dry-run of the same x402 handshake your agent performs against
              the live endpoint.
            </p>
          </div>
          <button
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/70 transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            type="button"
            onClick={() => {
              setHasEnteredView(true);
              setRun((value) => value + 1);
            }}
          >
            Replay flow
          </button>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="grid content-start gap-3">
            <article className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <span className="text-[10px] tracking-wider text-white/50 uppercase">
                Human intent
              </span>
              <strong className="mt-2 block text-sm text-white/80">
                “Attend this demo.”
              </strong>
              <p className="mt-2 text-xs leading-relaxed text-white/55">
                Delegate the task without opening another account.
              </p>
            </article>
            <article className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <span className="text-[10px] tracking-wider text-white/50 uppercase">
                Agent target
              </span>
              <code className="mt-2 block [overflow-wrap:anywhere] text-xs leading-relaxed text-white/55">
                {endpoint}
              </code>
            </article>
            <article className="rounded-lg border border-green-500/15 bg-green-500/[0.04] p-4">
              <span className="text-[10px] tracking-wider text-green-400/60 uppercase">
                Total cost
              </span>
              <strong className="mt-2 block text-2xl text-green-400">
                ${price} USDC
              </strong>
              <p className="mt-2 text-xs text-white/55">
                Settled once on Base mainnet.
              </p>
            </article>
          </div>

          <ol
            className="flow-timeline"
            data-active={hasEnteredView}
            key={run}
            aria-label="x402 payment flow"
          >
            {steps.map((step, index) => (
              <li
                className="flow-timeline-step"
                key={step.title}
                style={{ "--step": index } as CSSProperties}
              >
                <div className="flow-marker" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="min-w-0 rounded-lg border border-white/10 bg-black/60 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm text-white/80">
                      {step.title}
                    </strong>
                    <span
                      className={
                        step.state === "paid" || step.state === "done"
                          ? "text-[9px] tracking-wider text-green-400 uppercase"
                          : "text-[9px] tracking-wider text-white/50 uppercase"
                      }
                    >
                      {step.state}
                    </span>
                  </div>
                  <code className="mt-1.5 block text-[11px] leading-relaxed text-white/55">
                    {step.detail}
                  </code>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 grid overflow-hidden rounded-lg border border-white/10 bg-black/40 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
          <div className="p-4">
            <span className="text-[9px] tracking-wider text-white/50 uppercase">
              Agent returns
            </span>
            <strong className="mt-1.5 block text-xs text-white/70">
              Admission + private join URL
            </strong>
          </div>
          <div className="flex items-center justify-between gap-4 border-y border-white/5 px-4 py-3 text-[10px] text-green-400 sm:border-x sm:border-y-0">
            <span>{price} USDC</span>
            <span aria-hidden="true">→</span>
          </div>
          <div className="p-4 sm:text-right">
            <span className="text-[9px] tracking-wider text-white/50 uppercase">
              Host receives
            </span>
            <strong className="mt-1.5 block text-xs text-white/70">
              Onchain revenue on Base
            </strong>
          </div>
        </div>

        <footer className="mt-4 grid gap-4 rounded-lg border border-white/10 bg-black/40 p-4 lg:grid-cols-[minmax(13rem,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <span className="flex items-center gap-2 text-[10px] tracking-wider text-white/50 uppercase">
              {settlement ? (
                <i
                  className="h-1.5 w-1.5 rounded-full bg-green-400"
                  aria-hidden="true"
                />
              ) : null}
              Latest settlement
            </span>
            {settlement ? (
              <strong className="mt-2 block text-xs text-white/70">
                {settlement.amount} USDC confirmed on Base
              </strong>
            ) : (
              <strong className="mt-2 block text-xs text-white/50">
                Settlement data is temporarily unavailable
              </strong>
            )}
          </div>
          {settlement ? (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:text-right">
              <div className="min-w-0">
                <dt className="text-[9px] tracking-wider text-white/50 uppercase">
                  Flow
                </dt>
                <dd className="mt-1 [overflow-wrap:anywhere] text-[10px] text-white/55">
                  {shorten(settlement.payer)} → {shorten(settlement.recipient)}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] tracking-wider text-white/50 uppercase">
                  Block
                </dt>
                <dd className="mt-1 text-[10px] text-white/55">
                  {settlement.blockNumber.toLocaleString("en-US")}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] tracking-wider text-white/50 uppercase">
                  Time
                </dt>
                <dd className="mt-1 text-[10px] text-white/55">
                  {formatTimestamp(settlement.timestamp)}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] tracking-wider text-white/50 uppercase">
                  Proof
                </dt>
                <dd className="mt-1 text-[10px] text-green-400">
                  <a
                    className="transition-colors hover:text-green-300"
                    href={`https://basescan.org/tx/${settlement.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shorten(settlement.transactionHash)}
                  </a>
                </dd>
              </div>
            </dl>
          ) : null}
        </footer>
      </div>
    </section>
  );
}
