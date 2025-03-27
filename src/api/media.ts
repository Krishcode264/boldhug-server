import { NextFunction, Router } from "express";
import { ConfirmMediaUploadSchema, MediaArrayTypeSchema } from "../util/zod";
import { Request, Response } from "express";
import { MediaService } from "../services/MediaService";
import { BadRequestError } from "../util/errors";

export const mediaRouter = Router();

const handleGetPresignedUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, mediaGroupType, mediaGroupId } = req.body;
    const { id } = req.body.user;
    const isvalidSchema = MediaArrayTypeSchema.safeParse({
      data,
      id,
      mediaGroupId,
      mediaGroupType,
    });

  //  console.log("data",data,isvalidSchema.error?.errors)
    if (isvalidSchema.success) {
      const result = await MediaService.getPreassingedUrl(
        id,
        data,
        mediaGroupId,
        mediaGroupType
      );
      res.send({ urlArray: result });
      return;
    }
    res.status(401).send("somethign went wrong witht he schema validation ");
  } catch (err) {
    console.log("error at  generating  presigned urls ",err)
    next(err);
  }
};
const handleConfirmUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, mediaGroupId, parentType } = req.body;
    const { id } = req.body.user;

    const safeData = ConfirmMediaUploadSchema.safeParse({
      data,
      mediaGroupId,
      parentType,
    });
  // console.log("safe data",safeData.error?.errors)
    if (safeData.success) {
      const response = await MediaService.confirmMediaUpload({
        data,
        parentType,
        mediaGroupId,
      });
      if (response.success) {
        res.send({ success: true });
      }
    }
  } catch (err) {
    console.log("error at cinfirm upload ",err)
    next(err);
  }
};

mediaRouter.post("/preurl", handleGetPresignedUrl);
mediaRouter.post("/confirm", handleConfirmUpload);
