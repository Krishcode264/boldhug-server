import { User } from "@prisma/client";
import { prisma } from "../DBService/client";
import { BLRT, UpdateUser } from "../../types/types";
import { errReturn, excludeStuff } from "../../util/helper";
import { BadRequestError } from "../../util/errors";

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
    let start=Date.now()
      const newuser = await prisma.user.findUnique({
        where: { id: id }
      });
      if(!newuser){
        throw new BadRequestError("user does not exists","USER_DOESNT_EXISTS")
      }
      let end=Date.now()
      console.log("Query time",end-start)
      return { success: true, data: newuser };
   
  }

  static async updateUserProfile(id: string, user: UpdateUser) {
      const u= await this.getUser(id)
      console.log(u,"user is here ")
      const newuser = await prisma.user.update({
        where: { id: id },
        data: user,
        select:{userName:true,profilePhoto:true,gender:true,age:true,mobileNo:true,email:true,intrests:true}
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
