import { Role } from "@/enums/role.enum";
import { UserEntity } from "@/user/entity/user.entity";

export const userEntityListMock: UserEntity[] = [
    {
        id: "04a1ab8f-f5ed-45f6-979c-27c80a437d87",
        name: "Jhon Doe",
        email: "jhon@email.com",
        password: "$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6",
        role: Role.User,
    },
    {
        name: "Marry Doe",
        email: "marry@email.com",
        password: "$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6",
        role: Role.User,
    },
    {
        name: "Mike Doe",
        email: "mike@email.com",
        password: "$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6",
        role: Role.User,
    },
];
