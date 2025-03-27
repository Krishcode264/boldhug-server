import { NextFunction, Router, Request, Response } from "express";
import { EventService } from "../services/EventService";
import { EventSchema } from "../util/zod";
import { BadRequestError } from "../util/errors";
export const eventRouter = Router();

export const handleCreateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { event } = req.body;
    const { id } = req.body.user;
   // console.log("event",event)
    const safeParseEvent = EventSchema.safeParse({ ...event, createdBy: id });
         console.log(safeParseEvent.error?.errors)
    if (safeParseEvent.success) {
      const createdEvent = await EventService.createEvent(safeParseEvent.data);
      res.send({ success: true, event: createdEvent });
      return;
    }
    
  } catch (err) {
    console.log("error at create evnt",err)
    next(err);
  }
};

eventRouter.post("/", handleCreateEvent);
