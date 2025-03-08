import { Twilio } from "twilio";
import dotenv from "dotenv";
import { BLRT } from "../../types/types";
import { InternalServerError } from "../../util/errors";
dotenv.config();
export class SMSService {
  static client = new Twilio(
    process.env.TWILLO_SID as string,
    process.env.TWILLO_AUTH_TOKEN as string
  );

  static async sendSms(phoneNumber: string, body: string) {
    try {
      const res = await this.client.messages.create({
        from: process.env.HOST_SMS_NO,
        body,
        to: phoneNumber,
      });
      return true;
    } catch (err) {
      throw new InternalServerError(
        "SMS service failed to send SMS",
        "SMS_SERVICE_ERROR"
      );
    }
  }
}
