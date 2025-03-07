import { Twilio } from "twilio";
import dotenv from "dotenv"
dotenv.config()
export class SMSService {
  static client = new Twilio(
    process.env.TWILLO_SID as string,
    process.env.TWILLO_AUTH_TOKEN as string
  );

  static async sendSms(phoneNumber: string, body: string) {
    try {
      const res = await this.client.messages.create({
        from:process.env.HOST_SMS_NO,
        body,
        to:phoneNumber,
      });
      return res 
    } catch (err) {
      console.log("err sending sms ", err);
      return null
    }
  }
}
