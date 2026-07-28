import { z } from "zod";

export const overflowEvent = {
  name: "Merit Systems + Circle event",
  date: "2026-07-29",
  hosts: ["Merit Systems", "Circle"],
  attendance: "virtual overflow prototype",
  sourceUrl: "https://x.com/DavidPawlan/status/2082145160712921351",
} as const;

export const overflowNotice =
  "Independent prototype, not official Merit Systems or Circle event access.";

type VerifiedPayment = {
  amount: string;
  network: string;
  payer: string;
};

export const overflowAccessSchema = z.object({
  access: z.literal("prototype_confirmed"),
  prototype: z.object({
    official: z.literal(false),
    notice: z.string(),
  }),
  event: z.object({
    name: z.string(),
    date: z.iso.date(),
    hosts: z.array(z.string()),
    attendance: z.literal("virtual overflow prototype"),
    sourceUrl: z.url(),
  }),
  payment: z.object({
    amount: z.string(),
    currency: z.literal("USDC"),
    network: z.string(),
    payer: z.string(),
  }),
  roomUrl: z.url(),
});

export function createOverflowAccess(
  payment: VerifiedPayment,
  roomUrl: string,
) {
  return overflowAccessSchema.parse({
    access: "prototype_confirmed",
    prototype: { official: false, notice: overflowNotice },
    event: overflowEvent,
    payment: { ...payment, currency: "USDC" },
    roomUrl,
  });
}
