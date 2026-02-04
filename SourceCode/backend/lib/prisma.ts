import { PrismaClient } from "@prisma/client";

declare global {

    var _prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!globalThis._prisma) {
        globalThis._prisma = new PrismaClient();
    }
    prisma = globalThis._prisma;
}

export default prisma;
