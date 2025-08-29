import { z } from "zod";

export const calculationSchema = z.object({
  originalAmount: z.number().min(0),
  vatRate: z.number().min(0).max(100),
  calculationType: z.enum(["add", "remove"]),
  vatAmount: z.number(),
  finalAmount: z.number(),
  timestamp: z.number(),
});

export const vatRateSchema = z.object({
  rate: z.number().min(0).max(100),
  label: z.string(),
});

export type Calculation = z.infer<typeof calculationSchema>;
export type VATRate = z.infer<typeof vatRateSchema>;

export const defaultVATRates: VATRate[] = [
  { rate: 20, label: "20% (Standard UK Rate)" },
  { rate: 5, label: "5% (Reduced Rate)" },
  { rate: 0, label: "0% (Zero Rate)" },
];
