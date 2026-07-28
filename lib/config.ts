import { z } from "zod";

const priceSchema = z.string().regex(/^\d+(\.\d+)?$/, "Must be a USDC amount");
const httpsUrlSchema = z.url().refine((value) => value.startsWith("https://"), {
  message: "Private room URLs must use HTTPS",
});

export const demoPrice = priceSchema.parse(
  process.env.DEMO_PRICE_USDC?.trim() || "0.01",
);
export const overflowPrice = "0.01";

const joinUrl = process.env.DEMO_JOIN_URL?.trim();
export const demoJoinUrl = joinUrl ? httpsUrlSchema.parse(joinUrl) : undefined;

export function getOverflowRoomUrl() {
  const roomUrl =
    process.env.OVERFLOW_ROOM_URL?.trim() || process.env.DEMO_JOIN_URL?.trim();
  return roomUrl ? httpsUrlSchema.parse(roomUrl) : undefined;
}
