import express, { json, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./services/DBService/client";
import { MailService } from "./services/MailService";
import { SMSService } from "./services/SMSService";
import { AuthService } from "./services/AuthService";
import { excludeStuff } from "./util/helper";
import { authRouter } from "./api/auth";
import { userRouter } from "./api/user";
import { eventRouter } from "./api/event";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorHandler";
import { mediaRouter } from "./api/media";

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({ origin: [process.env.CLIENT_MOBILE_URL as string] }));

app.get("/", async (req, res) => {
  console.log("getting  req");

  res.send("hey you are here   ");
});
// app.post("/yt",async(req:Request,res:Response)=>{
// return res.send("gey")
// })

app.use("/auth", authRouter);
app.use("/user", authMiddleware, userRouter);
app.use("/event",authMiddleware, eventRouter);
app.use("/media",authMiddleware,mediaRouter)
 app.use(errorHandler);
app.listen(8080, () => {
  console.log("server started here on 8080 8080");
});
