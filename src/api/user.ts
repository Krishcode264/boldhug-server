import { NextFunction, Request, Response, Router } from "express";
import { AutherizationError, BadRequestError } from "../util/errors";
import { UserService } from "../services/UserService";

import { prisma } from "../services/DBService/client";
import { AwsHandler } from "../services/AwsService";
import { UpdateUserSchema } from "../util/zod";
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
    console.log("handle update user is here ", req.body);
    const { userName, gender, age } = req.body.data;
    //const parsedUser = UpdateUserSchema.safeParse(req.body.data);
    // if (!parsedUser.data) {
    //   throw new BadRequestError("bad data", parsedUser.error.errors.toString());
    // }
    const updatedUser = await UserService.updateUserProfile(req.body.user.id, {
      userName,
      gender,
      age,
    });
    res.send({ ...updatedUser });
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

export const handleIsQuique = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName } = req.query;
    console.log(req.params);
    if (!userName) throw new BadRequestError("username is not present");
    const user = await prisma.user.findUnique({
      where: { userName: userName.toString().toLowerCase() },
    });
    if (user) {
      res.send({ isUnique: false });
      return;
    }
    res.send({ isUnique: true });
  } catch (err) {
    next(err);
  }
};

const getPresignedUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body.user;
  const { fileName, type } = req.query;
  if (!id || !fileName)
    throw new BadRequestError("filename not present as get presignedurl ");
  try {
    let key = `users/${id}/${Date.now()}_${fileName}`;
    const uri = await AwsHandler.getPresignedUrlFromS3(key, type);
    res.send({ url: uri, key });
  } catch (err) {
    next(err);
  }
};
const confirmUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body.user;
  const { key } = req.body;

  try {
    //console.log("here is key at confirom",key)

            
    const uri = await AwsHandler.getObjectUrl(key, 604800); //7 days
    const newExpirationTime = new Date(Date.now() + 604800 * 1000 - 600000); // 7 days - 10 min
    const result = await prisma.$transaction(async (prisma) => {
      const media = await prisma.attachment.create({
        data: {
          userId: id,
          url: uri,
          type: "image",
          key: key,
          parentType: "profile_photo",
          expiresAt: newExpirationTime,
        },
      });

      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: { profilePhotoId: media.id },
      });

      return { media, updatedUser };
    });

    res.send({ url: result.media.url, id: result.media.url });
  } catch (err) {
    next(err);
  }
};
userRouter.post("/profile-photo/confirm", confirmUpload);
userRouter.get("/profile-photo/upload-url", getPresignedUrl);
userRouter.get("/unique", handleIsQuique);
userRouter.get("/", handleGetUser);
userRouter.patch("/", handleUpdateUser);
