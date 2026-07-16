const BASE_RPC_URL = "https://mainnet.base.org";
const BLOCKSCOUT_API_URL = "https://base.blockscout.com/api/v2";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

type RpcLog = {
  data: string;
  blockNumber: string;
  transactionHash: string;
  topics: string[];
};

type IndexedTransfer = {
  block_number: number;
  from: { hash: string };
  method: string | null;
  timestamp: string;
  to: { hash: string };
  token: { address_hash: string; decimals: string };
  total: { value: string };
  transaction_hash: string;
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

function formatTokenAmount(value: string, decimals: number) {
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("Invalid token decimals");
  }

  const raw = BigInt(value);
  if (decimals === 0) return raw.toString();

  const padded = raw.toString().padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals);
  const fraction = padded.slice(-decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
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
  return {
    amount: formatTokenAmount(BigInt(log.data).toString(), 6),
    blockNumber: Number(BigInt(log.blockNumber)),
    payer,
    recipient,
    transactionHash: log.transactionHash,
  };
}

export function parseIndexedTransfer(
  transfer: IndexedTransfer,
  recipient: string,
): Settlement {
  if (
    transfer.token.address_hash.toLowerCase() !== USDC_ADDRESS.toLowerCase()
  ) {
    throw new Error("Unexpected indexed token");
  }
  if (transfer.to.hash.toLowerCase() !== recipient.toLowerCase()) {
    throw new Error("Unexpected indexed recipient");
  }
  if (transfer.method !== "transferWithAuthorization") {
    throw new Error("Unexpected indexed method");
  }

  const timestamp = new Date(transfer.timestamp);
  if (Number.isNaN(timestamp.getTime())) throw new Error("Invalid timestamp");

  return {
    amount: formatTokenAmount(
      transfer.total.value,
      Number(transfer.token.decimals),
    ),
    blockNumber: transfer.block_number,
    payer: transfer.from.hash,
    recipient,
    timestamp: timestamp.toISOString(),
    transactionHash: transfer.transaction_hash,
  };
}

async function getIndexedSettlements(recipient: string, limit: number) {
  const response = await fetch(
    `${BLOCKSCOUT_API_URL}/addresses/${encodeURIComponent(recipient)}/token-transfers?type=ERC-20`,
    { cache: "no-store" },
  );
  if (!response.ok) throw new Error("Blockscout request failed");

  const payload = (await response.json()) as { items?: IndexedTransfer[] };
  if (!Array.isArray(payload.items))
    throw new Error("Invalid Blockscout response");

  return payload.items
    .flatMap((item) => {
      try {
        return [parseIndexedTransfer(item, recipient)];
      } catch {
        return [];
      }
    })
    .sort((a, b) => b.blockNumber - a.blockNumber)
    .slice(0, limit);
}

async function getRecentRpcSettlement(
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

export async function getRecentSettlements(
  recipient: string,
  limit = 10,
): Promise<Settlement[]> {
  const boundedLimit = Math.max(1, Math.min(limit, 50));

  try {
    const indexed = await getIndexedSettlements(recipient, boundedLimit);
    if (indexed.length > 0) return indexed;
  } catch {
    const recent = await getRecentRpcSettlement(recipient);
    return recent ? [recent] : [];
  }

  const recent = await getRecentRpcSettlement(recipient);
  return recent ? [recent] : [];
}

export async function getLatestSettlement(recipient: string) {
  return (await getRecentSettlements(recipient, 1))[0] ?? null;
}
