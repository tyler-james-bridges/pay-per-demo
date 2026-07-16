import { describe, expect, it } from "vitest";

import { parseTransferLog } from "@/lib/settlement";

const recipient = "0x0C9DaE48A198f2c0Ab3aB04223C45c98ECF154FB";
const transferLog = {
  data: "0x0000000000000000000000000000000000000000000000000000000000002710",
  blockNumber: "0x2e6dd23",
  transactionHash:
    "0xe01840f4e7b86ed76cbc368ccf8384b86e57e27397b3e3f476d14b68444af9c6",
  topics: [
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    "0x000000000000000000000000f617eb3cf39e2a584a999b2e559e5653cbc61640",
    "0x0000000000000000000000000c9dae48a198f2c0ab3ab04223c45c98ecf154fb",
  ],
};

describe("parseTransferLog", () => {
  it("parses the real Base USDC transfer shape", () => {
    expect(parseTransferLog(transferLog, recipient)).toEqual({
      amount: "0.01",
      blockNumber: 48684323,
      payer: "0xf617eb3cf39e2a584a999b2e559e5653cbc61640",
      recipient,
      transactionHash:
        "0xe01840f4e7b86ed76cbc368ccf8384b86e57e27397b3e3f476d14b68444af9c6",
    });
  });

  it("rejects a malformed transfer log", () => {
    expect(() =>
      parseTransferLog(
        { ...transferLog, topics: transferLog.topics.slice(0, 2) },
        recipient,
      ),
    ).toThrow("missing indexed addresses");
  });

  it("rejects a transfer to another recipient", () => {
    expect(() =>
      parseTransferLog(
        transferLog,
        "0x0000000000000000000000000000000000000000",
      ),
    ).toThrow("Unexpected transfer recipient");
  });
});
