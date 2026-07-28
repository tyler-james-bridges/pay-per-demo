import { createRouterFromEnv, type RouterPlugin } from "@agentcash/router";

import { demoPrice, overflowPrice } from "@/lib/config";

const loggingPlugin: RouterPlugin = {
  onAlert(_context, alert) {
    const log = alert.level === "error" ? console.error : console.warn;
    log(`[router:${alert.route}] ${alert.message}`, alert.meta ?? "");
  },
  onError(_context, error) {
    console.error(
      `[router] ${error.status} ${error.message} (settled=${error.settled})`,
    );
  },
};

export const router = createRouterFromEnv({
  title: "Pay Per Demo",
  serviceName: "Pay Per Demo",
  description:
    "x402-gated virtual event access prototypes without accounts or subscriptions.",
  guidance:
    `GET /api/overflow costs $${overflowPrice} USDC and unlocks an unofficial prototype room. ` +
    `GET /api/demo costs $${demoPrice} USDC on Base via x402. ` +
    "Paid responses include the configured private URL.",
  tags: ["events", "virtual-attendance", "overflow", "x402", "base"],
  plugin: loggingPlugin,
});
