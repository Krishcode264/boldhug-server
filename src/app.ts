import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./services/DBService/client";
import { MailService } from "./services/MailService";
import { SMSService } from "./services/SMSService";
import { AuthService } from "./services/AuthService";

dotenv.config();
const app = express();


app.use(cors({ origin: [process.env.CLIENT_MOBILE_URL as string] }));

app.get("/", async (req, res) => {
    console.log("getting  req");
       await AuthService.generateOTP("krishnazade99@gmail.com","credential")
       await AuthService.generateOTP("+919552386818","phoneNumber")
    res.send("hey you are here ");
  });
app.listen(8080, () => {
  console.log("server started here on 8080 ");
});
