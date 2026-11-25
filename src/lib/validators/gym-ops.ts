import { z } from "zod";

export const memberUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{8,16}$/, "Valid phone number required"),
  email: z.string().trim().email().optional().or(z.literal("")),
  gender: z.string().trim().max(20).optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  emergencyContact: z.string().trim().max(120).optional().or(z.literal("")),
  photoUrl: z.string().trim().optional().or(z.literal("")),
  photoKey: z.string().trim().optional().or(z.literal("")),
  goal: z.string().trim().max(120).optional().or(z.literal("")),
  healthNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.string().trim().max(40).default("walk-in"),
  assignedTrainerId: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "EXPIRED", "FROZEN", "CANCELLED"]).default("ACTIVE"),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  initialPlanId: z.string().optional().or(z.literal("")),
});

export const assignMembershipSchema = z.object({
  memberId: z.string().min(1),
  planId: z.string().min(1),
  discount: z.coerce.number().int().min(0).default(0),
  amountPaid: z.coerce.number().int().min(0).default(0),
  paymentMethod: z.enum(["CASH", "UPI", "CARD"]).default("CASH"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const manualPaymentSchema = z.object({
  memberId: z.string().min(1),
  membershipId: z.string().optional().nullable(),
  amount: z.coerce.number().int().min(1, "Amount must be at least ₹1"),
  method: z.enum(["CASH", "UPI", "CARD"]),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const bodyMeasurementSchema = z.object({
  memberId: z.string().min(1),
  weight: z.coerce.number().positive().optional(),
  height: z.coerce.number().positive().optional(),
  bodyFat: z.coerce.number().min(1).max(75).optional(),
  chest: z.coerce.number().positive().optional(),
  waist: z.coerce.number().positive().optional(),
  hips: z.coerce.number().positive().optional(),
  arms: z.coerce.number().positive().optional(),
  thighs: z.coerce.number().positive().optional(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const csvMemberRowSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{8,16}$/),
  email: z.string().trim().email().optional().or(z.literal("")),
  gender: z.string().trim().optional().or(z.literal("")),
  goal: z.string().trim().optional().or(z.literal("")),
  source: z.string().trim().optional().or(z.literal("")),
});
