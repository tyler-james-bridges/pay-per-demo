import { z } from "zod";

export const demoEvent = {
  name: "Agentic Commerce Demo Day",
  date: "2026-07-16",
  location: "New York City",
  attendance: "virtual",
} as const;

type VerifiedPayment = {
  amount: string;
  network: string;
  payer: string;
};

export const demoAdmissionSchema = z.object({
  admission: z.literal("confirmed"),
  event: z.object({
    name: z.string(),
    date: z.iso.date(),
    location: z.string(),
    attendance: z.literal("virtual"),
  }),
  payment: z.object({
    amount: z.string(),
    currency: z.literal("USDC"),
    network: z.string(),
    payer: z.string(),
  }),
  joinUrl: z.url().optional(),
});

export function createDemoAdmission(
  payment: VerifiedPayment,
  joinUrl?: string,
) {
  return demoAdmissionSchema.parse({
    admission: "confirmed",
    event: demoEvent,
    payment: { ...payment, currency: "USDC" },
    ...(joinUrl ? { joinUrl } : {}),
  });
}
