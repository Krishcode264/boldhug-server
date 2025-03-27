import { Router, Request, Response, NextFunction, Handler } from "express";
import { z } from "zod";
import { IdentifierSchema } from "../util/zod";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { AutherizationError, BadRequestError } from "../util/errors";
import { prisma } from "../services/DBService/client";
export const authRouter = Router();

const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const safeInput = IdentifierSchema.safeParse(req.body.identifier);
    const { authAction } = req.body;
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
    console.log(safeInput.data);
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
    const { identifier, authAction } = req.body;
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

    console.log(success, "serve r");
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
    const { otp, identifier } = req.body;
    if (!otp && !identifier) {
      throw new BadRequestError(
        "Otp or identifier isnt present ",
        "VALIDATION_ERROR"
      );
    }
    const success = await AuthService.verifyOtp(otp, identifier);
    const userpayload=await AuthService.signup(identifier)
    res.send({ success,...userpayload });
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
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AutherizationError(
        "refresh token expired too need login now ",
        "UNAUTHERISED"
      );
    }
    const success = AuthService.refreshToken(refreshToken);
    res.send(success);
  } catch (err) {
    //next(err);
    throw new AutherizationError(
      "refresh token expired too need login now ",
      "UNAUTHERISED"
    );
  }
};

const handlePreAuthCheck = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { identifier, authAction } = req.body;
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { mobileNo: identifier }] },
    });

    if(user){
        res.send({isExists:true})
        return
    }
    res.send({isExists:false})
    return
  } catch (err) {
    next(err)
  }
};

authRouter.use("/login", handleLogin);
authRouter.use("/signup", handleSignup);
authRouter.post("/otp/generate", handleGenerateOTP);
authRouter.post("/otp/verify", handleVerifyOTP);
authRouter.use("/refresh", handleRefreshTOken);
authRouter.post("/precheck", handlePreAuthCheck);
