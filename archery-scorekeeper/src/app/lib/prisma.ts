import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        user: {
            async create(args: any, next: any) {
                const user = await next(args);
                await prisma.recordsSummary.create({
                    data: {userId: user.id },
                });

                return user;
            },
        },
    },
});

export default prisma;
