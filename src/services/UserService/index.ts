import { User } from "@prisma/client";
import { prisma } from "../DBService/client";
import { UpdateUser } from "../../types/types";
export class UserService {
  static async createUser(user: Pick<User, "email" | "salt" | "userName"|"authProvider">) {
    try {
      const newuser = await prisma.user.create({ data: user });
      return newuser;
    } catch (err) {
      console.log("error creating user ", err);
      return null;
    }
  }
static  async deleteUser(id: string) {
    try {
      const newuser = await prisma.user.delete({ where: { id: id } });
      return newuser;
    } catch (err) {
      console.log("error deleting  user ", err);
      return null;
    }
  }

  static async getUser(id: string) {
    try {
      const newuser = await prisma.user.findUnique({
        where: { id: id },
      });
      return newuser;
    } catch (err) {
      console.log("error getting user profile  user ", err);
      return null;
    }
  }

  static async updateUser(id: string, user: UpdateUser) {
    try {
      const newuser = await prisma.user.update({
        where: { id: id },
        data: user,
      });
      return newuser;
    } catch (err) {
      console.log("error updating  user ", err);
      return null;
    }
  }

  static async updateEmail(id: string, email: string) {
    try {
      const user = await prisma.user.update({
        where: { id: id },
        data: { email: email },
      });
      return user;
    } catch (err) {
      console.log("error updating  email ", err);
      return null;
    }
  }
  static async updatePhoneNo(id: string, number: string) {
    try {
      
      const user = await prisma.user.update({
        where: { id: id },
        data: { mobileNo: number },
      });
      return user;
    } catch (err) {
      console.log("error updating  number  ", err);
      return null;
    }
  }
}
