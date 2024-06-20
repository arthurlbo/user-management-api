import { PrismaClient } from "@prisma/client";

import { Role } from "../src/enums/role.enum";

const prisma = new PrismaClient();

const doSeed = async () => {
    // Create initial roles
    await prisma.role.createMany({
        data: [
            {
                id: Role.Admin,
                name: "admin",
            },
            {
                id: Role.User,
                name: "user",
            },
        ],
    });
};

doSeed()
    .then(() => {
        console.log("✅ Seeded database");
    })
    .catch((e) => {
        console.log(e);
    });
