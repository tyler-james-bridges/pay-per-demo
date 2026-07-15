import { z } from "zod";

const priceSchema = z.string().regex(/^\d+(\.\d+)?$/, "Must be a USDC amount");
const httpsUrlSchema = z.url().refine((value) => value.startsWith("https://"), {
  message: "DEMO_JOIN_URL must use HTTPS",
});

export const demoPrice = priceSchema.parse(
  process.env.DEMO_PRICE_USDC?.trim() || "0.01",
);

const joinUrl = process.env.DEMO_JOIN_URL?.trim();
export const demoJoinUrl = joinUrl ? httpsUrlSchema.parse(joinUrl) : undefined;
