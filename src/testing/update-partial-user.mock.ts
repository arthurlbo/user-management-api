import { Role } from "@/enums/role.enum";
import { UpdatePartialUserDTO } from "@/user/dto/update-partial-user.dto";

export const updatePartialUserMock: UpdatePartialUserDTO = {
    role: Role.Admin,
};
