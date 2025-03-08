import { User } from "@prisma/client";

export type UpdateUser = Pick<User, "userName" >;

export type OtpEntry = {
  otp: number;
  isVarified: boolean;
};

//bissness layer return type eheh

export type BLRT =Promise<{
  data?:any,
  error?:string,
  success:boolean
}>