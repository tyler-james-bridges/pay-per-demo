import { headers } from "next/headers";
import Link from "next/link";

import { CopyButton } from "@/app/copy-button";
import { CommerceWorkflow } from "@/app/workflow";
import { demoPrice } from "@/lib/config";
import { demoEvent } from "@/lib/demo";
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
  const endpoint = `${origin}/api/demo`;
  const command = `npx agentcash@latest fetch ${endpoint}`;
  const discoverCommand = `npx agentcash@latest discover ${origin}`;
  const priceInCents = Number(demoPrice) * 100;
  const compactPrice = Number.isInteger(priceInCents)
    ? `${priceInCents}¢`
    : `$${demoPrice}`;
  const agentPrompt =
    `Attend ${demoEvent.name} for me. Use AgentCash at ${endpoint}. ` +
    `Spend no more than ${demoPrice} USDC on Base and return the confirmed admission and private join URL.`;
  const responsePreview = JSON.stringify(
    {
      admission: "confirmed",
      event: {
        name: demoEvent.name,
        date: demoEvent.date,
        attendance: demoEvent.attendance,
      },
      payment: {
        amount: demoPrice,
        currency: "USDC",
        network: "eip155:8453",
      },
      joinUrl: "https://••••••",
    },
    null,
    2,
  );
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: demoEvent.name,
    startDate: demoEvent.date,
    description:
      "Virtual admission purchased by an AI agent with a one-time USDC payment.",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: endpoint,
    },
    offers: {
      "@type": "Offer",
      price: demoPrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: endpoint,
    },
    url: origin,
  };
  const payee = process.env.EVM_PAYEE_ADDRESS;
  const settlement = payee
    ? await getLatestSettlement(payee).catch(() => null)
    : null;

  return (
    <main className="shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="topbar">
        <Link className="identity" href="/" aria-label="Pay Per Demo home">
          <span className="identity-mark">ppd</span>
          <span>pay per demo</span>
        </Link>
        <nav className="topbar-nav" aria-label="Service links">
          <a href="/llms.txt">agent view</a>
          <div className="service-state">
            <span className="state-dot" aria-hidden="true" />
            <span>accepting x402</span>
          </div>
        </nav>
      </header>

      <section className="intro conversion-hero">
        <div className="hero-copy">
          <p className="kicker">live service / virtual admission</p>
          <h1>
            Send your agent to Demo Day for{" "}
            <span className="price-accent">{compactPrice}.</span>
          </h1>
          <p className="lede">
            Skip the signup flow. Your agent discovers one paid endpoint,
            settles in USDC, and returns confirmed admission with the private
            join URL.
          </p>
          <div className="hero-actions">
            <CopyButton label="Copy prompt for my agent" value={agentPrompt} />
            <a className="secondary-action" href="#agent-command">
              Use AgentCash CLI
            </a>
            <CopyButton label="Copy link" value={origin} variant="secondary" />
          </div>
          <ul className="promise-list" aria-label="Service promises">
            <li>No account</li>
            <li>No API key</li>
            <li>No subscription</li>
          </ul>
        </div>

        <aside className="prompt-card" aria-labelledby="prompt-card-title">
          <header>
            <p className="panel-label">ready-to-send instruction</p>
            <span>human → agent</span>
          </header>
          <h2 id="prompt-card-title">Ask your agent, not another checkout.</h2>
          <blockquote>“{agentPrompt}”</blockquote>
          <footer>
            <span>max spend · {demoPrice} USDC</span>
            <a href="/llms.txt">agent instructions ↗</a>
          </footer>
        </aside>
      </section>

      <dl className="event-strip" aria-label="Event access details">
        <div>
          <dt>event</dt>
          <dd>{demoEvent.name}</dd>
        </div>
        <div>
          <dt>date</dt>
          <dd>
            <time dateTime={demoEvent.date}>July 16, 2026</time>
          </dd>
        </div>
        <div>
          <dt>attendance</dt>
          <dd>
            {demoEvent.attendance} · from {demoEvent.location}
          </dd>
        </div>
        <div>
          <dt>paid response unlocks</dt>
          <dd>Admission + private join URL</dd>
        </div>
      </dl>

      <div className="workspace" id="agent-command">
        <section className="request" aria-labelledby="endpoint-title">
          <header className="panel-heading">
            <div>
              <p className="panel-label">paid endpoint</p>
              <h2 id="endpoint-title">
                <span className="method">GET</span>
                <code>/api/demo</code>
              </h2>
            </div>
            <div className="price">
              <strong>${demoPrice}</strong>
              <span>USDC / request</span>
            </div>
          </header>

          <div className="command-stack">
            <div className="command-block">
              <div className="command-label">
                <span>01 · discover</span>
                <CopyButton
                  label="copy"
                  value={discoverCommand}
                  variant="quiet"
                />
              </div>
              <pre>
                <code>{discoverCommand}</code>
              </pre>
            </div>

            <div className="command-block">
              <div className="command-label">
                <span>02 · pay + attend</span>
                <CopyButton label="copy" value={command} variant="quiet" />
              </div>
              <pre>
                <code>{command}</code>
              </pre>
            </div>
          </div>

          <dl className="endpoint-meta">
            <div>
              <dt>protocol</dt>
              <dd>x402 exact</dd>
            </div>
            <div>
              <dt>network</dt>
              <dd>Base · eip155:8453</dd>
            </div>
            <div>
              <dt>asset</dt>
              <dd>USDC</dd>
            </div>
            <div>
              <dt>response</dt>
              <dd>application/json</dd>
            </div>
          </dl>
        </section>

        <aside className="response-card" aria-labelledby="response-title">
          <p className="panel-label">paid response</p>
          <h2 id="response-title">What comes back</h2>
          <p className="response-copy">
            The public schema is visible before payment. The private destination
            appears only after settlement succeeds.
          </p>
          <pre className="response-preview">
            <code>{responsePreview}</code>
          </pre>
          <div className="discovery-links">
            <a href="/openapi.json">openapi.json</a>
            <a href="/llms.txt">llms.txt</a>
          </div>
        </aside>
      </div>

      <CommerceWorkflow
        endpoint={endpoint}
        price={demoPrice}
        settlement={settlement}
      />

      <footer className="footer">
        <span>pay per demo</span>
        <span>@agentcash/router 1.18.0</span>
        <span>Base mainnet</span>
      </footer>
    </main>
  );
}
