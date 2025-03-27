import { AuthProvider, User } from "@prisma/client";
import { prisma } from "../DBService/client";
import { getCache, redis } from "../../util/redisClient";
import { MailService } from "../MailService";
import { SMSService } from "../SMSService";
import { optional } from "zod";
import { errReturn } from "../../util/helper";
import { BLRT, OtpEntry } from "../../types/types";
import { UserService } from "../UserService";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import {
  AutherizationError,
  BadRequestError,
  BaseError,
  ConflictError,
  InternalServerError,
} from "../../util/errors";

export class AuthService {
  static async createAccount() {}
  static async signup(identifier: string) {
    const otpEntry = await getCache<OtpEntry | null>(identifier);
    const alreadyExistedUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { mobileNo: identifier }],
      },

      select: {
        id: true,
        email: true,
        mobileNo: true,
        userName: true,
        role: true,
        age: true,
        gender:true,
        profilePhoto: {
          select: {
            id:true,
            url: true,
          },
        },
      },
    });

    if (!otpEntry || !otpEntry.isVarified) {
      throw new BadRequestError(
        "OPT is not verified try again",
        "OTP_NOT_VERIFIED"
      );
    }

    if (alreadyExistedUser) {
      const accessToken = this.createJwtToken({
        id: alreadyExistedUser.id,
        role: alreadyExistedUser.role,
      });
      const refreshToken = this.createrefreshToken({
        id: alreadyExistedUser.id,
        role: alreadyExistedUser.role,
      });
      return {
        user: { ...alreadyExistedUser, isExistingUser: true },
        accessToken,
        refreshToken,
      };
    }

    const isEmail = z.string().email().safeParse(identifier);
    const isPhoneNumber = z
      .number()
      .min(12)
      .safeParse(Number(identifier.split("+")[1]));

    const newuser = await UserService.createUser(
      identifier,
      isEmail.success ? "email" : "mobileNo"
    );
    const accessToken = this.createJwtToken({
      id: newuser.id,
      role: newuser.role,
    });
    const refreshToken = this.createrefreshToken({
      id: newuser.id,
      role: newuser.role,
    });

    return {
      accessToken,
      refreshToken,
      user: newuser,
    };
  }

  static async login(identifier: string) {
    const isVerified = await getCache<OtpEntry>(identifier);

    if (!isVerified || !isVerified?.isVarified) {
      throw new BadRequestError(
        "OTP need to be varified first",
        "OTP_VERIFICATION_NEEDED"
      );
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ mobileNo: identifier }, { email: identifier }] },
    });

    if (!user) {
      throw new BadRequestError(
        "user with Mobile Number does not exist",
        "USER_DOESNT_EXIST"
      );
    }
    const accessToken = this.createJwtToken({
      id: user.id,
      role: user.role,
    });
    const refreshToken = this.createrefreshToken({
      id: user.id,
      role: user.role,
    });
    return { user, refreshToken, accessToken };
  }

  static async generateOTP(
    identifier: string,
    provider: "email" | "phoneNumber"
  ) {
    const otp = await getCache<OtpEntry>(identifier);

    if (!otp) {
      const OTP = Math.floor(100000 + Math.random() * 900000); //6 digit
      await redis.set(
        identifier,
        JSON.stringify({ otp: OTP, isVerified: false }),
        "EX",
        330
      );
    }
    let latestOtp = await getCache<OtpEntry | null>(identifier);

    if (!latestOtp) {
      throw new InternalServerError(
        "otp has not generated ",
        "OTP_GENERATION_ERROR"
      );
    }

    if (provider === "email") {
      await MailService.sendEmail(
        identifier,
        `your One time password is  ${latestOtp.otp}`,
        `Your one time password is ${latestOtp.otp} , it will be valid for 5 min  😊😘 `
      );
      return true;
    }
    if (provider === "phoneNumber") {
      await SMSService.sendSms(
        identifier,
        `your one time password is ${latestOtp.otp} , it will be valid for 5 min 😊💕😘`
      );
      return true;
    }
  }

  static async verifyOtp(otp: number, identifier: string) {
    const otpentry = await getCache<OtpEntry | null>(identifier);

    if (!otpentry || otpentry.otp !== otp) {
      throw new ConflictError(
        "OTP isnt correct or havent generated before",
        "OTP MISMATCH"
      );
    }
    otpentry.isVarified = true;
    await redis.set(identifier, JSON.stringify(otpentry), "KEEPTTL");
    return true;
  }

  static createJwtToken(data: any) {
    return jwt.sign(data, process.env.JWT_SECRET as string, {
      expiresIn: "15d",
    });
  }

  static createrefreshToken(data: any) {
    return jwt.sign(data, process.env.REFRESH_TOKEN as string, {
      expiresIn: "15d",
    });
  }

  static refreshToken(refreshtoken: string) {
    const payload = jwt.verify(
      refreshtoken,
      process.env.REFRESH_TOKEN as string
    ) as JwtPayload;
    if (!payload) {
      throw new BadRequestError(
        "refresh token expired need to login again",
        "EXPIRED_RESFRESH_TOKEN"
      );
    }

    const accessToken = this.createJwtToken({
      id: payload.id,
      role: payload.role,
      authProvider: payload.authProvider,
    });
    const refreshToken = this.createrefreshToken({
      id: payload.id,
      role: payload.role,
      authProvider: payload.authProvider,
    });

    if (accessToken && refreshToken) {
      return {
        accessToken,
        refreshToken,
      };
    }

    return new BadRequestError(
      "access token cant be generated,login ",
      "ACCESS_TOKEN_GENERATION_ERROR"
    );
  }

  static verifyJwtToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);
      return payload;
    } catch (err) {
      throw new AutherizationError(
        " you token has expired need login",
        "TOKEN_EXPIRED"
      );
    }
  }
}
