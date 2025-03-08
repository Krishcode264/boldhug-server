import { NextFunction, Request, Response, Router } from "express";
import { AutherizationError } from "../util/errors";
import { UserService } from "../services/UserService";
export const userRouter = Router();

export const handleGetUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body?.user.id) {
      throw new AutherizationError("Unautherised", "need signup/ login ");
    }
    const user = await UserService.getUser(req.body.user.id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};
export const handleUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
  } catch (err) {
    next(err);
  }
};
export const handleDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const handleUpdateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const handleUpdatePhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const handleGetUserConvo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};

userRouter.use("/", handleGetUser);
