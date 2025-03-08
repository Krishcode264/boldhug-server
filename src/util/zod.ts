

import { z } from "zod";
import { AuthProvider } from "@prisma/client";

export const SignupSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  authProvider:z.nativeEnum(AuthProvider)
});


export const IdentifierSchema=z.union([
    z.string().email(),
    z.string().regex(/^\+\d{1,4}\d{10}$/, "Invalid phone number format")
])