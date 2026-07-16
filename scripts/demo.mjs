#!/usr/bin/env node

import { spawn } from "node:child_process";
import process from "node:process";
import { pathToFileURL } from "node:url";

const endpoint = "https://pay-per-demo.vercel.app/api/demo";
const origin = new URL(endpoint).origin;

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function section(label) {
  console.log(`\n${label}`);
  console.log("-".repeat(label.length));
}

function capture(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "inherit"],
    });
    let output = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => (output += chunk));
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

export function summarizeDiscovery(result) {
  const discovery = result.data ?? result;
  const route = discovery.endpoints?.[0];
  if (!discovery.found || !route) {
    throw new Error("AgentCash did not discover the paid route");
  }

  return {
    source: discovery.source,
    trustTier: discovery.trustTier,
    title: discovery.info.title,
    method: route.method,
    path: route.path,
    authMode: route.authMode,
    price: route.price,
    protocol: route.protocols[0],
  };
}

export function summarizeResult(result) {
  if (!result?.success) {
    throw new Error(result?.error?.message ?? "AgentCash payment failed");
  }

  const joinUrl = new URL(result.data.joinUrl);
  if (joinUrl.protocol !== "https:") {
    throw new Error("Paid destination must use HTTPS");
  }

  return {
    joinUrl: joinUrl.toString(),
    summary: {
      admission: result.data.admission,
      event: result.data.event.name,
      amount: result.data.payment.amount,
      currency: result.data.payment.currency,
      network: result.data.payment.network,
      transactionHash: result.metadata.payment.transactionHash,
    },
  };
}

async function probePayment() {
  const response = await fetch(endpoint);
  const encoded = response.headers.get("payment-required");
  if (response.status !== 402 || !encoded) {
    throw new Error("Endpoint did not return an x402 challenge");
  }

  const challenge = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  const accept = challenge.accepts[0];

  return {
    status: response.status,
    amount: Number(accept.amount) / 1_000_000,
    network: accept.network,
  };
}

function openPaidDestination(joinUrl) {
  const child = spawn(
    "open",
    ["-na", "Google Chrome", "--args", `--app=${joinUrl}`],
    { detached: true, stdio: "ignore" },
  );
  child.unref();
}

async function main() {
  console.clear();
  console.log("PAY PER DEMO");
  console.log("agent -> x402 -> Base -> admission");
  console.log("\nStarting live flow in 3 seconds...");
  await sleep(3_000);

  section("01 / DISCOVER");
  console.log(`$ agentcash discover ${origin}`);
  const discoveryOutput = await capture("npx", [
    "agentcash@latest",
    "discover",
    origin,
    "--format",
    "json",
  ]);
  const discovery = summarizeDiscovery(JSON.parse(discoveryOutput));
  console.log(`${discovery.title} via ${discovery.source}`);
  console.log(`${discovery.method} ${discovery.path}`);
  console.log(
    `${discovery.authMode} | ${discovery.protocol} | ${discovery.price}`,
  );
  console.log(`Trust: ${discovery.trustTier}`);
  await sleep(1_500);

  section("02 / CHALLENGE");
  const challenge = await probePayment();
  console.log(`HTTP ${challenge.status} Payment Required`);
  console.log(`Price: $${challenge.amount.toFixed(2)} USDC`);
  console.log(`Network: ${challenge.network} (Base)`);
  await sleep(1_500);

  section("03 / PAY + ATTEND");
  console.log("AgentCash is signing and settling the x402 payment...");
  const output = await capture("npx", [
    "agentcash@latest",
    "fetch",
    endpoint,
    "--yes",
    "--payment-protocol",
    "x402",
    "--payment-network",
    "base",
    "--max-amount",
    "0.01",
    "--format",
    "json",
  ]);

  const { joinUrl, summary } = summarizeResult(JSON.parse(output));
  console.log("HTTP 200 Admission Confirmed");
  console.log(`Event: ${summary.event}`);
  console.log(`Payment: $${summary.amount} ${summary.currency} on Base`);
  console.log(`BaseScan: https://basescan.org/tx/${summary.transactionHash}`);
  await sleep(2_000);

  section("04 / FULFILL");
  console.log("Opening the paid destination without exposing its URL...");
  console.log("No signup. No API key. No subscription.");
  await sleep(1_500);
  openPaidDestination(joinUrl);

  section("@agentcash/router");
  console.log("x402 now. MPP, SIWX, sessions, and metering when needed.");
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  main().catch((error) => {
    console.error(`\nDemo failed: ${error.message}`);
    process.exitCode = 1;
  });
}
