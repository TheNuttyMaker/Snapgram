import { z } from "zod";

export const signinValidation = z.object({
    email: z.string().min(2),
    password: z.string().min(2).max(50),
  });

export const signupValidation = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50, {message: "Name must be at most 50 characters"}),
    username: z.string().min(2, { message: "Username must be at least 2 characters" }).max(50, {message: "Username must be at most 50 characters"}),
    email: z.string().min(2).max(50),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(50),
  });