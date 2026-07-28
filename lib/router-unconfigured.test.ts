import { randomBytes } from "node:crypto";

import type { ServiceRouter } from "@agentcash/router";
import { beforeAll, describe, expect, it, vi } from "vitest";

let router: ServiceRouter;

beforeAll(async () => {
  vi.resetModules();
  process.env.BASE_URL = "http://localhost:3000";
  process.env.EVM_PAYEE_ADDRESS = `0x${randomBytes(20).toString("hex")}`;
  process.env.CDP_API_KEY_ID = randomBytes(16).toString("hex");
  process.env.CDP_API_KEY_SECRET = randomBytes(32).toString("hex");
  delete process.env.DEMO_JOIN_URL;
  delete process.env.OVERFLOW_ROOM_URL;

  router = (await import("@/lib/router")).router;
  await import("@/lib/routes");
});

describe("unconfigured overflow route", () => {
  it("returns 503 without issuing a payment challenge", async () => {
    const response = await router.fetch(
      new Request("http://localhost:3000/api/overflow"),
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("payment-required")).toBeNull();
    await expect(response.json()).resolves.toEqual({
      error: "Virtual overflow room is not configured",
    });
  });

  it("keeps the original demo payment route available", async () => {
    const response = await router.fetch(
      new Request("http://localhost:3000/api/demo"),
    );

    expect(response.status).toBe(402);
    expect(response.headers.get("payment-required")).toBeTruthy();
  });
});
