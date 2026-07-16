import { describe, expect, it } from "vitest";

import { parseIndexedTransfer, parseTransferLog } from "@/lib/settlement";

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

const indexedTransfer = {
  block_number: 48695450,
  from: { hash: "0xf617Eb3CF39E2a584a999b2E559e5653cBc61640" },
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

describe("parseIndexedTransfer", () => {
  it("parses the latest indexed Base settlement", () => {
    expect(parseIndexedTransfer(indexedTransfer, recipient)).toEqual({
      amount: "0.01",
      blockNumber: 48695450,
      payer: indexedTransfer.from.hash,
      recipient,
      timestamp: "2026-07-16T05:37:27.000Z",
      transactionHash: indexedTransfer.transaction_hash,
    });
  });

  it("rejects a transfer for another token", () => {
    expect(() =>
      parseIndexedTransfer(
        {
          ...indexedTransfer,
          token: { ...indexedTransfer.token, address_hash: recipient },
        },
        recipient,
      ),
    ).toThrow("Unexpected indexed token");
  });
});
