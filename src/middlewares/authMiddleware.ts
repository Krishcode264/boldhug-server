import { Handler, NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { errReturn } from "../util/helper";
import { AutherizationError } from "../util/errors";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
   
    try {
      const verified = AuthService.verifyJwtToken(token);
    //  console.log("verifield",verified)
      req.body.user = verified;
      next();
    } catch (err) {
      next(err);
    }
  }else{
    throw new AutherizationError(" you token has expired need login","UNAUTHERISED")
  }
}
