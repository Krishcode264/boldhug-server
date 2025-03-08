import { object } from "zod";
import { prisma } from "../services/DBService/client";

export const errReturn = (err: any, code: string) => {
  if (err as typeof Error) {
    return err.message;
  }
  return code;
};

export function excludeStuff<T extends Record<string, any>>(modelFields: T, excludeFields: string[]) {
    return Object.fromEntries(
      Object.keys(modelFields).map((key) => [key, !excludeFields.includes(key)])
    );
  }
  


