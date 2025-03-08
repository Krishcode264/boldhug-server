import { Router, Request, Response, NextFunction, Handler } from "express";
import { z } from "zod";
import { IdentifierSchema } from "../util/zod";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { BadRequestError } from "../util/errors";
export const authRouter = Router();

const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const safeInput = IdentifierSchema.safeParse(req.body.identifier);
    if (!safeInput.success) {
      throw new BadRequestError(safeInput.error.toString(), "VALIDATION_ERROR");
    }
    const user = await AuthService.login(safeInput.data);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const handleSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const safeInput = IdentifierSchema.safeParse(req.body.identifier);
    if (!safeInput.success) {
      throw new BadRequestError(safeInput.error.toString(), "VALIDATION_ERROR");
    }
    console.log(safeInput.data)
    const user = await AuthService.signup(safeInput.data);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const handleGenerateOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      throw new BadRequestError("identifier isnt there ", "VALIDATION_ERROR");
    }
    const isEmail = z.string().email().safeParse(identifier);
    const isPhoneNumber = z
      .number()
      .min(12)
      .safeParse(Number(identifier.split("+")[1]));

    const success = await AuthService.generateOTP(
      identifier,
      isEmail.success ? "email" : "phoneNumber"
    );
    res.send({ success });
  } catch (err) {
    next(err);
  }
};

const handleVerifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {otp,identifier}=req.body
    if(!otp && !identifier){
        throw new BadRequestError("Otp or identifier isnt present ","VALIDATION_ERROR")
    }
    const success=await AuthService.verifyOtp(otp,identifier)
    res.send({success})
  } catch (err) {
    next(err);
  }
};

const handleRefreshTOken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {refreshToken}=req.body
      if(!refreshToken){
          throw new BadRequestError("Resfreshtoken isnt presnt  ","VALIDATION_ERROR")
      }
      const success= AuthService.refreshToken(refreshToken)
      res.send({success})
    } catch (err) {
      next(err);
    }
  };

authRouter.use("/login", handleLogin);
authRouter.use("/signup", handleSignup);
authRouter.use("/otp/generate", handleGenerateOTP);
authRouter.use("/otp/verify", handleVerifyOTP);
authRouter.use("/refresh", handleRefreshTOken);
