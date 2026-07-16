import type { Metadata } from "next";
import Link from "next/link";

import { getRecentSettlements, type Settlement } from "@/lib/settlement";

export const metadata: Metadata = {
  title: "Transaction Activity | Pay Per Demo",
  description: "Verified x402 settlement activity for Pay Per Demo on Base.",
  alternates: { canonical: "/activity" },
  openGraph: {
    title: "Transaction Activity | Pay Per Demo",
    description: "Verified x402 settlement activity for Pay Per Demo on Base.",
    url: "/activity",
  },
};

function shorten(value: string) {
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function formatTimestamp(value: string) {
  return `${value.slice(0, 10)} ${value.slice(11, 19)} UTC`;
}

function totalVolume(settlements: Settlement[]) {
  return settlements
    .reduce((total, settlement) => total + Number(settlement.amount), 0)
    .toFixed(2);
}

export default async function ActivityPage() {
  const payee = process.env.EVM_PAYEE_ADDRESS;
  const settlements = payee
    ? await getRecentSettlements(payee, 25).catch(() => [])
    : [];
  const payers = new Set(
    settlements.map((settlement) => settlement.payer.toLowerCase()),
  ).size;

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-5xl px-4 pt-6">
        <div className="flex min-h-10 items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs text-white/50">
          <Link
            className="font-bold tracking-tight text-white transition-colors hover:text-white/70"
            href="/"
          >
            pay-per-demo
          </Link>
          <div className="flex items-center gap-4">
            <Link className="transition-colors hover:text-white" href="/">
              service
            </Link>
            <span className="flex items-center gap-2">
              <i
                className="h-1.5 w-1.5 rounded-full bg-green-400"
                aria-hidden="true"
              />
              Base mainnet
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 pt-12 pb-8 md:pt-20">
        <p className="text-[10px] font-bold tracking-[0.18em] text-white/50 uppercase">
          public settlement log
        </p>
        <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] md:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.045em] md:text-6xl">
              Paid request activity.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
              Each row is a verified USDC settlement to the Pay Per Demo wallet
              for <code>GET /api/demo</code>.
            </p>
          </div>
          <p className="text-xs leading-relaxed text-white/40 md:text-right">
            Indexed from Base. Transaction links open the canonical BaseScan
            proof.
          </p>
        </div>

        <dl className="mt-8 grid grid-cols-1 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] sm:grid-cols-3">
          <div className="border-b border-white/10 p-4 sm:border-r sm:border-b-0">
            <dt className="text-[9px] tracking-wider text-white/45 uppercase">
              Recent settlements
            </dt>
            <dd className="mt-2 text-2xl font-bold">{settlements.length}</dd>
          </div>
          <div className="border-b border-white/10 p-4 sm:border-r sm:border-b-0">
            <dt className="text-[9px] tracking-wider text-white/45 uppercase">
              Volume shown
            </dt>
            <dd className="mt-2 text-2xl font-bold text-green-400">
              {totalVolume(settlements)} USDC
            </dd>
          </div>
          <div className="p-4">
            <dt className="text-[9px] tracking-wider text-white/45 uppercase">
              Unique payers
            </dt>
            <dd className="mt-2 text-2xl font-bold">{payers}</dd>
          </div>
        </dl>
      </section>

      <section
        className="mx-auto max-w-5xl px-4 pb-16"
        aria-labelledby="log-title"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="log-title"
            className="text-xs font-bold tracking-wider text-white/50 uppercase"
          >
            Transactions
          </h2>
          <span className="text-[10px] text-white/35">newest first</span>
        </div>

        {settlements.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="hidden grid-cols-[1.45fr_1fr_1fr_0.7fr_0.9fr] gap-4 border-b border-white/10 px-4 py-3 text-[9px] tracking-wider text-white/40 uppercase md:grid">
              <span>Settled</span>
              <span>Request</span>
              <span>Payer</span>
              <span>Amount</span>
              <span className="text-right">Transaction</span>
            </div>
            <ol className="divide-y divide-white/10">
              {settlements.map((settlement) => (
                <li
                  className="grid grid-cols-2 gap-4 p-4 md:grid-cols-[1.45fr_1fr_1fr_0.7fr_0.9fr] md:items-center"
                  key={settlement.transactionHash}
                >
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-[9px] tracking-wider text-white/40 uppercase md:hidden">
                      Settled
                    </span>
                    <time
                      className="mt-1 block text-xs text-white/65 md:mt-0"
                      dateTime={settlement.timestamp}
                    >
                      {formatTimestamp(settlement.timestamp)}
                    </time>
                    <span className="mt-1 block text-[9px] text-white/35">
                      block {settlement.blockNumber.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-wider text-white/40 uppercase md:hidden">
                      Request
                    </span>
                    <code className="mt-1 block text-xs text-white/65 md:mt-0">
                      GET /api/demo
                    </code>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-wider text-white/40 uppercase md:hidden">
                      Payer
                    </span>
                    <code className="mt-1 block text-xs text-white/65 md:mt-0">
                      {shorten(settlement.payer)}
                    </code>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-wider text-white/40 uppercase md:hidden">
                      Amount
                    </span>
                    <strong className="mt-1 block text-xs text-green-400 md:mt-0">
                      {settlement.amount} USDC
                    </strong>
                  </div>
                  <a
                    className="self-end text-right text-xs text-green-400 transition-colors hover:text-green-300 md:self-auto"
                    href={`https://basescan.org/tx/${settlement.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shorten(settlement.transactionHash)} ↗
                  </a>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/50">
            Settlement activity is temporarily unavailable.
          </div>
        )}
      </section>

      <footer className="mx-auto max-w-5xl px-4 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[10px] text-white/40">
          <span>USDC settlements · Base mainnet</span>
          <Link className="transition-colors hover:text-white" href="/">
            Back to service →
          </Link>
        </div>
      </footer>
    </main>
  );
}
