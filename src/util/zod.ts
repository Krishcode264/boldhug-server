import { array, number, string, z } from "zod";
import { AuthProvider, ParentType } from "@prisma/client";

export const SignupSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  authProvider: z.nativeEnum(AuthProvider),
});

export const UpdateUserSchema = z.object({
  userName: z.string().nullable(), // ✅ Allows null as well
  gender: z.string().nullable(),

  age: z.number().nullable(),
});
export const IdentifierSchema = z.union([
  z.string().email(),
  z.string().regex(/^\+\d{1,4}\d{10}$/, "Invalid phone number format"),
]);

const MediaTypeSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  type: z.string().min(1, "File type is required"),
});

export const MediaArrayTypeSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  data: z.array(MediaTypeSchema).min(1, "At least one media file is required"),
  mediaGroupId: z.string().min(1, "Media group ID is required"),
  mediaGroupType: z.enum(["post", "event", "message"]),
});

export const ConfirmMediaUploadSchema = z.object({
  data: z.array(
    z.object({
      key: z.string().min(1, "Key is required"), // Ensures key is a non-empty string
      type: z.enum(["video", "image", "file"]), // Ensures type is one of the three valid options
    })
  ),
  mediaGroupId: z.string().uuid("Invalid mediaGroupId format"), // Ensures mediaGroupId is a valid UUID
  parentType: z.nativeEnum(ParentType), // Assumes ParentType is a TypeScript enum
});

export const EventSchema = z.object({
  createdBy: z.string().min(1, "CreatedBy is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  slots: z.number().positive("Slots must be a positive number"),
  reservedSlots: z
    .number()
    .min(0, "Reserved slots must be at least 0")
    .nullable(),
  location: z.string().min(1, "Location is required"),
  coords: z.string().nullable().optional(), // Can be null
  date: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date()
  ),
  time: z.string(),
});
export type EventType = z.infer<typeof EventSchema>;
