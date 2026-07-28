import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "@/app/page";
import { overflowNotice } from "@/lib/overflow";

vi.mock("next/headers", () => ({
  headers: async () =>
    new Headers([
      ["host", "localhost:3000"],
      ["x-forwarded-proto", "http"],
    ]),
}));

const originalBaseUrl = process.env.BASE_URL;
const originalPayee = process.env.EVM_PAYEE_ADDRESS;

afterEach(() => {
  if (originalBaseUrl) process.env.BASE_URL = originalBaseUrl;
  else delete process.env.BASE_URL;
  if (originalPayee) process.env.EVM_PAYEE_ADDRESS = originalPayee;
  else delete process.env.EVM_PAYEE_ADDRESS;
});

describe("Home", () => {
  it("presents overflow first and preserves the original demo second", async () => {
    delete process.env.BASE_URL;
    delete process.env.EVM_PAYEE_ADDRESS;

    const html = renderToStaticMarkup(await Home());
    const overflowPosition = html.indexOf("GET /api/overflow");
    const demoPosition = html.indexOf("GET /api/demo");

    expect(html).toContain(
      "An agent pays USDC over x402 and unlocks a private virtual event room.",
    );
    expect(html).toContain(overflowNotice);
    expect(overflowPosition).toBeGreaterThan(-1);
    expect(demoPosition).toBeGreaterThan(overflowPosition);
    expect(html).not.toContain('href="/overflow"');
  });
});
