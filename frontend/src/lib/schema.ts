import { z } from "zod";

export const formSchema = z.object({
  name: z.string().trim().min(2, "Name is too short.").max(20, "Name is too long."),
  email: z.string().trim().toLowerCase().email("Invalid Email"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password can't exceed 50 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

export type UserFormSchema = z.infer<typeof formSchema>

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid Email"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password can't exceed 50 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
});

export type LoginFormSchema = z.infer<typeof loginSchema>