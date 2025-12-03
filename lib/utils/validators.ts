import { z } from "zod";

// Email validation
export const emailSchema = z.string().email("Invalid email address");

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

// Phone number validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number");

// URL validation
export const urlSchema = z.string().url("Invalid URL");