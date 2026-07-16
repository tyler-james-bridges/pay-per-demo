import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CommerceWorkflow } from "@/app/workflow";
import type { Settlement } from "@/lib/settlement";

const settlement: Settlement = {
  amount: "0.01",
  blockNumber: 48695450,
  payer: "0xf617eb3cf39e2a584a999b2e559e5653cbc61640",
  recipient: "0x0C9DaE48A198f2c0Ab3aB04223C45c98ECF154FB",
  timestamp: "2026-07-16T05:37:27.000Z",
  transactionHash:
    "0x14c70a13b1acfd4174ba8a8e832f12cbd7f15c4223737856aeffe79f0a439f43",
};

describe("CommerceWorkflow", () => {
  it("renders the verified settlement and BaseScan proof", () => {
    const html = renderToStaticMarkup(
      <CommerceWorkflow price="0.01" settlement={settlement} />,
    );

    expect(html).toContain("0.01 USDC confirmed on Base");
    expect(html).toContain("48,695,450");
    expect(html).toContain("2026-07-16 05:37 UTC");
    expect(html).toContain(
      `https://basescan.org/tx/${settlement.transactionHash}`,
    );
  });

  it("renders the protocol flow in order", () => {
    const html = renderToStaticMarkup(
      <CommerceWorkflow price="0.01" settlement={settlement} />,
    );

    const labels = ["Prompt", "402", "Pay", "Access"];

    expect(html).toContain("Protocol flow");
    expect(html).toContain("One prompt, one paid response.");
    expect(html).toContain("0.01 USDC · Base");
    expect(html).toContain("Private join URL");
    expect(html).not.toContain("Replay");
    labels.reduce((previousPosition, label) => {
      const position = html.indexOf(`>${label}<`);
      expect(position).toBeGreaterThan(previousPosition);
      return position;
    }, -1);
  });

  it("does not render proof when Base data is unavailable", () => {
    const html = renderToStaticMarkup(
      <CommerceWorkflow price="0.01" settlement={null} />,
    );

    expect(html).toContain("Settlement data is temporarily unavailable");
    expect(html).not.toContain("basescan.org/tx/");
  });
});
