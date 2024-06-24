import { Role } from "@/enums/role.enum";
import { CreateUserDTO } from "@/user/dto/create-user.dto";

export const createUserMock: CreateUserDTO = {
    name: "Marvin Doe",
    email: "marvin@email.com",
    password: "$2b$10$gwOs3fRIwbHfcpzw7HfiZePfGG4e0zePamDdOAn6ucCXVrEkydBbC",
    role: Role.User,
};
