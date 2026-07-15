import { headers } from "next/headers";
import Link from "next/link";

import { demoPrice } from "@/lib/config";
import { demoEvent } from "@/lib/demo";

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
  const command = `npx agentcash fetch ${origin}/api/demo`;

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="identity" href="/" aria-label="Pay Per Demo home">
          <span className="identity-mark">ppd</span>
          <span>pay per demo</span>
        </Link>
        <div className="service-state">
          <span className="state-dot" aria-hidden="true" />
          <span>accepting x402</span>
        </div>
      </header>

      <section className="intro">
        <p className="kicker">service / virtual-admission</p>
        <h1>{demoEvent.name}</h1>
        <p className="lede">
          A single paid endpoint for agents attending on behalf of their human
          operators. No account, API key, or recurring subscription.
        </p>
      </section>

      <div className="workspace">
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

          <div className="command-block">
            <div className="command-label">
              <span>agentcash</span>
              <span>automatic payment</span>
            </div>
            <pre>
              <code>{command}</code>
            </pre>
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

        <aside className="manifest" aria-labelledby="manifest-title">
          <p className="panel-label">event manifest</p>
          <h2 id="manifest-title">Access details</h2>
          <dl>
            <div>
              <dt>event</dt>
              <dd>{demoEvent.name}</dd>
            </div>
            <div>
              <dt>date</dt>
              <dd>July 16, 2026</dd>
            </div>
            <div>
              <dt>origin</dt>
              <dd>{demoEvent.location}</dd>
            </div>
            <div>
              <dt>attendance</dt>
              <dd>{demoEvent.attendance}</dd>
            </div>
            <div>
              <dt>delivery</dt>
              <dd>Paid response</dd>
            </div>
          </dl>
          <div className="discovery-links">
            <a href="/openapi.json">openapi.json</a>
            <a href="/llms.txt">llms.txt</a>
          </div>
        </aside>
      </div>

      <section className="lifecycle" aria-labelledby="lifecycle-title">
        <header>
          <p className="panel-label">request lifecycle</p>
          <h2 id="lifecycle-title">What the agent handles</h2>
        </header>
        <ol>
          <li>
            <span>01</span>
            <div>
              <strong>Request</strong>
              <p>The agent calls the demo endpoint.</p>
            </div>
            <code>GET /api/demo</code>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Challenge</strong>
              <p>The service returns the price and Base payment terms.</p>
            </div>
            <code>402 payment-required</code>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Payment</strong>
              <p>AgentCash signs the USDC authorization and retries.</p>
            </div>
            <code>${demoPrice} USDC · Base</code>
          </li>
          <li>
            <span>04</span>
            <div>
              <strong>Admission</strong>
              <p>
                The response confirms access and includes the configured join
                URL.
              </p>
            </div>
            <code>200 application/json</code>
          </li>
        </ol>
      </section>

      <footer className="footer">
        <span>pay per demo</span>
        <span>@agentcash/router 1.18.0</span>
        <span>Base mainnet</span>
      </footer>
    </main>
  );
}
