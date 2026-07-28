import { randomBytes } from "node:crypto";

import type { ServiceRouter } from "@agentcash/router";
import { beforeAll, describe, expect, it, vi } from "vitest";

let router: ServiceRouter;

beforeAll(async () => {
  process.env.BASE_URL = "http://localhost:3000";
  process.env.EVM_PAYEE_ADDRESS = `0x${randomBytes(20).toString("hex")}`;
  process.env.CDP_API_KEY_ID = randomBytes(16).toString("hex");
  process.env.CDP_API_KEY_SECRET = randomBytes(32).toString("hex");
  process.env.OVERFLOW_ROOM_URL = "https://meet.google.com/landing";

  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(null, { status: 503 })),
  );

  router = (await import("@/lib/router")).router;
  await import("@/lib/routes");
});

describe("Pay Per Demo router", () => {
  it("challenges unpaid demo requests with x402", async () => {
    const response = await router.fetch(
      new Request("http://localhost:3000/api/demo"),
    );

    expect(response.status).toBe(402);
    expect(response.headers.get("payment-required")).toBeTruthy();
  });

  it("publishes the demo endpoint through OpenAPI discovery", async () => {
    const response = await router.fetch(
      new Request("http://localhost:3000/api/openapi.json"),
    );
    const document = await response.json();

    expect(response.status).toBe(200);
    expect(document.paths).toHaveProperty("/api/demo");
  });

  it("challenges unpaid overflow requests with x402", async () => {
    const response = await router.fetch(
      new Request("http://localhost:3000/api/overflow"),
    );

    expect(response.status).toBe(402);
    const encoded = response.headers.get("payment-required");
    expect(encoded).toBeTruthy();

    const challenge = JSON.parse(
      Buffer.from(encoded as string, "base64").toString("utf8"),
    );
    expect(challenge.accepts[0]).toMatchObject({
      amount: "10000",
      network: "eip155:8453",
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    });
  });

  it("publishes the overflow endpoint without replacing the original", async () => {
    const response = await router.fetch(
      new Request("http://localhost:3000/api/openapi.json"),
    );
    const document = await response.json();

    expect(document.paths).toHaveProperty("/api/demo");
    expect(document.paths).toHaveProperty("/api/overflow");
  });
});
