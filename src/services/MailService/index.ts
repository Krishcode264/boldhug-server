import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { errReturn } from "../../util/helper";
import { BLRT } from "../../types/types";
import { InternalServerError } from "../../util/errors";
dotenv.config();
export class MailService {
  static transporter = nodemailer.createTransport({
    service: "gmail",
    port: 456,
    secure: true,
    auth: {
      user: process.env.MAIL_HOST,
      pass: process.env.MAIL_PASS,
    },
  });

  static async sendEmail(email: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_HOST,
        to: email,
        subject,
        text,
      });
      return true;
    } catch (err) {
      throw new InternalServerError(
        "Error Sending Email",
        "MAIL_SERVICE_ERROR"
      );
    }
  }
}
