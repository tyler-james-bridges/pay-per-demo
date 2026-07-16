const BASE_RPC_URL = "https://mainnet.base.org";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

type RpcLog = {
  data: string;
  blockNumber: string;
  transactionHash: string;
  topics: string[];
};

export type Settlement = {
  amount: string;
  blockNumber: number;
  payer: string;
  recipient: string;
  timestamp: string;
  transactionHash: string;
};

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const response = await fetch(BASE_RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
    cache: "no-store",
  });
  const payload = await response.json();

  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message ?? "Base RPC request failed");
  }

  return payload.result as T;
}

function addressTopic(address: string) {
  return `0x${address.toLowerCase().slice(2).padStart(64, "0")}`;
}

export function parseTransferLog(log: RpcLog, recipient: string) {
  if (log.topics[0]?.toLowerCase() !== TRANSFER_TOPIC) {
    throw new Error("Unexpected USDC event");
  }

  const payerTopic = log.topics[1];
  const recipientTopic = log.topics[2];
  if (!payerTopic || !recipientTopic) {
    throw new Error("Transfer log is missing indexed addresses");
  }
  if (recipientTopic.toLowerCase() !== addressTopic(recipient)) {
    throw new Error("Unexpected transfer recipient");
  }

  const payer = `0x${payerTopic.slice(-40)}`;
  const amount = Number(BigInt(log.data)) / 1_000_000;

  return {
    amount: amount.toFixed(2),
    blockNumber: Number(BigInt(log.blockNumber)),
    payer,
    recipient,
    transactionHash: log.transactionHash,
  };
}

export async function getLatestSettlement(
  recipient: string,
): Promise<Settlement | null> {
  const latestHex = await rpc<string>("eth_blockNumber", []);
  const latestBlock = Number(BigInt(latestHex));
  const fromBlock = `0x${Math.max(0, latestBlock - 5_000).toString(16)}`;
  const logs = await rpc<RpcLog[]>("eth_getLogs", [
    {
      address: USDC_ADDRESS,
      fromBlock,
      toBlock: "latest",
      topics: [TRANSFER_TOPIC, null, addressTopic(recipient)],
    },
  ]);

  const log = logs.at(-1);
  if (!log) return null;

  const transfer = parseTransferLog(log, recipient);
  const block = await rpc<{ timestamp: string }>("eth_getBlockByNumber", [
    log.blockNumber,
    false,
  ]);

  return {
    ...transfer,
    timestamp: new Date(Number(BigInt(block.timestamp)) * 1_000).toISOString(),
  };
}
