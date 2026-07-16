import { describe, expect, it } from "vitest";

import { summarizeDiscovery, summarizeResult } from "./demo.mjs";

const paidResult = {
  success: true,
  data: {
    admission: "confirmed",
    event: { name: "Agentic Commerce Demo Day" },
    payment: {
      amount: "0.01",
      currency: "USDC",
      network: "eip155:8453",
    },
    joinUrl: "https://meet.google.com/abc-defg-hij",
  },
  metadata: {
    payment: { transactionHash: "0x1234" },
  },
};

const discoveryResult = {
  success: true,
  data: {
    found: true,
    source: "openapi",
    trustTier: "origin_hosted",
    info: { title: "Pay Per Demo" },
    endpoints: [
      {
        method: "GET",
        path: "/api/demo",
        authMode: "paid",
        price: "0.01 USD",
        protocols: ["x402"],
      },
    ],
  },
};

describe("summarizeDiscovery", () => {
  it("reduces AgentCash discovery to the recording fields", () => {
    expect(summarizeDiscovery(discoveryResult)).toEqual({
      source: "openapi",
      trustTier: "origin_hosted",
      title: "Pay Per Demo",
      method: "GET",
      path: "/api/demo",
      authMode: "paid",
      price: "0.01 USD",
      protocol: "x402",
    });
  });
});

describe("summarizeResult", () => {
  it("keeps the paid destination out of the printable summary", () => {
    const result = summarizeResult(paidResult);

    expect(result.joinUrl).toBe(paidResult.data.joinUrl);
    expect(JSON.stringify(result.summary)).not.toContain(
      paidResult.data.joinUrl,
    );
    expect(result.summary).toMatchObject({
      admission: "confirmed",
      amount: "0.01",
      network: "eip155:8453",
    });
  });

  it("rejects unsuccessful payments", () => {
    expect(() =>
      summarizeResult({ success: false, error: { message: "rejected" } }),
    ).toThrow("rejected");
  });
});
