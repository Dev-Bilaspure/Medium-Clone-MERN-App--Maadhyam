import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export const signupSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().nonempty("Confirm password is required"),
});

export const firstLastNameSchema = z
  .string()
  .regex(/^[A-Za-z]+$/, "First Name can only have engish lettters.")
  .nonempty("First name is required")
  .max(20);

export const usernameSchema = z
  .string()
  .min(3, "Min 3 characters.")
  .refine((value) => !/\s/.test(value), {
    message: "White spaces are not allowed.",
  });

export const bioSchema = z.string().max(160);

export const passwordSchema = z
  .string()
  .nonempty("Password is required")
  .min(6, "Password must be at least 6 characters long")
  .refine((value) => !/\s/.test(value), {
    message: "White spaces are not allowed.",
  });
