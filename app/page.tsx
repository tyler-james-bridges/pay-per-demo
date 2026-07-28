import { headers } from "next/headers";
import Link from "next/link";

import { CopyButton } from "@/app/copy-button";
import { CommerceWorkflow } from "@/app/workflow";
import { demoPrice, overflowPrice } from "@/lib/config";
import { demoEvent } from "@/lib/demo";
import { overflowEvent, overflowNotice } from "@/lib/overflow";
import { getLatestSettlement } from "@/lib/settlement";

async function getOrigin() {
  if (process.env.BASE_URL) return process.env.BASE_URL;

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export default async function Home() {
  const origin = await getOrigin();
  const endpoint = `${origin}/api/overflow`;
  const command =
    `npx agentcash@latest fetch ${endpoint} --yes ` +
    `--payment-protocol x402 --payment-network base --max-amount ${overflowPrice}`;
  const discoverCommand = `npx agentcash@latest discover ${origin}`;
  const priceInCents = Number(overflowPrice) * 100;
  const compactPrice = Number.isInteger(priceInCents)
    ? `${priceInCents}¢`
    : `$${overflowPrice}`;
  const agentPrompt =
    `Use AgentCash: run the virtual overflow prototype at ${endpoint}. ` +
    `Max ${overflowPrice} USDC on Base. Return prototype access, event context, and the private room URL.`;
  const responsePreview = JSON.stringify(
    {
      access: "prototype_confirmed",
      prototype: { official: false },
      event: {
        name: overflowEvent.name,
        date: overflowEvent.date,
        attendance: overflowEvent.attendance,
      },
      payment: {
        amount: overflowPrice,
        currency: "USDC",
        network: "eip155:8453",
      },
      roomUrl: "[redacted until payment]",
    },
    null,
    2,
  );
  const payee = process.env.EVM_PAYEE_ADDRESS;
  const settlement = payee
    ? await getLatestSettlement(payee).catch(() => null)
    : null;

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-5xl px-4 pt-6">
        <div className="flex min-h-10 items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs text-white/50">
          <Link
            className="font-bold tracking-tight text-white transition-colors hover:text-white/70"
            href="/"
            aria-label="Pay Per Demo home"
          >
            pay-per-demo
          </Link>
          <nav className="flex items-center gap-4" aria-label="Service links">
            <Link
              className="hidden transition-colors hover:text-white/70 sm:inline"
              href="/activity"
            >
              activity
            </Link>
            <Link
              className="hidden transition-colors hover:text-white/70 sm:inline"
              href="#endpoints"
            >
              demos
            </Link>
            <a
              className="hidden transition-colors hover:text-white/70 sm:inline"
              href="/llms.txt"
            >
              agent view
            </a>
            <span className="flex items-center gap-2">
              <i
                className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_0_3px_rgb(74_222_128_/_0.1)]"
                aria-hidden="true"
              />
              accepting x402
            </span>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 pt-6 pb-4 md:pt-16 md:pb-10">
        <div className="text-center">
          <p className="text-[11px] font-bold tracking-[0.18em] text-white/50 uppercase">
            live service · two x402 event experiments
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.055em] md:text-7xl">
            pay-per-demo
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-white/60 md:text-2xl">
            An agent pays USDC over x402 and unlocks a private virtual event
            room.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/55">
            The current prototype costs {compactPrice} on Base. The original
            Demo Day flow stays available as a reference.
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-5xl scroll-mt-6 px-4 pb-10"
        id="endpoints"
        aria-labelledby="endpoints-title"
      >
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-white/40 uppercase">
              paid endpoints
            </p>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight"
              id="endpoints-title"
            >
              Choose the demo.
            </h2>
          </div>
          <span className="hidden text-[10px] text-white/40 sm:inline">
            newest first
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-green-500/30 bg-green-500/[0.04] p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold tracking-wider text-green-400 uppercase">
                01 · current
              </span>
              <code className="text-[10px] text-white/45">July 29, 2026</code>
            </div>
            <h3 className="mt-5 text-2xl font-bold tracking-tight">
              Virtual overflow
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Agent-paid access to a private prototype room for the Merit
              Systems + Circle event context.
            </p>
            <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/50 px-3 py-2.5">
              <code className="text-xs text-white/75">GET /api/overflow</code>
              <strong className="text-xs text-green-400">
                ${overflowPrice} USDC
              </strong>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-amber-100/60">
              {overflowNotice}
            </p>
            <a
              className="mt-4 inline-block text-xs text-white/45 underline decoration-white/20 underline-offset-4 hover:text-white/70"
              href={overflowEvent.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              View context post
            </a>
          </article>

          <article className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold tracking-wider text-white/45 uppercase">
                02 · reference
              </span>
              <code className="text-[10px] text-white/35">July 16, 2026</code>
            </div>
            <h3 className="mt-5 text-2xl font-bold tracking-tight">
              {demoEvent.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              The original one-cent Base flow, preserved with its endpoint and
              public settlement proof.
            </p>
            <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/50 px-3 py-2.5">
              <code className="text-xs text-white/65">GET /api/demo</code>
              <strong className="text-xs text-white/55">
                ${demoPrice} USDC
              </strong>
            </div>
            <div className="mt-4 flex gap-4 text-xs text-white/45">
              <a
                className="underline decoration-white/20 underline-offset-4 hover:text-white/70"
                href="https://x.com/tmoney_145/status/2077880148854984806"
                target="_blank"
                rel="noreferrer"
              >
                Original demo
              </a>
              <a
                className="underline decoration-white/20 underline-offset-4 hover:text-white/70"
                href="https://basescan.org/tx/0xe01840f4e7b86ed76cbc368ccf8384b86e57e27397b3e3f476d14b68444af9c6"
                target="_blank"
                rel="noreferrer"
              >
                Settlement proof
              </a>
            </div>
          </article>
        </div>
      </section>

      <CommerceWorkflow
        accessDetail="Prototype room URL"
        price={overflowPrice}
        settlement={settlement}
      />

      <section
        className="mx-auto max-w-3xl px-4 pb-16"
        aria-labelledby="prompt-title"
      >
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="prompt-title"
              className="text-xs font-bold tracking-wider text-white/50 uppercase"
            >
              Ready-to-send prompt
            </h2>
            <span className="text-[10px] tracking-wider text-white/50 uppercase">
              {overflowPrice} USDC · Base
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1 break-words rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/75">
              <span className="mb-2 block text-[10px] tracking-wider text-white/50 uppercase">
                human → agent
              </span>
              “{agentPrompt}”
            </div>
            <CopyButton label="Copy prompt" value={agentPrompt} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] tracking-wider text-white/50 uppercase">
              <span>✓ no account</span>
              <span>✓ no API key</span>
              <span>✓ max spend set</span>
            </div>
            <a
              className="hidden text-xs text-white/50 transition-colors hover:text-white sm:inline"
              href="#agent-command"
            >
              Use the CLI instead →
            </a>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-5xl scroll-mt-6 px-4 pb-16"
        id="agent-command"
        aria-labelledby="endpoint-title"
      >
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold tracking-wider text-white/50 uppercase">
                x402 paid API
              </p>
              <h2
                id="endpoint-title"
                className="mt-3 flex flex-wrap items-center gap-3 text-lg font-bold"
              >
                <span className="rounded bg-green-500/15 px-2 py-1 text-[11px] text-green-400">
                  GET
                </span>
                <code>/api/overflow</code>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
                Public discovery is free. The private prototype room is returned
                only after the one-time payment settles.
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <strong className="block text-lg text-green-400">
                ${overflowPrice}
              </strong>
              <span className="mt-1 block text-[10px] tracking-wider text-white/50 uppercase">
                USDC / request
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)]">
            <div className="grid min-w-0 gap-3">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-black/60">
                <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3 text-[10px] tracking-wider text-white/50 uppercase">
                  <span>01 · discover</span>
                  <CopyButton
                    label="Copy"
                    value={discoverCommand}
                    variant="quiet"
                  />
                </div>
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-white/75">
                  <code>{discoverCommand}</code>
                </pre>
              </div>

              <div className="overflow-hidden rounded-lg border border-white/10 bg-black/60">
                <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3 text-[10px] tracking-wider text-white/50 uppercase">
                  <span>02 · pay + unlock</span>
                  <CopyButton label="Copy" value={command} variant="quiet" />
                </div>
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-white/75">
                  <code>{command}</code>
                </pre>
              </div>

              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["protocol", "x402 exact"],
                  ["network", "Base"],
                  ["asset", "USDC"],
                  ["response", "JSON"],
                ].map(([label, value]) => (
                  <div
                    className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                    key={label}
                  >
                    <dt className="text-[9px] tracking-wider text-white/50 uppercase">
                      {label}
                    </dt>
                    <dd className="mt-1 text-xs text-white/65">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="min-w-0 rounded-lg border border-white/10 bg-black/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold tracking-wider text-white/50 uppercase">
                  Paid response
                </h3>
                <span className="text-[10px] text-green-400">200</span>
              </div>
              <pre className="mt-4 overflow-x-auto text-[11px] leading-relaxed text-white/55">
                <code>{responsePreview}</code>
              </pre>
              <div className="mt-4 flex flex-wrap gap-3 border-t border-white/5 pt-4 text-xs text-white/50">
                <a
                  className="transition-colors hover:text-white"
                  href="/openapi.json"
                >
                  openapi.json
                </a>
                <a
                  className="transition-colors hover:text-white"
                  href="/llms.txt"
                >
                  llms.txt
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-4 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50">
          <div className="flex flex-wrap gap-4">
            <Link
              className="transition-colors hover:text-white/60"
              href="/activity"
            >
              Activity
            </Link>
            <Link
              className="transition-colors hover:text-white/60"
              href="#endpoints"
            >
              Demo endpoints
            </Link>
            <a
              className="transition-colors hover:text-white/60"
              href="/openapi.json"
            >
              OpenAPI
            </a>
            <a
              className="transition-colors hover:text-white/60"
              href="/llms.txt"
            >
              Agent instructions
            </a>
            <a
              className="transition-colors hover:text-white/60"
              href="https://agentcash.dev"
              target="_blank"
              rel="noreferrer"
            >
              AgentCash
            </a>
          </div>
          <span>pay-per-demo.vercel.app</span>
        </div>
      </footer>
    </main>
  );
}
