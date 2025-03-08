import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./services/DBService/client";
import { MailService } from "./services/MailService";
import { SMSService } from "./services/SMSService";
import { AuthService } from "./services/AuthService";
import { excludeStuff } from "./util/helper";
import { authRouter } from "./routers/authRouter";
import { userRouter } from "./routers/userRouter";
import { eventRouter } from "./routers/eventRouter";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({ origin: [process.env.CLIENT_MOBILE_URL as string] }));

app.get("/", async (req, res) => {
  console.log("getting  req");
  await AuthService.generateOTP("krishnazade99@gmail.com", "email");
  await AuthService.generateOTP("+919552386818", "phoneNumber");
  res.send("hey you are here ");
});

app.use("/auth", authRouter);
app.use("/user", authMiddleware, userRouter);
app.use("/event", eventRouter);

app.use(errorHandler);
app.listen(8080, () => {
  console.log("server started here on 8080 ");
});
