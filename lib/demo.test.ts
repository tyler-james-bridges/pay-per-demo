import { randomBytes } from "node:crypto";

import { describe, expect, it } from "vitest";

import { createDemoAdmission, demoEvent } from "@/lib/demo";

const payment = {
  amount: "0.01",
  network: "eip155:8453",
  payer: `0x${randomBytes(20).toString("hex")}`,
};

describe("createDemoAdmission", () => {
  it("returns confirmed virtual admission after payment", () => {
    expect(createDemoAdmission(payment)).toEqual({
      admission: "confirmed",
      event: demoEvent,
      payment: { ...payment, currency: "USDC" },
    });
  });

  it("includes the configured join URL", () => {
    const joinUrl = "https://meet.google.com/landing";

    expect(createDemoAdmission(payment, joinUrl)).toMatchObject({
      admission: "confirmed",
      joinUrl,
    });
  });
});
