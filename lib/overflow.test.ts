import { randomBytes } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createOverflowAccess,
  overflowEvent,
  overflowNotice,
} from "@/lib/overflow";

const payment = {
  amount: "0.01",
  network: "eip155:8453",
  payer: `0x${randomBytes(20).toString("hex")}`,
};
const roomUrl = "https://meet.google.com/landing";

describe("createOverflowAccess", () => {
  it("returns clearly labeled prototype access after payment", () => {
    expect(createOverflowAccess(payment, roomUrl)).toEqual({
      access: "prototype_confirmed",
      prototype: { official: false, notice: overflowNotice },
      event: overflowEvent,
      payment: { ...payment, currency: "USDC" },
      roomUrl,
    });
  });

  it("includes the configured private room without changing its role", () => {
    expect(createOverflowAccess(payment, roomUrl)).toMatchObject({
      access: "prototype_confirmed",
      prototype: { official: false },
      roomUrl,
    });
  });
});
