import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { errReturn } from "../../util/helper";
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
      return { success: true };
    } catch (err) {
      console.log("error sending an email there ", err);
      return { success: false, error: errReturn(err, "Error sending email ") };
    }
  }
}
