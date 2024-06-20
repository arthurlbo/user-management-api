import { Role } from "@/enums/role.enum";

import { UserCreateDTO } from "@/user/dto/user-create.dto";

export const createUserMock: UserCreateDTO = {
    name: "Marvin Doe",
    email: "marvin@email.com",
    password: "$2b$10$gwOs3fRIwbHfcpzw7HfiZePfGG4e0zePamDdOAn6ucCXVrEkydBbC",
    role: Role.User,
};
