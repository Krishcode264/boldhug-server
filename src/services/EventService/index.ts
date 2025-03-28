import { Event } from "@prisma/client";
import { errReturn } from "../../util/helper";
import { prisma } from "../DBService/client";
import { EventType } from "../../util/zod";

export class EventService {

  static async getEventDetails(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }

  static async getEventsUserPaticipating(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }

  static async updateEvent(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }

  static async deleteEvent(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }

  static async createEvent(e:EventType) {
    const event=await prisma.event.create({data:{...e},select:{id:true}})

     return event
  }

  static async requestEventParticipation(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }
  static async revokeEventParticipation(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }

  static async approveEventParticipation(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }


  static async nominateEventAdmin(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }
  static async searchEvent(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }
  static async sendEventInvite(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }
  static async acceptEventInvite(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }
  static async declineEventInvite(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }

  static async cancelEvent(id:string) {
    const event=await prisma.event.findUnique({where:{id:id}})
    try {
        return {success:true,data:event}
    } catch (err) {
      return { success: false, error: errReturn(err, "error with ") };
    }
  }
}
