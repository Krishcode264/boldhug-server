import { User } from "@prisma/client";

export type UpdateUser = Pick<User, "userName" | "password">;

export type OtpEntry = {
  otp: number;
  isVarified: boolean;
};
