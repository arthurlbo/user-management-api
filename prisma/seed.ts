/* eslint-disable @typescript-eslint/no-var-requires */

import { PrismaClient } from "@prisma/client";

let Role;

if (process.env.NODE_ENV === "production") {
    Role = require("../dist/src/common/enums/role.enum").Role;
} else {
    Role = require("../src/common/enums/role.enum").Role;
}

const prisma = new PrismaClient();

const doSeed = async () => {
    const roles = await prisma.role.findMany();

    if (roles.length === 0) {
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
    }
};

doSeed()
    .then(() => {
        console.log("✅ Seeded database");
    })
    .catch((e) => {
        console.log(e);
    });
