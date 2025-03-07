import { AuthProvider, User } from "@prisma/client";
import { prisma } from "../DBService/client";
import { getCache, redis } from "../../util/redisClient";
import { MailService } from "../MailService";
import { SMSService } from "../SMSService";
import { optional } from "zod";
import { errReturn } from "../../util/helper";
import { OtpEntry } from "../../types/types";
import { UserService } from "../UserService";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
export class AuthService {
  static async signup(signupPayload: {
    identifier: string;
    password?: string;
    userName: string;
    authProvider: "credential" | "phoneNumber";
  }) {
    try {
      const optEntry = await getCache<OtpEntry | null>(
        signupPayload.identifier
      );
      const alreadyExistedUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: signupPayload.identifier },
            { mobileNo: signupPayload.identifier },
          ],
        },
      });
      if (alreadyExistedUser) {
        return {
          success: false,
          error: "User with Email/MobileNumber  alredy exists , try login",
        };
      }

      if (optEntry && optEntry.isVarified) {
        if (signupPayload.authProvider === "credential") {
          const hashedPassword = await bcrypt.hash(signupPayload.password!, 10);
          const newuser = await prisma.user.create({
            data: {
              email: signupPayload.identifier,
              userName: signupPayload.userName,
              salt: hashedPassword,
              authProvider: "credential",
            },
            select: {
              id: true,
              email: true,
              userName: true,
              authProvider: true,
              role: true,
            },
          });
          const accessToken = this.createJwtToken({
            id: newuser.id,
            email: newuser.email,
            authprovider: newuser.authProvider,
            role: newuser.role,
          });
          const refreshToken = this.createrefreshToken({
            id: newuser.id,
            role: newuser.role,
          });

          return {
            data: { accessToken, refreshToken, user: newuser },
            success: true,
          };
        }
        if (signupPayload.authProvider === "phoneNumber") {
          const newuser = await prisma.user.create({
            data: {
              mobileNo: signupPayload.identifier,
              userName: signupPayload.userName,
              authProvider: "phoneNumber",
            },
            select: {
              id: true,
              mobileNo: true,
              userName: true,
              authProvider: true,
              role: true,
            },
          });
          const accessToken = this.createJwtToken({
            id: newuser.id,
            authprovider: newuser.authProvider,
            role: newuser.role,
          });
          const refreshToken = this.createrefreshToken({
            id: newuser.id,
            role: newuser.role,
            authProvider: newuser.authProvider,
          });

          return {
            data: { user: newuser, accessToken, refreshToken },
            success: true,
          };
        }
      }
      return {
        success: false,
        error:
          "Email/mobile number is not verified , need to verify it before ",
      };
    } catch (err) {
      console.log("error signing up ", err);
      return { success: false, error: errReturn(err, "error signing up") };
    }
  }

  static async generateOTP(
    identifier: string,
    provider: "credential" | "phoneNumber"
  ) {
    try {
      const otp = await getCache<OtpEntry>(identifier);

      if (!otp.otp) {
        const OTP = Math.floor(Math.random() * 1000000); //6 digit
        await redis.set(
          identifier,
          JSON.stringify({ otp: OTP, isVerified: false }),
          "EX",
          330
        );
      }
      let latestOtp = await getCache<OtpEntry | null>(identifier);
      if (latestOtp) {
        if (provider === "credential") {
          await MailService.sendEmail(
            identifier,
            `your password for Auth is ${latestOtp.otp}`,
            `Your one time password is ${latestOtp.otp} , it will be valid for 5 min  😊😘 `
          );
          return { success: true };
        }
        if (provider === "phoneNumber") {
          await SMSService.sendSms(
            identifier,
            `your one time password is ${latestOtp.otp} , it will be valid for 5 min 😊💕😘`
          );
          return { success: true };
        }
      }

      return {
        success: false,
        error: "Latest OTP was not found in REDIS try again  ",
      };
    } catch (err) {
      console.log("error generating OTP ", err);
      return {
        success: false,
        error: errReturn(err, "Error while Generating OTP"),
      };
    }
  }

  static async verifyOtp(otp: number, identifier: string) {
    try {
      const otpentry = await getCache<OtpEntry | null>(identifier);
      if (otpentry && otpentry.otp === otp) {
        otpentry.isVarified = true;
        await redis.set(identifier, JSON.stringify(otpentry), "KEEPTTL");
        return { success: true };
      }
      return { success: false, error: "Incorrect OTP  " };
    } catch (err) {
      console.log("error verifying  OTP ", err);
      return {
        success: false,
        error: errReturn(err, "issue at OTP verification"),
      };
    }
  }

  static createJwtToken(data: any) {
    return jwt.sign(data, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });
  }

  static createrefreshToken(data: any) {
    return jwt.sign(data, process.env.REFRESH_TOKEN as string, {
      expiresIn: "15d",
    });
  }

  static refreshToken(refreshtoken: string) {
    try {
      const payload = jwt.verify(
        refreshtoken,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const accessToken = this.createJwtToken({
        id: payload.id,
        role: payload.role,
        authProvider:payload.authProvider
      });
      const refreshToken = this.createrefreshToken({
        id: payload.id,
        role: payload.role,
        authProvider:payload.authProvider
      });

      if (accessToken&& refreshToken) {
        return {
          accessToken,
          refreshToken,
          success: true,
        };
      }
      return { success: false, error: "access token cant be generated " };
    } catch (err) {
      console.log("error refreshsing token ");
      return { success: false, error: "error refreshing the token " };
    }
  }

  static verifyJwtToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);
      return payload;
    } catch (err) {
      return null;
    }
  }
}
