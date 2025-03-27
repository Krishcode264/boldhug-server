import { NextFunction, Request, Response } from "express";
import { BaseError } from "../util/errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR", err);
  if (err instanceof BaseError) {
     res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    })
    return 
  }
   res.status(500).json({
    success: false,
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
  });
  return 
};
