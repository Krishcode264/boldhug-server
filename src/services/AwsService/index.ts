import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-providers";

export class AwsHandler {
  static s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECREAT_ACCESS_KEY || "",
    },
  });

  static async getPresignedUrlFromS3(key: string, type: any) {
    const Command = new PutObjectCommand({
      Bucket: "boldhug",
      Key: key,
      ContentType:type,
    });
    console.log(
      process.env.S3_ACCESS_KEY_ID,
      "access key id now",
      process.env.S3_SECREAT_ACCESS_KEY,
      "secret access key"
    );
    return await getSignedUrl(this.s3Client, Command);
  }

  static async getObjectUrl(key: string, expiresIn: number) {
    const command = new GetObjectCommand({
      Bucket: "boldhug",
      Key: key,
      ResponseContentDisposition: "inline",
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
