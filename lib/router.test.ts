import { randomBytes } from "node:crypto";

import type { ServiceRouter } from "@agentcash/router";
import { beforeAll, describe, expect, it, vi } from "vitest";

let router: ServiceRouter;

beforeAll(async () => {
  process.env.BASE_URL = "http://localhost:3000";
  process.env.EVM_PAYEE_ADDRESS = `0x${randomBytes(20).toString("hex")}`;
  process.env.CDP_API_KEY_ID = randomBytes(16).toString("hex");
  process.env.CDP_API_KEY_SECRET = randomBytes(32).toString("hex");

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
});
