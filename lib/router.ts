import { createRouterFromEnv, type RouterPlugin } from "@agentcash/router";

import { demoPrice } from "@/lib/config";

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
    "Pay once to attend Agentic Commerce Demo Day virtually, without an account or subscription.",
  guidance:
    `GET /api/demo costs $${demoPrice} USDC on Base via x402. ` +
    "The paid response confirms admission and includes the configured virtual join URL.",
  tags: ["events", "demos", "virtual-attendance", "x402", "base"],
  plugin: loggingPlugin,
});
