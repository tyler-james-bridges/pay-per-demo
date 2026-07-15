# Pay Per Demo

An x402-gated virtual admission endpoint for Agentic Commerce Demo Day. A caller pays once in USDC on Base and receives confirmed admission without an account, API key, or subscription.

Built with Next.js and [`@agentcash/router`](https://github.com/merit-systems/agentcash-router).

## Endpoint

```text
GET /api/demo
```

An unpaid request receives HTTP `402` with the x402 challenge in the `PAYMENT-REQUIRED` header. A paid request receives the event, payer, payment, and optional join URL details.

Discovery is available at:

- `GET /openapi.json`
- `GET /llms.txt`

## Setup

Install dependencies and create your local environment file:

```bash
npm install
cp .env.example .env.local
```

Set these required values in `.env.local`:

- `EVM_PAYEE_ADDRESS`: Base wallet that receives USDC.
- `CDP_API_KEY_ID`: Coinbase Developer Platform facilitator key ID.
- `CDP_API_KEY_SECRET`: Coinbase Developer Platform facilitator secret.

Optional configuration:

- `DEMO_PRICE_USDC`: Defaults to `0.01`.
- `DEMO_JOIN_URL`: HTTPS URL returned only after successful payment.

Then run:

```bash
npm run dev
```

Call the paid endpoint with AgentCash:

```bash
npx agentcash fetch http://localhost:3000/api/demo
```

Inspect the unpaid challenge with curl:

```bash
curl -i http://localhost:3000/api/demo
```

## Verification

```bash
npm test
npm run lint
npm run format:check
npm run typecheck
npm run build
```
