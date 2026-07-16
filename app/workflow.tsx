"use client";

import { useState, type CSSProperties } from "react";

import type { Settlement } from "@/lib/settlement";

type CommerceWorkflowProps = {
  endpoint: string;
  price: string;
  settlement: Settlement | null;
};

const steps = [
  ["Discover", "OpenAPI + llms.txt"],
  ["Request", "GET /api/demo"],
  ["Challenge", "402 · terms returned"],
  ["Settle", "USDC on Base"],
  ["Fulfill", "200 · admission"],
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

  return (
    <section className="commerce-workflow" aria-labelledby="workflow-title">
      <header className="workflow-heading">
        <div>
          <p className="panel-label">live commerce trace</p>
          <h2 id="workflow-title">One intent crosses the whole stack.</h2>
        </div>
        <button type="button" onClick={() => setRun((value) => value + 1)}>
          Replay flow
        </button>
      </header>

      <div className="actor-grid">
        <article className="actor-node actor-human">
          <span>01 · Human</span>
          <strong>“Attend this demo.”</strong>
          <p>Delegates the task instead of creating another account.</p>
        </article>
        <article className="actor-node actor-agent">
          <span>02 · Agent</span>
          <strong>Discovers, pays, returns.</strong>
          <code>{endpoint}</code>
        </article>
        <article className="actor-node actor-host">
          <span>03 · Host</span>
          <strong>Sells access per request.</strong>
          <p>Receives USDC directly in a dedicated wallet.</p>
        </article>
      </div>

      <div className="flow-stage" key={run}>
        <div className="flow-packet" aria-hidden="true">
          $0.01
        </div>
        <ol className="flow-steps">
          {steps.map(([title, detail], index) => (
            <li key={title} style={{ "--step": index } as CSSProperties}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <code>{detail}</code>
            </li>
          ))}
        </ol>
      </div>

      <div className="workflow-outcome">
        <div>
          <span>Agent returns</span>
          <strong>Admission + private join URL</strong>
        </div>
        <div className="value-transfer">
          <span>{price} USDC</span>
          <span aria-hidden="true">→</span>
        </div>
        <div>
          <span>Host receives</span>
          <strong>Onchain revenue on Base</strong>
        </div>
      </div>

      <footer className="settlement-proof">
        <div>
          <span className="proof-status">
            {settlement ? <i aria-hidden="true" /> : null} Latest settlement
          </span>
          {settlement ? (
            <strong>{settlement.amount} USDC confirmed on Base</strong>
          ) : (
            <strong>Settlement data is temporarily unavailable</strong>
          )}
        </div>
        {settlement ? (
          <dl>
            <div>
              <dt>flow</dt>
              <dd>
                {shorten(settlement.payer)} → {shorten(settlement.recipient)}
              </dd>
            </div>
            <div>
              <dt>block</dt>
              <dd>{settlement.blockNumber.toLocaleString("en-US")}</dd>
            </div>
            <div>
              <dt>time</dt>
              <dd>{formatTimestamp(settlement.timestamp)}</dd>
            </div>
            <div>
              <dt>proof</dt>
              <dd>
                <a
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
    </section>
  );
}
