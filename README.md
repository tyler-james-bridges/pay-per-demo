# Pay Per Demo

An agent pays USDC over x402 and unlocks a private virtual event room. The home page presents the current overflow prototype first and preserves the original Agentic Commerce Demo Day flow as a reference.

Built with Next.js and [`@agentcash/router`](https://github.com/merit-systems/agentcash-router).

## Endpoint

| Priority  | Paid endpoint       | Experiment                             |
| --------- | ------------------- | -------------------------------------- |
| Current   | `GET /api/overflow` | July 29 virtual-overflow prototype     |
| Reference | `GET /api/demo`     | July 16 Agentic Commerce Demo Day flow |

An unpaid request receives HTTP `402` with the x402 challenge in the `PAYMENT-REQUIRED` header. A paid request receives its experiment-specific event, payer, payment, and private URL details.

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

- `DEMO_PRICE_USDC`: Price for the original `/api/demo`; defaults to `0.01`.
- `DEMO_JOIN_URL`: HTTPS URL returned only after successful payment.
- `OVERFLOW_ROOM_URL`: Private room for `/api/overflow`. Falls back to `DEMO_JOIN_URL`.

The `/api/overflow` price is fixed at `0.01` USDC.
Without a configured room, it returns HTTP `503` without issuing a payment challenge.

Then run:

```bash
npm run dev
```

Call the paid endpoint with AgentCash:

```bash
npx agentcash fetch http://localhost:3000/api/demo
npx agentcash fetch http://localhost:3000/api/overflow
```

Inspect the unpaid challenge with curl:

```bash
curl -i http://localhost:3000/api/demo
```

## Recording Demo

Each recording-safe demo performs a real `$0.01` production payment, prints a redacted result, and opens the paid destination without exposing its URL:

```bash
npm run demo
npm run demo:overflow
```

## Verification

```bash
npm test
npm run lint
npm run format:check
npm run typecheck
npm run build
```
