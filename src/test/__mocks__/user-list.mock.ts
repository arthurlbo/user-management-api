import { Role } from "@/enums/role.enum";

import { User } from "@prisma/client";

export const userListMock: User[] = [
    {
        id: "04a1ab8f-f5ed-45f6-979c-27c80a437d87",
        name: "Jhon Doe",
        email: "jhon@email.com",
        password: "$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6",
        role: Role.User,
        birthDate: null,
        createdAt: null,
        updatedAt: null,
    },
    {
        id: "04a1aa14-f5ed-45f6-979c-32c30a439b12",
        name: "Marry Doe",
        email: "marry@email.com",
        password: "$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6",
        role: Role.User,
        birthDate: null,
        createdAt: null,
        updatedAt: null,
    },
    {
        id: "04423av4-x5ed-46f6-129d-32h30v439d29",
        name: "Mike Doe",
        email: "mike@email.com",
        password: "$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6",
        role: Role.User,
        birthDate: null,
        createdAt: null,
        updatedAt: null,
    },
];
