import { PrismaClient } from "@prisma/client";
export const prisma=new PrismaClient()
async function main() {
    await prisma.$connect();
    console.log("connected db") // Keep connection open
  }
  
  main();