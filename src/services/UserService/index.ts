import { User } from "@prisma/client";
import { prisma } from "../DBService/client";
import { BLRT, UpdateUser } from "../../types/types";
import { errReturn, excludeStuff } from "../../util/helper";

export type CreateUserInput = { email?: string; mobileNo?: never } 

export class UserService {

  static async createUser(identifier:string,type:"email"|"mobileNo") {
  
    return await prisma.user.create({
      data: {email:type==="email"?identifier:"",mobileNo:type==="mobileNo"?identifier:"",userName:""}
    });
  }

  static async deleteUser(id: string){
 
      const newuser = await prisma.user.delete({ where: { id: id } });
      return true
    
  }

  static async getUser(id: string) {
   
      const newuser = await prisma.user.findUnique({
        where: { id: id },
        select: excludeStuff(prisma.user.fields, ["salt"]),
      });
      return { success: true, data: newuser };
   
  }

  static async updateUserProfile(id: string, user: UpdateUser) {
  
      const newuser = await prisma.user.update({
        where: { id: id },
        select: excludeStuff(prisma.user.fields, ["salt"]),
        data: user,
      });
      return  newuser
   
  }

  static async updateEmail(id: string, email: string){
    
      const user = await prisma.user.update({
        where: { id: id },
        select: excludeStuff(prisma.user.fields, ["salt"]),
        data: { email: email },
      });
      return user
    
    
  }
  static async updatePhoneNo(id: string, number: string){
    
      const user = await prisma.user.update({
        where: { id: id },
         select: excludeStuff(prisma.user.fields, ["salt"]),
        data: { mobileNo: number },
      });
      return user
    
    }
  
}
