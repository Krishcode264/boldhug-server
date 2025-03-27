import { promise } from "zod";
import { AwsHandler } from "../AwsService";
import { prisma } from "../DBService/client";
import { ParentType } from "@prisma/client";
import { BadRequestError } from "../../util/errors";

export type MediaType = {
  fileName: string;
  type: string;
};

export type ConfirmMediaUplaodType = {
  data: { key: string; type: "video" | "image" | "file" }[];
  mediaGroupId: string;
  parentType: ParentType;
};
export class MediaService {
  static getPreassingedUrl = async (
    userId: string,
    data: MediaType[],
    mediaGroupId: string,
    mediaGroupType: "post" | "event" | "message"
  ) => {
    const preAssignUrlArray = Promise.all(
      data.map(async (data) => {
        let key = `users/${userId}/${mediaGroupType}/${mediaGroupId}/${Date.now()}_${
          data.fileName
        }`;
        const url = await AwsHandler.getPresignedUrlFromS3(key, data.type);
        return { url, key, fileName: data.fileName };
      })
    );
    return preAssignUrlArray;
  };

  static confirmMediaUpload = async ({
    data: files,
    parentType,
    mediaGroupId,
  }: ConfirmMediaUplaodType) => {
    const urlsResponse = await Promise.all(
      files.map(async (media) => {
        const uri = await AwsHandler.getObjectUrl(media.key, 604800); //7 days

        return { url: uri, key: media.key, type: media.type };
      })
    );

    const createdAttachments = await prisma.$transaction(async (tx) => {
      const newExpirationTime = new Date(Date.now() + 604800 * 1000 - 600000);

      const attachments = await tx.attachment.createMany({
        data: files.map((file, index) => ({
          key: file.key,
          type: file.type,
          url: urlsResponse[index].url,
          parentType,
          expiresAt: newExpirationTime,
        })),
      });
      const insertedAttachments = await tx.attachment.findMany({
        where: { key: { in: files.map((media) => media.key) } },
        select: { url: true, id: true, type: true, parentType: true },
      });

      switch (parentType) {
        case "post":
          await tx.eventPost.update({
            where: { id: mediaGroupId },
            data: {
              attachment: {
                connect: insertedAttachments.map((a) => ({ id: a.id })),
              },
            },
          });
          break;
        case "event":
          await tx.event.update({
            where: { id: mediaGroupId },
            data: {
              attachments: {
                connect: insertedAttachments.map((a) => ({ id: a.id })),
              },
            },
          });
          break;
        case "message":
          await tx.message.update({
            where: { id: mediaGroupId },
            data: {
              attachment: {
                connect: insertedAttachments.map((a) => ({ id: a.id })),
              },
            },
          });
          break;
        default:
          throw new BadRequestError(`Unsupported parent type: ${parentType}`);
      }
    });

    return { success: true };
  };
}
