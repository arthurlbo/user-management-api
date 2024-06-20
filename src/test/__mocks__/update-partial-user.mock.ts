import { Role } from "@/enums/role.enum";

import { UserUpdatePartialDTO } from "@/user/dto/user-update-partial.dto";

export const updatePartialUserMock: UserUpdatePartialDTO = {
    role: Role.Admin,
};
