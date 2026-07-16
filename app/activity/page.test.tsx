import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import ActivityPage from "@/app/activity/page";

const recipient = "0x0C9DaE48A198f2c0Ab3aB04223C45c98ECF154FB";
const originalPayee = process.env.EVM_PAYEE_ADDRESS;
const latestTransfer = {
  block_number: 48695450,
  from: { hash: "0xf617Eb3CF39E2a584a999b2E559e5653cBc61640" },
  method: "transferWithAuthorization",
  timestamp: "2026-07-16T05:37:27.000000Z",
  to: { hash: recipient },
  token: {
    address_hash: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: "6",
  },
  total: { value: "10000" },
  transaction_hash:
    "0x14c70a13b1acfd4174ba8a8e832f12cbd7f15c4223737856aeffe79f0a439f43",
};

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalPayee) process.env.EVM_PAYEE_ADDRESS = originalPayee;
  else delete process.env.EVM_PAYEE_ADDRESS;
});

describe("ActivityPage", () => {
  it("renders verified settlement links and totals", async () => {
    const previousTransfer = {
      ...latestTransfer,
      block_number: 48695394,
      timestamp: "2026-07-16T05:35:35.000000Z",
      transaction_hash:
        "0x99fa30a3bf0adcad788ec661c897349b4e38aaedefe8a1483f557ab8b3cfcda7",
    };
    process.env.EVM_PAYEE_ADDRESS = recipient;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [latestTransfer, previousTransfer] }),
      }),
    );

    const html = renderToStaticMarkup(await ActivityPage());

    expect(html).toContain("Paid request activity.");
    expect(html).toContain("0.02 USDC");
    expect(html).toContain("GET /api/demo");
    expect(html).toContain(
      `https://basescan.org/tx/${latestTransfer.transaction_hash}`,
    );
    expect(html).toContain(
      `https://basescan.org/tx/${previousTransfer.transaction_hash}`,
    );
  });
});
